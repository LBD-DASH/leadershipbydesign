import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== 'Bypass2024') {
      return json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const { action } = body as { action: string };

    if (action === 'list') {
      const { data, error } = await supabase
        .from('newsletter_sends')
        .select('id, subject, body_html, recipient_count, status, approval_status, auto_generated, research_topic, tag_filter, sent_at, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return json({ success: true, data });
    }

    if (action === 'sent_history') {
      const { data, error } = await supabase
        .from('newsletter_sends')
        .select('id, subject, sent_at, recipient_count, auto_generated')
        .eq('status', 'sent')
        .order('sent_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return json({ success: true, data });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (error) {
    console.error('admin-newsletters error:', error);
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
