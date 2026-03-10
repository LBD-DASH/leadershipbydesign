import { createClient } from "npm:@supabase/supabase-js@2";

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
    const hour = now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", hour: "2-digit", hour12: false });
    const hourNum = parseInt(hour);
    const timeLabel = hourNum < 12 ? "Morning" : hourNum < 17 ? "Afternoon" : "Evening";
    const dateStr = now.toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg", day: "2-digit", month: "short", year: "numeric" });

    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    const todayStart = `${now.toISOString().split("T")[0]}T00:00:00Z`;

    console.log(`📊 Pipeline report — ${timeLabel} ${dateStr}`);

    // ── Gather all metrics in parallel ──
    const [
      { count: prospectsAdded },
      { count: emailsSent },
      { count: followUpsSent },
      { count: pendingQueue },
      { count: bookingsToday },
      { count: disqualifiedToday },
      { data: replyData },
      { data: lacAssessments },
      { data: industriesData },
    ] = await Promise.all([
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .gte("created_at", sixHoursAgo).or("disqualified.is.null,disqualified.eq.false"),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .gte("email_sent_at", sixHoursAgo),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .gte("follow_up_sent_at", sixHoursAgo),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .eq("status", "pending").not("contact_email", "is", null).neq("contact_email", "")
        .or("disqualified.is.null,disqualified.eq.false"),
      supabase.from("bookings").select("*", { count: "exact", head: true })
        .gte("created_at", todayStart),
      supabase.from("warm_outreach_queue").select("*", { count: "exact", head: true })
        .gte("created_at", todayStart).eq("disqualified", true),
      supabase.from("warm_outreach_queue").select("status")
        .in("status", ["interested", "not_interested", "ooo", "unsubscribed", "replied"])
        .gte("updated_at", todayStart),
      // LAC assessments today
      supabase.from("leader_as_coach_assessments").select("name, company, total_score, profile")
        .gte("created_at", todayStart),
      // Industries from today's prospects
      supabase.from("warm_outreach_queue").select("industry")
        .gte("created_at", sixHoursAgo)
        .not("industry", "is", null)
        .or("disqualified.is.null,disqualified.eq.false"),
    ]);

    // Classify replies
    const replies = { interested: 0, not_interested: 0, ooo: 0, unsubscribed: 0, other: 0 };
    for (const r of (replyData || []) as { status: string }[]) {
      if (r.status === "interested") replies.interested++;
      else if (r.status === "not_interested") replies.not_interested++;
      else if (r.status === "ooo") replies.ooo++;
      else if (r.status === "unsubscribed") replies.unsubscribed++;
      else replies.other++;
    }
    const totalReplies = replies.interested + replies.not_interested + replies.ooo + replies.unsubscribed;

    // Unique industries
    const industries = [...new Set((industriesData || []).map((r: any) => r.industry).filter(Boolean))];

    // Format LAC assessments
    const lacLines = (lacAssessments || []).map((a: any) => 
      `  ${a.name || "Unknown"}, ${a.company || "—"}, ${a.total_score}/75, ${a.profile || "—"}`
    );

    // ── Build the Slack message ──
    const replyBreakdown = totalReplies > 0
      ? `🔥 Interested: ${replies.interested} | ❌ Not interested: ${replies.not_interested} | 🔄 OOO: ${replies.ooo} | 🚫 Unsub: ${replies.unsubscribed}`
      : "None";

    const message = `🎯 *LBD Pipeline — ${timeLabel} ${dateStr}*

*PROSPECTING*
✅ New prospects added: ${prospectsAdded || 0}
🏭 Industries: ${industries.length > 0 ? industries.join(", ") : "—"}
❌ Disqualified (wrong industry): ${disqualifiedToday || 0}

*OUTREACH*
📧 Emails sent today: ${(emailsSent || 0) + (followUpsSent || 0)}
📬 Replies received: ${totalReplies} (${replyBreakdown})
📅 Bookings confirmed: ${bookingsToday || 0}
🔄 Queue depth: ${pendingQueue || 0} pending

*DIAGNOSTICS*
🎯 New LAC Assessments completed: ${(lacAssessments || []).length}${lacLines.length > 0 ? "\n" + lacLines.join("\n") : ""}`;

    // ── Post to #mission-control via Slack ──
    await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
      body: JSON.stringify({
        channel: "mission-control",
        eventType: "pipeline_status_report",
        data: {
          time: `${timeLabel} ${dateStr}`,
          prospectsAdded: prospectsAdded || 0,
          emailsSent: (emailsSent || 0) + (followUpsSent || 0),
          repliesInterested: replies.interested,
          repliesNotInterested: replies.not_interested,
          repliesOOO: replies.ooo,
          repliesUnsubscribed: replies.unsubscribed,
          totalReplies,
          bookings: bookingsToday || 0,
          queueDepth: pendingQueue || 0,
          failed: 0,
          disqualified: disqualifiedToday || 0,
          lacAssessments: (lacAssessments || []).length,
          industries: industries.join(", "),
        },
      }),
    });

    console.log(`✅ Pipeline report posted`);

    return new Response(
      JSON.stringify({
        success: true,
        prospectsAdded: prospectsAdded || 0,
        emailsSent: (emailsSent || 0) + (followUpsSent || 0),
        queueDepth: pendingQueue || 0,
        bookings: bookingsToday || 0,
        lacAssessments: (lacAssessments || []).length,
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
