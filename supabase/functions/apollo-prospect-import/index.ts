import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// CLAUDE CONNECTOR PROSPECT IMPORT
// Replaces Apollo — uses Claude API to discover prospects
// Rotates industry daily, targets companies ≤500 employees
// ═══════════════════════════════════════════════════════════════

const TARGET_TITLES = [
  "HR Director", "Head of L&D", "Learning and Development Manager",
  "Talent Director", "HR Executive", "Chief People Officer", "CHRO",
  "Head of People", "Head of Human Resources", "COO", "HR Manager",
  "People Director", "Talent Lead", "Head of Organisational Development",
  "Head of OD", "Head of Learning", "VP People", "VP Human Resources",
];

// Daily rotation across all target verticals
const CLAUDE_INDUSTRIES = [
  "Financial Services", "Insurance", "Accounting",
  "Legal", "Professional Services", "Management Consulting",
  "Information Technology", "Software Development", "Cybersecurity",
  "Healthcare", "Pharmaceuticals", "Manufacturing",
  "Mining & Metals", "Construction", "Renewable Energy",
  "Retail", "Consumer Goods", "Telecommunications",
  "Agriculture", "Real Estate", "Education", "Hospitality",
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
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  if (!anthropicKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), { status: 500, headers });
  }

  try {
    // Rotate industry daily
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const industryIdx = dayOfYear % CLAUDE_INDUSTRIES.length;
    const targetIndustry = CLAUDE_INDUSTRIES[industryIdx];

    console.log(`🎯 claude-prospect-import invoked at ${new Date().toISOString()}`);
    console.log(`🏭 Today's industry: ${targetIndustry} (day ${dayOfYear}, index ${industryIdx})`);

    // Load existing emails for dedup
    const { data: existingRows } = await supabase
      .from("warm_outreach_queue")
      .select("contact_email")
      .not("contact_email", "is", null);

    const existingEmails = new Set(
      (existingRows || []).map((r: any) => r.contact_email?.toLowerCase().trim())
    );

    let added = 0;
    let skippedDup = 0;
    let skippedQuality = 0;

    // Call Claude to discover prospects
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
        system: `You are a prospecting research assistant for Leadership by Design (LBD), a South African leadership development company. Find 15 South African ${targetIndustry} companies with NO MORE THAN 500 employees that show pain signals indicating they need leadership coaching.\n\nTarget decision-maker titles: ${TARGET_TITLES.join(", ")}\n\nFor each company provide:\n- company_name, website, employee_count (MUST be ≤500)\n- decision_maker_name, decision_maker_title, decision_maker_email_guess\n- industry_vertical, pain_signals (array), engagement_hook\n- os_readiness_score (1-10), priority_tier (HOT/WARM/COLD)\n- recommended_programme (Leader as Coach / SHIFT / Contagious Identity / AI Edge)\n\nIMPORTANT: Only ≤500 employees. Focus on SMEs and mid-market. South Africa only.\nReturn ONLY valid JSON array. No markdown.`,
        messages: [
          {
            role: "user",
            content: `Find 15 South African ${targetIndustry} companies (≤500 employees) with leadership development pain signals in Johannesburg, Cape Town, Durban, and Pretoria.`,
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      throw new Error(`Claude API error [${claudeRes.status}]: ${errText}`);
    }

    const claudeData = await claudeRes.json();
    let content = "";
    if (claudeData.content && Array.isArray(claudeData.content)) {
      content = claudeData.content.map((c: any) => c.text || "").join("");
    }

    let prospects: any[] = [];
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      prospects = JSON.parse(cleaned);
    } catch {
      const match = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) prospects = JSON.parse(match[0]);
    }
    if (!Array.isArray(prospects)) prospects = [prospects];

    console.log(`📊 Claude returned ${prospects.length} prospects for ${targetIndustry}`);

    for (const p of prospects) {
      const email = (p.decision_maker_email_guess || "").toLowerCase().trim();
      if (!email || !email.includes("@")) {
        skippedQuality++;
        continue;
      }

      const prefix = email.split("@")[0];
      if (GENERIC_PREFIXES.some(g => prefix === g || prefix.startsWith(g + "."))) {
        skippedQuality++;
        continue;
      }

      if (email.includes("kevin@") || email.includes("leadershipbydesign")) {
        skippedQuality++;
        continue;
      }

      // Enforce ≤500 cap
      if (p.employee_count && p.employee_count > 500) {
        skippedQuality++;
        continue;
      }

      if (existingEmails.has(email)) {
        skippedDup++;
        continue;
      }

      const { error } = await supabase.from("warm_outreach_queue").insert({
        company_name: p.company_name || "",
        company_website: p.website || null,
        contact_name: p.decision_maker_name || "",
        contact_email: email,
        contact_title: p.decision_maker_title || "",
        source_keyword: `claude:${targetIndustry}`,
        status: "pending",
        industry: targetIndustry.toLowerCase(),
        score: p.os_readiness_score ? p.os_readiness_score * 10 : 70,
        scrape_summary: `Pain: ${(p.pain_signals || []).join(", ")} | Hook: ${p.engagement_hook || ""} | Programme: ${p.recommended_programme || ""}`,
      });

      if (!error) {
        added++;
        existingEmails.add(email);
        console.log(`  ✅ ${p.decision_maker_name} (${p.decision_maker_title}) @ ${p.company_name} — ${email}`);
      } else {
        console.error(`  ❌ Insert error: ${error.message}`);
      }
    }

    const summary = `🎯 Claude Prospect Import Complete\nIndustry: ${targetIndustry}\nProspects found: ${prospects.length}\nAdded to queue: ${added}\nSkipped (duplicate): ${skippedDup}\nSkipped (quality): ${skippedQuality}`;
    console.log(summary);

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "daily_pipeline_complete",
          data: {
            function: "claude-prospect-import",
            industry: targetIndustry,
            found: prospects.length,
            added,
            skipped_dup: skippedDup,
            skipped_quality: skippedQuality,
          },
        }),
      });
    } catch (e) { console.error("Slack notify failed:", e); }

    return new Response(JSON.stringify({
      success: true,
      target_industry: targetIndustry,
      prospects_found: prospects.length,
      added,
      skipped_duplicate: skippedDup,
      skipped_quality: skippedQuality,
    }), { headers });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("claude-prospect-import error:", errMsg);
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "claude-prospect-import", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
