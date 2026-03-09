import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rotate through industries daily
const TARGET_INDUSTRIES = [
  "financial services",
  "insurance",
  "banking",
];

// Search queries per industry — designed to find CORPORATE BUYERS, not providers
const INDUSTRY_QUERIES: Record<string, string[]> = {
  "financial services": [
    '"HR Director" OR "Head of L&D" financial services South Africa site:linkedin.com',
    '"Learning and Development Manager" OR "Talent Director" financial services Johannesburg',
    '"Chief People Officer" OR "CHRO" financial services company South Africa',
    '"Head of People" OR "HR Executive" asset management OR investment South Africa',
  ],
  "insurance": [
    '"HR Director" OR "Head of L&D" insurance company South Africa site:linkedin.com',
    '"Learning and Development Manager" OR "Talent Director" insurance Johannesburg',
    '"Chief People Officer" OR "HR Executive" insurance underwriting South Africa',
    '"Head of People" OR "Head of HR" insurance broker South Africa',
  ],
  "banking": [
    '"HR Director" OR "Head of L&D" bank South Africa site:linkedin.com',
    '"Learning and Development Manager" OR "Talent Director" banking Johannesburg',
    '"Chief People Officer" OR "CHRO" bank OR banking South Africa',
    '"Head of People" OR "HR Executive" retail banking OR commercial banking South Africa',
  ],
};

const GENERIC_PREFIXES = [
  "info", "admin", "support", "hello", "contact", "sales", "enquiries",
  "reception", "office", "no-reply", "noreply", "webmaster", "marketing",
  "news", "documents", "membership", "careers", "hr", "jobs", "media",
  "press", "feedback", "compliance", "legal",
];

const EXCLUDED_DOMAINS = [
  "linkedin.com", "facebook.com", "youtube.com", "twitter.com", "instagram.com",
  "wikipedia.org", "gov.za", "reddit.com", "quora.com",
  "indeed.com", "glassdoor.com", "pnet.co.za", "careers24.co.za", "careerjet.co.za",
  "myjobmag.co.za", "jobvine.co.za", "gumtree.co.za", "offerzen.com",
  "careerjunction.co.za", "simplyhired.co.za",
  "leadershipbydesign.co.za", "leadershipbydesign.lovable.app",
  "theknowledgeacademy.com", "trainingcred.com", "globalmanagementacademy.com",
  "henleysa.ac.za", "gibs.co.za", "usb.ac.za", "wits.ac.za", "uct.ac.za",
  "unisa.ac.za", "up.ac.za", "coursera.org", "udemy.com", "getsmarter.com",
  "bizcommunity.com", "news24.com", "fin24.com", "businesslive.co.za",
  "worldbank.org", "businesstech.co.za",
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const HR_TITLES_PATTERN = /\b(HR Director|Head of (?:HR|L&D|People|Learning|Talent|Organisational Development)|Learning and Development Manager|Talent Director|HR Executive|COO|Chief People Officer|CHRO|VP People|Head of Human Resources)\b/i;

function isQualityEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const prefix = email.split("@")[0].toLowerCase();
  return !GENERIC_PREFIXES.some((g) => prefix === g || prefix.startsWith(g + "."));
}

function isTargetDomain(domain: string): boolean {
  return !EXCLUDED_DOMAINS.some((ex) => domain.includes(ex));
}

function extractEmails(text: string): string[] {
  return [...new Set((text.match(EMAIL_REGEX) || []).map(e => e.toLowerCase()))];
}

