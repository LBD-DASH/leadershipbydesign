import { createClient } from "npm:@supabase/supabase-js@2";

// Outreach Optimizer — feedback loop for the outreach system
// Tracks what converts, auto-tunes prospect scores, identifies winning patterns
// Runs weekly via cron

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InsightRow {
  insight_type: string;
  insight_key: string;
  total_sent: number;
  total_replied: number;
  reply_rate: number;
  last_updated: string;
}

interface PerformanceBucket {
  key: string;
  sent: number;
  replied: number;
  rate: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    console.log("📊 outreach-optimizer invoked at", new Date().toISOString());

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // ───────────────────────────────────────────
    // PART 1: Build conversion profile from warm_outreach_queue
    // ───────────────────────────────────────────

    // Get all emailed prospects in the last 30 days
    const { data: emailedProspects, error: emailedErr } = await supabase
      .from("warm_outreach_queue")
      .select("id, contact_email, contact_title, industry, company_name, score, source_keyword, reply_received, email_sent_at, status")
      .not("email_sent_at", "is", null)
      .gte("email_sent_at", thirtyDaysAgo);

    if (emailedErr) throw new Error(`Failed to fetch emailed prospects: ${emailedErr.message}`);

    const emailed = emailedProspects || [];
    console.log(`Found ${emailed.length} emailed prospects in last 30 days`);

    if (emailed.length === 0) {
      await logActivity(supabase, "success", "No emailed prospects in last 30 days — nothing to analyse", 0);
      return new Response(JSON.stringify({ success: true, message: "No data to analyse" }), { headers });
    }

    // Also pull reply data from prospect_outreach for richer signal
    const { data: outreachReplies } = await supabase
      .from("prospect_outreach")
      .select("prospect_id, replied_at, email_subject, opened_at, template_used")
      .not("replied_at", "is", null)
      .gte("created_at", thirtyDaysAgo);

    // Build a set of prospect_ids that replied (from prospect_outreach)
    const repliedProspectIds = new Set(
      (outreachReplies || []).map((r: { prospect_id: string | null }) => r.prospect_id).filter(Boolean)
    );

    // ── Title performance ──
    const titleBuckets = buildBuckets(emailed, "contact_title");

    // ── Industry performance ──
    const industryBuckets = buildBuckets(emailed, "industry");

    // ── Source keyword performance ──
    const sourceBuckets = buildBuckets(emailed, "source_keyword");

    // ── Score analysis: average score of replied vs not ──
    const replied = emailed.filter((p) => p.reply_received === true);
    const notReplied = emailed.filter((p) => p.reply_received !== true);
    const avgScoreReplied = replied.length > 0
      ? Math.round(replied.reduce((sum, p) => sum + (p.score || 0), 0) / replied.length)
      : 0;
    const avgScoreNotReplied = notReplied.length > 0
      ? Math.round(notReplied.reduce((sum, p) => sum + (p.score || 0), 0) / notReplied.length)
      : 0;

    // ── Company size performance (handle gracefully — column may not exist) ──
    let sizeBuckets: PerformanceBucket[] = [];
    try {
      const { data: sizeData } = await supabase
        .from("warm_outreach_queue")
        .select("id, company_size, reply_received")
        .not("email_sent_at", "is", null)
        .gte("email_sent_at", thirtyDaysAgo);

      if (sizeData && sizeData.length > 0 && sizeData[0].company_size !== undefined) {
        sizeBuckets = buildBuckets(sizeData, "company_size");
      }
    } catch {
      console.log("company_size column not available — skipping size analysis");
    }

    // ───────────────────────────────────────────
    // Store insights in outreach_insights (upsert)
    // ───────────────────────────────────────────

    const allInsights: InsightRow[] = [];

    for (const b of titleBuckets) {
      allInsights.push({
        insight_type: "title_performance",
        insight_key: b.key,
        total_sent: b.sent,
        total_replied: b.replied,
        reply_rate: b.rate,
        last_updated: now.toISOString(),
      });
    }

    for (const b of industryBuckets) {
      allInsights.push({
        insight_type: "industry_performance",
        insight_key: b.key,
        total_sent: b.sent,
        total_replied: b.replied,
        reply_rate: b.rate,
        last_updated: now.toISOString(),
      });
    }

    for (const b of sizeBuckets) {
      allInsights.push({
        insight_type: "size_performance",
        insight_key: b.key,
        total_sent: b.sent,
        total_replied: b.replied,
        reply_rate: b.rate,
        last_updated: now.toISOString(),
      });
    }

    for (const b of sourceBuckets) {
      allInsights.push({
        insight_type: "source_performance",
        insight_key: b.key,
        total_sent: b.sent,
        total_replied: b.replied,
        reply_rate: b.rate,
        last_updated: now.toISOString(),
      });
    }

