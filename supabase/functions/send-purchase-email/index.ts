import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PurchaseEmailRequest {
  email: string;
  name?: string;
  product: "survival-pack" | "new-manager-kit" | "bundle";
  paymentReference?: string;
}

const SITE = "https://leadershipbydesign.lovable.app";

const templates: Record<string, {
  subject: string;
  heading: string;
  body: string;
  downloadLinks: { label: string; url: string; filename: string }[];
  upsell?: { text: string; ctaLabel: string; ctaUrl: string };
}> = {
  "survival-pack": {
    subject: "Your New Manager Scripts Are Ready 🎉",
    heading: "Your Survival Pack is Ready",
    body: "You've taken the first step. Inside you'll find 3 plug-and-play conversation scripts — open them before your next meeting.",
    downloadLinks: [
      { label: "New Manager Survival Pack", url: `${SITE}/new-manager-kit.pdf`, filename: "New-Manager-Survival-Pack.pdf" },
    ],
    upsell: {
      text: "Want the complete 90-day system? The New Manager Survival Kit includes 5 scripts, a 30-60-90 day plan, self-assessment, and templates.",
      ctaLabel: "Upgrade to Full Kit — R497",
      ctaUrl: `${SITE}/new-manager-kit`,
    },
  },
  "new-manager-kit": {
    subject: "Your New Manager Survival Kit is Ready 🎉",
    heading: "Your Survival Kit is Ready",
    body: "Everything you need for your first 90 days. Start with the Self-Assessment on page 3, then map out your plan.",
    downloadLinks: [
      { label: "The New Manager Survival Kit", url: `${SITE}/new-manager-kit.pdf`, filename: "New-Manager-Survival-Kit.pdf" },
    ],
    upsell: {
      text: "Add the Difficult Conversations Playbook for just R100 more (normally R247). Get the Bundle and save 20%.",
      ctaLabel: "Get the Bundle — R597",
      ctaUrl: `${SITE}/products`,
    },
  },
  "bundle": {
    subject: "Your New Manager Bundle is Ready 🎉",
    heading: "Your Bundle is Ready",
    body: "You've got the complete toolkit. Start with the Survival Kit's Self-Assessment, then reference the Conversations Playbook when tough talks arise.",
    downloadLinks: [
      { label: "The New Manager Survival Kit", url: `${SITE}/new-manager-kit.pdf`, filename: "New-Manager-Survival-Kit.pdf" },
      { label: "Difficult Conversations Playbook", url: `${SITE}/difficult-conversations-playbook.pdf`, filename: "Difficult-Conversations-Playbook.pdf" },
    ],
    upsell: {
      text: "Ready to go deeper? The Leader as Coach Programme teaches you how to develop your team — not just manage them.",
      ctaLabel: "Explore Leader as Coach — R2,497",
      ctaUrl: `${SITE}/leader-as-coach-programme`,
    },
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, product, paymentReference }: PurchaseEmailRequest = await req.json();
    console.log(`Sending purchase email: ${product} to ${email}`);

    const t = templates[product];
    if (!t) throw new Error(`Unknown product: ${product}`);

    const displayName = name || "there";
    const downloadLinksHtml = t.downloadLinks
      .map(
        (dl) => `
        <a href="${dl.url}" 
           style="display:inline-block;background:#1B2A4A;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin:6px 0;">
          📥 Download ${dl.label}
        </a>`
      )
      .join("<br>");

    const upsellHtml = t.upsell
      ? `
      <div style="background:#f8f6f1;padding:20px;border-radius:8px;margin:24px 0;border-left:4px solid #C8A864;">
        <p style="margin:0 0 12px;color:#333;font-size:14px;">${t.upsell.text}</p>
        <a href="${t.upsell.ctaUrl}" 
           style="display:inline-block;background:#C8A864;color:#1B2A4A;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">
          ${t.upsell.ctaLabel} →
        </a>
      </div>`
      : "";

    // Send buyer email
    await resend.emails.send({
      from: "Leadership By Design <hello@leadershipbydesign.co>",
      to: [email],
      subject: t.subject,
      html: `
        <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h1 style="color:#1B2A4A;font-size:24px;">${t.heading}</h1>
          <p>Hi ${displayName},</p>
          <p style="color:#444;line-height:1.6;">${t.body}</p>
          
          <div style="text-align:center;margin:24px 0;">
            ${downloadLinksHtml}
          </div>

          ${upsellHtml}

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;">
            <p style="color:#666;font-size:13px;">
              Want to see where you stand as a leader?<br>
              <a href="${SITE}/leadership-diagnostic" style="color:#C8A864;font-weight:bold;">Take the Free Leadership Diagnostic →</a>
            </p>
          </div>

          <p style="margin-top:24px;color:#666;font-size:13px;">
            Best,<br><strong>Kevin Britz</strong><br>Leadership By Design<br>
            <a href="mailto:kevin@kevinbritz.com" style="color:#C8A864;">kevin@kevinbritz.com</a>
          </p>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
          <p style="color:#999;font-size:11px;">
            You received this because you purchased from Leadership By Design.
            <a href="${SITE}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#999;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    // Notify admin
    await resend.emails.send({
      from: "Leadership By Design <hello@leadershipbydesign.co>",
      to: ["kevin@kevinbritz.com"],
      subject: `💰 New Purchase: ${product} — ${email}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;padding:20px;">
          <h2 style="color:#1B2A4A;">New Digital Product Sale</h2>
          <p><strong>Product:</strong> ${product}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${displayName}</p>
          <p><strong>Reference:</strong> ${paymentReference || "N/A"}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</p>
        </div>
      `,
    });

    console.log("Purchase emails sent successfully");

    // Fire Slack notification (non-blocking)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceKey) {
      const amounts: Record<string, number> = { "survival-pack": 197, "new-manager-kit": 497, "bundle": 597 };
      fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
        body: JSON.stringify({
          eventType: 'purchase',
          data: {
            product: product,
            name: displayName,
            email,
            amount: amounts[product] || 0,
            reference: paymentReference || 'N/A',
          },
        }),
      }).catch(e => console.error('Slack notify error:', e));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-purchase-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

Deno.serve(handler);
