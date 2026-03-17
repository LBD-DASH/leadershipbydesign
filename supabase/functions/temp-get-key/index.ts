const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Simple passphrase check
  const url = new URL(req.url);
  const pass = url.searchParams.get('pass');
  if (pass !== 'lbd-temp-2026') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'NOT FOUND';
  
  return new Response(JSON.stringify({ service_role_key: key }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
