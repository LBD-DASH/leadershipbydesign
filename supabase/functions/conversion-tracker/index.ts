import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PeriodMetrics {
  period: "7d" | "30d";
  prospects_imported: number;
  emails_sent: number;
  open_rate: number;
  reply_rate: number;
  bookings: number;
  deals_created: number;
  pipeline_value: number;
  best_industry: string;
  best_title: string;
  worst_industry: string;
  worst_title: string;
}

interface DealAttribution {
  deal_id: string;
  contact_email: string;
  stage: string;
  value: number;
  source_keyword: string | null;
  first_outreach_subject: string | null;
  first_outreach_date: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log("📊 conversion-tracker invoked at", new Date().toISOString());

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const todayDate = now.toISOString().split("T")[0];

    // ── Gather metrics for both periods ──
    const metrics7d = await gatherMetrics(supabase, sevenDaysAgo, "7d");
    const metrics30d = await gatherMetrics(supabase, thirtyDaysAgo, "30d");

    // ── Deal attribution: trace every deal back through the funnel ──
    const dealAttributions = await traceDealAttribution(supabase);

    // ── Store daily snapshots ──
    for (const m of [metrics7d, metrics30d]) {
      const { error: snapErr } = await supabase.from("conversion_snapshots").upsert(
        {
          date: todayDate,
          period: m.period,
          prospects_imported: m.prospects_imported,
          emails_sent: m.emails_sent,
          open_rate: m.open_rate,
          reply_rate: m.reply_rate,
          bookings: m.bookings,
          deals_created: m.deals_created,
          pipeline_value: m.pipeline_value,
          best_industry: m.best_industry,
          best_title: m.best_title,
          created_at: now.toISOString(),
        },
        { onConflict: "date,period" }
      );
      if (snapErr) {
        console.error(`Snapshot upsert error (${m.period}):`, snapErr.message);
      }
    }

    // ── Build Slack summary ──
    const dateStr = now.toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const attrSummary = dealAttributions.length > 0
      ? dealAttributions
          .slice(0, 5)
          .map(
            (d) =>
              `• R${(d.value || 0).toLocaleString()} — ${d.contact_email} (${d.stage}) ← source: ${d.source_keyword || "unknown"}`
          )
          .join("\n")
      : "No deals in pipeline yet";

    const message = [
      `📊 *Conversion Tracker — ${dateStr}*`,
      "",
      "*LAST 7 DAYS*",
      `Prospects imported: ${metrics7d.prospects_imported}`,
      `Emails sent: ${metrics7d.emails_sent}`,
      `Open rate: ${metrics7d.open_rate}% | Reply rate: ${metrics7d.reply_rate}%`,
      `Bookings: ${metrics7d.bookings} | Deals created: ${metrics7d.deals_created}`,
      `Pipeline value: R${metrics7d.pipeline_value.toLocaleString()}`,
      `Best industry: ${metrics7d.best_industry || "n/a"} | Best title: ${metrics7d.best_title || "n/a"}`,
      `Worst industry (0 replies): ${metrics7d.worst_industry || "n/a"} | Worst title: ${metrics7d.worst_title || "n/a"}`,
      "",
      "*LAST 30 DAYS*",
      `Prospects imported: ${metrics30d.prospects_imported}`,
      `Emails sent: ${metrics30d.emails_sent}`,
      `Open rate: ${metrics30d.open_rate}% | Reply rate: ${metrics30d.reply_rate}%`,
      `Bookings: ${metrics30d.bookings} | Deals created: ${metrics30d.deals_created}`,
      `Pipeline value: R${metrics30d.pipeline_value.toLocaleString()}`,
      `Best industry: ${metrics30d.best_industry || "n/a"} | Best title: ${metrics30d.best_title || "n/a"}`,
      `Worst industry (0 replies): ${metrics30d.worst_industry || "n/a"} | Worst title: ${metrics30d.worst_title || "n/a"}`,
      "",
      "*DEAL ATTRIBUTION*",
      attrSummary,
    ].join("\n");

