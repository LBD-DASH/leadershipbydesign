import { createClient } from "npm:@supabase/supabase-js@2";

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/slack/api';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface SlackNotifyPayload {
  eventType: string;
  sourceApp?: string;
  channel?: string;
  blocks?: any[];
  data: Record<string, any>;
}

// Channel name → ID cache (per invocation)
const channelCache: Record<string, string> = {};

async function resolveChannel(channelName: string, headers: Record<string, string>): Promise<string | null> {
  const clean = channelName.replace(/^#/, '');
  if (channelCache[clean]) return channelCache[clean];

  try {
    let cursor = '';
    do {
      const params = new URLSearchParams({ types: 'public_channel', limit: '200' });
      if (cursor) params.set('cursor', cursor);

      console.log(`[slack-notify] Resolving channel: ${clean}, calling conversations.list`);
      const res = await fetch(`${GATEWAY_URL}/conversations.list?${params}`, { headers });
      const data = await res.json();
      console.log(`[slack-notify] conversations.list response ok=${data.ok}, channels=${(data.channels || []).length}, error=${data.error || 'none'}`);
      if (!data.ok) {
        console.error('[slack-notify] conversations.list error:', data.error);
        return null;
      }
      for (const ch of data.channels || []) {
        channelCache[ch.name] = ch.id;
      }
      cursor = data.response_metadata?.next_cursor || '';
    } while (cursor);
  } catch (e) {
    console.error('Channel resolution error:', e);
    return null;
  }

  return channelCache[clean] || null;
}

async function postSlack(
  channel: string,
  blocks: any[],
  text: string,
  headers: Record<string, string>,
  username?: string,
  iconEmoji?: string,
) {
  const channelId = await resolveChannel(channel, headers);
  if (!channelId) {
    console.error(`Channel #${channel} not found. Create it in Slack first.`);
    return;
  }

  // Auto-join the channel before posting
  try {
    await fetch(`${GATEWAY_URL}/conversations.join`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: channelId }),
    });
  } catch (e) {
    // Non-fatal — bot may already be in channel
  }

  const body: Record<string, any> = { channel: channelId, blocks, text };
  if (username) body.username = username;
  if (iconEmoji) body.icon_emoji = iconEmoji;

  const res = await fetch(`${GATEWAY_URL}/chat.postMessage`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  if (!result.ok) console.error('Slack postMessage error:', result.error);
  return result;
}

// ── Block Kit formatters ──────────────────────────────────

function sast(): string {
  return new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit' });
}

function buildLeadBlocks(data: Record<string, any>) {
  const temp = data.temperature || 'cool';
  const emoji = temp === 'hot' ? '🔥' : temp === 'warm' ? '💼' : '❄️';
  const label = temp.charAt(0).toUpperCase() + temp.slice(1);
  return [
    { type: 'header', text: { type: 'plain_text', text: `${emoji} ${label} Lead Alert`, emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Score:*\n${data.score || '?'}/100` },
      { type: 'mrkdwn', text: `*Temperature:*\n${label}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Name:*\n${data.name || 'Unknown'}` },
      { type: 'mrkdwn', text: `*Email:*\n${data.email || '—'}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Company:*\n${data.company || '—'}` },
      { type: 'mrkdwn', text: `*Source:*\n${data.source || '—'}` },
    ]},
    ...(data.aiSummary ? [{ type: 'section', text: { type: 'mrkdwn', text: `*🤖 AI:* ${data.aiSummary.slice(0, 200)}` } }] : []),
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${data.sourceApp || 'LeadershipByDesign'} • ${sast()} SAST` }] },
  ];
}

function buildSignupBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '📩 New Subscriber', emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Name:*\n${data.name || '—'}` },
      { type: 'mrkdwn', text: `*Email:*\n${data.email || '—'}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Source:*\n${data.source || '—'}` },
    ]},
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

function buildPurchaseBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '💰 New Sale', emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Product:*\n${data.product || '—'}` },
      { type: 'mrkdwn', text: `*Amount:*\nR${data.amount || '?'}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Buyer:*\n${data.name || '—'}` },
      { type: 'mrkdwn', text: `*Email:*\n${data.email || '—'}` },
    ]},
    ...(data.reference ? [{ type: 'section', fields: [{ type: 'mrkdwn', text: `*Reference:*\n${data.reference}` }] }] : []),
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

