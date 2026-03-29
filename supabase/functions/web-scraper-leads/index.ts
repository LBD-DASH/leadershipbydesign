import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// EXCLUDED INDUSTRIES — never target these
// ═══════════════════════════════════════════════════════════════
const EXCLUDED_INDUSTRIES = [
  "financial services", "insurance", "banking", "education",
  "investment banking", "venture capital", "private equity",
  "fund management", "capital markets", "consulting",
  "management consulting", "securities", "brokerage",
  "reinsurance", "wealth management", "asset management",
  "fintech", "stockbroking", "pension", "retirement fund",
  "actuarial", "investment",
];

const DISQUALIFIED_KEYWORDS = [
  "ngo", "non-profit", "nonprofit",
  "charity", "news", "journalism", "association",
  "trade union", "competitor", "coaching company",
  "bank", "insurer", "university", "college", "school",
];

function classifyIndustry(
  companyName: string,
  website: string,
  title: string,
  sourceKeyword: string,
  scrapeSummary: string,
): { qualified: boolean; industry: string; reason: string } {
  const text = `${companyName} ${website} ${title} ${sourceKeyword} ${scrapeSummary}`.toLowerCase();
  for (const kw of DISQUALIFIED_KEYWORDS) {
    if (text.includes(kw)) return { qualified: false, industry: kw, reason: `Disqualified: matches "${kw}"` };
  }
  for (const ex of EXCLUDED_INDUSTRIES) {
    if (text.includes(ex)) return { qualified: false, industry: ex, reason: `Excluded industry: "${ex}"` };
  }
  // All other industries are qualified — extract best industry label from source
  const industry = sourceKeyword.replace(/^(apollo:|signal-search:)/, "") || "general";
  return { qualified: true, industry, reason: "" };
}

// ═══════════════════════════════════════════════════════════════
// APOLLO SEARCH CONFIG — primary source for named contacts
// Rotates industry group every 3 days to cover all target sectors
// EXCLUDED: banks, FSI, insurance, education, consulting
// ═══════════════════════════════════════════════════════════════
const APOLLO_INDUSTRY_ROTATION = [
  ["Accounting", "Legal", "Staffing and Recruiting", "Human Resources", "Professional Training and Coaching"],
  ["Information Technology", "Computer Software", "Telecommunications", "Internet", "Computer Hardware"],
  ["Manufacturing", "Industrial Automation", "Mechanical Engineering", "Electrical Engineering", "Plastics"],
  ["Retail", "Consumer Goods", "Food & Beverages", "Wholesale", "Supermarkets"],
  ["Hospital & Health Care", "Pharmaceuticals", "Medical Devices", "Health Wellness and Fitness"],
  ["Construction", "Real Estate", "Architecture & Planning", "Civil Engineering", "Building Materials"],
  ["Logistics and Supply Chain", "Transportation", "Mining & Metals", "Oil & Energy", "Utilities"],
  ["Media Production", "Marketing and Advertising", "Hospitality", "Leisure Travel & Tourism", "Events Services"],
];

const APOLLO_TITLES = [
  "Head of HR", "HR Director", "HR Manager", "People Director",
  "Chief People Officer", "L&D Manager", "Talent Lead",
  "Head of People", "Learning and Development Manager",
  "Head of Talent", "People & Culture Manager",
  "Talent Director", "Head of Organisational Development",
  "Head of OD", "Head of Learning", "Director of People",
  "VP People", "VP Human Resources", "Head of People & Culture",
  "Group Head of HR", "Head of Leadership Development",
];

