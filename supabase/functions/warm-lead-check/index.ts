import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Warm Lead Check — returns recent diagnostic completers, contact form
 * submissions, and subscribers that need follow-up.
 * Called by the Python warm_lead_activator agent every 15 min.
 * Uses service role key to bypass RLS.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const resendKey = Deno.env.get("RESEND_API_KEY");

  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    // 1. Recent diagnostic completions (last 24h)
    const { data: diagnostics } = await supabase
      .from("leader_as_coach_assessments")
      .select("id, email, name, company, job_title, profile, total_score, lead_temperature, created_at")
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false })
      .limit(20);

    // 2. Recent contact form submissions (last 24h)
    const { data: contacts } = await supabase
      .from("contact_form_submissions")
      .select("id, email, name, company, message, created_at")
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false })
      .limit(10);

    // 3. Outreach replies (status = replied or replied_interested)
    const { data: replies } = await supabase
      .from("warm_outreach_queue")
      .select("id, contact_name, contact_email, company_name, contact_title, email_subject, score, updated_at")
      .in("status", ["replied", "replied_interested"])
      .gte("updated_at", twentyFourHoursAgo)
      .order("updated_at", { ascending: false })
      .limit(10);

    // 4. New subscribers (last 24h)
    const { data: subscribers } = await supabase
      .from("email_subscribers")
      .select("id, email, name, created_at")
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false })
      .limit(10);

    // 5. Check for unfollowed warm leads (diagnostic completers with no outreach)
    const unfollowed: any[] = [];
    for (const d of diagnostics || []) {
      if (!d.email) continue;
      const { data: outreach } = await supabase
        .from("prospect_outreach")
        .select("id")
        .eq("recipient_email", d.email)
        .limit(1);

      if (!outreach?.length) {
        unfollowed.push({
          email: d.email,
          name: d.name,
          company: d.company,
          score: d.total_score,
          profile: d.profile,
          completed_at: d.created_at,
        });
      }
    }

    // If there are unfollowed warm leads, send immediate Slack + email alert
    if (unfollowed.length > 0) {
      const names = unfollowed.map(u => `${u.name || u.email} (${u.company || "?"})`).join(", ");

      // Slack alert
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: "system-health",
            eventType: "system_error",
            data: {
              function: "🚨 Warm Leads Need Follow-Up",
              error: `${unfollowed.length} diagnostic completer(s) with NO follow-up: ${names}`,
            },
          }),
        });
      } catch { /* best effort */ }

      // Email Kevin
      if (resendKey) {
        try {
          const listHtml = unfollowed.map(u =>
            `<li><b>${u.name || u.email}</b> at ${u.company || "unknown"} — ${u.score}/75 (${u.profile}) — completed ${new Date(u.completed_at).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</li>`
          ).join("");

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "LBD System <hello@leadershipbydesign.co>",
              to: ["kevin@kevinbritz.com"],
              subject: `🚨 ${unfollowed.length} warm lead(s) need follow-up NOW`,
              html: `<div style="font-family:system-ui;font-size:14px;line-height:1.6;max-width:600px;">
                <h2 style="color:#c0392b;">Warm Leads Going Cold</h2>
                <p>These people completed the diagnostic but have NO follow-up email:</p>
                <ul>${listHtml}</ul>
                <p>Reply to their diagnostic results or reach out directly.</p>
              </div>`,
            }),
          });
        } catch { /* best effort */ }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        diagnostics: diagnostics || [],
        contacts: contacts || [],
        replies: replies || [],
        subscribers: subscribers || [],
        unfollowed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("warm-lead-check error:", errMsg);
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
