import { createClient } from "npm:@supabase/supabase-js@2";

// Newsletter Curator — prepares next week's newsletter theme and research
// Runs Sunday 16:00 SAST

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // Check what themes have been used recently
    const { data: recentNewsletters } = await supabase
      .from("newsletters")
      .select("topic, pain_point, subject")
      .order("created_at", { ascending: false })
      .limit(5);

    const recentTopics = (recentNewsletters || []).map((n: any) => n.topic).filter(Boolean);

    // Research trending leadership topics
    let researchContext = "";
    if (firecrawlKey) {
      const year = new Date().getFullYear();
      try {
        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `biggest leadership challenge managers South Africa ${year} HR people development`,
            limit: 5,
          }),
        });

        if (searchRes.ok) {
          const data = await searchRes.json();
          const results = data.data || data.results || [];
          researchContext = results.map((r: any) => `${r.title}: ${(r.description || "").substring(0, 200)}`).join("\n");
        }
      } catch { /* continue without research */ }
    }

    // Check newsletter calendar for upcoming theme
    const { data: calendarTheme } = await supabase
      .from("newsletter_calendar")
      .select("*")
      .gte("week_start", new Date().toISOString())
      .order("week_start", { ascending: true })
      .limit(1)
      .maybeSingle();

    const summary = {
      recent_topics: recentTopics,
      upcoming_theme: calendarTheme?.theme || "not set",
      research_available: researchContext.length > 0,
      research_snippet: researchContext.substring(0, 500),
    };

    // Post to Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "system_error",
          data: {
            function: "📰 Newsletter Curator",
            error: `Next theme: ${summary.upcoming_theme} | Recent: ${recentTopics.slice(0, 3).join(", ") || "none"} | Research: ${summary.research_available ? "ready" : "skipped"}`,
          },
        }),
      });
    } catch { /* best effort */ }

    await supabase.from("agent_activity_log").insert({
      agent_name: "Newsletter Curator",
      agent_type: "content",
      status: "success",
      message: `Curated: theme="${summary.upcoming_theme}", ${recentTopics.length} recent topics reviewed`,
      details: summary,
      items_processed: 1,
    });

    return new Response(JSON.stringify({ success: true, ...summary }), { headers });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await supabase.from("agent_activity_log").insert({
      agent_name: "Newsletter Curator",
      agent_type: "content",
      status: "error",
      message: errMsg,
    });
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