    // Post to Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: { function: "📊 Conversion Tracker", error: message },
        }),
      });
    } catch (e) {
      console.error("Slack notify error:", e);
    }

    // ── Log to agent_activity_log ──
    const logMessage = `7d: ${metrics7d.emails_sent} sent, ${metrics7d.reply_rate}% reply, ${metrics7d.deals_created} deals (R${metrics7d.pipeline_value.toLocaleString()}) | 30d: ${metrics30d.emails_sent} sent, ${metrics30d.reply_rate}% reply, ${metrics30d.deals_created} deals (R${metrics30d.pipeline_value.toLocaleString()})`;

    await supabase.from("agent_activity_log").insert({
      agent_name: "conversion-tracker",
      status: "success",
      message: logMessage,
    });

    console.log("✅ conversion-tracker complete");

    return new Response(
      JSON.stringify({
        success: true,
        metrics_7d: metrics7d,
        metrics_30d: metrics30d,
        deal_attributions: dealAttributions,
      }),
      { headers }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("conversion-tracker error:", msg);

    // Log failure
    try {
      await supabase.from("agent_activity_log").insert({
        agent_name: "conversion-tracker",
        status: "error",
        message: msg,
      });
    } catch { /* best effort */ }

    // Alert Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: { function: "Conversion Tracker", error: `FAILED: ${msg}` },
        }),
      });
    } catch { /* best effort */ }

    return new Response(JSON.stringify({ error: msg }), { status: 500, headers });
  }
});

// ── Helper: gather metrics for a given period ──

async function gatherMetrics(
  supabase: ReturnType<typeof createClient>,
  sinceDate: string,
  period: "7d" | "30d"
): Promise<PeriodMetrics> {
  // 1. Prospects imported
  const { count: prospectsImported } = await supabase
    .from("warm_outreach_queue")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sinceDate);

  // 2. Emails sent (from prospect_outreach)
  const { data: outreachRows } = await supabase
    .from("prospect_outreach")
    .select("recipient_email, status, opened, clicked, replied")
    .gte("created_at", sinceDate);

  const emailsSent = outreachRows?.length || 0;
  const opened = outreachRows?.filter((r) => r.opened).length || 0;
  const replied = outreachRows?.filter((r) => r.replied).length || 0;
  const openRate = emailsSent > 0 ? Math.round((opened / emailsSent) * 100) : 0;
  const replyRate = emailsSent > 0 ? Math.round((replied / emailsSent) * 100) : 0;

  // 3. Bookings
  const { count: bookingsCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sinceDate);

  // 4. Deals created + pipeline value
  const { data: deals } = await supabase
    .from("pipeline_deals")
    .select("id, contact_email, stage, value")
    .gte("created_at", sinceDate);

  const dealsCreated = deals?.length || 0;
  const pipelineValue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0;

  // 5. Performance by industry and title — get prospects with outreach results
  const repliedEmails = new Set(
    (outreachRows || []).filter((r) => r.replied).map((r) => r.recipient_email?.toLowerCase())
  );
  const sentEmails = new Set(
    (outreachRows || []).map((r) => r.recipient_email?.toLowerCase())
  );

  // Get prospects from this period to analyse industry/title performance
  const { data: prospects } = await supabase
    .from("warm_outreach_queue")
    .select("contact_email, industry, title")
    .gte("created_at", sinceDate)
    .not("contact_email", "is", null);

  // Build industry/title reply counts
  const industryReplies: Record<string, { sent: number; replied: number }> = {};
  const titleReplies: Record<string, { sent: number; replied: number }> = {};

  for (const p of prospects || []) {
    const email = p.contact_email?.toLowerCase();
    if (!email || !sentEmails.has(email)) continue;

    const industry = p.industry || "Unknown";
    const title = normaliseTitle(p.title || "Unknown");

    if (!industryReplies[industry]) industryReplies[industry] = { sent: 0, replied: 0 };
    industryReplies[industry].sent++;
    if (repliedEmails.has(email)) industryReplies[industry].replied++;

    if (!titleReplies[title]) titleReplies[title] = { sent: 0, replied: 0 };
    titleReplies[title].sent++;
    if (repliedEmails.has(email)) titleReplies[title].replied++;
  }

  // Best performing = highest reply rate (min 3 sent)
  const bestIndustry = pickBest(industryReplies, 3);
  const bestTitle = pickBest(titleReplies, 3);

  // Worst performing = most sent with 0 replies
  const worstIndustry = pickWorst(industryReplies, 3);
  const worstTitle = pickWorst(titleReplies, 3);

  return {
    period,
    prospects_imported: prospectsImported || 0,
    emails_sent: emailsSent,
    open_rate: openRate,
    reply_rate: replyRate,
    bookings: bookingsCount || 0,
    deals_created: dealsCreated,
    pipeline_value: pipelineValue,
    best_industry: bestIndustry,
    best_title: bestTitle,
    worst_industry: worstIndustry,
    worst_title: worstTitle,
  };
}

