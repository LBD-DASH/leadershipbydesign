import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Target BUYERS of leadership development, not providers/competitors
const SEARCH_QUERIES = [
  "HR director leadership development South Africa",
  "chief people officer skills development Johannesburg",
  "head of learning and development corporate South Africa",
  "B-BBEE skills development levy corporate training",
  "leadership training RFP South Africa",
  "people development corporate Gauteng",
  "employee development programme large company South Africa",
  "executive development corporate Cape Town Durban",
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
  "Head of Organisational Development",
  "VP People",
];

// Domains to exclude — competitors, job boards, directories
const EXCLUDED_DOMAINS = [
  "linkedin.com", "facebook.com", "youtube.com", "twitter.com",
  "indeed.com", "glassdoor.com", "pnet.co.za", "careers24.co.za",
  "wikipedia.org", "gov.za", "reddit.com",
  // Known competitors / training providers to skip
  "leadershipbydesign.co.za", "leadershipbydesign.lovable.app",
];

// Email regex for scraping contact pages
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const GENERIC_EMAIL_PREFIXES = ["info", "admin", "support", "hello", "contact", "sales", "enquiries", "enquiry", "reception", "office"];

function isCompanyDomain(domain: string): boolean {
  return !EXCLUDED_DOMAINS.some((ex) => domain.includes(ex));
}

function extractBestEmail(text: string, domain: string): string | null {
  const emails = text.match(EMAIL_REGEX) || [];
  const domainRoot = domain.replace(/^www\./, "");

  // Prefer emails from the same domain
  const domainEmails = emails.filter((e) => e.includes(domainRoot));
  // Prefer non-generic emails (e.g. kevin@company.co.za over info@company.co.za)
  const personalEmails = domainEmails.filter(
    (e) => !GENERIC_EMAIL_PREFIXES.some((p) => e.toLowerCase().startsWith(p + "@"))
  );

  if (personalEmails.length > 0) return personalEmails[0];
  if (domainEmails.length > 0) return domainEmails[0];
  // Fallback: any non-generic email found
  const anyPersonal = emails.filter(
    (e) => !GENERIC_EMAIL_PREFIXES.some((p) => e.toLowerCase().startsWith(p + "@"))
  );
  if (anyPersonal.length > 0) return anyPersonal[0];
  if (emails.length > 0) return emails[0];
  return null;
}

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
          if (!url) continue;

          try {
            const domain = new URL(url).hostname.replace("www.", "");
            if (!isCompanyDomain(domain)) continue;

            const name = r.title || domain;
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

    // Step 2: For each company, find HR decision-makers via Apollo, fallback to Firecrawl scrape
    let addedCount = 0;
    let apolloHits = 0;
    let scrapeHits = 0;

    for (const company of allCompanies.slice(0, 25)) {
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

        // Try Apollo first
        let contactFound = false;
        try {
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

          if (apolloRes.ok) {
            const apolloData = await apolloRes.json();
            const people = apolloData.people || [];

            if (people.length > 0 && people[0].email) {
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
              if (!error) {
                addedCount++;
                apolloHits++;
                contactFound = true;
              }
            }
          }
        } catch (err) {
          console.error(`Apollo failed for ${domain}:`, err);
        }

        // Fallback: Scrape contact/about page for emails
        if (!contactFound) {
          try {
            const baseUrl = `https://${domain}`;
            // Try common contact page paths (limited to avoid timeout)
            const contactPaths = ["/contact", "/about"];
            let scrapedEmail: string | null = null;

            for (const path of contactPaths) {
              if (scrapedEmail) break;
              try {
                const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${firecrawlKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    url: `${baseUrl}${path}`,
                    formats: ["markdown"],
                    onlyMainContent: true,
                    timeout: 15000,
                  }),
                });

                if (scrapeRes.ok) {
                  const scrapeData = await scrapeRes.json();
                  const content = scrapeData.data?.markdown || scrapeData.markdown || "";
                  scrapedEmail = extractBestEmail(content, domain);
                  if (scrapedEmail) {
                    console.log(`📧 Found email via scrape: ${scrapedEmail} at ${baseUrl}${path}`);
                  }
                }
              } catch {
                // Path doesn't exist, try next
              }
            }

            // Also try homepage if no contact page worked
            if (!scrapedEmail) {
              try {
                const homeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${firecrawlKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    url: baseUrl,
                    formats: ["markdown"],
                    onlyMainContent: false,
                    timeout: 15000,
                  }),
                });
                if (homeRes.ok) {
                  const homeData = await homeRes.json();
                  const content = homeData.data?.markdown || homeData.markdown || "";
                  scrapedEmail = extractBestEmail(content, domain);
                }
              } catch {
                // Homepage scrape failed
              }
            }

            const { error } = await supabase.from("warm_outreach_queue").insert({
              company_name: company.name,
              company_website: company.website,
              contact_email: scrapedEmail || "",
              source_keyword: company.keyword,
              status: "pending",
            });

            if (!error) {
              addedCount++;
              if (scrapedEmail) scrapeHits++;
            }
          } catch (err) {
            console.error(`Scrape fallback failed for ${domain}:`, err);
            // Still add without email
            await supabase.from("warm_outreach_queue").insert({
              company_name: company.name,
              company_website: company.website,
              source_keyword: company.keyword,
              status: "pending",
            });
            addedCount++;
          }
        }
      } catch (err) {
        console.error(`Error processing ${company.name}:`, err);
      }
    }

    const summary = `*Companies found:* ${allCompanies.length}\n*Prospects added:* ${addedCount}\n*Apollo contacts:* ${apolloHits}\n*Scraped emails:* ${scrapeHits}\n*Keywords:* ${SEARCH_QUERIES.length}`;
    console.log(`✅ web-scraper-leads complete: ${addedCount} added (${apolloHits} Apollo, ${scrapeHits} scraped)`);

    // Notify Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          channel: "mission-control",
          blocks: [
            { type: "header", text: { type: "plain_text", text: "🔍 Lead Scraper Complete" } },
            { type: "section", text: { type: "mrkdwn", text: summary } },
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
        apollo_contacts: apolloHits,
        scraped_emails: scrapeHits,
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
