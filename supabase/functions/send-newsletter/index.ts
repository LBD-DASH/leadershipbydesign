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

    const { subject, body_html, tag_filter } = await req.json();
    if (!subject || !body_html) {
      return new Response(JSON.stringify({ error: 'Subject and body_html are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch ALL active subscribers with pagination
    const PAGE_SIZE = 1000;
    let subscribers: { email: string; name: string | null }[] = [];
    let from = 0;
    let keepGoing = true;

    while (keepGoing) {
      let query = supabase
        .from('email_subscribers')
        .select('email, name')
        .eq('status', 'active')
        .range(from, from + PAGE_SIZE - 1);

      if (tag_filter) {
        query = query.contains('tags', [tag_filter]);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      subscribers = subscribers.concat(data || []);
      if (!data || data.length < PAGE_SIZE) keepGoing = false;
      else from += PAGE_SIZE;
    }

    if (subscribers.length === 0) {
      return new Response(JSON.stringify({ error: 'No active subscribers found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create newsletter record
    const { data: newsletter, error: insertError } = await supabase
      .from('newsletter_sends')
      .insert({
        subject,
        body_html,
        recipient_count: subscribers.length,
        status: 'sending',
        sent_by: 'admin',
        tag_filter: tag_filter || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Build unsubscribe base URL
    const projectUrl = supabaseUrl.replace('.supabase.co', '');
    const unsubscribeBaseUrl = `${supabaseUrl}/functions/v1/unsubscribe`;

    // Send in batches via Resend
    let totalSent = 0;
    const batchSize = 50; // Keep under Resend limits

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      // Send individually for personalized unsubscribe links
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
      .eq('id', newsletter.id);

    return new Response(JSON.stringify({
      success: true,
      recipient_count: totalSent,
      newsletter_id: newsletter.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