// ── Helper: trace deals back to outreach source ──

async function traceDealAttribution(
  supabase: ReturnType<typeof createClient>
): Promise<DealAttribution[]> {
  const { data: deals } = await supabase
    .from("pipeline_deals")
    .select("id, contact_email, stage, value, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!deals || deals.length === 0) return [];

  const attributions: DealAttribution[] = [];

  for (const deal of deals) {
    if (!deal.contact_email) continue;
    const email = deal.contact_email.toLowerCase();

    // Find the first outreach email sent to this contact
    const { data: outreach } = await supabase
      .from("prospect_outreach")
      .select("subject, created_at")
      .ilike("recipient_email", email)
      .order("created_at", { ascending: true })
      .limit(1);

    // Find the warm_outreach_queue entry for source_keyword
    const { data: queueEntry } = await supabase
      .from("warm_outreach_queue")
      .select("source_keyword")
      .ilike("contact_email", email)
      .order("created_at", { ascending: true })
      .limit(1);

    attributions.push({
      deal_id: deal.id,
      contact_email: deal.contact_email,
      stage: deal.stage || "unknown",
      value: deal.value || 0,
      source_keyword: queueEntry?.[0]?.source_keyword || null,
      first_outreach_subject: outreach?.[0]?.subject || null,
      first_outreach_date: outreach?.[0]?.created_at || null,
    });
  }

  return attributions;
}

// ── Utility: normalise job titles into categories ──

function normaliseTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("hr director") || t.includes("head of hr") || t.includes("human resources director")) return "HR Director";
  if (t.includes("chief people") || t.includes("cpo")) return "Chief People Officer";
  if (t.includes("l&d") || t.includes("learning and development") || t.includes("learning & development")) return "L&D Head";
  if (t.includes("talent")) return "Talent Executive";
  if (t.includes("coo") || t.includes("chief operating")) return "COO";
  if (t.includes("hr manager") || t.includes("human resources manager")) return "HR Manager";
  if (t.includes("ceo") || t.includes("managing director") || t.includes("md")) return "CEO/MD";
  if (t.includes("people") && (t.includes("head") || t.includes("director") || t.includes("manager"))) return "People Lead";
  if (t.includes("training") || t.includes("development")) return "Training & Development";
  return title.length > 30 ? title.substring(0, 30) + "..." : title;
}

// ── Utility: pick best performer by reply rate (min threshold) ──

function pickBest(stats: Record<string, { sent: number; replied: number }>, minSent: number): string {
  let best = "";
  let bestRate = -1;

  for (const [key, val] of Object.entries(stats)) {
    if (val.sent < minSent) continue;
    const rate = val.replied / val.sent;
    if (rate > bestRate) {
      bestRate = rate;
      best = `${key} (${Math.round(rate * 100)}% reply, ${val.sent} sent)`;
    }
  }
  return best || "insufficient data";
}

// ── Utility: pick worst performer (most sent, 0 replies) ──

function pickWorst(stats: Record<string, { sent: number; replied: number }>, minSent: number): string {
  let worst = "";
  let mostSent = 0;

  for (const [key, val] of Object.entries(stats)) {
    if (val.sent < minSent || val.replied > 0) continue;
    if (val.sent > mostSent) {
      mostSent = val.sent;
      worst = `${key} (0 replies from ${val.sent} sent)`;
    }
  }
  return worst || "none (all segments have replies)";
}