// ═══════════════════════════════════════════════════════════════
// FIRECRAWL SIGNAL QUERIES — fallback for additional leads
// Broad industry coverage, excluding banks/FSI/insurance/education/consulting
// ═══════════════════════════════════════════════════════════════
const SEARCH_QUERIES = [
  // Manufacturing & Engineering
  { query: '"HR Director" OR "Head of HR" manufacturing South Africa -site:linkedin.com -site:pnet.co.za', tag: 'hr-manufacturing' },
  { query: '"Head of People" OR "People Director" engineering OR construction South Africa', tag: 'people-engineering' },
  // Technology & Telecoms
  { query: '"HR Manager" OR "Head of People" "software" OR "IT services" OR "technology" Johannesburg', tag: 'hr-tech-jhb' },
  { query: '"Chief People Officer" OR "Talent Director" technology OR telecoms South Africa', tag: 'cpo-tech' },
  // Healthcare & Pharma
  { query: '"HR Director" OR "Head of HR" healthcare OR pharmaceutical South Africa', tag: 'hr-healthcare' },
  { query: '"learning and development" manager healthcare OR medical South Africa', tag: 'ld-healthcare' },
  // Retail & FMCG
  { query: '"HR Director" OR "Head of People" retail OR FMCG OR "consumer goods" South Africa', tag: 'hr-retail' },
  { query: '"talent development" OR "people and culture" director retail OR wholesale Gauteng', tag: 'talent-retail-gauteng' },
  // Logistics, Mining & Energy
  { query: '"HR Manager" OR "Head of HR" logistics OR mining OR energy South Africa', tag: 'hr-logistics-mining' },
  { query: '"Head of People" OR "People Director" transport OR supply chain South Africa', tag: 'people-logistics' },
  // Legal & Accounting
  { query: '"HR Director" OR "Head of People" "law firm" OR accounting South Africa', tag: 'hr-legal-accounting' },
  { query: '"learning and development" manager legal OR accounting Johannesburg Cape Town', tag: 'ld-legal' },
  // Hospitality & Media
  { query: '"HR Director" OR "Head of HR" hospitality OR tourism OR hotel South Africa', tag: 'hr-hospitality' },
  { query: '"Head of People" OR "People Director" media OR advertising OR events South Africa', tag: 'people-media' },
  // Construction & Real Estate
  { query: '"HR Manager" OR "Head of HR" construction OR "real estate" OR property South Africa', tag: 'hr-construction' },
  { query: '"coaching culture" OR "leadership pipeline" manufacturing OR construction South Africa company', tag: 'coaching-culture-mfg' },
];
const QUERIES_PER_RUN = 2;

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
  "/contact", "/about", "/about-us", "/our-team",
];

const GENERIC_PREFIXES = [
  "info", "admin", "support", "hello", "contact", "contacts", "contactus",
  "contactshello", "sales", "enquiries", "enquiry",
  "reception", "office", "no-reply", "noreply", "webmaster", "marketing",
  "news", "documents", "membership", "careers", "hr", "jobs", "media",
  "press", "feedback", "compliance", "legal", "service", "help",
  "clientservice", "clientservices", "assetmanagement", "investments",
  "claims", "queries", "applications", "treasury", "operations",
  "accounts", "billing", "general", "team", "group", "corporate",
  "investor", "shareholders", "communications", "communications2",
  "procurement", "training", "editor", "pr", "subscribe", "mail",
  "postmaster", "abuse", "newsletter", "do-not-reply", "donotreply",
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
  if (prefix.length < 2) return false;
  // Accept personal emails: first.last, first_last, or short names (3+ chars)
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
      // Only disqualify if explicitly too small (<50) or too large (>5000)
      if (count < 50 || count > 500) return false;
    }
  }
  // If no headcount found, let it through (most company pages don't mention it)
  return true;
}

