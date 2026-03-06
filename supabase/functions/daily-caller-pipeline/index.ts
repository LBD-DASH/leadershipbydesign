import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY");
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const supabase = createClient(supabaseUrl, serviceKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // 1. Pick the next active industry from prospecting_config (round-robin by last_run_at)
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

    // 2. Search Apollo for 20 contacts
    if (!apolloApiKey) throw new Error("APOLLO_API_KEY not configured");

    const apolloBody = {
      page: 1,
      per_page: 20,
      person_titles: ["Head of HR", "People Director", "L&D Manager", "Talent Lead", "HR Director", "HR Manager", "Chief People Officer"],
      person_locations: [location, "South Africa"],
      organization_num_employees_ranges: ["201-500"],
      q_keywords: industry,
    };

    console.log("Searching Apollo...", JSON.stringify(apolloBody));

    const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
      body: JSON.stringify(apolloBody),
    });

    if (!apolloRes.ok) {
      const errText = await apolloRes.text();
      throw new Error(`Apollo API error [${apolloRes.status}]: ${errText}`);
    }

    const apolloData = await apolloRes.json();
    const people = (apolloData.people || []).map((p: any) => ({
      first_name: p.first_name || "",
      last_name: p.last_name || "",
      title: p.title || "",
      email: p.email || "",
      phone: p.phone_numbers?.[0]?.sanitized_number || "",
      company: p.organization?.name || "",
      linkedin_url: p.linkedin_url || "",
    }));

    console.log(`Apollo returned ${people.length} contacts`);

    if (people.length === 0) {
      // Mark config as run anyway
      await supabase.from("prospecting_config").update({ last_run_at: new Date().toISOString() }).eq("id", config.id);
      await notifySlack(supabaseUrl, anonKey, 0, 0, industry, "No contacts found in Apollo");
      return new Response(JSON.stringify({ success: true, found: 0, industry }), { headers });
    }

    // 3. Deduplicate against existing call list (by email)
    const emails = people.filter((p: any) => p.email).map((p: any) => p.email.toLowerCase());
    const { data: existing } = await supabase
      .from("call_list_prospects")
      .select("email")
      .in("email", emails);

    const existingEmails = new Set((existing || []).map((e: any) => e.email?.toLowerCase()));
    const newPeople = people.filter((p: any) => !existingEmails.has(p.email?.toLowerCase()));

    console.log(`${newPeople.length} new contacts after dedup (${existingEmails.size} already exist)`);

    // 4. Scrape phone numbers for contacts missing them
    let phonesFound = 0;
    if (firecrawlKey) {
      const needPhones = newPeople.filter((p: any) => !p.phone && p.company);
      if (needPhones.length > 0) {
        console.log(`Scraping phones for ${needPhones.length} contacts...`);
        for (const person of needPhones.slice(0, 10)) {
          try {
            const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${firecrawlKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `${person.company} South Africa phone number contact`,
                limit: 3,
                scrapeOptions: { formats: ["markdown"] },
              }),
            });

            if (searchRes.ok) {
              const searchData = await searchRes.json();
              const pages = searchData.data || [];
              for (const page of pages) {
                const content = page.markdown || page.description || "";
                const phoneMatch = content.match(/(?:\+27|0)\s?\d{2}\s?\d{3}\s?\d{4}/) ||
                  content.match(/(?:\+\d{1,3})[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}/);
                if (phoneMatch) {
                  person.phone = phoneMatch[0].replace(/[\s-]/g, "").trim();
                  phonesFound++;
                  break;
                }
              }
            }
            // Rate limit
            await new Promise(r => setTimeout(r, 800));
          } catch (err) {
            console.error(`Phone scrape error for ${person.company}:`, err);
          }
        }
        console.log(`Scraped ${phonesFound} phone numbers`);
      }
    }

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

    // 6. Update last_run_at on the config
    await supabase
      .from("prospecting_config")
      .update({ last_run_at: new Date().toISOString() })
      .eq("id", config.id);

    // 7. Send Slack notification
    const withPhones = newPeople.filter((p: any) => p.phone).length;
    await notifySlack(supabaseUrl, anonKey, newPeople.length, withPhones, industry, null);

    return new Response(JSON.stringify({
      success: true,
      industry,
      apolloResults: people.length,
      newProspects: newPeople.length,
      phonesScraped: phonesFound,
      withPhones,
    }), { headers });

  } catch (error: any) {
    console.error("Pipeline error:", error);

    // Notify Slack of failure
    try {
      await notifySlack(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, 0, 0, "unknown", error.message);
    } catch (_) {}

    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
});

async function notifySlack(
  supabaseUrl: string,
  anonKey: string,
  added: number,
  withPhones: number,
  industry: string,
  errorMsg: string | null,
) {
  try {
    const isError = !!errorMsg;
    const payload = isError
      ? {
          eventType: "system_error",
          data: {
            function: "daily-caller-pipeline",
            error: errorMsg,
          },
        }
      : {
          eventType: "daily_pipeline_complete",
          channel: "mission-control",
          data: {
            added,
            withPhones,
            industry,
          },
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
