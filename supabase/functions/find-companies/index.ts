import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { industry, location, companySize } = await req.json() as DiscoveryRequest;

    if (!industry || !location) {
      return new Response(
        JSON.stringify({ success: false, error: 'Industry and location are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase to check existing companies
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch existing company names to avoid duplicates
    const { data: existingCompanies } = await supabase
      .from('prospect_companies')
      .select('company_name, website_url')
      .limit(500);

    const existingNames = (existingCompanies || []).map(c => c.company_name.toLowerCase());
    const existingDomains = (existingCompanies || []).map(c => {
      try {
        return new URL(c.website_url).hostname.replace('www.', '');
      } catch {
        return '';
      }
    }).filter(Boolean);

    const exclusionList = existingNames.slice(0, 50).join(', '); // Limit to 50 for prompt size

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Size description for AI - strict 50-800 employee focus
    const sizeDescription = companySize === '50-200' 
      ? 'SME companies with 50-200 employees'
      : companySize === '200-500'
      ? 'mid-market companies with 200-500 employees'
      : companySize === '50-800'
      ? 'mid-market companies with 50-800 employees (NOT enterprise, NOT listed companies)'
      : 'mid-market companies with 50-500 employees';

    // Industry-specific focus for South Africa
    const industryContext: Record<string, string> = {
      'Manufacturing': 'manufacturing, industrial, production, FMCG, food processing, automotive parts, packaging companies',
      'Technology': 'software, IT services, fintech, digital agencies, SaaS, tech startups that have scaled',
      'Mining': 'mining services, mining contractors, equipment suppliers, exploration companies, mineral processing',
      'Engineering': 'engineering consulting, civil engineering, mechanical engineering, electrical contractors, project management firms',
    };

    console.log('Discovering companies:', { industry, location, companySize });

    // Build exclusion instruction if we have existing companies
    const exclusionInstruction = exclusionList 
      ? `\n\nALREADY IN DATABASE - DO NOT INCLUDE THESE COMPANIES:\n${exclusionList}\n\nYou MUST suggest DIFFERENT companies than those listed above.`
      : '';

    // Use Lovable AI to generate a list of real companies - HR-focused discovery
    const discoveryPrompt = `You are a B2B lead generation specialist for a leadership development consultancy targeting HR and People leaders in South Africa.

TASK: Generate a list of 8-10 REAL ${industry} companies (${industryContext[industry] || industry}) based in ${location}, South Africa that match these criteria:

STRICT REQUIREMENTS:
- Company Size: ${sizeDescription} - this is CRITICAL
- EXCLUDE: Listed companies on JSE, multinational headquarters, companies with "Holdings", "Group", "Limited" in their name
- EXCLUDE: Any company that clearly has 800+ employees (no Discovery, Sasol, Vodacom, MTN, etc.)
- FOCUS: Owner-managed businesses, family businesses, regional players, growth-stage companies
- These should be REAL companies that actually exist in South Africa
${exclusionInstruction}

TARGET COMPANIES:
- Mid-market companies that have scaled past the startup phase
- Companies likely to have an HR Manager, Head of People, or L&D function
- Companies experiencing growth challenges, high turnover, or leadership development needs

For each company, provide:
1. Company Name (must be a real South African company)
2. Website URL (must be a real, working URL - format: https://example.co.za)
3. Industry sub-sector
4. Location within ${location}
5. Brief description (1-2 sentences about what they do)

IMPORTANT:
- Only include companies you're confident are REAL South African companies
- Focus on companies in the 50-800 employee range
- Include a mix of well-known regional players and growing mid-market companies
- Website URLs must be real and accurate
- Prioritize companies likely to have HR/People leadership functions

Respond ONLY with a valid JSON array (no markdown):
[
  {
    "company_name": "Company Name",
    "website_url": "https://example.co.za",
    "industry": "Industry Sub-sector",
    "location": "City/Area",
    "description": "Brief description"
  }
]`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'user', content: discoveryPrompt }
        ],
        max_tokens: 3000,
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
        JSON.stringify({ success: false, error: 'AI discovery failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    console.log('AI discovery complete, parsing response');

    // Parse the AI response
    let companies: DiscoveredCompany[] = [];
    try {
      const cleanJson = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      companies = JSON.parse(cleanJson);
      
      // Validate and clean up the companies - filter out enterprise names and duplicates
      const enterpriseKeywords = ['holdings', 'group', 'limited', 'ltd', 'plc', 'inc'];
      companies = companies.filter(c => {
        const nameLower = c.company_name.toLowerCase();
        const hasEnterpriseKeyword = enterpriseKeywords.some(kw => nameLower.includes(kw));
        
        // Check if already in database by name
        const nameExists = existingNames.some(existing => 
          existing.includes(nameLower) || nameLower.includes(existing)
        );
        
        // Check if already in database by domain
        let domainExists = false;
        try {
          const newDomain = new URL(c.website_url).hostname.replace('www.', '');
          domainExists = existingDomains.some(existing => 
            existing === newDomain || existing.includes(newDomain) || newDomain.includes(existing)
          );
        } catch {}
        
        if (nameExists || domainExists) {
          console.log(`Filtering out duplicate: ${c.company_name}`);
        }
        
        return c.company_name && 
               c.website_url && 
               c.website_url.startsWith('http') &&
               !hasEnterpriseKeyword &&
               !nameExists &&
               !domainExists;
      }).slice(0, 10); // Limit to 10
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiContent.substring(0, 500));
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
