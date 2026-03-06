import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const BOOKING_LINK = 'https://calendar.app.google/vFHzgHMvUqU6vzgv6';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find sequences due for sending
    const now = new Date();
    const { data: sequences, error: seqErr } = await supabase
      .from('diagnostic_nurture_sequences')
      .select('*')
      .eq('status', 'active')
      .lte('next_send_at', now.toISOString())
      .order('next_send_at', { ascending: true })
      .limit(20);

    if (seqErr || !sequences || sequences.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No sequences due' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const seq of sequences) {
      try {
        const email = getEmailForStep(seq.current_step, seq.lead_name, seq.diagnostic_type, seq.primary_result);

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kevin Britz <hello@leadershipbydesign.co>',
            to: [seq.lead_email],
            subject: email.subject,
            html: email.html,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          errors.push(`${seq.lead_email}: ${err}`);
          continue;
        }

        sentCount++;

        // Schedule next step or complete
        if (seq.current_step >= 5) {
          await supabase.from('diagnostic_nurture_sequences')
            .update({ status: 'completed', updated_at: now.toISOString() })
            .eq('id', seq.id);
        } else {
          const nextStep = seq.current_step + 1;
          const daysMap: Record<number, number> = { 1: 2, 2: 2, 3: 3, 4: 4 };
          const daysToAdd = daysMap[seq.current_step] || 3;
          const nextSend = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
          nextSend.setUTCHours(6, 0, 0, 0); // 8 AM SAST

          await supabase.from('diagnostic_nurture_sequences')
            .update({
              current_step: nextStep,
              next_send_at: nextSend.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq('id', seq.id);
        }

        await new Promise(r => setTimeout(r, 1500));
      } catch (err) {
        errors.push(`${seq.id}: ${err}`);
      }
    }

    return new Response(JSON.stringify({ success: true, sent: sentCount, errors: errors.length > 0 ? errors : undefined }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getEmailForStep(step: number, name: string, diagnosticType: string, primaryResult: string) {
  const firstName = (name || 'there').split(' ')[0];
  const diagnosticLabel = diagnosticType === 'team' ? 'Team Diagnostic' :
    diagnosticType === 'leadership' ? 'Leadership Diagnostic' :
    diagnosticType === 'shift' ? 'SHIFT Diagnostic' :
    diagnosticType === 'ai_readiness' ? 'AI Readiness Diagnostic' : 'Diagnostic';

  switch (step) {
    case 1: return {
      subject: `Your ${diagnosticLabel} Results + Next Steps`,
      html: wrapHtml(`
        <h2>Hi ${firstName},</h2>
        <p>Thank you for completing the ${diagnosticLabel}. Your primary result was: <strong>${primaryResult}</strong>.</p>
        <p>Most leaders who score similarly tell us they've been sensing this gap for a while — but haven't had a clear framework to address it.</p>
        <p>I'd love to walk you through what your results mean in practice and map out 2-3 quick wins you can implement this week.</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${BOOKING_LINK}" style="background:#3A7CA5;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Book Your Free Strategy Call</a>
        </p>
        <p>It's a free 20-minute conversation — no strings attached.</p>
        <p>— Kevin Britz<br>Leadership by Design</p>
      `)
    };
    case 2: return {
      subject: `Most leaders score similarly on the ${diagnosticLabel}`,
      html: wrapHtml(`
        <h2>Hi ${firstName},</h2>
        <p>You're not alone — most leaders who take the ${diagnosticLabel} discover the same pattern: <strong>${primaryResult}</strong>.</p>
        <p>The good news? This is one of the most addressable challenges in leadership development. In our experience, teams that tackle this directly see measurable improvement within 90 days.</p>
        <p>Here's what typically works:</p>
        <ul>
          <li>A structured conversation about what's actually happening (not what we think is happening)</li>
          <li>2-3 targeted interventions based on observable behaviour</li>
          <li>A clear 90-day roadmap with checkpoints</li>
        </ul>
        <p style="text-align:center;margin:30px 0;">
          <a href="${BOOKING_LINK}" style="background:#3A7CA5;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Let's Map Out Your Next Steps</a>
        </p>
        <p>— Kevin</p>
      `)
    };
    case 3: return {
      subject: `How one team turned their diagnostic results into 40% productivity gains`,
      html: wrapHtml(`
        <h2>Hi ${firstName},</h2>
        <p>A financial services company took the same diagnostic you did. Their primary gap? Very similar to yours.</p>
        <p>Within 90 days of starting a targeted programme:</p>
        <ul>
          <li>40% increase in team productivity</li>
          <li>50% reduction in internal conflict</li>
          <li>35% faster decision-making</li>
        </ul>
        <p>The difference wasn't magic — it was having a clear framework and expert guidance to implement it.</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${BOOKING_LINK}" style="background:#3A7CA5;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Book a Free Strategy Call</a>
        </p>
        <p>— Kevin</p>
      `)
    };
    case 4: return {
      subject: `A practical offer for your team, ${firstName}`,
      html: wrapHtml(`
        <h2>Hi ${firstName},</h2>
        <p>I've been thinking about your ${diagnosticLabel} results. Here's what I'd like to offer:</p>
        <p><strong>A free 20-minute strategy call</strong> where I'll:</p>
        <ol>
          <li>Walk through what your results actually mean in practice</li>
          <li>Share 2-3 quick wins you can implement this week</li>
          <li>Outline a clear path from where you are to where you want to be</li>
        </ol>
        <p>No pressure, no obligation. If you find value in the conversation, we can explore next steps. If not, you'll walk away with actionable insights.</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${BOOKING_LINK}" style="background:#3A7CA5;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Book Your Strategy Call</a>
        </p>
        <p>— Kevin</p>
      `)
    };
    case 5: return {
      subject: `Last chance: Free strategy call for ${firstName}`,
      html: wrapHtml(`
        <h2>Hi ${firstName},</h2>
        <p>This is my last note about your ${diagnosticLabel} results.</p>
        <p>I won't keep following up, but I wanted to leave this open: if you decide you want to address what the diagnostic revealed, you can always book a free strategy call here:</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${BOOKING_LINK}" style="background:#3A7CA5;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Book a Free Strategy Call</a>
        </p>
        <p>In the meantime, here are some free resources:</p>
        <ul>
          <li><a href="https://leadershipbydesign.lovable.app/shift-methodology">SHIFT Methodology™</a></li>
          <li><a href="https://leadershipbydesign.lovable.app/programmes">Our Programmes</a></li>
        </ul>
        <p>Wishing you and your team all the best.</p>
        <p>— Kevin Britz<br>Leadership by Design</p>
      `)
    };
    default: return {
      subject: `Follow-up from Leadership by Design`,
      html: wrapHtml(`<p>Hi ${firstName}, just checking in. <a href="${BOOKING_LINK}">Book a call</a> if you'd like to chat.</p>`)
    };
  }
}

function wrapHtml(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;line-height:1.6;">
${body}
<hr style="margin-top:40px;border:none;border-top:1px solid #e5e5e5;">
<p style="font-size:12px;color:#999;">Leadership by Design · South Africa<br>
<a href="https://leadershipbydesign.lovable.app/unsubscribe" style="color:#999;">Unsubscribe</a></p>
</body></html>`;
}
