import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_TITLES = [
  "HR Director", "Head of L&D", "Learning and Development Manager",
  "Talent Director", "HR Executive", "COO", "Chief People Officer",
  "Head of People", "Head of Organisational Development", "CHRO",
  "Head of Human Resources", "VP People",
];

const TARGET_INDUSTRIES = [
  "financial services", "insurance", "banking",
];

const GENERIC_PREFIXES = [
  "info", "admin", "support", "hello", "contact", "sales", "enquiries",
  "reception", "office", "no-reply", "noreply", "webmaster", "marketing",
  "news", "documents", "membership", "careers", "hr", "jobs",
];

function isQualityEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const prefix = email.split("@")[0].toLowerCase();
  return !GENERIC_PREFIXES.some((g) => prefix === g || prefix.startsWith(g + "."));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const apolloKey = Deno.env.get("APOLLO_API_KEY");

  if (!apolloKey) {
    return new Response(JSON.stringify({ error: "Missing APOLLO_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Determine which industry to search (rotate daily or accept override)
    let industryIndex = 0;
    try {
      const body = await req.json();
      if (typeof body.industry_index === "number") {
        industryIndex = body.industry_index % TARGET_INDUSTRIES.length;
      } else {
        // Auto-rotate based on day of year
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        industryIndex = dayOfYear % TARGET_INDUSTRIES.length;
      }
    } catch {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      industryIndex = dayOfYear % TARGET_INDUSTRIES.length;
    }

    const currentIndustry = TARGET_INDUSTRIES[industryIndex];
    console.log(`🎯 Apollo prospecting: ${currentIndustry} (index ${industryIndex})`);

    // Fetch existing emails for dedup
    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email")
      .not("contact_email", "is", null);

    const existingEmails = new Set(
      (existingRows || []).map((r: any) => r.contact_email?.toLowerCase())
    );

    let addedCount = 0;
    let skippedDup = 0;
    let skippedQuality = 0;
    let totalFound = 0;

    // Paginate Apollo (up to 3 pages of 25)
    for (let page = 1; page <= 3; page++) {
      console.log(`📄 Apollo page ${page} for "${currentIndustry}"...`);

      const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": apolloKey },
        body: JSON.stringify({
          person_titles: TARGET_TITLES,
          q_organization_keyword_tags: [currentIndustry],
          person_locations: ["South Africa"],
          organization_num_employees_ranges: ["201-500", "501-1000", "1001-5000", "5001-10000"],
          contact_email_status: ["verified"],
          page,
          per_page: 25,
        }),
      });

      if (!apolloRes.ok) {
        const errText = await apolloRes.text();
        console.error(`Apollo API error [${apolloRes.status}]: ${errText}`);
        break;
      }

      const apolloData = await apolloRes.json();
      const people = apolloData.people || [];
      totalFound += people.length;

      if (people.length === 0) {
        console.log("No more results, stopping pagination.");
        break;
      }

      for (const p of people) {
        const email = p.email?.toLowerCase()?.trim();
        if (!email) continue;

        // Quality gate
        if (!isQualityEmail(email)) {
          skippedQuality++;
          continue;
        }

        // Dedup
        if (existingEmails.has(email)) {
          skippedDup++;
          continue;
        }

        // Insert into outreach queue
        const { error } = await supabase.from("warm_outreach_queue").insert({
          company_name: p.organization?.name || "",
          company_website: p.organization?.website_url || "",
          contact_name: `${p.first_name || ""} ${p.last_name || ""}`.trim(),
          contact_title: p.title || "",
          contact_email: email,
          contact_phone: p.phone_numbers?.[0]?.sanitized_number || "",
          contact_linkedin: p.linkedin_url || "",
          apollo_person_id: p.id || "",
          source_keyword: `apollo:${currentIndustry}`,
          status: "pending",
        });

        if (!error) {
          addedCount++;
          existingEmails.add(email); // Prevent intra-batch dups
        } else {
          console.error(`Insert error for ${email}:`, error.message);
        }
      }
    }

    const summary = `Apollo Prospecting: ${currentIndustry}\nFound: ${totalFound} | Added: ${addedCount} | Dup: ${skippedDup} | Bad email: ${skippedQuality}`;
    console.log(`✅ ${summary}`);

    // Slack notification
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "daily_pipeline_complete",
          data: {
            industry: currentIndustry,
            added: addedCount,
            total_found: totalFound,
            skipped_dup: skippedDup,
            skipped_quality: skippedQuality,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(
      JSON.stringify({
        success: true,
        industry: currentIndustry,
        total_found: totalFound,
        prospects_added: addedCount,
        skipped_duplicate: skippedDup,
        skipped_bad_email: skippedQuality,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("web-scraper-leads error:", errMsg);
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "web-scraper-leads", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
