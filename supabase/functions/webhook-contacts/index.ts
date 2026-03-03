import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // Simple secret check — Pipedream sends this header
    const webhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = Deno.env.get("WEBHOOK_CONTACTS_SECRET");
    if (expectedSecret && webhookSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const body = await req.json();

    // Accept a single contact or an array of contacts
    const contacts: any[] = Array.isArray(body.contacts) ? body.contacts : Array.isArray(body) ? body : [body];

    if (contacts.length === 0) {
      return new Response(JSON.stringify({ error: "No contacts provided" }), { status: 400, headers });
    }

    const batchId = `pipedream-${new Date().toISOString().slice(0, 10)}`;

    const rows = contacts.map((c: any) => ({
      first_name: (c.first_name || c.firstName || c.name || "").trim(),
      last_name: (c.last_name || c.lastName || "").trim(),
      email: (c.email || "").trim().toLowerCase(),
      company: (c.company || c.organization || "").trim(),
      phone: (c.phone || c.phoneNumber || "").trim(),
      title: (c.title || c.jobTitle || "").trim(),
      status: "pending",
      source: "agent",
      batch_id: batchId,
      uploaded_by: "pipedream",
    }));

    // Deduplicate: skip contacts whose email already exists in the table
    const emails = rows.map((r: any) => r.email).filter(Boolean);
    let existingEmails = new Set<string>();

    if (emails.length > 0) {
      const { data: existing } = await supabase
        .from("call_list_prospects")
        .select("email")
        .in("email", emails);

      if (existing) {
        existingEmails = new Set(existing.map((e: any) => e.email));
      }
    }

    const newRows = rows.filter((r: any) => r.email && !existingEmails.has(r.email));

    if (newRows.length === 0) {
      return new Response(JSON.stringify({ success: true, imported: 0, skipped: rows.length, message: "All contacts already exist" }), { headers });
    }

    const { data, error } = await supabase
      .from("call_list_prospects")
      .insert(newRows)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, imported: data.length, skipped: rows.length - newRows.length }),
      { headers },
    );
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
