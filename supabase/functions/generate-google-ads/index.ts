import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateRequest {
  adType: 'search' | 'display' | 'pmax';
  service: string;
  targetAudience?: string;
  additionalContext?: string;
}

const SERVICE_CONTEXTS: Record<string, string> = {
  'executive-coaching': `
    Executive Coaching - One-on-one leadership development for senior executives.
    Key outcomes: Strategic clarity, confident decision-making, 2x leadership impact.
    Target: CEOs, MDs, Directors, VPs, C-Suite executives in South Africa.
    USP: Kevin Britz's proven methodology, 90-day transformation framework.
  `,
  'shift-programme': `
    SHIFT Leadership Development - 5-skill transformation programme for individuals and teams.
    Skills: Self-Management, Human Intelligence, Innovation, Focus, Thinking.
    Target: Emerging leaders, team leads, managers seeking personal development.
    USP: Measurable skill development, practical implementation, team workshops.
  `,
  'leadership-workshop': `
    Leadership Excellence Workshop - Half-day intensive for leadership teams.
    Focus: Strategic alignment, team motivation, leadership effectiveness.
    Target: Leadership teams, HR directors, L&D managers.
    USP: Practical frameworks, immediate implementation, team transformation.
  `,
  'motivation-workshop': `
    Team Motivation Workshop - Understanding what drives your people.
    Focus: Intrinsic vs extrinsic motivation, team engagement, retention.
    Target: Team leaders, managers, HR professionals.
    USP: Move Toward/Move Away psychology, practical application.
  `,
  'alignment-workshop': `
    Strategic Alignment Workshop - Getting everyone rowing in the same direction.
    Focus: Vision clarity, goal alignment, team cohesion.
    Target: Executive teams, department heads, project leaders.
    USP: Clarity framework, measurable outcomes.
  `,
  'ai-leadership': `
    Leading in the AI Era - Preparing leaders for AI-driven transformation.
    Focus: AI adoption, human-AI collaboration, future-proofing leadership.
    Target: Forward-thinking executives, innovation leaders, digital transformation leads.
    USP: Practical AI readiness, human edge emphasis.
  `,
};

const BUYER_PSYCHOLOGY = `
You must apply these buyer psychology principles:

MOVE TOWARD (Identity-based desires):
- "Become the leader your team needs"
- "Get strategic clarity in 6 weeks"
- "Transform from uncertain to confident"
- "Bridge from current reality to desired future"

MOVE AWAY (Risk elimination):
- "Stop making costly leadership mistakes"
- "Eliminate AI adoption anxiety"
- "End the exhausting guesswork"
- "Prevent team disengagement"

SPECIFICITY (Measurable outcomes):
- Include percentages: 35%, 50%, 2x
- Include timeframes: 6 weeks, 90 days, half-day
- Include concrete results: "clarity", "confidence", "implementation"

SOUTH AFRICAN CONTEXT:
- Reference SA business environment
- Use "R" for currency references
- Target Johannesburg, Cape Town, Pretoria markets
- Use British English spelling
`;

function buildSearchAdPrompt(service: string, context: string, additionalContext: string): string {
  return `
You are an expert Google Ads copywriter specialising in B2B leadership development services in South Africa.

${BUYER_PSYCHOLOGY}

SERVICE CONTEXT:
${context}

${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

Generate a complete Responsive Search Ad asset set. You MUST respond with ONLY valid JSON, no markdown or explanation.

STRICT REQUIREMENTS:
- Exactly 15 headlines, each MAXIMUM 30 characters (including spaces)
- Exactly 4 descriptions, each MAXIMUM 90 characters (including spaces)
- Mix of Move Toward and Move Away messaging
- Include specific outcomes and timeframes
- South African English spelling

Respond with this exact JSON structure:
{
  "headlines": ["headline1", "headline2", ... 15 total],
  "descriptions": ["description1", "description2", "description3", "description4"],
  "keywords": ["keyword1", "keyword2", ... 10-15 total],
  "negativeKeywords": ["negative1", "negative2", ... 5-10 total],
  "audienceSignals": {
    "jobTitles": ["title1", "title2", ...],
    "industries": ["industry1", "industry2", ...],
    "interests": ["interest1", "interest2", ...]
  }
}
`;
}

