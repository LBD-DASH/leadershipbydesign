import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Allow admin token OR cron invocation (via auth header)
    const adminToken = req.headers.get('x-admin-token');
    const authHeader = req.headers.get('authorization');
    const isAuthorized = adminToken === 'Bypass2024' || authHeader?.includes(Deno.env.get('SUPABASE_ANON_KEY') || '');

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY');
    if (!APOLLO_API_KEY) {
      return new Response(JSON.stringify({ error: 'APOLLO_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active tracked sequences
    const { data: tracked, error: trackErr } = await supabase
      .from('apollo_sequence_tracking')
      .select('*')
      .eq('status', 'active');

    if (trackErr || !tracked?.length) {
      return new Response(JSON.stringify({ 
        message: 'No active sequences to check',
        tracked_count: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Checking engagement for ${tracked.length} active sequence contacts`);

    const apolloHeaders = {
      'Content-Type': 'application/json',
      'X-Api-Key': APOLLO_API_KEY,
    };

    // Group by sequence for efficient API calls
    const bySequence: Record<string, typeof tracked> = {};
    for (const t of tracked) {
      if (!bySequence[t.apollo_sequence_id]) bySequence[t.apollo_sequence_id] = [];
      bySequence[t.apollo_sequence_id].push(t);
    }

    const alerts: Array<{ name: string; email: string; company: string; signal: string; sequence: string }> = [];
    const callListAdditions: Array<{ first_name: string; last_name: string; email: string; company: string; phone: string; title: string; source: string }> = [];

    for (const [sequenceId, contacts] of Object.entries(bySequence)) {
      // Check outreach emails for this sequence
      try {
        const emailSearchRes = await fetch(`https://api.apollo.io/api/v1/emailer_messages/search?emailer_campaign_ids[]=${sequenceId}&per_page=100`, {
          method: 'GET',
          headers: apolloHeaders,
        });

        if (!emailSearchRes.ok) {
          console.error(`Failed to fetch emails for sequence ${sequenceId}: ${emailSearchRes.status}`);
          continue;
        }

        const emailData = await emailSearchRes.json();
        const messages = emailData.emailer_messages || [];

        // Build engagement map per contact
        const engagementMap: Record<string, { opens: number; clicks: number; replies: number; bounced: boolean; sent: number }> = {};

        for (const msg of messages) {
          const contactId = msg.contact_id;
          if (!contactId) continue;

          if (!engagementMap[contactId]) {
            engagementMap[contactId] = { opens: 0, clicks: 0, replies: 0, bounced: false, sent: 0 };
          }

          engagementMap[contactId].sent++;

          if (msg.open_count > 0) engagementMap[contactId].opens += msg.open_count;
          if (msg.click_count > 0) engagementMap[contactId].clicks += msg.click_count;
          if (msg.has_reply) engagementMap[contactId].replies++;
          if (msg.is_bounced) engagementMap[contactId].bounced = true;
        }

        // Update each tracked contact
        for (const contact of contacts) {
          const engagement = engagementMap[contact.apollo_contact_id];
          if (!engagement) continue;

          const updates: Record<string, any> = {
            total_emails_sent: engagement.sent,
            total_opens: engagement.opens,
            total_clicks: engagement.clicks,
            total_replies: engagement.replies,
            has_bounced: engagement.bounced,
            last_activity_at: new Date().toISOString(),
          };

          // Mark completed/bounced
          if (engagement.bounced) {
            updates.status = 'bounced';
          }

          // Check if we should trigger a call alert
          const shouldAlert = !contact.call_alert_sent && (
            engagement.replies > 0 ||
            engagement.opens >= 2 ||
            engagement.clicks > 0
          );

          if (shouldAlert) {
            updates.call_alert_sent = true;
            updates.call_alert_sent_at = new Date().toISOString();

            const signal = engagement.replies > 0
              ? '💬 REPLIED to email'
              : engagement.clicks > 0
              ? '🔗 CLICKED a link'
              : '👀 OPENED 2+ emails';

            alerts.push({
              name: contact.contact_name || 'Unknown',
              email: contact.contact_email,
              company: contact.contact_company || 'Unknown',
              signal,
              sequence: contact.apollo_sequence_name || sequenceId,
            });

            // Add to call list if not already there
            if (!contact.added_to_call_list_at) {
              updates.added_to_call_list_at = new Date().toISOString();
              const nameParts = (contact.contact_name || '').split(' ');
              callListAdditions.push({
                first_name: nameParts[0] || '',
                last_name: nameParts.slice(1).join(' ') || '',
                email: contact.contact_email,
                company: contact.contact_company || '',
                phone: '',
                title: contact.contact_title || '',
                source: 'apollo-sequence-engaged',
              });
            }
          }

          await supabase
            .from('apollo_sequence_tracking')
            .update(updates)
            .eq('id', contact.id);
        }
      } catch (err) {
        console.error(`Error processing sequence ${sequenceId}:`, err);
      }
    }

    // Bulk add engaged contacts to call list
    if (callListAdditions.length > 0) {
      const batchId = `apollo-engaged-${Date.now()}`;
      const { error: insertErr } = await supabase
        .from('call_list_prospects')
        .insert(callListAdditions.map(c => ({
          ...c,
          batch_id: batchId,
          status: 'pending',
        })));

      if (insertErr) console.error('Call list insert error:', insertErr);
    }

    // Send Slack alerts for engaged prospects
    if (alerts.length > 0) {
      try {
        const slackBlocks = [
          {
            type: 'header',
            text: { type: 'plain_text', text: `🔥 ${alerts.length} Apollo Sequence Engagement${alerts.length > 1 ? 's' : ''} Detected` },
          },
          { type: 'divider' },
          ...alerts.flatMap(a => [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${a.name}* (${a.company})\n${a.signal}\n📧 ${a.email}\n📋 Sequence: ${a.sequence}\n\n_Added to call list — follow up NOW_`,
              },
            },
            { type: 'divider' },
          ]),
        ];

        await supabase.functions.invoke('slack-notify', {
          body: {
            eventType: 'apollo_engagement',
            channel: '#leads-and-signups',
            data: {
              blocks: slackBlocks,
              fallback_text: `🔥 ${alerts.length} Apollo sequence engagement(s) detected — check call list`,
            },
          },
        });
      } catch (slackErr) {
        console.error('Slack notification error:', slackErr);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      checked: tracked.length,
      alerts_sent: alerts.length,
      added_to_call_list: callListAdditions.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Apollo sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
