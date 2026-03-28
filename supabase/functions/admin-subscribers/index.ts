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

function unauthorized() {
  return json({ success: false, error: 'Unauthorized' }, 401);
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

    // LIST subscribers
    if (action === 'list') {
      const { search, tag } = body;

      // Paginate to overcome Supabase 1000-row default limit
      const PAGE_SIZE = 1000;
      let allRows: unknown[] = [];
      let from = 0;
      let keepGoing = true;

      while (keepGoing) {
        let query = supabase
          .from('email_subscribers')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, from + PAGE_SIZE - 1);

        if (search) {
          query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%,company.ilike.%${search}%`);
        }
        if (tag) {
          query = query.contains('tags', [tag]);
        }

        const { data, error } = await query;
        if (error) return json({ success: false, error: error.message }, 500);

        allRows = allRows.concat(data || []);
        if (!data || data.length < PAGE_SIZE) {
          keepGoing = false;
        } else {
          from += PAGE_SIZE;
        }
      }

      return json({ success: true, data: allRows });
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

    // BULK UPSERT (CSV import) — appends tags for existing contacts
    if (action === 'bulk_upsert') {
      const { rows } = body;
      if (!Array.isArray(rows) || rows.length === 0) {
        return json({ success: false, error: 'rows array is required' }, 400);
      }

      let imported = 0;
      let skipped = 0;

      // Process in batches of 50
      for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);

        for (const row of batch) {
          // Check if contact already exists
          const { data: existing } = await supabase
            .from('email_subscribers')
            .select('id, tags')
            .eq('email', row.email)
            .maybeSingle();

          if (existing) {
            // Append new tags to existing tags (deduplicated)
            const existingTags: string[] = existing.tags || [];
            const newTags: string[] = row.tags || [];
            const mergedTags = Array.from(new Set([...existingTags, ...newTags]));

            await supabase
              .from('email_subscribers')
              .update({
                tags: mergedTags,
                name: row.name || undefined,
                company: row.company || undefined,
              })
              .eq('id', existing.id);

            skipped += 1;
          } else {
            const { error: insertErr } = await supabase
              .from('email_subscribers')
              .insert(row);

            if (insertErr) {
              skipped += 1;
            } else {
              imported += 1;
            }
          }
        }
      }

      return json({ success: true, imported, skipped });
    }

    // SAVE NEWSLETTER DRAFT or SCHEDULE
    if (action === 'save_newsletter' || action === 'schedule_newsletter') {
      const { subject, body_html, tag_filter } = body;
      if (!subject || !body_html) return json({ success: false, error: 'subject and body_html required' }, 400);

      const status = action === 'schedule_newsletter' ? 'scheduled' : 'draft';
      const { data, error } = await supabase
        .from('newsletter_sends')
        .insert({ subject, body_html, tag_filter: tag_filter || null, status, sent_by: 'admin', recipient_count: 0 })
        .select()
        .single();

      if (error) return json({ success: false, error: error.message }, 500);
      return json({ success: true, data });
    }

    // LIST DRAFTS
    if (action === 'list_drafts') {
      const { data, error } = await supabase
        .from('newsletter_sends')
        .select('id, subject, body_html, tag_filter, created_at')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) return json({ success: false, error: error.message }, 500);
      return json({ success: true, data: data || [] });
    }

    return json({ success: false, error: 'Unknown action' }, 400);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return json({ success: false, error: message }, 500);
  }
});
