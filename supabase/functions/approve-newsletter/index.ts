import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const action = url.searchParams.get('action'); // 'approve' or 'reject'

    if (!token || !action || !['approve', 'reject'].includes(action)) {
      return new Response(htmlPage('Invalid Request', 'Missing or invalid parameters.'), {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find newsletter by approval token
    const { data: newsletter, error: findError } = await supabase
      .from('newsletter_sends')
      .select('*')
      .eq('approval_token', token)
      .single();

    if (findError || !newsletter) {
      return new Response(htmlPage('Not Found', 'Newsletter not found or token expired.'), {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (newsletter.approval_status !== 'pending') {
      return new Response(htmlPage('Already Processed', `This newsletter was already ${newsletter.approval_status}.`), {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (action === 'reject') {
      await supabase
        .from('newsletter_sends')
        .update({ approval_status: 'rejected', status: 'rejected' })
        .eq('id', newsletter.id);

      return new Response(htmlPage('Newsletter Rejected ❌', 'The newsletter has been rejected and will not be sent.'), {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // APPROVE — send to all subscribers
    console.log(`Approving newsletter ${newsletter.id}: "${newsletter.subject}"`);

    await supabase
      .from('newsletter_sends')
      .update({ approval_status: 'approved', status: 'sending' })
      .eq('id', newsletter.id);

    // Fetch ALL active subscribers — approved newsletters go to the entire contact list
    const PAGE_SIZE = 1000;
    let allSubscribers: { email: string; name: string | null }[] = [];
    let from = 0;
    let keepGoing = true;

    while (keepGoing) {
      const { data } = await supabase
        .from('email_subscribers')
        .select('email, name')
        .eq('status', 'active')
        .range(from, from + PAGE_SIZE - 1);

      allSubscribers = allSubscribers.concat(data || []);
      if (!data || data.length < PAGE_SIZE) keepGoing = false;
      else from += PAGE_SIZE;
    }

    console.log(`Sending to ${allSubscribers.length} subscribers...`);

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const unsubscribeBaseUrl = `${supabaseUrl}/functions/v1/unsubscribe`;
    const trackBaseUrl = `${supabaseUrl}/functions/v1/track-newsletter`;
    let totalSent = 0;

    // Send in batches
    for (let i = 0; i < allSubscribers.length; i += 50) {
      const batch = allSubscribers.slice(i, i + 50);

      const promises = batch.map(async (sub) => {
        const unsubscribeUrl = `${unsubscribeBaseUrl}?email=${encodeURIComponent(sub.email)}`;
        const openPixel = `${trackBaseUrl}?nid=${newsletter.id}&email=${encodeURIComponent(sub.email)}&event=open`;

        // Replace unsubscribe placeholder and add tracking pixel
        let personalizedHtml = newsletter.body_html
          .replace('{{UNSUBSCRIBE_URL}}', unsubscribeUrl);

        // Add tracking pixel before closing body
        personalizedHtml = personalizedHtml.replace('</body>', 
          `<img src="${openPixel}" width="1" height="1" style="display:none;" alt="" /></body>`
        );

        // Wrap links with click tracking
        personalizedHtml = personalizedHtml.replace(
          /href="(https:\/\/leadershipbydesign\.lovable\.app[^"]*)"/g,
          (match, url) => {
            const trackUrl = `${trackBaseUrl}?nid=${newsletter.id}&email=${encodeURIComponent(sub.email)}&event=click&url=${encodeURIComponent(url)}`;
            return `href="${trackUrl}"`;
          }
        );

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Leadership by Design <hello@leadershipbydesign.co>',
            to: [sub.email],
            subject: newsletter.subject,
            html: personalizedHtml,
            reply_to: 'kevin@kevinbritz.com',
          }),
        });

        if (res.ok) totalSent++;
      });

      await Promise.all(promises);
    }

    // Update record
    await supabase
      .from('newsletter_sends')
      .update({
        status: 'sent',
        recipient_count: totalSent,
        sent_at: new Date().toISOString(),
      })
      .eq('id', newsletter.id);

    console.log(`Newsletter sent to ${totalSent} subscribers.`);

    return new Response(htmlPage(
      'Newsletter Approved & Sent ✅',
      `"${newsletter.subject}" has been sent to <strong>${totalSent}</strong> subscribers. All replies will go directly to kevin@kevinbritz.com.`
    ), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('approve-newsletter error:', error);
    return new Response(htmlPage('Error', error instanceof Error ? error.message : 'Unknown error'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
});

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  body { font-family: Georgia, serif; background: #f4f4f4; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
  .card { background: #fff; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
  h1 { color: #1a1a2e; font-size: 24px; margin-bottom: 16px; }
  p { color: #555; font-size: 16px; line-height: 1.6; }
  .brand { color: #c8a97e; font-size: 13px; margin-top: 24px; }
</style>
</head><body>
<div class="card">
  <h1>${title}</h1>
  <p>${message}</p>
  <p class="brand">Leadership by Design</p>
</div>
</body></html>`;
}
