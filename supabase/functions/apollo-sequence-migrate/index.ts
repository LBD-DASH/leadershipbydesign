import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const APOLLO_BASE = "https://api.apollo.io/v1";

async function apolloPost(path: string, apiKey: string, body?: Record<string, unknown>) {
  const res = await fetch(`${APOLLO_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Apollo ${path} [${res.status}]: ${JSON.stringify(data)}`);
  return data;
}

async function apolloGet(path: string, apiKey: string) {
  const res = await fetch(`${APOLLO_BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Apollo ${path} [${res.status}]: ${JSON.stringify(data)}`);
  return data;
}

async function apolloDelete(path: string, apiKey: string) {
  const res = await fetch(`${APOLLO_BASE}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
  });
  if (!res.ok) {
    const data = await res.text();
    throw new Error(`Apollo DELETE ${path} [${res.status}]: ${data}`);
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY");
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  if (!apolloApiKey) {
    return new Response(JSON.stringify({ error: "APOLLO_API_KEY not configured" }), { status: 500, headers });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // 1. Find old sequence: "Leader as Coach - 1 MAR"
    const oldSearch = await apolloPost("/emailer_campaigns/search", apolloApiKey, {
      q_name: "Leader as Coach - 1 MAR",
    });
    const oldCampaigns = oldSearch.emailer_campaigns || [];
    if (oldCampaigns.length === 0) {
      throw new Error("Old sequence 'Leader as Coach - 1 MAR' not found in Apollo");
    }
    const oldCampaignId = oldCampaigns[0].id;
    console.log(`Found old campaign: ${oldCampaignId}`);

    // 2. Find new sequence: "Leader as Coach — MAR v2"
    const newSearch = await apolloPost("/emailer_campaigns/search", apolloApiKey, {
      q_name: "Leader as Coach — MAR v2",
    });
    const newCampaigns = newSearch.emailer_campaigns || [];
    if (newCampaigns.length === 0) {
      throw new Error("New sequence not found — create it in Apollo first then retry.");
    }
    const newCampaignId = newCampaigns[0].id;
    console.log(`Found new campaign: ${newCampaignId}`);

    // 3. Get active, non-replied contacts from old sequence
    let page = 1;
    let contactsToMigrate: Array<{ membership_id: string; contact_id: string; email: string }> = [];
    let hasMore = true;

    while (hasMore) {
      const memberships = await apolloGet(
        `/emailer_campaigns/${oldCampaignId}/emailer_campaign_memberships?page=${page}&per_page=100`,
        apolloApiKey
      );

      const items = memberships.emailer_campaign_memberships || [];
      if (items.length === 0) {
        hasMore = false;
        break;
      }

      for (const m of items) {
        if (!m.replied_at && m.status !== 'replied') {
          contactsToMigrate.push({
            membership_id: m.id,
            contact_id: m.contact_id,
            email: m.contact?.email || '',
          });
        }
      }

      page++;
      if (items.length < 100) hasMore = false;
    }

    console.log(`Found ${contactsToMigrate.length} non-replied contacts to migrate`);

    // 4. Migrate each contact
    let migrated = 0;
    const errors: string[] = [];

    for (const contact of contactsToMigrate) {
      try {
        // Remove from old sequence
        await apolloDelete(
          `/emailer_campaign_memberships/${contact.membership_id}`,
          apolloApiKey
        );

        // Add to new sequence
        await apolloPost("/emailer_campaign_memberships", apolloApiKey, {
          emailer_campaign_id: newCampaignId,
          contact_id: contact.contact_id,
        });

        // Update warm_outreach_queue if email exists
        if (contact.email) {
          await supabase
            .from("warm_outreach_queue")
            .update({
              updated_at: new Date().toISOString(),
            })
            .eq("contact_email", contact.email.toLowerCase());
        }

        migrated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Failed to migrate contact ${contact.contact_id}: ${msg}`);
        errors.push(`${contact.contact_id}: ${msg}`);
      }
    }

    // 5. Log result
    const status = errors.length === 0 ? "success" : "error";
    await supabase.from("apollo_sync_log").insert({
      steps_synced: migrated,
      status,
      error_message: errors.length > 0 ? errors.join('; ') : null,
    });

    return new Response(
      JSON.stringify({
        success: errors.length === 0,
        migrated,
        total_found: contactsToMigrate.length,
        errors: errors.length,
      }),
      { status: 200, headers }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Apollo migration error:", errorMessage);

    await supabase.from("apollo_sync_log").insert({
      steps_synced: 0,
      status: "error",
      error_message: errorMessage,
    });

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers }
    );
  }
});
