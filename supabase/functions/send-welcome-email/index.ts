import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface ResendEmailResponse {
  id: string;
}

async function sendEmail(payload: {
  from: string;
  to: string[];
  subject: string;
  html: string;
}): Promise<ResendEmailResponse> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return res.json();
}



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
  diagnosticType: "leadership" | "team";
  primaryLevel?: string;
  primaryRecommendation?: string;
  followUpPreference: "yes" | "maybe";
}

const getLeadershipLevelName = (level: string): string => {
  const levels: Record<string, string> = {
    L1: "Productivity Leadership",
    L2: "Development Leadership",
    L3: "Purpose Leadership",
    L4: "Motivational Leadership",
    L5: "Strategic Leadership",
  };
  return levels[level] || level;
};

const getTeamWorkshopName = (recommendation: string): string => {
  const workshops: Record<string, string> = {
    motivation: "Motivation Workshop",
    alignment: "Alignment Workshop",
    leadership: "Leadership Workshop",
  };
  return workshops[recommendation] || recommendation;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      diagnosticType, 
      primaryLevel, 
      primaryRecommendation,
      followUpPreference 
    }: WelcomeEmailRequest = await req.json();

    const firstName = name?.split(" ")[0] || "there";
    const isEager = followUpPreference === "yes";

    let diagnosticResult = "";
    let nextStepText = "";

    if (diagnosticType === "leadership" && primaryLevel) {
      diagnosticResult = getLeadershipLevelName(primaryLevel);
      nextStepText = `Your results indicate that <strong>${diagnosticResult}</strong> is your primary leadership style. This insight is the first step toward understanding how you lead and where you can grow.`;
    } else if (diagnosticType === "team" && primaryRecommendation) {
      diagnosticResult = getTeamWorkshopName(primaryRecommendation);
      nextStepText = `Based on your team's diagnostic, we recommend the <strong>${diagnosticResult}</strong> as your priority focus area. This will help address the key challenges your team is facing.`;
    }

    const urgencyText = isEager
      ? `<p style="margin: 0 0 16px 0; color: #374151;">Since you're ready to take the next step, we'll be in touch within the next <strong>24-48 hours</strong> to schedule a brief discovery call.</p>`
      : `<p style="margin: 0 0 16px 0; color: #374151;">We understand timing is everything. We'll keep you updated with relevant insights, and when you're ready, we're here to help.</p>`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to the Priority Insight Waiting List</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 40px 30px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome, ${firstName}!</h1>
                      <p style="margin: 16px 0 0 0; color: #94a3b8; font-size: 16px;">You're now on the Priority Insight Waiting List</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                        Thank you for completing the ${diagnosticType === "leadership" ? "Leadership" : "Team"} Diagnostic. We're excited to help you unlock your full potential.
                      </p>
                      
                      <!-- Diagnostic Result Box -->
                      <div style="background-color: #f0f9ff; border-left: 4px solid #1e3a5f; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="margin: 0 0 12px 0; color: #1e3a5f; font-size: 18px;">Your Diagnostic Insight</h3>
                        <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                          ${nextStepText}
                        </p>
                      </div>
                      
                      <!-- Next Steps -->
                      <h3 style="margin: 32px 0 16px 0; color: #1e3a5f; font-size: 18px;">What Happens Next?</h3>
                      ${urgencyText}
                      
                      <p style="margin: 0 0 16px 0; color: #374151;">In the meantime, here's what you can expect:</p>
                      
                      <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #374151;">
                        <li style="margin-bottom: 8px;">Exclusive insights and resources tailored to your ${diagnosticType === "leadership" ? "leadership style" : "team's needs"}</li>
                        <li style="margin-bottom: 8px;">Priority access to workshops and development programs</li>
                        <li style="margin-bottom: 8px;">Tips and strategies from our expert coaches</li>
                      </ul>
                      
                      <!-- CTA Button -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="https://leadershipbydesign.lovable.app" 
                               style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                              Explore Our Resources
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        If you have any questions in the meantime, simply reply to this email. We're here to help.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                        Leadership by Design
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        Empowering leaders and teams to reach their full potential
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const emailResponse = await sendEmail({
      from: "Leadership by Design <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to the Priority Insight Waiting List, ${firstName}!`,
      html: emailHtml,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
