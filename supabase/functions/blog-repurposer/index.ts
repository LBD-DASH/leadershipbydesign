import { createClient } from "npm:@supabase/supabase-js@2";

// Blog Repurposer — takes recent newsletters/content and generates blog post ideas
// Runs Thursday 20:00 SAST

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // Get recent newsletters for repurposing
    const { data: newsletters } = await supabase
      .from("newsletters")
      .select("subject, body_html, topic, pain_point, created_at")
      .eq("status", "sent")
      .order("created_at", { ascending: false })
      .limit(5);

    // Get recent blog posts to avoid duplication
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title, slug")
      .order("created_at", { ascending: false })
      .limit(10);

    const recentNewsletters = newsletters || [];
    const existingTitles = (existingPosts || []).map((p: any) => p.title?.toLowerCase());

    let ideasGenerated = 0;
    const ideas: string[] = [];

    for (const nl of recentNewsletters) {
      const topic = nl.topic || nl.subject || "leadership";
      const idea = `Blog: ${topic} — expanded from newsletter "${nl.subject}"`;

      // Skip if similar blog already exists
      if (existingTitles.some((t: string) => t && topic.toLowerCase().includes(t.substring(0, 20)))) continue;

      ideas.push(idea);
      ideasGenerated++;
    }

    // Post summary to Slack
    if (ideas.length > 0) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: "mission-control",
            eventType: "system_error",
            data: {
              function: "📝 Blog Repurposer",
              error: `${ideasGenerated} blog ideas from recent newsletters:\n${ideas.slice(0, 3).join("\n")}`,
            },
          }),
        });
      } catch { /* best effort */ }
    }

    await supabase.from("agent_activity_log").insert({
      agent_name: "Blog Repurposer",
      agent_type: "content",
      status: "success",
      message: `Scanned ${recentNewsletters.length} newsletters, generated ${ideasGenerated} blog ideas`,
      details: { ideas },
      items_processed: ideasGenerated,
    });

    return new Response(JSON.stringify({ success: true, ideas_generated: ideasGenerated, ideas }), { headers });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await supabase.from("agent_activity_log").insert({
      agent_name: "Blog Repurposer",
      agent_type: "content",
      status: "error",
      message: errMsg,
    });
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
