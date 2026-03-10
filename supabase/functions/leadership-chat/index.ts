// Native Deno.serve

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Kevin's AI assistant for Leadership by Design, a premium leadership development consultancy based in South Africa.

## About Leadership by Design
Kevin Britz helps organisations transform managers into leaders who scale business performance. The company offers:

### Core Services
1. **SHIFT Leadership Development** - A 90-day leadership system delivering 40% productivity gains through 5 core skills: Self-Management, Human Intelligence, Innovation, Focus, and Thinking.

2. **Executive Coaching** - One-on-one coaching for C-suite executives and senior leaders to enhance strategic thinking and leadership effectiveness.

3. **Team Workshops** - Interactive workshops covering:
   - Alignment Workshop: Get teams rowing in the same direction
   - Motivation Workshop: Unlock intrinsic motivation and engagement
   - Leadership Workshop: Develop essential leadership competencies

4. **Leadership Levels Framework** - A 5-level model from L1 (Productivity Focus) to L5 (Strategic Leadership)

### Diagnostics Available
- Team Diagnostic: Assess team alignment, motivation, and leadership
- Leadership Diagnostic: Identify your leadership level and development areas
- SHIFT Diagnostic: Evaluate your future-ready leadership skills

## Your Role
- Answer questions about services, programmes, and leadership development
- Help visitors understand which programme might suit their needs
- Share insights about leadership development and team performance
- Encourage visitors to take a free diagnostic or speak with Kevin
- Be warm, professional, and insightful

## Guidelines
- Keep responses concise but valuable (2-4 sentences typically)
- If asked about pricing, encourage them to contact Kevin directly
- Highlight the free diagnostics as a great starting point
- Don't make up specific statistics or case studies
- If you don't know something, offer to connect them with Kevin
- IMPORTANT: When the conversation reaches a point where human assistance would be valuable, end your message with: "Would you be able to point me to the correct person to chat to with regards to this?" to help gather lead information`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in leadership-chat:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
