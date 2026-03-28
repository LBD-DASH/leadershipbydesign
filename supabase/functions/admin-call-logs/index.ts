import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

  const authErr = await requireRole(req, ['admin', 'call_centre']);
  if (authErr) return authErr;

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data, error } = await supabase
    .from("cold_call_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch logs" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ logs: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