    // Score insight (special row)
    allInsights.push({
      insight_type: "score_analysis",
      insight_key: "avg_score_comparison",
      total_sent: emailed.length,
      total_replied: replied.length,
      reply_rate: emailed.length > 0 ? round2((replied.length / emailed.length) * 100) : 0,
      last_updated: now.toISOString(),
    });

    // Upsert insights — try table, handle if it doesn't exist yet
    let insightsStored = 0;
    try {
      for (const insight of allInsights) {
        const { error: upsertErr } = await supabase
          .from("outreach_insights")
          .upsert(insight, { onConflict: "insight_type,insight_key" });

        if (upsertErr) {
          console.warn(`Insight upsert warning: ${upsertErr.message}`);
        } else {
          insightsStored++;
        }
      }
    } catch (e) {
      console.warn("outreach_insights table may not exist yet — insights not stored:", e);
    }

    console.log(`Stored ${insightsStored} insights`);

    // ───────────────────────────────────────────
    // PART 2: Auto-tune prospect scores
    // ───────────────────────────────────────────

    const highConvertingTitles = titleBuckets
      .filter((b) => b.rate > 5 && b.sent >= 3)
      .map((b) => b.key.toLowerCase());

    const highConvertingIndustries = industryBuckets
      .filter((b) => b.rate > 5 && b.sent >= 3)
      .map((b) => b.key.toLowerCase());

    const zeroReplyTitles = titleBuckets
      .filter((b) => b.replied === 0 && b.sent >= 10)
      .map((b) => b.key.toLowerCase());

    // Get pending prospects to adjust
    const { data: pendingProspects, error: pendingErr } = await supabase
      .from("warm_outreach_queue")
      .select("id, contact_title, industry, score")
      .eq("status", "pending")
      .or("disqualified.is.null,disqualified.eq.false");

    if (pendingErr) throw new Error(`Failed to fetch pending prospects: ${pendingErr.message}`);

    const pending = pendingProspects || [];
    let adjustedCount = 0;

    for (const prospect of pending) {
      const title = (prospect.contact_title || "").toLowerCase();
      const industry = (prospect.industry || "").toLowerCase();
      let currentScore = prospect.score || 50;
      let adjustment = 0;

      // Boost for high-converting title
      if (highConvertingTitles.some((t) => title.includes(t) || t.includes(title))) {
        adjustment += 10;
      }

      // Boost for high-converting industry
      if (highConvertingIndustries.some((ind) => industry.includes(ind) || ind.includes(industry))) {
        adjustment += 5;
      }

      // Penalise zero-reply titles
      if (zeroReplyTitles.some((t) => title.includes(t) || t.includes(title))) {
        adjustment -= 10;
      }

      if (adjustment !== 0) {
        const newScore = Math.max(30, Math.min(100, currentScore + adjustment));

        if (newScore !== currentScore) {
          await supabase
            .from("warm_outreach_queue")
            .update({ score: newScore, updated_at: now.toISOString() })
            .eq("id", prospect.id);

          adjustedCount++;
        }
      }
    }

    console.log(`Auto-adjusted scores for ${adjustedCount} pending prospects`);

    // ───────────────────────────────────────────
    // PART 3: Subject line pattern analysis
    // ───────────────────────────────────────────

    const { data: openedEmails } = await supabase
      .from("prospect_outreach")
      .select("email_subject, opened_at, replied_at")
      .not("opened_at", "is", null)
      .gte("created_at", thirtyDaysAgo);

    const { data: allSentEmails } = await supabase
      .from("prospect_outreach")
      .select("email_subject")
      .gte("created_at", thirtyDaysAgo);

    const subjectPatterns = analyseSubjectPatterns(openedEmails || [], allSentEmails || []);

    // Store top 5 subject patterns
    try {
      for (const pattern of subjectPatterns.slice(0, 5)) {
        await supabase
          .from("outreach_insights")
          .upsert(
            {
              insight_type: "subject_pattern",
              insight_key: pattern.key,
              total_sent: pattern.sent,
              total_replied: pattern.opened,
              reply_rate: pattern.openRate,
              last_updated: now.toISOString(),
            },
            { onConflict: "insight_type,insight_key" }
          );
      }
    } catch (e) {
      console.warn("Could not store subject patterns:", e);
    }

    // ───────────────────────────────────────────
    // PART 4: Template rotation tracking
    // ───────────────────────────────────────────

