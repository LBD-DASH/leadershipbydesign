// Native Deno.serve

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate admin token
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== 'Bypass2024') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY');
    if (!APOLLO_API_KEY) {
      return new Response(JSON.stringify({ error: 'APOLLO_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const {
      person_titles = [],
      person_locations = [],
      organization_locations = [],
      organization_num_employees_ranges = [],
      q_keywords = '',
      page = 1,
      per_page = 25,
    } = body;

    // Build Apollo API request
    const apolloBody: Record<string, unknown> = {
      page,
      per_page,
    };

    if (person_titles.length > 0) apolloBody.person_titles = person_titles;
    if (person_locations.length > 0) apolloBody.person_locations = person_locations;
    if (organization_locations.length > 0) apolloBody.organization_locations = organization_locations;
    if (organization_num_employees_ranges.length > 0) apolloBody.organization_num_employees_ranges = organization_num_employees_ranges;
    if (q_keywords) apolloBody.q_keywords = q_keywords;

    console.log('Apollo search request:', JSON.stringify(apolloBody));

    const response = await fetch('https://api.apollo.io/api/v1/mixed_people/api_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': APOLLO_API_KEY,
      },
      body: JSON.stringify(apolloBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Apollo API error [${response.status}]:`, errorText);
      return new Response(JSON.stringify({ error: `Apollo API error: ${response.status}`, details: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    // Map Apollo results to our format
    const people = (data.people || []).map((p: any) => ({
      id: p.id,
      first_name: p.first_name || '',
      last_name: p.last_name || '',
      title: p.title || '',
      email: p.email || '',
      phone: p.phone_numbers?.[0]?.sanitized_number || '',
      company: p.organization?.name || '',
      company_size: p.organization?.estimated_num_employees || null,
      linkedin_url: p.linkedin_url || '',
      city: p.city || '',
      country: p.country || '',
    }));

    return new Response(JSON.stringify({
      people,
      pagination: {
        page: data.pagination?.page || page,
        per_page: data.pagination?.per_page || per_page,
        total_entries: data.pagination?.total_entries || 0,
        total_pages: data.pagination?.total_pages || 0,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Apollo search error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
