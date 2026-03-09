import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// QUALIFIED INDUSTRIES — only these enter the pipeline
// ═══════════════════════════════════════════════════════════════
const QUALIFIED_INDUSTRIES = [
  "financial services", "insurance", "banking", "accounting",
  "legal", "professional services", "wealth management",
  "asset management", "investment", "advisory", "consulting",
  "audit", "tax", "actuarial", "fund management", "stockbroking",
];

// Industries/keywords that should NEVER enter the pipeline
const DISQUALIFIED_KEYWORDS = [
  "transport", "logistics", "ngo", "non-profit", "nonprofit",
  "charity", "news", "media", "journalism", "association",
  "trade union", "competitor", "coaching company",
  "recruitment", "staffing", "temp agency",
];

function classifyIndustry(
  companyName: string,
  website: string,
  title: string,
  sourceKeyword: string,
  scrapeSummary: string,
): { qualified: boolean; industry: string; reason: string } {
  const text = `${companyName} ${website} ${title} ${sourceKeyword} ${scrapeSummary}`.toLowerCase();

  // Check disqualified first
  for (const kw of DISQUALIFIED_KEYWORDS) {
    if (text.includes(kw)) {
      return { qualified: false, industry: kw, reason: `Disqualified: matches "${kw}"` };
    }
  }

  // Check qualified
  for (const ind of QUALIFIED_INDUSTRIES) {
    if (text.includes(ind)) {
      return { qualified: true, industry: ind, reason: "" };
    }
  }

  // Default: disqualified (doesn't match any target industry)
  return { qualified: false, industry: "unknown", reason: "No matching target industry found" };
}

// ═══════════════════════════════════════════════════════════════
// SIGNAL-BASED SEARCH QUERIES — rotated daily, 4 per run
// ═══════════════════════════════════════════════════════════════
const SEARCH_QUERIES = [
  { query: '"HR Manager" OR "People Manager" "financial services" Johannesburg site:linkedin.com', tag: 'linkedin-hr-fsi' },
  { query: '"learning and development" vacancy South Africa financial services 2025', tag: 'ld-vacancy-fsi' },
  { query: '"HR Manager" wanted insurance OR accounting OR "wealth management" Johannesburg', tag: 'hr-insurance-accounting' },
  { query: '"leadership development" "our people" "financial services" OR "insurance" South Africa', tag: 'leadership-dev-signal' },
  { query: '"people and culture" manager vacancy Johannesburg 2025', tag: 'people-culture-jhb' },
  { query: '"talent development" OR "learning and development" manager "professional services" South Africa', tag: 'talent-dev-proserv' },
  { query: '"HR" vacancy "short term insurance" OR "life insurance" OR "asset management" South Africa', tag: 'hr-vacancy-insurance' },
  { query: '"coaching" OR "leadership" "our values" "financial services" Johannesburg staff', tag: 'coaching-values-fsi' },
  { query: 'site:pnet.co.za "HR Manager" OR "L&D Manager" financial services', tag: 'pnet-hr-fsi' },
  { query: 'site:careerjunction.co.za "HR" OR "people" manager insurance OR accounting', tag: 'careerjunction-hr' },
];

const QUERIES_PER_RUN = 4;

// Domains to always skip
const EXCLUDED_DOMAINS = new Set([
  "linkedin.com", "facebook.com", "twitter.com", "instagram.com", "youtube.com",
  "tiktok.com", "pinterest.com", "reddit.com",
  "pnet.co.za", "careerjunction.co.za", "indeed.com", "glassdoor.com",
  "careers24.com", "jobvine.co.za", "executiveplacements.com",
  "news24.com", "businesslive.co.za", "fin24.com", "iol.co.za", "ewn.co.za",
  "dailymaverick.co.za", "timeslive.co.za", "mg.co.za", "moneyweb.co.za",
  "bizcommunity.com", "itweb.co.za", "techcentral.co.za",
  "wikipedia.org", "gov.za", "ac.za",
  "gartner.com", "mckinsey.com", "deloitte.com", "pwc.co.za", "ey.com", "kpmg.co.za",
  "leadershipbydesign.co.za", "leadershipbydesign.lovable.app",
]);

const CONTACT_PATHS = [
  "/contact", "/contact-us", "/about/leadership", "/about/our-team",
  "/about", "/about-us", "/people", "/leadership", "/our-team",
];

const GENERIC_PREFIXES = [
  "info", "admin", "support", "hello", "contact", "sales", "enquiries",
  "reception", "office", "no-reply", "noreply", "webmaster", "marketing",
  "news", "documents", "membership", "careers", "hr", "jobs", "media",
  "press", "feedback", "compliance", "legal", "service", "help",
  "clientservice", "clientservices", "assetmanagement", "investments",
  "claims", "queries", "applications", "treasury", "operations",
  "accounts", "billing", "general", "team", "group", "corporate",
  "investor", "shareholders", "communications", "procurement",
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function getRootDomain(hostname: string): string {
  return hostname.replace(/^www\./, "").toLowerCase();
}

function isExcludedDomain(domain: string): boolean {
  const root = getRootDomain(domain);
  for (const ex of EXCLUDED_DOMAINS) {
    if (root === ex || root.endsWith("." + ex)) return true;
  }
  return false;
}

function extractDomainFromUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname;
    const root = getRootDomain(hostname);
    if (isExcludedDomain(root)) return null;
    return root;
  } catch {
    return null;
  }
}

