import { createClient } from "npm:@supabase/supabase-js@2";

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/slack/api';
const MAX_REWRITES = 3;
const DEFAULT_OWNER_EMAIL = 'kevin@kevinbritz.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type NewsletterPayload = {
  id: string;
  subject: string;
  body_html: string;
  recipient_count?: number | null;
  status?: string | null;
  sent_at?: string | null;
  pain_point_topic?: string | null;
  service_referenced?: string | null;
  rewrite_rounds?: number | null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const { action, newsletter_id, feedback, target_email } = body as {
      action: 'approve' | 'reject' | 'check_timeouts' | 'resend_owner_copy';
      newsletter_id?: string;
      feedback?: string;
      target_email?: string;
    };

    // --- CHECK TIMEOUTS: called by cron/scheduled function ---
    if (action === 'check_timeouts') {
      const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

      const { data: timedOut } = await supabase
        .from('newsletter_sends')
        .select('id, subject, rewrite_rounds, pain_point_topic')
        .eq('status', 'pending_approval')
        .eq('approval_status', 'pending')
        .lt('created_at', fourHoursAgo)
        .limit(5);

      if (!timedOut || timedOut.length === 0) {
        return json({ success: true, message: 'No timed-out newsletters' });
      }

      for (const nl of timedOut) {
        const currentRound = (nl.rewrite_rounds || 0) + 1;

        if (currentRound > MAX_REWRITES) {
          // Max rewrites reached — flag for manual input
          await supabase.from('newsletter_sends').update({
            status: 'needs_manual_input',
            approval_status: 'rejected',
          }).eq('id', nl.id);

          // Notify Slack
          await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
            body: JSON.stringify({
              eventType: 'newsletter_manual_needed',
              data: { subject: nl.subject, rounds: currentRound, newsletterId: nl.id },
            }),
          });
          continue;
        }

        // Auto-rewrite: mark as rejected and trigger new generation
        await supabase.from('newsletter_sends').update({
          approval_status: 'timeout_rejected',
          status: 'rewriting',
        }).eq('id', nl.id);

        // Trigger rewrite
        await fetch(`${supabaseUrl}/functions/v1/generate-ai-newsletter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
          body: JSON.stringify({
            rewrite_round: currentRound,
            feedback: '',
            previous_pain_point: nl.pain_point_topic || '',
            newsletter_id: nl.id,
          }),
        });
      }

      return json({ success: true, processed: timedOut.length });
    }

    // --- RESEND OWNER COPY ---
    if (action === 'resend_owner_copy' && newsletter_id) {
      const { data: nl } = await supabase
        .from('newsletter_sends')
        .select('id, subject, body_html, recipient_count, status, sent_at')
        .eq('id', newsletter_id)
        .single();

      if (!nl) return json({ error: 'Newsletter not found' }, 404);

      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

      const { ownerEmail } = await sendOwnerCopy({
        supabaseUrl,
        resendApiKey: RESEND_API_KEY,
        newsletter: nl,
        targetEmail: target_email,
      });

      return json({
        success: true,
        message: `Owner copy sent to ${ownerEmail}`,
        newsletter_id,
      });
    }

    // --- APPROVE ---
    if (action === 'approve' && newsletter_id) {
      const { data: nl } = await supabase
        .from('newsletter_sends')
        .select('*')
        .eq('id', newsletter_id)
        .single();

      if (!nl) return json({ error: 'Newsletter not found' }, 404);
      if (nl.approval_status === 'approved') return json({ message: 'Already approved' });

      // Mark as approved and sending
      await supabase.from('newsletter_sends').update({
        approval_status: 'approved',
        status: 'sending',
      }).eq('id', newsletter_id);

      // Send to all active subscribers
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

      // Fetch ALL subscribers
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

      console.log(`Sending newsletter to ${allSubscribers.length} subscribers...`);

      const unsubscribeBaseUrl = `${supabaseUrl}/functions/v1/unsubscribe`;
      const trackBaseUrl = `${supabaseUrl}/functions/v1/track-newsletter`;
      let totalSent = 0;

      for (let i = 0; i < allSubscribers.length; i += 50) {
        const batch = allSubscribers.slice(i, i + 50);

        const promises = batch.map(async (sub) => {
          const unsubscribeUrl = `${unsubscribeBaseUrl}?email=${encodeURIComponent(sub.email)}`;
          const openPixel = `${trackBaseUrl}?nid=${newsletter_id}&email=${encodeURIComponent(sub.email)}&event=open`;

          let personalizedHtml = nl.body_html.replace('{{UNSUBSCRIBE_URL}}', unsubscribeUrl);
          personalizedHtml = personalizedHtml.replace('</body>',
            `<img src="${openPixel}" width="1" height="1" style="display:none;" alt="" /></body>`
          );

          // Click tracking for LBD links
          personalizedHtml = personalizedHtml.replace(
            /href="(https:\/\/www\.leadershipbydesign\.co[^"]*)"/g,
            (_match: string, url: string) => {
              const trackUrl = `${trackBaseUrl}?nid=${newsletter_id}&email=${encodeURIComponent(sub.email)}&event=click&url=${encodeURIComponent(url)}`;
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
              subject: nl.subject,
              html: personalizedHtml,
              reply_to: 'kevin@kevinbritz.com',
            }),
          });
          if (res.ok) totalSent++;
        });
        await Promise.all(promises);
      }

      // Update record with send results
      await supabase.from('newsletter_sends').update({
        status: 'sent',
        recipient_count: totalSent,
        sent_at: new Date().toISOString(),
      }).eq('id', newsletter_id);

      // Send monitoring copy to owner inbox
      try {
        const { ownerEmail } = await sendOwnerCopy({
          supabaseUrl,
          resendApiKey: RESEND_API_KEY,
          newsletter: nl,
          deliveredCount: totalSent,
          totalSubscribers: allSubscribers.length,
        });
        console.log(`Owner monitoring copy sent to ${ownerEmail}`);
      } catch (ownerErr) {
        console.error('Owner monitoring copy failed:', ownerErr);
      }

      // Log to Slack
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
        body: JSON.stringify({
          eventType: 'newsletter_approved',
          data: {
            subject: nl.subject,
            recipientCount: totalSent,
            painPoint: nl.pain_point_topic,
            serviceReferenced: nl.service_referenced,
            rewriteRounds: nl.rewrite_rounds || 0,
          },
        }),
      });

      console.log(`Newsletter sent to ${totalSent} subscribers. Rewrite rounds: ${nl.rewrite_rounds || 0}`);
      return json({ success: true, sent: totalSent, rewrite_rounds: nl.rewrite_rounds || 0 });
    }

    // --- REJECT (with optional feedback) ---
    if (action === 'reject' && newsletter_id) {
      const { data: nl } = await supabase
        .from('newsletter_sends')
        .select('id, subject, rewrite_rounds, pain_point_topic')
        .eq('id', newsletter_id)
        .single();

      if (!nl) return json({ error: 'Newsletter not found' }, 404);

      const currentRound = (nl.rewrite_rounds || 0) + 1;

      if (currentRound > MAX_REWRITES) {
        // Max rewrites reached
        await supabase.from('newsletter_sends').update({
          status: 'needs_manual_input',
          approval_status: 'rejected',
          rewrite_feedback: feedback || null,
        }).eq('id', newsletter_id);

        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
          body: JSON.stringify({
            eventType: 'newsletter_manual_needed',
            data: { subject: nl.subject, rounds: currentRound, newsletterId: nl.id },
          }),
        });

        return json({ success: true, message: 'Max rewrites reached. Flagged for manual input.' });
      }

      // Mark as rejected and trigger rewrite
      await supabase.from('newsletter_sends').update({
        approval_status: 'rejected',
        status: 'rewriting',
        rewrite_feedback: feedback || null,
      }).eq('id', newsletter_id);

      // Trigger rewrite generation
      await fetch(`${supabaseUrl}/functions/v1/generate-ai-newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
        body: JSON.stringify({
          rewrite_round: currentRound,
          feedback: feedback || '',
          previous_pain_point: nl.pain_point_topic || '',
          newsletter_id: newsletter_id,
        }),
      });

      return json({ success: true, message: `Rewrite triggered (round ${currentRound})` });
    }

    return json({ error: 'Invalid action. Use: approve, reject, check_timeouts, resend_owner_copy' }, 400);
  } catch (error) {
    console.error('newsletter-approval-handler error:', error);
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

async function sendOwnerCopy({
  supabaseUrl,
  resendApiKey,
  newsletter,
  deliveredCount,
  totalSubscribers,
  targetEmail,
}: {
  supabaseUrl: string;
  resendApiKey: string;
  newsletter: NewsletterPayload;
  deliveredCount?: number;
  totalSubscribers?: number;
  targetEmail?: string;
}) {
  const ownerEmail = targetEmail || Deno.env.get('OWNER_EMAIL') || DEFAULT_OWNER_EMAIL;

  const deliverySummary =
    typeof deliveredCount === 'number' && typeof totalSubscribers === 'number'
      ? `${deliveredCount}/${totalSubscribers} delivered`
      : `${newsletter.recipient_count ?? 0} delivered`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Leadership by Design <hello@leadershipbydesign.co>',
      to: [ownerEmail],
      subject: `[SENT COPY] ${newsletter.subject} — ${deliverySummary}`,
      html: `<p><strong>Delivery Report:</strong> ${deliverySummary}</p><hr/>${newsletter.body_html}`,
      reply_to: 'kevin@kevinbritz.com',
    }),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Owner copy send failed [${response.status}]: ${responseText}`);
  }

  return { ownerEmail };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
