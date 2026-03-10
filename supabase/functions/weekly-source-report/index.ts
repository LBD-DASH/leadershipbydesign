import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Weekly Source Performance Report
 * Runs Monday 07:00 SAST — posts to #mission-control
 * Aggregates prospect data by source for the past 7 days
 */

function classifySource(val: string): string {
  const lower = (val || '').toLowerCase();
  if (lower.includes('apollo')) return 'Apollo';
  if (lower.includes('duxsoup') || lower.includes('dux-soup')) return 'Dux-Soup';
  if (lower.includes('firecrawl') || lower.includes('signal-search') || lower.includes('auto-pipeline')) return 'Firecrawl';
  if (lower.includes('assessment') || lower.includes('diagnostic')) return 'Diagnostic';
  if (lower.includes('contact') || lower.includes('form')) return 'Contact Form';
  return 'Other';
}

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

    // Fetch outreach queue records from last 7 days
    const { data: outreach } = await supabase
      .from('warm_outreach_queue')
      .select('source_keyword, status, booked_at')
      .gte('created_at', sevenDaysAgo);

    // Fetch call list records from last 7 days
    const { data: callList } = await supabase
      .from('call_list_prospects')
      .select('source, status, call_outcome')
      .gte('created_at', sevenDaysAgo);

    // Aggregate by source
    const buckets: Record<string, { added: number; contacted: number; replied: number; interested: number; booked: number }> = {};

    const ensure = (key: string) => {
      if (!buckets[key]) buckets[key] = { added: 0, contacted: 0, replied: 0, interested: 0, booked: 0 };
    };

    (outreach || []).forEach(r => {
      const src = classifySource(r.source_keyword || '');
      ensure(src);
      buckets[src].added++;
      if (['emailed', 'followed_up', 'replied', 'interested', 'booked'].includes(r.status)) buckets[src].contacted++;
      if (['replied', 'interested', 'booked'].includes(r.status)) buckets[src].replied++;
      if (['interested', 'booked'].includes(r.status)) buckets[src].interested++;
      if (r.status === 'booked' || r.booked_at) buckets[src].booked++;
    });

    (callList || []).forEach(r => {
      const src = classifySource(r.source || '');
      ensure(src);
      buckets[src].added++;
      if (r.status === 'called' || r.call_outcome) buckets[src].contacted++;
      if (r.call_outcome === 'interested') buckets[src].interested++;
      if (r.call_outcome === 'booked') buckets[src].booked++;
    });

    // Build summary lines
    const lines: string[] = [];
    let topSource = '';
    let topRate = 0;

    for (const [source, data] of Object.entries(buckets)) {
      const replyPct = data.contacted > 0 ? Math.round((data.replied / data.contacted) * 100) : 0;
      lines.push(`${source}: ${data.added} added | ${replyPct}% reply | ${data.interested} interested`);
      
      const intRate = data.added > 0 ? data.interested / data.added : 0;
      if (intRate > topRate && data.added >= 3) {
        topRate = intRate;
        topSource = source;
      }
    }

    if (lines.length === 0) {
      lines.push('No new prospects added this week.');
    }

    const totalAdded = Object.values(buckets).reduce((s, b) => s + b.added, 0);
    const totalInterested = Object.values(buckets).reduce((s, b) => s + b.interested, 0);

    const message = [
      '📊 *Weekly Source Performance*',
      `_${new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}_`,
      '',
      ...lines,
      '',
      `Total: ${totalAdded} prospects | ${totalInterested} interested`,
      topSource ? `🏆 Top performer this week: *${topSource}*` : '',
    ].filter(Boolean).join('\n');

    // Post to Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: 'mission-control',
          eventType: 'system_error',
          data: {
            function: '📊 Weekly Source Report',
            error: message,
          },
        }),
      });
    } catch (e) {
      console.error('Slack error:', e);
    }

    console.log('✅ Weekly source report sent');
    return new Response(JSON.stringify({ success: true, sources: buckets, message }), { headers });

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('weekly-source-report error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers });
  }
});
