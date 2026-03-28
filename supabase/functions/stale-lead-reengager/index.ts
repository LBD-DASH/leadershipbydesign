import { createClient } from "npm:@supabase/supabase-js@2";

// Stale Lead Re-engager — finds leads that went cold and re-activates them
// Runs Wednesday 09:00 SAST

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

    // Find leads emailed 14-60 days ago that haven't progressed
    const { data: staleLeads } = await supabase
      .from("warm_outreach_queue")
      .select("*")
      .eq("status", "emailed")
      .lte("email_sent_at", fourteenDaysAgo)
      .gte("email_sent_at", sixtyDaysAgo)
      .or("disqualified.is.null,disqualified.eq.false")
      .not("contact_email", "is", null)
      .order("score", { ascending: false })
      .limit(20);

    const leads = staleLeads || [];
    let reactivated = 0;

    for (const lead of leads) {
      // Check if they've already been re-engaged
      const { count } = await supabase
        .from("prospect_outreach")
        .select("*", { count: "exact", head: true })
        .eq("prospect_id", lead.id)
        .gte("sequence_step", 4);

      // Only re-engage if they haven't completed the full sequence
      if ((count || 0) < 1) {
        // Reset to pending so auto-outreach picks them up with fresh copy
        await supabase
          .from("warm_outreach_queue")
          .update({
            status: "pending",
            score: Math.min((lead.score || 50) + 10, 90),
            source_keyword: `reengaged:${lead.source_keyword || "unknown"}`,
            updated_at: now.toISOString(),
          })
          .eq("id", lead.id);

        reactivated++;
      }
    }

    // Post to Slack if any reactivated
    if (reactivated > 0) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: "mission-control",
            eventType: "system_error",
            data: {
              function: "🔄 Stale Lead Re-engager",
              error: `Reactivated ${reactivated} stale leads for fresh outreach`,
            },
          }),
        });
      } catch { /* best effort */ }
    }

    await supabase.from("agent_activity_log").insert({
      agent_name: "Stale Lead Re-engager",
      agent_type: "outreach",
      status: "success",
      message: `Found ${leads.length} stale leads, reactivated ${reactivated}`,
      items_processed: reactivated,
    });

    return new Response(JSON.stringify({ success: true, found: leads.length, reactivated }), { headers });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await supabase.from("agent_activity_log").insert({
      agent_name: "Stale Lead Re-engager",
      agent_type: "outreach",
      status: "error",
      message: errMsg,
    });
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
