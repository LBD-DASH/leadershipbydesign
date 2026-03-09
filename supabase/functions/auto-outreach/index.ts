import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

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

  try {
    console.log("📧 auto-outreach invoked at", new Date().toISOString());

    // Get top 10 pending prospects that are NOT disqualified, with valid email, score >= 60
    const { data: prospects, error: fetchErr } = await supabase
      .from("warm_outreach_queue")
      .select("*")
      .eq("status", "pending")
      .not("contact_email", "is", null)
      .neq("contact_email", "")
      .or("disqualified.is.null,disqualified.eq.false")
      .order("score", { ascending: false }) // Highest score first
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

    console.log(`Processing ${prospects.length} qualified prospects`);
    let emailedCount = 0;
    const errors: string[] = [];

    // Fetch settings — campaign mode is locked to leader_as_coach
    const { data: settingsData } = await supabase
      .from("admin_settings")
      .select("setting_key, setting_value")
      .in("setting_key", ["booking_link"]);
    
    const settingsMap = Object.fromEntries((settingsData || []).map((s: any) => [s.setting_key, s.setting_value]));
    const bookingLink = settingsMap.booking_link || "https://leadershipbydesign.lovable.app/contact";

    for (const prospect of prospects) {
      try {
        // Step 1: Scrape company website
        let companyContext = "";
        if (prospect.company_website) {
          try {
            const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${firecrawlKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: prospect.company_website,
                formats: ["markdown"],
                onlyMainContent: true,
                timeout: 30000,
              }),
            });

            if (scrapeRes.ok) {
              const scrapeData = await scrapeRes.json();
              companyContext = (scrapeData.data?.markdown || scrapeData.markdown || "").substring(0, 3000);
            }
          } catch (e) {
            console.error(`Scrape failed for ${prospect.company_website}:`, e);
          }
        }

        // Step 2: Claude generates personalized email — ALWAYS Leader as Coach mode
        const firstName = prospect.contact_name?.split(" ")[0] || "there";

        const campaignPrompt = `Write a personalized outreach email from Kevin Britz — South Africa's Manager Coaching Specialist — who's worked with 4,000+ leaders across 50+ organisations over 11 years.

CONTEXT: Most managers were promoted for technical excellence, not people skills. They default to command-and-control instead of coaching their teams. This kills engagement, drives turnover, and stalls productivity. Kevin runs a 90-Day Manager Coaching Accelerator — a proven system that transforms command-and-control managers into leader-coaches who drive engagement, performance, and retention.

RULES:
- First paragraph: ONE specific observation about their company's management layer, team growth, or retention challenges (2 sentences max)
- Second paragraph: Connect to the problem of managers defaulting to command-and-control instead of coaching. Most were promoted for technical ability, not people skills — and it's costing the business in engagement, turnover, and stalled productivity. Position Kevin's 90-Day Manager Coaching Accelerator as the fix. Use "What I've noticed..." or "The thing is..." (2-3 sentences)
- Third paragraph: Casual zero-pressure ask with the booking link. "Would you be up for a quick chat about how this could work for your team?" style.`;

        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            messages: [
              {
                role: "user",
                content: `${campaignPrompt}

PROSPECT: ${prospect.contact_name || "Unknown"}, ${prospect.contact_title || ""} at ${prospect.company_name}
COMPANY WEBSITE CONTENT: ${companyContext || "No website content available"}
BOOKING LINK: ${bookingLink}

GLOBAL RULES:
- Subject line: Short, personal, no corporate fluff. Max 6 words.
- Body: Under 100 words. Written in first person as Kevin.
- Sign off as: — Kevin, Leadership by Design
- NEVER use: "I noticed your impressive...", "particularly caught my attention", "Would you be open to a brief 15-minute conversation"
- Be warm, direct, human. NOT corporate sales.

Respond as JSON: {"subject": "...", "body": "..."}
Only valid JSON, no markdown.`,
              },
            ],
          }),
        });

        if (!aiRes.ok) {
          const errDetail = await aiRes.text();
          console.error(`Claude API failed for ${prospect.company_name}: ${aiRes.status} — ${errDetail}`);
          errors.push(`Claude ${aiRes.status} for ${prospect.company_name}`);
          continue;
        }

        const aiData = await aiRes.json();
        const aiText = aiData.content?.[0]?.text || "";
        let emailContent: { subject: string; body: string };

        try {
          emailContent = JSON.parse(aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
        } catch {
          console.error("Failed to parse AI email response:", aiText);
          errors.push(`Parse fail for ${prospect.company_name}`);
          continue;
        }

        // Step 3: Send via Resend
        const sendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Kevin Britz <kevin@leadershipbydesign.co>",
            to: [prospect.contact_email],
            subject: emailContent.subject,
            html: `<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px;">
              <p>Hi ${firstName},</p>
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
            scrape_summary: companyContext.substring(0, 500),
            updated_at: new Date().toISOString(),
          })
          .eq("id", prospect.id);

        // Step 5: Add to pipeline
        await supabase.from("pipeline_deals").insert({
          lead_source_table: "warm_outreach_queue",
          lead_source_id: prospect.id,
          lead_name: prospect.contact_name || "",
          lead_email: prospect.contact_email,
          lead_company: prospect.company_name,
          lead_phone: prospect.contact_phone,
          stage: "contacted",
        }).then(() => {}).catch(() => {});

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

    console.log(`📧 Auto-outreach complete: ${emailedCount}/${prospects.length} emails sent`);

    // Slack notification
    const statusEmoji = emailedCount === prospects.length ? "✅" : emailedCount > 0 ? "⚠️" : "❌";
    const slackText = `*Emails sent:* ${emailedCount}/${prospects.length}${errors.length ? `\n*Errors:*\n${errors.map(e => `• ${e}`).join("\n")}` : ""}`;

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
