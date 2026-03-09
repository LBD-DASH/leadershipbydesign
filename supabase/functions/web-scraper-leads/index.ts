import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// TARGET UNIVERSE: Top 60 SA FSI companies by name + domain
// ═══════════════════════════════════════════════════════════════
const TARGET_COMPANIES = [
  // ── Banks ──
  { name: "Standard Bank", domain: "standardbank.co.za", industry: "banking" },
  { name: "FirstRand / FNB", domain: "firstrand.co.za", industry: "banking" },
  { name: "Absa Group", domain: "absa.co.za", industry: "banking" },
  { name: "Nedbank", domain: "nedbank.co.za", industry: "banking" },
  { name: "Capitec Bank", domain: "capitecbank.co.za", industry: "banking" },
  { name: "Investec", domain: "investec.com", industry: "banking" },
  { name: "African Bank", domain: "africanbank.co.za", industry: "banking" },
  { name: "TymeBank", domain: "tymebank.co.za", industry: "banking" },
  { name: "Discovery Bank", domain: "discovery.co.za", industry: "banking" },
  { name: "Sasfin", domain: "sasfin.com", industry: "banking" },
  { name: "Grindrod Bank", domain: "grindrodbank.co.za", industry: "banking" },
  { name: "Bidvest Bank", domain: "bidvestbank.co.za", industry: "banking" },
  { name: "Mercantile Bank", domain: "mercantile.co.za", industry: "banking" },

  // ── Insurance ──
  { name: "Discovery", domain: "discovery.co.za", industry: "insurance" },
  { name: "Sanlam", domain: "sanlam.co.za", industry: "insurance" },
  { name: "Old Mutual", domain: "oldmutual.co.za", industry: "insurance" },
  { name: "Liberty Group", domain: "liberty.co.za", industry: "insurance" },
  { name: "Momentum Metropolitan", domain: "momentummetropolitan.co.za", industry: "insurance" },
  { name: "OUTsurance", domain: "outsurance.co.za", industry: "insurance" },
  { name: "Hollard Insurance", domain: "hollard.co.za", industry: "insurance" },
  { name: "Santam", domain: "santam.co.za", industry: "insurance" },
  { name: "MiWay Insurance", domain: "miway.co.za", industry: "insurance" },
  { name: "King Price Insurance", domain: "kingprice.co.za", industry: "insurance" },
  { name: "Bryte Insurance", domain: "bryte.co.za", industry: "insurance" },
  { name: "Guardrisk", domain: "guardrisk.co.za", industry: "insurance" },
  { name: "1st for Women", domain: "1stforwomen.co.za", industry: "insurance" },
  { name: "Auto & General", domain: "autoandgeneral.co.za", industry: "insurance" },
  { name: "Alexander Forbes", domain: "alexanderforbes.co.za", industry: "insurance" },
  { name: "PPS", domain: "pps.co.za", industry: "insurance" },
  { name: "Clientele Life", domain: "clientele.co.za", industry: "insurance" },
  { name: "Telesure Group", domain: "telesure.co.za", industry: "insurance" },

  // ── Asset Management / Financial Services ──
  { name: "Ninety One", domain: "ninetyone.com", industry: "financial services" },
  { name: "Stanlib", domain: "stanlib.com", industry: "financial services" },
  { name: "Coronation Fund Managers", domain: "coronation.com", industry: "financial services" },
  { name: "Allan Gray", domain: "allangray.co.za", industry: "financial services" },
  { name: "PSG Konsult", domain: "psg.co.za", industry: "financial services" },
  { name: "Prescient", domain: "prescient.co.za", industry: "financial services" },
  { name: "Ashburton Investments", domain: "ashburtoninvestments.com", industry: "financial services" },
  { name: "RMB", domain: "rmb.co.za", industry: "financial services" },
  { name: "Rand Merchant Bank", domain: "rmb.co.za", industry: "financial services" },
  { name: "Glacier by Sanlam", domain: "glacierinsights.co.za", industry: "financial services" },
  { name: "Citadel", domain: "citadel.co.za", industry: "financial services" },
  { name: "Brait", domain: "brait.com", industry: "financial services" },
  { name: "Transaction Capital", domain: "transactioncapital.co.za", industry: "financial services" },
  { name: "Peregrine Holdings", domain: "peregrine.co.za", industry: "financial services" },
  { name: "Efficient Group", domain: "efficient.co.za", industry: "financial services" },
  { name: "Northam Platinum (Corporate Finance)", domain: "northam.co.za", industry: "financial services" },
  { name: "Mazars South Africa", domain: "mazars.co.za", industry: "financial services" },
  { name: "KPMG South Africa", domain: "kpmg.co.za", industry: "financial services" },
  { name: "Deloitte South Africa", domain: "deloitte.com", industry: "financial services" },
  { name: "EY South Africa", domain: "ey.com", industry: "financial services" },
  { name: "PwC South Africa", domain: "pwc.co.za", industry: "financial services" },
  { name: "Marsh McLennan SA", domain: "marshmclennan.com", industry: "financial services" },
  { name: "Aon South Africa", domain: "aon.com", industry: "financial services" },
  { name: "WTW South Africa", domain: "wtwco.com", industry: "financial services" },
  { name: "NBC Holdings", domain: "nbcholdings.co.za", industry: "financial services" },
  { name: "Motus Holdings", domain: "motus.co.za", industry: "financial services" },
  { name: "Imperial Logistics", domain: "imperiallogistics.com", industry: "financial services" },
  { name: "Dimension Data", domain: "dimensiondata.com", industry: "financial services" },
  { name: "Redefine Properties", domain: "redefine.co.za", industry: "financial services" },
  { name: "Growthpoint Properties", domain: "growthpoint.co.za", industry: "financial services" },
];

