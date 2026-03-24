import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// QUALIFIED INDUSTRIES — these enter the pipeline (multi-vertical)
// Rotates daily across verticals. Target: companies ≤500 employees.
// ═══════════════════════════════════════════════════════════════
const QUALIFIED_INDUSTRIES = [
  // Financial Services & Insurance (FSI)
  "financial services", "insurance", "banking", "accounting",
  "legal", "wealth management", "asset management", "investment",
  "advisory", "audit", "tax", "actuarial", "fund management",
  "stockbroking", "fintech", "private equity", "investment banking",
  "venture capital", "securities", "brokerage", "reinsurance",
  "pension", "retirement fund",
  // Professional Services
  "professional services", "consulting", "management consulting",
  "engineering", "architecture", "quantity surveying",
  // Technology
  "technology", "software", "saas", "it services", "cybersecurity",
  "data analytics", "cloud computing", "digital agency",
  // Healthcare & Pharma
  "healthcare", "pharmaceutical", "medical", "biotech",
  "health services", "wellness", "hospital", "clinic",
  // Manufacturing & Industrial
  "manufacturing", "industrial", "mining", "energy",
  "renewable energy", "construction", "building materials",
  // Retail & FMCG
  "retail", "fmcg", "consumer goods", "ecommerce", "wholesale",
  // Telecommunications
  "telecommunications", "telecom", "ict",
  // Agriculture & Agribusiness
  "agriculture", "agribusiness", "agritech", "farming",
  // Property & Real Estate
  "property", "real estate", "property management",
  // Education & Training
  "education", "edtech", "training provider",
  // Hospitality & Tourism
  "hospitality", "tourism", "hotel", "travel",
];

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
  for (const kw of DISQUALIFIED_KEYWORDS) {
    if (text.includes(kw)) return { qualified: false, industry: kw, reason: `Disqualified: matches "${kw}"` };
  }
  for (const ind of QUALIFIED_INDUSTRIES) {
    if (text.includes(ind)) return { qualified: true, industry: ind, reason: "" };
  }
  return { qualified: false, industry: "unknown", reason: "No matching target industry found" };
}

// ═══════════════════════════════════════════════════════════════
// CLAUDE CONNECTOR INDUSTRIES — daily rotation for prospect discovery
// One industry per day, ≤500 employees target
// ═══════════════════════════════════════════════════════════════
const CLAUDE_INDUSTRIES = [
  // Week 1: FSI
  "Financial Services", "Insurance", "Banking", "Accounting",
  "Investment Management", "Wealth Management", "Fintech",
  // Week 2: Professional Services & Tech
  "Management Consulting", "Legal Services", "Engineering",
  "Information Technology", "Software Development", "Cybersecurity",
  "Architecture & Planning",
  // Week 3: Healthcare & Manufacturing
  "Healthcare", "Pharmaceuticals", "Medical Devices",
  "Manufacturing", "Mining & Metals", "Renewable Energy",
  "Construction",
  // Week 4: Retail, Telecom, Agri, Property, Education, Hospitality
  "Retail", "Consumer Goods", "Telecommunications",
  "Agriculture", "Real Estate", "Education",
  "Hospitality", "Tourism",
];

