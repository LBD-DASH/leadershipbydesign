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
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const {
      lead_source_table,
      lead_source_id,
      lead_name,
      lead_email,
      lead_company,
      lead_phone,
      lead_source_type,
      lead_score,
      lead_temperature,
    } = await req.json();

    // Only create sequences for warm and hot leads
    if (!['warm', 'hot'].includes(lead_temperature)) {
      return new Response(JSON.stringify({ skipped: true, reason: 'Cool lead — no sequence needed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for duplicate (same source + id)
    const { data: existing } = await supabase
      .from('warm_lead_sequences')
      .select('id')
      .eq('lead_source_table', lead_source_table)
      .eq('lead_source_id', lead_source_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ skipped: true, reason: 'Sequence already exists' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase
      .from('warm_lead_sequences')
      .insert({
        lead_source_table,
        lead_source_id,
        lead_name,
        lead_email,
        lead_company,
        lead_phone,
        lead_source_type,
        lead_score,
        lead_temperature,
        status: 'awaiting_first_contact',
        next_reminder_at: new Date().toISOString(), // immediate — Kevin should act fast
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`Warm lead sequence created for ${lead_name} (${lead_temperature})`);

    return new Response(JSON.stringify({ success: true, sequence: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('create-warm-lead-sequence error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
