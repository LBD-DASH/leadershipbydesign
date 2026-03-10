import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Weekly Pipeline Report — Monday 06:00 SAST (04:00 UTC)
 * Comprehensive pipeline health check posted to #mission-control
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const dateStr = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // ── SOURCES THIS WEEK ──
    // Apollo prospects
    const { count: apolloCount } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .ilike('source_keyword', '%apollo%')
      .gte('created_at', sevenDaysAgo);

    // Dux-Soup prospects
    const { count: duxsoupCount } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .ilike('source_keyword', '%duxsoup%')
      .gte('created_at', sevenDaysAgo);

    // Firecrawl / auto-pipeline
    const { count: firecrawlCount } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .or('source_keyword.ilike.%firecrawl%,source_keyword.ilike.%signal-search%,source_keyword.ilike.%auto-pipeline%,source_keyword.ilike.%migrated%')
      .gte('created_at', sevenDaysAgo);

    // Diagnostic completions
    const { count: diagnosticCount } = await supabase
      .from('diagnostic_submissions')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    // ── OUTREACH THIS WEEK ──
    const { data: outreachData } = await supabase
      .from('warm_outreach_queue')
      .select('status, booked_at')
      .gte('email_sent_at', sevenDaysAgo);

    const emailsSent = outreachData?.length || 0;
    const replied = outreachData?.filter(r => ['replied', 'interested', 'booked'].includes(r.status)).length || 0;
    const interested = outreachData?.filter(r => ['interested', 'booked'].includes(r.status)).length || 0;
    const booked = outreachData?.filter(r => r.status === 'booked' || r.booked_at).length || 0;
    const replyRate = emailsSent > 0 ? Math.round((replied / emailsSent) * 100) : 0;

    // ── QUEUE STATUS ──
    const { count: qPending } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: qEmailed } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'emailed');

    const { count: qInterested } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'interested');

    const { count: qBooked } = await supabase
      .from('warm_outreach_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'booked');

    // ── CRON HEALTH ──
    // Check cron job count
    const { data: cronJobs } = await supabase.rpc('get_cron_job_count').catch(() => ({ data: null }));
    const cronCount = cronJobs || 'unknown';

    // ── BUILD ISSUES ──
    const issues: string[] = [];
    if ((apolloCount || 0) === 0 && (duxsoupCount || 0) === 0 && (firecrawlCount || 0) === 0) {
      issues.push('No new prospects from any source this week');
    }
    if (emailsSent === 0) {
      issues.push('Zero outreach emails sent this week');
    }
    if ((qPending || 0) === 0) {
      issues.push('Queue is empty — needs refill');
    }

    // ── FORMAT MESSAGE ──
    const message = [
      `📊 *Weekly Pipeline Report — ${dateStr}*`,
      '',
      '*SOURCES THIS WEEK*',
      `Apollo: ${apolloCount || 0} prospects added`,
      `Dux-Soup: ${duxsoupCount || 0} connections → queue`,
      `Firecrawl: ${firecrawlCount || 0} prospects added`,
      `Diagnostic completions: ${diagnosticCount || 0}`,
      '',
      '*OUTREACH THIS WEEK*',
      `Emails sent: ${emailsSent}`,
      `Reply rate: ${replyRate}%`,
      `Interested: ${interested} | Booked: ${booked}`,
      '',
      '*QUEUE STATUS*',
      `Pending: ${qPending || 0} | Emailed: ${qEmailed || 0} | Interested: ${qInterested || 0} | Booked: ${qBooked || 0}`,
      '',
      issues.length > 0 ? `*⚠️ ACTION NEEDED:*\n${issues.map(i => `• ${i}`).join('\n')}` : '✅ All systems nominal',
    ].join('\n');

    // Post to #mission-control
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: 'mission-control',
          eventType: 'system_error',
          data: { function: '📊 Weekly Pipeline Report', error: message },
        }),
      });
    } catch (e) {
      console.error('Slack error:', e);
    }

    console.log('✅ Weekly pipeline report sent');
    return new Response(JSON.stringify({ success: true, message }), { headers });

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('weekly-pipeline-report error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers });
  }
});
