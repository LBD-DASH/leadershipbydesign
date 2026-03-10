import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateRequest {
  contentType: 'social_linkedin' | 'social_twitter' | 'blog_outline' | 'email';
  sourceType: 'service' | 'diagnostic' | 'blog' | 'topic';
  sourceReference?: string;
  customTopic?: string;
  tone?: 'professional' | 'conversational' | 'inspiring' | 'educational';
  count?: number; // Number of variations to generate
}

const SERVICE_CONTEXTS: Record<string, string> = {
  'executive-coaching': `Executive Coaching - One-on-one guidance for senior leaders using the SHIFT methodology. Focuses on leadership presence, strategic communication, decision-making, and influence. Includes assessments like 6 Human Needs Profile and Leadership Assessment.`,
  'shift-leadership': `SHIFT Leadership Development - Team-based programme building 5 core skills: Self-Management, Human Intelligence, Innovation, Focus, and Thinking. 12-week practical programme with workshops and coaching.`,
  'team-diagnostic': `Team Diagnostic - Free assessment measuring team clarity, motivation, and leadership. Helps identify whether teams need alignment, motivation, or leadership development workshops.`,
  'leadership-diagnostic': `Leadership Diagnostic - Free assessment measuring leadership across 5 levels: Productivity, Development, Purpose, Motivational, and Strategic leadership. Identifies primary leadership style and development areas.`,
  'shift-diagnostic': `SHIFT Skills Diagnostic - Free assessment measuring team capabilities across Self-Management, Human Intelligence, Innovation, Focus, and Thinking. Identifies strengths and development priorities.`,
  'alignment-workshop': `Alignment Workshop - Half-day or full-day team session focused on clarifying purpose, priorities, and roles. Helps teams get on the same page and reduce friction.`,
  'motivation-workshop': `Motivation Workshop - Team session exploring what drives engagement and how to sustain motivation. Based on the 6 Human Needs framework.`,
  'leadership-workshop': `Leadership Workshop - Practical session for developing team leadership capabilities. Covers decision-making, communication, and influence skills.`,
};

const PLATFORM_GUIDELINES = {
  social_linkedin: {
    maxLength: 3000,
    idealLength: '200-500 words',
    format: 'Professional but engaging. Use line breaks for readability. Include a call-to-action. Hashtags at the end (3-5 relevant ones).',
    example: 'Start with a hook or insight. Share a story or data point. Provide actionable value. End with a question or CTA.',
  },
  social_twitter: {
    maxLength: 280,
    idealLength: '200-280 characters',
    format: 'Punchy and direct. One key insight per post. Include 1-2 hashtags max.',
    example: 'Lead with the insight. Keep it memorable. Optional hashtag.',
  },
  blog_outline: {
    format: 'Structured outline with H2 sections, key points, and suggested word count per section.',
  },
  email: {
    format: 'Subject line, preview text, body with clear sections, and CTA.',
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, sourceType, sourceReference, customTopic, tone = 'professional', count = 3 }: GenerateRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context based on source
    let context = '';
    if (sourceType === 'service' && sourceReference && SERVICE_CONTEXTS[sourceReference]) {
      context = SERVICE_CONTEXTS[sourceReference];
    } else if (sourceType === 'topic' && customTopic) {
      context = customTopic;
    } else if (sourceReference) {
      context = `Topic: ${sourceReference}`;
    }

    const platformGuidelines = PLATFORM_GUIDELINES[contentType];

    const systemPrompt = `You are a marketing content specialist for Leadership by Design, a leadership development consultancy in South Africa founded by Kevin Britz.

BRAND VOICE:
- Expert but approachable
- Data-driven with practical insights
- Focus on behaviour change, not just theory
- South African context with global relevance
- Key methodology: SHIFT (Self-Management, Human Intelligence, Innovation, Focus, Thinking)

CONTENT GUIDELINES FOR ${contentType.toUpperCase()}:
${JSON.stringify(platformGuidelines, null, 2)}

TONE: ${tone}

Generate ${count} unique variations of ${contentType} content.

IMPORTANT:
- Each variation should take a different angle or hook
- Include practical value, not just promotion
- Reference real concepts from the SHIFT methodology
- End with engagement drivers (questions, CTAs)
- For LinkedIn, use emojis sparingly and professionally
- For Twitter/X, be concise and impactful

Return a JSON array with this structure:
{
  "variations": [
    {
      "title": "optional hook or headline",
      "content": "the main content",
      "hashtags": ["relevant", "hashtags"],
      "notes": "brief explanation of the angle taken"
    }
  ]
}`;

    const userPrompt = `Generate ${contentType} content about: ${context}

Remember to create ${count} distinct variations with different angles and hooks.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No content generated");
    }

    // Parse the JSON response
    let parsed;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, aiContent];
      const jsonStr = jsonMatch[1] || aiContent;
      parsed = JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent);
      // Return raw content if JSON parsing fails
      parsed = {
        variations: [{
          title: "Generated Content",
          content: aiContent,
          hashtags: [],
          notes: "Raw AI response"
        }]
      };
    }

    return new Response(JSON.stringify({
      success: true,
      contentType,
      sourceType,
      sourceReference,
      variations: parsed.variations || parsed,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate content" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
