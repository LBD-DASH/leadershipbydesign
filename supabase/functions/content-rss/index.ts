import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://leadershipbydesign.co";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, title, author, date, excerpt, tags, updated_at, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const now = new Date().toUTCString();
    const latestDate = posts?.[0]?.updated_at
      ? new Date(posts[0].updated_at).toUTCString()
      : now;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Leadership by Design Blog</title>
  <link>${SITE_URL}/blog</link>
  <description>Leadership insights, organisational development, and the future of work by Kevin Britz.</description>
  <language>en</language>
  <lastBuildDate>${latestDate}</lastBuildDate>
  <atom:link href="${Deno.env.get("SUPABASE_URL")}/functions/v1/content-rss" rel="self" type="application/rss+xml"/>
`;

    for (const post of posts || []) {
      const pubDate = post.created_at
        ? new Date(post.created_at).toUTCString()
        : now;
      const categories = (post.tags || [])
        .map((t: string) => `    <category>${escapeXml(t)}</category>`)
        .join("\n");

      xml += `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
    <pubDate>${pubDate}</pubDate>
    <author>${escapeXml(post.author)}</author>
    <description>${escapeXml(post.excerpt)}</description>
${categories}
  </item>
`;
    }

    xml += `</channel>
</rss>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(`<error>${msg}</error>`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  }
});
