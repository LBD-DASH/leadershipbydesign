import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // GET: fetch all prospects (no admin token needed — callers need this)
    if (req.method === "GET") {
      const url = new URL(req.url);
      const showAll = url.searchParams.get("all") === "true";

      const statusFilter = url.searchParams.get("status"); // "called" to get history

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
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== "Bypass2024") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

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
        const { id, status, call_outcome } = body;
        const updates: any = { status };
        if (status === "called") updates.called_at = new Date().toISOString();
        if (call_outcome) updates.call_outcome = call_outcome;

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
