import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Products/tools to embed as soft ads
// CRITICAL: The ONLY correct domain is leadershipbydesign.co — NEVER use .co.za, .lovable.app, or any other variant
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

function selectRelevantAds(topic: string): typeof PRODUCT_ADS {
  // Simple keyword matching — pick up to 3 relevant ads
  const keywords: Record<string, string[]> = {
    'SHIFT Leadership Development': ['productivity', 'performance', 'skills', 'development', 'growth', 'shift'],
    'Leadership Index Diagnostic': ['leadership', 'level', 'assessment', 'diagnostic', 'style'],
    'Executive Coaching': ['executive', 'ceo', 'c-suite', 'strategic', 'coaching', 'burnout'],
    'Contagious Identity Workbook': ['identity', 'presence', 'authentic', 'influence', 'personal brand'],
    'Team Alignment Workshop': ['team', 'alignment', 'collaboration', 'communication', 'culture'],
    'Feedback Formula': ['feedback', 'conversation', 'difficult', 'trust', 'conflict'],
  };

  const topicLower = topic.toLowerCase();
  const scored = PRODUCT_ADS.map(ad => {
    const words = keywords[ad.name] || [];
    const score = words.filter(w => topicLower.includes(w)).length;
    return { ad, score };
  });

  scored.sort((a, b) => b.score - a.score);
  // Always include at least Leadership Index (free diagnostic) + top 2 matches
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

    console.log('Step 1: Searching for trending leadership concerns via Firecrawl...');

    // Step 1: Use Firecrawl search to find trending leadership concerns
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'biggest leadership challenge concern trending this week 2025 2026 CEO executive manager',
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

    // Compile research context
    const researchContext = searchResults.map((r: any, i: number) => 
      `Source ${i + 1}: ${r.title || 'Untitled'}\nURL: ${r.url}\n${(r.markdown || r.description || '').slice(0, 1500)}`
    ).join('\n\n---\n\n');

    const sources = searchResults.map((r: any) => ({
      title: r.title,
      url: r.url,
    }));

    console.log(`Step 2: Found ${searchResults.length} sources. Generating newsletter with Claude...`);

    // Step 2: Use Claude to extract ONE leadership topic and generate the newsletter
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
        system: `You are Kevin Britz's AI content strategist for Leadership by Design, a premium leadership development consultancy in South Africa.

Your job: Analyze the research below and identify ONE dominant leadership concern trending right now. Then generate a complete newsletter.

CRITICAL RULES:
- The topic MUST be about LEADERSHIP specifically — not general business, not politics, not technology unless it directly impacts how leaders lead.
- The newsletter must be authoritative, practical, and position Kevin/Leadership by Design as the expert.
- Include at least one actionable solution readers can use immediately.
- Write in a confident, warm, executive tone — no fluff.
- ABSOLUTELY CRITICAL: The ONLY correct website is www.leadershipbydesign.co — NEVER use .co.za, .lovable.app, or any other domain variant. If you mention the website, use ONLY www.leadershipbydesign.co.
- Do NOT invent or hallucinate any URLs, programs, or offerings that don't exist.

OUTPUT FORMAT (JSON):
{
  "topic": "The specific leadership concern identified",
  "subject_line": "Email subject line — high authority, curiosity-driven, under 60 chars",
  "preview_text": "Email preview text under 120 chars",
  "concern_summary": "2-3 paragraphs explaining the concern with supporting data",
  "why_it_matters": "1-2 paragraphs on urgency and relevance",
  "practical_solutions": ["Solution 1 with detail", "Solution 2 with detail", "Solution 3 with detail"],
  "strategic_insight": "One deeper insight connecting to leadership frameworks (SHIFT, Leadership Levels, etc.)",
  "closing_cta": "Compelling call-to-action paragraph — use www.leadershipbydesign.co if linking"
}`,
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

    // Parse JSON from Claude's response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse newsletter JSON from Claude');

    const newsletter = JSON.parse(jsonMatch[0]);
    console.log(`Step 3: Newsletter generated. Topic: "${newsletter.topic}"`);

    // Step 3: Select relevant product ads
    const ads = selectRelevantAds(newsletter.topic);
    const adHtml = buildAdHtml(ads);

    // Step 4: Build the full HTML email
    const approvalToken = crypto.randomUUID();
    const approveUrl = `${supabaseUrl}/functions/v1/approve-newsletter?token=${approvalToken}&action=approve`;
    const rejectUrl = `${supabaseUrl}/functions/v1/approve-newsletter?token=${approvalToken}&action=reject`;

    const solutionsHtml = newsletter.practical_solutions.map((s: string, i: number) => 
      `<tr><td style="padding:8px 0;font-size:15px;color:#333;line-height:1.6;"><strong>${i + 1}.</strong> ${s}</td></tr>`
    ).join('');

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
  <p style="margin:8px 0 0;color:#aaa;font-size:13px;">Weekly Leadership Intelligence</p>
</td></tr>

<!-- Content -->
<tr><td style="padding:40px;">

  <h2 style="margin:0 0 16px;font-size:22px;color:#1a1a2e;line-height:1.3;">${newsletter.subject_line}</h2>

  <div style="font-size:15px;color:#333;line-height:1.7;margin-bottom:24px;">
    ${newsletter.concern_summary}
  </div>

  <h3 style="margin:24px 0 12px;font-size:17px;color:#1a1a2e;">Why This Matters Now</h3>
  <div style="font-size:15px;color:#333;line-height:1.7;margin-bottom:24px;">
    ${newsletter.why_it_matters}
  </div>

  <h3 style="margin:24px 0 12px;font-size:17px;color:#1a1a2e;">Practical Solutions You Can Use Today</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    ${solutionsHtml}
  </table>

  <!-- Ad Block 1 -->
  ${adHtml.split('</table>')[0]}</table>

  <h3 style="margin:24px 0 12px;font-size:17px;color:#1a1a2e;">The Deeper Strategic Play</h3>
  <div style="font-size:15px;color:#333;line-height:1.7;margin-bottom:24px;">
    ${newsletter.strategic_insight}
  </div>

  <!-- Remaining Ads -->
  ${ads.slice(1).map(ad => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-left:4px solid #c8a97e;padding-left:16px;">
      <tr><td>
        <p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:#1a1a2e;">🔹 ${ad.name}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#555;">${ad.description}</p>
        <a href="${ad.url}" style="display:inline-block;padding:8px 20px;background:#c8a97e;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;font-weight:bold;">${ad.cta}</a>
      </td></tr>
    </table>
  `).join('')}

  <div style="margin-top:32px;padding:24px;background:#f8f6f3;border-radius:8px;text-align:center;">
    <p style="margin:0 0 8px;font-size:16px;color:#1a1a2e;font-weight:bold;">${newsletter.closing_cta}</p>
  </div>

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
    const approvalEmailHtml = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
  <div style="background:#1a1a2e;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
    <h2 style="color:#c8a97e;margin:0;">📬 Newsletter Ready for Approval</h2>
  </div>
  <div style="padding:24px;background:#fff;border:1px solid #eee;">
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
          approveUrl: approveUrl,
          rejectUrl: rejectUrl,
        },
      }),
    }).catch(e => console.error('Slack notify error:', e));

    return new Response(JSON.stringify({
      success: true,
      newsletter_id: savedNewsletter.id,
      topic: newsletter.topic,
      subject: newsletter.subject_line,
      status: 'pending_approval',
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
