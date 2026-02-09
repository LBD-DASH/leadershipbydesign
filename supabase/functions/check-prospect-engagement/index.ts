import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface EngagementRequest {
  email?: string;
  utmCampaign?: string;
  diagnosticType: string;
  diagnosticScores?: Record<string, number>;
  submissionId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, utmCampaign, diagnosticType, diagnosticScores, submissionId } = await req.json() as EngagementRequest;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let prospectId: string | null = null;
    let matchType: string = '';

    // Try to match by UTM campaign first (most reliable)
    if (utmCampaign && utmCampaign.startsWith('prospect_')) {
      prospectId = utmCampaign.replace('prospect_', '');
      matchType = 'utm_tracking';
      console.log(`Matched prospect by UTM: ${prospectId}`);
    }
    
    // Fallback: match by email
    if (!prospectId && email) {
      const { data: prospectByEmail } = await supabase
        .from('prospect_companies')
        .select('id')
        .eq('contact_email', email)
        .single();
      
      if (prospectByEmail) {
        prospectId = prospectByEmail.id;
        matchType = 'email_match';
        console.log(`Matched prospect by email: ${prospectId}`);
      }
    }

    if (!prospectId) {
      console.log('No prospect match found');
      return new Response(
        JSON.stringify({ success: true, matched: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify prospect exists
    const { data: prospect, error: prospectError } = await supabase
      .from('prospect_companies')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (prospectError || !prospect) {
      console.log('Prospect not found:', prospectId);
      return new Response(
        JSON.stringify({ success: true, matched: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Updating prospect ${prospect.company_name} to engaged status`);

    // Update prospect to engaged status
    const { error: updateError } = await supabase
      .from('prospect_companies')
      .update({
        status: 'engaged',
        engaged_at: new Date().toISOString(),
        engagement_source: `${diagnosticType}_diagnostic`,
        updated_at: new Date().toISOString()
      })
      .eq('id', prospectId);

    if (updateError) {
      console.error('Failed to update prospect:', updateError);
    }

    // Update any active sequences to engaged status
    await supabase
      .from('prospect_sequences')
      .update({
        status: 'engaged',
        updated_at: new Date().toISOString()
      })
      .eq('prospect_id', prospectId)
      .eq('status', 'active');

    // Send notification to Kevin
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (RESEND_API_KEY) {
      const dashboardUrl = `https://leadershipbydesign.lovable.app/marketing?action=view&prospect=${prospectId}`;
      
      // Format diagnostic scores
      const scoresHtml = diagnosticScores 
        ? Object.entries(diagnosticScores)
            .map(([key, value]) => `<li>${key}: ${value}%</li>`)
            .join('')
        : '<li>Scores not available</li>';

      const notificationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">🔥 Hot Lead Alert!</h1>
          <p style="font-size: 18px;">
            <strong>${prospect.contact_name || 'A contact'}</strong> from <strong>${prospect.company_name}</strong> 
            just completed the ${diagnosticType.toUpperCase()} Diagnostic!
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          
          <h2 style="font-size: 16px; margin-bottom: 8px;">Contact Details</h2>
          <ul style="padding-left: 20px;">
            <li><strong>Name:</strong> ${prospect.contact_name || 'Not provided'}</li>
            <li><strong>Email:</strong> ${prospect.contact_email || 'Not provided'}</li>
            <li><strong>Company:</strong> ${prospect.company_name}</li>
            <li><strong>Industry:</strong> ${prospect.industry || 'Unknown'}</li>
            <li><strong>Role:</strong> ${prospect.contact_role || 'Unknown'}</li>
          </ul>
          
          <h2 style="font-size: 16px; margin-bottom: 8px;">Diagnostic Scores</h2>
          <ul style="padding-left: 20px;">
            ${scoresHtml}
          </ul>
          
          <h2 style="font-size: 16px; margin-bottom: 8px;">Match Type</h2>
          <p>${matchType === 'utm_tracking' ? 'Tracked via outreach email click' : 'Matched by email address'}</p>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          
          <p style="text-align: center;">
            <a href="${dashboardUrl}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
              View Prospect Details
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This prospect clicked through from an outreach email and self-qualified by completing your diagnostic. 
            They're showing strong buying signals — consider reaching out within 24 hours.
          </p>
        </div>
      `;

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Leadership by Design <hello@leadershipbydesign.co>',
            to: ['kevin@kevinbritz.com', 'lauren@kevinbritz.com'],
            subject: `🔥 HOT LEAD: ${prospect.contact_name || 'Contact'} from ${prospect.company_name} completed ${diagnosticType} diagnostic`,
            html: notificationHtml,
          }),
        });
        console.log('Hot lead notification sent');
      } catch (emailError) {
        console.error('Failed to send notification:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        matched: true,
        prospectId,
        companyName: prospect.company_name,
        matchType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking prospect engagement:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to check engagement';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
