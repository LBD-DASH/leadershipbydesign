import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Generic email prefixes that should never be in outreach
const GENERIC_PREFIXES = [
  "info", "admin", "support", "hello", "contact", "sales", "enquiries",
  "reception", "office", "no-reply", "noreply", "webmaster", "marketing",
  "news", "documents", "membership", "careers", "hr", "jobs", "media",
  "press", "feedback", "compliance", "legal", "service", "help",
  "clientservice", "clientservices", "assetmanagement", "investments",
  "claims", "queries", "applications", "treasury", "operations",
  "accounts", "billing", "general", "team", "group", "corporate",
  "investor", "shareholders", "communications", "procurement",
  "pr", "services",
];

// Domains that should never be in outreach
const BLOCKED_DOMAINS = [
  "leadershipbydesign.co",
  "leadershipbydesign.co.za",
  "leadershipbydesign.lovable.app",
  "kevinbritz.com",
  "theorg.com",
];

// Specific email patterns to always remove
const BLOCKED_PATTERNS = ["kevin@"];

function shouldRemove(email: string): { remove: boolean; reason: string } {
  if (!email) return { remove: false, reason: "" };
  const lower = email.toLowerCase().trim();
  const prefix = lower.split("@")[0];
  const domain = lower.split("@")[1] || "";

  // Check blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (lower.includes(pattern)) {
      return { remove: true, reason: `blocked pattern: "${pattern}"` };
    }
  }

  // Check blocked domains
  for (const d of BLOCKED_DOMAINS) {
    if (domain === d || domain.endsWith("." + d)) {
      return { remove: true, reason: `blocked domain: ${d}` };
    }
  }

  // Check generic prefixes
  for (const g of GENERIC_PREFIXES) {
    if (prefix === g || prefix.startsWith(g + ".")) {
      return { remove: true, reason: `generic prefix: "${g}"` };
    }
  }

  return { remove: false, reason: "" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log("🧹 Queue hygiene started at", new Date().toISOString());

    // Fetch all non-removed records from queue
    const { data: prospects, error: fetchErr } = await supabase
      .from("warm_outreach_queue")
      .select("id, contact_email, company_name, status")
      .not("contact_email", "is", null)
      .neq("status", "removed_hygiene");

    if (fetchErr) throw new Error(`Fetch error: ${fetchErr.message}`);

    const toRemove: { id: string; email: string; company: string; reason: string }[] = [];

    for (const p of prospects || []) {
      const check = shouldRemove(p.contact_email || "");
      if (check.remove) {
        toRemove.push({
          id: p.id,
          email: p.contact_email,
          company: p.company_name,
          reason: check.reason,
        });
      }
    }

    if (toRemove.length === 0) {
      console.log("✅ Queue clean — no records to remove");
      return new Response(JSON.stringify({ success: true, removed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete the bad records
    const ids = toRemove.map((r) => r.id);
    const { error: deleteErr } = await supabase
      .from("warm_outreach_queue")
      .delete()
      .in("id", ids);

    if (deleteErr) throw new Error(`Delete error: ${deleteErr.message}`);

    const details = toRemove
      .map((r) => `• ${r.email} (${r.company}) — ${r.reason}`)
      .join("\n");

    console.log(`🧹 Removed ${toRemove.length} records:\n${details}`);

    // Post to #system-health
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "system-health",
          eventType: "system_error",
          data: {
            function: "🧹 Queue Hygiene",
            error: `Removed ${toRemove.length} bad record(s) from outreach queue:\n${details}`,
          },
        }),
      });
    } catch { /* best effort */ }

    return new Response(
      JSON.stringify({ success: true, removed: toRemove.length, details: toRemove }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("queue-hygiene error:", errMsg);
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          eventType: "system_error",
          data: { function: "queue-hygiene", error: errMsg },
        }),
      });
    } catch { /* best effort */ }
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
