import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function requireRole(req: Request, allowedRoles: string[] = ['admin']): Promise<Response | null> {
  const h = { ...corsHeaders, 'Content-Type': 'application/json' };
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: h });
  const token = auth.replace('Bearer ', '');
  if (token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) return null;
  const c = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error } = await c.auth.getUser();
  if (error || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: h });
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: roles } = await db.from('user_roles').select('role').eq('user_id', user.id).in('role', allowedRoles);
  if (!roles || roles.length === 0) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: h });
  return null;
}

/**
 * Apollo Call Queue Engine
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authErr = await requireRole(req, ['admin', 'call_centre']);
    if (authErr) return authErr;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let body: any = {};
    try { body = await req.json(); } catch (_) {}

    const { action = 'get_queue' } = body;

    // ACTION: get_queue — return sorted call queue
    if (action === 'get_queue') {
      const { agent_name, limit = 50 } = body;

      // Get active leads sorted by priority
      let query = supabase
        .from('apollo_sequence_tracking')
        .select('*')
        .in('status', ['active'])
        .not('has_bounced', 'eq', true)
        .order('priority_score', { ascending: false })
        .order('last_activity_at', { ascending: false, nullsFirst: false })
        .limit(limit);

      const { data: queue, error } = await query;
      if (error) throw error;

      // Format for agent display
      const formattedQueue = (queue || []).map(item => {
        const steps = (item.email_steps as any[]) || [];
        
        return {
          id: item.id,
          // Contact info
          name: item.contact_name,
          email: item.contact_email,
          company: item.contact_company,
          title: item.contact_title,
          phone: '', // Would come from call_list or Apollo
          
          // Why we emailed
          sequence_name: item.apollo_sequence_name,
          offer_type: item.offer_type,
          industry: item.industry_tag,
          campaign_intent: item.campaign_intent,
          
          // What they received
          emails_sent: steps.map((s: any) => ({
            step: s.step,
            subject: s.subject,
            sent_at: s.sent_at,
            opened: s.opened,
            clicked: s.clicked,
            replied: s.replied,
          })),
          current_step: item.current_step,
          total_steps: item.sequence_total_steps,
          
          // Engagement
          total_opens: item.total_opens,
          total_clicks: item.total_clicks,
          total_replies: item.total_replies,
          last_activity: item.last_activity_at,
          
          // Priority
          priority_score: item.priority_score,
          priority_reason: item.priority_reason,
          
          // Suggested action
          suggested_opener: item.suggested_opener,
          
          // Assignment
          assigned_agent: item.assigned_agent,
          assigned_at: item.assigned_at,
          called_at: item.called_at,
          call_outcome: item.call_outcome,
        };
      });

      // Stats
      const totalInQueue = formattedQueue.length;
      const hotLeads = formattedQueue.filter(q => q.priority_score >= 70).length;
      const warmLeads = formattedQueue.filter(q => q.priority_score >= 40 && q.priority_score < 70).length;

      return new Response(JSON.stringify({
        queue: formattedQueue,
        stats: { total: totalInQueue, hot: hotLeads, warm: warmLeads },
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ACTION: assign — assign a lead to an agent
    if (action === 'assign') {
      const { lead_id, agent_name } = body;
      if (!lead_id || !agent_name) {
        return new Response(JSON.stringify({ error: 'lead_id and agent_name required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase
        .from('apollo_sequence_tracking')
        .update({ assigned_agent: agent_name, assigned_at: new Date().toISOString() })
        .eq('id', lead_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ACTION: complete_call — log call outcome
    if (action === 'complete_call') {
      const { lead_id, outcome, notes } = body;
      if (!lead_id || !outcome) {
        return new Response(JSON.stringify({ error: 'lead_id and outcome required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const statusMap: Record<string, string> = {
        'booked': 'completed',
        'interested': 'active',
        'not_interested': 'completed',
        'no_answer': 'active',
        'callback': 'active',
        'wrong_number': 'completed',
      };

      const { error } = await supabase
        .from('apollo_sequence_tracking')
        .update({
          called_at: new Date().toISOString(),
          call_outcome: outcome,
          call_notes: notes || null,
          status: statusMap[outcome] || 'active',
          // Reset priority for callbacks, increase for no-answer
          priority_score: outcome === 'callback' ? 60 : outcome === 'no_answer' ? 30 : 0,
        })
        .eq('id', lead_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ACTION: recalculate — recalculate all priority scores
    if (action === 'recalculate') {
      const { data: active, error: fetchErr } = await supabase
        .from('apollo_sequence_tracking')
        .select('*')
        .eq('status', 'active')
        .eq('has_bounced', false);

      if (fetchErr) throw fetchErr;

      let updated = 0;
      for (const item of (active || [])) {
        let score = 0;
        let reason = '';
        const replies = item.total_replies || 0;
        const opens = item.total_opens || 0;
        const clicks = item.total_clicks || 0;
        const step = item.current_step || 0;
        const finished = item.sequence_finished;

        if (replies > 0) { score = 100; reason = 'REPLIED — Call immediately'; }
        else if (opens >= 2) { score = 80; reason = `Opened ${opens}x — High interest`; }
        else if (clicks > 0) { score = 70; reason = 'Clicked link — Engaged'; }
        else if (finished) { score = 50; reason = 'Sequence complete, no reply — Final call attempt'; }
        else if (step >= 2) { score = 40; reason = `After email step ${step} — Time to call`; }
        else { score = 10; reason = 'In sequence — monitoring'; }

        // Time decay: boost if recent activity
        if (item.last_activity_at) {
          const hoursSince = (Date.now() - new Date(item.last_activity_at).getTime()) / (1000 * 60 * 60);
          if (hoursSince < 2) score += 10;
          else if (hoursSince < 24) score += 5;
        }

        // Generate opener if missing
        let opener = item.suggested_opener;
        if (!opener && score >= 40) {
          const steps = (item.email_steps as any[]) || [];
          const lastSubject = steps.length > 0 ? steps[steps.length - 1].subject : '';
          const firstName = (item.contact_name || '').split(' ')[0] || 'there';
          const seqLower = (item.apollo_sequence_name || '').toLowerCase();
          
          let topic = 'leadership development';
          if (seqLower.includes('shift')) topic = 'the SHIFT methodology';
          else if (seqLower.includes('coach')) topic = 'the Leader as Coach programme';
          else if (seqLower.includes('performance')) topic = 'manager performance';

          const industry = item.industry_tag ? ` in ${item.industry_tag}` : '';
          opener = `"Hi ${firstName}, you would have received an email from Kevin about ${topic}${industry} — I'm just following up to see if that's relevant for your team right now."`;
        }

        await supabase
          .from('apollo_sequence_tracking')
          .update({ priority_score: score, priority_reason: reason, suggested_opener: opener })
          .eq('id', item.id);

        updated++;
      }

      return new Response(JSON.stringify({ success: true, recalculated: updated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Call queue error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
