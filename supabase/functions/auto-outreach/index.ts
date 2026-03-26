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

        // Step 2: Claude generates personalized email
        const firstName = prospect.contact_name?.split(" ")[0] || "there";
        const industry = prospect.industry || "professional services";
        const companySize = prospect.company_size || "";

        const systemPrompt = `You are Kevin Britz, founder of Leadership by Design, writing a cold email to a senior HR or L&D decision maker in South Africa.

VOICE: Direct, warm, no corporate language. First person "I" throughout. You are a practitioner, not a vendor. Write like a peer, not a salesperson.

SUBJECT LINE RULES:
- Max 6 words
- Never use the company name
- Never use "leadership development", "training", "programme"
- Create tension or curiosity around a management problem
- Examples of the RIGHT direction:
  "Your managers are flying blind"
  "Coaching culture or command culture?"
  "Most managers default to this"
  "What happens after the training ends"
  "The gap nobody talks about"

BODY RULES:
- Under 80 words total. Hard limit.
- Never use: "impressive", "remarkable", "commitment to excellence", "particularly caught my attention", "I noticed your", "we", "our programme", "our approach"
- No flattery. No preamble. Get to the point in sentence one.
- Use "I" not "we"
- One idea only. No lists. No headers.

STRUCTURE:
Sentence 1-2: Name a specific management problem relevant to their industry or company size. Make it feel like an observation, not research. Use "What I've seen in [industry]..." or "The pattern I keep running into..."
Sentence 3-4: Connect that problem to what happens when managers coach instead of control. One concrete outcome only: retention, performance, or speed of execution.
Sentence 5: CTA. Offer the diagnostic as a gift, not a meeting request. "I built a 2-min diagnostic that shows exactly where your management layer sits. Want me to send it across?"

SIGN-OFF:
Kevin
Leadership by Design

CRITICAL: If the scraped signal contains words like "committed to", "passionate about", "excellence", "world-class", "journey" -- DISCARD IT. Use industry pattern instead.

OUTPUT FORMAT (respond ONLY with this, nothing else):
Subject: [subject line]

Hi [first name],

[email body]

Kevin
Leadership by Design`;

        const userPrompt = `PROSPECT:
- First name: ${firstName}
- Full name: ${prospect.contact_name || "Unknown"}
- Job title: ${prospect.contact_title || "HR Leader"}
- Company: ${prospect.company_name}
- Industry: ${industry}
- Company size: ${companySize}
- Scraped signal: ${companyContext || "None available"}

Write the email now. Only the subject and body. Nothing else.`;

        // Generation with validation retry
        let emailContent: { subject: string; body: string } | null = null;
        const BANNED_SUBJECT = ["leadership development", "training", "programme"];
        const BANNED_BODY = ["we ", "we'", "our programme", "our approach", "impressive", "remarkable", "commitment to excellence", "commitment"];

        for (let attempt = 0; attempt < 2; attempt++) {
          const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": anthropicKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 400,
              messages: [
                { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
              ],
            }),
          });

          if (!aiRes.ok) {
            const errDetail = await aiRes.text();
            console.error(`Claude API failed for ${prospect.company_name}: ${aiRes.status} — ${errDetail}`);
            errors.push(`Claude ${aiRes.status} for ${prospect.company_name}`);
            break;
          }

          const aiData = await aiRes.json();
          const aiText = (aiData.content?.[0]?.text || "").trim();

          // Parse "Subject: ...\n\n...body..." format
          const subjectMatch = aiText.match(/^Subject:\s*(.+)/i);
          if (!subjectMatch) {
            console.error("No subject line found in AI response:", aiText.slice(0, 200));
            if (attempt === 0) continue;
            errors.push(`Parse fail for ${prospect.company_name}`);
            break;
          }

          const subject = subjectMatch[1].trim();
          const body = aiText.slice(aiText.indexOf("\n", aiText.indexOf(subject)) + 1).trim();
          const wordCount = body.split(/\s+/).length;

          // Validation checks
          const companyLower = (prospect.company_name || "").toLowerCase();
          const subjectLower = subject.toLowerCase();
          const bodyLower = body.toLowerCase();

          const subjectBad = BANNED_SUBJECT.some(b => subjectLower.includes(b)) ||
            (companyLower.length > 2 && subjectLower.includes(companyLower));
          const bodyBad = BANNED_BODY.some(b => bodyLower.includes(b));
          const tooLong = wordCount > 120;

          if ((subjectBad || bodyBad || tooLong) && attempt === 0) {
            console.log(`  ♻️ Regenerating for ${prospect.company_name} (subject_bad=${subjectBad}, body_bad=${bodyBad}, words=${wordCount})`);
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }

          emailContent = { subject, body };
          break;
        }

        if (!emailContent) {
          errors.push(`Generation failed for ${prospect.company_name}`);
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
            scrape_summary: companyContext.substring(0, 500),
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

        // Log to prospect_outreach for admin visibility
        try {
          await supabase.from("prospect_outreach").insert({
            prospect_id: prospect.id,
            email_subject: emailContent.subject,
            email_body: emailContent.body,
            status: "sent",
            sent_at: new Date().toISOString(),
            sequence_step: 1,
            template_used: "kevin-cold-v2",
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
