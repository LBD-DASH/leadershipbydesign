import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const since = oneHourAgo.toISOString();

    // Count activity in the last hour across all lead sources
    const [
      { count: subscribers },
      { count: contacts },
      { count: diagnostics },
      { count: leadershipDiag },
      { count: aiDiag },
      { count: shiftDiag },
      { count: downloads },
      { count: purchases },
      { count: coachingInquiries },
    ] = await Promise.all([
      supabase.from('email_subscribers').select('*', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('contact_form_submissions').select('*', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('diagnostic_submissions').select('*', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('leadership_diagnostic_submissions').select('*', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('ai_readiness_submissions').select('*', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('shift_diagnostic_submissions').select('*', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('lead_magnet_downloads').select('*', { count: 'exact', head: true }).gte('downloaded_at', since),
      supabase.from('product_purchases').select('*', { count: 'exact', head: true }).gte('created_at', since),
      supabase.from('contagious_identity_interests').select('*', { count: 'exact', head: true }).gte('created_at', since),
    ]);

    const totalDiagnostics = (diagnostics || 0) + (leadershipDiag || 0) + (aiDiag || 0) + (shiftDiag || 0);
    const totalActivity = (subscribers || 0) + (contacts || 0) + totalDiagnostics + (downloads || 0) + (purchases || 0) + (coachingInquiries || 0);

    // Only post if there's activity — no noise
    if (totalActivity === 0) {
      console.log('No activity in the last hour, skipping Slack pulse');
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: 'no_activity' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Post to Slack via slack-notify
    const slackRes = await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        eventType: 'hourly_leads_pulse',
        data: {
          subscribers: subscribers || 0,
          contacts: contacts || 0,
          diagnostics: totalDiagnostics,
          downloads: downloads || 0,
          purchases: purchases || 0,
          coaching: coachingInquiries || 0,
          total: totalActivity,
          hour: now.toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit' }),
        },
      }),
    });

    const slackResult = await slackRes.json();
    console.log('Hourly pulse sent:', slackResult);

    return new Response(
      JSON.stringify({ success: true, totalActivity, slackResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Hourly leads pulse error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
