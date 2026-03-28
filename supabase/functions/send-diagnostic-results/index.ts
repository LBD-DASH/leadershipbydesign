import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROFILE_DETAILS: Record<string, { label: string; description: string; recommendations: string[] }> = {
  operator: {
    label: "The Operator",
    description: "You're getting things done — but you're doing it by staying in the detail. Your team respects your competence, but they're waiting for permission instead of taking ownership. The cost shows up as bottlenecks, escalations, and good people who stop bringing ideas.",
    recommendations: [
      "Start with one team meeting per week where you ask questions instead of giving answers. Literally: no solutions from you for 30 minutes.",
      "Pick your strongest team member and delegate one decision you'd normally make yourself. Brief them, then step back completely.",
      "Track how many times per day someone comes to you for a decision they could make themselves. That number is your coaching gap.",
    ],
  },
  emerging_coach: {
    label: "The Emerging Coach",
    description: "You're in the transition zone — you know command-and-control isn't working but coaching doesn't feel natural yet. You default to telling when under pressure. The good news: you're self-aware enough to see the gap, and that's where real change starts.",
    recommendations: [
      "Before your next 1:1, write down three open-ended questions instead of three pieces of feedback. Lead with the questions.",
      "When someone brings you a problem, respond with 'What have you already considered?' before offering your view. Do this for one full week.",
      "Identify the one situation where you consistently revert to command mode. That's your highest-leverage coaching opportunity.",
    ],
  },
  ready_organisation: {
    label: "Ready Organisation",
    description: "Your managers are already coaching — the question is whether it's consistent and embedded or dependent on individual talent. At this level, the risk isn't capability — it's sustainability. When your best coaching managers leave, does the culture leave with them?",
    recommendations: [
      "Map which teams have strong coaching cultures vs which are personality-dependent. That's where to invest first.",
      "Introduce peer coaching circles — managers coaching each other creates consistency that doesn't rely on one person.",
      "Consider a structured 90-day accelerator to embed coaching as a system, not a skill that lives in individual managers.",
    ],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (!resendKey) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { email, name, company, profile_type, score, utm_source, utm_medium, utm_campaign, utm_content } = body;

    if (!email || !profile_type || score === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields: email, profile_type, score" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstName = (name || "").split(" ")[0] || "there";
    const profile = PROFILE_DETAILS[profile_type.toLowerCase().replace(/\s+/g, "_")] || PROFILE_DETAILS.emerging_coach;

    const recsHtml = profile.recommendations
      .map((r, i) => `<li style="margin-bottom: 12px;"><strong>${i + 1}.</strong> ${r}</li>`)
      .join("");

    const emailHtml = `
<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #2A7B88; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #F8F6F1; margin: 0; font-size: 22px;">Your Leader as Coach Diagnostic Results</h1>
  </div>

  <div style="padding: 32px; background: #F8F6F1; border-radius: 0 0 8px 8px;">
    <p>Hi ${firstName},</p>

    <p>Thanks for taking the diagnostic. Here's your full breakdown:</p>

    <div style="background: white; border: 2px solid #2A7B88; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="font-size: 14px; color: #666; margin: 0;">Your Score</p>
      <p style="font-size: 48px; font-weight: bold; color: #2A7B88; margin: 8px 0;">${score}<span style="font-size: 20px; color: #999;">/75</span></p>
      <p style="font-size: 18px; font-weight: bold; color: #333; margin: 0;">Profile: ${profile.label}</p>
    </div>

    <h2 style="color: #2A7B88; font-size: 18px;">What this means</h2>
    <p>${profile.description}</p>

    <h2 style="color: #2A7B88; font-size: 18px;">Three things you can do this week</h2>
    <ol style="padding-left: 0; list-style: none;">${recsHtml}</ol>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 32px 0;">

    <p>Want to see how other companies have closed this gap? Reply to this email and I'll share what's worked.</p>

    <p style="margin-top: 24px;">
      Kevin Britz<br>
      <span style="color: #666;">Leadership by Design</span><br>
      <span style="color: #999; font-size: 13px;">11 years | 4,000+ leaders developed | 30+ organisations</span>
    </p>
  </div>
</div>`;

    // Send via Resend
    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Kevin Britz <hello@leadershipbydesign.co>",
        reply_to: "hello@leadershipbydesign.co",
        to: [email],
        subject: `Your Leader as Coach Results — ${profile.label} (${score}/75)`,
        html: emailHtml,
      }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      console.error(`Resend failed: ${errText}`);
      return new Response(JSON.stringify({ error: `Email send failed: ${sendRes.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log to diagnostic_email_results table
    try {
      await supabase.from("diagnostic_email_results").insert({
        email,
        name: name || null,
        company: company || null,
        profile_type: profile_type.toLowerCase(),
        score,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
      });
    } catch (e) {
      console.error("Failed to log diagnostic email:", e);
    }

    // Notify Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "leads-and-signups",
          eventType: "system_error",
          data: {
            function: `📧 Diagnostic Results Emailed`,
            error: `${name || email} at ${company || "unknown"}\nProfile: ${profile.label} — Score: ${score}/75\nSource: ${utm_source || "direct"}/${utm_content || "organic"}`,
          },
        }),
      });
    } catch { /* best effort */ }

    console.log(`📧 Diagnostic results emailed to ${email} — ${profile.label} (${score}/75)`);

    return new Response(
      JSON.stringify({ success: true, profile: profile.label, score }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("send-diagnostic-results error:", errMsg);
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
