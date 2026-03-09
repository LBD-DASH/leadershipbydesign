import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const now = new Date();
    const sast = now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", hour: "2-digit", minute: "2-digit" });
    const today = now.toISOString().split("T")[0];

    // Determine reporting window (since last report: ~6h windows for 3x/day)
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    const todayStart = `${today}T00:00:00Z`;

    console.log(`📊 Pipeline status report — ${sast} SAST`);

    // Gather all metrics in parallel
    const [
      { count: prospectsAddedPeriod },
      { count: emailsSentPeriod },
      { count: followUpsSentPeriod },
      { count: pendingQueue },
      { count: bookingsToday },
      { data: replyData },
      { data: failedSends },
    ] = await Promise.all([
      // Prospects added since last report (~6h)
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .gte("created_at", sixHoursAgo),
      // Emails sent since last report
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .gte("email_sent_at", sixHoursAgo),
      // Follow-ups sent since last report
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .gte("follow_up_sent_at", sixHoursAgo),
      // Queue depth: pending prospects remaining
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .not("contact_email", "is", null)
        .neq("contact_email", ""),
      // Bookings confirmed today
      supabase.from("bookings").select("*", { count: "exact", head: true })
        .gte("created_at", todayStart),
      // Reply status breakdown (today)
      supabase.from("warm_outreach_queue").select("status")
        .in("status", ["interested", "not_interested", "ooo", "unsubscribed", "replied"])
        .gte("updated_at", todayStart),
      // Failed sends (status = 'error' or similar)
      supabase.from("warm_outreach_queue").select("company_name, contact_email, status")
        .eq("status", "error")
        .gte("updated_at", sixHoursAgo),
    ]);

    // Classify replies
    const replies = {
      interested: 0,
      not_interested: 0,
      ooo: 0,
      unsubscribed: 0,
      other: 0,
    };
    for (const r of (replyData || []) as { status: string }[]) {
      if (r.status === "interested") replies.interested++;
      else if (r.status === "not_interested") replies.not_interested++;
      else if (r.status === "ooo") replies.ooo++;
      else if (r.status === "unsubscribed") replies.unsubscribed++;
      else replies.other++;
    }
    const totalReplies = replies.interested + replies.not_interested + replies.ooo + replies.unsubscribed + replies.other;
    const failedCount = (failedSends || []).length;

    // ── Post main status to #mission-control ──
    await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
      body: JSON.stringify({
        eventType: "pipeline_status_report",
        data: {
          time: sast,
          prospectsAdded: prospectsAddedPeriod || 0,
          emailsSent: (emailsSentPeriod || 0) + (followUpsSentPeriod || 0),
          repliesInterested: replies.interested,
          repliesNotInterested: replies.not_interested,
          repliesOOO: replies.ooo,
          repliesUnsubscribed: replies.unsubscribed,
          totalReplies,
          bookings: bookingsToday || 0,
          queueDepth: pendingQueue || 0,
          failed: failedCount,
        },
      }),
    });

    // ── Post errors to #system-health if any ──
    if (failedCount > 0) {
      const failedList = (failedSends || []).slice(0, 5)
        .map((f: any) => `• ${f.contact_email} @ ${f.company_name}`)
        .join("\n");

      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "system_error",
          data: {
            function: "Pipeline Send Failures",
            error: `${failedCount} failed send(s) in the last 6h:\n${failedList}`,
          },
        }),
      });
    }

    console.log(`✅ Pipeline report posted — Sent: ${emailsSentPeriod || 0}, Queue: ${pendingQueue || 0}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        prospectsAdded: prospectsAddedPeriod || 0,
        emailsSent: (emailsSentPeriod || 0) + (followUpsSentPeriod || 0),
        queueDepth: pendingQueue || 0,
        bookings: bookingsToday || 0,
        failed: failedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("daily-pipeline-report error:", errMsg);
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "daily-pipeline-report", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
