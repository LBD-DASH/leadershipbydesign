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
    // 5b. MULTI-WEEK TREND ANALYSIS (last 4 weeks)
    // ═══════════════════════════════════════════════════════════

    const fourWeeksAgo = weekStartNWeeksAgo(now, 4);
    const { data: historicalSnapshots } = await supabase
      .from("financial_snapshots")
      .select("*")
      .gte("week_start", fourWeeksAgo)
      .order("week_start", { ascending: true });

    const snapshots = historicalSnapshots || [];
    const hasHistory = snapshots.length >= 2;

    // Calculate trend data
    let costTrend = "→";
    let revenueTrend = "→";
    let roiTrend = "→";
    let cacTrend = "→";
    let fourWeekAvgCostPerLead = 0;
    let fourWeekAvgCostPerReply = 0;
    let fourWeekAvgCAC = 0;

    interface TrendData {
      week: string;
      cost: number;
      revenue: number;
      roi: number;
      cac: number;
      costPerLead: number;
      costPerReply: number;
    }

    const trendRows: TrendData[] = [];

    if (hasHistory) {
      for (const snap of snapshots) {
        trendRows.push({
          week: snap.week_start,
          cost: snap.total_cost_estimate || 0,
          revenue: snap.total_revenue || 0,
          roi: snap.roi_percent || 0,
          cac: snap.cac || 0,
          costPerLead: snap.cost_per_lead || 0,
          costPerReply: snap.cost_per_reply || 0,
        });
      }

      const latest = trendRows[trendRows.length - 1];
      const earliest = trendRows[0];

      costTrend = trendArrowInverse(latest.cost, earliest.cost);
      revenueTrend = trendArrow(latest.revenue, earliest.revenue);
      roiTrend = trendArrow(latest.roi, earliest.roi);
      cacTrend = trendArrowInverse(latest.cac, earliest.cac);

      fourWeekAvgCostPerLead = trendRows.reduce((s, r) => s + r.costPerLead, 0) / trendRows.length;
      fourWeekAvgCostPerReply = trendRows.reduce((s, r) => s + r.costPerReply, 0) / trendRows.length;
      fourWeekAvgCAC = trendRows.reduce((s, r) => s + r.cac, 0) / trendRows.length;
    }

    const trendSummarySlack = hasHistory
      ? [
          `*4-WEEK TREND ANALYSIS:*`,
          `\`\`\``,
          ...trendRows.map(
            (r) =>
              `${r.week}: Cost $${fmt(r.cost)} | Rev R${fmt(r.revenue, 0)} | ROI ${fmt(r.roi, 0)}% | CAC R${fmt(r.cac, 0)}`
          ),
          `\`\`\``,
          `Spend: ${costTrend}  Revenue: ${revenueTrend}  ROI: ${roiTrend}  CAC: ${cacTrend}`,
        ]
      : [`*4-WEEK TREND ANALYSIS:*`, `Not enough historical data yet (need 2+ weeks).`];

    // ═══════════════════════════════════════════════════════════
    // 5c. CHANNEL ROI DEEP-DIVE
    // ═══════════════════════════════════════════════════════════

    // Get all leads sourced this month grouped by source
    const { data: monthLeads } = await supabase
      .from("warm_outreach_queue")
      .select("id, contact_email, source_keyword")
      .gte("created_at", monthStartISO);

    interface ChannelStats {
      leads: number;
      emails: number;
      replies: number;
      dealsCreated: number;
      dealsClosed: number;
      revenue: number;
      leadEmails: string[];
    }

    const channelStats: Record<string, ChannelStats> = {};

    for (const lead of monthLeads || []) {
      const ch = classifyChannel(lead.source_keyword || "other");
      if (!channelStats[ch]) {
        channelStats[ch] = { leads: 0, emails: 0, replies: 0, dealsCreated: 0, dealsClosed: 0, revenue: 0, leadEmails: [] };
      }
      channelStats[ch].leads += 1;
      if (lead.contact_email) {
        channelStats[ch].leadEmails.push(lead.contact_email);
      }
    }

    // For each channel, count emails sent, replies, deals
    for (const [ch, stats] of Object.entries(channelStats)) {
      if (stats.leadEmails.length === 0) continue;

      // Batch query: emails sent to these leads
      const { count: emailsSent } = await supabase
        .from("prospect_outreach")
        .select("id", { count: "exact", head: true })
        .in("contact_email", stats.leadEmails.slice(0, 500))
        .gte("sent_at", monthStartISO);

      stats.emails = emailsSent || 0;

      // Replies (status in warm_outreach_queue)
      const { count: replyCount } = await supabase
        .from("warm_outreach_queue")
        .select("id", { count: "exact", head: true })
        .in("contact_email", stats.leadEmails.slice(0, 500))
        .in("status", ["replied", "interested", "booked"]);

      stats.replies = replyCount || 0;

      // Deals created from these leads
      const { data: chDeals } = await supabase
        .from("pipeline_deals")
        .select("id, deal_value, stage")
        .in("lead_email", stats.leadEmails.slice(0, 500))
        .gte("created_at", monthStartISO);

      stats.dealsCreated = chDeals?.length || 0;
      for (const deal of chDeals || []) {
        if (deal.stage === "closed_won") {
          stats.dealsClosed += 1;
          stats.revenue += deal.deal_value || 0;
        }
      }
    }

    // Calculate per-channel metrics and rank by ROI
    interface ChannelROI {
      channel: string;
      leads: number;
      emails: number;
      replies: number;
      dealsCreated: number;
      dealsClosed: number;
      revenue: number;
      costPerLead: number;
      costPerReply: number;
      revenuePerLead: number;
      roi: number;
    }

    const channelROIList: ChannelROI[] = [];
    // Allocate costs proportionally by lead count
    const totalLeadsAllChannels = Object.values(channelStats).reduce((s, c) => s + c.leads, 0);

    for (const [ch, stats] of Object.entries(channelStats)) {
      const costShare = totalLeadsAllChannels > 0
        ? (stats.leads / totalLeadsAllChannels) * totalCostMonthZAR
        : 0;
      const cplCh = stats.leads > 0 ? costShare / stats.leads : 0;
      const cprCh = stats.replies > 0 ? costShare / stats.replies : 0;
      const rplCh = stats.leads > 0 ? stats.revenue / stats.leads : 0;
      const roiCh = costShare > 0 ? (stats.revenue / costShare) * 100 : 0;

      channelROIList.push({
        channel: ch,
        leads: stats.leads,
        emails: stats.emails,
        replies: stats.replies,
        dealsCreated: stats.dealsCreated,
        dealsClosed: stats.dealsClosed,
        revenue: stats.revenue,
        costPerLead: cplCh,
        costPerReply: cprCh,
        revenuePerLead: rplCh,
        roi: roiCh,
      });
    }

    // Sort by ROI descending
    channelROIList.sort((a, b) => b.roi - a.roi);

    const bestROICh = channelROIList.length > 0 ? channelROIList[0] : null;
    const worstROICh = channelROIList.length > 1 ? channelROIList[channelROIList.length - 1] : null;

    const channelRecommendation =
      bestROICh && worstROICh && bestROICh.channel !== worstROICh.channel
        ? `Scale *${bestROICh.channel}* (ROI ${fmt(bestROICh.roi, 0)}%), reduce *${worstROICh.channel}* (ROI ${fmt(worstROICh.roi, 0)}%)`
        : channelROIList.length > 0
          ? `Top channel: *${channelROIList[0].channel}* with ROI ${fmt(channelROIList[0].roi, 0)}%`
          : "No channel data available yet.";

    const channelDeepDiveSlack = channelROIList.length > 0
      ? [
          `*CHANNEL ROI DEEP-DIVE (this month):*`,
          `\`\`\``,
          `${"Channel".padEnd(16)} ${"Leads".padStart(6)} ${"Emails".padStart(7)} ${"Replies".padStart(8)} ${"Deals".padStart(6)} ${"Revenue".padStart(10)} ${"ROI".padStart(7)}`,
          ...channelROIList.map(
            (c) =>
              `${c.channel.padEnd(16)} ${String(c.leads).padStart(6)} ${String(c.emails).padStart(7)} ${String(c.replies).padStart(8)} ${String(c.dealsClosed).padStart(6)} ${"R" + fmt(c.revenue, 0).padStart(9)} ${(fmt(c.roi, 0) + "%").padStart(7)}`
          ),
          `\`\`\``,
          channelRecommendation,
        ]
      : [`*CHANNEL ROI DEEP-DIVE:*`, `No channel data for this month.`];

    // ═══════════════════════════════════════════════════════════
    // 5d. BURN RATE & RUNWAY ANALYSIS
    // ═══════════════════════════════════════════════════════════

    const totalMonthlySpendUSD = totalCostMonth + SUPABASE_MONTHLY_FIXED; // include fixed
    const totalMonthlySpendZAR = totalMonthlySpendUSD * USD_TO_ZAR;

    // Average monthly revenue from last 3 months of closed deals
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const { data: recentClosedDeals } = await supabase
      .from("pipeline_deals")
      .select("deal_value, closed_at")
      .eq("stage", "closed_won")
      .gte("closed_at", threeMonthsAgo.toISOString());

    const recentRevenue = (recentClosedDeals || []).reduce((s, d) => s + (d.deal_value || 0), 0);
    const monthsOfData = Math.max(1, Math.min(3, Math.ceil((now.getTime() - threeMonthsAgo.getTime()) / (30 * 24 * 60 * 60 * 1000))));
    const avgMonthlyRevenue = recentRevenue / monthsOfData;

    let burnRateAnalysis = "";
    if (avgMonthlyRevenue > totalMonthlySpendZAR) {
      const netMargin = ((avgMonthlyRevenue - totalMonthlySpendZAR) / avgMonthlyRevenue) * 100;
      burnRateAnalysis = `System is profitable. Net margin: ${fmt(netMargin, 1)}%. Monthly revenue R${fmt(avgMonthlyRevenue, 0)} vs costs R${fmt(totalMonthlySpendZAR, 0)}.`;

      // Calculate how many weeks profitable
      const profitableSnapshots = snapshots.filter(
        (s) => (s.total_revenue || 0) > (s.total_cost_estimate || 0) * USD_TO_ZAR * 4
      );
      if (profitableSnapshots.length > 0) {
        burnRateAnalysis += ` System has been profitable for ~${profitableSnapshots.length} of last ${snapshots.length} weeks.`;
      }
    } else if (avgMonthlyRevenue > 0) {
      const monthlyBurn = totalMonthlySpendZAR - avgMonthlyRevenue;
      const avgDealVal = avgMonthlyRevenue / Math.max(1, (recentClosedDeals || []).length / monthsOfData);
      const dealsToBreakeven = avgDealVal > 0 ? Math.ceil(monthlyBurn / avgDealVal) : 0;
      burnRateAnalysis = `System is burning R${fmt(monthlyBurn, 0)}/month. At current deal rate, need ${dealsToBreakeven} more deal${dealsToBreakeven !== 1 ? "s" : ""} to break even.`;

      // Project weeks to profitability based on revenue growth
      if (hasHistory && trendRows.length >= 2) {
        const revenueGrowthPerWeek =
          (trendRows[trendRows.length - 1].revenue - trendRows[0].revenue) / trendRows.length;
        if (revenueGrowthPerWeek > 0) {
          const weeklyBurn = totalMonthlySpendZAR / 4;
          const currentWeeklyRevenue = trendRows[trendRows.length - 1].revenue / 4;
          const weeksToProfit = Math.ceil((weeklyBurn - currentWeeklyRevenue) / revenueGrowthPerWeek);
          if (weeksToProfit > 0 && weeksToProfit < 52) {
            burnRateAnalysis += ` At current trajectory, system reaches profitability in ~${weeksToProfit} weeks.`;
          }
        }
      }
    } else {
      burnRateAnalysis = `No revenue data yet. Monthly costs: R${fmt(totalMonthlySpendZAR, 0)}. Focus on closing pipeline deals.`;
    }

    // ═══════════════════════════════════════════════════════════
    // 5e. UNIT ECONOMICS TRENDS (vs 4-week average)
    // ═══════════════════════════════════════════════════════════

    interface UnitEconAlert {
      metric: string;
      current: number;
      avg: number;
      pctChange: number;
    }

    const unitEconAlerts: UnitEconAlert[] = [];

    if (hasHistory && fourWeekAvgCostPerLead > 0) {
      const cplChange = pctChange(costPerLead, fourWeekAvgCostPerLead);
      if (cplChange > 20) {
        unitEconAlerts.push({ metric: "Cost per lead", current: costPerLead, avg: fourWeekAvgCostPerLead, pctChange: cplChange });
      }
    }
    if (hasHistory && fourWeekAvgCostPerReply > 0) {
      const cprChange = pctChange(costPerReply, fourWeekAvgCostPerReply);
      if (cprChange > 20) {
        unitEconAlerts.push({ metric: "Cost per reply", current: costPerReply, avg: fourWeekAvgCostPerReply, pctChange: cprChange });
      }
    }
    if (hasHistory && fourWeekAvgCAC > 0) {
      const cacChange = pctChange(cac, fourWeekAvgCAC);
      if (cacChange > 20) {
        unitEconAlerts.push({ metric: "CAC", current: cac, avg: fourWeekAvgCAC, pctChange: cacChange });
      }
    }

    const unitEconTrendSlack = hasHistory
      ? [
          `*UNIT ECONOMICS vs 4-WEEK AVERAGE:*`,
          `\`\`\``,
          `Cost/Lead:  R${fmt(costPerLead)} vs avg R${fmt(fourWeekAvgCostPerLead)} ${costPerLead > fourWeekAvgCostPerLead * 1.05 ? "↑" : costPerLead < fourWeekAvgCostPerLead * 0.95 ? "↓" : "→"}`,
          `Cost/Reply: R${fmt(costPerReply)} vs avg R${fmt(fourWeekAvgCostPerReply)} ${costPerReply > fourWeekAvgCostPerReply * 1.05 ? "↑" : costPerReply < fourWeekAvgCostPerReply * 0.95 ? "↓" : "→"}`,
          `CAC:        R${fmt(cac)} vs avg R${fmt(fourWeekAvgCAC)} ${cac > fourWeekAvgCAC * 1.05 ? "↑" : cac < fourWeekAvgCAC * 0.95 ? "↓" : "→"}`,
          `\`\`\``,
          ...(unitEconAlerts.length > 0
            ? [`:warning: *Alerts:* ${unitEconAlerts.map((a) => `${a.metric} worsened ${fmt(a.pctChange, 0)}% vs average`).join(", ")}`]
            : [":white_check_mark: All unit economics within normal range."]),
        ]
      : [];

    // ═══════════════════════════════════════════════════════════
    // 5f. DATA-DRIVEN FINANCIAL RECOMMENDATIONS
    // ═══════════════════════════════════════════════════════════

    const smartRecommendations: string[] = [];

    // Check channels for high cost, low ROI
    for (const ch of channelROIList) {
      if (ch.leads >= 5 && ch.dealsClosed === 0 && ch.costPerLead > 0) {
        smartRecommendations.push(
          `${ch.channel} has ${ch.leads} leads this month with 0 closed deals (cost R${fmt(ch.costPerLead * ch.leads, 0)}). Test reducing volume or improving targeting.`
        );
      }
    }

    // Check for great ROI channel
    if (bestROICh && bestROICh.roi > 200 && channelROIList.length > 1) {
      const ratio = bestROICh.roi / (channelROIList[1]?.roi || 1);
      if (ratio > 2) {
        smartRecommendations.push(
          `${bestROICh.channel} converts at ${fmt(ratio, 1)}x the rate of other channels. Double down on this source.`
        );
      }
    }

    // CAC improving?
    if (hasHistory && fourWeekAvgCAC > 0 && cac < fourWeekAvgCAC * 0.9) {
      smartRecommendations.push(
        `CAC dropped from R${fmt(fourWeekAvgCAC, 0)} to R${fmt(cac, 0)} — current strategy is working, maintain course.`
      );
    } else if (hasHistory && fourWeekAvgCAC > 0 && cac > fourWeekAvgCAC * 1.2) {
      smartRecommendations.push(
        `CAC increased from R${fmt(fourWeekAvgCAC, 0)} to R${fmt(cac, 0)} — investigate which channel is getting less efficient.`
      );
    }

    // Check email effectiveness (open rates from outreach_insights if available)
    const { data: recentInsights } = await supabase
      .from("outreach_insights")
      .select("open_rate, reply_rate")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentInsights?.open_rate && recentInsights.open_rate < 0.4) {
      smartRecommendations.push(
        `Email open rate is ${fmt(recentInsights.open_rate * 100, 0)}% — costs are being wasted on unread emails. Fix deliverability before scaling volume.`
      );
    }

    // Forward-looking recommendation
    if (weightedPipeline > totalCostMonthZAR * 3) {
      smartRecommendations.push(
        `Weighted pipeline (R${fmt(weightedPipeline, 0)}) is ${fmt(weightedPipeline / totalCostMonthZAR, 1)}x monthly costs. Focus on conversion — closing even 1 deal changes the economics significantly.`
      );
    } else if (totalEmailsMonth > 0 && (repliesMonth || 0) === 0) {
      smartRecommendations.push(
        `${totalEmailsMonth} emails sent this month with 0 replies. Revisit email copy, subject lines, and targeting before increasing volume.`
      );
    } else {
      smartRecommendations.push(
        `Continue building pipeline. Each week of consistent outreach compounds — the data will show which levers to pull.`
      );
    }

    // Limit to 3 recommendations
    const topRecommendations = smartRecommendations.slice(0, 3);

    const smartRecsSlack = [
      `*DATA-DRIVEN RECOMMENDATIONS:*`,
      ...topRecommendations.map((r, i) => `${i + 1}. ${r}`),
    ];

    // ═══════════════════════════════════════════════════════════
    // 5g. MONTHLY P&L (first Sunday of month only)
    // ═══════════════════════════════════════════════════════════

    let monthlyPLSlack: string[] = [];
    let monthlyPLHtml = "";

    if (isFirstSundayOfMonth(now)) {
      // Use previous month's data since it's the first Sunday
      const prevStart = prevMonthStart(now);
      const prevEnd = prevMonthEnd(now);
      const prevStartISO = new Date(prevStart).toISOString();
      const prevEndISO = new Date(prevEnd + "T23:59:59.999Z").toISOString();

      // Previous month revenue
      const { data: prevMonthDeals } = await supabase
        .from("pipeline_deals")
        .select("id, deal_value, lead_company, lead_email")
        .eq("stage", "closed_won")
        .gte("closed_at", prevStartISO)
        .lte("closed_at", prevEndISO);

      const prevRevenue = (prevMonthDeals || []).reduce((s, d) => s + (d.deal_value || 0), 0);
      const prevDealCount = prevMonthDeals?.length || 0;

      // Previous month costs (from snapshots)
      const { data: prevSnapshots } = await supabase
        .from("financial_snapshots")
        .select("total_cost_estimate")
        .gte("week_start", prevStart)
        .lte("week_start", prevEnd);

      const prevTotalCostUSD = (prevSnapshots || []).reduce(
        (s, snap) => s + (snap.total_cost_estimate || 0),
        0
      );
      const prevTotalCostZAR = (prevTotalCostUSD + SUPABASE_MONTHLY_FIXED) * USD_TO_ZAR;

      const netPL = prevRevenue - prevTotalCostZAR;

      // Top 3 deals by value
      const topDeals = [...(prevMonthDeals || [])]
        .sort((a, b) => (b.deal_value || 0) - (a.deal_value || 0))
        .slice(0, 3);

      // Previous previous month for comparison
      const ppStart = prevMonthStart(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      const ppEnd = prevMonthEnd(new Date(now.getFullYear(), now.getMonth() - 1, 1));

      const { data: ppDeals } = await supabase
        .from("pipeline_deals")
        .select("deal_value")
        .eq("stage", "closed_won")
        .gte("closed_at", new Date(ppStart).toISOString())
        .lte("closed_at", new Date(ppEnd + "T23:59:59.999Z").toISOString());

      const ppRevenue = (ppDeals || []).reduce((s, d) => s + (d.deal_value || 0), 0);

      // Grade
      let grade = "F";
      const profitable = netPL > 0;
      const growing = prevRevenue > ppRevenue;
      const improving = netPL > (ppRevenue - prevTotalCostZAR); // better P&L than prev prev month (approximate)

      if (profitable && growing) grade = "A";
      else if (profitable && !growing) grade = "B";
      else if (Math.abs(netPL) < prevTotalCostZAR * 0.1) grade = "C";
      else if (!profitable && improving) grade = "D";
      else grade = "F";

      const prevMonthName = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString(
        "en-ZA",
        { month: "long", year: "numeric" }
      );

      monthlyPLSlack = [
        ``,
        `*MONTHLY P&L — ${prevMonthName}:*`,
        `\`\`\``,
        `Revenue:      R${fmt(prevRevenue, 0)} (${prevDealCount} deal${prevDealCount !== 1 ? "s" : ""})`,
        `Costs:        R${fmt(prevTotalCostZAR, 0)}`,
        `Net ${netPL >= 0 ? "Profit" : "Loss"}:     ${netPL >= 0 ? "R" : "-R"}${fmt(Math.abs(netPL), 0)}`,
        `\`\`\``,
        ...(topDeals.length > 0
          ? [
              `Top deals:`,
              ...topDeals.map(
                (d, i) =>
                  `  ${i + 1}. ${d.lead_company || d.lead_email || "Unknown"} — R${fmt(d.deal_value || 0, 0)}`
              ),
            ]
          : []),
        ppRevenue > 0
          ? `vs prev month: ${prevRevenue >= ppRevenue ? "↑" : "↓"} ${prevRevenue >= ppRevenue ? "+" : ""}${fmt(((prevRevenue - ppRevenue) / ppRevenue) * 100, 0)}%`
          : "",
        `*Grade: ${grade}* ${grade === "A" ? "(profitable + growing)" : grade === "B" ? "(profitable + flat)" : grade === "C" ? "(break-even)" : grade === "D" ? "(losing money but improving)" : "(losing money + declining)"}`,
      ].filter(Boolean);

      const topDealRows = topDeals
        .map(
          (d, i) =>
            `<tr><td style="padding:4px 12px;">${i + 1}. ${d.lead_company || d.lead_email || "Unknown"}</td><td style="padding:4px 12px;text-align:right;">R${fmt(d.deal_value || 0, 0)}</td></tr>`
        )
        .join("");

      monthlyPLHtml = `
  <h2 style="font-size:16px;color:#8e44ad;margin-top:24px;">Monthly P&L — ${prevMonthName}</h2>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Revenue</td><td style="padding:6px 12px;text-align:right;">R${fmt(prevRevenue, 0)} (${prevDealCount} deals)</td></tr>
    <tr><td style="padding:6px 12px;">Costs</td><td style="padding:6px 12px;text-align:right;">R${fmt(prevTotalCostZAR, 0)}</td></tr>
    <tr style="font-weight:bold;border-top:2px solid #333;"><td style="padding:6px 12px;">Net ${netPL >= 0 ? "Profit" : "Loss"}</td><td style="padding:6px 12px;text-align:right;color:${netPL >= 0 ? "#27ae60" : "#e74c3c"};">${netPL >= 0 ? "R" : "-R"}${fmt(Math.abs(netPL), 0)}</td></tr>
  </table>
  ${topDeals.length > 0 ? `<h3 style="font-size:14px;color:#2c3e50;margin-top:12px;">Top Deals</h3>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">${topDealRows}</table>` : ""}
  ${ppRevenue > 0 ? `<p>vs previous month: ${prevRevenue >= ppRevenue ? "+" : ""}${fmt(((prevRevenue - ppRevenue) / ppRevenue) * 100, 0)}%</p>` : ""}
  <p style="font-size:18px;font-weight:bold;color:${grade === "A" || grade === "B" ? "#27ae60" : grade === "C" ? "#f39c12" : "#e74c3c"};">
    Grade: ${grade} ${grade === "A" ? "(profitable + growing)" : grade === "B" ? "(profitable + flat)" : grade === "C" ? "(break-even)" : grade === "D" ? "(losing money but improving)" : "(losing money + declining)"}
  </p>`;
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
      ...trendSummarySlack,
      ``,
      ...channelDeepDiveSlack,
      ``,
      `*BURN RATE & RUNWAY:*`,
      burnRateAnalysis,
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
      ...(unitEconTrendSlack.length > 0 ? [...unitEconTrendSlack, ``] : []),
      ``,
      `*PIPELINE FORECAST:*`,
      pipelineLines || "  No active deals",
      `Weighted pipeline: R${fmt(weightedPipeline, 0)}`,
      dealsNeededForBreakeven > 0
        ? `Break-even: ${dealsNeededForBreakeven} more deal${dealsNeededForBreakeven !== 1 ? "s" : ""} needed at avg R${fmt(avgDealValue, 0)}`
        : "",
      ``,
      ...smartRecsSlack,
      ``,
      ...monthlyPLSlack,
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

  ${hasHistory ? `
  <h2 style="font-size:16px;color:#2c3e50;margin-top:24px;">4-Week Trend Analysis</h2>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;font-weight:bold;"><td style="padding:6px 12px;">Week</td><td style="padding:6px 12px;">Cost</td><td style="padding:6px 12px;">Revenue</td><td style="padding:6px 12px;">ROI</td><td style="padding:6px 12px;">CAC</td></tr>
    ${trendRows.map((r, i) => `<tr${i % 2 === 0 ? '' : ' style="background:#f8f9fa;"'}><td style="padding:6px 12px;">${r.week}</td><td style="padding:6px 12px;">$${fmt(r.cost)}</td><td style="padding:6px 12px;">R${fmt(r.revenue, 0)}</td><td style="padding:6px 12px;">${fmt(r.roi, 0)}%</td><td style="padding:6px 12px;">R${fmt(r.cac, 0)}</td></tr>`).join("")}
  </table>
  <p><strong>Trends:</strong> Spend ${costTrend} &nbsp; Revenue ${revenueTrend} &nbsp; ROI ${roiTrend} &nbsp; CAC ${cacTrend}</p>
  ` : `<p style="color:#888;margin-top:16px;"><em>Trend analysis available after 2+ weeks of data.</em></p>`}

  ${channelROIList.length > 0 ? `
  <h2 style="font-size:16px;color:#2c3e50;margin-top:24px;">Channel ROI Deep-Dive (This Month)</h2>
  <table style="border-collapse:collapse;width:100%;font-size:12px;">
    <tr style="background:#f8f9fa;font-weight:bold;"><td style="padding:6px 8px;">Channel</td><td style="padding:6px 8px;">Leads</td><td style="padding:6px 8px;">Emails</td><td style="padding:6px 8px;">Replies</td><td style="padding:6px 8px;">Deals Won</td><td style="padding:6px 8px;">Revenue</td><td style="padding:6px 8px;">ROI</td></tr>
    ${channelROIList.map((c, i) => `<tr${i % 2 === 0 ? '' : ' style="background:#f8f9fa;"'}><td style="padding:6px 8px;">${c.channel}</td><td style="padding:6px 8px;">${c.leads}</td><td style="padding:6px 8px;">${c.emails}</td><td style="padding:6px 8px;">${c.replies}</td><td style="padding:6px 8px;">${c.dealsClosed}</td><td style="padding:6px 8px;">R${fmt(c.revenue, 0)}</td><td style="padding:6px 8px;">${fmt(c.roi, 0)}%</td></tr>`).join("")}
  </table>
  <p style="background:#eef6ff;padding:8px 12px;border-radius:4px;border-left:4px solid #3498db;font-size:13px;">${channelRecommendation.replace(/\*/g, "")}</p>
  ` : ""}

  <h2 style="font-size:16px;color:#e67e22;margin-top:24px;">Burn Rate & Runway</h2>
  <p style="background:#fef9e7;padding:12px;border-radius:6px;border-left:4px solid #e67e22;font-size:13px;">
    ${burnRateAnalysis}
  </p>

  <h2 style="font-size:16px;color:#2c3e50;margin-top:24px;">Unit Economics (ZAR, Monthly)</h2>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Cost per lead</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerLead)}</td></tr>
    <tr><td style="padding:6px 12px;">Cost per email</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerEmail)}</td></tr>
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Cost per reply</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerReply)}</td></tr>
    <tr><td style="padding:6px 12px;">Cost per booking</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerBooking)}</td></tr>
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">CAC</td><td style="padding:6px 12px;text-align:right;">R${fmt(cac)}</td></tr>
    <tr style="font-weight:bold;border-top:2px solid #333;"><td style="padding:6px 12px;">ROI</td><td style="padding:6px 12px;text-align:right;">${fmt(roiPercent, 0)}%</td></tr>
  </table>
  ${hasHistory ? `
  <h3 style="font-size:14px;color:#2c3e50;margin-top:16px;">vs 4-Week Average</h3>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">Cost per lead</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerLead)} vs R${fmt(fourWeekAvgCostPerLead)} ${costPerLead > fourWeekAvgCostPerLead * 1.05 ? "↑" : costPerLead < fourWeekAvgCostPerLead * 0.95 ? "↓" : "→"}</td></tr>
    <tr><td style="padding:6px 12px;">Cost per reply</td><td style="padding:6px 12px;text-align:right;">R${fmt(costPerReply)} vs R${fmt(fourWeekAvgCostPerReply)} ${costPerReply > fourWeekAvgCostPerReply * 1.05 ? "↑" : costPerReply < fourWeekAvgCostPerReply * 0.95 ? "↓" : "→"}</td></tr>
    <tr style="background:#f8f9fa;"><td style="padding:6px 12px;">CAC</td><td style="padding:6px 12px;text-align:right;">R${fmt(cac)} vs R${fmt(fourWeekAvgCAC)} ${cac > fourWeekAvgCAC * 1.05 ? "↑" : cac < fourWeekAvgCAC * 0.95 ? "↓" : "→"}</td></tr>
  </table>
  ${unitEconAlerts.length > 0 ? `<p style="color:#e74c3c;font-weight:bold;">Alerts: ${unitEconAlerts.map(a => `${a.metric} worsened ${fmt(a.pctChange, 0)}%`).join(", ")}</p>` : `<p style="color:#27ae60;">All unit economics within normal range.</p>`}
  ` : ""}

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

  <h2 style="font-size:16px;color:#2980b9;margin-top:24px;">Data-Driven Recommendations</h2>
  <ol style="font-size:13px;line-height:1.8;">
    ${topRecommendations.map(r => `<li style="margin-bottom:8px;">${r}</li>`).join("")}
  </ol>

  ${monthlyPLHtml}

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
          four_week_avg: hasHistory ? {
            cost_per_lead: fourWeekAvgCostPerLead,
            cost_per_reply: fourWeekAvgCostPerReply,
            cac: fourWeekAvgCAC,
          } : null,
          alerts: unitEconAlerts,
        },
        trends: {
          cost: costTrend,
          revenue: revenueTrend,
          roi: roiTrend,
          cac: cacTrend,
          weeks_of_data: snapshots.length,
        },
        channel_roi: channelROIList.map(c => ({
          channel: c.channel,
          leads: c.leads,
          emails: c.emails,
          replies: c.replies,
          deals_closed: c.dealsClosed,
          revenue: c.revenue,
          roi: c.roi,
        })),
        burn_rate: {
          monthly_spend_zar: totalMonthlySpendZAR,
          avg_monthly_revenue: avgMonthlyRevenue,
          analysis: burnRateAnalysis,
        },
        recommendations: topRecommendations,
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
        trends: { cost: costTrend, revenue: revenueTrend, roi: roiTrend, cac: cacTrend },
        channel_roi_summary: channelROIList.map(c => ({ channel: c.channel, roi: c.roi, revenue: c.revenue })),
        burn_rate: { monthly_spend_zar: totalMonthlySpendZAR, avg_monthly_revenue: avgMonthlyRevenue },
        recommendations: topRecommendations,
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
