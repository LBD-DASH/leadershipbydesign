import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadNotificationRequest {
  leadData: {
    name: string;
    email: string;
    role?: string;
    organisation?: string;
    company?: string;
    message?: string;
    followUpPreference?: string;
    source: string;
  };
  leadScore: {
    score: number;
    temperature: 'hot' | 'warm' | 'cool';
    buyerPersona: string;
    companySize: string;
    urgency: string;
    nextAction: string;
    breakdown: {
      roleWeight: number;
      organisationSignal: number;
      urgencySignal: number;
      messageQuality: number;
      sourceMultiplier: number;
    };
  };
  aiAnalysis: string;
  diagnosticContext?: string;
}

function generateHotLeadEmail(data: LeadNotificationRequest): string {
  const { leadData, leadScore, aiAnalysis, diagnosticContext } = data;
  const companyName = leadData.organisation || leadData.company || 'Unknown Company';
  const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Alert Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); border-radius: 16px 16px 0 0; padding: 24px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 8px;">🔥</div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">HOT LEAD ALERT</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Immediate Action Required</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Lead Info Card -->
      <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: inline-block; background: #dc2626; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">HOT LEAD</div>
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">${leadData.name}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;"><a href="mailto:${leadData.email}" style="color: #2563eb;">${leadData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Role:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${leadData.role || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Company:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${companyName}</td>
          </tr>
          ${leadData.followUpPreference ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Follow-up:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${leadData.followUpPreference === 'yes' ? '✅ Ready for call NOW' : leadData.followUpPreference === 'maybe' ? '🤔 Maybe later' : '❌ Not interested'}</td>
          </tr>
          ` : ''}
        </table>
        ${leadData.message ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #fecaca;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Message:</p>
          <p style="color: #1f2937; font-size: 14px; margin: 0; line-height: 1.6; font-style: italic;">"${leadData.message}"</p>
        </div>
        ` : ''}
      </div>

      <!-- Score Card -->
      <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <div style="font-size: 48px; font-weight: 700; color: #dc2626; margin-bottom: 8px;">${leadScore.score}/100</div>
        <div style="display: inline-block; background: #dc2626; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">🔥 HOT</div>
        <div style="margin-top: 16px; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 12px;">
          <div style="text-align: center;">
            <div style="font-size: 12px; color: #6b7280;">Persona</div>
            <div style="font-size: 14px; color: #1f2937; font-weight: 500;">${leadScore.buyerPersona}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 12px; color: #6b7280;">Company Size</div>
            <div style="font-size: 14px; color: #1f2937; font-weight: 500;">${leadScore.companySize}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 12px; color: #6b7280;">Urgency</div>
            <div style="font-size: 14px; color: #1f2937; font-weight: 500;">${leadScore.urgency}</div>
          </div>
        </div>
      </div>

      ${diagnosticContext ? `
      <!-- Diagnostic Context -->
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">📊 ${diagnosticContext}</p>
      </div>
      ` : ''}

      <!-- AI Analysis -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #166534; font-size: 16px;">🤖 AI Analysis</h3>
        <div style="color: #1f2937; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${aiAnalysis}</div>
      </div>

      <!-- Next Action -->
      <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 16px;">⚡ Recommended Action</h3>
        <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 500;">${leadScore.nextAction}</p>
      </div>

      <!-- Action Buttons -->
      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${leadData.email}?subject=Following%20up%20on%20your%20${encodeURIComponent(leadData.source.replace('-', ' '))}%20submission" style="display: inline-block; background: #dc2626; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px;">Reply Now</a>
        <a href="https://calendly.com/kevinbritz" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px;">Book Discovery Call</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
      <p style="margin: 0;">Lead captured: ${timestamp}</p>
      <p style="margin: 4px 0 0 0;">Leadership by Design - Lead Scoring System</p>
    </div>
  </div>
</body>
</html>`;
}

function generateWarmLeadEmail(data: LeadNotificationRequest): string {
  const { leadData, leadScore, aiAnalysis, diagnosticContext } = data;
  const companyName = leadData.organisation || leadData.company || 'Unknown Company';
  const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); border-radius: 16px 16px 0 0; padding: 24px; text-align: center;">
      <div style="font-size: 36px; margin-bottom: 8px;">💼</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Warm Lead</h1>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 28px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Lead Info -->
      <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 22px;">${leadData.name}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Email:</td>
          <td style="padding: 6px 0; color: #1f2937; font-size: 14px;"><a href="mailto:${leadData.email}" style="color: #2563eb;">${leadData.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Role:</td>
          <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">${leadData.role || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Company:</td>
          <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">${companyName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Score:</td>
          <td style="padding: 6px 0; color: #2563eb; font-size: 14px; font-weight: 600;">${leadScore.score}/100 (WARM)</td>
        </tr>
      </table>

      ${leadData.message ? `
      <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">Message:</p>
        <p style="color: #1f2937; font-size: 14px; margin: 0; line-height: 1.5;">${leadData.message}</p>
      </div>
      ` : ''}

      ${diagnosticContext ? `
      <div style="background: #eff6ff; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
        <p style="margin: 0; color: #1e40af; font-size: 13px;">📊 ${diagnosticContext}</p>
      </div>
      ` : ''}

      <!-- AI Analysis -->
      <div style="border-left: 3px solid #3b82f6; padding-left: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">🤖 AI Analysis:</h3>
        <div style="color: #4b5563; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${aiAnalysis}</div>
      </div>

      <!-- Next Action -->
      <div style="background: #fef3c7; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
        <p style="margin: 0; color: #92400e; font-size: 13px;"><strong>📋 Next Action:</strong> ${leadScore.nextAction}</p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center;">
        <a href="mailto:${leadData.email}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Send Email</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px; color: #6b7280; font-size: 11px;">
      <p style="margin: 0;">Lead captured: ${timestamp} | Source: ${leadData.source}</p>
    </div>
  </div>
</body>
</html>`;
}

function generateLaurenNotificationEmail(data: LeadNotificationRequest): string {
  const { leadData, leadScore } = data;
  
  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
  <h2 style="color: #dc2626;">🔥 Hot Lead Alert</h2>
  <p>Hi Lauren,</p>
  <p>A hot lead just came in that needs immediate attention:</p>
  <ul style="line-height: 1.8;">
    <li><strong>Name:</strong> ${leadData.name}</li>
    <li><strong>Email:</strong> ${leadData.email}</li>
    <li><strong>Score:</strong> ${leadScore.score}/100</li>
    <li><strong>Source:</strong> ${leadData.source}</li>
  </ul>
  <p>Please ensure Kevin has seen this and follows up within 2 hours.</p>
  <p>Thanks!<br>Lead Scoring System</p>
</body>
</html>`;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: LeadNotificationRequest = await req.json();
    const { leadData, leadScore } = data;

    // Only send emails for hot and warm leads
    if (leadScore.temperature === 'cool') {
      return new Response(
        JSON.stringify({ message: "Cool lead - no email sent, logged to database only" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const companyName = leadData.organisation || leadData.company || 'Unknown Company';
    const emailsSent: string[] = [];

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const sendEmail = async (to: string, subject: string, html: string) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Lead Alerts <alerts@leadershipbydesign.co>",
          to,
          subject,
          html,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend error:", response.status, errorText);
        throw new Error(`Failed to send email: ${response.status}`);
      }
      return response.json();
    };

    if (leadScore.temperature === 'hot') {
      // Send detailed email to Kevin
      await sendEmail(
        "kevin@kevinbritz.com",
        `🔥 HOT LEAD: ${leadData.name} from ${companyName}`,
        generateHotLeadEmail(data)
      );
      emailsSent.push("kevin@kevinbritz.com");

      // Send notification to Lauren
      await sendEmail(
        "lauren@kevinbritz.com",
        `🔥 Hot Lead Alert - ${leadData.name}`,
        generateLaurenNotificationEmail(data)
      );
      emailsSent.push("lauren@kevinbritz.com");

    } else if (leadScore.temperature === 'warm') {
      // Send email to Kevin only
      await sendEmail(
        "kevin@kevinbritz.com",
        `💼 Warm Lead: ${leadData.name}`,
        generateWarmLeadEmail(data)
      );
      emailsSent.push("kevin@kevinbritz.com");
    }

    console.log(`Lead notification sent for ${leadData.name} (${leadScore.temperature}) to: ${emailsSent.join(', ')}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${leadScore.temperature.toUpperCase()} lead notification sent`,
        emailsSent 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error sending lead notification:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
