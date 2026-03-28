import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const USD_TO_ZAR = 18.5;

// Cost constants (USD)
const COST_PER_EMAIL_ANTHROPIC = 0.003; // Sonnet ~400 tokens out
const COST_PER_APOLLO_ENRICHMENT = 0.05;
const COST_PER_FIRECRAWL_SCRAPE = 0.001;
const RESEND_FREE_TIER_LIMIT = 3000;
const COST_PER_RESEND_OVER_FREE = 0.001;
const SUPABASE_MONTHLY_FIXED = 25; // USD

// Pipeline stage conversion rates (defaults)
const STAGE_PROBABILITIES: Record<string, number> = {
  new_lead: 0.02,
  contacted: 0.05,
  meeting: 0.4,
  proposal: 0.6,
  negotiation: 0.5,
  closed_won: 1.0,
  closed_lost: 0,
};

function fmt(n: number, decimals = 2): string {
  return n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function weekStart(d: Date): string {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

function weekStartNWeeksAgo(d: Date, n: number): string {
  const past = new Date(d);
  past.setDate(past.getDate() - n * 7);
  return weekStart(past);
}

function monthStart(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function prevMonthStart(d: Date): string {
  const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-01`;
}

function prevMonthEnd(d: Date): string {
  const end = new Date(d.getFullYear(), d.getMonth(), 0);
  return end.toISOString().split("T")[0];
}

function trendArrow(current: number, previous: number): string {
  if (previous === 0 && current === 0) return "→";
  if (previous === 0) return "↑";
  const pctChange = ((current - previous) / previous) * 100;
  if (pctChange > 5) return "↑";
  if (pctChange < -5) return "↓";
  return "→";
}

function trendArrowInverse(current: number, previous: number): string {
  // For metrics where lower is better (costs, CAC)
  if (previous === 0 && current === 0) return "→";
  if (previous === 0) return "↑";
  const pctChange = ((current - previous) / previous) * 100;
  if (pctChange > 5) return "↑";
  if (pctChange < -5) return "↓";
  return "→";
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function isFirstSundayOfMonth(d: Date): boolean {
  return d.getDay() === 0 && d.getDate() <= 7;
}

function classifyChannel(src: string): string {
  const s = src.toLowerCase();
  if (s.includes("apollo")) return "apollo";
  if (s.includes("firecrawl") || s.includes("signal") || s.includes("auto-pipeline") || s.includes("web-scraper") || s.includes("scraper")) return "web-scraper";
  if (s.includes("diagnostic") || s.includes("lac")) return "diagnostic:lac";
  if (s.includes("google") || s.includes("paid") || s.includes("gads")) return "google-ads";
  if (s.includes("vibe")) return "vibe-prospect";
  return s.split("-")[0] || "other";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const weekStartDate = weekStart(now);
    const monthStartDate = monthStart(now);
    const weekStartISO = new Date(weekStartDate).toISOString();
    const monthStartISO = new Date(monthStartDate).toISOString();
    const dateLabel = now.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // ═══════════════════════════════════════════════════════════
    // 1. COST TRACKING
    // ═══════════════════════════════════════════════════════════

    // Emails sent this week (Anthropic API cost)
    const { count: emailsThisWeek } = await supabase
      .from("prospect_outreach")
      .select("id", { count: "exact", head: true })
      .gte("sent_at", weekStartISO);

    // Emails sent this month (for Resend + overall)
    const { count: emailsThisMonth } = await supabase
      .from("prospect_outreach")
      .select("id", { count: "exact", head: true })
      .gte("sent_at", monthStartISO);

    // Also count from warm_outreach_queue emails sent
    const { count: warmEmailsWeek } = await supabase
      .from("warm_outreach_queue")
      .select("id", { count: "exact", head: true })
      .gte("email_sent_at", weekStartISO);

    const { count: warmEmailsMonth } = await supabase
      .from("warm_outreach_queue")
      .select("id", { count: "exact", head: true })
      .gte("email_sent_at", monthStartISO);

    const totalEmailsWeek = (emailsThisWeek || 0) + (warmEmailsWeek || 0);
    const totalEmailsMonth = (emailsThisMonth || 0) + (warmEmailsMonth || 0);

    // Apollo imports this week
    const { count: apolloImportsWeek } = await supabase
      .from("warm_outreach_queue")
      .select("id", { count: "exact", head: true })
      .ilike("source_keyword", "%apollo%")
      .gte("created_at", weekStartISO);

    const { count: apolloImportsMonth } = await supabase
      .from("warm_outreach_queue")
      .select("id", { count: "exact", head: true })
      .ilike("source_keyword", "%apollo%")
      .gte("created_at", monthStartISO);

    // Calculate costs (USD)
    const costAnthropic = totalEmailsWeek * COST_PER_EMAIL_ANTHROPIC;
    const costApollo = (apolloImportsWeek || 0) * COST_PER_APOLLO_ENRICHMENT;
    const costFirecrawl = totalEmailsWeek * COST_PER_FIRECRAWL_SCRAPE; // ~1 scrape per email
    const resendOverFree = Math.max(0, totalEmailsMonth - RESEND_FREE_TIER_LIMIT);
    const costResendMonthly = resendOverFree * COST_PER_RESEND_OVER_FREE;
    const costResendWeekly = costResendMonthly / 4; // rough weekly estimate
    const costSupabaseWeekly = SUPABASE_MONTHLY_FIXED / 4;

    const totalCostWeek =
      costAnthropic + costApollo + costFirecrawl + costResendWeekly + costSupabaseWeekly;
    const totalCostMonth = totalCostWeek * 4; // projected

    // ═══════════════════════════════════════════════════════════
    // 2. REVENUE ATTRIBUTION
    // ═══════════════════════════════════════════════════════════

    // Deals closed this week
    const { data: closedWeek } = await supabase
      .from("pipeline_deals")
      .select("id, deal_value, lead_email, lead_company, lead_source_table")
      .eq("stage", "closed_won")
      .gte("closed_at", weekStartISO);

    // Deals closed this month
    const { data: closedMonth } = await supabase
      .from("pipeline_deals")
      .select("id, deal_value, lead_email, lead_company, lead_source_table")
      .eq("stage", "closed_won")
      .gte("closed_at", monthStartISO);

    const revenueWeek = (closedWeek || []).reduce((s, d) => s + (d.deal_value || 0), 0);
    const revenueMonth = (closedMonth || []).reduce((s, d) => s + (d.deal_value || 0), 0);
    const dealsWonWeek = closedWeek?.length || 0;
    const dealsWonMonth = closedMonth?.length || 0;

    // Revenue by channel — trace closed deals back to warm_outreach_queue source
    const channelRevenue: Record<string, { revenue: number; count: number }> = {};

    for (const deal of closedMonth || []) {
      let channel = "manual";
      if (deal.lead_email) {
        const { data: queueEntry } = await supabase
          .from("warm_outreach_queue")
          .select("source_keyword")
          .eq("contact_email", deal.lead_email)
          .limit(1)
          .maybeSingle();

        if (queueEntry?.source_keyword) {
          const src = queueEntry.source_keyword.toLowerCase();
          if (src.includes("apollo")) channel = "apollo";
          else if (src.includes("firecrawl") || src.includes("signal") || src.includes("auto-pipeline"))
            channel = "web-scraper";
          else if (src.includes("diagnostic") || src.includes("lac")) channel = "diagnostic";
          else if (src.includes("google") || src.includes("paid") || src.includes("gads"))
            channel = "google-ads";
          else channel = src.split("-")[0] || "other";
        }
      }
      if (!channelRevenue[channel]) channelRevenue[channel] = { revenue: 0, count: 0 };
      channelRevenue[channel].revenue += deal.deal_value || 0;
      channelRevenue[channel].count += 1;
    }

    // Best channel
    let bestChannel = "none";
    let bestChannelRevenue = 0;
    for (const [ch, data] of Object.entries(channelRevenue)) {
      if (data.revenue > bestChannelRevenue) {
        bestChannel = ch;
        bestChannelRevenue = data.revenue;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 3. UNIT ECONOMICS
    // ═══════════════════════════════════════════════════════════

    // Total prospects imported this month
    const { count: prospectsMonth } = await supabase
      .from("warm_outreach_queue")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStartISO);

    // Replies this month
    const { count: repliesMonth } = await supabase
      .from("warm_outreach_queue")
      .select("id", { count: "exact", head: true })
      .in("status", ["replied", "interested", "booked"])
      .gte("email_sent_at", monthStartISO);

    // Bookings this month
    const { count: bookingsMonth } = await supabase
      .from("warm_outreach_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "booked")
      .gte("email_sent_at", monthStartISO);

    // Deals created this month (all stages)
    const { count: dealsCreatedMonth } = await supabase
      .from("pipeline_deals")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStartISO);

    const totalCostMonthZAR = totalCostMonth * USD_TO_ZAR;
    const costPerLead =
      (prospectsMonth || 0) > 0 ? totalCostMonthZAR / (prospectsMonth || 1) : 0;
    const costPerEmail =
      totalEmailsMonth > 0 ? totalCostMonthZAR / totalEmailsMonth : 0;
    const costPerReply =
      (repliesMonth || 0) > 0 ? totalCostMonthZAR / (repliesMonth || 1) : 0;
    const costPerBooking =
      (bookingsMonth || 0) > 0 ? totalCostMonthZAR / (bookingsMonth || 1) : 0;
    const costPerDeal =
      (dealsCreatedMonth || 0) > 0 ? totalCostMonthZAR / (dealsCreatedMonth || 1) : 0;
    const cac =
      dealsWonMonth > 0 ? totalCostMonthZAR / dealsWonMonth : 0;
    const roiPercent =
      totalCostMonthZAR > 0 ? (revenueMonth / totalCostMonthZAR) * 100 : 0;

    // ═══════════════════════════════════════════════════════════
    // 4. PIPELINE FORECAST
    // ═══════════════════════════════════════════════════════════

    const { data: allDeals } = await supabase
      .from("pipeline_deals")
      .select("stage, deal_value")
      .not("stage", "eq", "closed_lost");

    const stageBreakdown: Record<string, { count: number; value: number }> = {};
    let weightedPipeline = 0;

    for (const deal of allDeals || []) {
      const stage = deal.stage || "new_lead";
      if (!stageBreakdown[stage]) stageBreakdown[stage] = { count: 0, value: 0 };
      stageBreakdown[stage].count += 1;
      stageBreakdown[stage].value += deal.deal_value || 0;

      const probability = STAGE_PROBABILITIES[stage] ?? 0.1;
      weightedPipeline += (deal.deal_value || 0) * probability;
    }

    // ═══════════════════════════════════════════════════════════
    // 5. CASH FLOW INSIGHT
    // ═══════════════════════════════════════════════════════════

    const avgDealValue =
      dealsWonMonth > 0 ? revenueMonth / dealsWonMonth : weightedPipeline > 0 ? 50000 : 0;
    const dealsNeededForBreakeven =
      avgDealValue > 0 ? Math.ceil(totalCostMonthZAR / avgDealValue) : 0;

    // Best/worst ROI channel
    let bestROIChannel = "none";
    let bestROIRatio = 0;
    let worstROIChannel = "none";
    let worstROIRatio = Infinity;

    for (const [ch, data] of Object.entries(channelRevenue)) {
      const ratio = data.revenue; // revenue per channel (cost allocation is rough)
      if (ratio > bestROIRatio) {
        bestROIRatio = ratio;
        bestROIChannel = ch;
      }
      if (ratio < worstROIRatio) {
        worstROIRatio = ratio;
        worstROIChannel = ch;
      }
    }

    // Build recommendation
    let recommendation = "";
    if (totalCostMonthZAR > 0 && revenueMonth === 0) {
      recommendation =
        "No closed revenue this month yet. Focus on converting pipeline deals — especially those in proposal/negotiation stage. Every deal matters at this stage.";
    } else if (roiPercent > 500) {
      recommendation = `ROI is exceptional at ${fmt(roiPercent, 0)}%. The system is generating strong returns. Consider increasing prospecting volume to accelerate growth.`;
    } else if (roiPercent > 100) {
      recommendation = `Positive ROI at ${fmt(roiPercent, 0)}%. System is profitable. Focus on improving conversion rates to amplify returns.`;
    } else if (roiPercent > 0) {
      recommendation = `ROI is ${fmt(roiPercent, 0)}% — not yet breaking even on a monthly basis. Prioritise closing pipeline deals and review underperforming channels.`;
    } else {
      recommendation =
        "No revenue data to calculate ROI. Ensure pipeline_deals are being tracked with deal_value and stage updates.";
    }

    if (bestROIChannel !== "none" && bestROIChannel !== worstROIChannel) {
      recommendation += ` Best channel: ${bestROIChannel}. Consider increasing allocation there.`;
    }

    // ═══════════════════════════════════════════════════════════
    // 6. POST TO SLACK
    // ═══════════════════════════════════════════════════════════

    const pipelineLines = Object.entries(stageBreakdown)
      .map(([stage, info]) => `  ${stage}: ${info.count} deals (R${fmt(info.value, 0)})`)
      .join("\n");

    const slackMessage = [
      `*COSTS (estimated, USD):*`,
      `\`\`\``,
      `Anthropic API:  $${fmt(costAnthropic)}`,
      `Apollo:         $${fmt(costApollo)}`,
      `Firecrawl:      $${fmt(costFirecrawl)}`,
      `Resend:         $${fmt(costResendWeekly)}`,
      `Supabase:       $${fmt(costSupabaseWeekly)}`,
      `TOTAL:          $${fmt(totalCostWeek)}/week ($${fmt(totalCostMonth)}/month projected)`,
      `                ~R${fmt(totalCostWeek * USD_TO_ZAR)}/week (R${fmt(totalCostMonthZAR)}/month)`,
      `\`\`\``,
      ``,
      `*REVENUE (ZAR):*`,
      `Closed this week: R${fmt(revenueWeek, 0)} (${dealsWonWeek} deal${dealsWonWeek !== 1 ? "s" : ""})`,
      `Closed this month: R${fmt(revenueMonth, 0)} (${dealsWonMonth} deal${dealsWonMonth !== 1 ? "s" : ""})`,
      bestChannel !== "none" ? `Best channel: ${bestChannel} — R${fmt(bestChannelRevenue, 0)}` : "",
      ``,
      `*UNIT ECONOMICS (ZAR, monthly):*`,
      `\`\`\``,
      `Cost per lead:    R${fmt(costPerLead)}`,
      `Cost per email:   R${fmt(costPerEmail)}`,
      `Cost per reply:   R${fmt(costPerReply)}`,
      `Cost per booking: R${fmt(costPerBooking)}`,
      `CAC:              R${fmt(cac)}`,
      `ROI:              ${fmt(roiPercent, 0)}%`,
      `\`\`\``,
      ``,
      `*PIPELINE FORECAST:*`,
      pipelineLines || "  No active deals",
      `Weighted pipeline: R${fmt(weightedPipeline, 0)}`,
      dealsNeededForBreakeven > 0
        ? `Break-even: ${dealsNeededForBreakeven} more deal${dealsNeededForBreakeven !== 1 ? "s" : ""} needed at avg R${fmt(avgDealValue, 0)}`
        : "",
      ``,
      `*RECOMMENDATION:*`,
      recommendation,
      ``,
      `_Note: API costs in USD, revenue in ZAR. Approximate rate: $1 = R${USD_TO_ZAR}_`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: {
            function: `CFO WEEKLY FINANCIAL REPORT — Week of ${dateLabel}`,
            error: slackMessage,
          },
        }),
      });
      console.log("Slack notification sent");
    } catch (e) {
      console.error("Slack notification failed:", e);
    }

    // ═══════════════════════════════════════════════════════════
    // 7. EMAIL KEVIN
    // ═══════════════════════════════════════════════════════════

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const channelRows = Object.entries(channelRevenue)
        .map(
          ([ch, data]) =>
            `<tr><td style="padding:4px 12px;">${ch}</td><td style="padding:4px 12px;">R${fmt(data.revenue, 0)}</td><td style="padding:4px 12px;">${data.count}</td></tr>`
        )
        .join("");

      const pipelineRows = Object.entries(stageBreakdown)
        .map(
          ([stage, info]) =>
            `<tr><td style="padding:4px 12px;">${stage}</td><td style="padding:4px 12px;">${info.count}</td><td style="padding:4px 12px;">R${fmt(info.value, 0)}</td></tr>`
        )
        .join("");

      const emailHtml = `
<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;max-width:700px;color:#1a1a1a;">
  <h1 style="font-size:20px;color:#2c3e50;border-bottom:2px solid #3498db;padding-bottom:8px;">
    CFO Weekly Financial Report — Week of ${dateLabel}
  </h1>

  <h2 style="font-size:16px;color:#2c3e50;margin-top:24px;">Costs (Estimated, USD)</h2>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Anthropic API</td><td style="padding:6px 12px;text-align:right;">$${fmt(costAnthropic)}</td></tr>
    <tr><td style="padding:6px 12px;">Apollo</td><td style="padding:6px 12px;text-align:right;">$${fmt(costApollo)}</td></tr>
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Firecrawl</td><td style="padding:6px 12px;text-align:right;">$${fmt(costFirecrawl)}</td></tr>
    <tr><td style="padding:6px 12px;">Resend</td><td style="padding:6px 12px;text-align:right;">$${fmt(costResendWeekly)}</td></tr>
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Supabase</td><td style="padding:6px 12px;text-align:right;">$${fmt(costSupabaseWeekly)}</td></tr>
    <tr style="font-weight:bold;border-top:2px solid #333;"><td style="padding:6px 12px;">TOTAL (weekly)</td><td style="padding:6px 12px;text-align:right;">$${fmt(totalCostWeek)} (~R${fmt(totalCostWeek * USD_TO_ZAR)})</td></tr>
    <tr style="font-weight:bold;"><td style="padding:6px 12px;">TOTAL (monthly projected)</td><td style="padding:6px 12px;text-align:right;">$${fmt(totalCostMonth)} (~R${fmt(totalCostMonthZAR)})</td></tr>
  </table>

  <h2 style="font-size:16px;color:#2c3e50;margin-top:24px;">Revenue (ZAR)</h2>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Closed this week</td><td style="padding:6px 12px;text-align:right;">R${fmt(revenueWeek, 0)} (${dealsWonWeek} deals)</td></tr>
    <tr><td style="padding:6px 12px;">Closed this month</td><td style="padding:6px 12px;text-align:right;">R${fmt(revenueMonth, 0)} (${dealsWonMonth} deals)</td></tr>
  </table>
  ${
    Object.keys(channelRevenue).length > 0
      ? `<h3 style="font-size:14px;color:#2c3e50;margin-top:16px;">Revenue by Channel</h3>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;font-weight:bold;"><td style="padding:6px 12px;">Channel</td><td style="padding:6px 12px;">Revenue</td><td style="padding:6px 12px;">Deals</td></tr>
    ${channelRows}
  </table>`
      : ""
  }

  <h2 style="font-size:16px;color:#2c3e50;margin-top:24px;">Unit Economics (ZAR, Monthly)</h2>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Cost per lead</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerLead)}</td></tr>
    <tr><td style="padding:6px 12px;">Cost per email</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerEmail)}</td></tr>
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Cost per reply</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerReply)}</td></tr>
    <tr><td style="padding:6px 12px;">Cost per booking</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerBooking)}</td></tr>
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">CAC</td><td style="padding:6px 12px;text-align:right;">R${fmt(cac)}</td></tr>
    <tr style="font-weight:bold;border-top:2px solid #333;"><td style="padding:6px 12px;">ROI</td><td style="padding:6px 12px;text-align:right;">${fmt(roiPercent, 0)}%</td></tr>
  </table>

  <h2 style="font-size:16px;color:#2c3e50;margin-top:24px;">Pipeline Forecast</h2>
  ${
    Object.keys(stageBreakdown).length > 0
      ? `<table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;font-weight:bold;"><td style="padding:6px 12px;">Stage</td><td style="padding:6px 12px;">Deals</td><td style="padding:6px 12px;">Value</td></tr>
    ${pipelineRows}
  </table>`
      : "<p>No active deals in pipeline.</p>"
  }
  <p><strong>Weighted pipeline value:</strong> R${fmt(weightedPipeline, 0)}</p>
  ${
    dealsNeededForBreakeven > 0
      ? `<p><strong>Break-even:</strong> ${dealsNeededForBreakeven} more deal${dealsNeededForBreakeven !== 1 ? "s" : ""} needed at avg R${fmt(avgDealValue, 0)}</p>`
      : ""
  }

  <h2 style="font-size:16px;color:#27ae60;margin-top:24px;">Recommendation</h2>
  <p style="background:#f0fdf4;padding:12px;border-radius:6px;border-left:4px solid #27ae60;">
    ${recommendation}
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
  <p style="font-size:11px;color:#888;">
    API costs in USD, revenue in ZAR. Approximate conversion: $1 = R${USD_TO_ZAR}.<br>
    Generated by the LBD CFO Agent — ${now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })} SAST
  </p>
</div>`;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "LBD System <hello@leadershipbydesign.co>",
            to: ["kevin@kevinbritz.com"],
            reply_to: "hello@leadershipbydesign.co",
            subject: `LBD Financial Report — Week of ${dateLabel}`,
            html: emailHtml,
          }),
        });
        console.log("Financial report email sent to Kevin");
      } catch (e) {
        console.error("Email send failed:", e);
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping email");
    }

    // ═══════════════════════════════════════════════════════════
    // 8. STORE FINANCIAL SNAPSHOT
    // ═══════════════════════════════════════════════════════════

    const { error: snapshotError } = await supabase
      .from("financial_snapshots")
      .upsert(
        {
          week_start: weekStartDate,
          total_cost_estimate: parseFloat(totalCostWeek.toFixed(4)),
          total_revenue: revenueMonth,
          roi_percent: parseFloat(roiPercent.toFixed(2)),
          cac: parseFloat(cac.toFixed(2)),
          weighted_pipeline: parseFloat(weightedPipeline.toFixed(2)),
          cost_per_lead: parseFloat(costPerLead.toFixed(4)),
          cost_per_reply: parseFloat(costPerReply.toFixed(4)),
          best_channel: bestChannel,
        },
        { onConflict: "week_start" }
      );

    if (snapshotError) {
      console.error("Snapshot upsert error:", snapshotError.message);
      // Table might not exist yet — that's OK, log and continue
    } else {
      console.log("Financial snapshot saved for week:", weekStartDate);
    }

    // ═══════════════════════════════════════════════════════════
    // 9. LOG TO AGENT ACTIVITY
    // ═══════════════════════════════════════════════════════════

    await supabase.from("agent_activity_log").insert({
      agent_name: "cfo-agent",
      agent_type: "finance",
      status: "success",
      message: `Weekly report: $${fmt(totalCostWeek)} cost | R${fmt(revenueMonth, 0)} revenue | ROI ${fmt(roiPercent, 0)}% | Pipeline R${fmt(weightedPipeline, 0)}`,
      details: {
        costs: {
          anthropic: costAnthropic,
          apollo: costApollo,
          firecrawl: costFirecrawl,
          resend: costResendWeekly,
          supabase: costSupabaseWeekly,
          total_week_usd: totalCostWeek,
          total_month_usd: totalCostMonth,
          total_month_zar: totalCostMonthZAR,
        },
        revenue: {
          week: revenueWeek,
          month: revenueMonth,
          deals_won_week: dealsWonWeek,
          deals_won_month: dealsWonMonth,
          by_channel: channelRevenue,
        },
        unit_economics: {
          cost_per_lead: costPerLead,
          cost_per_email: costPerEmail,
          cost_per_reply: costPerReply,
          cost_per_booking: costPerBooking,
          cac,
          roi_percent: roiPercent,
        },
        pipeline: {
          weighted_value: weightedPipeline,
          stages: stageBreakdown,
          deals_needed_breakeven: dealsNeededForBreakeven,
        },
      },
      items_processed: dealsWonMonth + totalEmailsWeek,
    });

    return new Response(
      JSON.stringify({
        success: true,
        costs: {
          weekly_usd: totalCostWeek,
          monthly_usd: totalCostMonth,
          monthly_zar: totalCostMonthZAR,
        },
        revenue: { week: revenueWeek, month: revenueMonth },
        roi_percent: roiPercent,
        weighted_pipeline: weightedPipeline,
        cac,
      }),
      { headers }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("cfo-agent error:", errMsg);

    // Log failure
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabase.from("agent_activity_log").insert({
        agent_name: "cfo-agent",
        agent_type: "finance",
        status: "error",
        message: errMsg,
      });
    } catch {
      // best effort
    }

    return new Response(JSON.stringify({ success: false, error: errMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
