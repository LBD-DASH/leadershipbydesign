import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DownloadEmailRequest {
  email: string;
  name?: string;
  workshop: string;
  scores: {
    clarity: number;
    motivation: number;
    leadership: number;
  };
  primaryRecommendation: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, workshop, scores, primaryRecommendation }: DownloadEmailRequest = await req.json();

    console.log("Processing download notification for:", email, "Workshop:", workshop);

    const displayName = name || "A visitor";
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Johannesburg",
      dateStyle: "full",
      timeStyle: "short"
    });

    // Send notification to Kevin
    const notificationResponse = await resend.emails.send({
      from: "Leadership By Design <onboarding@resend.dev>",
      to: ["kevin@kevinbritz.com", "lauren@kevinbritz.com"],
      subject: `📥 New Workshop Download: ${workshop}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Workshop Download Lead
          </h1>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1a1a1a;">Contact Details</h2>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Name:</strong> ${displayName}</p>
            <p><strong>Downloaded:</strong> ${workshop}</p>
            <p><strong>Time:</strong> ${timestamp}</p>
          </div>

          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1a1a1a;">Diagnostic Scores</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">Team Alignment</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dbeafe; text-align: right; font-weight: bold; color: ${primaryRecommendation === 'clarity' ? '#2563eb' : '#666'};">${scores.clarity}/25</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">Team Energy</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dbeafe; text-align: right; font-weight: bold; color: ${primaryRecommendation === 'motivation' ? '#2563eb' : '#666'};">${scores.motivation}/25</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Team Ownership</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: ${primaryRecommendation === 'leadership' ? '#2563eb' : '#666'};">${scores.leadership}/25</td>
              </tr>
            </table>
            <p style="margin-top: 15px; font-size: 13px; color: #666;">
              Primary Recommendation: <strong>${workshop}</strong>
            </p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              💡 <strong>Tip:</strong> This lead downloaded workshop information - they're interested! 
              Consider reaching out within 24-48 hours while the diagnostic is fresh in their mind.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This notification was sent automatically from the Leadership By Design diagnostic tool.
          </p>
        </div>
      `,
    });

    console.log("Notification email sent to Kevin:", notificationResponse);

    // Send confirmation to the user
    const userResponse = await resend.emails.send({
      from: "Leadership By Design <onboarding@resend.dev>",
      to: [email],
      subject: `Your ${workshop} Overview`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Thank You for Your Interest!</h1>
          
          <p>Hi${name ? ` ${name}` : ''},</p>
          
          <p>Thank you for completing our Leadership Diagnostic and downloading the <strong>${workshop}</strong> overview.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1a1a1a;">Your Diagnostic Summary</h2>
            <ul style="padding-left: 20px; color: #444;">
              <li>Team Alignment Score: ${scores.clarity}/25</li>
              <li>Team Energy Score: ${scores.motivation}/25</li>
              <li>Team Ownership Score: ${scores.leadership}/25</li>
            </ul>
            <p style="margin-bottom: 0;">Based on your results, <strong>${workshop}</strong> is your recommended starting point.</p>
          </div>

          <h2 style="color: #1a1a1a;">What's Next?</h2>
          
          <p>If you'd like to discuss how we can help your team, here are your options:</p>
          
          <ul style="padding-left: 20px; color: #444;">
            <li><strong>Book a Discovery Call:</strong> Let's explore your team's specific challenges and how we can help.</li>
            <li><strong>Learn About SHIFT™:</strong> Visit our website to learn more about our methodology.</li>
            <li><strong>Reply to This Email:</strong> I'm happy to answer any questions you have.</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://leadershipbydesign.lovable.app/contact" 
               style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Book a Discovery Call
            </a>
          </div>

          <p>Looking forward to helping you and your team thrive!</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Kevin Britz</strong><br>
            Leadership By Design<br>
            <a href="mailto:kevin@kevinbritz.com" style="color: #2563eb;">kevin@kevinbritz.com</a>
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px;">
            You received this email because you downloaded a workshop overview from Leadership By Design. 
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent to user:", userResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationSent: !!notificationResponse,
        userEmailSent: !!userResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-download-email function:", error);
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
