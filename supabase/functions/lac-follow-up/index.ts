import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * LAC Diagnostic Follow-Up Sequence Processor
 * 
 * Processes automated email follow-ups for Leader as Coach assessments.
 * Triggered by cron at 08:30 SAST daily.
 * 
 * Sequence varies by version (hr_leader vs manager) and profile.
 */

interface SequenceEmail {
  subject: string;
  body: string;
  delay_days: number;
}

function getHRLeaderSequence(profile: string, name: string, company: string, score: number, lowestAreas: string[]): SequenceEmail[] {
  const lowestStr = lowestAreas.slice(0, 3).join(', ');

  if (profile === 'the_operator' || score <= 35) {
    return [
      {
        subject: `Your coaching readiness results — ${company || 'your organisation'}`,
        body: `${name || 'Hi'},\n\nYour management layer scored ${score}/75 — The Operator profile.\n\nThat means your managers are running on control, not coaching. Here's what that's costing you specifically — your lowest scoring areas were: ${lowestStr}.\n\nThe 90-Day Manager Coaching Accelerator is built exactly for this profile. I'd like to show you what changes in 90 days.\n\nBook a Discovery Call — 30 minutes:\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin Britz\nLeadership by Design`,
        delay_days: 0,
      },
      {
        subject: 'The real cost of a non-coaching management layer',
        body: `${name || 'Hi'},\n\nYour lowest scoring area was ${lowestAreas[0] || 'coaching capability'}. In most organisations I work with, this single gap drives disengagement, talent loss, and escalation culture.\n\nWorth a 30-minute conversation to see what 90 days could change?\n\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin`,
        delay_days: 3,
      },
      {
        subject: 'What 30+ organisations did about this',
        body: `${name || 'Hi'},\n\n4,000+ leaders. 30+ organisations. 11 years.\n\nThe pattern is always the same — managers promoted for technical excellence, struggling to develop people.\n\nThe 90-Day Manager Coaching Accelerator installs the system that fixes it.\n\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin`,
        delay_days: 7,
      },
    ];
  }

  if (profile === 'the_emerging_coach' || (score > 35 && score <= 55)) {
    return [
      {
        subject: `Your results — you're closer than you think`,
        body: `${name || 'Hi'},\n\nYour score of ${score}/75 puts you in The Emerging Coach profile. Your managers show coaching capability — but it's inconsistent.\n\nThe 90-Day Manager Coaching Accelerator makes coaching structural, not personality-dependent.\n\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin`,
        delay_days: 0,
      },
      {
        subject: 'Why coaching capability stays inconsistent without a system',
        body: `${name || 'Hi'},\n\nThe gap between a manager who coaches sometimes and a management layer that coaches consistently? A system.\n\nThat's exactly what the 90-day accelerator installs.\n\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin`,
        delay_days: 4,
      },
      {
        subject: 'Ready to make it systematic?',
        body: `${name || 'Hi'},\n\nIf installing consistent coaching capability across your management layer is on the agenda, I'd welcome 30 minutes to show you how.\n\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin`,
        delay_days: 9,
      },
    ];
  }

  // Ready Organisation (56-75)
  return [
    {
      subject: `Your results — strong foundation, one critical question`,
      body: `${name || 'Hi'},\n\nYour score of ${score}/75 puts you in The Ready Organisation profile. You have the coaching culture foundation.\n\nThe question now is whether it's structured, measurable, and scalable — or whether it's dependent on a few key individuals.\n\nThat distinction is worth a conversation.\n\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin`,
      delay_days: 0,
    },
    {
      subject: 'The difference between coaching culture and coaching system',
      body: `${name || 'Hi'},\n\nHaving coaching values is one thing. Having coaching infrastructure — where it's measured, embedded, and survives staff turnover — is another.\n\nWorth 30 minutes to explore which one you have?\n\nhttps://leadershipbydesign.co/leader-as-coach\n\nKevin`,
      delay_days: 5,
    },
  ];
}