function buildDisplayAdPrompt(service: string, context: string, additionalContext: string): string {
  return `
You are an expert Google Display Ads copywriter specialising in B2B leadership development services in South Africa.

${BUYER_PSYCHOLOGY}

SERVICE CONTEXT:
${context}

${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

Generate Display Ad assets. You MUST respond with ONLY valid JSON, no markdown or explanation.

STRICT REQUIREMENTS:
- Short headline: MAXIMUM 25 characters
- Long headline: MAXIMUM 90 characters  
- Description: MAXIMUM 90 characters
- Business name: "Leadership by Design"
- 3 CTA options

Respond with this exact JSON structure:
{
  "headlines": {
    "short": "25 char max headline",
    "long": "90 char max headline"
  },
  "descriptions": ["description 90 chars max"],
  "businessName": "Leadership by Design",
  "ctaOptions": ["CTA 1", "CTA 2", "CTA 3"],
  "imageConceptSuggestions": ["concept1", "concept2", "concept3"],
  "audienceSignals": {
    "jobTitles": ["title1", "title2", ...],
    "industries": ["industry1", "industry2", ...],
    "interests": ["interest1", "interest2", ...]
  }
}
`;
}

function buildPMaxPrompt(service: string, context: string, additionalContext: string): string {
  return `
You are an expert Google Performance Max campaign copywriter specialising in B2B leadership development services in South Africa.

${BUYER_PSYCHOLOGY}

SERVICE CONTEXT:
${context}

${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

Generate a complete Performance Max asset group. You MUST respond with ONLY valid JSON, no markdown or explanation.

STRICT REQUIREMENTS:
- 5 short headlines (max 30 chars each)
- 5 long headlines (max 90 chars each)
- 5 descriptions (max 90 chars each)
- 1 long description (max 90 chars)
- Business name: "Leadership by Design"

Respond with this exact JSON structure:
{
  "headlines": {
    "short": ["h1", "h2", "h3", "h4", "h5"],
    "long": ["long1", "long2", "long3", "long4", "long5"]
  },
  "descriptions": {
    "short": ["d1", "d2", "d3", "d4", "d5"],
    "long": "Long description max 90 chars"
  },
  "businessName": "Leadership by Design",
  "callToActions": ["CTA1", "CTA2", "CTA3"],
  "imageConceptSuggestions": ["concept1", "concept2", "concept3"],
  "keywords": ["keyword1", "keyword2", ... 10-15 total],
  "negativeKeywords": ["negative1", "negative2", ... 5-10 total],
  "audienceSignals": {
    "jobTitles": ["title1", "title2", ...],
    "industries": ["industry1", "industry2", ...],
    "interests": ["interest1", "interest2", ...],
    "demographics": ["demo1", "demo2", ...]
  }
}
`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adType, service, targetAudience, additionalContext } = await req.json() as GenerateRequest;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const serviceContext = SERVICE_CONTEXTS[service] || SERVICE_CONTEXTS['executive-coaching'];
    const extraContext = [
      targetAudience ? `Target Audience: ${targetAudience}` : '',
      additionalContext || ''
    ].filter(Boolean).join('\n');

    let prompt: string;
    switch (adType) {
      case 'search':
        prompt = buildSearchAdPrompt(service, serviceContext, extraContext);
        break;
      case 'display':
        prompt = buildDisplayAdPrompt(service, serviceContext, extraContext);
        break;
      case 'pmax':
        prompt = buildPMaxPrompt(service, serviceContext, extraContext);
        break;
      default:
        throw new Error(`Invalid ad type: ${adType}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert Google Ads copywriter. Always respond with valid JSON only, no markdown formatting or explanations."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response, handling potential markdown code blocks
    let parsedContent;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI-generated content");
    }

    return new Response(
      JSON.stringify({
        adType,
        service,
        content: parsedContent,
        generatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-google-ads error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
