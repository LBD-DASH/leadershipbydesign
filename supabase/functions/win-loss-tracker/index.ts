import { createClient } from "npm:@supabase/supabase-js@2";

// Win/Loss Tracker — tracks deal outcomes and patterns daily at 17:00 SAST

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
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Check pipeline deals
    const { data: deals } = await supabase
      .from("pipeline_deals")
      .select("*")
      .gte("created_at", sevenDaysAgo);

    const allDeals = deals || [];
    const won = allDeals.filter((d: any) => d.stage === "won" || d.stage === "closed_won");
    const lost = allDeals.filter((d: any) => d.stage === "lost" || d.stage === "closed_lost");
    const active = allDeals.filter((d: any) => !["won", "lost", "closed_won", "closed_lost"].includes(d.stage));

    // Check bookings this week
    const { count: bookingsCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo);

    // Check diagnostic completions
    const { count: diagnosticCount } = await supabase
      .from("leader_as_coach_assessments")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo);

    // Check outreach sent
    const { count: emailsSent } = await supabase
      .from("prospect_outreach")
      .select("*", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("sent_at", sevenDaysAgo);

    const summary = {
      period: "7 days",
      deals_won: won.length,
      deals_lost: lost.length,
      deals_active: active.length,
      bookings: bookingsCount || 0,
      diagnostics: diagnosticCount || 0,
      emails_sent: emailsSent || 0,
      win_rate: won.length + lost.length > 0
        ? Math.round((won.length / (won.length + lost.length)) * 100) + "%"
        : "N/A",
    };

    // Post to Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: {
            function: "🏆 Win/Loss Tracker",
            error: `7-Day Summary | Won: ${summary.deals_won} | Lost: ${summary.deals_lost} | Active: ${summary.deals_active} | Bookings: ${summary.bookings} | Diagnostics: ${summary.diagnostics} | Emails: ${summary.emails_sent} | Win Rate: ${summary.win_rate}`,
          },
        }),
      });
    } catch { /* best effort */ }

    await supabase.from("agent_activity_log").insert({
      agent_name: "Win/Loss Tracker",
      agent_type: "sales",
      status: "success",
      message: `Won: ${summary.deals_won} | Lost: ${summary.deals_lost} | Active: ${summary.deals_active} | Win Rate: ${summary.win_rate}`,
      details: summary,
      items_processed: won.length + lost.length,
    });

    return new Response(JSON.stringify({ success: true, ...summary }), { headers });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await supabase.from("agent_activity_log").insert({
      agent_name: "Win/Loss Tracker",
      agent_type: "sales",
      status: "error",
      message: errMsg,
    });
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