// Pages to scrape for contact info
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

function isQualityEmail(email: string, companyDomain: string): boolean {
  if (!email || !email.includes("@")) return false;
  const prefix = email.split("@")[0].toLowerCase();
  const emailDomain = email.split("@")[1].toLowerCase();

  // Reject generic prefixes
  if (GENERIC_PREFIXES.some((g) => prefix === g || prefix.startsWith(g + "."))) return false;

  // Prefer emails from the company's own domain
  const rootDomain = companyDomain.replace("www.", "");
  if (!emailDomain.includes(rootDomain) && !rootDomain.includes(emailDomain.split(".")[0])) return false;

  // Must look like a person's email (has a dot or multiple chars)
  if (prefix.length < 3) return false;

  return true;
}

function extractEmails(text: string): string[] {
  return [...new Set((text.match(EMAIL_REGEX) || []).map((e) => e.toLowerCase()))];
}

function extractNameFromEmail(email: string): string {
  const prefix = email.split("@")[0];
  const parts = prefix.split(/[._-]/);
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

// Try to extract HR/People titles from page content near emails
function findTitleNearEmail(content: string, email: string): string {
  const HR_PATTERNS = [
    /(?:HR|Human Resources)\s*(?:Director|Executive|Manager|Head)/i,
    /(?:Head|Director|Manager)\s*(?:of\s*)?(?:HR|Human Resources|People|L&D|Learning|Talent|OD)/i,
    /Chief\s*(?:People|Human Resources)\s*Officer/i,
    /CHRO/i,
    /(?:VP|Vice President)\s*(?:of\s*)?(?:People|HR|Human Resources)/i,
  ];

  // Look in a window around the email mention
  const emailIdx = content.toLowerCase().indexOf(email.toLowerCase());
  if (emailIdx === -1) return "";

  const window = content.substring(Math.max(0, emailIdx - 500), Math.min(content.length, emailIdx + 500));

  for (const pattern of HR_PATTERNS) {
    const match = window.match(pattern);
    if (match) return match[0];
  }
  return "";
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
    // Track which companies have been scraped (stored in DB)
    // Accept optional batch_size and start_index overrides
    let batchSize = 10;
    let startOverride: number | null = null;
    try {
      const body = await req.json();
      if (typeof body.batch_size === "number") batchSize = Math.min(body.batch_size, 20);
      if (typeof body.start_index === "number") startOverride = body.start_index;
    } catch { /* no body */ }

    // Fetch existing emails and domains for dedup
    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email, company_website")
      .not("contact_email", "is", null);

    const existingEmails = new Set(
      (existingRows || []).map((r: any) => r.contact_email?.toLowerCase())
    );
    const existingDomains = new Set(
      (existingRows || []).map((r: any) => {
        try { return new URL(r.company_website || "").hostname.replace("www.", ""); } catch { return ""; }
      }).filter(Boolean)
    );

    // Determine which companies to process this run
    // Auto-rotate: use day of year * batch_size as starting offset
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const startIdx = startOverride !== null ? startOverride : (dayOfYear * batchSize) % TARGET_COMPANIES.length;

    // Build batch, wrapping around the list
    const batch: typeof TARGET_COMPANIES = [];
    for (let i = 0; i < batchSize; i++) {
      const idx = (startIdx + i) % TARGET_COMPANIES.length;
      batch.push(TARGET_COMPANIES[idx]);
    }

    console.log(`🎯 Scraping batch of ${batch.length} companies (start: ${startIdx}): ${batch.map(c => c.name).join(", ")}`);

    let addedCount = 0;
    let skippedDup = 0;
    let skippedQuality = 0;
    let scrapedPages = 0;

    for (const company of batch) {
      // Skip if we already have this domain
      if (existingDomains.has(company.domain)) {
        console.log(`⏭️ Already have ${company.domain}, skipping`);
        skippedDup++;
        continue;
      }

      console.log(`🔍 Scraping ${company.name} (${company.domain})...`);

      let bestEmails: string[] = [];
      let pageContent = "";

      // Try each contact path
      for (const path of CONTACT_PATHS) {
        if (bestEmails.length >= 3) break; // Got enough

        try {
          const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              url: `https://${company.domain}${path}`,
              formats: ["markdown"],
              onlyMainContent: false,
              timeout: 15000,
            }),
          });

          scrapedPages++;

          if (scrapeRes.ok) {
            const scrapeData = await scrapeRes.json();
            const content = scrapeData.data?.markdown || scrapeData.markdown || "";
            pageContent += " " + content;

            const emails = extractEmails(content).filter((e) => isQualityEmail(e, company.domain));
            for (const email of emails) {
              if (!bestEmails.includes(email)) bestEmails.push(email);
            }

            if (bestEmails.length > 0) {
              console.log(`  📧 Found ${bestEmails.length} email(s) on ${path}`);
              break; // Got emails, no need to try more paths
            }
          }
        } catch {
          // Skip failed scrape
        }
      }

      // Insert found emails
      for (const email of bestEmails.slice(0, 2)) {
        if (existingEmails.has(email)) {
          skippedDup++;
          continue;
        }

        const title = findTitleNearEmail(pageContent, email);
        const contactName = extractNameFromEmail(email);

        const { error } = await supabase.from("warm_outreach_queue").insert({
          company_name: company.name,
          company_website: `https://${company.domain}`,
          contact_name: contactName,
          contact_title: title || "",
          contact_email: email,
          source_keyword: `target-list:${company.industry}`,
          status: "pending",
        });

        if (!error) {
          addedCount++;
          existingEmails.add(email);
          existingDomains.add(company.domain);
          console.log(`  ✅ Added: ${email} (${contactName}) @ ${company.name}`);
        } else {
          console.error(`  ❌ Insert error for ${email}:`, error.message);
        }
      }

      if (bestEmails.length === 0) {
        skippedQuality++;
        console.log(`  ⚠️ No quality emails found for ${company.name}`);
      }
    }

    const summary = `Target List Prospecting\nBatch: ${batch.map(c => c.name).join(", ")}\nPages scraped: ${scrapedPages} | Added: ${addedCount} | Dup: ${skippedDup} | No email: ${skippedQuality}`;
    console.log(`✅ ${summary}`);

    // Slack notification
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "daily_pipeline_complete",
          data: {
            industry: `Target List (batch from ${startIdx})`,
            added: addedCount,
            companies_scraped: batch.length,
            pages_scraped: scrapedPages,
            skipped_dup: skippedDup,
            skipped_no_email: skippedQuality,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(
      JSON.stringify({
        success: true,
        batch_start: startIdx,
        companies_in_batch: batch.map(c => c.name),
        pages_scraped: scrapedPages,
        prospects_added: addedCount,
        skipped_duplicate: skippedDup,
        skipped_no_email: skippedQuality,
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