function isQualityEmail(email: string, companyDomain: string): boolean {
  if (!email || !email.includes("@")) return false;
  const prefix = email.split("@")[0].toLowerCase();
  const emailDomain = email.split("@")[1].toLowerCase();

  if (GENERIC_PREFIXES.some((g) => prefix === g || prefix.startsWith(g + "."))) return false;

  const rootDomain = companyDomain.replace("www.", "");
  if (!emailDomain.includes(rootDomain) && !rootDomain.includes(emailDomain.split(".")[0])) return false;

  if (prefix.length < 3) return false;
  if (!prefix.includes(".") && !prefix.includes("_")) return false;

  return true;
}

function extractEmails(text: string): string[] {
  return [...new Set((text.match(EMAIL_REGEX) || []).map((e) => e.toLowerCase()))];
}

function extractNameFromEmail(email: string): string {
  const prefix = email.split("@")[0];
  return prefix.split(/[._-]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

function findTitleNearEmail(content: string, email: string): string {
  const HR_PATTERNS = [
    /(?:HR|Human Resources)\s*(?:Director|Executive|Manager|Head)/i,
    /(?:Head|Director|Manager)\s*(?:of\s*)?(?:HR|Human Resources|People|L&D|Learning|Talent|OD)/i,
    /Chief\s*(?:People|Human Resources)\s*Officer/i,
    /CHRO/i,
    /(?:VP|Vice President)\s*(?:of\s*)?(?:People|HR|Human Resources)/i,
  ];
  const emailIdx = content.toLowerCase().indexOf(email.toLowerCase());
  if (emailIdx === -1) return "";
  const window = content.substring(Math.max(0, emailIdx - 500), Math.min(content.length, emailIdx + 500));
  for (const pattern of HR_PATTERNS) {
    const match = window.match(pattern);
    if (match) return match[0];
  }
  return "";
}

function passesHeadcountFilter(content: string): boolean {
  const patterns = [
    /(\d[\d,]+)\s*(?:employees|staff|people|team members)/i,
    /(?:team|staff|workforce)\s*(?:of\s*)?(\d[\d,]+)/i,
    /(\d[\d,]+)\+?\s*(?:strong|professionals)/i,
  ];
  for (const p of patterns) {
    const match = content.match(p);
    if (match) {
      const count = parseInt(match[1].replace(/,/g, ""), 10);
      if (count < 100 || count > 500) return false; // Updated: 100-500 preferred
    }
  }
  return true;
}

function extractCompanyName(content: string, domain: string): string {
  const titleMatch = content.match(/(?:^|\n)#\s+(.+?)(?:\n|$)/);
  if (titleMatch) {
    const name = titleMatch[1].trim();
    if (name.length > 2 && name.length < 60) return name;
  }
  const parts = domain.replace(/\.co\.za$|\.com$|\.co$/, "").split(".");
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
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("🚀 web-scraper-leads invoked at", new Date().toISOString());
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const startIdx = (dayOfYear * QUERIES_PER_RUN) % SEARCH_QUERIES.length;
    const runQueries: typeof SEARCH_QUERIES = [];
    for (let i = 0; i < QUERIES_PER_RUN; i++) {
      runQueries.push(SEARCH_QUERIES[(startIdx + i) % SEARCH_QUERIES.length]);
    }

    console.log(`🔍 Signal search — ${runQueries.length} queries: ${runQueries.map(q => q.tag).join(", ")}`);

    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email, company_website")
      .not("contact_email", "is", null);

    const existingEmails = new Set(
      (existingRows || []).map((r: any) => r.contact_email?.toLowerCase())
    );
    const existingDomains = new Set(
      (existingRows || []).map((r: any) => {
        try { return getRootDomain(new URL(r.company_website || "").hostname); } catch { return ""; }
      }).filter(Boolean)
    );

    let addedCount = 0;
    let skippedDup = 0;
    let skippedQuality = 0;
    let disqualifiedCount = 0;
    let domainsDiscovered = 0;
    let pagesScraped = 0;
    const industriesFound: string[] = [];

    for (const sq of runQueries) {
      console.log(`\n🔎 Query [${sq.tag}]: ${sq.query.substring(0, 80)}...`);

      let searchResults: any[] = [];
      try {
        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ query: sq.query, limit: 10 }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          searchResults = searchData.data || searchData.results || [];
          console.log(`  📊 Got ${searchResults.length} search results`);
        } else {
          console.error(`  ❌ Search failed: ${searchRes.status}`);
          continue;
        }
      } catch (e) {
        console.error(`  ❌ Search error:`, e);
        continue;
      }

      const discoveredDomains = new Map<string, { url: string; title: string; snippet: string }>();
      for (const result of searchResults) {
        const url = result.url || result.link || "";
        const domain = extractDomainFromUrl(url);
        if (!domain || existingDomains.has(domain) || discoveredDomains.has(domain)) continue;
        discoveredDomains.set(domain, {
          url,
          title: result.title || "",
          snippet: result.description || result.markdown || "",
        });
      }

      domainsDiscovered += discoveredDomains.size;
      console.log(`  🏢 ${discoveredDomains.size} new company domains found`);

      for (const [domain, info] of discoveredDomains) {
        if (existingDomains.has(domain)) { skippedDup++; continue; }

        let bestEmails: string[] = [];
        let pageContent = info.snippet;

        if (!passesHeadcountFilter(info.snippet)) {
          console.log(`  ⏭️ ${domain} — headcount outside 100-500`);
          continue;
        }

        for (const path of CONTACT_PATHS) {
          if (bestEmails.length >= 2) break;
          try {
            const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
              method: "POST",
              headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                url: `https://${domain}${path}`,
                formats: ["markdown"],
                onlyMainContent: false,
                timeout: 15000,
              }),
            });
            pagesScraped++;

            if (scrapeRes.ok) {
              const scrapeData = await scrapeRes.json();
              const content = scrapeData.data?.markdown || scrapeData.markdown || "";
              pageContent += " " + content;

              if (!passesHeadcountFilter(content)) {
                console.log(`  ⏭️ ${domain} — headcount outside 100-500 (from ${path})`);
                bestEmails = [];
                break;
              }

              const emails = extractEmails(content).filter((e) => isQualityEmail(e, domain));
              for (const email of emails) {
                if (!bestEmails.includes(email)) bestEmails.push(email);
              }

              if (bestEmails.length > 0) {
                console.log(`  📧 Found ${bestEmails.length} email(s) on ${domain}${path}`);
                break;
              }
            }
          } catch { /* skip failed scrape */ }
        }

        // ── INDUSTRY QUALIFICATION GATE ──
        const companyName = extractCompanyName(pageContent, domain);
        const classification = classifyIndustry(companyName, domain, "", sq.tag, pageContent.substring(0, 2000));

        if (!classification.qualified) {
          console.log(`  ❌ Disqualified: ${companyName} — ${classification.reason}`);
          disqualifiedCount++;

          // Still insert but mark as disqualified for tracking
          if (bestEmails.length > 0) {
            await supabase.from("warm_outreach_queue").insert({
              company_name: companyName,
              company_website: `https://${domain}`,
              contact_name: extractNameFromEmail(bestEmails[0]),
              contact_email: bestEmails[0],
              source_keyword: `signal-search:${sq.tag}`,
              status: "disqualified",
              industry: classification.industry,
              disqualified: true,
              disqualified_reason: classification.reason,
            });
          }
          continue;
        }

        if (!industriesFound.includes(classification.industry)) {
          industriesFound.push(classification.industry);
        }

        for (const email of bestEmails.slice(0, 2)) {
          if (existingEmails.has(email)) { skippedDup++; continue; }

          const title = findTitleNearEmail(pageContent, email);
          const contactName = extractNameFromEmail(email);

          const { error } = await supabase.from("warm_outreach_queue").insert({
            company_name: companyName,
            company_website: `https://${domain}`,
            contact_name: contactName,
            contact_title: title || "",
            contact_email: email,
            source_keyword: `signal-search:${sq.tag}`,
            status: "pending",
            industry: classification.industry,
            score: 60, // Default score for scraper leads
          });

          if (!error) {
            addedCount++;
            existingEmails.add(email);
            existingDomains.add(domain);
            console.log(`  ✅ Added: ${email} (${contactName}) @ ${companyName} [${classification.industry}]`);
          } else {
            console.error(`  ❌ Insert error for ${email}:`, error.message);
          }
        }

        if (bestEmails.length === 0) {
          skippedQuality++;
        }
      }
    }

    const summary = `Signal Search Prospecting\nQueries: ${runQueries.map(q => q.tag).join(", ")}\nDomains found: ${domainsDiscovered} | Pages scraped: ${pagesScraped} | Added: ${addedCount} | Disqualified: ${disqualifiedCount} | Dup: ${skippedDup} | No email: ${skippedQuality}`;
    console.log(`\n✅ ${summary}`);

    // Slack notification
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "daily_pipeline_complete",
          data: {
            industry: `Signal Search (${industriesFound.join(", ") || "none"})`,
            added: addedCount,
            disqualified: disqualifiedCount,
            domains_discovered: domainsDiscovered,
            pages_scraped: pagesScraped,
            skipped_dup: skippedDup,
            skipped_no_email: skippedQuality,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(
      JSON.stringify({
        success: true,
        queries_used: runQueries.map(q => q.tag),
        domains_discovered: domainsDiscovered,
        pages_scraped: pagesScraped,
        prospects_added: addedCount,
        disqualified: disqualifiedCount,
        industries: industriesFound,
        skipped_duplicate: skippedDup,
        skipped_no_email: skippedQuality,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("web-scraper-leads error:", errMsg);
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "web-scraper-leads", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