function extractNameFromEmail(email: string): string {
  const prefix = email.split("@")[0];
  // Convert john.smith or jsmith patterns to readable names
  const parts = prefix.split(/[._-]/);
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");

  if (!firecrawlKey) {
    return new Response(JSON.stringify({ error: "Missing FIRECRAWL_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Determine industry (rotate daily or accept override)
    let industryIndex = 0;
    try {
      const body = await req.json();
      if (typeof body.industry_index === "number") {
        industryIndex = body.industry_index % TARGET_INDUSTRIES.length;
      } else {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        industryIndex = dayOfYear % TARGET_INDUSTRIES.length;
      }
    } catch {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      industryIndex = dayOfYear % TARGET_INDUSTRIES.length;
    }

    const currentIndustry = TARGET_INDUSTRIES[industryIndex];
    const queries = INDUSTRY_QUERIES[currentIndustry];
    console.log(`🎯 Firecrawl prospecting: ${currentIndustry} (index ${industryIndex})`);

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
    let skippedDomain = 0;
    let totalSearchResults = 0;
    const processedDomains = new Set<string>();

    // Step 1: Search for companies/people using Firecrawl Search
    for (const query of queries) {
      try {
        console.log(`🔍 Searching: ${query.substring(0, 60)}...`);

        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            limit: 10,
            lang: "en",
            country: "za",
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        if (!searchRes.ok) {
          console.error(`Search failed [${searchRes.status}]: ${await searchRes.text()}`);
          continue;
        }

        const searchData = await searchRes.json();
        const results = searchData.data || [];
        totalSearchResults += results.length;

        for (const result of results) {
          const url = result.url || "";
          if (!url) continue;

          let domain: string;
          try { domain = new URL(url).hostname.replace("www.", ""); } catch { continue; }

          // Skip excluded domains
          if (!isTargetDomain(domain)) {
            skippedDomain++;
            continue;
          }

          // Skip already-processed domains this run
          if (processedDomains.has(domain)) continue;
          processedDomains.add(domain);

          // Extract company name from result title or domain
          const companyName = result.title?.replace(/\s*[-|–].*$/, "").replace(/\s*\(.*?\)\s*/g, "").trim() || domain;

          // Look for emails + HR title mentions in the scraped content
          const content = result.markdown || result.description || "";
          const hasHRTitle = HR_TITLES_PATTERN.test(content) || HR_TITLES_PATTERN.test(result.title || "");

          // Extract emails from search result content
          let emails = extractEmails(content).filter(e => isQualityEmail(e));

          // If no emails found in search result, try scraping the company's contact page
          if (emails.length === 0) {
            for (const path of ["/contact", "/contact-us", "/about/leadership", "/about"]) {
              try {
                const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
                  body: JSON.stringify({
                    url: `https://${domain}${path}`,
                    formats: ["markdown"],
                    onlyMainContent: false,
                    timeout: 10000,
                  }),
                });

                if (scrapeRes.ok) {
                  const scrapeData = await scrapeRes.json();
                  const pageContent = scrapeData.data?.markdown || scrapeData.markdown || "";
                  const pageEmails = extractEmails(pageContent).filter(e => isQualityEmail(e));

                  // Prefer emails from the company's own domain
                  const domainEmails = pageEmails.filter(e => e.includes(domain.replace("www.", "")));
                  if (domainEmails.length > 0) {
                    emails = domainEmails;
                    break;
                  }
                  if (pageEmails.length > 0 && emails.length === 0) {
                    emails = pageEmails;
                  }
                }
              } catch { /* continue to next path */ }
            }
          }

          // Process found emails
          for (const email of emails.slice(0, 2)) {
            if (!isQualityEmail(email)) {
              skippedQuality++;
              continue;
            }

            if (existingEmails.has(email)) {
              skippedDup++;
              continue;
            }

            // Extract a contact name from email if possible
            const contactName = extractNameFromEmail(email);

            const { error } = await supabase.from("warm_outreach_queue").insert({
              company_name: companyName,
              company_website: `https://${domain}`,
              contact_name: contactName,
              contact_title: hasHRTitle ? "HR / L&D Decision Maker" : "",
              contact_email: email,
              source_keyword: `firecrawl:${currentIndustry}`,
              status: "pending",
            });

            if (!error) {
              addedCount++;
              existingEmails.add(email);
              console.log(`✅ Added: ${email} @ ${companyName}`);
            } else {
              console.error(`Insert error for ${email}:`, error.message);
            }
          }
        }
      } catch (err) {
        console.error(`Error on query:`, err);
      }
    }

    const summary = `Firecrawl Prospecting: ${currentIndustry}\nSearch results: ${totalSearchResults} | Added: ${addedCount} | Dup: ${skippedDup} | Bad email: ${skippedQuality} | Excluded domain: ${skippedDomain}`;
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
            search_results: totalSearchResults,
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
        search_results: totalSearchResults,
        prospects_added: addedCount,
        skipped_duplicate: skippedDup,
        skipped_bad_email: skippedQuality,
        skipped_excluded_domain: skippedDomain,
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
