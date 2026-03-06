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
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (!firecrawlKey || !anthropicKey || !resendKey) {
    return new Response(JSON.stringify({ error: "Missing API keys" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("📧 Starting auto-outreach pipeline...");

    // Get top 10 pending prospects with email
    const { data: prospects, error: fetchErr } = await supabase
      .from("warm_outreach_queue")
      .select("*")
      .eq("status", "pending")
      .not("contact_email", "is", null)
      .not("contact_email", "eq", "")
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchErr || !prospects?.length) {
      console.log("No pending prospects found");
      return new Response(JSON.stringify({ success: true, emailed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing ${prospects.length} prospects`);
    let emailedCount = 0;

    // Fetch booking link from admin settings
    const { data: settingsData } = await supabase
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "booking_link")
      .single();
    const bookingLink = settingsData?.setting_value || "https://leadershipbydesign.lovable.app/contact";

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
                content: `Write a personalized outreach email from Kevin Britz, a straight-talking South African leadership coach who's worked with 4,000+ leaders. 

PROSPECT: ${prospect.contact_name || "Unknown"}, ${prospect.contact_title || ""} at ${prospect.company_name}
COMPANY WEBSITE CONTENT: ${companyContext || "No website content available"}
BOOKING LINK: ${bookingLink}

RULES:
- Subject line: Short, personal, no corporate fluff. Max 6 words.
- Body: Under 100 words. Written in first person as Kevin.
- First paragraph: ONE specific observation about their company (2 sentences max)
- Second paragraph: A relatable challenge companies like theirs face. Use "What I've noticed..." or "The thing is..." (2-3 sentences)
- Third paragraph: Casual zero-pressure ask with the booking link. "Would you be up for a quick chat?" style.
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
          console.error(`Claude API failed for ${prospect.company_name}: ${aiRes.status}`);
          continue;
        }

        const aiData = await aiRes.json();
        const aiText = aiData.content?.[0]?.text || "";
        let emailContent: { subject: string; body: string };

        try {
          emailContent = JSON.parse(aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
        } catch {
          console.error("Failed to parse AI email response:", aiText);
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
            from: "Kevin Britz <kevin@leadershipbydesign.co.za>",
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

        // Step 5: Enroll in nurture sequence
        await supabase.from("diagnostic_nurture_sequences").insert({
          lead_email: prospect.contact_email,
          lead_name: prospect.contact_name,
          diagnostic_type: "outreach",
          primary_result: "warm_outreach",
          status: "active",
          next_send_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        });

        // Step 6: Add to pipeline
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
        console.log(`✅ Emailed: ${prospect.contact_name} at ${prospect.company_name}`);

        // Rate limit delay
        await new Promise((r) => setTimeout(r, 2000));
      } catch (err) {
        console.error(`Error processing prospect ${prospect.id}:`, err);
      }
    }

    console.log(`📧 Auto-outreach complete: ${emailedCount} emails sent`);

    // Slack notification
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
            { type: "header", text: { type: "plain_text", text: "📧 Auto-Outreach Complete" } },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Emails sent:* ${emailedCount}/${prospects.length}\n*Pipeline:* Prospects moved to "contacted"`,
              },
            },
          ],
        }),
      });
    } catch (e) {
      console.error("Slack notify failed:", e);
    }

    return new Response(
      JSON.stringify({ success: true, emailed: emailedCount, total: prospects.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("auto-outreach error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
