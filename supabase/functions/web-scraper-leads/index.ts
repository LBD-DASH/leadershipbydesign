import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Target corporate BUYERS — companies that need leadership development
const SEARCH_QUERIES = [
  "corporate leadership development programme South Africa 2026",
  "management training corporate Gauteng Johannesburg",
  "B-BBEE accredited leadership training corporate",
  "executive development programme company South Africa",
];

const HR_TITLES = [
  "Head of HR", "HR Director", "HR Manager", "Chief People Officer",
  "Head of People", "Head of Learning and Development", "L&D Manager",
  "Training Manager", "Head of Talent", "CHRO",
  "Head of Organisational Development", "VP People",
];

// Exclude non-target domains
const EXCLUDED_DOMAINS = [
  "linkedin.com", "facebook.com", "youtube.com", "twitter.com", "instagram.com",
  "indeed.com", "glassdoor.com", "pnet.co.za", "careers24.co.za", "careerjet.co.za",
  "myjobmag.co.za", "jobvine.co.za", "gumtree.co.za", "offerzen.com",
  "careerjunction.co.za", "za.talent.com", "simplyhired.co.za", "jobisjob.co.za",
  "wikipedia.org", "gov.za", "reddit.com", "quora.com",
  "leadershipbydesign.co.za", "leadershipbydesign.lovable.app",
  "robertwaltersafrica.com", "michaelpage.co.za", "hays.co.za",
  "bluesteps.com", "theknowledgeacademy.com",
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const GENERIC_PREFIXES = ["info", "admin", "support", "hello", "contact", "sales", "enquiries", "reception", "office", "no-reply", "noreply"];

function isTargetDomain(domain: string): boolean {
  return !EXCLUDED_DOMAINS.some((ex) => domain.includes(ex));
}

function extractBestEmail(text: string, domain: string): string | null {
  const emails = [...new Set(text.match(EMAIL_REGEX) || [])];
  const domainRoot = domain.replace(/^www\./, "");
  const domainEmails = emails.filter((e) => e.includes(domainRoot));
  const personal = domainEmails.filter((e) => !GENERIC_PREFIXES.some((p) => e.toLowerCase().startsWith(p + "@")));
  if (personal.length > 0) return personal[0];
  if (domainEmails.length > 0) return domainEmails[0];
  const anyPersonal = emails.filter((e) => !GENERIC_PREFIXES.some((p) => e.toLowerCase().startsWith(p + "@")));
  if (anyPersonal.length > 0) return anyPersonal[0];
  return emails.length > 0 ? emails[0] : null;
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
    return new Response(JSON.stringify({ error: "Missing API keys" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("🔍 Starting web-scraper-leads pipeline...");
    const allCompanies: { name: string; website: string; keyword: string }[] = [];

    // Step 1: Firecrawl search
    for (const query of SEARCH_QUERIES) {
      try {
        console.log(`Searching: ${query}`);
        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit: 8, country: "za", lang: "en" }),
        });

        if (!searchRes.ok) {
          console.error(`Search failed "${query}": ${searchRes.status}`);
          continue;
        }

        const searchData = await searchRes.json();
        const results = searchData.data || searchData.results || [];

        for (const r of results) {
          const url = r.url || r.link || "";
          if (!url) continue;
          try {
            const domain = new URL(url).hostname.replace("www.", "");
            if (!isTargetDomain(domain)) continue;
            if (!allCompanies.find((c) => c.website.includes(domain))) {
              allCompanies.push({ name: r.title || domain, website: url, keyword: query });
            }
          } catch { continue; }
        }
      } catch (err) {
        console.error(`Error "${query}":`, err);
      }
    }

    console.log(`Found ${allCompanies.length} unique companies`);

    // Step 2: Apollo lookup + single-page scrape fallback
    let addedCount = 0, apolloHits = 0, scrapeHits = 0;

    for (const company of allCompanies.slice(0, 15)) {
      try {
        let domain: string;
        try { domain = new URL(company.website).hostname.replace("www.", ""); } catch { continue; }

        // Dedup
        const { data: existing } = await supabase
          .from("warm_outreach_queue")
          .select("id")
          .ilike("company_website", `%${domain}%`)
          .limit(1);
        if (existing && existing.length > 0) { console.log(`Skip dup: ${domain}`); continue; }

        // Apollo
        let contactFound = false;
        try {
          const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Api-Key": apolloKey },
            body: JSON.stringify({ q_organization_domains: [domain], person_titles: HR_TITLES, per_page: 3, page: 1 }),
          });

          if (apolloRes.ok) {
            const apolloData = await apolloRes.json();
            const people = apolloData.people || [];
            if (people.length > 0 && people[0].email) {
              const p = people[0];
              const { error } = await supabase.from("warm_outreach_queue").insert({
                company_name: p.organization?.name || company.name,
                company_website: company.website,
                contact_name: `${p.first_name || ""} ${p.last_name || ""}`.trim(),
                contact_title: p.title || "",
                contact_email: p.email,
                contact_phone: p.phone_numbers?.[0]?.sanitized_number || "",
                contact_linkedin: p.linkedin_url || "",
                apollo_person_id: p.id || "",
                source_keyword: company.keyword,
                status: "pending",
              });
              if (!error) { addedCount++; apolloHits++; contactFound = true; }
            }
          }
        } catch (err) { console.error(`Apollo err ${domain}:`, err); }

        // Fallback: scrape homepage only (fast, most SA sites have email in footer)
        if (!contactFound) {
          let scrapedEmail: string | null = null;
          try {
            const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
              method: "POST",
              headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({ url: `https://${domain}`, formats: ["markdown"], onlyMainContent: false, timeout: 10000 }),
            });
            if (scrapeRes.ok) {
              const d = await scrapeRes.json();
              scrapedEmail = extractBestEmail(d.data?.markdown || d.markdown || "", domain);
              if (scrapedEmail) console.log(`📧 Scraped: ${scrapedEmail} from ${domain}`);
            }
          } catch { /* skip */ }

          const { error } = await supabase.from("warm_outreach_queue").insert({
            company_name: company.name,
            company_website: company.website,
            contact_email: scrapedEmail || "",
            source_keyword: company.keyword,
            status: "pending",
          });
          if (!error) { addedCount++; if (scrapedEmail) scrapeHits++; }
        }
      } catch (err) {
        console.error(`Error ${company.name}:`, err);
      }
    }

    const summary = `*Companies found:* ${allCompanies.length}\n*Prospects added:* ${addedCount}\n*Apollo contacts:* ${apolloHits}\n*Scraped emails:* ${scrapeHits}`;
    console.log(`✅ Done: ${addedCount} added (${apolloHits} Apollo, ${scrapeHits} scraped)`);

    // Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          blocks: [
            { type: "header", text: { type: "plain_text", text: "🔍 Lead Scraper Complete" } },
            { type: "section", text: { type: "mrkdwn", text: summary } },
          ],
        }),
      });
    } catch (e) { console.error("Slack failed:", e); }

    return new Response(
      JSON.stringify({ success: true, companies_found: allCompanies.length, prospects_added: addedCount, apollo_contacts: apolloHits, scraped_emails: scrapeHits }),
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
