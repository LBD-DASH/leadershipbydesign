import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface OutreachRequest {
  prospectId: string;
  subject: string;
  body: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prospectId, subject, body } = await req.json() as OutreachRequest;

    if (!prospectId || !subject || !body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Prospect ID, subject, and body are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get prospect details
    const { data: prospect, error: prospectError } = await supabase
      .from('prospect_companies')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (prospectError || !prospect) {
      console.error('Prospect not found:', prospectError);
      return new Response(
        JSON.stringify({ success: false, error: 'Prospect not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const recipientEmail = prospect.contact_email;
    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ success: false, error: 'No contact email found for this prospect. Research the company first to extract email.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add unsubscribe link for POPIA compliance
    const unsubscribeUrl = `https://leadershipbydesign.lovable.app/unsubscribe?id=${prospectId}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${body.replace(/\n/g, '<br>')}
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          This email was sent by Leadership by Design. 
          <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a> from future emails.
        </p>
      </div>
    `;

    // Send email via Resend
    console.log('Sending email to:', recipientEmail);
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Leadership by Design <hello@leadershipbydesign.co>',
        to: [recipientEmail],
        subject: subject,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend API error:', emailResult);
      return new Response(
        JSON.stringify({ success: false, error: emailResult.message || 'Failed to send email' }),
        { status: emailResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', emailResult.id);

    // Record the outreach in the database
    const { error: outreachError } = await supabase
      .from('prospect_outreach')
      .insert({
        prospect_id: prospectId,
        email_subject: subject,
        email_body: body,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

    if (outreachError) {
      console.error('Failed to record outreach:', outreachError);
      // Don't fail the request - email was sent successfully
    }

    // Update prospect status to contacted
    await supabase
      .from('prospect_companies')
      .update({ 
        status: 'contacted',
        contacted_at: new Date().toISOString(),
      })
      .eq('id', prospectId);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending outreach:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send outreach';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
