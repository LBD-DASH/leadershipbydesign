// Ruflo n8n Integration: Update LAC assessment with enrichment data
// Called by n8n workflow after Ollama scoring + Apollo enrichment

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const {
      assessment_id,
      apollo_data,
      ruflo_intelligence,
      buying_intent_score,
      buyer_type,
      urgency_level,
      ideal_next_step,
      ruflo_path,
      vip_email_body,
      vip_email_sent,
      vip_email_sent_at,
      vip_email_outcome,
      status,
    } = body;

    if (!assessment_id) {
      return new Response(
        JSON.stringify({ error: "assessment_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const updateData: Record<string, unknown> = {
      ruflo_intelligence,
      buying_intent_score,
      buyer_type,
      urgency_level,
      ruflo_path,
      ruflo_processed_at: new Date().toISOString(),
    };

    if (ideal_next_step) updateData.ideal_next_step = ideal_next_step;
    if (status) updateData.status = status;

    if (apollo_data) {
      updateData.apollo_data = apollo_data;
      updateData.apollo_enriched_at = new Date().toISOString();
    }

    if (vip_email_body) {
      updateData.vip_email_body = vip_email_body;
      updateData.vip_email_sent = vip_email_sent ?? true;
      updateData.vip_email_sent_at = vip_email_sent_at ?? new Date().toISOString();
      updateData.vip_email_outcome = vip_email_outcome ?? "awaiting_reply";
    }

    const { data, error } = await supabase
      .from("leader_as_coach_assessments")
      .update(updateData)
      .eq("id", assessment_id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({ error: error.message, code: error.code }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No matching assessment found", assessment_id }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, assessment_id, updated_at: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
