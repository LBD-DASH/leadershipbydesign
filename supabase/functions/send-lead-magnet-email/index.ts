import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadMagnetRequest {
  name: string;
  email: string;
  leadMagnet: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, leadMagnet }: LeadMagnetRequest = await req.json();

    if (!name || !email || !leadMagnet) {
      throw new Error("Missing required fields");
    }

    // Checklist URL (kept off navigation + noindex)
    const pdfUrl = "https://leadershipbydesign.co/leadership-mistakes-checklist";
    
    // Send email to the lead
    const leadEmailResponse = await resend.emails.send({
      from: "Leadership by Design <hello@leadershipbydesign.co>",
      to: [email],
      subject: "Your Leadership Checklist is Ready 📋",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 10px;">Hey ${name}! 👋</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 12px; padding: 30px; margin: 20px 0;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thanks for downloading <strong>"The 5 Leadership Mistakes Costing You Your Best Employees"</strong>.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              This isn't just a checklist — it's a mirror. Most leaders unknowingly make at least 2-3 of these mistakes regularly.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${pdfUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                📥 Download Your Checklist
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 25px;">
              <strong>Pro tip:</strong> After reading, pick ONE mistake to focus on this week. Real change happens through small, consistent actions.
            </p>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Want to go deeper?</strong><br>
              <a href="https://www.leadershipbydesign.co/programmes" style="color: #7c3aed;">Explore our programmes</a> to discover how we can help you lead with greater impact.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
              Here to help you lead with impact,
            </p>
            <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0;">
              Kevin Britz
            </p>
            <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">
              Leadership by Design
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Lead email sent:", leadEmailResponse);

    // Send notification to Kevin
    const notificationResponse = await resend.emails.send({
      from: "Leadership by Design <hello@leadershipbydesign.co>",
      to: ["kevin@kevinbritz.com", "lauren@kevinbritz.com"],
      subject: `📥 New Lead Magnet Download: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <h2 style="color: #7c3aed;">New Lead Magnet Download</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Lead Magnet:</strong> ${leadMagnet}</p>
            <p><strong>Downloaded:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This person downloaded the Leadership Mistakes checklist. Consider following up if they don't take the diagnostic within a few days.
          </p>
        </body>
        </html>
      `,
    });

    console.log("Notification email sent:", notificationResponse);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-magnet-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
