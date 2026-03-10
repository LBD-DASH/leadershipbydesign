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
      ]);

      const campaign = campaignRes.data?.setting_value || 'unknown';
      const projectLines = (projectsRes.data || [])
        .map((p: any) => `${p.emoji} ${p.title} — ${p.status.replace(/_/g, ' ').toUpperCase()}${p.notes ? ' | ' + p.notes : ''}`)
        .join('\n');

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
Active sequences: ${activeSequencesRes.count ?? 0}
Follow-up emails sent today: ${sequenceEmailsTodayRes.count ?? 0}

SYSTEM STATUS
Firecrawl scraper: check edge function logs
Auto-outreach: check edge function logs
Gmail monitor: not yet connected
Slack: connected via connector
Google Tag firing: verify in GTM (GTM-TV3SFR3G)
Google Ads active: credentials pending

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