function extractCompanyName(content: string, domain: string): string {
  const titleMatch = content.match(/(?:^|\n)#\s+(.+?)(?:\n|$)/);
  if (titleMatch) {
    const name = titleMatch[1].trim();
    // Skip error pages, generic titles, and navigation-like text
    const skipPatterns = /error|404|not found|page not|access denied|forbidden|untitled|contact us|please use|cookie|privacy|sign in|log in|menu|navigation/i;
    if (name.length > 2 && name.length < 40 && !skipPatterns.test(name)) return name;
  }
  const parts = domain.replace(/\.co\.za$|\.com$|\.co$|\.org$|\.net$/, "").split(".");
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

// Only accept domains that are likely South African companies
const SA_DOMAIN_INDICATORS = [".co.za", ".org.za", ".net.za", ".ac.za"];
function isSouthAfricanDomain(domain: string): boolean {
  // Accept .co.za domains and also .com/.org if they appear in SA-focused searches
  // But reject obvious non-SA platforms
  const nonSAplatforms = ["theorg.com", "intch.org", "glassdoor.com", "crunchbase.com", "zoominfo.com", "apollo.io", "skillsforafrica.org"];
  for (const p of nonSAplatforms) {
    if (domain === p || domain.endsWith("." + p)) return false;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY");

  try {
    console.log("🚀 web-scraper-leads invoked at", new Date().toISOString());
    const startTime = Date.now();
    const MAX_RUNTIME_MS = 50000; // 50s hard limit — return before 60s edge function timeout
    function isTimedOut(): boolean { return Date.now() - startTime > MAX_RUNTIME_MS; }

    // Load existing emails and domains for dedup
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

    let apolloAdded = 0;
    let apolloSkipped = 0;
    let firecrawlAdded = 0;
    let firecrawlSkippedDup = 0;
    let firecrawlSkippedQuality = 0;
    let disqualifiedCount = 0;
    const industriesFound: string[] = [];

    // ═══════════════════════════════════════════════════════════
    // PHASE 1: APOLLO — primary source for named decision-makers
    // ═══════════════════════════════════════════════════════════
    if (apolloApiKey) {
      // Rotate industry group every 3 days
      const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      const groupIdx = Math.floor(daysSinceEpoch / 3) % APOLLO_INDUSTRY_ROTATION.length;
      const todaysIndustries = APOLLO_INDUSTRY_ROTATION[groupIdx];
      const targetIndustry = todaysIndustries.join(" OR ");

      console.log(`\n🔷 PHASE 1: Apollo search — Group ${groupIdx}: ${todaysIndustries.join(", ")}`);

      try {
        const apolloRes = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
          body: JSON.stringify({
            page: 1,
            per_page: 15,
            person_titles: APOLLO_TITLES,
            person_locations: ["Gauteng, South Africa", "South Africa"],
            organization_num_employees_ranges: ["1-10", "11-20", "21-50", "51-100", "101-200", "201-500"],
            q_keywords: targetIndustry,
          }),
        });

        if (!apolloRes.ok) {
          const errText = await apolloRes.text();
          console.error(`Apollo API error [${apolloRes.status}]: ${errText}`);
        } else {
          const apolloData = await apolloRes.json();
          const people = apolloData.people || [];
          console.log(`  📊 Apollo returned ${people.length} contacts`);

          for (const p of people) {
            const email = (p.email || "").toLowerCase().trim();
            if (!email || !email.includes("@")) {
              apolloSkipped++;
              continue;
            }

            // Skip generic emails
            const prefix = email.split("@")[0];
            if (GENERIC_PREFIXES.some(g => prefix === g)) {
              apolloSkipped++;
              continue;
            }

            // Skip kevin@ and own domain
            if (email.includes("kevin@") || email.includes("leadershipbydesign")) {
              apolloSkipped++;
              continue;
            }

            // Dedup
            if (existingEmails.has(email)) {
              apolloSkipped++;
              continue;
            }

            const companyName = p.organization?.name || "";
            const companyWebsite = p.organization?.website_url || "";
            const contactName = `${p.first_name || ""} ${p.last_name || ""}`.trim();
            const contactTitle = p.title || "";
            const phone = p.phone_numbers?.[0]?.sanitized_number || "";
            const linkedinUrl = p.linkedin_url || "";

            // Industry classification
            const classification = classifyIndustry(
              companyName, companyWebsite, contactTitle, targetIndustry, ""
            );

            if (!classification.qualified) {
              // Insert as disqualified for tracking
              await supabase.from("warm_outreach_queue").insert({
                company_name: companyName,
                company_website: companyWebsite || null,
                contact_name: contactName,
                contact_email: email,
                contact_title: contactTitle,
                contact_phone: phone,
                source_keyword: `apollo:${targetIndustry}`,
                status: "disqualified",
                industry: classification.industry,
                disqualified: true,
                disqualified_reason: classification.reason,
              });
              disqualifiedCount++;
              continue;
            }

            const { error } = await supabase.from("warm_outreach_queue").insert({
              company_name: companyName,
              company_website: companyWebsite || null,
              contact_name: contactName,
              contact_email: email,
              contact_title: contactTitle,
              contact_phone: phone,
              source_keyword: `apollo:${targetIndustry}`,
              status: "pending",
              industry: classification.industry,
              score: 70, // Apollo contacts score higher — named decision-makers
            });

            if (!error) {
              apolloAdded++;
              existingEmails.add(email);
              if (companyWebsite) {
                try { existingDomains.add(getRootDomain(new URL(companyWebsite).hostname)); } catch {}
              }
              console.log(`  ✅ Apollo: ${contactName} (${contactTitle}) @ ${companyName} — ${email}`);
              if (!industriesFound.includes(classification.industry)) industriesFound.push(classification.industry);
            } else {
              console.error(`  ❌ Insert error: ${error.message}`);
            }
          }
        }
      } catch (e) {
        console.error("Apollo search error:", e);
      }

      console.log(`  📊 Apollo result: ${apolloAdded} added, ${apolloSkipped} skipped`);
    } else {
      console.log("⚠️ APOLLO_API_KEY not set — skipping Phase 1");
    }

    // ═══════════════════════════════════════════════════════════
    // PHASE 2: FIRECRAWL — fallback for additional leads
    // ═══════════════════════════════════════════════════════════
    if (firecrawlKey) {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const startIdx = (dayOfYear * QUERIES_PER_RUN) % SEARCH_QUERIES.length;
      const runQueries: typeof SEARCH_QUERIES = [];
      for (let i = 0; i < QUERIES_PER_RUN; i++) {
        runQueries.push(SEARCH_QUERIES[(startIdx + i) % SEARCH_QUERIES.length]);
      }

      console.log(`\n🔶 PHASE 2: Firecrawl signal search — ${runQueries.map(q => q.tag).join(", ")}`);

      let domainsDiscovered = 0;
      let pagesScraped = 0;

      for (const sq of runQueries) {
        if (isTimedOut()) { console.log("⏱️ Timeout — stopping Firecrawl phase early"); break; }
        console.log(`\n  🔎 Query [${sq.tag}]`);

        let searchResults: any[] = [];
        try {
          const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
            method: "POST",
            headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({ query: sq.query, limit: 5 }),
          });

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            searchResults = searchData.data || searchData.results || [];
            console.log(`    📊 Got ${searchResults.length} search results`);
          } else {
            console.error(`    ❌ Search failed: ${searchRes.status}`);
            continue;
          }
        } catch (e) {
          console.error(`    ❌ Search error:`, e);
          continue;
        }

        const discoveredDomains = new Map<string, { url: string; title: string; snippet: string }>();
        for (const result of searchResults) {
          const url = result.url || result.link || "";
          const domain = extractDomainFromUrl(url);
          if (!domain || existingDomains.has(domain) || discoveredDomains.has(domain) || !isSouthAfricanDomain(domain)) continue;
          discoveredDomains.set(domain, {
            url, title: result.title || "", snippet: result.description || result.markdown || "",
          });
        }
        domainsDiscovered += discoveredDomains.size;

        let domainsScrapeCount = 0;
        for (const [domain, info] of discoveredDomains) {
          if (domainsScrapeCount >= 2) break; // Max 2 domains per query to stay within 60s timeout
          if (isTimedOut()) { console.log("⏱️ Timeout — stopping domain scraping"); break; }
          if (existingDomains.has(domain)) { firecrawlSkippedDup++; continue; }

          let bestEmails: string[] = [];
          let pageContent = info.snippet;

          if (!passesHeadcountFilter(info.snippet)) continue;
          domainsScrapeCount++;

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
                  timeout: 10000,
                }),
              });
              pagesScraped++;

              if (scrapeRes.ok) {
                const scrapeData = await scrapeRes.json();
                const content = scrapeData.data?.markdown || scrapeData.markdown || "";
                pageContent += " " + content;

                if (!passesHeadcountFilter(content)) { bestEmails = []; break; }

                const emails = extractEmails(content).filter((e) => isQualityEmail(e, domain));
                for (const email of emails) {
                  if (!bestEmails.includes(email)) bestEmails.push(email);
                }
                if (bestEmails.length > 0) break;
              }
            } catch { /* skip */ }
          }

          const companyName = extractCompanyName(pageContent, domain);
          const classification = classifyIndustry(companyName, domain, "", sq.tag, pageContent.substring(0, 2000));

          if (!classification.qualified) {
            disqualifiedCount++;
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

          if (!industriesFound.includes(classification.industry)) industriesFound.push(classification.industry);

          for (const email of bestEmails.slice(0, 2)) {
            if (existingEmails.has(email)) { firecrawlSkippedDup++; continue; }
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
              score: 60,
            });

            if (!error) {
              firecrawlAdded++;
              existingEmails.add(email);
              existingDomains.add(domain);
              console.log(`    ✅ Firecrawl: ${email} @ ${companyName}`);
            }
          }

          if (bestEmails.length === 0) firecrawlSkippedQuality++;
        }
      }

      console.log(`  📊 Firecrawl result: ${firecrawlAdded} added, ${domainsDiscovered} domains, ${pagesScraped} pages`);
    } else {
      console.log("⚠️ FIRECRAWL_API_KEY not set — skipping Phase 2");
    }

    // ═══════════════════════════════════════════════════════════
    // SUMMARY & SLACK
    // ═══════════════════════════════════════════════════════════
    const totalAdded = apolloAdded + firecrawlAdded;
    const summary = `Lead Prospecting Complete\n🔷 Apollo: ${apolloAdded} added (${apolloSkipped} skipped)\n🔶 Firecrawl: ${firecrawlAdded} added\n❌ Disqualified: ${disqualifiedCount}\n🏭 Industries: ${industriesFound.join(", ") || "none"}`;
    console.log(`\n✅ ${summary}`);

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "daily_pipeline_complete",
          data: {
            industry: `Apollo + Signal Search (${industriesFound.join(", ") || "none"})`,
            added: totalAdded,
            apollo_added: apolloAdded,
            firecrawl_added: firecrawlAdded,
            disqualified: disqualifiedCount,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(
      JSON.stringify({
        success: true,
        apollo_added: apolloAdded,
        apollo_skipped: apolloSkipped,
        firecrawl_added: firecrawlAdded,
        disqualified: disqualifiedCount,
        total_added: totalAdded,
        industries: industriesFound,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
      JSON.stringify({ error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