function buildNewsletterGeneratedBlocks(data: Record<string, any>) {
  const isManual = data.manualDraft;
  const headerText = isManual ? '✏️ Newsletter Draft Saved' : '📬 Newsletter Ready for Approval';
  const buttons: any[] = [];
  if (!isManual && data.approveUrl) buttons.push({ type: 'button', text: { type: 'plain_text', text: '✅ Approve' }, url: data.approveUrl, style: 'primary' });
  if (!isManual && data.rejectUrl) buttons.push({ type: 'button', text: { type: 'plain_text', text: '❌ Reject' }, url: data.rejectUrl, style: 'danger' });

  return [
    { type: 'header', text: { type: 'plain_text', text: headerText, emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: `*Subject:* "${data.subject || '—'}"${isManual ? '\n_Manually composed — ready for review_' : `\n*Topic:* ${data.topic || '—'}`}` } },
    ...(data.sourceCount ? [{ type: 'context', elements: [{ type: 'mrkdwn', text: `📚 ${data.sourceCount} sources analyzed` }] }] : []),
    ...(buttons.length ? [{ type: 'actions', elements: buttons }] : []),
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

function buildNewsletterApprovalRequestBlocks(data: Record<string, any>) {
  const round = data.rewriteRound || 0;
  const headerText = round > 0 ? `📬 [REWRITE — Round ${round + 1}] Newsletter for Approval` : '📬 Newsletter Ready for Approval';

  const blocks: any[] = [
    { type: 'header', text: { type: 'plain_text', text: headerText, emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: `*Subject:* "${data.subject || '—'}"` } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Pain Point:*\n${data.painPoint || '—'}` },
      { type: 'mrkdwn', text: `*Service Bridge:*\n${data.serviceReferenced || '—'}` },
    ]},
    { type: 'divider' },
    { type: 'section', text: { type: 'mrkdwn', text: `*HOOK:*\n${(data.hook || '').slice(0, 500)}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*THE PROBLEM:*\n${(data.problemFramed || '').slice(0, 500)}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*THE SHIFT:*\n${(data.theShift || '').slice(0, 500)}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*SOLUTION BRIDGE:*\n${(data.solutionBridge || '').slice(0, 500)}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*CLOSING:*\n${data.closingLine || '—'}` } },
    { type: 'divider' },
    { type: 'section', text: { type: 'mrkdwn', text: `Reply *"approved"* or *"send"* to approve.\nReply with any other text to reject with feedback.\nNo reply within 4 hours = auto-rewrite.\n\n_Newsletter ID: ${data.newsletterId || '—'}_` } },
  ];

  if (data.monthlyTheme) {
    blocks.splice(2, 0, { type: 'context', elements: [{ type: 'mrkdwn', text: `🎯 Monthly Theme: ${data.monthlyTheme}` }] });
  }

  blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] });
  return blocks;
}

function buildNewsletterManualNeededBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '⚠️ Newsletter Needs Manual Input', emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: `After *${data.rounds}* rewrite rounds, the newsletter still hasn't been approved.\n\n*Last subject:* "${data.subject || '—'}"\n\nThe automated rewrite loop has been paused. Please compose or edit manually.` } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Newsletter ID: ${data.newsletterId || '—'} • ${sast()} SAST` }] },
  ];
}

function buildNewsletterApprovedBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '✅ Newsletter Approved & Sent', emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Subject:*\n"${data.subject || '—'}"` },
      { type: 'mrkdwn', text: `*Recipients:*\n${data.recipientCount || '?'}` },
    ]},
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

function buildNewsletterRejectedBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '❌ Newsletter Rejected', emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: `*Subject:* "${data.subject || '—'}"` } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

function buildTractionBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '🔥 Traction Alert', emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Campaign:*\n"${data.subject || '—'}"` },
      { type: 'mrkdwn', text: `*${data.metric || 'Metric'}:*\n${data.value || '?'}` },
    ]},
    ...(data.recipients ? [{ type: 'section', fields: [{ type: 'mrkdwn', text: `*Recipients:*\n${data.recipients}` }] }] : []),
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

function buildSystemErrorBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '⚠️ System Error', emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: `*Function:* ${data.function || '—'}\n*Error:* ${(data.error || '—').slice(0, 500)}` } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

function buildDailyLeadsDigestBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '📊 Daily Leads & Signups Digest', emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*New Subscribers:*\n${data.subscribers}` },
      { type: 'mrkdwn', text: `*Contact Forms:*\n${data.contacts}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Diagnostics Completed:*\n${data.diagnostics}` },
      { type: 'mrkdwn', text: `*Lead Magnets Downloaded:*\n${data.downloads}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Purchases:*\n${data.purchases}` },
      { type: 'mrkdwn', text: `*Prospects Discovered:*\n${data.prospects}` },
    ]},
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Daily summary • ${sast()} SAST` }] },
  ];
}

