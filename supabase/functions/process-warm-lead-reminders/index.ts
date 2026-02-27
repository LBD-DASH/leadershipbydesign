import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function buildReminderEmail(
  leadName: string,
  leadCompany: string,
  leadEmail: string,
  leadPhone: string | null,
  stage: 'day_2' | 'day_5' | 'day_10',
): { subject: string; html: string } {
  const company = leadCompany || 'their company';

  if (stage === 'day_2') {
    return {
      subject: `Day 2 Follow-Up Due: ${leadName} from ${company}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
  <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 8px 0; color: #92400e;">⏰ Day 2 Follow-Up Due</h2>
    <p style="margin: 0; color: #78350f;">No reply yet from <strong>${leadName}</strong> at <strong>${company}</strong>.</p>
  </div>
  
  <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Contact Details</p>
    <p style="margin: 0;">📧 <a href="mailto:${leadEmail}">${leadEmail}</a></p>
    ${leadPhone ? `<p style="margin: 4px 0 0 0;">📞 <a href="tel:${leadPhone}">${leadPhone}</a></p>` : ''}
  </div>

  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
    <p style="margin: 0 0 8px 0; color: #1e40af; font-weight: 600;">📋 Ready-to-send follow-up:</p>
    <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #374151; line-height: 1.6;">Hi ${leadName},</p>
      <br/>
      <p style="margin: 0; color: #374151; line-height: 1.6;">Just circling back on my note from earlier. I know things move fast — if now isn't right, happy to send a short overview you can review when it suits.</p>
      <br/>
      <p style="margin: 0; color: #374151;">Kevin</p>
    </div>
  </div>

  <div style="text-align: center;">
    <a href="mailto:${leadEmail}?subject=Quick%20follow-up" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reply to ${leadName}</a>
  </div>

  <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 20px;">Leadership by Design — Warm Lead 2-5-10 Cadence</p>
</body>
</html>`,
    };
  }

  if (stage === 'day_5') {
    return {
      subject: `Day 5 — ${leadName} still hasn't replied`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
  <div style="background: #fed7aa; border: 2px solid #f97316; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 8px 0; color: #9a3412;">📅 Day 5 — Mid-Point Nudge</h2>
    <p style="margin: 0; color: #7c2d12;"><strong>${leadName}</strong> from <strong>${company}</strong> hasn't responded.</p>
  </div>

  <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Contact Details</p>
    <p style="margin: 0;">📧 <a href="mailto:${leadEmail}">${leadEmail}</a></p>
    ${leadPhone ? `<p style="margin: 4px 0 0 0;">📞 <a href="tel:${leadPhone}">${leadPhone}</a></p>` : ''}
  </div>

  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
    <p style="margin: 0; color: #1e40af; font-weight: 600;">💡 Try a different angle:</p>
    <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
      <li>Share a relevant case study</li>
      <li>Send a diagnostic link they can try</li>
      <li>Reference a recent leadership insight</li>
    </ul>
  </div>

  <div style="text-align: center;">
    <a href="mailto:${leadEmail}" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Follow Up with ${leadName}</a>
  </div>

  <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 20px;">Leadership by Design — Warm Lead 2-5-10 Cadence</p>
</body>
</html>`,
    };
  }

  // day_10
  return {
    subject: `Final Follow-Up Due: ${leadName} from ${company}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
  <div style="background: #fecaca; border: 2px solid #ef4444; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 8px 0; color: #991b1b;">🚨 Day 10 — Final Follow-Up</h2>
    <p style="margin: 0; color: #7f1d1d;">This is the last structured touchpoint for <strong>${leadName}</strong>. After this, they move to long-term nurture.</p>
  </div>

  <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Contact Details</p>
    <p style="margin: 0;">📧 <a href="mailto:${leadEmail}">${leadEmail}</a></p>
    ${leadPhone ? `<p style="margin: 4px 0 0 0;">📞 <a href="tel:${leadPhone}">${leadPhone}</a></p>` : ''}
  </div>

  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
    <p style="margin: 0 0 8px 0; color: #1e40af; font-weight: 600;">📋 Suggested final message:</p>
    <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #374151; line-height: 1.6;">Hi ${leadName},</p>
      <br/>
      <p style="margin: 0; color: #374151; line-height: 1.6;">I don't want to crowd your inbox — just wanted to leave the door open. If leadership development becomes a priority, I'm here.</p>
      <br/>
      <p style="margin: 0; color: #374151; line-height: 1.6;">Happy to pick this up whenever the timing is right.</p>
      <br/>
      <p style="margin: 0; color: #374151;">Kevin</p>
    </div>
  </div>

  <div style="text-align: center;">
    <a href="mailto:${leadEmail}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Send Final Follow-Up</a>
  </div>

  <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 20px;">Leadership by Design — Warm Lead 2-5-10 Cadence</p>
</body>
</html>`,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const supabase = createClient(supabaseUrl, serviceKey);
    const now = new Date().toISOString();

    // Fetch sequences with due reminders
    const { data: dueSequences, error } = await supabase
      .from('warm_lead_sequences')
      .select('*')
      .in('status', ['contacted', 'day_2_sent', 'day_5_sent', 'day_10_sent'])
      .lte('next_reminder_at', now);

    if (error) throw error;
    if (!dueSequences || dueSequences.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let processed = 0;

    for (const seq of dueSequences) {
      try {
        if (seq.status === 'contacted') {
          // Day 2 reminder
          const email = buildReminderEmail(seq.lead_name, seq.lead_company, seq.lead_email, seq.lead_phone, 'day_2');
          await sendEmail(RESEND_API_KEY, email.subject, email.html);
          await supabase.from('warm_lead_sequences').update({
            status: 'day_2_sent',
            next_reminder_at: addDays(new Date(seq.contacted_at), 5).toISOString(),
          }).eq('id', seq.id);

        } else if (seq.status === 'day_2_sent') {
          // Day 5 reminder
          const email = buildReminderEmail(seq.lead_name, seq.lead_company, seq.lead_email, seq.lead_phone, 'day_5');
          await sendEmail(RESEND_API_KEY, email.subject, email.html);
          await supabase.from('warm_lead_sequences').update({
            status: 'day_5_sent',
            next_reminder_at: addDays(new Date(seq.contacted_at), 10).toISOString(),
          }).eq('id', seq.id);

        } else if (seq.status === 'day_5_sent') {
          // Day 10 reminder
          const email = buildReminderEmail(seq.lead_name, seq.lead_company, seq.lead_email, seq.lead_phone, 'day_10');
          await sendEmail(RESEND_API_KEY, email.subject, email.html);
          await supabase.from('warm_lead_sequences').update({
            status: 'day_10_sent',
            next_reminder_at: addDays(new Date(seq.contacted_at), 11).toISOString(),
          }).eq('id', seq.id);

        } else if (seq.status === 'day_10_sent') {
          // Auto-dormant
          await supabase.from('warm_lead_sequences').update({
            status: 'dormant',
            dormant_at: now,
            next_reminder_at: null,
          }).eq('id', seq.id);
        }

        processed++;
      } catch (e) {
        console.error(`Failed to process sequence ${seq.id}:`, e);
      }
    }

    console.log(`Processed ${processed} warm lead reminders`);

    return new Response(JSON.stringify({ processed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('process-warm-lead-reminders error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendEmail(apiKey: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Lead Alerts <alerts@leadershipbydesign.co>',
      to: ['kevin@kevinbritz.com'],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend error:', res.status, errText);
    throw new Error(`Resend failed: ${res.status}`);
  }
}
