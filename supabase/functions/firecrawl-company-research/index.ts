const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface CompanyResearchRequest {
  url: string;
}

interface CompanyIntelligence {
  company_name: string;
  website_url: string;
  industry: string | null;
  company_size: string | null;
  about_summary: string | null;
  leadership_team: { name: string; role: string }[] | null;
  pain_points: string[] | null;
  opportunity_signals: string[] | null;
  personalised_pitch: string | null;
  suggested_approach: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json() as CompanyResearchRequest;

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Researching company:', formattedUrl);

    // Step 1: Scrape the website using Firecrawl
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error('Firecrawl API error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: scrapeData.error || `Scrape failed with status ${scrapeResponse.status}` }),
        { status: scrapeResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const websiteContent = scrapeData.data?.markdown || scrapeData.markdown || '';
    const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};
    
    console.log('Website scraped successfully, content length:', websiteContent.length);

    // Step 2: Use AI to analyze the company
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisPrompt = `You are an expert business intelligence analyst for a leadership development consultancy. Analyze this company website content and extract key information for sales outreach.

WEBSITE URL: ${formattedUrl}
PAGE TITLE: ${metadata.title || 'Unknown'}

WEBSITE CONTENT:
${websiteContent.substring(0, 15000)}

Based on this content, provide a JSON response with the following structure:
{
  "company_name": "The company name",
  "industry": "Their industry sector",
  "company_size": "Estimate: startup, SME, mid-market, enterprise, or unknown",
  "about_summary": "2-3 sentence summary of what they do",
  "leadership_team": [{"name": "Person Name", "role": "Their Role"}] or null if not found,
  "pain_points": ["Likely leadership challenges based on their context", "Another challenge"],
  "opportunity_signals": ["Signals that suggest they need leadership development", "Growth signals"],
  "personalised_pitch": "A 3-4 sentence personalized outreach message that references their specific situation and offers leadership development solutions. Use a consultative, value-first approach. Focus on their 'move away from' pain and 'move toward' aspirations.",
  "suggested_approach": "One of: 'executive_coaching', 'team_workshop', 'shift_programme', 'leadership_diagnostic', or 'discovery_call' - with brief reasoning"
}

Focus on:
1. Leadership challenges they might face (scaling teams, culture, performance)
2. Growth signals (hiring, expansion, new products)
3. Pain points visible in their messaging
4. Personalization hooks for outreach

Respond ONLY with valid JSON, no markdown formatting.`;

    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.content?.[0]?.text || '';
    
    console.log('AI analysis complete');

    // Parse the AI response
    let intelligence: Partial<CompanyIntelligence>;
    try {
      // Clean up potential markdown formatting
      const cleanJson = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      intelligence = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiContent);
      
      // Return partial data
      intelligence = {
        company_name: metadata.title || new URL(formattedUrl).hostname,
        about_summary: 'Unable to fully analyze - manual review recommended',
        pain_points: null,
        opportunity_signals: null,
        personalised_pitch: null,
        suggested_approach: 'discovery_call',
      };
    }

    // Build final response
    const result: CompanyIntelligence = {
      company_name: intelligence.company_name || metadata.title || new URL(formattedUrl).hostname,
      website_url: formattedUrl,
      industry: intelligence.industry || null,
      company_size: intelligence.company_size || null,
      about_summary: intelligence.about_summary || null,
      leadership_team: intelligence.leadership_team || null,
      pain_points: intelligence.pain_points || null,
      opportunity_signals: intelligence.opportunity_signals || null,
      personalised_pitch: intelligence.personalised_pitch || null,
      suggested_approach: intelligence.suggested_approach || null,
    };

    console.log('Company research complete:', result.company_name);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error researching company:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to research company';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
