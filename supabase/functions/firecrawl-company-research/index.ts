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
  // Enhanced contact extraction
  contact_email: string | null;
  contact_phone: string | null;
  contact_name: string | null;
  contact_role: string | null;
  physical_address: string | null;
  linkedin_url: string | null;
  // HR/L&D/People leadership for LinkedIn outreach - PRIMARY FOCUS
  hr_contacts: { name: string; role: string; linkedin_search_url: string }[] | null;
  // Enhanced AI insights for email personalization
  industry_insight: string | null;
  recommended_diagnostic: string | null;
  recommended_product: string | null;
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

    // Format and validate URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Validate URL format - must have a valid domain (no spaces, must have TLD)
    try {
      const urlObj = new URL(formattedUrl);
      // Check for spaces in hostname (invalid)
      if (urlObj.hostname.includes(' ') || !urlObj.hostname.includes('.')) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Please enter a valid website URL (e.g., example.com or https://example.com), not a company name.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid website URL (e.g., example.com or https://example.com), not a company name.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Researching company:', formattedUrl);

    // Step 1: Scrape the website using Firecrawl with extended timeout
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
        timeout: 60000, // 60 second timeout for slow sites
        waitFor: 3000, // Wait 3 seconds for JS to render
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

    // Step 2: Use AI to analyze the company - HR-FIRST FOCUS
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisPrompt = `You are an expert business intelligence analyst for a leadership development consultancy. Your PRIMARY goal is to find HR/People/L&D decision-makers for sales outreach.

WEBSITE URL: ${formattedUrl}
PAGE TITLE: ${metadata.title || 'Unknown'}

WEBSITE CONTENT:
${websiteContent.substring(0, 15000)}

Based on this content, provide a JSON response with the following structure:
{
  "company_name": "The company name",
  "industry": "Their industry sector",
  "company_size": "Estimate: startup (<50), SME (50-200), mid-market (200-800), or enterprise (800+)",
  "about_summary": "2-3 sentence summary of what they do",
  
  "hr_contacts": [
    {"name": "Full Name", "role": "Exact Role Title"}
  ],
  
  "leadership_team": [{"name": "Person Name", "role": "Their Role"}] or null if not found,
  "pain_points": ["Likely leadership challenges based on their context", "Another challenge"],
  "opportunity_signals": ["Signals that suggest they need leadership development", "Growth signals"],
  "personalised_pitch": "Write this as Kevin Britz — a straight-talking South African leadership coach who's worked with 4,000+ leaders. The tone should feel like a personal note from one professional to another, NOT a corporate sales email. Use 'I' not 'we'. Be warm, direct, and human.\\n\\nRULES:\\n- First paragraph: Reference ONE specific thing about THEIR company that genuinely caught your eye (a project, a value, a leader's quote). Keep it real — don't list multiple facts like a research report. 2 sentences max.\\n- Second paragraph: Share a relatable observation about a challenge companies like theirs face — frame it as something you've SEEN happen, not a generic industry statement. Use conversational language like 'What I've noticed is...' or 'The thing is...' — NOT corporate phrases like 'Your HR team likely faces challenges in...' Keep it to 2-3 sentences.\\n- Third paragraph: Make a casual, zero-pressure ask. Something like 'Would you be up for a quick chat?' or 'Happy to share what's worked if you're curious.' 1-2 sentences max.\\n- Sign off as: — Kevin, Leadership by Design\\n- Total length: Under 150 words. Shorter is better.\\n- NEVER use phrases like: 'I noticed your impressive...', 'particularly caught my attention', 'Would you be open to a brief 15-minute conversation', 'I'd love to share some insights'. These sound robotic.",
  "suggested_approach": "One of: 'executive_coaching', 'team_workshop', 'shift_programme', 'leadership_diagnostic', or 'discovery_call' - with brief reasoning",
  "contact_email": "Extract any business email address found (info@, hello@, hr@, people@, or personal) or null",
  "contact_phone": "Extract any phone number found or null",
  "contact_name": "Name of HR/People decision maker if found, otherwise CEO/MD, or null",
  "contact_role": "Role of the contact (prefer HR/People roles over executive roles)",
  "physical_address": "Physical office address if found or null",
  "linkedin_url": "LinkedIn profile or company URL if found or null",
  "industry_insight": "One specific, data-driven insight about leadership challenges in this company's industry. Make it specific to HR concerns like turnover, engagement, or manager effectiveness. Example: 'Mining companies scaling past 500 employees typically see a 40% drop in frontline supervisor effectiveness.'",
  "recommended_diagnostic": "Which diagnostic fits: 'shift_diagnostic' (team performance), 'leadership_diagnostic' (individual leaders), 'team_diagnostic' (team alignment), or 'ai_readiness_diagnostic' (tech companies)",
  "recommended_product": "Which product is most relevant: 'executive_coaching', 'team_workshop_alignment', 'team_workshop_motivation', 'team_workshop_leadership', 'shift_programme', or 'contagious_identity'"
}

CRITICAL - HR/PEOPLE CONTACT EXTRACTION (PRIMARY PRIORITY):
Look EXTREMELY carefully for any names and roles related to these HR/People functions. These are your PRIMARY targets:

SOUTH AFRICAN HR TITLES TO FIND:
- Head of HR / HR Director / HR Manager / HR Business Partner
- Chief People Officer / Head of People / People Director / People Manager
- Head of Learning & Development / L&D Director / L&D Manager / Training Manager
- Head of Talent / Talent Director / Talent Acquisition Manager
- Head of Organisational Development / OD Manager
- CHRO / Chief Human Resources Officer
- VP People / VP Human Resources

INDUSTRY-SPECIFIC TITLES:
- Mining/Manufacturing: Training & Development Officer, Industrial Relations Manager, SHEQ Manager, Plant HR Manager
- Tech: VP People, Employee Experience Lead, Head of People Ops, Chief People Officer
- Engineering: HR Business Partner, Talent Development Manager

If you find ANY person with these role titles, include them in hr_contacts. This is the MOST IMPORTANT field.

If no specific HR person is found, look for:
1. Team page or About Us page mentions
2. LinkedIn company page references
3. Press releases mentioning HR hires
4. Job listings indicating HR team members

FALLBACK: If no email is found on the website, generate a likely email format: info@domain.com

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
        max_tokens: 2500,
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
      
      // Return partial data with fallback email
      const domain = new URL(formattedUrl).hostname.replace('www.', '');
      intelligence = {
        company_name: metadata.title || new URL(formattedUrl).hostname,
        about_summary: 'Unable to fully analyze - manual review recommended',
        pain_points: null,
        opportunity_signals: null,
        personalised_pitch: null,
        suggested_approach: 'discovery_call',
        contact_email: `info@${domain}`,
      };
    }

    // Build HR contacts with LinkedIn search URLs
    const companyName = intelligence.company_name || metadata.title || new URL(formattedUrl).hostname;
    const hrContacts = intelligence.hr_contacts?.map(contact => ({
      name: contact.name,
      role: contact.role,
      linkedin_search_url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(contact.name + ' ' + companyName)}&origin=GLOBAL_SEARCH_HEADER`
    })) || null;

    // Fallback email if none found
    let contactEmail = intelligence.contact_email;
    if (!contactEmail) {
      try {
        const domain = new URL(formattedUrl).hostname.replace('www.', '');
        contactEmail = `info@${domain}`;
      } catch {
        contactEmail = null;
      }
    }

    // Build final response
    const result: CompanyIntelligence = {
      company_name: companyName,
      website_url: formattedUrl,
      industry: intelligence.industry || null,
      company_size: intelligence.company_size || null,
      about_summary: intelligence.about_summary || null,
      leadership_team: intelligence.leadership_team || null,
      pain_points: intelligence.pain_points || null,
      opportunity_signals: intelligence.opportunity_signals || null,
      personalised_pitch: intelligence.personalised_pitch || null,
      suggested_approach: intelligence.suggested_approach || null,
      contact_email: contactEmail,
      contact_phone: intelligence.contact_phone || null,
      contact_name: intelligence.contact_name || null,
      contact_role: intelligence.contact_role || null,
      physical_address: intelligence.physical_address || null,
      linkedin_url: intelligence.linkedin_url || null,
      hr_contacts: hrContacts,
      // Enhanced AI insights
      industry_insight: intelligence.industry_insight || null,
      recommended_diagnostic: intelligence.recommended_diagnostic || null,
      recommended_product: intelligence.recommended_product || null,
    };

    console.log('Company research complete:', result.company_name, 'HR contacts found:', hrContacts?.length || 0);

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
