import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const resendKey = Deno.env.get("RESEND_API_KEY");

  try {
    console.log("📊 deliverability-monitor invoked at", new Date().toISOString());

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

    // --- Fetch outreach data for this week (7 days) and last week (7-14 days) ---
    const [
      { data: thisWeekEmails, error: thisWeekErr },
      { data: lastWeekEmails, error: lastWeekErr },
      { data: last24hEmails, error: last24hErr },
    ] = await Promise.all([
      supabase
        .from("prospect_outreach")
        .select("recipient_email, status, opened, clicked, replied, created_at, subject, bounce_status")
        .gte("created_at", sevenDaysAgo),
      supabase
        .from("prospect_outreach")
        .select("recipient_email, status, opened, clicked, replied, created_at, subject, bounce_status")
        .gte("created_at", fourteenDaysAgo)
        .lt("created_at", sevenDaysAgo),
      supabase
        .from("prospect_outreach")
        .select("recipient_email, status, opened, clicked, replied, created_at, subject, bounce_status")
        .gte("created_at", twentyFourHoursAgo),
    ]);

    if (thisWeekErr) console.error("Error fetching this week:", thisWeekErr.message);
    if (lastWeekErr) console.error("Error fetching last week:", lastWeekErr.message);
    if (last24hErr) console.error("Error fetching last 24h:", last24hErr.message);

    const thisWeek = thisWeekEmails || [];
    const lastWeek = lastWeekEmails || [];
    const last24h = last24hEmails || [];

    // --- Check pending prospects in warm_outreach_queue ---
    const { count: pendingProspects } = await supabase
      .from("warm_outreach_queue")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .not("contact_email", "is", null)
      .neq("contact_email", "");

    const pendingCount = pendingProspects || 0;

    // --- Calculate metrics ---
    // Handle bounce_status gracefully — field may not exist on all rows
    const hasBounceData = thisWeek.some((e: any) => e.bounce_status !== undefined && e.bounce_status !== null);

    const calcMetrics = (emails: any[]) => {
      const sent = emails.length;
      // Consider "bounced" status as not delivered; everything else counts as delivered
      const bounced = emails.filter((e: any) =>
        e.bounce_status === "bounced" || e.status === "bounced"
      ).length;
      const delivered = sent - bounced;
      const opened = emails.filter((e: any) => e.opened === true).length;
      const replied = emails.filter((e: any) => e.replied === true).length;
      const clicked = emails.filter((e: any) => e.clicked === true).length;

      return {
        sent,
        delivered,
        bounced,
        opened,
        replied,
        clicked,
        deliveryRate: sent > 0 ? delivered / sent : 1,
        openRate: delivered > 0 ? opened / delivered : 0,
        replyRate: delivered > 0 ? replied / delivered : 0,
        bounceRate: sent > 0 ? bounced / sent : 0,
        clickRate: delivered > 0 ? clicked / delivered : 0,
      };
    };

    const current = calcMetrics(thisWeek);
    const previous = calcMetrics(lastWeek);
    const daily = calcMetrics(last24h);

    // --- Trend analysis ---
    const openRateDrop = previous.openRate > 0
      ? ((previous.openRate - current.openRate) / previous.openRate) * 100
      : 0;

    const replyDroppedToZero = previous.replied > 0 && current.replied === 0;

    // --- Determine alerts ---
    const redAlerts: string[] = [];
    const warnings: string[] = [];

    // RED: Open rate below 10%
    if (current.sent > 0 && current.openRate < 0.10) {
      redAlerts.push(
        `Open rate critically low: ${(current.openRate * 100).toFixed(1)}% (${current.opened}/${current.delivered} delivered). Emails may be going to spam.`
      );
    }

    // RED: Zero emails in last 24h when there are pending prospects
    if (daily.sent === 0 && pendingCount > 0) {
      redAlerts.push(
        `Zero emails sent in last 24h but ${pendingCount} prospects are pending. Auto-outreach may be stuck.`
      );
    }

    // RED: Bounce rate above 5%
    if (hasBounceData && current.sent > 0 && current.bounceRate > 0.05) {
      redAlerts.push(
        `Bounce rate dangerously high: ${(current.bounceRate * 100).toFixed(1)}% (${current.bounced}/${current.sent}). Domain reputation at risk.`
      );
    }

    // RED: Reply rate dropped to 0 when it was >0 last week
    if (replyDroppedToZero && current.sent >= 5) {
      redAlerts.push(
        `Reply rate dropped to 0% this week (was ${(previous.replyRate * 100).toFixed(1)}% last week with ${previous.replied} replies). Possible deliverability issue.`
      );
    }

    // RED: Open rate dropped >20% week-over-week
    if (previous.sent >= 5 && current.sent >= 5 && openRateDrop > 20) {
      redAlerts.push(
        `Open rate dropped ${openRateDrop.toFixed(0)}% vs last week: ${(current.openRate * 100).toFixed(1)}% (was ${(previous.openRate * 100).toFixed(1)}%).`
      );
    }

    // WARNING: Open rate between 10-20%
    if (current.sent > 0 && current.openRate >= 0.10 && current.openRate < 0.20) {
      warnings.push(
        `Open rate below target: ${(current.openRate * 100).toFixed(1)}%. Aim for 20%+.`
      );
    }

    // WARNING: Fewer than 5 emails sent when queue has 20+ pending
    if (daily.sent < 5 && daily.sent > 0 && pendingCount >= 20) {
      warnings.push(
        `Only ${daily.sent} email(s) sent in last 24h with ${pendingCount} pending prospects. Outreach velocity is low.`
      );
    }

    // --- Build report ---
    const pct = (n: number) => (n * 100).toFixed(1) + "%";
    const sast = now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", hour: "2-digit", minute: "2-digit" });

    const lines: string[] = [];
    lines.push(`*📊 Deliverability Monitor — ${sast} SAST*`);
    lines.push("");
    lines.push("*Volume*");
    lines.push(`• Last 24h: ${daily.sent} sent`);
    lines.push(`• Last 7 days: ${current.sent} sent`);
    lines.push(`• Pending queue: ${pendingCount} prospects`);
    lines.push("");
    lines.push("*Rates (7-day)*");
    lines.push(`• Delivery: ${pct(current.deliveryRate)} (${current.delivered}/${current.sent})`);
    lines.push(`• Opens: ${pct(current.openRate)} (${current.opened}/${current.delivered})`);
    lines.push(`• Replies: ${pct(current.replyRate)} (${current.replied}/${current.delivered})`);
    lines.push(`• Clicks: ${pct(current.clickRate)} (${current.clicked}/${current.delivered})`);
    if (hasBounceData) {
      lines.push(`• Bounces: ${pct(current.bounceRate)} (${current.bounced}/${current.sent})`);
    }

    if (previous.sent > 0) {
      lines.push("");
      lines.push("*Trend vs last week*");
      lines.push(`• Open rate: ${pct(current.openRate)} vs ${pct(previous.openRate)} ${openRateDrop > 0 ? "📉" : "📈"}`);
      lines.push(`• Reply rate: ${pct(current.replyRate)} vs ${pct(previous.replyRate)}`);
    }

    if (redAlerts.length > 0) {
      lines.push("");
      lines.push("*🚨 RED ALERTS*");
      redAlerts.forEach(a => lines.push(`• 🔴 ${a}`));
    }

    if (warnings.length > 0) {
      lines.push("");
      lines.push("*⚠️ WARNINGS*");
      warnings.forEach(w => lines.push(`• 🟡 ${w}`));
    }

    if (redAlerts.length === 0 && warnings.length === 0) {
      lines.push("");
      lines.push("*✅ All deliverability metrics healthy*");
    }

    const reportText = lines.join("\n");

    // --- Post to Slack (mission-control) ---
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "deliverability_alert",
          data: {
            function: "Deliverability Monitor",
            error: reportText,
          },
        }),
      });
    } catch (e) {
      console.error("Slack notify failed:", e);
    }

    // --- On RED ALERT: email Kevin ---
    if (redAlerts.length > 0 && resendKey) {
      const alertItems = redAlerts.map(a => `<li style="margin-bottom:8px;color:#c0392b;">${a}</li>`).join("");
      const warningItems = warnings.map(w => `<li style="margin-bottom:6px;color:#e67e22;">${w}</li>`).join("");
      const alertHtml = `
        <div style="font-family:system-ui;font-size:14px;line-height:1.6;max-width:600px;">
          <h2 style="color:#c0392b;">🚨 Deliverability Alert — ${sast} SAST</h2>
          <h3>Red Alerts</h3>
          <ul>${alertItems}</ul>
          ${warningItems ? `<h3>Warnings</h3><ul>${warningItems}</ul>` : ""}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
          <table style="font-size:12px;color:#666;">
            <tr><td>Sent (7d)</td><td style="padding-left:12px;">${current.sent}</td></tr>
            <tr><td>Delivered</td><td style="padding-left:12px;">${current.delivered}</td></tr>
            <tr><td>Open rate</td><td style="padding-left:12px;">${pct(current.openRate)}</td></tr>
            <tr><td>Reply rate</td><td style="padding-left:12px;">${pct(current.replyRate)}</td></tr>
            <tr><td>Bounce rate</td><td style="padding-left:12px;">${hasBounceData ? pct(current.bounceRate) : "N/A"}</td></tr>
            <tr><td>Pending queue</td><td style="padding-left:12px;">${pendingCount}</td></tr>
          </table>
          <p style="font-size:11px;color:#999;margin-top:16px;">Sent by deliverability-monitor edge function</p>
        </div>`;

      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "LBD System <hello@leadershipbydesign.co>",
            to: "kevin@kevinbritz.com",
            subject: "🚨 LBD Deliverability Alert",
            html: alertHtml,
          }),
        });
        console.log("📧 Alert email sent, status:", resendResponse.status);
      } catch (e) {
        console.error("Resend email failed:", e);
      }
    }

    // --- Log to agent_activity_log ---
    const status = redAlerts.length > 0 ? "alert" : warnings.length > 0 ? "warning" : "healthy";
    const logMessage = redAlerts.length > 0
      ? `RED ALERTS: ${redAlerts.join(" | ")}`
      : warnings.length > 0
        ? `Warnings: ${warnings.join(" | ")}`
        : `Healthy — ${current.sent} sent, ${pct(current.openRate)} open rate, ${pct(current.replyRate)} reply rate`;

    try {
      await supabase.from("agent_activity_log").insert({
        agent_name: "deliverability-monitor",
        status,
        message: logMessage.slice(0, 1000),
      });
    } catch (e) {
      // Table may not exist yet — log and continue
      console.warn("Could not log to agent_activity_log:", e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status,
        metrics: {
          daily: { sent: daily.sent },
          weekly: {
            sent: current.sent,
            delivered: current.delivered,
            openRate: current.openRate,
            replyRate: current.replyRate,
            bounceRate: hasBounceData ? current.bounceRate : null,
          },
          previousWeek: {
            sent: previous.sent,
            openRate: previous.openRate,
            replyRate: previous.replyRate,
          },
          pendingProspects: pendingCount,
        },
        redAlerts,
        warnings,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("deliverability-monitor error:", errMsg);

    // Log failure
    try {
      await supabase.from("agent_activity_log").insert({
        agent_name: "deliverability-monitor",
        status: "error",
        message: `Function error: ${errMsg}`.slice(0, 1000),
      });
    } catch { /* best effort */ }

    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
