import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const APOLLO_TITLES = [
  "HR Director", "Head of L&D", "Learning and Development Manager",
  "Talent Director", "HR Executive", "Chief People Officer", "CHRO",
  "Head of People", "Head of Human Resources", "COO",
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
    let passedGate = 0;
    let added = 0;
    let skippedDup = 0;
    let skippedQuality = 0;

    // Search Apollo across all target industries — 2 pages to get ~50 contacts
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
          contact_email_status: ["verified", "likely"],
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

        const email = (p.email || "").toLowerCase().trim();
        if (!email || !email.includes("@")) { skippedQuality++; continue; }

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

        passedGate++;

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
          source_keyword: "apollo:first-batch",
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

    const summary = `🎯 Apollo Import Complete\nContacts pulled: ${totalPulled}\nPassed quality gate: ${passedGate}\nAdded to queue: ${added}\nSkipped (duplicate): ${skippedDup}\nSkipped (quality): ${skippedQuality}`;
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
            error: `Contacts pulled: ${totalPulled}\nPassed quality gate: ${passedGate}\nAdded to queue: ${added}\nSkipped (duplicate): ${skippedDup}`,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(JSON.stringify({
      success: true,
      total_pulled: totalPulled,
      passed_gate: passedGate,
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