function buildCadenceReminderBlocks(data: Record<string, any>) {
  const buttons: any[] = [];
  if (data.contactedUrl) buttons.push({ type: 'button', text: { type: 'plain_text', text: '📞 Contacted' }, url: data.contactedUrl });
  if (data.engagedUrl) buttons.push({ type: 'button', text: { type: 'plain_text', text: '🤝 Engaged' }, url: data.engagedUrl, style: 'primary' });
  if (data.bookedUrl) buttons.push({ type: 'button', text: { type: 'plain_text', text: '📅 Booked' }, url: data.bookedUrl, style: 'primary' });

  return [
    { type: 'header', text: { type: 'plain_text', text: `⏰ ${data.dayLabel} Follow-Up Due`, emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Lead:*\n${data.leadName || '—'}` },
      { type: 'mrkdwn', text: `*Company:*\n${data.leadCompany || '—'}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Email:*\n${data.leadEmail || '—'}` },
    ]},
    ...(buttons.length ? [{ type: 'actions', elements: buttons }] : []),
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Warm Lead Cadence • ${sast()} SAST` }] },
  ];
}

function buildDailyHealthCheckBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '🩺 Daily System Health Check', emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Active Sequences:*\n${data.activeSequences}` },
      { type: 'mrkdwn', text: `*Outreach Sent Today:*\n${data.outreachSent}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Engaged This Week:*\n${data.engaged}` },
      { type: 'mrkdwn', text: `*Status:*\n✅ All systems operational` },
    ]},
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Health check • ${sast()} SAST` }] },
  ];
}

function buildHourlyPulseBlocks(data: Record<string, any>) {
  const lines: string[] = [];
  if (data.subscribers > 0) lines.push(`📩 *${data.subscribers}* new subscriber${data.subscribers > 1 ? 's' : ''}`);
  if (data.contacts > 0) lines.push(`📋 *${data.contacts}* contact form${data.contacts > 1 ? 's' : ''}`);
  if (data.diagnostics > 0) lines.push(`🧭 *${data.diagnostics}* diagnostic${data.diagnostics > 1 ? 's' : ''} completed`);
  if (data.downloads > 0) lines.push(`📥 *${data.downloads}* lead magnet download${data.downloads > 1 ? 's' : ''}`);
  if (data.purchases > 0) lines.push(`💰 *${data.purchases}* purchase${data.purchases > 1 ? 's' : ''}`);
  if (data.coaching > 0) lines.push(`🎯 *${data.coaching}* coaching inquir${data.coaching > 1 ? 'ies' : 'y'}`);

  return [
    { type: 'header', text: { type: 'plain_text', text: `⚡ Hourly Pulse — ${data.total} new`, emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Last hour ending ${data.hour || ''} SAST` }] },
  ];
}

function buildPipelineCompleteBlocks(data: Record<string, any>) {
  return [
    { type: 'header', text: { type: 'plain_text', text: '🤖 Daily Caller Pipeline Complete', emoji: true } },
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Industry:*\n${data.industry || '—'}` },
      { type: 'mrkdwn', text: `*New Prospects Added:*\n${data.added || 0}` },
    ]},
    { type: 'section', fields: [
      { type: 'mrkdwn', text: `*Pages Scraped:*\n${data.pages_scraped || 0}` },
      { type: 'mrkdwn', text: `*Domains Found:*\n${data.domains_discovered || 0}` },
    ]},
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Auto-pipeline • ${sast()} SAST` }] },
  ];
}

function buildPipelineStatusBlocks(data: Record<string, any>) {
  const replyLine = data.totalReplies > 0
    ? `🔥 Interested: ${data.repliesInterested} | ❌ Not interested: ${data.repliesNotInterested} | 🔄 OOO: ${data.repliesOOO} | 🚫 Unsub: ${data.repliesUnsubscribed}`
    : 'No replies yet';

  return [
    { type: 'header', text: { type: 'plain_text', text: `🎯 LBD Pipeline — ${data.time || ''}`, emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: `*PROSPECTING*\n✅ New prospects added: ${data.prospectsAdded}\n🏭 Industries: ${data.industries || '—'}\n❌ Disqualified (wrong industry): ${data.disqualified || 0}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*OUTREACH*\n📧 Emails sent today: ${data.emailsSent}\n📬 Replies received: ${data.totalReplies} (${replyLine})\n📅 Bookings confirmed: ${data.bookings}\n🔄 Queue depth: ${data.queueDepth} pending` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*DIAGNOSTICS*\n🎯 New LAC Assessments completed: ${data.lacAssessments || 0}` } },
    ...(data.failed > 0 ? [{ type: 'section', text: { type: 'mrkdwn', text: `⚠️ *${data.failed} failed send(s)* — details in #system-health` } }] : []),
    { type: 'context', elements: [{ type: 'mrkdwn', text: `Pipeline report • ${sast()} SAST` }] },
  ];
}

