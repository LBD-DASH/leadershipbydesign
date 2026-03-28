import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // GET: fetch call list (requires auth)
    if (req.method === "GET") {
      const authErr = await requireRole(req, ['admin', 'call_centre']);
      if (authErr) return authErr;

      const url = new URL(req.url);
      const showAll = url.searchParams.get("all") === "true";
      const statusFilter = url.searchParams.get("status");

      let query = supabase
        .from("call_list_prospects")
        .select("*")
        .not("phone", "is", null)
        .neq("phone", "")
        .order("created_at", { ascending: false });

      if (statusFilter === "called") {
        query = query.eq("status", "called");
      } else if (!showAll) {
        query = query.in("status", ["pending", "skipped"]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return new Response(JSON.stringify({ prospects: data }), { headers });
    }

    // POST/DELETE: admin-only operations
    const authErr = await requireRole(req, ['admin', 'call_centre']);
    if (authErr) return authErr;

    if (req.method === "POST") {
      const body = await req.json();
      const { action } = body;

      if (action === "bulk_upload") {
        const { prospects, batch_id } = body;
        if (!Array.isArray(prospects) || prospects.length === 0) {
          return new Response(JSON.stringify({ error: "No prospects provided" }), { status: 400, headers });
        }

        const rows = prospects.map((p: any) => ({
          first_name: (p.first_name || "").trim(),
          last_name: (p.last_name || "").trim(),
          email: (p.email || "").trim().toLowerCase(),
          company: (p.company || "").trim(),
          phone: (p.phone || "").trim(),
          title: (p.title || "").trim(),
          status: "pending",
          batch_id: batch_id || null,
          uploaded_by: "admin",
        }));

        const { data, error } = await supabase
          .from("call_list_prospects")
          .insert(rows)
          .select();

        if (error) throw error;
        return new Response(JSON.stringify({ success: true, imported: data.length }), { headers });
      }

      if (action === "clear_all") {
        const { error } = await supabase
          .from("call_list_prospects")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      if (action === "update_status") {
        const { id, status, call_outcome, call_feedback } = body;
        const updates: any = { status };
        if (status === "called") updates.called_at = new Date().toISOString();
        if (call_outcome) updates.call_outcome = call_outcome;
        if (call_feedback) updates.call_feedback = call_feedback;

        const { error } = await supabase
          .from("call_list_prospects")
          .update(updates)
          .eq("id", id);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
