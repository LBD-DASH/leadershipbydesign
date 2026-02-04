const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface DiscoveryRequest {
  industry: string;
  location: string;
  companySize: string;
  targetContacts: 'hr' | 'csuite' | 'both';
}

interface DiscoveredCompany {
  company_name: string;
  website_url: string;
  industry: string;
  location: string;
  description: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { industry, location, companySize, targetContacts } = await req.json() as DiscoveryRequest;

    if (!industry || !location) {
      return new Response(
        JSON.stringify({ success: false, error: 'Industry and location are required' }),
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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query for Firecrawl
    const sizeLabel = companySize === '50-200' ? 'SME' : companySize === '200-500' ? 'mid-market' : 'companies';
    const searchQuery = `${industry} companies in ${location} South Africa ${sizeLabel} employee size site:.co.za OR site:.com`;
    
    console.log('Searching for companies with query:', searchQuery);

    // Step 1: Use Firecrawl search to find company websites
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20,
      }),
    });

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error('Firecrawl search error:', searchData);
      return new Response(
        JSON.stringify({ success: false, error: searchData.error || 'Search failed' }),
        { status: searchResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchResults = searchData.data || [];
    console.log('Found', searchResults.length, 'search results');

    if (searchResults.length === 0) {
      return new Response(
        JSON.stringify({ success: true, data: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Use Lovable AI to analyze and structure the results
    const contactFocus = targetContacts === 'hr' 
      ? 'HR/People contacts (Head of HR, People & Culture Manager, Talent Director)'
      : targetContacts === 'csuite'
      ? 'C-Suite executives (CEO, MD, COO, Founder)'
      : 'Both HR/People contacts AND C-Suite executives';

    const analysisPrompt = `You are a B2B lead generation specialist. Analyze these search results and extract company information for a leadership development consultancy targeting ${industry} companies in ${location}.

SEARCH RESULTS:
${JSON.stringify(searchResults.slice(0, 15), null, 2)}

TARGET CRITERIA:
- Industry: ${industry}
- Location: ${location}, South Africa
- Company Size: ${companySize} employees
- Contact Focus: ${contactFocus}

TASK:
Filter and structure these results into a list of valid B2B prospects. For each company:
1. Verify it appears to be a real company in the target industry
2. Extract the company name and website URL
3. Provide a brief description of what they do
4. Estimate their location within Gauteng if possible

Return a JSON array of objects with these fields:
- company_name: The company name
- website_url: Their website URL (validated, must start with http)
- industry: Their specific industry sub-sector
- location: Their location (city/area in Gauteng)
- description: 1-2 sentences about what they do

RULES:
- Only include companies that genuinely match the criteria
- Exclude job boards, directories, or aggregator sites
- Exclude international companies without local presence
- Maximum 10 companies in the result
- Respond ONLY with valid JSON array, no markdown`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    console.log('AI analysis complete');

    // Parse the AI response
    let companies: DiscoveredCompany[] = [];
    try {
      const cleanJson = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      companies = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiContent);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse discovery results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Discovered', companies.length, 'companies');

    return new Response(
      JSON.stringify({ success: true, data: companies }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error discovering companies:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to discover companies';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
