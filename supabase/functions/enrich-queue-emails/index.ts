import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  if (!apolloApiKey) {
    return new Response(JSON.stringify({ error: "APOLLO_API_KEY not configured" }), { status: 500, headers });
  }

  try {
    // Step 1: Clean no-email records
    const { data: noEmail } = await supabase
      .from("warm_outreach_queue")
      .select("id")
      .or("contact_email.is.null,contact_email.eq.");

    if (noEmail && noEmail.length > 0) {
      for (let i = 0; i < noEmail.length; i += 50) {
        await supabase.from("warm_outreach_queue").delete().in("id", noEmail.slice(i, i + 50).map((r: any) => r.id));
      }
      console.log(`🗑️ Cleaned ${noEmail.length} no-email records`);
    }

    // Step 2: Load existing emails for dedup
    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email")
      .not("contact_email", "is", null);
    const existingEmails = new Set((existingRows || []).map((r: any) => r.contact_email?.toLowerCase().trim()));

    // Step 3: Search Apollo with simple keywords (one industry at a time)
    const industries = ["Manufacturing", "Technology", "Healthcare", "Retail", "Construction", "Logistics", "Legal", "Accounting", "Hospitality"];
    let totalAdded = 0;
    let totalEnriched = 0;
    let totalSearched = 0;

    for (const industry of industries) {
      if (totalAdded >= 30) break;

      console.log(`📡 Searching: ${industry}...`);
      const searchRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
        body: JSON.stringify({
          page: 1,
          per_page: 15,
          person_titles: ["HR Director", "HR Manager", "Head of People", "Chief People Officer", "L&D Manager", "Talent Director"],
          person_locations: ["South Africa"],
          organization_num_employees_ranges: ["1-10", "11-20", "21-50", "51-100", "101-200", "201-500"],
          q_keywords: industry,
        }),
      });

      if (!searchRes.ok) {
        const errText = await searchRes.text();
        console.error(`Search error for ${industry}: ${searchRes.status} - ${errText}`);
        continue;
      }

      const searchData = await searchRes.json();
      const people = searchData.people || [];
      totalSearched += people.length;
      console.log(`  Found ${people.length} contacts for ${industry}`);

      for (const p of people) {
        if (totalAdded >= 30) break;

        let email = (p.email || "").toLowerCase().trim();
        const apolloId = p.id;
        const firstName = p.first_name || "";
        const lastName = p.last_name || "";
        const company = p.organization?.name || "";
        const title = p.title || "";

        // Try enrichment if no email
        if (!email || !email.includes("@")) {
          if (!apolloId) { continue; }

          console.log(`  🔍 Enriching ${firstName} ${lastName} (ID: ${apolloId})...`);
          try {
            const enrichRes = await fetch("https://api.apollo.io/api/v1/people/match", {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
              body: JSON.stringify({ id: apolloId, reveal_personal_emails: true }),
            });

            if (enrichRes.ok) {
              const enrichData = await enrichRes.json();
              const match = enrichData.person;
              if (match) {
                email = (match.email || match.personal_emails?.[0] || "").toLowerCase().trim();
                if (email && email.includes("@")) {
                  totalEnriched++;
                  console.log(`  📧 Got email: ${email}`);
                } else {
                  console.log(`  ⚠️ Enriched but no email for ${firstName}`);
                  email = "";
                }
              }
            } else {
              const errBody = await enrichRes.text();
              console.error(`  Enrich error: ${enrichRes.status} - ${errBody}`);
            }
          } catch (err) {
            console.error(`  Enrich exception: ${err}`);
          }
          await new Promise(r => setTimeout(r, 400));
        }

        if (!email || !email.includes("@")) continue;

        // Quality checks
        const prefix = email.split("@")[0];
        const blocked = ["info", "admin", "support", "hello", "contact", "sales", "hr", "careers", "reception", "office", "noreply", "no-reply"];
        if (blocked.includes(prefix)) continue;
        if (email.includes("kevin@") || email.includes("leadershipbydesign")) continue;
        if (existingEmails.has(email)) continue;

        const { error } = await supabase.from("warm_outreach_queue").insert({
          company_name: company,
          company_website: p.organization?.website_url || null,
          contact_name: `${firstName} ${lastName}`.trim(),
          contact_email: email,
          contact_title: title,
          contact_phone: p.phone_numbers?.[0]?.sanitized_number || "",
          source_keyword: `apollo:${industry.toLowerCase().replace(/\s+/g, '-')}`,
          status: "pending",
          industry: industry.toLowerCase(),
          score: 70,
        });

        if (!error) {
          totalAdded++;
          existingEmails.add(email);
          console.log(`  ✅ ${firstName} ${lastName} @ ${company} — ${email}`);
        }
      }
    }

    const summary = `Searched: ${totalSearched} | Enriched emails: ${totalEnriched} | Added: ${totalAdded}`;
    console.log(`🎯 ${summary}`);

    // Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: { function: "🔍 Queue Enrichment", error: summary },
        }),
      });
    } catch { /* */ }

    return new Response(JSON.stringify({ success: true, totalSearched, totalEnriched, totalAdded }), { headers });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("enrich-queue-emails error:", errMsg);
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
