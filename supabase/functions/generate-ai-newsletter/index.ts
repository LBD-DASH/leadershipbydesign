import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CRITICAL: The ONLY correct domain is leadershipbydesign.co
const SITE_DOMAIN = 'https://www.leadershipbydesign.co';

const PRODUCT_ADS = [
  {
    name: 'SHIFT Leadership Development',
    description: 'A 90-day system delivering 40% productivity gains through 5 core leadership skills.',
    url: `${SITE_DOMAIN}/shift-methodology`,
    cta: 'Explore SHIFT →',
  },
  {
    name: 'Leadership Index Diagnostic',
    description: 'Discover your leadership level with our free 5-minute assessment.',
    url: `${SITE_DOMAIN}/leadership-diagnostic`,
    cta: 'Take the Free Diagnostic →',
  },
  {
    name: 'Executive Coaching',
    description: 'One-on-one strategic coaching for C-suite leaders ready to scale impact.',
    url: `${SITE_DOMAIN}/executive-coaching`,
    cta: 'Book a Discovery Call →',
  },
  {
    name: 'Contagious Identity Workbook',
    description: 'The executive workbook for building authentic leadership presence.',
    url: `${SITE_DOMAIN}/products/contagious-identity-workbook`,
    cta: 'Get the Workbook →',
  },
  {
    name: 'Team Alignment Workshop',
    description: 'Get your team rowing in the same direction with a focused half-day session.',
    url: `${SITE_DOMAIN}/workshops/alignment`,
    cta: 'Learn More →',
  },
  {
    name: 'Feedback Formula',
    description: 'Master the art of giving feedback that drives performance without damaging trust.',
    url: `${SITE_DOMAIN}/products/feedback-formula`,
    cta: 'Get the Feedback Formula →',
  },
];

