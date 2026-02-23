import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return new Response(buildPage('Invalid Link', 'No email address was provided.'), {
        headers: { 'Content-Type': 'text/html' },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('email_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase().trim());

    if (error) {
      console.error('Unsubscribe error:', error);
      return new Response(buildPage('Error', 'Something went wrong. Please try again later.'), {
        headers: { 'Content-Type': 'text/html' },
        status: 500,
      });
    }

    return new Response(
      buildPage(
        "You've been unsubscribed",
        "You will no longer receive newsletter emails from Leadership by Design. If this was a mistake, please contact us at hello@leadershipbydesign.co."
      ),
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(buildPage('Error', 'Something went wrong.'), {
      headers: { 'Content-Type': 'text/html' },
      status: 500,
    });
  }
});

function buildPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Leadership by Design</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8f9fa; color: #333; }
    .card { background: white; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h1 { font-size: 24px; margin-bottom: 12px; color: #1a1a2e; }
    p { font-size: 16px; line-height: 1.6; color: #666; }
    a { color: #c9a84c; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
