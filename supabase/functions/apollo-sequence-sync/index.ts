import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const APOLLO_BASE = "https://api.apollo.io/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY");

  if (!apolloApiKey) {
    return new Response(JSON.stringify({ error: "APOLLO_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // 1. Read active templates from Supabase
    const { data: templates, error: tErr } = await supabase
      .from("apollo_sequence_templates")
      .select("*")
      .eq("status", "Active")
      .eq("sequence_name", "leader_as_coach_v2")
      .order("step_number", { ascending: true });

    if (tErr) throw new Error(`Failed to read templates: ${tErr.message}`);
    if (!templates || templates.length === 0) throw new Error("No active templates found");

    // 2. Find the matching sequence in Apollo
    const searchRes = await fetch(`${APOLLO_BASE}/emailer_campaigns/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apolloApiKey,
      },
      body: JSON.stringify({ q_name: "Leader as Coach — MAR v2" }),
    });

    const searchData = await searchRes.json();
    if (!searchRes.ok) {
      throw new Error(`Apollo search failed [${searchRes.status}]: ${JSON.stringify(searchData)}`);
    }

    const campaigns = searchData.emailer_campaigns || [];
    if (campaigns.length === 0) {
      throw new Error("No matching Apollo sequence found for 'Leader as Coach — MAR v2'");
    }

    const campaignId = campaigns[0].id;

    // 3. Fetch full campaign details (search results don't include touches)
    const detailRes = await fetch(`${APOLLO_BASE}/emailer_campaigns/${campaignId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apolloApiKey,
      },
    });

    const detailData = await detailRes.json();
    if (!detailRes.ok) {
      throw new Error(`Apollo campaign detail failed [${detailRes.status}]: ${JSON.stringify(detailData)}`);
    }

    const campaign = detailData.emailer_campaign || detailData;
    const touches = campaign.emailer_touches || campaign.emailer_steps || [];

    if (touches.length === 0) {
      throw new Error(
        `Apollo sequence '${campaigns[0].name || campaignId}' has no emailer touches. ` +
        `Verify the sequence exists and has email steps configured in Apollo.`
      );
    }

    // 4. Match steps by step_number and update each touch
    let stepsSynced = 0;

    for (const template of templates) {
      const touchIndex = template.step_number - 1;
      if (touchIndex >= touches.length) {
        console.warn(`Step ${template.step_number} exceeds Apollo touches count (${touches.length}), skipping`);
        continue;
      }

      const touch = touches[touchIndex];
      const touchId = touch.id;

      const patchRes = await fetch(`${APOLLO_BASE}/emailer_touches/${touchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apolloApiKey,
        },
        body: JSON.stringify({
          emailer_touch: {
            subject: template.subject,
            email_template: template.body,
          },
        }),
      });

      const patchData = await patchRes.json();
      if (!patchRes.ok) {
        throw new Error(
          `Failed to update touch ${touchId} (step ${template.step_number}) [${patchRes.status}]: ${JSON.stringify(patchData)}`
        );
      }

      stepsSynced++;
    }

    // 5. Log success
    await supabase.from("apollo_sync_log").insert({
      steps_synced: stepsSynced,
      status: "success",
    });

    return new Response(
      JSON.stringify({ success: true, steps_synced: stepsSynced }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Apollo sync error:", errorMessage);

    await supabase.from("apollo_sync_log").insert({
      steps_synced: 0,
      status: "error",
      error_message: errorMessage,
    });

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
