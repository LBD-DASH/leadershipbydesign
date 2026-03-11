import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function enrichPerson(apolloApiKey: string, person: any): Promise<{ email: string | null; phone: string | null }> {
  try {
    const enrichBody: Record<string, any> = {
      reveal_personal_emails: true,
      reveal_phone_number: true,
    };

    if (person.id) {
      enrichBody.id = person.id;
    } else {
      if (person.first_name) enrichBody.first_name = person.first_name;
      if (person.last_name) enrichBody.last_name = person.last_name;
      if (person.linkedin_url) enrichBody.linkedin_url = person.linkedin_url;
      // Try to extract domain from company
      if (person.organization?.primary_domain) {
        enrichBody.domain = person.organization.primary_domain;
      } else if (person.organization?.website_url) {
        try {
          enrichBody.domain = new URL(person.organization.website_url).hostname.replace("www.", "");
        } catch { /* skip */ }
      }
    }

    const res = await fetch("https://api.apollo.io/api/v1/people/match", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
      body: JSON.stringify(enrichBody),
    });

    if (!res.ok) return { email: null, phone: null };

    const data = await res.json();
    const match = data.person;
    if (!match) return { email: null, phone: null };

    const email = (match.email || match.personal_emails?.[0] || "").toLowerCase().trim() || null;
    const phone = match.phone_numbers?.[0]?.sanitized_number || null;
    return { email, phone };
  } catch {
    return { email: null, phone: null };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY");
  const supabase = createClient(supabaseUrl, serviceKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // 1. Pick the next active industry from prospecting_config
    const { data: configs, error: cfgErr } = await supabase
      .from("prospecting_config")
      .select("*")
      .eq("is_active", true)
      .order("last_run_at", { ascending: true, nullsFirst: true })
      .limit(1);

    if (cfgErr) throw cfgErr;
    if (!configs || configs.length === 0) {
      return new Response(JSON.stringify({ skipped: true, reason: "No active prospecting configs" }), { headers });
    }

    const config = configs[0];
    const industry = config.industry;
    const location = config.location || "Gauteng";
    console.log(`🏭 Pipeline running for: ${industry} in ${location}`);

    // 2. Search Apollo for contacts
    if (!apolloApiKey) throw new Error("APOLLO_API_KEY not configured");

    const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
      body: JSON.stringify({
        page: 1,
        per_page: 20,
        person_titles: ["Head of HR", "People Director", "L&D Manager", "Talent Lead", "HR Director", "HR Manager", "Chief People Officer"],
        person_locations: [location, "South Africa"],
        organization_num_employees_ranges: ["201-500"],
        q_keywords: industry,
      }),
    });

    if (!apolloRes.ok) {
      const errText = await apolloRes.text();
      throw new Error(`Apollo API error [${apolloRes.status}]: ${errText}`);
    }

    const apolloData = await apolloRes.json();
    const rawPeople = apolloData.people || [];
    console.log(`Apollo returned ${rawPeople.length} contacts`);

    if (rawPeople.length === 0) {
      await supabase.from("prospecting_config").update({ last_run_at: new Date().toISOString() }).eq("id", config.id);
      await notifySlack(supabaseUrl, anonKey, 0, 0, 0, industry, "No contacts found in Apollo");
      return new Response(JSON.stringify({ success: true, found: 0, industry }), { headers });
    }

    // 3. Enrich contacts to get emails
    const people = [];
    let enrichedCount = 0;
    for (const p of rawPeople) {
      const person: any = {
        first_name: p.first_name || "",
        last_name: p.last_name || "",
        title: p.title || "",
        email: (p.email || "").toLowerCase().trim(),
        phone: p.phone_numbers?.[0]?.sanitized_number || "",
        company: p.organization?.name || "",
        linkedin_url: p.linkedin_url || "",
      };

      // If no email from search, enrich to reveal it
      if (!person.email) {
        console.log(`  🔍 Enriching ${person.first_name} ${person.last_name}...`);
        const enriched = await enrichPerson(apolloApiKey, p);
        if (enriched.email) {
          person.email = enriched.email;
          enrichedCount++;
          console.log(`  📧 Revealed: ${enriched.email}`);
        }
        if (enriched.phone && !person.phone) {
          person.phone = enriched.phone;
        }
        await new Promise(r => setTimeout(r, 400));
      }

      // Only add contacts with emails
      if (person.email) {
        people.push(person);
      }
    }

    console.log(`${people.length} contacts with emails (${enrichedCount} enriched)`);

    // 4. Deduplicate against existing call list
    const emails = people.filter((p: any) => p.email).map((p: any) => p.email.toLowerCase());
    const { data: existingByEmail } = await supabase
      .from("call_list_prospects")
      .select("email, first_name, company")
      .in("email", emails.length > 0 ? emails : ["__none__"]);

    const existingEmails = new Set((existingByEmail || []).map((e: any) => e.email?.toLowerCase()));

    const newPeople = people.filter((p: any) => {
      const email = (p.email || "").toLowerCase();
      if (email && existingEmails.has(email)) return false;
      return true;
    });

    console.log(`${newPeople.length} new contacts after dedup`);

    // 5. Insert into call_list_prospects
    if (newPeople.length > 0) {
      const batchId = `auto-${industry.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`;
      const rows = newPeople.map((p: any) => ({
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email?.toLowerCase() || "",
        company: p.company,
        phone: p.phone || "",
        title: p.title,
        status: "pending",
        batch_id: batchId,
        source: "auto-pipeline",
        uploaded_by: "daily-pipeline",
      }));

      const { data: inserted, error: insertErr } = await supabase
        .from("call_list_prospects")
        .insert(rows)
        .select();

      if (insertErr) throw insertErr;
      console.log(`✅ Inserted ${inserted?.length || 0} prospects into call list`);
    }

    // 6. Update last_run_at
    await supabase.from("prospecting_config").update({ last_run_at: new Date().toISOString() }).eq("id", config.id);

    // 7. Slack notification
    const withPhones = newPeople.filter((p: any) => p.phone).length;
    await notifySlack(supabaseUrl, anonKey, newPeople.length, withPhones, enrichedCount, industry, null);

    return new Response(JSON.stringify({
      success: true,
      industry,
      apolloResults: rawPeople.length,
      enrichedEmails: enrichedCount,
      newProspects: newPeople.length,
      withPhones,
    }), { headers });

  } catch (error: any) {
    console.error("Pipeline error:", error);
    try {
      await notifySlack(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, 0, 0, 0, "unknown", error.message);
    } catch (_) {}
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
});

async function notifySlack(
  supabaseUrl: string,
  anonKey: string,
  added: number,
  withPhones: number,
  enrichedEmails: number,
  industry: string,
  errorMsg: string | null,
) {
  try {
    const payload = errorMsg
      ? {
          eventType: "system_error",
          data: { function: "daily-caller-pipeline", error: errorMsg },
        }
      : {
          eventType: "daily_pipeline_complete",
          channel: "mission-control",
          data: { added, withPhones, enrichedEmails, industry },
        };

    await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Slack notify failed:", e);
  }
}