    let templateWinner: string | null = null;
    try {
      const { data: templateData } = await supabase
        .from("prospect_outreach")
        .select("template_used, opened_at, replied_at")
        .not("template_used", "is", null)
        .gte("created_at", thirtyDaysAgo);

      if (templateData && templateData.length > 0) {
        // Check if template_variant column exists by trying to query it
        let variantData: any[] | null = null;
        try {
          const { data: vd } = await supabase
            .from("prospect_outreach")
            .select("template_variant, opened_at, replied_at")
            .not("template_variant", "is", null)
            .gte("created_at", thirtyDaysAgo)
            .limit(1);
          if (vd && vd.length > 0) {
            // Column exists, fetch all
            const { data: fullVariants } = await supabase
              .from("prospect_outreach")
              .select("template_variant, opened_at, replied_at")
              .gte("created_at", thirtyDaysAgo);
            variantData = fullVariants;
          }
        } catch {
          console.log("template_variant column not available — using template_used instead");
        }

        const dataToAnalyse = variantData || templateData;
        const fieldName = variantData ? "template_variant" : "template_used";

        const templateMap = new Map<string, { sent: number; opened: number; replied: number }>();

        for (const row of dataToAnalyse) {
          const key = (row as any)[fieldName] || "unknown";
          if (!templateMap.has(key)) templateMap.set(key, { sent: 0, opened: 0, replied: 0 });
          const stats = templateMap.get(key)!;
          stats.sent++;
          if (row.opened_at) stats.opened++;
          if (row.replied_at) stats.replied++;
        }

        let bestRate = 0;
        for (const [variant, stats] of templateMap.entries()) {
          if (stats.sent >= 5) {
            const rate = (stats.replied / stats.sent) * 100;
            if (rate > bestRate) {
              bestRate = rate;
              templateWinner = `${variant} (${round2(rate)}% reply rate, ${stats.sent} sent)`;
            }
          }

          // Store template insights
          try {
            await supabase
              .from("outreach_insights")
              .upsert(
                {
                  insight_type: "template_performance",
                  insight_key: variant,
                  total_sent: stats.sent,
                  total_replied: stats.replied,
                  reply_rate: stats.sent > 0 ? round2((stats.replied / stats.sent) * 100) : 0,
                  last_updated: now.toISOString(),
                },
                { onConflict: "insight_type,insight_key" }
              );
          } catch { /* best effort */ }
        }
      }
    } catch (e) {
      console.warn("Template analysis skipped:", e);
    }

    // ───────────────────────────────────────────
    // PART 5: Slack summary
    // ───────────────────────────────────────────

    const topTitles = titleBuckets
      .filter((b) => b.replied > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5)
      .map((b) => `${b.key} (${round2(b.rate)}%, ${b.replied}/${b.sent})`)
      .join("\n  - ") || "No replies yet";

    const topIndustries = industryBuckets
      .filter((b) => b.replied > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5)
      .map((b) => `${b.key} (${round2(b.rate)}%, ${b.replied}/${b.sent})`)
      .join("\n  - ") || "No replies yet";

    const topSubjects = subjectPatterns
      .slice(0, 3)
      .map((p) => `"${p.key}" (${round2(p.openRate)}% open rate)`)
      .join("\n  - ") || "Not enough data";

    // Build recommendations
    const recommendations: string[] = [];
    const overallReplyRate = emailed.length > 0 ? (replied.length / emailed.length) * 100 : 0;

    if (overallReplyRate > 3) {
      recommendations.push("Reply rate is healthy — consider increasing daily volume");
    } else if (overallReplyRate > 0) {
      recommendations.push("Reply rate is low — review email copy and subject lines");
    }

    if (highConvertingTitles.length > 0) {
      recommendations.push(`Focus on titles: ${highConvertingTitles.slice(0, 3).join(", ")}`);
    }
    if (zeroReplyTitles.length > 0) {
      recommendations.push(`Consider deprioritising: ${zeroReplyTitles.slice(0, 3).join(", ")}`);
    }
    if (highConvertingIndustries.length > 0) {
      recommendations.push(`Top industries: ${highConvertingIndustries.slice(0, 3).join(", ")}`);
    }

    const slackMessage = [
      "📊 *Outreach Optimizer — Weekly Performance*",
      "",
      `*Overall:* ${emailed.length} sent, ${replied.length} replies (${round2(overallReplyRate)}%)`,
      `*Avg score — replied:* ${avgScoreReplied} | *not replied:* ${avgScoreNotReplied}`,
      "",
      `*Top converting titles:*`,
      `  - ${topTitles}`,
      "",
      `*Top converting industries:*`,
      `  - ${topIndustries}`,
      "",
      `*Top subject patterns:*`,
      `  - ${topSubjects}`,
      "",
      `*Scores auto-adjusted for ${adjustedCount} pending prospects*`,
      templateWinner ? `*Template winner:* ${templateWinner}` : "",
      "",
      `*Recommendations:*`,
      ...recommendations.map((r) => `  → ${r}`),
    ]
      .filter(Boolean)
      .join("\n");

