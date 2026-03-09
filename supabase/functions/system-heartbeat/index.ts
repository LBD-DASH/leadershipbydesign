import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const since = todayStart.toISOString();

    // Check pipeline health across all tables
    const [
      { count: pendingOutreach },
      { count: emailedToday },
      { count: followedUpToday },
      { count: newSubscribers },
      { count: newContacts },
      { count: newDiagnostics },
      { count: newPurchases },
    ] = await Promise.all([
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).eq("status", "pending").not("contact_email", "is", null).neq("contact_email", ""),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).gte("email_sent_at", since),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true }).gte("follow_up_sent_at", since),
      supabase.from("email_subscribers").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("contact_form_submissions").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("diagnostic_submissions").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("product_purchases").select("*", { count: "exact", head: true }).gte("created_at", since),
    ]);

    // Check last prospecting run
    const { data: lastRun } = await supabase
      .from("prospecting_runs")
      .select("status, completed_at, companies_saved")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const lastRunAge = lastRun?.completed_at
      ? Math.round((now.getTime() - new Date(lastRun.completed_at).getTime()) / (1000 * 60 * 60))
      : null;

    // Check total queue with no email (bad data)
    const { count: noEmailQueue } = await supabase
      .from("warm_outreach_queue")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .or("contact_email.is.null,contact_email.eq.");

    // Build status lines
    const lines: string[] = [];
    
    // Outreach pipeline
    lines.push("*📧 Outreach Pipeline*");
    lines.push(`• Pending with email: ${pendingOutreach || 0}`);
    lines.push(`• Emailed today: ${emailedToday || 0}`);
    lines.push(`• Follow-ups today: ${followedUpToday || 0}`);
    if ((noEmailQueue || 0) > 0) lines.push(`• ⚠️ ${noEmailQueue} pending WITHOUT email (dead weight)`);

    // Prospecting
    lines.push("");
    lines.push("*🔍 Prospecting*");
    if (lastRun) {
      const statusIcon = lastRun.status === "completed" ? "✅" : "❌";
      lines.push(`• Last run: ${statusIcon} ${lastRun.status} (${lastRunAge}h ago, ${lastRun.companies_saved} saved)`);
      if (lastRunAge && lastRunAge > 30) lines.push("• ⚠️ Last run was over 30 hours ago!");
    } else {
      lines.push("• ❌ No prospecting runs found");
    }

    // Inbound
    lines.push("");
    lines.push("*📥 Inbound Today*");
    lines.push(`• Subscribers: ${newSubscribers || 0} | Contacts: ${newContacts || 0}`);
    lines.push(`• Diagnostics: ${newDiagnostics || 0} | Purchases: ${newPurchases || 0}`);

    // Overall health
    const issues: string[] = [];
    if ((pendingOutreach || 0) === 0) issues.push("No outreach prospects queued");
    if ((emailedToday || 0) === 0 && now.getHours() > 10) issues.push("No emails sent today");
    if (lastRunAge && lastRunAge > 30) issues.push("Prospecting stale");
    if ((noEmailQueue || 0) > 5) issues.push(`${noEmailQueue} dead prospects clogging queue`);

    const healthStatus = issues.length === 0 ? "✅ All Systems Go" : `⚠️ ${issues.length} Issue${issues.length > 1 ? "s" : ""} Detected`;
    
    lines.push("");
    lines.push(`*Status:* ${healthStatus}`);
    if (issues.length > 0) {
      lines.push(issues.map(i => `• 🔴 ${i}`).join("\n"));
    }

    const sast = now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", hour: "2-digit", minute: "2-digit" });

    // Post to Slack
    await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
      body: JSON.stringify({
        channel: "system-health",
        eventType: "daily_health_check",
        data: {
          activeSequences: pendingOutreach || 0,
          outreachSent: emailedToday || 0,
          engaged: followedUpToday || 0,
        },
      }),
    });

    // Also post detailed summary to mission-control
    await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
      body: JSON.stringify({
        channel: "mission-control",
        eventType: "system_error",
        data: {
          function: `System Heartbeat 🩺 ${sast} SAST`,
          error: lines.join("\n"),
        },
      }),
    });

    return new Response(
      JSON.stringify({ success: true, healthStatus, issues, pendingOutreach, emailedToday }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("system-heartbeat error:", errMsg);
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
