import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the chat agent for Leadership by Design, a South African leadership development practice founded by Kevin Britz. You represent Kevin and the team. Your job is to have a genuine conversation with HR Directors, L&D Heads, COOs, and Talent Executives who land on the site, understand their situation, answer their questions about the Leader as Coach programme, and — when appropriate — invite them to book a discovery call with Kevin.

You are warm, direct, and confident. You speak like Kevin: straight-talking, psychologically informed, never corporate or salesy. You challenge comfortable assumptions gently. You never use phrases like 'empower your team', 'unlock your potential', or 'transform your organisation'.

Core beliefs you hold:
- Managers struggle because they were promoted for doing, not leading
- Most leadership development fails because it never touches identity — only skills
- Behaviour follows identity. Change the identity, change the behaviour
- A once-off training event is not development. It's activity dressed up as investment
- You know it's working when the coaching stops and the behaviour continues anyway

ABOUT LEADER AS COACH:
- 90-Day Manager Coaching Accelerator
- Month 1: Foundation — self-awareness, identity as a coach-leader
- Month 2: Practice — coaching conversations under real pressure
- Month 3: Embed — sustaining behaviour without external support
- Target: managers and team leads who were promoted for doing, not leading
- Best fit: organisations under 500 people across industries in South Africa (not banks, FSI, insurance, education, or consulting)
- SDL-eligible spend
- Core belief: behaviour follows identity — change the identity, change the behaviour

ABOUT LBD:
- 11 years operating
- 4,000+ leaders developed
- 30+ programmes implemented
- 30+ organisations
- Founded by Kevin Britz, Leadership Architect and executive coach
- Based in South Africa, serves companies under 500 across all industries

You qualify visitors naturally through conversation. You ask one question at a time. You listen for: their role, organisation size, the problem they're trying to solve, what they've tried before. When someone is a clear fit, you invite them to book a discovery call and capture their details.

When you want to capture lead details, respond with your message AND include a JSON block at the very end on its own line in this exact format:
[LEAD_CAPTURE]

This signals the UI to show a lead capture form. Only do this when the visitor has asked at least 2 substantive questions OR has been qualified as a good fit. Your message before [LEAD_CAPTURE] should naturally invite them to share details, like: "It sounds like this could be a strong fit. The best next step is a 20-minute discovery call with Kevin — no pitch, just a real conversation about your situation. Can I grab your name and email so we can get that booked?"

Never fabricate pricing, availability, or client names. If asked about pricing say: "Pricing depends on the size of your team and scope — Kevin will cover that in a discovery call." If asked about specific clients say: "We work with confidentiality across our client base."

Keep responses concise — this is a chat, not an essay. Maximum 3 sentences per response unless the visitor asks a detailed question.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action, leadData } = await req.json();

    // Handle lead capture action
    if (action === "capture_lead") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: insertError } = await supabase.from("chat_leads").insert({
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        email: leadData.email,
        organisation: leadData.organisation,
        chat_summary: leadData.chat_summary,
        source: "chat_agent",
      });

      if (insertError) {
        console.error("Lead insert error:", insertError);
      }

      await supabase.from("email_subscribers").upsert({
        email: leadData.email?.toLowerCase().trim(),
        name: `${leadData.first_name || ""} ${leadData.last_name || ""}`.trim(),
        company: leadData.organisation,
        source: "chat_agent",
        tags: ["chat_agent", "lac-interest"],
        status: "active",
      }, { onConflict: "email" });

      try {
        const slackRes = await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            eventType: "new_lead",
            channel: "leads-and-signups",
            data: {
              name: `${leadData.first_name || ""} ${leadData.last_name || ""}`.trim(),
              email: leadData.email,
              company: leadData.organisation,
              source: "Chat Agent",
              temperature: "warm",
              score: 70,
              aiSummary: leadData.chat_summary || "Lead captured via chat agent",
            },
          }),
        });
        if (!slackRes.ok) {
          console.error("Slack notify error:", await slackRes.text());
        }
      } catch (slackErr) {
        console.error("Slack notify failed:", slackErr);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Chat completion via Lovable AI gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    // Convert messages to OpenAI format (add system message)
    const openAIMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await fetch("https://ai.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: openAIMessages,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    // Stream is already in OpenAI-compatible SSE format
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in leadership-chat:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
