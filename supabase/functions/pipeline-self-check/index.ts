import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Pipeline Self-Check — runs daily at 06:55 SAST (04:55 UTC)
 * 5 minutes before auto-outreach fires at 07:00 SAST
 * 
 * Checks:
 * 1. Is warm_outreach_queue empty? If yes → trigger Apollo import
 * 2. Are there bad records (score 0 or generic emails)? If yes → purge
 * 3. Are cron jobs healthy? If any missed → alert #system-health
 */

const GENERIC_PREFIXES = [
  "info", "admin", "support", "hello", "contact", "sales", "enquiries",
  "reception", "office", "no-reply", "noreply", "webmaster", "marketing",
  "news", "careers", "hr", "jobs", "media", "press", "feedback",
  "compliance", "legal", "service", "help", "team", "group", "corporate",
  "accounts", "billing", "general", "queries", "operations", "procurement",
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const actions: string[] = [];
    const alerts: string[] = [];

    // ── CHECK 1: Is the queue empty? ──
    const { count: pendingCount } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .not('contact_email', 'is', null)
      .neq('contact_email', '');

    if (!pendingCount || pendingCount === 0) {
      actions.push('Queue empty — triggering Apollo import');
      try {
        await fetch(`${supabaseUrl}/functions/v1/apollo-prospect-import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ triggered_by: 'pipeline-self-check' }),
        });
        actions.push('Apollo import triggered successfully');
      } catch (e) {
        alerts.push(`Failed to trigger Apollo import: ${e instanceof Error ? e.message : String(e)}`);
      }
    } else {
      actions.push(`Queue has ${pendingCount} pending prospects — no refill needed`);
    }

    // ── CHECK 2: Purge bad records ──
    // Remove score 0 records
    const { data: zeroScore } = await supabase
      .from('warm_outreach_queue')
      .select('id')
      .eq('status', 'pending')
      .eq('score', 0);

    if (zeroScore && zeroScore.length > 0) {
      await supabase
        .from('warm_outreach_queue')
        .delete()
        .eq('status', 'pending')
        .eq('score', 0);
      actions.push(`Purged ${zeroScore.length} records with score 0`);
    }

    // Remove generic email records
    const { data: pendingRecords } = await supabase
      .from('warm_outreach_queue')
      .select('id, contact_email')
      .eq('status', 'pending')
      .not('contact_email', 'is', null);

    let genericPurged = 0;
    if (pendingRecords) {
      const genericIds = pendingRecords
        .filter(r => {
          if (!r.contact_email) return false;
          const prefix = r.contact_email.split('@')[0]?.toLowerCase();
          return GENERIC_PREFIXES.some(g => prefix === g || prefix.startsWith(g + '.'));
        })
        .map(r => r.id);

      if (genericIds.length > 0) {
        await supabase
          .from('warm_outreach_queue')
          .delete()
          .in('id', genericIds);
        genericPurged = genericIds.length;
        actions.push(`Purged ${genericPurged} generic email records`);
      }
    }

    // ── CHECK 3: Cron health ──
    // Check if key functions ran in the last 25 hours by looking at data freshness
    const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();

    // Check if any outreach was sent recently (indicates auto-outreach is working)
    const { count: recentEmails } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .gte('email_sent_at', twentyFiveHoursAgo);

    // Check if any new prospects were added recently
    const { count: recentProspects } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', twentyFiveHoursAgo);

    if (!recentProspects || recentProspects === 0) {
      alerts.push('No new prospects added in 25h — scraper/Apollo may have stalled');
    }

    // Build summary
    const summary = [
      '🔍 *Pipeline Self-Check Complete*',
      '',
      ...actions.map(a => `• ${a}`),
      alerts.length > 0 ? '\n⚠️ *Alerts:*' : '',
      ...alerts.map(a => `• ${a}`),
    ].filter(Boolean).join('\n');

    // Post to appropriate channel
    const channel = alerts.length > 0 ? 'system-health' : 'mission-control';
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel,
          eventType: 'system_error',
          data: { function: '🔍 Pipeline Self-Check', error: summary },
        }),
      });
    } catch { /* best effort */ }

    // If there are critical alerts, also post to #system-health
    if (alerts.length > 0 && channel !== 'system-health') {
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: 'system-health',
            eventType: 'system_error',
            data: { function: '🔍 Pipeline Self-Check', error: alerts.join('\n') },
          }),
        });
      } catch { /* best effort */ }
    }

    console.log('✅ Pipeline self-check complete');
    return new Response(JSON.stringify({ success: true, actions, alerts }), { headers });

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('pipeline-self-check error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers });
  }
});
