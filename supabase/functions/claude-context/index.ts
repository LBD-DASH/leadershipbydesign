import { createClient } from "npm:@supabase/supabase-js@2";
import { format, subDays, startOfWeek } from "npm:date-fns@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const sevenDaysAgo = format(subDays(now, 7), "yyyy-MM-dd'T'00:00:00");
    const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd'T'00:00:00");
    const last24h = format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss");

    const [
      campaignRes,
      queueRes,
      emailsTodayRes,
      bookingsWeekRes,
      lacAllRes,
      prospects7dRes,
      emails7dRes,
      lac7dRes,
      bookings7dRes,
      contacts7dRes,
      projectsRes,
      activeSequencesRes,
      sequenceEmailsTodayRes,
      step2Res,
      step3Res,
      step4Res,
      manualLeadsRes,
      manualRecent24hRes,
      apolloLastSyncRes,
      activeWarmRes,
      linkedinQueueRes,
      linkedinNextRes,
      linkedinLastPublishedRes,
      outstandingRes,
      googleAdsStatusRes,
      googleAdsLearningRes,
      googleAdsImpressionsRes,
      googleAdsReviewRes,
    ] = await Promise.all([
      supabase.from("admin_settings").select("setting_value").eq("setting_key", "campaign_mode").maybeSingle(),
      supabase.from("warm_lead_sequences").select("*", { count: "exact", head: true }).eq("status", "awaiting_first_contact"),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", today + "T00:00:00"),
      supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", weekStart),
      supabase.from("leader_as_coach_assessments").select("*", { count: "exact", head: true }),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", sevenDaysAgo),
      supabase.from("leader_as_coach_assessments").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("contact_form_submissions").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("active_projects").select("*").neq("status", "done").order("priority", { ascending: true }),
      supabase.from("diagnostic_nurture_sequences").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("diagnostic_nurture_sequences").select("*", { count: "exact", head: true }).eq("diagnostic_type", "lac").gte("updated_at", today + "T00:00:00"),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("sequence_step", 2).gte("sent_at", sevenDaysAgo),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("sequence_step", 3).gte("sent_at", sevenDaysAgo),
      supabase.from("prospect_outreach").select("*", { count: "exact", head: true }).eq("sequence_step", 4).gte("sent_at", sevenDaysAgo),
      supabase.from("manual_outreach_leads").select("*"),
      supabase.from("manual_outreach_leads").select("first_name, last_name, company, connection_status").in("connection_status", ["connected", "replied"]).gte("updated_at", last24h),
      supabase.from("apollo_sync_log").select("*").order("synced_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("warm_lead_sequences").select("*", { count: "exact", head: true }).in("status", ["awaiting_first_contact", "contacted", "engaged"]),
      supabase.from("linkedin_post_schedule").select("*", { count: "exact", head: true }).eq("status", "queued"),
      supabase.from("linkedin_post_schedule").select("post_date, content_preview").eq("status", "queued").order("post_date", { ascending: true }).limit(1).maybeSingle(),
      supabase.from("linkedin_post_schedule").select("published_at, content_preview").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("outstanding_items").select("*").eq("resolved", false).order("priority", { ascending: true }),
      supabase.from("admin_settings").select("setting_value").eq("setting_key", "google_ads_status").maybeSingle(),
      supabase.from("admin_settings").select("setting_value").eq("setting_key", "google_ads_learning_start").maybeSingle(),
      supabase.from("admin_settings").select("setting_value").eq("setting_key", "google_ads_impressions").maybeSingle(),
      supabase.from("admin_settings").select("setting_value").eq("setting_key", "google_ads_review_date").maybeSingle(),
    ]);

    const campaign = campaignRes.data?.setting_value || "unknown";
    const projectLines = (projectsRes.data || [])
      .map((p: any) => `${p.emoji} ${p.title} — ${p.status.replace(/_/g, " ").toUpperCase()}${p.notes ? " | " + p.notes : ""}`)
      .join("\n");

    const manualLeads = (manualLeadsRes.data || []) as any[];
    const manualStatusCounts: Record<string, number> = {};
    ["not_sent", "request_sent", "connected", "messaged", "replied", "meeting_booked"].forEach(s => {
      manualStatusCounts[s] = manualLeads.filter((l: any) => l.connection_status === s).length;
    });
    const recentMovers = (manualRecent24hRes.data || []) as any[];
    const recentMoverLines = recentMovers.length > 0
      ? recentMovers.map((r: any) => `  ${r.first_name} ${r.last_name} (${r.company}) → ${r.connection_status.replace(/_/g, " ")}`).join("\n")
      : "  None in last 24h";

    const lastSync = apolloLastSyncRes.data;
    const lastSyncLine = lastSync
      ? `${format(new Date(lastSync.synced_at), "yyyy-MM-dd HH:mm")} — ${lastSync.status}${lastSync.error_message ? " — " + lastSync.error_message : ""}`
      : "No sync recorded";

    const linkedinNext = linkedinNextRes.data as any;
    const linkedinNextLine = linkedinNext
      ? `${linkedinNext.post_date} — ${(linkedinNext.content_preview || "").split(" ").slice(0, 10).join(" ")}…`
      : "None scheduled";
    const linkedinLast = linkedinLastPublishedRes.data as any;
    const linkedinLastLine = linkedinLast
      ? format(new Date(linkedinLast.published_at), "yyyy-MM-dd")
      : "None published";

    const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
    const outstandingItems = ((outstandingRes.data || []) as any[])
      .sort((a: any, b: any) => (priorityOrder[a.priority] || 9) - (priorityOrder[b.priority] || 9));
    const outstandingLines = outstandingItems.length > 0
      ? outstandingItems.map((item: any) => `  [${(item.priority || "medium").toUpperCase()}] ${item.item}`).join("\n")
      : "  No outstanding items";

    const gadsStatus = googleAdsStatusRes.data?.setting_value || "not configured";
    const gadsLearningStart = googleAdsLearningRes.data?.setting_value || null;
    const gadsImpressions = googleAdsImpressionsRes.data?.setting_value || "0";
    const gadsReviewDate = googleAdsReviewRes.data?.setting_value || "not set";
    let gadsDaysLearning = "–";
    if (gadsLearningStart) {
      const diff = Math.floor((now.getTime() - new Date(gadsLearningStart).getTime()) / (1000 * 60 * 60 * 24));
      gadsDaysLearning = String(diff);
    }

    const output = `LBD PERSONAL OPERATING SYSTEM — LIVE CONTEXT
Last updated: ${format(now, "yyyy-MM-dd HH:mm")} SAST

COMMERCIAL OFFER
Primary: Leader as Coach — 90-Day Manager Coaching Accelerator
Campaign mode: ${campaign.replace(/_/g, " ")}
Target: HR Directors, L&D Heads, under 500 person companies across all industries SA (EXCLUDING banks, FSI, insurance, education, consulting)

PIPELINE LIVE STATS
Queue pending: ${queueRes.count ?? 0}
Emails sent today: ${emailsTodayRes.count ?? 0}
Interested replies today: – (reply monitor pending)
Bookings this week: ${bookingsWeekRes.count ?? 0}
LAC Assessments all time: ${lacAllRes.count ?? 0}
Active LAC sequences: ${activeSequencesRes.count ?? 0}
Follow-up emails sent today: ${sequenceEmailsTodayRes.count ?? 0}

OUTREACH SEQUENCE (7d)
Day 1 (initial): ${(emails7dRes.count ?? 0) - (step2Res.count ?? 0) - (step3Res.count ?? 0) - (step4Res.count ?? 0)}
Day 4 (follow-up): ${step2Res.count ?? 0}
Day 9 (one question): ${step3Res.count ?? 0}
Day 16 (final note): ${step4Res.count ?? 0}

MANUAL OUTREACH STATUS
Total leads: ${manualLeads.length}
Not Sent: ${manualStatusCounts.not_sent} | Request Sent: ${manualStatusCounts.request_sent} | Connected: ${manualStatusCounts.connected} | Messaged: ${manualStatusCounts.messaged} | Replied: ${manualStatusCounts.replied} | Meeting Booked: ${manualStatusCounts.meeting_booked}
Recent movers (24h):
${recentMoverLines}

APOLLO STATUS
Active contacts in sequence: ${activeWarmRes.count ?? 0}
Last sync: ${lastSyncLine}
Emails sent today: ${emailsTodayRes.count ?? 0}
Current sequence: leader_as_coach_v2

LINKEDIN CONTENT
Next scheduled post: ${linkedinNextLine}
Posts remaining in queue: ${linkedinQueueRes.count ?? 0}
Last post published: ${linkedinLastLine}

GOOGLE ADS
Status: ${gadsStatus}
Days in learning mode: ${gadsDaysLearning}
Impressions to date: ${gadsImpressions}
Next review date: ${gadsReviewDate}

OUTSTANDING ITEMS
${outstandingLines}

SYSTEM STATUS
Firecrawl scraper: check edge function logs
Auto-outreach: check edge function logs
Auto-follow-up: 4-step sequence (Day 1, 4, 9, 16) — active
LAC nurture: active via lac-follow-up cron
Gmail monitor: active via gmail-reply-classifier cron (every 30 min)
Slack: connected via connector
Google Tag firing: verify in GTM (GTM-TV3SFR3G)
Google Ads active: ${gadsStatus}

ACTIVE PROJECTS (excludes DONE)
${projectLines}

LAST 7 DAYS
Prospects added: ${prospects7dRes.count ?? 0}
Emails sent: ${emails7dRes.count ?? 0}
LAC Assessments: ${lac7dRes.count ?? 0}
Bookings: ${bookings7dRes.count ?? 0}
Contact submissions: ${contacts7dRes.count ?? 0}

WEBSITE PAGES LIVE
/ — Homepage
/leader-as-coach — Sales page
/leader-as-coach-diagnostic — LAC Diagnostic
/leadership-diagnostic — Leadership Diagnostic
/diagnostic — Team Diagnostic
/shift-diagnostic — SHIFT Diagnostic
/contagious-identity — Executive Coaching
/products — Products store
/contact — Contact form
/blog — Blog
/coaching-readiness-guide — Gated Lead Magnet (email gate → PDF download)

FRAMEWORKS
SHIFT: Self-Management, Human Intelligence, Innovation, Focus, Thinking, Your AI Edge
Leader as Coach: 90-day, 3 months, all industries (excl. banks, FSI, insurance, education, consulting)
Contagious Identity: 6-session executive coaching programme

STATS (never change these)
4,000+ leaders | 30+ organisations | 30+ programmes | 11 years`;

    return new Response(output, {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Error: ${errMsg}`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
