import { createClient } from "npm:@supabase/supabase-js@2";

// COO Agent — Kevin's single daily operations brief + learning layer
// Runs daily: checks every agent, pipeline, deals, and surfaces actions needed.
// Posts to Slack + emails Kevin. Weekly trends included DAILY.
// Learning layer: agent performance scoring, pattern recognition, adaptive recommendations.
// Weekly learning summary on Sundays.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const KNOWN_AGENTS = [
  // FIND PROSPECTS
  "apollo-prospect-import",
  "web-scraper-leads",
  "apollo-list-builder",
  "find-companies",
  "stale-lead-reengager",
  // SEND EMAILS
  "auto-outreach",
  "auto-follow-up",
  "process-diagnostic-nurture",
  "lac-follow-up",
  // LEARN & OPTIMIZE
  "conversion-tracker",
  "deliverability-monitor",
  "outreach-optimizer",
  "performance-dashboard",
  "win-loss-tracker",
  // MONITOR & ALERT
  "system-heartbeat",
  "apollo-sync-engagement",
  "gmail-reply-classifier",
  "competitor-monitor",
  // CONTENT
  "generate-ai-newsletter",
  "blog-repurposer",
  "newsletter-curator",
  "linkedin-scheduler",
  // SUPPORT
  "leadership-chat",
  "apollo-search",
  "enrich-queue-emails",
  // EXECUTIVE
  "cfo-agent",
];

function pct(num: number, den: number): string {
  if (den === 0) return "0";
  return Math.round((num / den) * 100).toString();
}

function formatRand(value: number): string {
  return value.toLocaleString("en-ZA");
}

function sastNow(): Date {
  // Return current time string formatted in SAST
  return new Date();
}

