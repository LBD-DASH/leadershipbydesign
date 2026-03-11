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
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || "clean_and_refill";

    if (mode === "clean_only" || mode === "clean_and_refill") {
      // Step 1: Remove all prospects without emails
      const { data: noEmail } = await supabase
        .from("warm_outreach_queue")
        .select("id")
        .or("contact_email.is.null,contact_email.eq.");

      if (noEmail && noEmail.length > 0) {
        const ids = noEmail.map((r: any) => r.id);
        // Delete in batches of 50
        for (let i = 0; i < ids.length; i += 50) {
          const batch = ids.slice(i, i + 50);
          await supabase.from("warm_outreach_queue").delete().in("id", batch);
        }
        console.log(`🗑️ Removed ${noEmail.length} prospects without emails`);
      }

      if (mode === "clean_only") {
        return new Response(JSON.stringify({ success: true, removed: noEmail?.length || 0 }), { headers });
      }
    }

    // Step 2: Fresh Apollo search WITH enrichment to get emails
    // Load existing emails for dedup
    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email")
      .not("contact_email", "is", null);

    const existingEmails = new Set(
      (existingRows || []).map((r: any) => r.contact_email?.toLowerCase().trim())
    );

    let totalSearched = 0;
    let enriched = 0;
    let added = 0;
    let skippedDup = 0;
    let noEmailFound = 0;

    for (let page = 1; page <= 4; page++) {
      if (added >= 30) break;

      console.log(`📡 Apollo search page ${page}...`);
      const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
        body: JSON.stringify({
          page,
          per_page: 25,
          person_titles: [
            "HR Director", "Head of L&D", "Learning and Development Manager",
            "Talent Director", "HR Executive", "Chief People Officer",
            "Head of People", "Head of Human Resources", "HR Manager",
            "People Director",
          ],
          person_locations: ["South Africa"],
          organization_num_employees_ranges: ["51-200", "201-500", "501-1000"],
          q_keywords: "Financial Services OR Insurance OR Banking OR Legal OR Professional Services OR Accounting",
        }),
      });

      if (!apolloRes.ok) {
        console.error(`Apollo search error: ${apolloRes.status}`);
        break;
      }

      const data = await apolloRes.json();
      const people = data.people || [];
      totalSearched += people.length;
      console.log(`  Found ${people.length} contacts`);
      if (people.length === 0) break;

      for (const p of people) {
        if (added >= 30) break;

        let email = (p.email || "").toLowerCase().trim();

        // If no email from search, use People Match to reveal it
        if (!email || !email.includes("@")) {
          try {
            const enrichBody: Record<string, any> = { reveal_personal_emails: true };
            if (p.id) enrichBody.id = p.id;
            else {
              if (p.first_name) enrichBody.first_name = p.first_name;
              if (p.last_name) enrichBody.last_name = p.last_name;
              if (p.organization?.primary_domain) enrichBody.domain = p.organization.primary_domain;
              if (p.linkedin_url) enrichBody.linkedin_url = p.linkedin_url;
            }

            const enrichRes = await fetch("https://api.apollo.io/api/v1/people/match", {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
              body: JSON.stringify(enrichBody),
            });

            if (enrichRes.ok) {
              const enrichData = await enrichRes.json();
              const match = enrichData.person;
              if (match) {
                email = (match.email || match.personal_emails?.[0] || "").toLowerCase().trim();
                if (email) enriched++;
              }
            }
            await new Promise(r => setTimeout(r, 400));
          } catch { /* continue */ }
        }

        if (!email || !email.includes("@")) {
          noEmailFound++;
          continue;
        }

        // Skip generic/blocked emails
        const prefix = email.split("@")[0];
        const genericPrefixes = ["info", "admin", "support", "hello", "contact", "sales", "hr", "careers", "reception", "office", "no-reply", "noreply"];
        if (genericPrefixes.some(g => prefix === g)) continue;
        if (email.includes("kevin@") || email.includes("leadershipbydesign")) continue;

        if (existingEmails.has(email)) { skippedDup++; continue; }

        const { error } = await supabase.from("warm_outreach_queue").insert({
          company_name: p.organization?.name || "",
          company_website: p.organization?.website_url || null,
          contact_name: `${p.first_name || ""} ${p.last_name || ""}`.trim(),
          contact_email: email,
          contact_title: p.title || "",
          contact_phone: p.phone_numbers?.[0]?.sanitized_number || "",
          source_keyword: "apollo:enriched",
          status: "pending",
          industry: "financial services",
          score: 70,
        });

        if (!error) {
          added++;
          existingEmails.add(email);
          console.log(`  ✅ ${p.first_name} ${p.last_name} — ${email}`);
        }
      }
    }

    const summary = `Searched: ${totalSearched} | Enriched: ${enriched} | Added: ${added} | No email: ${noEmailFound} | Dup: ${skippedDup}`;
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
    } catch { /* best effort */ }

    return new Response(JSON.stringify({ success: true, totalSearched, enriched, added, noEmailFound, skippedDup }), { headers });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("enrich-queue-emails error:", errMsg);
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
