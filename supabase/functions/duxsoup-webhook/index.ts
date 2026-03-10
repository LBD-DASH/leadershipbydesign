import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Dux-Soup Webhook Receiver
 * Receives LinkedIn automation events: profile_visit, connection_request, connection_accept, message_sent, message_received, inmail_sent
 * Routes contacts into warm_outreach_queue + call_list_prospects
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  try {
    // Validate webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    const expectedSecret = Deno.env.get('DUXSOUP_WEBHOOK_SECRET');
    if (!webhookSecret || webhookSecret.trim() !== expectedSecret?.trim()) {
      console.error('Dux-Soup webhook: unauthorized request');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    const events = Array.isArray(payload) ? payload : [payload];
    let processed = 0;
    let errors = 0;
    const results: string[] = [];

    for (const event of events) {
      try {
        const {
          event_type,       // profile_visit, connection_request, connection_accept, message_sent, message_received, inmail_sent
          linkedin_url,     // LinkedIn profile URL
          first_name,
          last_name,
          title,            // Job title
          company,
          email,            // If available from LinkedIn
          phone,            // If available
          location,
          industry,
          connection_degree,
          message_text,     // For message events
          timestamp,        // Event timestamp
          notes,            // Any Dux-Soup notes/tags
        } = event;

        if (!event_type) {
          console.error('Missing event_type in payload:', JSON.stringify(event).slice(0, 200));
          errors++;
          continue;
        }

        const contactName = `${first_name || ''} ${last_name || ''}`.trim();
        const contactEmail = (email || '').toLowerCase().trim();
        const eventTime = timestamp || new Date().toISOString();

        console.log(`📥 Dux-Soup event: ${event_type} — ${contactName} @ ${company || 'unknown'}`);

        // ── HANDLE BY EVENT TYPE ──
        switch (event_type) {
          case 'profile_visit': {
            // Log the visit — useful for tracking outreach activity
            console.log(`  👁️ Profile visited: ${contactName} (${title || ''}) @ ${company || ''}`);
            results.push(`visited:${contactName}`);
            processed++;
            break;
          }

          case 'connection_request':
          case 'connection_accept': {
            // Add to warm_outreach_queue if they have an email
            if (contactEmail && contactEmail.includes('@')) {
              // Check if already in queue
              const { data: existing } = await supabase
                .from('warm_outreach_queue')
                .select('id')
                .eq('contact_email', contactEmail)
                .limit(1);

              if (!existing?.length) {
                await supabase.from('warm_outreach_queue').insert({
                  company_name: company || '',
                  contact_name: contactName,
                  contact_email: contactEmail,
                  contact_title: title || '',
                  contact_phone: phone || '',
                  source_keyword: `duxsoup:${event_type}`,
                  status: 'pending',
                  industry: industry || '',
                  score: event_type === 'connection_accept' ? 75 : 65,
                });
                results.push(`queued:${contactName}`);
              } else {
                results.push(`dup:${contactName}`);
              }
            }

            // Also add to call_list_prospects for phone follow-up
            if (contactName) {
              const { data: existingCall } = await supabase
                .from('call_list_prospects')
                .select('id')
                .or(`email.eq.${contactEmail},and(first_name.ilike.${first_name || '__'},company.ilike.${company || '__'})`)
                .limit(1);

              if (!existingCall?.length) {
                await supabase.from('call_list_prospects').insert({
                  first_name: first_name || contactName,
                  last_name: last_name || '',
                  email: contactEmail || '',
                  company: company || '',
                  phone: phone || '',
                  title: title || '',
                  status: 'pending',
                  source: `duxsoup-${event_type}`,
                  batch_id: `duxsoup-${new Date().toISOString().slice(0, 10)}`,
                  uploaded_by: 'duxsoup-webhook',
                });
                results.push(`call-list:${contactName}`);
              }
            }

            processed++;
            break;
          }

          case 'message_sent':
          case 'inmail_sent': {
            // Update status if already in queue
            if (contactEmail) {
              await supabase
                .from('warm_outreach_queue')
                .update({
                  status: 'emailed',
                  email_sent_at: eventTime,
                  email_body: message_text?.substring(0, 500) || '',
                  updated_at: new Date().toISOString(),
                })
                .eq('contact_email', contactEmail)
                .eq('status', 'pending');
            }
            results.push(`msg-sent:${contactName}`);
            processed++;
            break;
          }

          case 'message_received': {
            // Hot signal — they replied! Update queue and alert
            if (contactEmail) {
              await supabase
                .from('warm_outreach_queue')
                .update({
                  status: 'replied',
                  updated_at: new Date().toISOString(),
                })
                .eq('contact_email', contactEmail);
            }

            // Send hot lead alert to Slack
            try {
              await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
                body: JSON.stringify({
                  channel: 'leads-and-signups',
                  eventType: 'system_error',
                  data: {
                    function: '🔥 LinkedIn Reply Received',
                    error: `*${contactName}* (${title || ''}) @ ${company || ''}\nMessage: "${(message_text || '').substring(0, 200)}"`,
                  },
                }),
              });
            } catch { /* best effort */ }

            results.push(`reply:${contactName}`);
            processed++;
            break;
          }

          default: {
            console.log(`  ⏭️ Unknown event type: ${event_type}`);
            results.push(`unknown:${event_type}`);
            processed++;
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Event processing error:', msg);
        errors++;
      }
    }

    console.log(`✅ Dux-Soup webhook: ${processed} processed, ${errors} errors`);

    // Slack summary if meaningful activity
    const queued = results.filter(r => r.startsWith('queued:')).length;
    const replies = results.filter(r => r.startsWith('reply:')).length;
    if (queued > 0 || replies > 0) {
      try {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/slack-notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` },
          body: JSON.stringify({
            channel: 'mission-control',
            eventType: 'system_error',
            data: {
              function: '🤝 Dux-Soup Activity',
              error: `Events: ${processed} | New queue: ${queued} | Replies: ${replies}`,
            },
          }),
        });
      } catch { /* best effort */ }
    }

    return new Response(JSON.stringify({ success: true, processed, errors, results }), { headers });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('duxsoup-webhook error:', errMsg);
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