function getManagerSequence(name: string, score: number, lowestAreas: string[]): SequenceEmail[] {
  return [
    {
      subject: `Your coaching readiness profile — ${score}/75`,
      body: `${name || 'Hi'},\n\nThe fact that you took this assessment says something important about your self-awareness.\n\nYour score of ${score}/75 isn't a personal judgement — it's an organisational signal. The gap between managing tasks and developing people is usually a system problem, not a skills problem.\n\nIf your HR or L&D lead would find these results useful, I can send them a version formatted for organisational assessment.\n\nJust reply with their email and I'll send it across.\n\nKevin`,
      delay_days: 0,
    },
    {
      subject: 'One thing that would move your score most',
      body: `${name || 'Hi'},\n\nYour lowest scoring area was ${lowestAreas[0] || 'coaching conversations'}. One practical shift: next time someone brings you a problem, ask "What have you considered?" before offering your solution.\n\nSmall change. Big signal to your team that you're developing, not just directing.\n\nKevin`,
      delay_days: 4,
    },
  ];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active LAC nurture sequences that need sending
    const now = new Date();
    const { data: sequences, error: seqError } = await supabase
      .from('diagnostic_nurture_sequences')
      .select('*')
      .eq('diagnostic_type', 'lac')
      .eq('status', 'active')
      .lte('next_send_at', now.toISOString())
      .order('next_send_at', { ascending: true })
      .limit(30); // Max 30 per run for deliverability

    if (seqError) throw seqError;
    if (!sequences?.length) {
      return new Response(JSON.stringify({ success: true, processed: 0, message: 'No LAC sequences due' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let sent = 0;
    let completed = 0;
    let errors = 0;

    for (const seq of sequences) {
      try {
        // Get the original assessment
        const { data: assessment } = await supabase
          .from('leader_as_coach_assessments')
          .select('*')
          .eq('id', seq.diagnostic_submission_id)
          .single();

        if (!assessment || !seq.lead_email) {
          await supabase.from('diagnostic_nurture_sequences').update({ status: 'completed' }).eq('id', seq.id);
          completed++;
          continue;
        }

        // Check if they've booked a call (stop condition)
        const { data: booking } = await supabase
          .from('bookings')
          .select('id')
          .eq('prospect_email', seq.lead_email)
          .limit(1);

        if (booking?.length) {
          await supabase.from('diagnostic_nurture_sequences').update({ status: 'stopped_booked' }).eq('id', seq.id);
          completed++;
          continue;
        }

        const version = assessment.version || 'hr_leader';
        const lowestAreas = Array.isArray(assessment.lowest_areas) 
          ? assessment.lowest_areas.map((a: any) => typeof a === 'string' ? a : a?.area || a?.name || '')
          : [];

        const emails = version === 'manager'
          ? getManagerSequence(seq.lead_name || '', assessment.total_score, lowestAreas)
          : getHRLeaderSequence(assessment.profile, seq.lead_name || '', assessment.company || '', assessment.total_score, lowestAreas);

        const stepIndex = seq.current_step - 1;
        if (stepIndex >= emails.length) {
          await supabase.from('diagnostic_nurture_sequences').update({ status: 'completed' }).eq('id', seq.id);
          completed++;
          continue;
        }

        const email = emails[stepIndex];

        // Send via Resend
        const sendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: 'Kevin Britz <kevin@leadershipbydesign.co>',
            to: [seq.lead_email],
            subject: email.subject,
            text: email.body,
          }),
        });

        if (!sendRes.ok) {
          const errText = await sendRes.text();
          console.error(`Failed to send LAC follow-up to ${seq.lead_email}: ${errText}`);
          errors++;
          continue;
        }

        sent++;

        // Calculate next step
        const nextStep = seq.current_step + 1;
        if (nextStep > emails.length) {
          await supabase.from('diagnostic_nurture_sequences').update({
            current_step: nextStep,
            status: 'completed',
            updated_at: now.toISOString(),
          }).eq('id', seq.id);
          completed++;
        } else {
          const nextEmail = emails[nextStep - 1];
          const nextSendAt = new Date(now.getTime() + nextEmail.delay_days * 24 * 60 * 60 * 1000);
          // Ensure 08:00 SAST (06:00 UTC)
          nextSendAt.setUTCHours(6, 0, 0, 0);

          await supabase.from('diagnostic_nurture_sequences').update({
            current_step: nextStep,
            next_send_at: nextSendAt.toISOString(),
            updated_at: now.toISOString(),
          }).eq('id', seq.id);
        }
      } catch (err) {
        console.error(`Error processing sequence ${seq.id}:`, err);
        errors++;
      }
    }

    // Slack summary
    if (sent > 0) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: 'leads-and-signups',
            eventType: 'system_error',
            data: {
              function: '📧 LAC Follow-Up Sequences',
              error: `Sent: ${sent} | Completed: ${completed} | Errors: ${errors}`,
            },
          }),
        });
      } catch { /* best effort */ }
    }

    console.log(`✅ LAC follow-up: ${sent} sent, ${completed} completed, ${errors} errors`);
    return new Response(JSON.stringify({ success: true, sent, completed, errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('lac-follow-up error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
