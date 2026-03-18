import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Multi-step outreach follow-up processor.
 * Runs daily via cron. Sends Day 4, Day 9, Day 16 follow-ups.
 * Max 30 emails per day total for deliverability.
 * Stops on reply, booking, unsubscribe, or disqualification.
 */

interface FollowUpTemplate {
  step: number;
  minDays: number;
  statusField: string;
  getSubject: (company: string) => string;
  getBody: (firstName: string, company: string, bookingLink: string) => string;
}

const templates: FollowUpTemplate[] = [
  {
    step: 2,
    minDays: 4,
    statusField: "step2_sent_at",
    getSubject: (company) => `Quick follow-up — ${company}`,
    getBody: (firstName, company, bookingLink) =>
      `Hi ${firstName},

Just following up on my note about coaching capability in your management layer.

One pattern I keep seeing in financial services firms: managers who were promoted for technical excellence default to command-and-control. It shows up as disengagement, escalations landing on HR's desk, and good people leaving.

If you're curious where your management layer stands, there's a free 3-minute assessment here: https://www.leadershipbydesign.co/leader-as-coach-diagnostic

Takes 3 minutes. You'll get an instant profile.

— Kevin, Leadership by Design`,
  },
  {
    step: 3,
    minDays: 9,
    statusField: "step3_sent_at",
    getSubject: (_company) => `The cost nobody calculates`,
    getBody: (firstName, _company, _bookingLink) =>
      `Hi ${firstName},

The average mid-size SA firm loses R1.5 to R3 million a year to turnover driven by poor management. Most of it traces back to managers who were promoted for technical skill and left to figure out people leadership on their own.

We built a free diagnostic that benchmarks your management layer's coaching capability in 2 minutes:
https://leadershipbydesign.co/leader-as-coach-diagnostic

You'll get an instant scorecard showing exactly where the gaps are.

— Kevin, Leadership by Design`,
  },
  {
    step: 4,
    minDays: 16,
    statusField: "step4_sent_at",
    getSubject: (_company) => `Last note — free diagnostic inside`,
    getBody: (firstName, _company, _bookingLink) =>
      `${firstName} — the diagnostic takes two minutes and it's free.

https://leadershipbydesign.co/leader-as-coach-diagnostic

If you want to talk after, let me know.

— Kevin, Leadership by Design`,
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (!resendKey) {
    return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("🔄 Multi-step follow-up starting...");

    // Get booking link
    const { data: settingsData } = await supabase
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "booking_link")
      .single();
    const bookingLink = settingsData?.setting_value || "https://www.leadershipbydesign.co/contact";

    // Count emails sent today across all outreach (cap at 30)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const { count: sentToday } = await supabase
      .from("prospect_outreach")
      .select("*", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("sent_at", todayStart.toISOString());

    const dailyBudget = 30 - (sentToday || 0);
    if (dailyBudget <= 0) {
      console.log("Daily email limit reached (30). Skipping.");
      return new Response(JSON.stringify({ success: true, sent: 0, reason: "daily_limit" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let totalSent = 0;
    const stepBreakdown: Record<number, number> = { 2: 0, 3: 0, 4: 0 };

    for (const template of templates) {
      if (totalSent >= dailyBudget) break;

      const cutoffDate = new Date(Date.now() - template.minDays * 24 * 60 * 60 * 1000).toISOString();

      // Find prospects at the right stage
      let query = supabase
        .from("warm_outreach_queue")
        .select("*")
        .not("contact_email", "is", null)
        .neq("contact_email", "")
        .or("reply_received.is.null,reply_received.eq.false")
        .or("unsubscribed.is.null,unsubscribed.eq.false")
        .or("disqualified.is.null,disqualified.eq.false")
        .is("booked_at", null)
        .not("email_sent_at", "is", null)
        .lt("email_sent_at", cutoffDate)
        .eq("needs_day1", false); // CRITICAL: never send follow-ups to contacts that need Day 1

      // Step-specific filters — each step requires the previous step's timestamp to exist
      if (template.step === 2) {
        query = query.in("status", ["emailed"]).is("step2_sent_at", null);
      } else if (template.step === 3) {
        query = query.in("status", ["followed_up", "emailed"]).not("step2_sent_at", "is", null).is("step3_sent_at", null);
      } else if (template.step === 4) {
        query = query.not("step2_sent_at", "is", null).not("step3_sent_at", "is", null).is("step4_sent_at", null);
      }

      const { data: prospects } = await query.limit(dailyBudget - totalSent);

      if (!prospects?.length) continue;

      for (const prospect of prospects) {
        if (totalSent >= dailyBudget) break;

        try {
          const firstName = prospect.contact_name?.split(" ")[0] || "there";
          const company = prospect.company_name || "your organisation";

          const sendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Kevin Britz <kevin@leadershipbydesign.co>",
              to: [prospect.contact_email],
              subject: template.getSubject(company),
              html: `<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px;">
                ${template.getBody(firstName, company, bookingLink).split("\n").filter(Boolean).map((p: string) => `<p>${p}</p>`).join("")}
              </div>`,
            }),
          });

          if (!sendRes.ok) {
            console.error(`Step ${template.step} send failed for ${prospect.contact_email}`);
            continue;
          }

          const updateData: Record<string, any> = {
            sequence_step: template.step,
            [template.statusField]: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Mark final step as completed
          if (template.step === 4) {
            updateData.status = "sequence_complete";
          } else if (template.step === 2) {
            updateData.status = "followed_up";
          }

          await supabase
            .from("warm_outreach_queue")
            .update(updateData)
            .eq("id", prospect.id);

          // Log to prospect_outreach
          await supabase.from("prospect_outreach").insert({
            email_subject: template.getSubject(company),
            email_body: template.getBody(firstName, company, bookingLink),
            status: "sent",
            sent_at: new Date().toISOString(),
            sequence_step: template.step,
            template_used: `auto-follow-up-step-${template.step}`,
          });

          totalSent++;
          stepBreakdown[template.step]++;
          await new Promise((r) => setTimeout(r, 1500));
        } catch (err) {
          console.error(`Step ${template.step} error for ${prospect.id}:`, err);
        }
      }
    }

    console.log(`🔄 Follow-up complete: ${totalSent} sent (Step2: ${stepBreakdown[2]}, Step3: ${stepBreakdown[3]}, Step4: ${stepBreakdown[4]})`);

    // Slack summary
    if (totalSent > 0) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: "mission-control",
            eventType: "system_error",
            data: {
              function: `📧 Auto Follow-Up`,
              error: `Sent: ${totalSent} | Day4: ${stepBreakdown[2]} | Day9: ${stepBreakdown[3]} | Day16: ${stepBreakdown[4]}`,
            },
          }),
        });
      } catch { /* best effort */ }
    }

    return new Response(
      JSON.stringify({ success: true, sent: totalSent, breakdown: stepBreakdown }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("auto-follow-up error:", errMsg);
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "auto-follow-up", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
