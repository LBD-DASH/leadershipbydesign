import { createClient } from "npm:@supabase/supabase-js@2";

// Competitor Monitor — scans competitor activity weekly
// Runs Monday 06:00 SAST

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COMPETITORS = [
  { name: "Alchemy Coaching", domain: "alchemycoaching.co.za" },
  { name: "The Coaching Centre", domain: "thecoachingcentre.co.za" },
  { name: "Actuate Consulting", domain: "actuate.co.za" },
  { name: "Britt Andreatta", domain: "brittandreatta.com" },
  { name: "Cornerstone Performance", domain: "cornerstone.co.za" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const findings: string[] = [];
    let scanned = 0;

    if (firecrawlKey) {
      // Search for competitor activity
      try {
        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `"leadership development" OR "coaching programme" OR "manager coaching" South Africa 2026 -site:leadershipbydesign.co`,
            limit: 10,
          }),
        });

        if (searchRes.ok) {
          const data = await searchRes.json();
          const results = data.data || data.results || [];

          for (const r of results) {
            const url = r.url || r.link || "";
            const title = r.title || "";
            const isCompetitor = COMPETITORS.some(c => url.includes(c.domain));

            if (isCompetitor || title.toLowerCase().includes("coaching") || title.toLowerCase().includes("leadership")) {
              findings.push(`${title.substring(0, 80)} — ${url.substring(0, 100)}`);
              scanned++;
            }
          }
        }
      } catch (e) {
        console.error("Search error:", e);
      }
    }

    // Also search for new leadership development RFPs or tenders
    if (firecrawlKey) {
      try {
        const rfpRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `"leadership development" tender OR RFP OR "request for proposal" South Africa 2026`,
            limit: 5,
          }),
        });

        if (rfpRes.ok) {
          const data = await rfpRes.json();
          const results = data.data || data.results || [];
          for (const r of results) {
            findings.push(`📋 RFP: ${(r.title || "").substring(0, 80)} — ${(r.url || "").substring(0, 100)}`);
            scanned++;
          }
        }
      } catch { /* continue */ }
    }

    // Post to Slack
    const slackMsg = findings.length > 0
      ? `${findings.length} signals found:\n${findings.slice(0, 5).join("\n")}`
      : "No new competitor signals this week";

    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: { function: "👀 Competitor Monitor", error: slackMsg },
        }),
      });
    } catch { /* best effort */ }

    await supabase.from("agent_activity_log").insert({
      agent_name: "Competitor Monitor",
      agent_type: "monitoring",
      status: "success",
      message: `Scanned market: ${findings.length} signals found`,
      details: { findings: findings.slice(0, 10) },
      items_processed: scanned,
    });

    return new Response(JSON.stringify({ success: true, findings_count: findings.length, findings: findings.slice(0, 10) }), { headers });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await supabase.from("agent_activity_log").insert({
      agent_name: "Competitor Monitor",
      agent_type: "monitoring",
      status: "error",
      message: errMsg,
    });
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