function buildHotLeadAlertBlocks(data: Record<string, any>) {
  const fields = [
    { type: 'mrkdwn', text: `*Name:*\n${data.name || 'Unknown'}` },
    { type: 'mrkdwn', text: `*Company:*\n${data.company || '—'}` },
  ];
  if (data.source) fields.push({ type: 'mrkdwn', text: `*Source:*\n${data.source}` });
  if (data.profile) fields.push({ type: 'mrkdwn', text: `*Profile:*\n${data.profile} — Score: ${data.score || '?'}` });
  if (data.action) fields.push({ type: 'mrkdwn', text: `*Action:*\n${data.action}` });

  return [
    { type: 'header', text: { type: 'plain_text', text: '🔥 HOT LEAD', emoji: true } },
    { type: 'section', fields },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `${sast()} SAST` }] },
  ];
}

// ── Event → channel + format routing ──────────────────────

const EVENT_CONFIG: Record<string, {
  channels: string[];
  username: string;
  icon: string;
  buildBlocks: (data: Record<string, any>) => any[];
  text: (data: Record<string, any>) => string;
}> = {
  new_lead: {
    channels: ['leads-and-signups'],
    username: 'LBD Lead Alert',
    icon: ':bust_in_silhouette:',
    buildBlocks: buildLeadBlocks,
    text: (d) => `New ${d.temperature || ''} lead: ${d.name || 'Unknown'}`,
  },
  new_signup: {
    channels: ['leads-and-signups'],
    username: 'LBD Growth',
    icon: ':envelope:',
    buildBlocks: buildSignupBlocks,
    text: (d) => `New subscriber: ${d.email || ''}`,
  },
  purchase: {
    channels: ['mission-control'],
    username: 'LBD Revenue',
    icon: ':moneybag:',
    buildBlocks: buildPurchaseBlocks,
    text: (d) => `New sale: ${d.product || 'Unknown'} — R${d.amount || '?'}`,
  },
  newsletter_generated: {
    channels: ['newsletter-engine'],
    username: 'LBD Newsletter',
    icon: ':newspaper:',
    buildBlocks: buildNewsletterGeneratedBlocks,
    text: (d) => `Newsletter ready: "${d.subject || ''}"`,
  },
  newsletter_approved: {
    channels: ['mission-control', 'newsletter-engine'],
    username: 'LBD Newsletter',
    icon: ':white_check_mark:',
    buildBlocks: buildNewsletterApprovedBlocks,
    text: (d) => `Newsletter sent to ${d.recipientCount || '?'} subscribers`,
  },
  newsletter_rejected: {
    channels: ['newsletter-engine'],
    username: 'LBD Newsletter',
    icon: ':x:',
    buildBlocks: buildNewsletterRejectedBlocks,
    text: (d) => `Newsletter rejected: "${d.subject || ''}"`,
  },
  traction_alert: {
    channels: ['mission-control'],
    username: 'LBD Traction',
    icon: ':fire:',
    buildBlocks: buildTractionBlocks,
    text: (d) => `Traction: ${d.metric || ''} hit ${d.value || ''}`,
  },
  system_error: {
    channels: ['system-health'],
    username: 'LBD System',
    icon: ':warning:',
    buildBlocks: buildSystemErrorBlocks,
    text: (d) => `Error in ${d.function || 'unknown'}: ${(d.error || '').slice(0, 100)}`,
  },
  daily_leads_digest: {
    channels: ['leads-and-signups'],
    username: 'LBD Daily Digest',
    icon: ':bar_chart:',
    buildBlocks: buildDailyLeadsDigestBlocks,
    text: (d) => `Daily digest: ${d.subscribers} subscribers, ${d.contacts} contacts, ${d.diagnostics} diagnostics`,
  },
  daily_health_check: {
    channels: ['system-health'],
    username: 'LBD Health Check',
    icon: ':stethoscope:',
    buildBlocks: buildDailyHealthCheckBlocks,
    text: (d) => `Health check: ${d.activeSequences} active sequences, ${d.outreachSent} outreach sent`,
  },
  cadence_reminder: {
    channels: ['leads-and-signups'],
    username: 'LBD Cadence',
    icon: ':alarm_clock:',
    buildBlocks: buildCadenceReminderBlocks,
    text: (d) => `${d.dayLabel} follow-up due: ${d.leadName || 'Unknown'}`,
  },
  hourly_leads_pulse: {
    channels: ['leads-and-signups'],
    username: 'LBD Pulse',
    icon: ':zap:',
    buildBlocks: buildHourlyPulseBlocks,
    text: (d) => `Hourly pulse: ${d.total} new activities`,
  },
  daily_pipeline_complete: {
    channels: ['mission-control'],
    username: 'LBD Auto Pipeline',
    icon: ':robot_face:',
    buildBlocks: buildPipelineCompleteBlocks,
    text: (d) => `Pipeline: ${d.added} prospects added from ${d.industry}`,
  },
  pipeline_status_report: {
    channels: ['mission-control'],
    username: 'LBD Pipeline Status',
    icon: ':bar_chart:',
    buildBlocks: buildPipelineStatusBlocks,
    text: (d) => `🎯 LBD Pipeline — ${d.time} | Sent: ${d.emailsSent} | Queue: ${d.queueDepth} | Booked: ${d.bookings}`,
  },
  hot_lead_alert: {
    channels: ['leads-and-signups'],
    username: 'LBD Hot Lead',
    icon: ':fire:',
    buildBlocks: buildHotLeadAlertBlocks,
    text: (d) => `🔥 HOT LEAD — ${d.name} at ${d.company} (${d.source})`,
  },
  newsletter_approval_request: {
    channels: ['newsletter-engine'],
    username: 'LBD Newsletter',
    icon: ':newspaper:',
    buildBlocks: buildNewsletterApprovalRequestBlocks,
    text: (d) => `Newsletter for approval: "${d.subject || ''}"`,
  },
  newsletter_manual_needed: {
    channels: ['newsletter-engine'],
    username: 'LBD Newsletter',
    icon: ':warning:',
    buildBlocks: buildNewsletterManualNeededBlocks,
    text: (d) => `Newsletter needs manual input after ${d.rounds} rounds`,
  },
};

