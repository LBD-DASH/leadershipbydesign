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
      // Still return pixel/redirect to not break email
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
    // Still return something useful
    const url = new URL(req.url);
    const redirectUrl = url.searchParams.get('url');
    if (redirectUrl) return Response.redirect(redirectUrl, 302);
    return new Response(PIXEL_GIF, { headers: { 'Content-Type': 'image/gif' } });
  }
});
