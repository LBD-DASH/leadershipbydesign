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
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (!firecrawlKey || !anthropicKey || !resendKey) {
    const missing = [!firecrawlKey && "FIRECRAWL", !anthropicKey && "ANTHROPIC", !resendKey && "RESEND"].filter(Boolean).join(", ");
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "auto-outreach", error: `Missing API keys: ${missing}` } }),
      });
    } catch { /* best effort */ }
    return new Response(JSON.stringify({ error: `Missing API keys: ${missing}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Diagnostic-first outreach — Step 1 only. Steps 2-4 handled by auto-follow-up.
  // No AI generation needed — proven template with direct diagnostic CTA.
  const DIAGNOSTIC_URL = "https://www.leadershipbydesign.co/leader-as-coach-diagnostic";
  const STEP1_SUBJECT = "quick question about your managers";
  const STEP1_SIGNATURE = `Kevin Britz\nLeadership by Design\n11 years | 4,000+ leaders developed | 30+ organisations`;

  function getStep1Body(firstName: string): string {
    return `Hi ${firstName},

Most companies we work with have the same gap — their managers were promoted for being great at their jobs, not because they knew how to lead. The cost is usually invisible until turnover spikes or performance flatlines.

We built a 3-minute diagnostic that shows exactly where that gap sits in your business. No fluff, no sales pitch — just a score and a breakdown you can act on immediately.

Here's the link: ${DIAGNOSTIC_URL}

Worth 3 minutes if leadership development is anywhere on your radar this year.

${STEP1_SIGNATURE}`;
  }

  // Companies to skip — test records, paused, or wrong ICP
  const SKIP_COMPANIES = [
    "test", "ldb test run", "ldb test", "salt essential information technology",
    "brighton   hair and bueaty", "brighton hair and beauty",
    "mbucks unlimited", "tears",
  ];

  try {
    console.log("📧 auto-outreach invoked at", new Date().toISOString());

    // Get top 10 pending prospects that are NOT disqualified, with valid email, score >= 60
    // Skip Apollo-sourced contacts — Apollo owns their outreach via sequences
    const { data: prospects, error: fetchErr } = await supabase
      .from("warm_outreach_queue")
      .select("*")
      .eq("status", "pending")
      .not("contact_email", "is", null)
      .neq("contact_email", "")
      .or("disqualified.is.null,disqualified.eq.false")
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchErr) {
      console.error("DB fetch error:", fetchErr.message);
      throw new Error(`DB fetch: ${fetchErr.message}`);
    }

    if (!prospects?.length) {
      console.log("No pending qualified prospects with email found");
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            eventType: "system_error",
            data: { function: "auto-outreach", error: "No pending qualified prospects with email addresses found." },
          }),
        });
      } catch { /* best effort */ }
      return new Response(JSON.stringify({ success: true, emailed: 0, reason: "no_qualified_prospects" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Filter out test/junk/paused companies and auto-disqualify them
    const validProspects = [];
    for (const p of prospects) {
      const companyLower = (p.company_name || "").toLowerCase().trim();
      if (SKIP_COMPANIES.some(s => companyLower === s || companyLower.includes(s))) {
        console.log(`⏭️ Skipping (blocklisted): ${p.company_name}`);
        await supabase
          .from("warm_outreach_queue")
          .update({ disqualified: true, disqualified_reason: "blocklisted_company", updated_at: new Date().toISOString() })
          .eq("id", p.id);
        continue;
      }
      validProspects.push(p);
    }

    if (!validProspects.length) {
      console.log("All prospects filtered out by blocklist");
      return new Response(JSON.stringify({ success: true, emailed: 0, reason: "all_blocklisted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing ${validProspects.length} qualified prospects`);
    let emailedCount = 0;
    const errors: string[] = [];

    // Fetch settings — campaign mode is locked to leader_as_coach
    const { data: settingsData } = await supabase
      .from("admin_settings")
      .select("setting_key, setting_value")
      .in("setting_key", ["booking_link"]);
    
    const settingsMap = Object.fromEntries((settingsData || []).map((s: any) => [s.setting_key, s.setting_value]));
    const bookingLink = settingsMap.booking_link || "https://leadershipbydesign.lovable.app/contact";

    for (const prospect of validProspects) {
      try {
        // Diagnostic-first Step 1 — no AI generation needed, proven template
        const firstName = prospect.contact_name?.split(" ")[0] || "there";
        const emailContent = {
          subject: STEP1_SUBJECT,
          body: getStep1Body(firstName),
        };

        // Step 3: Send via Resend
        const sendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Kevin Britz <hello@leadershipbydesign.co>",
            reply_to: "hello@leadershipbydesign.co",
            to: [prospect.contact_email],
            subject: emailContent.subject,
            html: `<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px;">
              ${emailContent.body.split("\n").filter(Boolean).map((p: string) => `<p>${p}</p>`).join("")}
            </div>`,
          }),
        });

        if (!sendRes.ok) {
          const errText = await sendRes.text();
          console.error(`Resend failed for ${prospect.contact_email}: ${errText}`);
          errors.push(`Resend fail: ${prospect.contact_email} — ${errText.slice(0, 100)}`);
          continue;
        }

        // Step 4: Update queue status
        await supabase
          .from("warm_outreach_queue")
          .update({
            status: "emailed",
            email_sent_at: new Date().toISOString(),
            email_subject: emailContent.subject,
            email_body: emailContent.body,
            scrape_summary: "diagnostic-first-v1",
            updated_at: new Date().toISOString(),
          })
          .eq("id", prospect.id);

        // Step 5: Add to pipeline + log outreach record
        try {
          await supabase.from("pipeline_deals").insert({
            lead_source_table: "warm_outreach_queue",
            lead_source_id: prospect.id,
            lead_name: prospect.contact_name || "",
            lead_email: prospect.contact_email,
            lead_company: prospect.company_name,
            lead_phone: prospect.contact_phone,
            stage: "contacted",
          });
        } catch { /* best effort */ }

        // Log to prospect_outreach for admin visibility + A/B tracking
        try {
          await supabase.from("prospect_outreach").insert({
            prospect_id: prospect.id,
            email_subject: emailContent.subject,
            email_body: emailContent.body,
            status: "sent",
            sent_at: new Date().toISOString(),
            sequence_step: 1,
            template_used: "diagnostic-first-v1",
            template_variant: "step1-diagnostic",
            recipient_email: prospect.contact_email,
          });
        } catch { /* best effort */ }

        emailedCount++;
        console.log(`✅ Emailed: ${prospect.contact_name || prospect.contact_email} at ${prospect.company_name}`);

        // Rate limit delay
        await new Promise((r) => setTimeout(r, 2000));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error processing prospect ${prospect.id}:`, msg);
        errors.push(`${prospect.company_name}: ${msg.slice(0, 100)}`);
      }
    }

    console.log(`📧 Auto-outreach complete: ${emailedCount}/${validProspects.length} emails sent`);

    // Slack notification
    const skipped = prospects.length - validProspects.length;
    const statusEmoji = emailedCount === validProspects.length ? "✅" : emailedCount > 0 ? "⚠️" : "❌";
    const skippedNote = skipped > 0 ? `\n*Skipped:* ${skipped} (blocklisted)` : "";
    const slackText = `*Emails sent:* ${emailedCount}/${validProspects.length}${skippedNote}${errors.length ? `\n*Errors:*\n${errors.map(e => `• ${e}`).join("\n")}` : ""}`;

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: {
            function: `auto-outreach ${statusEmoji}`,
            error: slackText,
          },
        }),
      });
    } catch (e) {
      console.error("Slack notify failed:", e);
    }

    // Log to agent_activity_log
    try {
      await supabase.from("agent_activity_log").insert({
        agent_name: "auto-outreach",
        status: emailedCount > 0 ? "success" : "warning",
        message: `Sent ${emailedCount}/${validProspects.length} diagnostic-first emails (Step 1)${errors.length ? `. Errors: ${errors.length}` : ""}`,
      });
    } catch { /* best effort */ }

    return new Response(
      JSON.stringify({ success: true, emailed: emailedCount, total: prospects.length, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("auto-outreach error:", errMsg);
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "auto-outreach", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
