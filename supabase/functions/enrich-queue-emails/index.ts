import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apolloApiKey = Deno.env.get("APOLLO_API_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  if (!apolloApiKey) {
    return new Response(JSON.stringify({ error: "APOLLO_API_KEY not configured" }), { status: 500, headers });
  }

  try {
    // Get prospects missing emails (batch of 20 to stay within timeout)
    const { data: prospects, error: fetchErr } = await supabase
      .from("warm_outreach_queue")
      .select("id, contact_name, company_name, contact_title")
      .or("contact_email.is.null,contact_email.eq.")
      .eq("status", "pending")
      .limit(20);

    if (fetchErr) throw fetchErr;
    if (!prospects || prospects.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No prospects need enrichment", enriched: 0 }), { headers });
    }

    console.log(`🔍 Enriching ${prospects.length} prospects...`);

    let enriched = 0;
    let failed = 0;
    let removed = 0;

    for (const p of prospects) {
      const nameParts = (p.contact_name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Build enrichment request
      const enrichBody: Record<string, any> = {
        reveal_personal_emails: true,
        reveal_phone_number: true,
        first_name: firstName,
        last_name: lastName,
      };

      // Try to get domain from company website or name
      if (p.company_name) {
        enrichBody.organization_name = p.company_name;
      }
      if (p.contact_title) {
        enrichBody.title = p.contact_title;
      }

      try {
        const res = await fetch("https://api.apollo.io/api/v1/people/match", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Api-Key": apolloApiKey },
          body: JSON.stringify(enrichBody),
        });

        if (res.ok) {
          const data = await res.json();
          const match = data.person;

          if (match) {
            const email = (match.email || match.personal_emails?.[0] || "").toLowerCase().trim();
            const phone = match.phone_numbers?.[0]?.sanitized_number || "";

            if (email && email.includes("@")) {
              await supabase
                .from("warm_outreach_queue")
                .update({
                  contact_email: email,
                  contact_phone: phone || undefined,
                  source_keyword: "apollo:enriched-backfill",
                })
                .eq("id", p.id);

              enriched++;
              console.log(`  ✅ ${p.contact_name}: ${email}`);
            } else {
              // No email found — remove from queue to keep it clean
              await supabase.from("warm_outreach_queue").delete().eq("id", p.id);
              removed++;
              console.log(`  🗑️ ${p.contact_name}: no email, removed`);
            }
          } else {
            await supabase.from("warm_outreach_queue").delete().eq("id", p.id);
            removed++;
            console.log(`  🗑️ ${p.contact_name}: no match, removed`);
          }
        } else {
          const errBody = await res.text();
          failed++;
          console.error(`  ❌ API error for ${p.contact_name} [${res.status}]: ${errBody}`);
        }
      } catch (err) {
        failed++;
        console.error(`  ❌ Error for ${p.contact_name}:`, err);
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 500));
    }

    const summary = `Enrichment complete: ${enriched} emails found, ${removed} removed (no email), ${failed} errors`;
    console.log(summary);

    // Slack notification
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: { function: "🔍 Email Enrichment Backfill", error: summary },
        }),
      });
    } catch { /* best effort */ }

    return new Response(JSON.stringify({
      success: true,
      processed: prospects.length,
      enriched,
      removed,
      failed,
    }), { headers });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("enrich-queue-emails error:", errMsg);
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
