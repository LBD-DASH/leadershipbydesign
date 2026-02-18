import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const SITE_URL = "https://leadershipbydesign.co";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const resource = url.searchParams.get("resource") || "index";
    const slug = url.searchParams.get("slug");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // GET /content-api?resource=index
    if (resource === "index") {
      return json({
        name: "Leadership by Design Content API",
        version: "1.0",
        site: SITE_URL,
        endpoints: {
          blog: "?resource=blog",
          blog_post: "?resource=blog&slug={slug}",
          programmes: "?resource=programmes",
          products: "?resource=products",
          podcast: "?resource=podcast",
          diagnostics: "?resource=diagnostics",
        },
      });
    }

    // GET /content-api?resource=blog
    if (resource === "blog") {
      if (slug) {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("slug, title, author, author_role, date, excerpt, content, featured_image, tags, updated_at")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();

        if (error || !data) {
          return json({ error: "Post not found" }, 404);
        }
        return json({ ...data, url: `${SITE_URL}/blog/${data.slug}` });
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title, author, date, excerpt, tags, updated_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return json({
        posts: (data || []).map((p) => ({ ...p, url: `${SITE_URL}/blog/${p.slug}` })),
        count: data?.length || 0,
        limit,
        offset,
      });
    }

    // GET /content-api?resource=programmes
    if (resource === "programmes") {
      return json({
        programmes: [
          { name: "SHIFT Leadership Development", url: `${SITE_URL}/programmes/shift-leadership-development`, description: "A comprehensive leadership programme built on five essential skills: Focus, Self-Management, Thinking, Human Intelligence, and Innovation." },
          { name: "Executive Coaching", url: `${SITE_URL}/executive-coaching`, description: "One-on-one coaching for senior leaders using the Contagious Identity framework." },
          { name: "Contagious Identity Coaching", url: `${SITE_URL}/contagious-identity`, description: "Deep personal leadership coaching to discover and amplify your unique leadership identity." },
          { name: "Leader as Coach Programme", url: `${SITE_URL}/leader-as-coach-programme`, description: "10-month programme transforming managers into coaching leaders across People, Profit, and Process." },
        ],
      });
    }

    // GET /content-api?resource=products
    if (resource === "products") {
      return json({
        products: [
          { name: "The New Manager Survival Kit", price: "R297", url: `${SITE_URL}/new-manager-kit` },
          { name: "Difficult Conversations Playbook", price: "R197", url: `${SITE_URL}/difficult-conversations` },
          { name: "Contagious Identity Workbook", price: "R397", url: `${SITE_URL}/contagious-identity-workbook` },
          { name: "The Feedback Formula", price: "R197", url: `${SITE_URL}/feedback-formula` },
        ],
      });
    }

    // GET /content-api?resource=podcast
    if (resource === "podcast") {
      return json({
        show: "The Lunchtime Series",
        spotify: "https://open.spotify.com/show/34amsn8UPkBhY0dRZYFf1u",
        description: "Leadership conversations hosted by Kevin Britz exploring the future of work, human skills, and organizational development.",
      });
    }

    // GET /content-api?resource=diagnostics
    if (resource === "diagnostics") {
      return json({
        diagnostics: [
          { name: "Team Health Diagnostic", url: `${SITE_URL}/team-diagnostic`, description: "15-question assessment measuring team alignment, energy, and ownership." },
          { name: "Leadership Level Diagnostic", url: `${SITE_URL}/leadership-diagnostic`, description: "Assessment across 5 leadership levels from Productivity to Strategic." },
          { name: "SHIFT Skills Diagnostic", url: `${SITE_URL}/shift-diagnostic`, description: "Measures five essential leadership skills: Focus, Self-Management, Thinking, Human Intelligence, Innovation." },
          { name: "AI Readiness Diagnostic", url: `${SITE_URL}/ai-readiness`, description: "Assess your organisation's readiness for AI integration." },
        ],
      });
    }

    return json({ error: "Unknown resource. Use ?resource=index for available endpoints." }, 400);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return json({ error: msg }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: corsHeaders,
  });
}