function selectRelevantAds(topic: string, featuredProducts?: string[]): typeof PRODUCT_ADS {
  // If theme has featured products, prioritize those
  if (featuredProducts && featuredProducts.length > 0) {
    const featured = PRODUCT_ADS.filter(ad => featuredProducts.includes(ad.name));
    // Fill remaining slots with keyword matching
    if (featured.length >= 3) return featured.slice(0, 3);
    const remaining = PRODUCT_ADS.filter(ad => !featuredProducts.includes(ad.name));
    return [...featured, ...remaining].slice(0, 3);
  }

  // Fallback: keyword matching
  const keywords: Record<string, string[]> = {
    'SHIFT Leadership Development': ['productivity', 'performance', 'skills', 'development', 'growth', 'shift', 'accountability', 'execution'],
    'Leadership Index Diagnostic': ['leadership', 'level', 'assessment', 'diagnostic', 'style'],
    'Executive Coaching': ['executive', 'ceo', 'c-suite', 'strategic', 'coaching', 'burnout', 'delegation', 'presence'],
    'Contagious Identity Workbook': ['identity', 'presence', 'authentic', 'influence', 'personal brand'],
    'Team Alignment Workshop': ['team', 'alignment', 'collaboration', 'communication', 'culture', 'clarity'],
    'Feedback Formula': ['feedback', 'conversation', 'difficult', 'trust', 'conflict', 'accountability'],
  };

  const topicLower = topic.toLowerCase();
  const scored = PRODUCT_ADS.map(ad => {
    const words = keywords[ad.name] || [];
    const score = words.filter(w => topicLower.includes(w)).length;
    return { ad, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, 3).map(s => s.ad);
  if (!selected.find(a => a.name === 'Leadership Index Diagnostic')) {
    selected[2] = PRODUCT_ADS.find(a => a.name === 'Leadership Index Diagnostic')!;
  }
  return selected;
}

function buildAdHtml(ads: typeof PRODUCT_ADS): string {
  return ads.map(ad => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; border-left: 4px solid #c8a97e; padding-left: 16px;">
      <tr><td>
        <p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:#1a1a2e;">🔹 ${ad.name}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#555;">${ad.description}</p>
        <a href="${ad.url}" style="display:inline-block;padding:8px 20px;background:#c8a97e;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;font-weight:bold;">${ad.cta}</a>
      </td></tr>
    </table>
  `).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) throw new Error('FIRECRAWL_API_KEY not configured');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 0: Look up this month's theme
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const { data: themeData } = await supabase
      .from('newsletter_themes')
      .select('*')
      .eq('year', currentYear)
      .eq('month', currentMonth)
      .single();

    const hasTheme = !!themeData;
    const monthlyTheme = themeData?.theme || '';
    const painPointCluster = themeData?.pain_point_cluster || '';
    const featuredProducts = themeData?.featured_products || [];

    console.log(hasTheme
      ? `Theme found: "${monthlyTheme}" | Pain cluster: "${painPointCluster}"`
      : 'No theme configured for this month — using generic approach');

    // Step 1: Theme-aware Firecrawl search
    const searchQuery = hasTheme
      ? `leadership ${monthlyTheme.toLowerCase()} challenge concern trending this week ${currentYear} CEO executive manager`
      : `biggest leadership challenge concern trending this week ${currentYear} CEO executive manager`;

    console.log(`Step 1: Searching via Firecrawl: "${searchQuery}"`);

    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 8,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });

    if (!searchResponse.ok) {
      const errText = await searchResponse.text();
      console.error('Firecrawl search error:', searchResponse.status, errText);
      throw new Error(`Firecrawl search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const searchResults = searchData.data || [];

    const researchContext = searchResults.map((r: any, i: number) =>
      `Source ${i + 1}: ${r.title || 'Untitled'}\nURL: ${r.url}\n${(r.markdown || r.description || '').slice(0, 1500)}`
    ).join('\n\n---\n\n');

    const sources = searchResults.map((r: any) => ({
      title: r.title,
      url: r.url,
    }));

    console.log(`Step 2: Found ${searchResults.length} sources. Generating newsletter with Claude...`);

    // Step 2: Build the Claude system prompt — theme-locked or generic
    const systemPrompt = hasTheme
      ? `You are Kevin Britz's AI content strategist for Leadership by Design (www.leadershipbydesign.co), a premium leadership development consultancy in South Africa.

THIS MONTH'S THEME: "${monthlyTheme}"
PAIN POINT CLUSTER: ${painPointCluster}

Your job: Generate a newsletter that is LOCKED to this month's theme. Every element must ladder up to "${monthlyTheme}".

CRITICAL RULES:
1. PAIN POINT ANCHOR (Required): The newsletter MUST open with ONE specific, published leader pain point in the first 2 sentences. Name it explicitly. Source it from the research below AND filter through the monthly theme "${monthlyTheme}".
2. SOLUTION BRIDGE (Required): After the pain point, bridge directly to a specific Leadership by Design product/service. Map: Pain Point → Why It Happens → How our specific product solves it.
3. The topic MUST connect to "${monthlyTheme}" — not general business, not politics, not technology unless it directly impacts how leaders lead within this theme.
4. ABSOLUTELY CRITICAL: The ONLY correct website is www.leadershipbydesign.co — NEVER use .co.za, .lovable.app, or any other domain variant.
5. Do NOT invent or hallucinate any URLs, programs, or offerings that don't exist.
6. Tone: Authoritative but empathetic. Speak directly to mid-to-senior leaders (Heads of, Directors, C-suite). No generic motivational language. Be specific and practical.

AVAILABLE PRODUCTS/SERVICES TO REFERENCE:
- 90-Day SHIFT Leadership System (www.leadershipbydesign.co/shift-methodology)
- Leadership Index Diagnostic — free 5-min assessment (www.leadershipbydesign.co/leadership-diagnostic)
- Team Diagnostic (www.leadershipbydesign.co/team-diagnostic)
- Leader as Coach Programme (www.leadershipbydesign.co/leader-as-coach)
- Executive Coaching (www.leadershipbydesign.co/executive-coaching)
- Team Alignment Workshop (www.leadershipbydesign.co/workshops/alignment)
- Feedback Formula (www.leadershipbydesign.co/products/feedback-formula)
- Contagious Identity Workbook (www.leadershipbydesign.co/products/contagious-identity-workbook)

OUTPUT FORMAT (JSON):
{
  "topic": "The specific leadership pain point identified, tied to ${monthlyTheme}",
  "subject_line": "Pain-point-led, curiosity-driven, max 9 words",
  "preview_text": "Complements subject, adds urgency or specificity, under 120 chars",
  "hook": "2-3 sentences stating the pain point as a real scenario the reader recognises",
  "insight_section": "3-4 sentences explaining why this pain point persists, tied to the theme ${monthlyTheme}",
  "solution_bridge": "3-4 sentences naming the specific LBD tool/programme that addresses it and how",
  "proof_layer": "1-2 sentences with a stat, quote, or outcome reference (e.g., 'Leaders using our 90-day system report up to 40% productivity gains')",
  "primary_cta": "One clear action — include the full URL",
  "closing_thought": "1 sentence strategic takeaway"
}`
      : `You are Kevin Britz's AI content strategist for Leadership by Design, a premium leadership development consultancy in South Africa.

Your job: Analyze the research below and identify ONE dominant leadership concern trending right now. Then generate a complete newsletter.

CRITICAL RULES:
- The topic MUST be about LEADERSHIP specifically — not general business, not politics, not technology unless it directly impacts how leaders lead.
- The newsletter must be authoritative, practical, and position Kevin/Leadership by Design as the expert.
- Include at least one actionable solution readers can use immediately.
- Write in a confident, warm, executive tone — no fluff.
- ABSOLUTELY CRITICAL: The ONLY correct website is www.leadershipbydesign.co — NEVER use .co.za, .lovable.app, or any other domain variant.
- Do NOT invent or hallucinate any URLs, programs, or offerings that don't exist.

OUTPUT FORMAT (JSON):
{
  "topic": "The specific leadership concern identified",
  "subject_line": "Email subject line — high authority, curiosity-driven, under 60 chars",
  "preview_text": "Email preview text under 120 chars",
  "hook": "2-3 sentences opening the newsletter with a recognisable pain point",
  "insight_section": "3-4 sentences on why this concern matters now with supporting context",
  "solution_bridge": "3-4 sentences with practical solutions readers can use, referencing LBD where relevant",
  "proof_layer": "1-2 sentences with a stat, quote, or outcome",
  "primary_cta": "Compelling call-to-action — use www.leadershipbydesign.co if linking",
  "closing_thought": "1 sentence strategic takeaway"
}`;

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Here is the latest web research on leadership concerns:\n\n${researchContext}\n\nAnalyze this and generate a leadership newsletter in JSON format.`,
        }],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error('Claude API error:', claudeResponse.status, errText);
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    const rawContent = claudeData.content[0]?.text || '';

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse newsletter JSON from Claude');

    const newsletter = JSON.parse(jsonMatch[0]);
    console.log(`Step 3: Newsletter generated. Topic: "${newsletter.topic}"`);

    // Step 3: Select relevant product ads (theme-aware)
    const ads = selectRelevantAds(newsletter.topic, featuredProducts);
    const adHtml = buildAdHtml(ads);

    // Step 4: Build the full HTML email — structured format
    const approvalToken = crypto.randomUUID();
    const approveUrl = `${supabaseUrl}/functions/v1/approve-newsletter?token=${approvalToken}&action=approve`;
    const rejectUrl = `${supabaseUrl}/functions/v1/approve-newsletter?token=${approvalToken}&action=reject`;

    const themeLabel = hasTheme ? `<p style="margin:4px 0 0;color:#c8a97e;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Monthly Theme: ${monthlyTheme}</p>` : '';

    const fullHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;">

<!-- Header -->
<tr><td style="background:#1a1a2e;padding:32px 40px;text-align:center;">
  <h1 style="margin:0;color:#c8a97e;font-size:24px;font-weight:bold;letter-spacing:1px;">LEADERSHIP BY DESIGN</h1>
  <p style="margin:8px 0 0;color:#aaa;font-size:13px;">Leadership Intelligence</p>
  ${themeLabel}
</td></tr>

<!-- Content -->
<tr><td style="padding:40px;">

  <h2 style="margin:0 0 20px;font-size:22px;color:#1a1a2e;line-height:1.3;">${newsletter.subject_line}</h2>

  <!-- HOOK: Pain Point Scenario -->
  <div style="font-size:16px;color:#333;line-height:1.7;margin-bottom:24px;border-left:3px solid #1a1a2e;padding-left:16px;font-style:italic;">
    ${newsletter.hook}
  </div>

  <!-- INSIGHT: Why It Persists -->
  <h3 style="margin:24px 0 12px;font-size:17px;color:#1a1a2e;">Why This Keeps Happening</h3>
  <div style="font-size:15px;color:#333;line-height:1.7;margin-bottom:24px;">
    ${newsletter.insight_section}
  </div>

  <!-- Ad Block 1 -->
  ${ads.length > 0 ? buildAdHtml([ads[0]]) : ''}

  <!-- SOLUTION BRIDGE: Named Product/Programme -->
  <h3 style="margin:24px 0 12px;font-size:17px;color:#1a1a2e;">What Actually Works</h3>
  <div style="font-size:15px;color:#333;line-height:1.7;margin-bottom:24px;">
    ${newsletter.solution_bridge}
  </div>

  <!-- PROOF LAYER -->
  <div style="margin:24px 0;padding:20px;background:#f8f6f3;border-radius:8px;text-align:center;">
    <p style="margin:0;font-size:15px;color:#1a1a2e;font-weight:bold;line-height:1.6;">${newsletter.proof_layer}</p>
  </div>

  <!-- Remaining Ads -->
  ${ads.length > 1 ? buildAdHtml(ads.slice(1)) : ''}

  <!-- PRIMARY CTA -->
  <div style="margin:32px 0;padding:28px;background:#1a1a2e;border-radius:8px;text-align:center;">
    <p style="margin:0 0 12px;font-size:16px;color:#fff;font-weight:bold;">${newsletter.primary_cta}</p>
  </div>

  <!-- Closing Thought -->
  <p style="margin:16px 0 0;font-size:14px;color:#666;font-style:italic;text-align:center;">${newsletter.closing_thought}</p>

</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px;background:#f8f8f8;text-align:center;border-top:1px solid #eee;">
  <p style="margin:0;font-size:12px;color:#999;">Leadership by Design • hello@leadershipbydesign.co</p>
  <p style="margin:8px 0 0;font-size:12px;color:#999;">
    <a href="{{UNSUBSCRIBE_URL}}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // Step 5: Save to database
    const { data: savedNewsletter, error: saveError } = await supabase
      .from('newsletter_sends')
      .insert({
        subject: newsletter.subject_line,
        body_html: fullHtml,
        status: 'pending_approval',
        auto_generated: true,
        approval_token: approvalToken,
        approval_status: 'pending',
        research_topic: newsletter.topic,
        research_sources: sources,
        sent_by: 'ai-auto',
      })
      .select()
      .single();

    if (saveError) throw saveError;

    console.log('Step 5: Newsletter saved. Sending preview to Kevin for approval...');

    // Step 6: Send approval email to Kevin
    const themeInfo = hasTheme ? `<p><strong>Monthly Theme:</strong> ${monthlyTheme}</p>` : '';
    const approvalEmailHtml = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
  <div style="background:#1a1a2e;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
    <h2 style="color:#c8a97e;margin:0;">📬 Newsletter Ready for Approval</h2>
  </div>
  <div style="padding:24px;background:#fff;border:1px solid #eee;">
    ${themeInfo}
    <p><strong>Topic:</strong> ${newsletter.topic}</p>
    <p><strong>Subject Line:</strong> ${newsletter.subject_line}</p>
    <p><strong>Sources:</strong> ${sources.length} web sources analyzed</p>
    
    <div style="margin:24px 0;text-align:center;">
      <a href="${approveUrl}" style="display:inline-block;padding:14px 40px;background:#22c55e;color:#fff;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;margin-right:12px;">✅ APPROVE & SEND</a>
      <a href="${rejectUrl}" style="display:inline-block;padding:14px 40px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;">❌ REJECT</a>
    </div>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
    <h3 style="color:#333;">Newsletter Preview:</h3>
  </div>
  <div style="border:1px solid #eee;border-top:none;">
    ${fullHtml}
  </div>
</div>`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Leadership by Design <hello@leadershipbydesign.co>',
        to: ['kevin@kevinbritz.com'],
        subject: `[APPROVE] ${newsletter.subject_line}`,
        html: approvalEmailHtml,
        reply_to: 'kevin@kevinbritz.com',
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend error:', emailRes.status, errText);
    }

    console.log('Done! Newsletter generated and approval email sent.');

    // Slack notify (non-blocking)
    fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
      body: JSON.stringify({
        eventType: 'newsletter_generated',
        data: {
          subject: newsletter.subject_line,
          topic: newsletter.topic,
          sourceCount: sources.length,
          approveUrl,
          rejectUrl,
          ...(hasTheme ? { monthlyTheme } : {}),
        },
      }),
    }).catch(e => console.error('Slack notify error:', e));

    return new Response(JSON.stringify({
      success: true,
      newsletter_id: savedNewsletter.id,
      topic: newsletter.topic,
      subject: newsletter.subject_line,
      status: 'pending_approval',
      monthly_theme: monthlyTheme || null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('generate-ai-newsletter error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
