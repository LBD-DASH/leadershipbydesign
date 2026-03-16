import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfWeek } from 'date-fns';

export default function ClaudeContext() {
  const [text, setText] = useState('Loading...');

  useEffect(() => {
    async function load() {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
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
        // Manual outreach
        manualLeadsRes,
        manualRecent24hRes,
        // Apollo
        apolloLastSyncRes,
        activeWarmRes,
        // LinkedIn
        linkedinQueueRes,
        linkedinNextRes,
        linkedinLastPublishedRes,
        // Outstanding items
        outstandingRes,
        // Google Ads settings
        googleAdsStatusRes,
        googleAdsLearningRes,
        googleAdsImpressionsRes,
        googleAdsReviewRes,
      ] = await Promise.all([
        supabase.from('admin_settings').select('setting_value').eq('setting_key', 'outreach_campaign_mode').maybeSingle(),
        supabase.from('warm_lead_sequences').select('*', { count: 'exact', head: true }).eq('status', 'awaiting_first_contact'),
        supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', today + 'T00:00:00'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
        supabase.from('leader_as_coach_assessments').select('*', { count: 'exact', head: true }),
        supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
        supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', sevenDaysAgo),
        supabase.from('leader_as_coach_assessments').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
        supabase.from('contact_form_submissions').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
        supabase.from('active_projects').select('*').order('priority', { ascending: true }),
        supabase.from('diagnostic_nurture_sequences').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('diagnostic_nurture_sequences').select('*', { count: 'exact', head: true }).eq('diagnostic_type', 'lac').gte('updated_at', today + 'T00:00:00'),
        supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).eq('sequence_step', 2).gte('sent_at', sevenDaysAgo),
        supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).eq('sequence_step', 3).gte('sent_at', sevenDaysAgo),
        supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).eq('sequence_step', 4).gte('sent_at', sevenDaysAgo),
        // Manual outreach leads - all
        supabase.from('manual_outreach_leads' as any).select('*') as any,
        // Manual outreach - recent movers (connected/replied in 24h)
        supabase.from('manual_outreach_leads' as any).select('first_name, last_name, company, connection_status').in('connection_status', ['connected', 'replied']).gte('updated_at', last24h) as any,
        // Apollo last sync
        supabase.from('apollo_sync_log').select('*').order('synced_at', { ascending: false }).limit(1).maybeSingle(),
        // Active warm sequences
        supabase.from('warm_lead_sequences').select('*', { count: 'exact', head: true }).in('status', ['awaiting_first_contact', 'contacted', 'engaged']),
        // LinkedIn queue
        supabase.from('linkedin_post_schedule' as any).select('*', { count: 'exact', head: true }).eq('status', 'queued') as any,
        // LinkedIn next post
        supabase.from('linkedin_post_schedule' as any).select('post_date, content_preview').eq('status', 'queued').order('post_date', { ascending: true }).limit(1).maybeSingle() as any,
        // LinkedIn last published
        supabase.from('linkedin_post_schedule' as any).select('published_at, content_preview').eq('status', 'published').order('published_at', { ascending: false }).limit(1).maybeSingle() as any,
        // Outstanding items
        supabase.from('outstanding_items' as any).select('*').eq('resolved', false).order('priority', { ascending: true }) as any,
        // Google Ads settings
        supabase.from('admin_settings').select('setting_value').eq('setting_key', 'google_ads_status').maybeSingle(),
        supabase.from('admin_settings').select('setting_value').eq('setting_key', 'google_ads_learning_start').maybeSingle(),
        supabase.from('admin_settings').select('setting_value').eq('setting_key', 'google_ads_impressions').maybeSingle(),
        supabase.from('admin_settings').select('setting_value').eq('setting_key', 'google_ads_review_date').maybeSingle(),
      ]);

      const campaign = campaignRes.data?.setting_value || 'unknown';
      const projectLines = (projectsRes.data || [])
        .map((p: any) => `${p.emoji} ${p.title} — ${p.status.replace(/_/g, ' ').toUpperCase()}${p.notes ? ' | ' + p.notes : ''}`)
        .join('\n');

      // Manual outreach stats
      const manualLeads = (manualLeadsRes.data || []) as any[];
      const manualStatusCounts: Record<string, number> = {};
      ['not_sent', 'request_sent', 'connected', 'messaged', 'replied', 'meeting_booked'].forEach(s => {
        manualStatusCounts[s] = manualLeads.filter((l: any) => l.connection_status === s).length;
      });
      const recentMovers = (manualRecent24hRes.data || []) as any[];
      const recentMoverLines = recentMovers.length > 0
        ? recentMovers.map((r: any) => `  ${r.first_name} ${r.last_name} (${r.company}) → ${r.connection_status.replace(/_/g, ' ')}`).join('\n')
        : '  None in last 24h';

      // Apollo status
      const lastSync = apolloLastSyncRes.data;
      const lastSyncLine = lastSync
        ? `${format(new Date(lastSync.synced_at), 'yyyy-MM-dd HH:mm')} — ${lastSync.status}${lastSync.error_message ? ' — ' + lastSync.error_message : ''}`
        : 'No sync recorded';

      // LinkedIn
      const linkedinNext = linkedinNextRes.data as any;
      const linkedinNextLine = linkedinNext
        ? `${linkedinNext.post_date} — ${(linkedinNext.content_preview || '').split(' ').slice(0, 10).join(' ')}…`
        : 'None scheduled';
      const linkedinLast = linkedinLastPublishedRes.data as any;
      const linkedinLastLine = linkedinLast
        ? format(new Date(linkedinLast.published_at), 'yyyy-MM-dd')
        : 'None published';

      // Outstanding items
      const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
      const outstandingItems = ((outstandingRes.data || []) as any[])
        .sort((a: any, b: any) => (priorityOrder[a.priority] || 9) - (priorityOrder[b.priority] || 9));
      const outstandingLines = outstandingItems.length > 0
        ? outstandingItems.map((item: any) => `  [${(item.priority || 'medium').toUpperCase()}] ${item.item}`).join('\n')
        : '  No outstanding items';

      // Google Ads
      const gadsStatus = googleAdsStatusRes.data?.setting_value || 'not configured';
      const gadsLearningStart = googleAdsLearningRes.data?.setting_value || null;
      const gadsImpressions = googleAdsImpressionsRes.data?.setting_value || '0';
      const gadsReviewDate = googleAdsReviewRes.data?.setting_value || 'not set';
      let gadsDaysLearning = '–';
      if (gadsLearningStart) {
        const diff = Math.floor((now.getTime() - new Date(gadsLearningStart).getTime()) / (1000 * 60 * 60 * 24));
        gadsDaysLearning = String(diff);
      }

      const output = `LBD PERSONAL OPERATING SYSTEM — LIVE CONTEXT
Last updated: ${format(now, 'yyyy-MM-dd HH:mm')} SAST

COMMERCIAL OFFER
Primary: Leader as Coach — 90-Day Manager Coaching Accelerator
Campaign mode: ${campaign.replace(/_/g, ' ')}
Target: HR Directors, L&D Heads, 100-500 person FSI/Professional Services SA

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
Gmail monitor: not yet connected
Slack: connected via connector
Google Tag firing: verify in GTM (GTM-TV3SFR3G)
Google Ads active: ${gadsStatus}

ACTIVE PROJECTS
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
/claude-context — This page

FRAMEWORKS
SHIFT: Self-Management, Human Intelligence, Innovation, Focus, Thinking, Your AI Edge
Leader as Coach: 90-day, 3 months, FSI focus
Contagious Identity: 6-session executive coaching programme

STATS (never change these)
4,000+ leaders | 50+ organisations | 750+ programmes | 11 years`;

      setText(output);
    }
    load();
  }, []);

  return (
    <pre style={{
      fontFamily: 'monospace',
      fontSize: '14px',
      padding: '24px',
      whiteSpace: 'pre-wrap',
      background: '#fff',
      color: '#111',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {text}
    </pre>
  );
}
