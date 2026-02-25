import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the oldest scheduled draft
    const { data: draft, error: draftError } = await supabase
      .from('newsletter_sends')
      .select('*')
      .eq('status', 'scheduled')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (draftError || !draft) {
      console.log('No scheduled newsletters found');
      return new Response(JSON.stringify({ message: 'No scheduled newsletters to send' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { subject, body_html, tag_filter } = draft;

    // Fetch active subscribers
    let query = supabase
      .from('email_subscribers')
      .select('email, name')
      .eq('status', 'active');

    if (tag_filter) {
      query = query.contains('tags', [tag_filter]);
    }

    const { data: subscribers, error: fetchError } = await query;
    if (fetchError) throw fetchError;
    if (!subscribers || subscribers.length === 0) {
      await supabase
        .from('newsletter_sends')
        .update({ status: 'failed' })
        .eq('id', draft.id);
      return new Response(JSON.stringify({ error: 'No active subscribers found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update status to sending
    await supabase
      .from('newsletter_sends')
      .update({ status: 'sending' })
      .eq('id', draft.id);

    const unsubscribeBaseUrl = `${supabaseUrl}/functions/v1/unsubscribe`;

    let totalSent = 0;
    const batchSize = 50;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const sendPromises = batch.map(async (sub) => {
        const unsubscribeUrl = `${unsubscribeBaseUrl}?email=${encodeURIComponent(sub.email)}`;
        const personalizedHtml = `
          ${body_html}
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 12px; color: #999;">
            <p>Leadership by Design • hello@leadershipbydesign.co</p>
            <p style="margin-top: 4px;">
              <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        `;

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Leadership by Design <hello@leadershipbydesign.co>',
            to: [sub.email],
            subject,
            html: personalizedHtml,
          }),
        });

        if (res.ok) totalSent++;
      });

      await Promise.all(sendPromises);
    }

    // Update newsletter record
    await supabase
      .from('newsletter_sends')
      .update({
        status: 'sent',
        recipient_count: totalSent,
        sent_at: new Date().toISOString(),
      })
      .eq('id', draft.id);

    console.log(`Weekly newsletter sent: "${subject}" to ${totalSent} contacts`);

    return new Response(JSON.stringify({
      success: true,
      recipient_count: totalSent,
      newsletter_id: draft.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Weekly newsletter error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
