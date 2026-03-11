import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const APOLLO_TITLES = [
  "HR Director", "Head of L&D", "Learning and Development Manager",
  "Talent Director", "HR Executive", "Chief People Officer", "CHRO",
  "Head of People", "Head of Human Resources", "COO", "HR Manager",
  "People Director", "Talent Lead",
];

const APOLLO_INDUSTRIES = [
  "Financial Services", "Insurance", "Banking",
  "Accounting", "Legal", "Professional Services",
];

const GENERIC_PREFIXES = [
  "info", "admin", "support", "hello", "contact", "sales", "enquiries",
  "reception", "office", "no-reply", "noreply", "webmaster", "marketing",
  "news", "careers", "hr", "jobs", "media", "press", "feedback",
  "compliance", "legal", "service", "help", "clientservice", "clientservices",
  "claims", "queries", "applications", "treasury", "operations",
  "accounts", "billing", "general", "team", "group", "corporate",
  "investor", "shareholders", "communications", "procurement", "pr",
];

async function enrichPerson(apolloApiKey: string, person: any): Promise<string | null> {
  // Use Apollo People Enrichment to reveal the email
  try {
    const enrichBody: Record<string, any> = {
      reveal_personal_emails: true,
      reveal_phone_number: true,
    };

    // Use Apollo ID if available for best match
    if (person.id) {
      enrichBody.id = person.id;
    } else {
      // Fallback to name + company domain
      if (person.first_name) enrichBody.first_name = person.first_name;
      if (person.last_name) enrichBody.last_name = person.last_name;
      if (person.organization?.primary_domain) {
        enrichBody.domain = person.organization.primary_domain;
      } else if (person.organization?.website_url) {
        try {
          enrichBody.domain = new URL(person.organization.website_url).hostname.replace("www.", "");
        } catch { /* skip */ }
      }
      if (person.linkedin_url) enrichBody.linkedin_url = person.linkedin_url;
    }

    const res = await fetch("https://api.apollo.io/api/v1/people/match", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
      body: JSON.stringify(enrichBody),
    });

    if (!res.ok) {
      console.error(`  Enrich API error [${res.status}]: ${await res.text()}`);
      return null;
    }

    const data = await res.json();
    const match = data.person;
    if (!match) return null;

    // Return the best email: work email first, then personal
    const email = match.email || match.personal_emails?.[0] || null;
    return email ? email.toLowerCase().trim() : null;
  } catch (err) {
    console.error("  Enrich error:", err);
    return null;
  }
}

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
    console.log("🎯 apollo-prospect-import invoked at", new Date().toISOString());

    // Load existing emails for dedup
    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email")
      .not("contact_email", "is", null);

    const existingEmails = new Set(
      (existingRows || []).map((r: any) => r.contact_email?.toLowerCase().trim())
    );

    let totalPulled = 0;
    let enriched = 0;
    let enrichFailed = 0;
    let added = 0;
    let skippedDup = 0;
    let skippedQuality = 0;

    // Search Apollo — 3 pages to get ~75 contacts, then enrich for emails
    for (let page = 1; page <= 3; page++) {
      if (added >= 50) break;

      console.log(`📡 Apollo search page ${page}...`);

      const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
        body: JSON.stringify({
          page,
          per_page: 25,
          person_titles: APOLLO_TITLES,
          person_locations: ["South Africa"],
          organization_num_employees_ranges: ["101-500"],
          q_keywords: APOLLO_INDUSTRIES.join(" OR "),
        }),
      });

      if (!apolloRes.ok) {
        const errText = await apolloRes.text();
        console.error(`Apollo API error [${apolloRes.status}]: ${errText}`);
        break;
      }

      const apolloData = await apolloRes.json();
      const people = apolloData.people || [];
      totalPulled += people.length;
      console.log(`  Got ${people.length} contacts from page ${page}`);

      if (people.length === 0) break;

      for (const p of people) {
        if (added >= 50) break;

        // First check if the search already returned an email
        let email = (p.email || "").toLowerCase().trim();

        // If no email from search, enrich to reveal it
        if (!email || !email.includes("@")) {
          console.log(`  🔍 Enriching ${p.first_name} ${p.last_name} @ ${p.organization?.name}...`);
          const revealedEmail = await enrichPerson(apolloApiKey, p);
          if (revealedEmail) {
            email = revealedEmail;
            enriched++;
            console.log(`  📧 Revealed: ${email}`);
          } else {
            enrichFailed++;
            console.log(`  ⚠️ No email found for ${p.first_name} ${p.last_name}`);
            continue; // Skip contacts we can't get emails for
          }
          // Rate limit enrichment calls
          await new Promise(r => setTimeout(r, 500));
        }

        // Generic prefix check
        const prefix = email.split("@")[0];
        if (GENERIC_PREFIXES.some(g => prefix === g || prefix.startsWith(g + "."))) {
          skippedQuality++;
          continue;
        }

        // Block own domain / test emails
        if (email.includes("kevin@") || email.includes("leadershipbydesign")) {
          skippedQuality++;
          continue;
        }

        // Dedup
        if (existingEmails.has(email)) {
          skippedDup++;
          continue;
        }

        const companyName = p.organization?.name || "";
        const companyWebsite = p.organization?.website_url || "";
        const contactName = `${p.first_name || ""} ${p.last_name || ""}`.trim();
        const contactTitle = p.title || "";
        const phone = p.phone_numbers?.[0]?.sanitized_number || "";

        const { error } = await supabase.from("warm_outreach_queue").insert({
          company_name: companyName,
          company_website: companyWebsite || null,
          contact_name: contactName,
          contact_email: email,
          contact_title: contactTitle,
          contact_phone: phone,
          source_keyword: "apollo:enriched",
          status: "pending",
          industry: "financial services",
          score: 70,
        });

        if (!error) {
          added++;
          existingEmails.add(email);
          console.log(`  ✅ ${contactName} (${contactTitle}) @ ${companyName} — ${email}`);
        } else {
          console.error(`  ❌ Insert error: ${error.message}`);
        }
      }
    }

    const summary = `🎯 Apollo Import Complete\nContacts searched: ${totalPulled}\nEmails enriched: ${enriched}\nEnrich failed: ${enrichFailed}\nAdded to queue: ${added}\nSkipped (duplicate): ${skippedDup}\nSkipped (quality): ${skippedQuality}`;
    console.log(summary);

    // Post to #mission-control
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: {
            function: "🎯 Apollo Import Complete",
            error: `Searched: ${totalPulled} | Enriched: ${enriched} | Added: ${added} | Dup: ${skippedDup} | No email: ${enrichFailed}`,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(JSON.stringify({
      success: true,
      total_pulled: totalPulled,
      emails_enriched: enriched,
      enrich_failed: enrichFailed,
      added,
      skipped_duplicate: skippedDup,
      skipped_quality: skippedQuality,
    }), { headers });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("apollo-prospect-import error:", errMsg);
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "apollo-prospect-import", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
