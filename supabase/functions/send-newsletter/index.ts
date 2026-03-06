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

    console.log(`📧 Total active subscribers fetched: ${subscribers.length}`);

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
    const unsubscribeBaseUrl = `${supabaseUrl}/functions/v1/unsubscribe`;

    // Use Resend Batch API to send up to 100 emails per batch call
    // Resend batch endpoint: POST /emails/batch (max 100 per call)
    let totalSent = 0;
    let totalFailed = 0;
    const failedEmails: string[] = [];
    const BATCH_SIZE = 100;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const emailPayloads = batch.map((sub) => {
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

        return {
          from: 'Leadership by Design <hello@leadershipbydesign.co>',
          to: [sub.email],
          subject,
          html: personalizedHtml,
        };
      });

      try {
        const res = await fetch('https://api.resend.com/emails/batch', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayloads),
        });

        const resBody = await res.text();

        if (res.ok) {
          totalSent += batch.length;
          console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: sent ${batch.length} emails`);
        } else {
          totalFailed += batch.length;
          console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed [${res.status}]: ${resBody}`);
          failedEmails.push(...batch.map(b => b.email));

          // If we hit rate limit (429), wait and retry once
          if (res.status === 429) {
            console.log('⏳ Rate limited — waiting 10s before retry...');
            await new Promise(r => setTimeout(r, 10000));

            const retryRes = await fetch('https://api.resend.com/emails/batch', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(emailPayloads),
            });

            if (retryRes.ok) {
              totalSent += batch.length;
              totalFailed -= batch.length;
              console.log(`✅ Retry batch ${Math.floor(i / BATCH_SIZE) + 1}: sent ${batch.length} emails`);
            } else {
              const retryBody = await retryRes.text();
              console.error(`❌ Retry also failed [${retryRes.status}]: ${retryBody}`);
            }
          }
        }
      } catch (batchErr: any) {
        totalFailed += batch.length;
        console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} exception: ${batchErr.message}`);
      }

      // Small delay between batches to avoid rate limits
      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    // Send monitoring copy to owner
    const ownerEmail = Deno.env.get('OWNER_EMAIL') || 'hello@leadershipbydesign.co';
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Leadership by Design <hello@leadershipbydesign.co>',
          to: [ownerEmail],
          subject: `[SENT COPY] ${subject} — ${totalSent}/${subscribers.length} delivered`,
          html: `<p><strong>Delivery Report:</strong> ${totalSent} sent, ${totalFailed} failed out of ${subscribers.length} subscribers.</p><hr/>${body_html}`,
        }),
      });
    } catch (_) {}

    // Update newsletter record
    await supabase
      .from('newsletter_sends')
      .update({
        status: totalFailed > 0 ? 'partial' : 'sent',
        recipient_count: totalSent,
        sent_at: new Date().toISOString(),
      })
      .eq('id', newsletter.id);

    console.log(`📊 Newsletter complete: ${totalSent} sent, ${totalFailed} failed out of ${subscribers.length} total`);

    return new Response(JSON.stringify({
      success: true,
      total_subscribers: subscribers.length,
      sent: totalSent,
      failed: totalFailed,
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
