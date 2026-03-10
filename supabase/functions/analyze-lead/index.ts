// Native Deno.serve

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadAnalysisRequest {
  leadData: {
    name: string;
    email: string;
    role?: string;
    organisation?: string;
    company?: string;
    message?: string;
    followUpPreference?: string;
    source: string;
  };
  leadScore: {
    score: number;
    temperature: string;
    buyerPersona: string;
    companySize: string;
    urgency: string;
  };
  diagnosticContext?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { leadData, leadScore, diagnosticContext }: LeadAnalysisRequest = await req.json();

    const prompt = `You are an expert sales analyst for Leadership by Design, a premium leadership development consultancy run by Kevin Britz in South Africa.

Analyze this lead and provide strategic insights for follow-up:

LEAD DETAILS:
- Name: ${leadData.name}
- Email: ${leadData.email}
- Role: ${leadData.role || 'Not provided'}
- Company/Organisation: ${leadData.organisation || leadData.company || 'Not provided'}
- Source: ${leadData.source}
- Follow-up Preference: ${leadData.followUpPreference || 'Not specified'}
${leadData.message ? `- Message: "${leadData.message}"` : ''}
${diagnosticContext ? `- ${diagnosticContext}` : ''}

SCORING:
- Lead Score: ${leadScore.score}/100 (${leadScore.temperature.toUpperCase()})
- Buyer Persona: ${leadScore.buyerPersona}
- Company Size: ${leadScore.companySize}
- Urgency: ${leadScore.urgency}

Provide a concise analysis (max 200 words) with:
1. **Buyer Profile**: Who is this person likely to be? What's their probable situation?
2. **Pain Points**: What leadership challenges are they likely facing based on their diagnostic/inquiry?
3. **Recommended Approach**: How should Kevin approach this conversation?
4. **Opening Line**: A personalized opening line for the first email/call

Keep it practical and actionable. Focus on value Kevin can provide.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.content?.[0]?.text || "Unable to generate analysis";

    return new Response(
      JSON.stringify({ analysis }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-lead function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        analysis: "AI analysis unavailable - proceed with manual assessment" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
