import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 1x1 transparent GIF
const PIXEL_GIF = new Uint8Array([
  71,73,70,56,57,97,1,0,1,0,128,0,0,255,255,255,0,0,0,33,249,4,0,0,0,0,0,44,0,0,0,0,1,0,1,0,0,2,2,68,1,0,59
]);

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const newsletterId = url.searchParams.get('nid');
    const email = url.searchParams.get('email');
    const event = url.searchParams.get('event') || 'open';
    const redirectUrl = url.searchParams.get('url');

    if (!newsletterId || !email) {
      if (event === 'click' && redirectUrl) {
        return Response.redirect(redirectUrl, 302);
      }
      return new Response(PIXEL_GIF, { headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the tracking event (fire and forget)
    const userAgent = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '';

    supabase
      .from('newsletter_tracking')
      .insert({
        newsletter_id: newsletterId,
        recipient_email: email,
        event_type: event,
        link_url: redirectUrl || null,
        user_agent: userAgent.slice(0, 500),
        ip_address: ip.split(',')[0]?.trim() || null,
      })
      .then(({ error }) => {
        if (error) console.error('Tracking insert error:', error.message);
      });

    // Update conversion_insights counters (non-blocking)
    if (event === 'open' || event === 'click') {
      const column = event === 'open' ? 'total_opens' : 'total_clicks';
      supabase.rpc('increment_conversion_insight', { p_newsletter_id: newsletterId, p_column: column })
        .then(({ error }) => {
          if (error) {
            // Fallback: direct update if RPC doesn't exist yet
            console.error('Conversion insight update error:', error.message);
          }
        });
    }

    // Traction threshold check (non-blocking)
    if (newsletterId) {
      (async () => {
        try {
          const { data: newsletter } = await supabase
            .from('newsletter_sends')
            .select('subject, recipient_count, slack_open_alert_sent, slack_click_alert_sent')
            .eq('id', newsletterId)
            .single();

          if (!newsletter || !newsletter.recipient_count) return;

          const { count: openCount } = await supabase
            .from('newsletter_tracking')
            .select('*', { count: 'exact', head: true })
            .eq('newsletter_id', newsletterId)
            .eq('event_type', 'open');

          const { count: clickCount } = await supabase
            .from('newsletter_tracking')
            .select('*', { count: 'exact', head: true })
            .eq('newsletter_id', newsletterId)
            .eq('event_type', 'click');

          const openRate = Math.round(((openCount || 0) / newsletter.recipient_count) * 100);
          const clickRate = openCount ? Math.round(((clickCount || 0) / (openCount || 1)) * 100) : 0;

          // Update conversion_insights with computed rates
          await supabase
            .from('conversion_insights')
            .update({
              total_opens: openCount || 0,
              total_clicks: clickCount || 0,
              open_rate: openRate,
              click_rate: clickRate,
            })
            .eq('newsletter_id', newsletterId);

          // Open rate threshold: 40%
          if (openRate >= 40 && !newsletter.slack_open_alert_sent) {
            await supabase.from('newsletter_sends').update({ slack_open_alert_sent: true }).eq('id', newsletterId);
            fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
              body: JSON.stringify({
                eventType: 'traction_alert',
                data: { subject: newsletter.subject, metric: 'Open Rate', value: `${openRate}%`, recipients: newsletter.recipient_count },
              }),
            }).catch(e => console.error('Slack traction error:', e));
          }

          // Click threshold: 50
          if ((clickCount || 0) >= 50 && !newsletter.slack_click_alert_sent) {
            await supabase.from('newsletter_sends').update({ slack_click_alert_sent: true }).eq('id', newsletterId);
            fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
              body: JSON.stringify({
                eventType: 'traction_alert',
                data: { subject: newsletter.subject, metric: 'Click Count', value: `${clickCount} clicks`, recipients: newsletter.recipient_count },
              }),
            }).catch(e => console.error('Slack traction error:', e));
          }
        } catch (e) {
          console.error('Traction check error:', e);
        }
      })();
    }

    // Click → redirect to destination
    if (event === 'click' && redirectUrl) {
      return Response.redirect(redirectUrl, 302);
    }

    // Open → return tracking pixel
    return new Response(PIXEL_GIF, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('track-newsletter error:', error);
    const url = new URL(req.url);
    const redirectUrl = url.searchParams.get('url');
    if (redirectUrl) return Response.redirect(redirectUrl, 302);
    return new Response(PIXEL_GIF, { headers: { 'Content-Type': 'image/gif' } });
  }
});
