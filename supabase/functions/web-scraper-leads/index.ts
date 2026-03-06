import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEARCH_QUERIES = [
  "leadership coaching South Africa",
  "executive coaching Johannesburg",
  "B-BBEE skills development provider",
  "leadership development programme South Africa",
];

const HR_TITLES = [
  "Head of HR",
  "HR Director",
  "HR Manager",
  "Chief People Officer",
  "Head of People",
  "Head of Learning and Development",
  "L&D Manager",
  "Training Manager",
  "Head of Talent",
  "CHRO",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const apolloKey = Deno.env.get("APOLLO_API_KEY");

  if (!firecrawlKey || !apolloKey) {
    console.error("Missing FIRECRAWL_API_KEY or APOLLO_API_KEY");
    return new Response(JSON.stringify({ error: "Missing API keys" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("🔍 Starting web-scraper-leads pipeline...");
    const allCompanies: { name: string; website: string; keyword: string }[] = [];

    // Step 1: Firecrawl search for each keyword
    for (const query of SEARCH_QUERIES) {
      try {
        console.log(`Searching: ${query}`);
        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            limit: 10,
            country: "za",
            lang: "en",
          }),
        });

        if (!searchRes.ok) {
          console.error(`Firecrawl search failed for "${query}": ${searchRes.status}`);
          continue;
        }

        const searchData = await searchRes.json();
        const results = searchData.data || searchData.results || [];

        for (const r of results) {
          const url = r.url || r.link || "";
          if (!url || url.includes("linkedin.com") || url.includes("facebook.com") || url.includes("youtube.com")) continue;

          try {
            const domain = new URL(url).hostname.replace("www.", "");
            const name = r.title || domain;
            // Deduplicate by domain
            if (!allCompanies.find((c) => c.website.includes(domain))) {
              allCompanies.push({ name, website: url, keyword: query });
            }
          } catch {
            continue;
          }
        }
      } catch (err) {
        console.error(`Error searching "${query}":`, err);
      }
    }

    console.log(`Found ${allCompanies.length} unique companies from search`);

    // Step 2: For each company, find HR decision-makers via Apollo
    let addedCount = 0;

    for (const company of allCompanies.slice(0, 20)) {
      try {
        let domain: string;
        try {
          domain = new URL(company.website).hostname.replace("www.", "");
        } catch {
          continue;
        }

        // Check for existing entries
        const { data: existing } = await supabase
          .from("warm_outreach_queue")
          .select("id")
          .ilike("company_website", `%${domain}%`)
          .limit(1);

        if (existing && existing.length > 0) {
          console.log(`Skipping duplicate: ${domain}`);
          continue;
        }

        // Apollo people search for HR titles at this company domain
        const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apolloKey,
          },
          body: JSON.stringify({
            q_organization_domains: [domain],
            person_titles: HR_TITLES,
            per_page: 3,
            page: 1,
          }),
        });

        if (!apolloRes.ok) {
          console.error(`Apollo search failed for ${domain}: ${apolloRes.status}`);
          continue;
        }

        const apolloData = await apolloRes.json();
        const people = apolloData.people || [];

        if (people.length === 0) {
          // Still add company with no contact
          const { error } = await supabase.from("warm_outreach_queue").insert({
            company_name: company.name,
            company_website: company.website,
            source_keyword: company.keyword,
            status: "pending",
          });
          if (!error) addedCount++;
          continue;
        }

        // Add best HR contact
        const person = people[0];
        const { error } = await supabase.from("warm_outreach_queue").insert({
          company_name: person.organization?.name || company.name,
          company_website: company.website,
          contact_name: `${person.first_name || ""} ${person.last_name || ""}`.trim(),
          contact_title: person.title || "",
          contact_email: person.email || "",
          contact_phone: person.phone_numbers?.[0]?.sanitized_number || "",
          contact_linkedin: person.linkedin_url || "",
          apollo_person_id: person.id || "",
          source_keyword: company.keyword,
          status: "pending",
        });

        if (!error) addedCount++;
      } catch (err) {
        console.error(`Error processing ${company.name}:`, err);
      }
    }

    console.log(`✅ web-scraper-leads complete: ${addedCount} prospects added`);

    // Notify Slack
    try {
      const slackUrl = `${supabaseUrl}/functions/v1/slack-notify`;
      await fetch(slackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          channel: "mission-control",
          blocks: [
            { type: "header", text: { type: "plain_text", text: "🔍 Lead Scraper Complete" } },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Companies found:* ${allCompanies.length}\n*Prospects added to queue:* ${addedCount}\n*Keywords searched:* ${SEARCH_QUERIES.length}`,
              },
            },
          ],
        }),
      });
    } catch (e) {
      console.error("Slack notify failed:", e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        companies_found: allCompanies.length,
        prospects_added: addedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("web-scraper-leads error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
