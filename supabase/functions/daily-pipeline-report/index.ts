import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log("📊 Generating daily pipeline report...");

    const today = new Date().toISOString().split("T")[0];
    const todayStart = `${today}T00:00:00Z`;

    // Today's new leads from outreach queue
    const { count: newLeadsToday } = await supabase
      .from("warm_outreach_queue")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart);

    // Emails sent today
    const { count: emailsSentToday } = await supabase
      .from("warm_outreach_queue")
      .select("*", { count: "exact", head: true })
      .gte("email_sent_at", todayStart);

    // Follow-ups sent today
    const { count: followUpsSentToday } = await supabase
      .from("warm_outreach_queue")
      .select("*", { count: "exact", head: true })
      .gte("follow_up_sent_at", todayStart);

    // Queue status counts
    const { data: allQueue } = await supabase
      .from("warm_outreach_queue")
      .select("status");

    const statusCounts: Record<string, number> = {};
    (allQueue || []).forEach((q: { status: string }) => {
      statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
    });

    // Total contact form submissions today
    const { count: contactFormsToday } = await supabase
      .from("contact_form_submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart);

    // Tomorrow's bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const { data: tomorrowBookings } = await supabase
      .from("bookings")
      .select("prospect_name, prospect_company, meeting_date")
      .gte("meeting_date", `${tomorrowStr}T00:00:00Z`)
      .lt("meeting_date", `${tomorrowStr}T23:59:59Z`);

    const bookingsList = (tomorrowBookings || [])
      .map((b: { prospect_name: string; prospect_company: string }) => `• ${b.prospect_name} (${b.prospect_company})`)
      .join("\n") || "None scheduled";

    const statusLines = Object.entries(statusCounts)
      .map(([status, count]) => `• ${status}: ${count}`)
      .join("\n");

    const reportText = `📊 *Daily Pipeline Report — ${today}*

*🔍 New Leads Found:* ${newLeadsToday || 0}
*📧 Outreach Emails Sent:* ${emailsSentToday || 0}
*🔄 Follow-ups Sent:* ${followUpsSentToday || 0}
*📝 Contact Forms:* ${contactFormsToday || 0}

*Pipeline Status:*
${statusLines || "No queue data"}

*Tomorrow's Meetings:*
${bookingsList}`;

    // Send to Slack #mission-control
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          channel: "mission-control",
          blocks: [
            { type: "header", text: { type: "plain_text", text: `📊 Daily Pipeline Report — ${today}` } },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*🔍 New Leads:* ${newLeadsToday || 0}  |  *📧 Emails Sent:* ${emailsSentToday || 0}  |  *🔄 Follow-ups:* ${followUpsSentToday || 0}  |  *📝 Contact Forms:* ${contactFormsToday || 0}`,
              },
            },
            {
              type: "section",
              text: { type: "mrkdwn", text: `*Queue Status:*\n${statusLines || "Empty"}` },
            },
            {
              type: "section",
              text: { type: "mrkdwn", text: `*Tomorrow's Meetings:*\n${bookingsList}` },
            },
          ],
        }),
      });
    } catch (e) {
      console.error("Slack notify failed:", e);
    }

    // Also send email summary to Kevin
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "LBD System <system@leadershipbydesign.co.za>",
            to: ["kevin@leadershipbydesign.co.za"],
            subject: `📊 Daily Pipeline Report — ${today}`,
            html: `<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.8; color: #333; max-width: 600px;">
              <h2>Daily Pipeline Report</h2>
              <p><strong>New Leads Found:</strong> ${newLeadsToday || 0}</p>
              <p><strong>Outreach Emails Sent:</strong> ${emailsSentToday || 0}</p>
              <p><strong>Follow-ups Sent:</strong> ${followUpsSentToday || 0}</p>
              <p><strong>Contact Forms:</strong> ${contactFormsToday || 0}</p>
              <h3>Queue Status</h3>
              <pre>${statusLines || "Empty"}</pre>
              <h3>Tomorrow's Meetings</h3>
              <pre>${bookingsList}</pre>
            </div>`,
          }),
        });
      } catch (e) {
        console.error("Email report failed:", e);
      }
    }

    console.log("📊 Daily report sent successfully");

    return new Response(
      JSON.stringify({ success: true, report: reportText }),
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
