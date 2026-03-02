import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CRITICAL: The ONLY correct domain is leadershipbydesign.co
const SITE_DOMAIN = 'https://www.leadershipbydesign.co';

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

    // Step 2: Build the Click-Optimised Claude system prompt
    const themeContext = hasTheme
      ? `\nTHIS MONTH'S THEME: "${monthlyTheme}"\nPAIN POINT CLUSTER: ${painPointCluster}\nEvery element must ladder up to "${monthlyTheme}". Filter research through this lens.\n`
      : '';

    const systemPrompt = `You are Kevin Britz — not his "content strategist," not a brand voice. You ARE Kevin. You run Leadership by Design (www.leadershipbydesign.co), a premium leadership development consultancy in South Africa.
${themeContext}
YOUR ONE JOB: Write a newsletter that creates enough strategic tension that a senior leader feels "I need to speak to Kevin." Not to educate. Not to inspire. To expose a structural flaw they can feel but haven't named — and make them click.

THE 6-STEP CONVERSION PSYCHOLOGY FRAMEWORK:

1. EXECUTIVE PAIN (Mirror, not content)
Open with a specific scenario a senior leader will recognise as their own reality. First-person framing. Name something they've experienced in the last 30 days. No generic leadership language. This is a mirror — they should feel seen, slightly exposed, and relieved someone finally named it.

2. HIDDEN PATTERN (Authority through insight)
Expose the deeper structural cause that most people miss. Use language like "What most boards call X is actually Y." Position yourself as seeing what others don't. This creates: insight, authority, intellectual intrigue. They should think: "He sees something deeper."

3. BOARDROOM STORY (Maximum 6 lines, sharp)
A real-feeling anecdote. Dialogue format preferred. Must end with a twist that makes the reader wonder "Is that me?" Not fluffy. Not motivational. Sharp. Example structure:
"One executive told me, 'I've explained the strategy five times.'
Within 15 minutes, we realised the team wasn't resisting the strategy. They were resisting the ambiguity in his tone."

4. STAKES (Create consequence)
Name what happens if this continues. Use words like "calcify", "erode", "fracture". Create urgency without being alarmist. 1-2 sentences maximum.

5. INVITATION (Direct, personal — NOT a soft CTA)
Do NOT write "learn more" or "explore our programme." Instead: "If you recognise this pattern in your team, let's have a strategic conversation. I'll show you exactly where the design is breaking." Frame what they GET from 30 minutes with you.

6. CTA (Single clear action)
One button. One URL. Either the contact page (${SITE_DOMAIN}/contact) or the Leadership Index Diagnostic (${SITE_DOMAIN}/leadership-diagnostic). Choose whichever fits the narrative better.

SUBJECT LINE RULES:
- Maximum 7 words
- Tension-driven, boardroom-level
- Types: question ("Are You the Bottleneck?"), accusation ("Your Team Isn't Resisting Change"), revelation ("The Real Reason Leaders Burn Out")
- No clickbait. No generic motivation. Every word earns its place.

CRITICAL RULES:
- Write as Kevin speaking directly, first person. Not "Leadership by Design recommends."
- NO generic motivational language. Every sentence must create tension or authority.
- The ONLY correct website is www.leadershipbydesign.co — NEVER use .co.za, .lovable.app, or any other domain.
- Do NOT invent URLs, programs, or offerings that don't exist.

AVAILABLE SERVICES TO REFERENCE (only if naturally relevant):
- Executive Coaching (${SITE_DOMAIN}/executive-coaching)
- 90-Day SHIFT Leadership System (${SITE_DOMAIN}/shift-methodology)
- Leadership Index Diagnostic — free 5-min assessment (${SITE_DOMAIN}/leadership-diagnostic)
- Team Diagnostic (${SITE_DOMAIN}/team-diagnostic)
- Leader as Coach Programme (${SITE_DOMAIN}/leader-as-coach)

OUTPUT FORMAT (JSON only, no markdown):
{
  "topic": "The structural leadership flaw identified",
  "subject_line": "Tension-driven, max 7 words, boardroom-level",
  "subject_line_type": "question|accusation|revelation|provocation",
  "preview_text": "Complements subject, creates 'is that me?' reaction, under 90 chars",
  "executive_pain": "2-3 sentences. First-person framing. Mirror, not content.",
  "hidden_pattern": "2-3 sentences. 'What most boards call X is actually Y.' Authority builder.",
  "boardroom_story": "Maximum 6 lines. Dialogue preferred. Ends with a twist.",
  "stakes": "1-2 sentences. Consequence language. Urgency without alarm.",
  "invitation": "2-3 sentences. Direct personal invitation. Frame what they GET from 30 minutes.",
  "cta_button_text": "7 words max. e.g. 'Book a Leadership Design Conversation'",
  "cta_url": "Full URL — contact page or diagnostic"
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
          content: `Here is the latest web research on leadership concerns:\n\n${researchContext}\n\nAnalyze this and generate a conversion-optimised leadership newsletter in JSON format. Remember: tension, not education.`,
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

    // Step 3: Build the click-optimised HTML email
    const approvalToken = crypto.randomUUID();
    const approveUrl = `${supabaseUrl}/functions/v1/approve-newsletter?token=${approvalToken}&action=approve`;
    const rejectUrl = `${supabaseUrl}/functions/v1/approve-newsletter?token=${approvalToken}&action=reject`;

    const themeLabel = hasTheme ? `<p style="margin:4px 0 0;color:#c8a97e;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Monthly Theme: ${monthlyTheme}</p>` : '';

    const ctaUrl = newsletter.cta_url || `${SITE_DOMAIN}/contact`;
    const ctaText = newsletter.cta_button_text || 'Book a Leadership Design Conversation';

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

  <!-- 1. EXECUTIVE PAIN — Mirror opening -->
  <div style="font-size:16px;color:#333;line-height:1.8;margin-bottom:28px;border-left:3px solid #c8a97e;padding-left:20px;font-style:italic;">
    ${newsletter.executive_pain}
  </div>

  <!-- 2. HIDDEN PATTERN — Authority section -->
  <div style="font-size:15px;color:#333;line-height:1.7;margin-bottom:28px;">
    ${newsletter.hidden_pattern}
  </div>

  <!-- 3. BOARDROOM STORY — Dialogue block -->
  <div style="margin:28px 0;padding:20px 24px;background:#f8f6f3;border-radius:6px;font-size:15px;color:#1a1a2e;line-height:1.8;">
    ${newsletter.boardroom_story}
  </div>

  <!-- 4. STAKES — Consequence -->
  <div style="margin:28px 0;text-align:center;">
    <p style="margin:0;font-size:16px;color:#1a1a2e;font-weight:bold;line-height:1.6;">${newsletter.stakes}</p>
  </div>

  <!-- 5 & 6. CONVERSION BLOCK — Invitation + Single CTA -->
  <div style="margin:32px 0;padding:32px;background:#1a1a2e;border-radius:8px;text-align:center;">
    <p style="margin:0 0 20px;font-size:15px;color:#ccc;line-height:1.7;">${newsletter.invitation}</p>
    <a href="${ctaUrl}" style="display:inline-block;padding:14px 36px;background:#c8a97e;color:#1a1a2e;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;letter-spacing:0.5px;">${ctaText}</a>
    <p style="margin:16px 0 0;font-size:12px;color:#888;">30 minutes. No pitch. Just clarity.</p>
  </div>

  <!-- Kevin's sign-off -->
  <p style="margin:24px 0 0;font-size:14px;color:#666;line-height:1.6;">Designing leadership that works,<br><strong style="color:#1a1a2e;">Kevin Britz</strong><br><span style="font-size:12px;color:#999;">Founder, Leadership by Design</span></p>

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

    // Step 4b: Create conversion_insights row for this newsletter
    await supabase.from('conversion_insights').insert({
      newsletter_id: savedNewsletter.id,
      theme: monthlyTheme || null,
      pain_cluster: painPointCluster || null,
      subject_line_type: newsletter.subject_line_type || null,
    });

    console.log('Step 4: Newsletter saved. Sending preview to Kevin for approval...');

    // Step 5: Send approval email to Kevin
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
    <p><strong>Subject Type:</strong> ${newsletter.subject_line_type || 'N/A'}</p>
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
      subject_line_type: newsletter.subject_line_type || null,
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
