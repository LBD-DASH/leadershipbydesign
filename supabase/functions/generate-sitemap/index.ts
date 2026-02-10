import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml",
};

const SITE_URL = "https://leadershipbydesign.co";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },
  { loc: "/contact", priority: "0.9", changefreq: "monthly" },
  { loc: "/programmes", priority: "0.9", changefreq: "weekly" },
  { loc: "/programmes/shift-leadership-development", priority: "0.8", changefreq: "monthly" },
  { loc: "/contagious-identity", priority: "0.8", changefreq: "monthly" },
  { loc: "/shift-methodology", priority: "0.8", changefreq: "monthly" },
  { loc: "/hellocoach", priority: "0.7", changefreq: "monthly" },
  { loc: "/workshops/alignment", priority: "0.7", changefreq: "monthly" },
  { loc: "/workshops/motivation", priority: "0.7", changefreq: "monthly" },
  { loc: "/workshops/leadership", priority: "0.7", changefreq: "monthly" },
  { loc: "/leader-assessment", priority: "0.8", changefreq: "monthly" },
  { loc: "/team-assessment", priority: "0.8", changefreq: "monthly" },
  { loc: "/leadership-diagnostic", priority: "0.8", changefreq: "monthly" },
  { loc: "/team-diagnostic", priority: "0.8", changefreq: "monthly" },
  { loc: "/shift-diagnostic", priority: "0.7", changefreq: "monthly" },
  { loc: "/ai-readiness", priority: "0.8", changefreq: "monthly" },
  { loc: "/ai-readiness-diagnostic", priority: "0.7", changefreq: "monthly" },
  { loc: "/resources", priority: "0.7", changefreq: "weekly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/case-studies", priority: "0.7", changefreq: "monthly" },
  { loc: "/book", priority: "0.6", changefreq: "monthly" },
  { loc: "/leadership-mistakes", priority: "0.7", changefreq: "monthly" },
  { loc: "/team-development-framework", priority: "0.7", changefreq: "monthly" },
  { loc: "/podcast", priority: "0.7", changefreq: "weekly" },
  { loc: "/products", priority: "0.8", changefreq: "monthly" },
  { loc: "/new-manager-kit", priority: "0.7", changefreq: "monthly" },
  { loc: "/difficult-conversations", priority: "0.7", changefreq: "monthly" },
  { loc: "/contagious-identity-workbook", priority: "0.7", changefreq: "monthly" },
];

function buildPageSitemap(today: string): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }
  xml += `</urlset>`;
  return xml;
}

function buildPostSitemap(blogPosts: Array<{ slug: string; updated_at: string }>, today: string): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const post of blogPosts) {
    const lastmod = post.updated_at
      ? new Date(post.updated_at).toISOString().split("T")[0]
      : today;
    xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }
  xml += `</urlset>`;
  return xml;
}

function buildSitemapIndex(today: string, baseUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}?type=page</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}?type=post</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const today = new Date().toISOString().split("T")[0];
    const functionBaseUrl = `${Deno.env.get("SUPABASE_URL")!}/functions/v1/generate-sitemap`;

    if (type === "page") {
      return new Response(buildPageSitemap(today), { headers: corsHeaders, status: 200 });
    }

    if (type === "post") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: blogPosts, error } = await supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching blog posts:", error);

      return new Response(buildPostSitemap(blogPosts || [], today), { headers: corsHeaders, status: 200 });
    }

    // Default: return sitemap index
    return new Response(buildSitemapIndex(today, functionBaseUrl), { headers: corsHeaders, status: 200 });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
