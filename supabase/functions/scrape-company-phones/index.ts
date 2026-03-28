import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function requireAdmin(req: Request): Promise<Response | null> {
  const h = { ...corsHeaders, 'Content-Type': 'application/json' };
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: h });
  const token = auth.replace('Bearer ', '');
  if (token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) return null;
  const c = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error } = await c.auth.getUser();
  if (error || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: h });
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: role } = await db.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
  if (!role) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: h });
  return null;
}

/**
 * Scrapes company websites for phone numbers using Firecrawl.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authErr = await requireAdmin(req);
    if (authErr) return authErr;

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ error: 'Firecrawl connector not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { companies } = await req.json();
    // companies: [{ id, company, linkedin_url? }]

    if (!companies?.length) {
      return new Response(JSON.stringify({ error: 'No companies provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results: Array<{ id: string; phone: string | null; source: string }> = [];

    // Process up to 10 companies to stay within reasonable limits
    const batch = companies.slice(0, 10);

    for (const entry of batch) {
      try {
        // Build a search query to find company contact page
        const searchQuery = `${entry.company} contact phone number site:${guessDomain(entry.company)}`;

        // Use Firecrawl search to find contact pages
        const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `${entry.company} South Africa phone number contact`,
            limit: 3,
            scrapeOptions: { formats: ['markdown'] },
          }),
        });

        if (!searchRes.ok) {
          await searchRes.text();
          results.push({ id: entry.id, phone: null, source: 'search_failed' });
          continue;
        }

        const searchData = await searchRes.json();
        const pages = searchData.data || [];

        // Extract phone numbers from the markdown content
        let foundPhone: string | null = null;
        let source = '';

        for (const page of pages) {
          const content = page.markdown || page.description || '';
          const phones = extractSAPhoneNumbers(content);
          if (phones.length > 0) {
            foundPhone = phones[0];
            source = page.url || 'web';
            break;
          }
        }

        // If no SA number found, try international formats
        if (!foundPhone) {
          for (const page of pages) {
            const content = page.markdown || page.description || '';
            const phones = extractAnyPhoneNumbers(content);
            if (phones.length > 0) {
              foundPhone = phones[0];
              source = page.url || 'web';
              break;
            }
          }
        }

        results.push({ id: entry.id, phone: foundPhone, source });
      } catch (err) {
        console.error(`Error scraping ${entry.company}:`, err);
        results.push({ id: entry.id, phone: null, source: 'error' });
      }
    }

    const found = results.filter(r => r.phone).length;
    console.log(`Phone scraping complete: ${found}/${batch.length} numbers found`);

    return new Response(JSON.stringify({ results, found, total: batch.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Phone scraping error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/** Extract South African phone numbers */
function extractSAPhoneNumbers(text: string): string[] {
  const patterns = [
    /\+27\s?\d{2}\s?\d{3}\s?\d{4}/g,           // +27 xx xxx xxxx
    /\+27\s?\(\d{2}\)\s?\d{3}\s?\d{4}/g,        // +27 (xx) xxx xxxx
    /0\d{2}[\s-]?\d{3}[\s-]?\d{4}/g,            // 0xx xxx xxxx
    /\(\d{3}\)\s?\d{3}[\s-]?\d{4}/g,            // (0xx) xxx xxxx
  ];

  const results: string[] = [];
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      results.push(...matches.map(m => m.replace(/[\s-]/g, '').trim()));
    }
  }
  return [...new Set(results)];
}

/** Extract any phone numbers as fallback */
function extractAnyPhoneNumbers(text: string): string[] {
  const pattern = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
  const matches = text.match(pattern) || [];
  // Filter out numbers that are too short or too long
  return matches
    .map(m => m.trim())
    .filter(m => {
      const digits = m.replace(/\D/g, '');
      return digits.length >= 9 && digits.length <= 15;
    })
    .slice(0, 3);
}

/** Guess a company domain from name */
function guessDomain(company: string): string {
  return company
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    + '.co.za';
}
