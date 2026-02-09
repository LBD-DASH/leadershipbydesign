import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a content strategist for Leadership by Design, an executive coaching company in South Africa with 11 years of experience across 3,000+ organizations.

The founder is Kevin. The company's core IP includes:
- The SHIFT Methodology™ (5 human performance skills: Self-Management, Human Intelligence, Innovation, Focus, Thinking)
- Contagious Identity (identity-driven leadership framework)
- Products: The New Manager Survival Kit (R497), The Difficult Conversations Playbook (R397), The Contagious Identity Workbook (R697)
- Executive Coaching (R15,000 for 6 sessions)
- Online tools: valuesblueprint.online, 6humanneeds.online, findmypurpose.me
- Website: leadershipbydesign.co
- Free Diagnostics: Team Diagnostic, Leadership Style Diagnostic, SHIFT Skills Diagnostic, AI Readiness Diagnostic

Given a YouTube video transcript, generate content assets in a structured JSON format.

IMPORTANT: Your entire response must be valid JSON. Do not include any text before or after the JSON object.`;

const CONTENT_GENERATION_PROMPT = `Analyze this video transcript and generate ALL of the following content assets as a single JSON object:

VIDEO TITLE: {title}
VIDEO URL: {videoUrl}

TRANSCRIPT:
{transcript}

Generate this exact JSON structure:

{
  "relevant_product": "string - one of: New Manager Survival Kit, Difficult Conversations Playbook, Contagious Identity Workbook, Executive Coaching",
  "relevant_diagnostic": "string - one of: Team Diagnostic, Leadership Style Diagnostic, SHIFT Skills Diagnostic, AI Readiness Diagnostic",
  
  "pdf_summary": {
    "title": "Compelling title (not just video title)",
    "takeaways": ["5-7 key bullet points"],
    "summary": "500-800 word detailed summary with clear headings (use ## for headings)",
    "action_steps": ["3-5 practical action steps"],
    "product_cta": {
      "product_name": "Most relevant product name",
      "product_description": "Brief compelling description",
      "product_price": "Price in Rands",
      "product_url": "URL to product page"
    },
    "diagnostic_cta": {
      "diagnostic_name": "Most relevant diagnostic",
      "diagnostic_description": "Why take this diagnostic",
      "diagnostic_url": "URL to diagnostic"
    }
  },
  
  "linkedin_long": "150-250 word post. Strong hook first line. Share 1 key insight. End with soft CTA. Add 3-5 hashtags at end.",
  
  "linkedin_short": "50-80 word quote or insight. Standalone thought. End with 'Full video: [link]'",
  
  "short_form_scripts": [
    {
      "title": "Script 1 title",
      "hook": "First 3 seconds - the scroll-stopping line",
      "body": "15-25 seconds - the core insight",
      "cta": "3-5 seconds - what to do next",
      "onscreen_text": ["Text overlays for each segment"]
    },
    {
      "title": "Script 2 title",
      "hook": "...",
      "body": "...",
      "cta": "...",
      "onscreen_text": ["..."]
    },
    {
      "title": "Script 3 title",
      "hook": "...",
      "body": "...",
      "cta": "...",
      "onscreen_text": ["..."]
    }
  ],
  
  "email_block": {
    "subject": "Compelling, curiosity-driven subject line",
    "preview": "40-60 character preview text",
    "body": "200-300 word email body with key insight + link to video + product CTA"
  },
  
  "blog_post": {
    "title": "SEO-optimized title with primary keyword",
    "meta_description": "150-160 character meta description",
    "content": "600-1000 word article with H2/H3 headings (use ## and ###), internal links to leadershipbydesign.co products, ends with CTA"
  },
  
  "twitter_thread": [
    "Tweet 1: Hook that grabs attention",
    "Tweet 2: First key point",
    "Tweet 3: Second key point",
    "Tweet 4: Third key point",
    "Tweet 5: Fourth key point",
    "Tweet 6: CTA to video or product"
  ]
}

Remember:
- Use Kevin's voice: direct, practical, experienced but approachable
- Reference South African business context where relevant
- Focus on actionable insights leaders can use immediately
- Product CTAs should feel natural, not salesy
- All links should use leadershipbydesign.co domain`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { transcript, videoTitle, videoUrl } = await req.json();

    if (!transcript || transcript.length < 100) {
      throw new Error("Transcript is required and must be at least 100 characters");
    }

    console.log(`Generating content for: ${videoTitle}`);
    console.log(`Transcript length: ${transcript.length} characters`);

    // Truncate transcript if too long (Claude has context limits)
    const maxTranscriptLength = 50000;
    const truncatedTranscript = transcript.length > maxTranscriptLength 
      ? transcript.substring(0, maxTranscriptLength) + "... [transcript truncated]"
      : transcript;

    const userPrompt = CONTENT_GENERATION_PROMPT
      .replace("{title}", videoTitle || "Untitled Video")
      .replace("{videoUrl}", videoUrl || "")
      .replace("{transcript}", truncatedTranscript);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const contentText = data.content[0]?.text || "";

    console.log("Raw AI response length:", contentText.length);

    // Parse the JSON response
    let parsedContent;
    try {
      // Try to extract JSON from the response (in case there's any surrounding text)
      const jsonMatch = contentText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Content preview:", contentText.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate required fields
    const requiredFields = [
      "relevant_product",
      "relevant_diagnostic",
      "pdf_summary",
      "linkedin_long",
      "linkedin_short",
      "short_form_scripts",
      "email_block",
      "blog_post",
      "twitter_thread",
    ];

    for (const field of requiredFields) {
      if (!parsedContent[field]) {
        console.warn(`Missing field: ${field}`);
      }
    }

    console.log("Successfully generated content assets");

    return new Response(
      JSON.stringify({
        success: true,
        data: parsedContent,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-content-assets:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
