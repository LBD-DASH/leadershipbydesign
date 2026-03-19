import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_DOMAIN = 'https://www.leadershipbydesign.co';

const NEWSLETTER_SYSTEM_PROMPT = `You are Kevin Britz — founder of Leadership by Design (www.leadershipbydesign.co), a premium leadership development consultancy in South Africa. You are a straight-talking South African executive coach. Warm but direct. No corporate waffle. No motivational poster language. Intellectually rigorous. You challenge assumptions.

Your audience: HR Directors, L&D Heads, COOs, and Talent Executives at 100–500 person Financial Services and Insurance firms in South Africa.

Write a newsletter following this EXACT 5-section structure:

1. HOOK (1 paragraph) — Open with the pain point as a lived experience. Make the reader feel seen. No statistics. Write like a sharp SA executive coach talking to a peer.

2. THE PROBLEM FRAMED (1–2 paragraphs) — Name what is happening beneath the surface. Connect it to identity, behaviour, or team dynamics — not symptoms. Reference the SHIFT framework where relevant (Self-Management, Human Intelligence, Innovation, Focus, Thinking, Your AI Edge).

3. THE SHIFT (1–2 paragraphs) — Offer a genuine reframe. Challenge the reader's assumption. This is the intellectual value of the edition. Not advice — a perspective shift. This must be genuinely non-obvious.

4. THE SOLUTION BRIDGE (1 paragraph) — Connect naturally to one LBD offering. Primary: Leader as Coach 90-Day Manager Coaching Accelerator. Secondary: Contagious Identity, Leadership Diagnostic, SHIFT Assessment. Never hard-sell. Frame as: "Here is how we build this systematically."

5. CLOSING LINE — One punchy sentence. No sign-off fluff. Brand line where appropriate: "Built by design. Not by default."

SUBJECT LINE RULES:
- Specific, tension-based, under 8 words
- Good: "Why your managers train but never change"
- Bad: "Leadership insights for this week"

NEVER USE: servant leadership clichés, generic growth mindset language, weak hooks, or themes not directly relevant to FSI or professional services leaders.

AVAILABLE SERVICES (reference only if naturally relevant):
- Leader as Coach 90-Day Accelerator (${SITE_DOMAIN}/leader-as-coach) — PRIMARY
- Contagious Identity Coaching (${SITE_DOMAIN}/executive-coaching)
- Leadership Index Diagnostic (${SITE_DOMAIN}/leadership-diagnostic)
- SHIFT Assessment (${SITE_DOMAIN}/shift-methodology)
- Team Diagnostic (${SITE_DOMAIN}/team-diagnostic)
- Contact page (${SITE_DOMAIN}/contact)

OUTPUT FORMAT (JSON only, no markdown):
{
  "topic": "The pain point / structural leadership flaw identified",
  "subject_line": "Tension-driven, under 8 words",
  "pain_point": "The specific pain point this newsletter addresses",
  "service_referenced": "Which LBD service this bridges to (e.g. Leader as Coach, Contagious Identity, etc.)",
  "hook": "1 paragraph — lived experience, reader feels seen",
  "problem_framed": "1-2 paragraphs — beneath the surface, identity/behaviour/team dynamics, SHIFT framework",
  "the_shift": "1-2 paragraphs — genuine reframe, non-obvious perspective shift",
  "solution_bridge": "1 paragraph — natural connection to LBD offering, no hard sell",
  "closing_line": "One punchy sentence",
  "cta_url": "Full URL — contact page or diagnostic or programme page",
  "cta_button_text": "7 words max"
}`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) throw new Error('FIRECRAWL_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for rewrite context from request body
    const body = await req.json().catch(() => ({}));
    const rewriteRound = body.rewrite_round || 0;
    const previousFeedback = body.feedback || '';
    const previousPainPoint = body.previous_pain_point || '';
    const newsletterId = body.newsletter_id || null;

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

    // Step 1: Firecrawl research
    let searchQuery = hasTheme
      ? `leadership ${monthlyTheme.toLowerCase()} challenge concern FSI financial services insurance South Africa ${currentYear}`
      : `biggest leadership challenge concern financial services insurance South Africa ${currentYear} CEO executive manager`;

    // On rewrite, vary the search to get different angles
    if (rewriteRound > 0 && previousPainPoint) {
      searchQuery = `leadership challenge NOT "${previousPainPoint}" FSI financial services ${currentYear} executive`;
    }

    console.log(`Step 1: Firecrawl search (round ${rewriteRound}): "${searchQuery}"`);

    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchQuery, limit: 8, scrapeOptions: { formats: ['markdown'] } }),
    });

    if (!searchResponse.ok) {
      throw new Error(`Firecrawl search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const searchResults = searchData.data || [];
    const researchContext = searchResults.map((r: any, i: number) =>
      `Source ${i + 1}: ${r.title || 'Untitled'}\nURL: ${r.url}\n${(r.markdown || r.description || '').slice(0, 1500)}`
    ).join('\n\n---\n\n');

    const sources = searchResults.map((r: any) => ({ title: r.title, url: r.url }));

    // Step 2: Generate newsletter with Claude
    const themeContext = hasTheme
      ? `\nTHIS MONTH'S THEME: "${monthlyTheme}"\nPAIN POINT CLUSTER: ${painPointCluster}\nFilter research through this lens.\n`
      : '';

    let userPrompt = `Here is the latest web research on leadership concerns:\n\n${researchContext}\n\n${themeContext}Generate a newsletter following the exact structure. Remember: tension, not education. Voice: straight-talking SA executive coach.`;

    if (rewriteRound > 0) {
      userPrompt += `\n\n--- REWRITE CONTEXT ---\nThis is rewrite round ${rewriteRound}.`;
      if (previousFeedback) {
        userPrompt += `\nKevin's feedback on the previous draft: "${previousFeedback}"`;
      } else {
        userPrompt += `\nThe previous draft was rejected without specific feedback. Assume the issue is one or more of: theme relevance to FSI audience, voice quality, or weak solution bridge.`;
      }
      if (previousPainPoint) {
        userPrompt += `\nPrevious pain point used: "${previousPainPoint}" — try a different angle or sharper take.`;
      }
      userPrompt += `\n\nBefore generating, check:\n- Does the subject line create tension or curiosity?\n- Does the hook make an FSI executive feel immediately understood?\n- Is the problem framed at identity or behaviour level, not just symptoms?\n- Is the SHIFT reframe genuinely non-obvious?\n- Does the solution bridge feel earned, not forced?\n- Is the voice direct, warm, and free of jargon?`;
    }

    console.log(`Step 2: Generating newsletter with Claude (round ${rewriteRound})...`);

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
        system: NEWSLETTER_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    const rawContent = claudeData.content[0]?.text || '';
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse newsletter JSON from Claude');

    const newsletter = JSON.parse(jsonMatch[0]);
    console.log(`Step 3: Newsletter generated. Topic: "${newsletter.topic}"`);

    // Step 3: Build HTML email
    const ctaUrl = newsletter.cta_url || `${SITE_DOMAIN}/contact`;
    const ctaText = newsletter.cta_button_text || 'Book a Leadership Design Conversation';
    const themeLabel = hasTheme ? `<p style="margin:4px 0 0;color:#c8a97e;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Monthly Theme: ${monthlyTheme}</p>` : '';

    const fullHtml = `<!DOCTYPE html>
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

  <!-- 1. HOOK -->
  <div style="font-size:16px;color:#333;line-height:1.8;margin-bottom:28px;border-left:3px solid #c8a97e;padding-left:20px;font-style:italic;">
    ${newsletter.hook}
  </div>

  <!-- 2. THE PROBLEM FRAMED -->
  <div style="font-size:15px;color:#333;line-height:1.7;margin-bottom:28px;">
    ${newsletter.problem_framed}
  </div>

  <!-- 3. THE SHIFT -->
  <div style="margin:28px 0;padding:20px 24px;background:#f8f6f3;border-radius:6px;font-size:15px;color:#1a1a2e;line-height:1.8;">
    ${newsletter.the_shift}
  </div>

  <!-- 4. THE SOLUTION BRIDGE -->
  <div style="margin:28px 0;font-size:15px;color:#333;line-height:1.7;">
    ${newsletter.solution_bridge}
  </div>

  <!-- CTA -->
  <div style="margin:32px 0;padding:32px;background:#1a1a2e;border-radius:8px;text-align:center;">
    <a href="${ctaUrl}" style="display:inline-block;padding:14px 36px;background:#c8a97e;color:#1a1a2e;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;letter-spacing:0.5px;">${ctaText}</a>
    <p style="margin:16px 0 0;font-size:12px;color:#888;">30 minutes. No pitch. Just clarity.</p>
  </div>

  <!-- 5. CLOSING LINE -->
  <p style="margin:24px 0 0;font-size:16px;color:#1a1a2e;font-weight:bold;text-align:center;">${newsletter.closing_line}</p>

  <p style="margin:24px 0 0;font-size:14px;color:#666;line-height:1.6;">Kevin Britz<br><span style="font-size:12px;color:#999;">Founder, Leadership by Design</span></p>

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

    // Step 4: Save to database
    const rewriteLabel = rewriteRound > 0 ? `[REWRITE — Round ${rewriteRound + 1}]` : '';

    if (newsletterId && rewriteRound > 0) {
      // Update existing newsletter record for rewrites
      await supabase
        .from('newsletter_sends')
        .update({
          subject: newsletter.subject_line,
          body_html: fullHtml,
          status: 'pending_approval',
          approval_status: 'pending',
          research_topic: newsletter.topic,
          research_sources: sources,
          rewrite_rounds: rewriteRound,
          pain_point_topic: newsletter.pain_point,
          service_referenced: newsletter.service_referenced,
          rewrite_feedback: previousFeedback || null,
        })
        .eq('id', newsletterId);

      console.log(`Updated newsletter ${newsletterId} with rewrite round ${rewriteRound}`);
    } else {
      // Create new newsletter record
      const { data: savedNewsletter, error: saveError } = await supabase
        .from('newsletter_sends')
        .insert({
          subject: newsletter.subject_line,
          body_html: fullHtml,
          status: 'pending_approval',
          auto_generated: true,
          approval_status: 'pending',
          research_topic: newsletter.topic,
          research_sources: sources,
          sent_by: 'ai-auto',
          rewrite_rounds: 0,
          pain_point_topic: newsletter.pain_point,
          service_referenced: newsletter.service_referenced,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Create conversion_insights row
      await supabase.from('conversion_insights').insert({
        newsletter_id: savedNewsletter.id,
        theme: monthlyTheme || null,
        pain_cluster: painPointCluster || null,
        subject_line_type: null,
      });
    }

    const effectiveNewsletterId = newsletterId || (await supabase
      .from('newsletter_sends')
      .select('id')
      .eq('subject', newsletter.subject_line)
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()).data?.id;

    // Step 5: Post to Slack #newsletter-engine for approval
    console.log('Step 5: Posting to Slack #newsletter-engine for approval...');

    await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
      body: JSON.stringify({
        eventType: 'newsletter_approval_request',
        data: {
          subject: newsletter.subject_line,
          painPoint: newsletter.pain_point,
          serviceReferenced: newsletter.service_referenced,
          hook: newsletter.hook,
          problemFramed: newsletter.problem_framed,
          theShift: newsletter.the_shift,
          solutionBridge: newsletter.solution_bridge,
          closingLine: newsletter.closing_line,
          rewriteRound: rewriteRound,
          rewriteLabel,
          newsletterId: effectiveNewsletterId,
          monthlyTheme: monthlyTheme || null,
        },
      }),
    });

    // Step 6: Schedule timeout check — after 4 hours, if not approved, auto-rewrite
    // We'll use a simple approach: store the pending state and let a scheduled function handle timeouts
    // The approval/rejection is handled by monitoring Slack responses in a separate function

    console.log(`Done! Newsletter posted to #newsletter-engine. ${rewriteLabel || 'Round 1'}`);

    return new Response(JSON.stringify({
      success: true,
      newsletter_id: effectiveNewsletterId,
      topic: newsletter.topic,
      subject: newsletter.subject_line,
      pain_point: newsletter.pain_point,
      service_referenced: newsletter.service_referenced,
      rewrite_round: rewriteRound,
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