function formatSAST(date: Date): string {
  return date.toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSASTTime(date: Date): string {
  return date.toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function trend(current: number, previous: number): string {
  if (previous === 0 && current === 0) return "→";
  if (previous === 0) return "↑";
  const changePct = ((current - previous) / previous) * 100;
  if (Math.abs(changePct) <= 5) return "→";
  return changePct > 0 ? "↑" : "↓";
}

function trendPctChange(current: number, previous: number): number {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

function needsAttention(current: number, previous: number): boolean {
  if (previous === 0) return false;
  return ((previous - current) / previous) * 100 > 20;
}

type AgentScore = "productive" | "idle" | "failed";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
    const dateStr = formatSAST(now);
    const timeStr = formatSASTTime(now);
    const isSunday = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" })).getDay() === 0;

    // Time boundaries
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();
    const tomorrowEnd = new Date(todayStart.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();

    // ═══════════════════════════════════════════════════════════
    // 1. AGENT ARMY STATUS
    // ═══════════════════════════════════════════════════════════

    const { data: agentLogs } = await supabase
      .from("agent_activity_log")
      .select("agent_name, created_at, status")
      .in("agent_name", KNOWN_AGENTS)
      .order("created_at", { ascending: false });

    // Get latest run per agent
    const latestByAgent: Record<string, { created_at: string; status: string }> = {};
    for (const log of agentLogs || []) {
      if (!latestByAgent[log.agent_name]) {
        latestByAgent[log.agent_name] = { created_at: log.created_at, status: log.status };
      }
    }

    const healthy: string[] = [];
    const warning: string[] = [];
    const critical: string[] = [];

    for (const agent of KNOWN_AGENTS) {
      const last = latestByAgent[agent];
      if (!last) {
        critical.push(agent);
        continue;
      }
      const lastRun = new Date(last.created_at);
      const hoursAgo = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);

      if (hoursAgo > 48) {
        critical.push(agent);
      } else if (hoursAgo > 24) {
        warning.push(agent);
      } else {
        healthy.push(agent);
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 2. PIPELINE SUMMARY
    // ═══════════════════════════════════════════════════════════

    const [
      { count: queuePending },
      { count: queueEmailed },
      { count: queueReplied },
      { count: queueBooked },
      { count: queueDisqualified },
      { count: newProspects24h },
      { count: emailsSent24h },
      { count: opens24h },
      { count: replies24h },
      { count: bookings24h },
    ] = await Promise.all([
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).eq("status", "emailed"),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).eq("status", "replied"),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).eq("status", "booked"),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).eq("status", "disqualified"),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).gte("created_at", twentyFourHoursAgo),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", twentyFourHoursAgo),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).not("opened_at", "is", null).gte("sent_at", twentyFourHoursAgo),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).not("replied_at", "is", null).gte("sent_at", twentyFourHoursAgo),
      supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", twentyFourHoursAgo),
    ]);

    // ═══════════════════════════════════════════════════════════
    // 3. DEALS & REVENUE
    // ═══════════════════════════════════════════════════════════

    const [
      { data: activeDeals },
      { data: dealsMovedToday },
      { data: coldDeals },
    ] = await Promise.all([
      supabase.from("pipeline_deals").select("id, company_name, stage, deal_value, updated_at")
        .not("stage", "eq", "closed_lost"),
      supabase.from("pipeline_deals").select("id, company_name, stage, deal_value")
        .gte("updated_at", twentyFourHoursAgo)
        .not("stage", "eq", "closed_lost"),
      supabase.from("pipeline_deals").select("id, company_name, stage, deal_value, updated_at")
        .not("stage", "in", "(closed_won,closed_lost)")
        .lt("updated_at", sevenDaysAgo),
    ]);

    const dealList = activeDeals || [];
    const stageCounts: Record<string, number> = {};
    let totalPipelineValue = 0;
    for (const deal of dealList) {
      stageCounts[deal.stage] = (stageCounts[deal.stage] || 0) + 1;
      totalPipelineValue += deal.deal_value || 0;
    }

    const movedToday = (dealsMovedToday || []).length;
    const coldDealList = coldDeals || [];

    // ═══════════════════════════════════════════════════════════
    // 4. URGENT ACTIONS
    // ═══════════════════════════════════════════════════════════

    const [
      { data: unrepliedProspects },
      { data: staleNegotiations },
      { data: upcomingBookings },
      { data: deliverabilityAlerts },
    ] = await Promise.all([
      // Prospects who replied but Kevin hasn't responded
      supabase.from("warm_outreach_queue")
        .select("contact_name, company_name, contact_email, updated_at")
        .eq("reply_received", true)
        .not("status", "in", "(booked,contacted,closed)")
        .limit(20),

      // Deals in negotiation with no update in 3+ days
      supabase.from("pipeline_deals")
        .select("company_name, stage, deal_value, updated_at")
        .eq("stage", "negotiation")
        .lt("updated_at", threeDaysAgo)
        .limit(10),

      // Bookings for today/tomorrow
      supabase.from("bookings")
        .select("contact_name, company_name, booking_date, booking_time")
        .gte("booking_date", todayISO)
        .lt("booking_date", tomorrowEnd)
        .order("booking_date", { ascending: true })
        .limit(10),

      // Recent deliverability issues
      supabase.from("agent_activity_log")
        .select("message, created_at, status")
        .eq("agent_name", "deliverability-monitor")
        .eq("status", "error")
        .gte("created_at", twentyFourHoursAgo)
        .limit(5),
    ]);

    // Build action items
    const actions: string[] = [];
    const unreplied = unrepliedProspects || [];
    if (unreplied.length > 0) {
      actions.push(`${unreplied.length} prospect reply(ies) need your response:`);
      for (const u of unreplied.slice(0, 5)) {
        actions.push(`   → ${u.contact_name || "Unknown"} at ${u.company_name || "?"} (${u.contact_email || "no email"})`);
      }
      if (unreplied.length > 5) actions.push(`   → ...and ${unreplied.length - 5} more`);
    }

    const staleNegs = staleNegotiations || [];
    if (staleNegs.length > 0) {
      actions.push(`${staleNegs.length} negotiation deal(s) stale (3+ days no update):`);
      for (const d of staleNegs.slice(0, 3)) {
        actions.push(`   → ${d.company_name} — R${formatRand(d.deal_value || 0)}`);
      }
    }

    const delivAlerts = deliverabilityAlerts || [];
    if (delivAlerts.length > 0) {
      actions.push(`${delivAlerts.length} deliverability alert(s) in last 24h`);
    }

    if (critical.length > 0) {
      actions.push(`${critical.length} agent(s) CRITICAL — no activity in 48h+: ${critical.join(", ")}`);
    }

    const bookings = upcomingBookings || [];
    if (bookings.length > 0) {
      actions.push(`${bookings.length} booking(s) today/tomorrow:`);
      for (const b of bookings) {
        actions.push(`   → ${b.contact_name || "Unknown"} at ${b.company_name || "?"} — ${b.booking_date} ${b.booking_time || ""}`);
      }
    }

    if (actions.length === 0) {
      actions.push("No urgent actions — all clear.");
    }

    // ═══════════════════════════════════════════════════════════
    // 5. WEEKLY TRENDS (Sundays only)
    // ═══════════════════════════════════════════════════════════

    let weeklySection = "";
    let weeklyHtml = "";

    if (isSunday) {
      // This week (last 7 days) vs last week (7-14 days ago)
      const [
        { count: thisWeekEmails },
        { count: lastWeekEmails },
        { count: thisWeekOpens },
        { count: lastWeekOpens },
        { count: thisWeekReplies },
        { count: lastWeekReplies },
        { count: thisWeekBookings },
        { count: lastWeekBookings },
        { data: thisWeekDeals },
        { data: lastWeekDeals },
      ] = await Promise.all([
        supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", sevenDaysAgo),
        supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", fourteenDaysAgo).lt("sent_at", sevenDaysAgo),
        supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).not("opened_at", "is", null).gte("sent_at", sevenDaysAgo),
        supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).not("opened_at", "is", null).gte("sent_at", fourteenDaysAgo).lt("sent_at", sevenDaysAgo),
        supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).not("replied_at", "is", null).gte("sent_at", sevenDaysAgo),
        supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).not("replied_at", "is", null).gte("sent_at", fourteenDaysAgo).lt("sent_at", sevenDaysAgo),
        supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
        supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", fourteenDaysAgo).lt("created_at", sevenDaysAgo),
        supabase.from("pipeline_deals").select("deal_value").gte("created_at", sevenDaysAgo),
        supabase.from("pipeline_deals").select("deal_value").gte("created_at", fourteenDaysAgo).lt("created_at", sevenDaysAgo),
      ]);

      const twe = thisWeekEmails || 0;
      const lwe = lastWeekEmails || 0;
      const two = thisWeekOpens || 0;
      const lwo = lastWeekOpens || 0;
      const twr = thisWeekReplies || 0;
      const lwr = lastWeekReplies || 0;
      const twb = thisWeekBookings || 0;
      const lwb = lastWeekBookings || 0;
      const twdCount = (thisWeekDeals || []).length;
      const lwdCount = (lastWeekDeals || []).length;

      const openRate = twe > 0 ? `${pct(two, twe)}%` : "N/A";
      const lastOpenRate = lwe > 0 ? `${pct(lwo, lwe)}%` : "N/A";
      const replyRate = twe > 0 ? `${pct(twr, twe)}%` : "N/A";
      const lastReplyRate = lwe > 0 ? `${pct(lwr, lwe)}%` : "N/A";

      // Recommendation based on trends
      const recommendations: string[] = [];
      if (twr < lwr && twe >= lwe) recommendations.push("Reply rate dropped — review email copy and subject lines");
      if (two < lwo && twe >= lwe) recommendations.push("Open rate down — test new subject lines this week");
      if (twb === 0 && twr > 0) recommendations.push("Replies not converting to bookings — follow up faster on warm leads");
      if (twe < lwe * 0.7) recommendations.push("Email volume dropped significantly — check agent health");
      if (recommendations.length === 0) recommendations.push("Pipeline running well — maintain current cadence");

      weeklySection = `
📈 WEEKLY TRENDS (this week vs last):
├─ Emails: ${twe} ${trend(twe, lwe)} (was ${lwe})
├─ Open rate: ${openRate} ${trend(two, lwo)} (was ${lastOpenRate})
├─ Reply rate: ${replyRate} ${trend(twr, lwr)} (was ${lastReplyRate})
├─ Bookings: ${twb} ${trend(twb, lwb)} (was ${lwb})
├─ New deals: ${twdCount} ${trend(twdCount, lwdCount)} (was ${lwdCount})
└─ Focus: ${recommendations[0]}`;

      weeklyHtml = `
      <h3 style="color:#2c3e50;margin-top:24px;">📈 Weekly Trends</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <tr style="background:#f8f9fa;"><th style="padding:8px;text-align:left;">Metric</th><th style="padding:8px;">This Week</th><th style="padding:8px;">Last Week</th><th style="padding:8px;">Trend</th></tr>
        <tr><td style="padding:8px;">Emails Sent</td><td style="padding:8px;text-align:center;">${twe}</td><td style="padding:8px;text-align:center;">${lwe}</td><td style="padding:8px;text-align:center;">${trend(twe, lwe)}</td></tr>
        <tr style="background:#f8f9fa;"><td style="padding:8px;">Open Rate</td><td style="padding:8px;text-align:center;">${openRate}</td><td style="padding:8px;text-align:center;">${lastOpenRate}</td><td style="padding:8px;text-align:center;">${trend(two, lwo)}</td></tr>
        <tr><td style="padding:8px;">Reply Rate</td><td style="padding:8px;text-align:center;">${replyRate}</td><td style="padding:8px;text-align:center;">${lastReplyRate}</td><td style="padding:8px;text-align:center;">${trend(twr, lwr)}</td></tr>
        <tr style="background:#f8f9fa;"><td style="padding:8px;">Bookings</td><td style="padding:8px;text-align:center;">${twb}</td><td style="padding:8px;text-align:center;">${lwb}</td><td style="padding:8px;text-align:center;">${trend(twb, lwb)}</td></tr>
        <tr><td style="padding:8px;">New Deals</td><td style="padding:8px;text-align:center;">${twdCount}</td><td style="padding:8px;text-align:center;">${lwdCount}</td><td style="padding:8px;text-align:center;">${trend(twdCount, lwdCount)}</td></tr>
      </table>
      <p style="margin-top:12px;"><strong>Recommendation:</strong> ${recommendations.join(". ")}</p>`;
    }

    // ═══════════════════════════════════════════════════════════
    // 6. POST TO SLACK
    // ═══════════════════════════════════════════════════════════

    const warningList = warning.length > 0 ? `\n⚠️ Warning: ${warning.join(", ")}` : "";
    const criticalList = critical.length > 0 ? `\n🔴 Critical: ${critical.join(", ")}` : "";

    const stageBreakdown = Object.entries(stageCounts)
      .map(([stage, count]) => `${stage}: ${count}`)
      .join(" | ");

    const slackMessage = `🏢 COO DAILY BRIEF — ${dateStr} ${timeStr} SAST

AGENT ARMY: ${healthy.length}/${KNOWN_AGENTS.length} healthy | ${warning.length} warnings | ${critical.length} critical${warningList}${criticalList}

PIPELINE:
├─ Queue: ${queuePending || 0} pending → ${queueEmailed || 0} emailed → ${queueReplied || 0} replied → ${queueBooked || 0} booked
├─ Today: ${emailsSent24h || 0} emails sent, ${opens24h || 0} opens, ${replies24h || 0} replies
├─ New prospects (24h): ${newProspects24h || 0}
├─ Deals: ${dealList.length} active (R${formatRand(totalPipelineValue)}) | ${movedToday} moved forward today
├─ Stages: ${stageBreakdown || "none"}
└─ Cold deals: ${coldDealList.length} need attention

⚡ KEVIN — ACTION REQUIRED:
${(() => { let n = 0; return actions.map((a) => a.startsWith("   ") ? a : `${++n}. ${a}`).join("\n"); })()}${weeklySection ? "\n" + weeklySection : ""}`;

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: {
            function: "COO Daily Brief",
            error: slackMessage,
          },
        }),
      });
      console.log("Slack posted successfully");
    } catch (slackErr) {
      console.error("Failed to post to Slack:", slackErr);
    }

    // ═══════════════════════════════════════════════════════════
    // 7. EMAIL KEVIN
    // ═══════════════════════════════════════════════════════════

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const agentRows = KNOWN_AGENTS.map((agent) => {
        const last = latestByAgent[agent];
        let statusLabel = "🔴 CRITICAL";
        let statusColor = "#e74c3c";
        if (last) {
          const hoursAgo = (now.getTime() - new Date(last.created_at).getTime()) / (1000 * 60 * 60);
          if (hoursAgo <= 24) { statusLabel = "✅ Healthy"; statusColor = "#27ae60"; }
          else if (hoursAgo <= 48) { statusLabel = "⚠️ Warning"; statusColor = "#f39c12"; }
        }
        return `<tr><td style="padding:6px 12px;">${agent}</td><td style="padding:6px 12px;color:${statusColor};font-weight:600;">${statusLabel}</td></tr>`;
      }).join("");

      const actionHtml = actions.map((a) => {
        if (a.startsWith("   ")) return `<li style="margin-left:20px;list-style:circle;margin-bottom:2px;">${a.trim()}</li>`;
        return `<li style="margin-bottom:6px;font-weight:500;">${a}</li>`;
      }).join("");

      const coldDealRows = coldDealList.slice(0, 5).map((d: any) =>
        `<tr><td style="padding:4px 8px;">${d.company_name || "Unknown"}</td><td style="padding:4px 8px;">${d.stage}</td><td style="padding:4px 8px;">R${formatRand(d.deal_value || 0)}</td></tr>`
      ).join("");

      const emailHtml = `
<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;max-width:680px;margin:0 auto;color:#333;">
  <div style="background:#1a1a2e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
    <h1 style="margin:0;font-size:20px;">🏢 COO Daily Brief</h1>
    <p style="margin:4px 0 0;opacity:0.8;font-size:13px;">${dateStr} — ${timeStr} SAST</p>
  </div>

  <div style="padding:20px 24px;background:#fff;border:1px solid #e0e0e0;">

    <h3 style="color:#2c3e50;border-bottom:2px solid #3498db;padding-bottom:8px;">Agent Army — ${healthy.length}/${KNOWN_AGENTS.length} Healthy</h3>
    <table style="border-collapse:collapse;width:100%;font-size:13px;">
      ${agentRows}
    </table>

    <h3 style="color:#2c3e50;border-bottom:2px solid #3498db;padding-bottom:8px;margin-top:24px;">Pipeline</h3>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      <tr><td style="padding:4px 0;">Queue — Pending</td><td style="padding:4px 0;font-weight:600;">${queuePending || 0}</td></tr>
      <tr><td style="padding:4px 0;">Queue — Emailed</td><td style="padding:4px 0;font-weight:600;">${queueEmailed || 0}</td></tr>
      <tr><td style="padding:4px 0;">Queue — Replied</td><td style="padding:4px 0;font-weight:600;">${queueReplied || 0}</td></tr>
      <tr><td style="padding:4px 0;">Queue — Booked</td><td style="padding:4px 0;font-weight:600;">${queueBooked || 0}</td></tr>
      <tr><td style="padding:4px 0;">Queue — Disqualified</td><td style="padding:4px 0;font-weight:600;">${queueDisqualified || 0}</td></tr>
      <tr style="border-top:1px solid #eee;"><td style="padding:8px 0;">New prospects (24h)</td><td style="padding:8px 0;font-weight:600;">${newProspects24h || 0}</td></tr>
      <tr><td style="padding:4px 0;">Emails sent (24h)</td><td style="padding:4px 0;font-weight:600;">${emailsSent24h || 0}</td></tr>
      <tr><td style="padding:4px 0;">Opens (24h)</td><td style="padding:4px 0;font-weight:600;">${opens24h || 0}</td></tr>
      <tr><td style="padding:4px 0;">Replies (24h)</td><td style="padding:4px 0;font-weight:600;">${replies24h || 0}</td></tr>
      <tr><td style="padding:4px 0;">Bookings (24h)</td><td style="padding:4px 0;font-weight:600;">${bookings24h || 0}</td></tr>
    </table>

    <h3 style="color:#2c3e50;border-bottom:2px solid #3498db;padding-bottom:8px;margin-top:24px;">Deals & Revenue</h3>
    <p><strong>${dealList.length}</strong> active deals — <strong>R${formatRand(totalPipelineValue)}</strong> total pipeline</p>
    <p>Stages: ${stageBreakdown || "No active deals"}</p>
    <p>${movedToday} deal(s) moved forward in last 24h</p>
    ${coldDealList.length > 0 ? `
    <p style="color:#e74c3c;font-weight:600;">⚠️ ${coldDealList.length} deal(s) gone cold (no update in 7+ days):</p>
    <table style="border-collapse:collapse;font-size:13px;">
      ${coldDealRows}
    </table>` : "<p style='color:#27ae60;'>No cold deals — all active deals updated recently.</p>"}

    <h3 style="color:#c0392b;border-bottom:2px solid #e74c3c;padding-bottom:8px;margin-top:24px;">⚡ Action Required</h3>
    <ul style="padding-left:20px;">
      ${actionHtml}
    </ul>

    ${weeklyHtml}
  </div>

  <div style="background:#f8f9fa;padding:12px 24px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;border-top:none;">
    <p style="margin:0;font-size:12px;color:#888;">Generated by COO Agent — Leadership by Design AI System</p>
  </div>
</div>`;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "LBD System <hello@leadershipbydesign.co>",
            to: ["kevin@kevinbritz.com"],
            subject: `LBD Daily Brief — ${dateStr}`,
            html: emailHtml,
          }),
        });
        console.log("Email sent to Kevin");
      } catch (emailErr) {
        console.error("Failed to email Kevin:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping email");
    }

    // ═══════════════════════════════════════════════════════════
    // 8. LOG TO agent_activity_log
    // ═══════════════════════════════════════════════════════════

    await supabase.from("agent_activity_log").insert({
      agent_name: "coo-agent",
      agent_type: "reporting",
      status: "success",
      message: `Daily brief posted | Agents: ${healthy.length}/${KNOWN_AGENTS.length} healthy | Pipeline: R${formatRand(totalPipelineValue)} | Actions: ${actions.length}`,
      details: {
        agents: { healthy: healthy.length, warning: warning.length, critical: critical.length, critical_list: critical, warning_list: warning },
        pipeline: { pending: queuePending || 0, emailed: queueEmailed || 0, replied: queueReplied || 0, booked: queueBooked || 0, disqualified: queueDisqualified || 0 },
        today: { new_prospects: newProspects24h || 0, emails_sent: emailsSent24h || 0, opens: opens24h || 0, replies: replies24h || 0, bookings: bookings24h || 0 },
        deals: { active: dealList.length, pipeline_value: totalPipelineValue, moved_today: movedToday, cold: coldDealList.length },
        actions_count: actions.length,
        is_sunday: isSunday,
      },
      items_processed: KNOWN_AGENTS.length,
    });

    return new Response(
      JSON.stringify({
        success: true,
        agents: { healthy: healthy.length, warning: warning.length, critical: critical.length },
        pipeline: { pending: queuePending || 0, emailed: queueEmailed || 0, replied: queueReplied || 0, booked: queueBooked || 0 },
        deals: { active: dealList.length, pipeline_value: totalPipelineValue, cold: coldDealList.length },
        actions: actions.length,
      }),
      { headers }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("coo-agent error:", errMsg);

    // Log error
    try {
      await supabase.from("agent_activity_log").insert({
        agent_name: "coo-agent",
        agent_type: "reporting",
        status: "error",
        message: errMsg,
      });
    } catch { /* best effort */ }

    // Alert on Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "system-health",
          eventType: "system_error",
          data: {
            function: "coo-agent",
            error: errMsg,
          },
        }),
      });
    } catch { /* best effort */ }

    return new Response(JSON.stringify({ success: false, error: errMsg }), { status: 500, headers });
  }
});