const TARGET_TITLES = [
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
// ═══════════════════════════════════════════════════════════════
const SEARCH_QUERIES = [
  // FSI vertical
  { query: '"HR Director" OR "Head of HR" "financial services" South Africa -site:linkedin.com -site:pnet.co.za', tag: 'hr-director-fsi' },
  { query: '"Head of People" OR "Chief People Officer" insurance OR banking South Africa', tag: 'cpo-insurance-banking' },
  { query: '"HR Manager" OR "People Director" "asset management" OR "wealth management" Johannesburg', tag: 'hr-wealth-jhb' },
  { query: '"learning and development" manager "professional services" OR accounting South Africa', tag: 'ld-proserv' },
  { query: '"Head of Learning" OR "L&D Director" banking OR "investment management" South Africa', tag: 'ld-banking' },
  { query: '"Head of People" OR "People Director" fintech OR "private equity" South Africa', tag: 'people-fintech-pe' },
  // Technology vertical
  { query: '"HR Director" OR "Head of HR" "software" OR "technology" South Africa -site:linkedin.com', tag: 'hr-director-tech' },
  { query: '"Head of People" OR "Chief People Officer" "saas" OR "it services" OR "cybersecurity" South Africa', tag: 'cpo-tech' },
  { query: '"People & Culture" OR "Talent Director" "digital agency" OR "software development" Johannesburg Cape Town', tag: 'people-culture-tech' },
  // Healthcare & Pharma vertical
  { query: '"HR Director" OR "Head of HR" "healthcare" OR "pharmaceutical" South Africa -site:linkedin.com', tag: 'hr-director-health' },
  { query: '"Head of People" OR "Chief People Officer" "medical" OR "biotech" OR "hospital" South Africa', tag: 'cpo-healthcare' },
  { query: '"learning and development" manager "healthcare" OR "pharmaceutical" Gauteng', tag: 'ld-healthcare' },
  // Manufacturing & Industrial vertical
  { query: '"HR Director" OR "Head of HR" "manufacturing" OR "mining" South Africa -site:linkedin.com', tag: 'hr-director-manufacturing' },
  { query: '"Head of People" OR "People Director" "construction" OR "engineering" OR "energy" South Africa', tag: 'people-industrial' },
  { query: '"talent development" OR "organisational development" "manufacturing" OR "industrial" Gauteng', tag: 'od-manufacturing' },
  // Retail & FMCG vertical
  { query: '"HR Director" OR "Head of HR" "retail" OR "fmcg" OR "consumer goods" South Africa', tag: 'hr-director-retail' },
  { query: '"Head of People" OR "Chief People Officer" "ecommerce" OR "wholesale" South Africa', tag: 'cpo-retail' },
  // Telecom, Agri, Property, Education, Hospitality
  { query: '"HR Director" OR "Head of HR" "telecommunications" OR "ict" South Africa', tag: 'hr-director-telecom' },
  { query: '"Head of People" OR "People Director" "agriculture" OR "agribusiness" South Africa', tag: 'people-agri' },
  { query: '"HR Director" OR "Head of HR" "real estate" OR "property" OR "hospitality" South Africa', tag: 'hr-property-hospitality' },
  { query: '"Head of People" OR "Chief People Officer" "education" OR "edtech" South Africa', tag: 'cpo-education' },
  // Cross-industry leadership signals
  { query: '"coaching culture" OR "leadership pipeline" OR "leadership development" programme South Africa company', tag: 'coaching-culture-cross' },
  { query: '"people strategy" OR "organisational development" director South Africa company', tag: 'od-cross-industry' },
];
const QUERIES_PER_RUN = 3;

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
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

  try {
    console.log("🚀 web-scraper-leads invoked at", new Date().toISOString());

    // Rotate industry daily
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const industryIdx = dayOfYear % CLAUDE_INDUSTRIES.length;
    const targetIndustry = CLAUDE_INDUSTRIES[industryIdx];
    console.log(`🏭 Today's industry: ${targetIndustry} (day ${dayOfYear}, index ${industryIdx})`);

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

    let claudeAdded = 0;
    let claudeSkipped = 0;
    let firecrawlAdded = 0;
    let firecrawlSkippedDup = 0;
    let firecrawlSkippedQuality = 0;
    let disqualifiedCount = 0;
    const industriesFound: string[] = [];

    // ═══════════════════════════════════════════════════════════
    // PHASE 1: CLAUDE CONNECTOR — AI-powered prospect discovery
    // Finds 10 SA companies in today's industry (≤500 employees)
    // ═══════════════════════════════════════════════════════════
    if (anthropicKey) {
      console.log(`\n🔷 PHASE 1: Claude Connector — ${targetIndustry}`);

      try {
        const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system: `You are a prospecting research assistant for Leadership by Design (LBD), a South African leadership development company. Your job is to find 10 South African ${targetIndustry} companies with NO MORE THAN 500 employees that show pain signals indicating they need leadership coaching.\n\nTarget titles: ${TARGET_TITLES.join(", ")}\n\nFor each company, identify:\n- Company name, website, estimated employee count (must be ≤500), industry vertical\n- Decision maker: HR Director, CHRO, L&D Head, COO, or similar\n- Pain signals: manager turnover, rapid growth, hiring patterns, restructuring, new CEO\n- OS-readiness score (1-10): How ready they are for LBD's Operating System approach\n- Priority tier: HOT (score 7+), WARM (4-6), COLD (1-3)\n- Engagement hook: The specific pain signal to reference in outreach\n- Email pattern guess: firstname@company.co.za or similar\n\nIMPORTANT: Only include companies with ≤500 employees. Focus on SMEs and mid-market companies.\n\nReturn ONLY valid JSON array. No markdown, no explanation.`,
            messages: [
              {
                role: "user",
                content: `Find 10 South African ${targetIndustry} companies (≤500 employees) showing leadership development pain signals. Focus on companies in Johannesburg, Cape Town, and Durban. Look for recent news about: management changes, rapid growth, new offices, compliance issues, or digital transformation initiatives. Return as JSON array with fields: company_name, website, employee_count, industry_vertical, decision_maker_name, decision_maker_title, decision_maker_email_guess, pain_signals (array), growth_signals (array), os_readiness_score (1-10), priority_tier (HOT/WARM/COLD), engagement_hook, recommended_programme (Leader as Coach / SHIFT / Contagious Identity / AI Edge).`,
              },
            ],
          }),
        });

        if (!claudeRes.ok) {
          const errText = await claudeRes.text();
          console.error(`Claude API error [${claudeRes.status}]: ${errText}`);
        } else {
          const claudeData = await claudeRes.json();
          let content = "";
          if (claudeData.content && Array.isArray(claudeData.content)) {
            content = claudeData.content.map((c: any) => c.text || "").join("");
          }

          // Parse JSON from response
          let prospects: any[] = [];
          try {
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            prospects = JSON.parse(cleaned);
          } catch {
            const match = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (match) prospects = JSON.parse(match[0]);
          }
          if (!Array.isArray(prospects)) prospects = [prospects];

          console.log(`  📊 Claude returned ${prospects.length} prospects`);

          for (const p of prospects) {
            const email = (p.decision_maker_email_guess || "").toLowerCase().trim();
            if (!email || !email.includes("@")) {
              claudeSkipped++;
              continue;
            }

            // Skip generic emails
            const prefix = email.split("@")[0];
            if (GENERIC_PREFIXES.some(g => prefix === g)) {
              claudeSkipped++;
              continue;
            }

            // Skip own domain
            if (email.includes("kevin@") || email.includes("leadershipbydesign")) {
              claudeSkipped++;
              continue;
            }

            // Enforce ≤500 employee cap
            if (p.employee_count && p.employee_count > 500) {
              claudeSkipped++;
              continue;
            }

            // Dedup
            if (existingEmails.has(email)) {
              claudeSkipped++;
              continue;
            }

            const companyName = p.company_name || "";
            const companyWebsite = p.website || "";
            const contactName = p.decision_maker_name || "";
            const contactTitle = p.decision_maker_title || "";
            const industry = (p.industry_vertical || targetIndustry).toLowerCase();

            // Industry classification
            const classification = classifyIndustry(
              companyName, companyWebsite, contactTitle, targetIndustry, (p.pain_signals || []).join(" ")
            );

            if (!classification.qualified) {
              await supabase.from("warm_outreach_queue").insert({
                company_name: companyName,
                company_website: companyWebsite || null,
                contact_name: contactName,
                contact_email: email,
                contact_title: contactTitle,
                source_keyword: `claude:${targetIndustry}`,
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
              source_keyword: `claude:${targetIndustry}`,
              status: "pending",
              industry: classification.industry,
              score: p.os_readiness_score ? p.os_readiness_score * 10 : 70,
              scrape_summary: `Pain: ${(p.pain_signals || []).join(", ")} | Hook: ${p.engagement_hook || ""} | Programme: ${p.recommended_programme || ""}`,
            });

            if (!error) {
              claudeAdded++;
              existingEmails.add(email);
              if (companyWebsite) {
                try { existingDomains.add(getRootDomain(new URL(companyWebsite).hostname)); } catch {}
              }
              console.log(`  ✅ Claude: ${contactName} (${contactTitle}) @ ${companyName} — ${email}`);
              if (!industriesFound.includes(classification.industry)) industriesFound.push(classification.industry);
            } else {
              console.error(`  ❌ Insert error: ${error.message}`);
            }
          }
        }
      } catch (e) {
        console.error("Claude Connector error:", e);
      }

      console.log(`  📊 Claude result: ${claudeAdded} added, ${claudeSkipped} skipped`);
    } else {
      console.log("⚠️ ANTHROPIC_API_KEY not set — skipping Phase 1");
    }

    // ═══════════════════════════════════════════════════════════
    // PHASE 2: FIRECRAWL — signal search for additional leads
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
          if (domainsScrapeCount >= 3) break; // Max 3 domains per query to avoid timeout
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
                  timeout: 15000,
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
    const totalAdded = claudeAdded + firecrawlAdded;
    const summary = `Lead Prospecting Complete\n🔷 Claude Connector: ${claudeAdded} added (${claudeSkipped} skipped)\n🔶 Firecrawl: ${firecrawlAdded} added\n❌ Disqualified: ${disqualifiedCount}\n🏭 Industry: ${targetIndustry}\n🏭 Industries found: ${industriesFound.join(", ") || "none"}`;
    console.log(`\n✅ ${summary}`);

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "daily_pipeline_complete",
          data: {
            industry: `${targetIndustry} (${industriesFound.join(", ") || "none"})`,
            added: totalAdded,
            claude_added: claudeAdded,
            firecrawl_added: firecrawlAdded,
            disqualified: disqualifiedCount,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(
      JSON.stringify({
        success: true,
        target_industry: targetIndustry,
        claude_added: claudeAdded,
        claude_skipped: claudeSkipped,
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
