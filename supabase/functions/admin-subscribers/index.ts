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

function unauthorized() {
  return json({ success: false, error: 'Unauthorized' }, 401);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== 'Bypass2024') {
      return unauthorized();
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const { action } = body as { action: string };

    // LIST subscribers
    if (action === 'list') {
      const { search, tag, limit: rawLimit } = body;
      const limit = rawLimit || 200;

      let query = supabase
        .from('email_subscribers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (search) {
        query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%,company.ilike.%${search}%`);
      }
      if (tag) {
        query = query.contains('tags', [tag]);
      }

      const { data, error } = await query;
      if (error) return json({ success: false, error: error.message }, 500);
      return json({ success: true, data });
    }

    // COUNT active subscribers (for composer)
    if (action === 'count') {
      const { tag } = body;
      let query = supabase
        .from('email_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      if (tag) {
        query = query.contains('tags', [tag]);
      }
      const { count, error } = await query;
      if (error) return json({ success: false, error: error.message }, 500);

      // Also get all tags
      const { data: subs } = await supabase
        .from('email_subscribers')
        .select('tags')
        .eq('status', 'active');
      const tags = new Set<string>();
      (subs || []).forEach((s: { tags: string[] | null }) => s.tags?.forEach(t => tags.add(t)));

      return json({ success: true, count: count ?? 0, allTags: Array.from(tags).sort() });
    }

    // UPDATE subscriber
    if (action === 'update') {
      const { id, name, company, tags } = body;
      if (!id) return json({ success: false, error: 'id is required' }, 400);

      const { error } = await supabase
        .from('email_subscribers')
        .update({ name: name || null, company: company || null, tags: tags || [] })
        .eq('id', id);

      if (error) return json({ success: false, error: error.message }, 500);
      return json({ success: true });
    }

    // TOGGLE STATUS
    if (action === 'toggle_status') {
      const { id, new_status } = body;
      if (!id || !new_status) return json({ success: false, error: 'id and new_status required' }, 400);

      const { error } = await supabase
        .from('email_subscribers')
        .update({
          status: new_status,
          unsubscribed_at: new_status === 'unsubscribed' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) return json({ success: false, error: error.message }, 500);
      return json({ success: true });
    }

    return json({ success: false, error: 'Unknown action' }, 400);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return json({ success: false, error: message }, 500);
  }
});