    // Post to Slack
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "agent_report",
          data: {
            function: "📊 Outreach Optimizer",
            error: slackMessage,
          },
        }),
      });
    } catch {
      console.warn("Slack notification failed — continuing");
    }

    // If there's a template winner, post that separately
    if (templateWinner) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: "mission-control",
            eventType: "agent_report",
            data: {
              function: "🏆 Template A/B Winner",
              error: templateWinner,
            },
          }),
        });
      } catch { /* best effort */ }
    }

    // ───────────────────────────────────────────
    // Log to agent_activity_log
    // ───────────────────────────────────────────

    await logActivity(
      supabase,
      "success",
      `Analysed ${emailed.length} emails (${replied.length} replies, ${round2(overallReplyRate)}% rate). Adjusted ${adjustedCount} prospect scores. Stored ${insightsStored} insights.`,
      adjustedCount,
      {
        total_emailed: emailed.length,
        total_replied: replied.length,
        reply_rate: round2(overallReplyRate),
        avg_score_replied: avgScoreReplied,
        avg_score_not_replied: avgScoreNotReplied,
        insights_stored: insightsStored,
        scores_adjusted: adjustedCount,
        top_titles: titleBuckets.filter((b) => b.replied > 0).slice(0, 5),
        top_industries: industryBuckets.filter((b) => b.replied > 0).slice(0, 5),
        recommendations,
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        emailed: emailed.length,
        replied: replied.length,
        reply_rate: round2(overallReplyRate),
        insights_stored: insightsStored,
        scores_adjusted: adjustedCount,
        recommendations,
      }),
      { headers }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("outreach-optimizer error:", errMsg);

    await logActivity(supabase, "error", errMsg, 0);

    // Alert Slack on failure
    try {
      await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          channel: "mission-control",
          eventType: "agent_report",
          data: { function: "outreach-optimizer", error: errMsg },
        }),
      });
    } catch { /* best effort */ }

    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});

// ─── Helper functions ────────────────────────────────────────

function buildBuckets(
  data: any[],
  field: string
): PerformanceBucket[] {
  const map = new Map<string, { sent: number; replied: number }>();

  for (const row of data) {
    const key = normaliseKey(row[field]);
    if (!key) continue;

    if (!map.has(key)) map.set(key, { sent: 0, replied: 0 });
    const bucket = map.get(key)!;
    bucket.sent++;
    if (row.reply_received === true) bucket.replied++;
  }

  return Array.from(map.entries())
    .map(([key, stats]) => ({
      key,
      sent: stats.sent,
      replied: stats.replied,
      rate: stats.sent > 0 ? round2((stats.replied / stats.sent) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate || b.sent - a.sent);
}

function analyseSubjectPatterns(
  openedEmails: { email_subject: string; opened_at: string | null; replied_at: string | null }[],
  allSentEmails: { email_subject: string }[]
): { key: string; opened: number; sent: number; openRate: number }[] {
  // Extract meaningful words/phrases from subjects
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "is", "it", "hi", "hey", "re", "fw", "fwd",
    "this", "that", "your", "you", "we", "our", "my", "i", "me",
  ]);

  const wordCounts = new Map<string, { opened: number; total: number }>();

  // Count words in all sent subjects
  for (const email of allSentEmails) {
    const words = extractWords(email.email_subject, stopWords);
    for (const word of words) {
      if (!wordCounts.has(word)) wordCounts.set(word, { opened: 0, total: 0 });
      wordCounts.get(word)!.total++;
    }
  }

  // Count words in opened subjects
  for (const email of openedEmails) {
    const words = extractWords(email.email_subject, stopWords);
    for (const word of words) {
      if (wordCounts.has(word)) {
        wordCounts.get(word)!.opened++;
      }
    }
  }

  return Array.from(wordCounts.entries())
    .filter(([_, stats]) => stats.total >= 5) // need enough data
    .map(([word, stats]) => ({
      key: word,
      opened: stats.opened,
      sent: stats.total,
      openRate: round2((stats.opened / stats.total) * 100),
    }))
    .sort((a, b) => b.openRate - a.openRate)
    .slice(0, 10);
}

function extractWords(subject: string | null, stopWords: Set<string>): string[] {
  if (!subject) return [];
  return subject
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .slice(0, 8); // cap to avoid noise from long subjects
}

function normaliseKey(value: any): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

async function logActivity(
  supabase: any,
  status: string,
  message: string,
  itemsProcessed: number,
  details?: Record<string, any>
) {
  try {
    await supabase.from("agent_activity_log").insert({
      agent_name: "outreach-optimizer",
      agent_type: "analytics",
      status,
      message,
      items_processed: itemsProcessed,
      ...(details ? { details } : {}),
    });
  } catch (e) {
    console.warn("Failed to log activity:", e);
  }
}
