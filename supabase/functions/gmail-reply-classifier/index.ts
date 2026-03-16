import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Gmail Reply Classifier
 * Polls Gmail API every 30 minutes for replies to outreach emails.
 * Classifies: interested / not_interested / ooo / unsubscribe
 * Updates warm_outreach_queue and sends Slack alerts for interested replies.
 */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const googleClientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const googleClientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const googleRefreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");

  if (!googleClientId || !googleClientSecret || !googleRefreshToken) {
    console.error("Missing Google OAuth credentials");
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "system_error",
          data: { function: "gmail-reply-classifier", error: "Missing Google OAuth credentials (CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN)" },
        }),
      });
    } catch { /* best effort */ }
    return new Response(JSON.stringify({ error: "Missing Google OAuth credentials" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("📬 Gmail reply classifier starting...");

    // Step 1: Get fresh access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: googleRefreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Token refresh failed: ${tokenRes.status} — ${errText}`);
    }

    const { access_token } = await tokenRes.json();

    // Step 2: Search for replies in the last 35 minutes (overlap for safety)
    const thirtyFiveMinAgo = Math.floor((Date.now() - 35 * 60 * 1000) / 1000);
    const query = `is:inbox in:reply after:${thirtyFiveMinAgo} to:kevin@kevinbritz.com`;

    const searchRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      throw new Error(`Gmail search failed: ${searchRes.status} — ${errText}`);
    }

    const searchData = await searchRes.json();
    const messages = searchData.messages || [];

    if (messages.length === 0) {
      console.log("No new replies found");
      return new Response(JSON.stringify({ success: true, processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${messages.length} potential replies`);
    let processed = 0;

    for (const msg of messages) {
      try {
        // Fetch full message
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );

        if (!msgRes.ok) continue;
        const msgData = await msgRes.json();

        const headers = msgData.payload?.headers || [];
        const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";
        const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "";

        // Extract sender email
        const emailMatch = fromHeader.match(/<([^>]+)>/);
        const senderEmail = emailMatch ? emailMatch[1].toLowerCase() : fromHeader.toLowerCase().trim();

        // Skip our own emails
        if (senderEmail.includes("kevin@kevinbritz.com") || senderEmail.includes("kevin@leadershipbydesign")) continue;

        // Match to warm_outreach_queue by email
        const { data: prospect } = await supabase
          .from("warm_outreach_queue")
          .select("*")
          .eq("contact_email", senderEmail)
          .in("status", ["emailed", "followed_up", "sequence_complete"])
          .maybeSingle();

        if (!prospect) continue;

        // Already processed this reply?
        if (prospect.reply_received) continue;

        // Extract body text
        let bodyText = "";
        const parts = msgData.payload?.parts || [msgData.payload];
        for (const part of parts) {
          if (part.mimeType === "text/plain" && part.body?.data) {
            bodyText = atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
            break;
          }
        }

        // Classify reply
        const bodyLower = bodyText.toLowerCase();
        let classification = "not_interested";

        const oooPatterns = ["out of office", "ooo", "away from", "auto-reply", "automatic reply", "on leave", "on vacation", "maternity leave"];
        const unsubPatterns = ["unsubscribe", "remove me", "stop emailing", "opt out", "take me off", "do not contact"];
        const interestedPatterns = [
          "interested", "tell me more", "let's chat", "let's talk", "send me", "would love",
          "set up a call", "schedule", "available", "sounds good", "sounds interesting",
          "this resonates", "keen", "yes please", "good timing", "let's connect",
          "book a time", "meeting", "calendar"
        ];

        if (oooPatterns.some(p => bodyLower.includes(p))) {
          classification = "ooo";
        } else if (unsubPatterns.some(p => bodyLower.includes(p))) {
          classification = "unsubscribe";
        } else if (interestedPatterns.some(p => bodyLower.includes(p))) {
          classification = "interested";
        }

        // Update prospect
        const updateData: Record<string, any> = {
          reply_received: true,
          reply_status: classification,
          reply_received_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (classification === "unsubscribe") {
          updateData.unsubscribed = true;
          updateData.status = "unsubscribed";
        } else if (classification === "interested") {
          updateData.status = "replied_interested";
        }

        await supabase
          .from("warm_outreach_queue")
          .update(updateData)
          .eq("id", prospect.id);

        // Slack notifications
        if (classification === "interested") {
          await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
            body: JSON.stringify({
              channel: "leads-and-signups",
              eventType: "system_error",
              data: {
                function: "🔥 REPLY — INTERESTED",
                error: `${prospect.contact_name || senderEmail} from ${prospect.company_name || "Unknown"} replied to your outreach. Open Gmail and respond within 2 hours.`,
              },
            }),
          });
        }

        processed++;
        console.log(`✅ Classified reply from ${senderEmail}: ${classification}`);
      } catch (err) {
        console.error(`Error processing message ${msg.id}:`, err);
      }
    }

    console.log(`📬 Gmail reply classifier complete: ${processed} replies processed`);

    return new Response(
      JSON.stringify({ success: true, processed, total: messages.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("gmail-reply-classifier error:", errMsg);
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ eventType: "system_error", data: { function: "gmail-reply-classifier", error: errMsg } }),
      });
    } catch { /* best effort */ }
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
