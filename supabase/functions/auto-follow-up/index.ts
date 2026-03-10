import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("🔄 Starting auto-follow-up...");

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // Find prospects emailed 48+ hours ago, not yet followed up or booked
    const { data: prospects, error } = await supabase
      .from("warm_outreach_queue")
      .select("*")
      .eq("status", "emailed")
      .is("follow_up_sent_at", null)
      .is("booked_at", null)
      .lt("email_sent_at", fortyEightHoursAgo)
      .not("contact_email", "is", null)
      .limit(15);

    if (error || !prospects?.length) {
      console.log("No follow-ups needed");
      return new Response(JSON.stringify({ success: true, followed_up: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get booking link
    const { data: settingsData } = await supabase
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "booking_link")
      .single();
    const bookingLink = settingsData?.setting_value || "https://leadershipbydesign.lovable.app/contact";

    let followedUp = 0;

    for (const prospect of prospects) {
      try {
        const firstName = prospect.contact_name?.split(" ")[0] || "there";

        const followUpBody = `Hi ${firstName},

Just circling back on my note from a couple of days ago. I know inboxes get crazy — no pressure at all.

If you're curious about what we've been doing with teams like yours at ${prospect.company_name}, I'd love a quick 15-minute chat. No pitch, just a conversation.

Here's my calendar if it's easier: ${bookingLink}

Either way, hope you're having a good week.

— Kevin, Leadership by Design`;

        const sendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Kevin Britz <kevin@leadershipbydesign.co.za>",
            to: [prospect.contact_email],
            subject: `Quick follow-up, ${firstName}`,
            html: `<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px;">
              ${followUpBody.split("\n").filter(Boolean).map((p: string) => `<p>${p}</p>`).join("")}
            </div>`,
          }),
        });

        if (!sendRes.ok) {
          console.error(`Follow-up send failed for ${prospect.contact_email}`);
          continue;
        }

        await supabase
          .from("warm_outreach_queue")
          .update({
            status: "followed_up",
            follow_up_sent_at: new Date().toISOString(),
            follow_up_body: followUpBody,
            updated_at: new Date().toISOString(),
          })
          .eq("id", prospect.id);

        followedUp++;
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`Follow-up error for ${prospect.id}:`, err);
      }
    }

    console.log(`🔄 Auto-follow-up complete: ${followedUp} follow-ups sent`);

    return new Response(
      JSON.stringify({ success: true, followed_up: followedUp }),
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
