// Ruflo n8n Integration: Update LAC assessment with enrichment data
// Called by n8n workflow after Ollama scoring + Apollo enrichment

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RufloUpdateRequest {
  assessment_id: string;
  apollo_data?: Record<string, unknown> | null;
  ruflo_intelligence: {
    buying_intent: number;
    buyer_type: string;
    urgency: string;
    primary_pain: string;
    personalization_hooks: string[];
    ideal_next_step: string;
  };
  buying_intent_score: number;
  buyer_type: string;
  urgency_level: string;
  ruflo_path: string;
  vip_email_body?: string | null;
  vip_email_sent?: boolean;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body: RufloUpdateRequest = await req.json();

    if (!body.assessment_id) {
      return new Response(
        JSON.stringify({ error: "assessment_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const updateData: Record<string, unknown> = {
      ruflo_intelligence: body.ruflo_intelligence,
      buying_intent_score: body.buying_intent_score,
      buyer_type: body.buyer_type,
      urgency_level: body.urgency_level,
      ruflo_path: body.ruflo_path,
      ruflo_processed_at: new Date().toISOString(),
    };

    if (body.apollo_data) {
      updateData.apollo_data = body.apollo_data;
      updateData.apollo_enriched_at = new Date().toISOString();
    }

    if (body.vip_email_body) {
      updateData.vip_email_body = body.vip_email_body;
      updateData.vip_email_sent = true;
      updateData.vip_email_sent_at = new Date().toISOString();
      updateData.vip_email_outcome = "awaiting_reply";
    }

    const { data, error } = await supabase
      .from("leader_as_coach_assessments")
      .update(updateData)
      .eq("id", body.assessment_id)
      .select("id, email, name, buying_intent_score, ruflo_path");

    if (error) {
      console.error("Supabase update error:", error);
      return new Response(
        JSON.stringify({ error: error.message, code: error.code }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No matching assessment found", assessment_id: body.assessment_id }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, updated: data[0] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("ruflo-update-lead error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
