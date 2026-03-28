import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function requireAdmin(req: Request): Promise<Response | null> {
  const h = { ...corsHeaders, 'Content-Type': 'application/json' };
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: h });
  const token = auth.replace('Bearer ', '');
  if (token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) return null;
  const c = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error } = await c.auth.getUser();
  if (error || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: h });
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: role } = await db.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
  if (!role) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: h });
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authErr = await requireAdmin(req);
    if (authErr) return authErr;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const { action } = body as { action: string };

    if (action === 'list') {
      const { data, error } = await supabase
        .from('newsletter_sends')
        .select('id, subject, body_html, recipient_count, status, approval_status, auto_generated, research_topic, tag_filter, sent_at, created_at, rewrite_rounds, pain_point_topic, service_referenced')
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

    // --- Newsletter Themes CRUD ---
    if (action === 'list_themes') {
      const { data, error } = await supabase
        .from('newsletter_themes')
        .select('*')
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;
      return json({ themes: data });
    }

    if (action === 'create_theme') {
      const { year, month, theme, pain_point_cluster, featured_products } = body as any;
      if (!year || !month || !theme || !pain_point_cluster) {
        return json({ error: 'year, month, theme, and pain_point_cluster are required' }, 400);
      }
      const { data, error } = await supabase
        .from('newsletter_themes')
        .insert({ year, month, theme, pain_point_cluster, featured_products: featured_products || [] })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') return json({ error: `A theme already exists for ${month}/${year}` }, 409);
        throw error;
      }
      return json({ success: true, theme: data });
    }

    if (action === 'update_theme') {
      const { id, year, month, theme, pain_point_cluster, featured_products } = body as any;
      if (!id) return json({ error: 'id is required' }, 400);
      const { data, error } = await supabase
        .from('newsletter_themes')
        .update({ year, month, theme, pain_point_cluster, featured_products })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return json({ success: true, theme: data });
    }

    if (action === 'delete_theme') {
      const { id } = body as any;
      if (!id) return json({ error: 'id is required' }, 400);
      const { error } = await supabase
        .from('newsletter_themes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return json({ success: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (error) {
    console.error('admin-newsletters error:', error);
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