// ── Main handler ──────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const SLACK_API_KEY = Deno.env.get('SLACK_API_KEY');
    if (!SLACK_API_KEY) throw new Error('SLACK_API_KEY is not configured');

    const slackHeaders = {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': SLACK_API_KEY,
    };

    // Auth: accept either service-role key or x-admin-token
    const authHeader = req.headers.get('authorization') || '';
    const adminToken = req.headers.get('x-admin-token') || '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const isServiceCall = authHeader.includes(serviceKey);
    const isAdminCall = adminToken && adminToken === Deno.env.get('ADMIN_TOKEN');
    const isInternalCall = authHeader.includes('Bearer ') && authHeader.includes(Deno.env.get('SUPABASE_ANON_KEY') || '___');

    // Allow internal function calls, service role calls, admin token calls, and anon calls (from frontend)
    // For external multi-app support, x-admin-token is validated

    const payload: SlackNotifyPayload = await req.json();
    const { eventType, data } = payload;

    const config = EVENT_CONFIG[eventType];
    if (!config) {
      return new Response(JSON.stringify({ error: `Unknown eventType: ${eventType}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use custom blocks if provided, otherwise use event config
    const blocks = payload.blocks || config.buildBlocks(data);
    const text = config.text(data);

    // Hot leads also go to mission-control
    let channels = [...config.channels];
    if (eventType === 'new_lead' && data.temperature === 'hot') {
      channels.push('mission-control');
    }

    // Override channel if explicitly provided
    if (payload.channel) {
      channels = [payload.channel.replace(/^#/, '')];
    }

    // Post to all target channels (fire and forget style but await for response)
    const results = await Promise.allSettled(
      channels.map(ch => postSlack(ch, blocks, text, slackHeaders, config.username, config.icon))
    );

    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length) {
      console.error('Some Slack posts failed:', failures);
    }

    return new Response(JSON.stringify({ success: true, channels }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('slack-notify error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
