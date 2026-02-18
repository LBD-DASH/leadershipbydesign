import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const SITE_URL = "https://leadershipbydesign.co";

const TOOLS = [
  {
    name: "list_blog_posts",
    description: "List all published blog posts from Leadership by Design. Returns title, slug, excerpt, date, tags.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max posts to return (default 20, max 50)" },
      },
    },
  },
  {
    name: "get_blog_post",
    description: "Get the full content of a specific blog post by slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "The blog post slug" },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_programmes",
    description: "List all leadership development programmes offered by Leadership by Design.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_products",
    description: "List all digital products available from Leadership by Design.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_diagnostics",
    description: "List all free diagnostic assessments available.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_company_info",
    description: "Get information about Leadership by Design, the company, its founder Kevin Britz, and its philosophy.",
    inputSchema: { type: "object", properties: {} },
  },
];

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );
}

async function handleToolCall(name: string, args: Record<string, unknown>) {
  const supabase = getSupabase();

  switch (name) {
    case "list_blog_posts": {
      const limit = Math.min(Number(args.limit) || 20, 50);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title, author, date, excerpt, tags")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []).map((p) => ({ ...p, url: `${SITE_URL}/blog/${p.slug}` }));
    }

    case "get_blog_post": {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title, author, author_role, date, excerpt, content, tags")
        .eq("slug", args.slug as string)
        .eq("published", true)
        .maybeSingle();
      if (error || !data) throw new Error("Post not found");
      return { ...data, url: `${SITE_URL}/blog/${data.slug}` };
    }

    case "list_programmes":
      return [
        { name: "SHIFT Leadership Development", url: `${SITE_URL}/programmes/shift-leadership-development`, description: "Comprehensive programme built on five essential skills: Focus, Self-Management, Thinking, Human Intelligence, and Innovation." },
        { name: "Executive Coaching", url: `${SITE_URL}/executive-coaching`, description: "One-on-one coaching for senior leaders using the Contagious Identity framework." },
        { name: "Contagious Identity Coaching", url: `${SITE_URL}/contagious-identity`, description: "Deep personal leadership coaching to discover and amplify your unique leadership identity." },
        { name: "Leader as Coach Programme", url: `${SITE_URL}/leader-as-coach-programme`, description: "10-month programme transforming managers into coaching leaders." },
      ];

    case "list_products":
      return [
        { name: "The New Manager Survival Kit", price: "R297", url: `${SITE_URL}/new-manager-kit` },
        { name: "Difficult Conversations Playbook", price: "R197", url: `${SITE_URL}/difficult-conversations` },
        { name: "Contagious Identity Workbook", price: "R397", url: `${SITE_URL}/contagious-identity-workbook` },
        { name: "The Feedback Formula", price: "R197", url: `${SITE_URL}/feedback-formula` },
      ];

    case "list_diagnostics":
      return [
        { name: "Team Health Diagnostic", url: `${SITE_URL}/team-diagnostic`, description: "15-question assessment measuring team alignment, energy, and ownership." },
        { name: "Leadership Level Diagnostic", url: `${SITE_URL}/leadership-diagnostic`, description: "Assessment across 5 leadership levels." },
        { name: "SHIFT Skills Diagnostic", url: `${SITE_URL}/shift-diagnostic`, description: "Measures five essential leadership skills." },
        { name: "AI Readiness Diagnostic", url: `${SITE_URL}/ai-readiness`, description: "Assess your organisation's readiness for AI integration." },
      ];

    case "get_company_info":
      return {
        name: "Leadership by Design",
        founder: "Kevin Britz",
        website: SITE_URL,
        philosophy: "We believe the future of work is human. Our approach combines neuroscience, NLP, and practical leadership frameworks to develop leaders who create lasting impact.",
        methodology: "SHIFT — Five essential leadership skills: Focus, Self-Management, Thinking, Human Intelligence, and Innovation.",
        core_concept: "Contagious Identity — Helping leaders discover and amplify their unique leadership identity to create lasting organisational impact.",
        book: "The Future of Work is Human",
        podcast: "The Lunchtime Series (600+ episodes)",
        contact: `${SITE_URL}/contact`,
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { method, params, id, jsonrpc } = body;

    // JSON-RPC 2.0 handler for MCP protocol
    if (jsonrpc === "2.0") {
      let result: unknown;

      switch (method) {
        case "initialize":
          result = {
            protocolVersion: "2024-11-05",
            serverInfo: { name: "leadership-by-design", version: "1.0.0" },
            capabilities: { tools: {} },
          };
          break;

        case "tools/list":
          result = { tools: TOOLS };
          break;

        case "tools/call": {
          const toolName = params?.name as string;
          const toolArgs = (params?.arguments || {}) as Record<string, unknown>;
          const data = await handleToolCall(toolName, toolArgs);
          result = {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
          break;
        }

        default:
          return new Response(
            JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } }),
            { headers: corsHeaders }
          );
      }

      return new Response(
        JSON.stringify({ jsonrpc: "2.0", id, result }),
        { headers: corsHeaders }
      );
    }

    // Fallback: simple GET-style info
    return new Response(
      JSON.stringify({
        name: "Leadership by Design MCP Server",
        version: "1.0.0",
        protocol: "MCP (Model Context Protocol)",
        usage: "Send JSON-RPC 2.0 requests with methods: initialize, tools/list, tools/call",
        tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
      }, null, 2),
      { headers: corsHeaders }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32603, message: msg } }),
      { status: 500, headers: corsHeaders }
    );
  }
});
