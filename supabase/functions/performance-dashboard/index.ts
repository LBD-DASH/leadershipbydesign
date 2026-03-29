import { createClient } from "npm:@supabase/supabase-js@2";

// Performance Dashboard — daily conversion funnel posted to Slack at 18:00 SAST
// The single most important visibility tool for the business owner.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function pct(numerator: number, denominator: number): string {
  if (denominator === 0) return "0";
  return Math.round((numerator / denominator) * 100).toString();
}

function formatRand(value: number): string {
  return value.toLocaleString("en-ZA");
}

function sast(): string {
  return new Date().toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const now = new Date();

    // Time boundaries
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const twentyFourHoursAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    ).toISOString();

    // ── Parallel data fetch ──────────────────────────────────

    const [
      // TODAY counts
      { count: todayProspects },
      { count: todayEmailsSent },
      { count: todayOpened },
      { count: todayReplied },
      { count: todayDiagnostics },
      { count: todayBookings },
      { data: todayDeals },

      // 7-DAY counts
      { count: weekProspects },
      { count: weekEmailsSent },
      { count: weekOpened },
      { count: weekReplied },
      { count: weekDiagnostics },
      { count: weekBookings },
      { data: weekDeals },

      // Top performers (7-day) — industry + title breakdown
      { data: weekProspectDetails },

      // Unreplied replies — prospects who replied but not contacted in 24h
      { data: unrepliedReplies },
    ] = await Promise.all([
      // ── TODAY ──
      supabase
        .from("warm_outreach_queue")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO),

      supabase
        .from("prospect_outreach")
        .select("*", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("sent_at", todayISO),

      supabase
        .from("prospect_outreach")
        .select("*", { count: "exact", head: true })
        .not("opened_at", "is", null)
        .gte("sent_at", todayISO),

      supabase
        .from("prospect_outreach")
        .select("*", { count: "exact", head: true })
        .not("replied_at", "is", null)
        .gte("sent_at", todayISO),

      supabase
        .from("leader_as_coach_assessments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO),

      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO),

      supabase
        .from("pipeline_deals")
        .select("deal_value, stage")
        .gte("created_at", todayISO),

      // ── 7 DAYS ──
      supabase
        .from("warm_outreach_queue")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),

      supabase
        .from("prospect_outreach")
        .select("*", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("sent_at", sevenDaysAgo),

      supabase
        .from("prospect_outreach")
        .select("*", { count: "exact", head: true })
        .not("opened_at", "is", null)
        .gte("sent_at", sevenDaysAgo),

      supabase
        .from("prospect_outreach")
        .select("*", { count: "exact", head: true })
        .not("replied_at", "is", null)
        .gte("sent_at", sevenDaysAgo),

      supabase
        .from("leader_as_coach_assessments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),

      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),

      supabase
        .from("pipeline_deals")
        .select("deal_value, stage")
        .gte("created_at", sevenDaysAgo),

      // Top industry + title for 7-day period
      supabase
        .from("warm_outreach_queue")
        .select("industry, contact_title")
        .gte("created_at", sevenDaysAgo),

      // Unreplied: prospects who replied but haven't been updated in 24h
      supabase
        .from("warm_outreach_queue")
        .select("contact_name, company_name, contact_email, updated_at")
        .eq("reply_received", true)
        .not("status", "eq", "booked")
        .not("status", "eq", "contacted")
        .not("status", "eq", "closed")
        .lt("updated_at", twentyFourHoursAgo)
        .limit(20),
    ]);

    // ── Safe numbers ──────────────────────────────────────────

    const tp = todayProspects || 0;
    const tes = todayEmailsSent || 0;
    const to = todayOpened || 0;
    const tr = todayReplied || 0;
    const td = todayDiagnostics || 0;
    const tb = todayBookings || 0;
    const todayDealList = todayDeals || [];
    const todayDealCount = todayDealList.length;
    const todayPipelineValue = todayDealList.reduce(
      (sum: number, d: any) => sum + (d.deal_value || 0),
      0
    );

    const wp = weekProspects || 0;
    const wes = weekEmailsSent || 0;
    const wo = weekOpened || 0;
    const wr = weekReplied || 0;
    const wd = weekDiagnostics || 0;
    const wb = weekBookings || 0;
    const weekDealList = weekDeals || [];
    const weekDealCount = weekDealList.length;
    const weekPipelineValue = weekDealList.reduce(
      (sum: number, d: any) => sum + (d.deal_value || 0),
      0
    );

    // ── Top performers (7 day) ───────────────────────────────

    const details = weekProspectDetails || [];

    const industryCounts: Record<string, number> = {};
    const titleCounts: Record<string, number> = {};
    for (const row of details) {
      if (row.industry) {
        industryCounts[row.industry] = (industryCounts[row.industry] || 0) + 1;
      }
      if (row.contact_title) {
        titleCounts[row.contact_title] =
          (titleCounts[row.contact_title] || 0) + 1;
      }
    }

    const topIndustry =
      Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";
    const topTitle =
      Object.entries(titleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    // ── Conversion rates ─────────────────────────────────────

    const todayProspectToReply = pct(tr, tp);
    const todayReplyToBook = pct(tb, tr);
    const todayBookToDeal = pct(todayDealCount, tb);

    // ── Action items ─────────────────────────────────────────

    const actions: string[] = [];
    const unreplied = unrepliedReplies || [];

    if (tes === 0) actions.push("No emails sent today");
    if (tes > 0 && to / tes < 0.15) actions.push(`Open rate ${pct(to, tes)}% — below 15% threshold`);
    if (unreplied.length > 0) {
      actions.push(
        `${unreplied.length} replied prospect${unreplied.length > 1 ? "s" : ""} waiting for response (>24h)`
      );
      // List first 5
      for (const u of unreplied.slice(0, 5)) {
        actions.push(
          `  → ${u.contact_name || "Unknown"} at ${u.company_name || "Unknown"} (${u.contact_email || "no email"})`
        );
      }
    }
    if (tp === 0 && tes === 0) actions.push("Pipeline idle — no prospects or emails today");
    if (weekDealCount === 0) actions.push("No new deals in 7 days");

    const actionBlock =
      actions.length > 0 ? actions.join("\n") : "All clear — pipeline running smoothly";

    // ── Build Slack message ──────────────────────────────────

    const dateStr = sast();

    const message = `📊 LBD DAILY DASHBOARD — ${dateStr}

TODAY:
├─ 🎯 Prospects: ${tp} new
├─ 📧 Emails: ${tes} sent → ${to} opened (${pct(to, tes)}%) → ${tr} replied (${pct(tr, tes)}%)
├─ 📋 Diagnostics: ${td} completed
├─ 📞 Bookings: ${tb}
├─ 💰 Deals: ${todayDealCount} new (R${formatRand(todayPipelineValue)})
└─ 🔄 Funnel: ${todayProspectToReply}% prospect→reply → ${todayReplyToBook}% reply→book → ${todayBookToDeal}% book→deal

LAST 7 DAYS:
├─ 🎯 Prospects: ${wp}
├─ 📧 Emails: ${wes} sent → ${pct(wo, wes)}% open → ${pct(wr, wes)}% reply
├─ 💰 Pipeline: R${formatRand(weekPipelineValue)} across ${weekDealCount} deals
└─ 🏆 Best: ${topIndustry} | ${topTitle}

⚡ ACTION NEEDED:
${actionBlock}`;

    // ── Post to Slack ────────────────────────────────────────

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "agent_report",
          data: {
            function: "Daily Dashboard",
            error: message,
          },
        }),
      });
    } catch (slackErr) {
      console.error("Failed to post dashboard to Slack:", slackErr);
    }

    // ── Log to agent_activity_log ────────────────────────────

    await supabase.from("agent_activity_log").insert({
      agent_name: "performance-dashboard",
      agent_type: "reporting",
      status: "success",
      message: `Dashboard posted | Today: ${tp} prospects, ${tes} emails, ${tr} replies, ${tb} bookings | 7d pipeline: R${formatRand(weekPipelineValue)}`,
      details: {
        today: {
          prospects: tp,
          emails_sent: tes,
          opened: to,
          replied: tr,
          diagnostics: td,
          bookings: tb,
          deals: todayDealCount,
          pipeline_value: todayPipelineValue,
        },
        week: {
          prospects: wp,
          emails_sent: wes,
          opened: wo,
          replied: wr,
          diagnostics: wd,
          bookings: wb,
          deals: weekDealCount,
          pipeline_value: weekPipelineValue,
        },
        top_industry: topIndustry,
        top_title: topTitle,
        unreplied_count: unreplied.length,
        actions,
      },
      items_processed: tp + tes,
    });

    return new Response(
      JSON.stringify({
        success: true,
        today: {
          prospects: tp,
          emails_sent: tes,
          opened: to,
          replied: tr,
          diagnostics: td,
          bookings: tb,
          deals: todayDealCount,
          pipeline_value: todayPipelineValue,
        },
        week: {
          prospects: wp,
          emails_sent: wes,
          opened: wo,
          replied: wr,
          diagnostics: wd,
          bookings: wb,
          deals: weekDealCount,
          pipeline_value: weekPipelineValue,
        },
        unreplied_replies: unreplied.length,
        actions,
      }),
      { headers }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("performance-dashboard error:", errMsg);

    // Log error
    try {
      await supabase.from("agent_activity_log").insert({
        agent_name: "performance-dashboard",
        agent_type: "reporting",
        status: "error",
        message: errMsg,
      });
    } catch { /* best effort */ }

    // Alert on Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          eventType: "agent_report",
          data: {
            function: "performance-dashboard",
            error: errMsg,
          },
        }),
      });
    } catch { /* best effort */ }

    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers,
    });
  }
});
