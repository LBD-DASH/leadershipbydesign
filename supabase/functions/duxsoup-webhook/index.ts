import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Dux-Soup Webhook Receiver
 * 
 * Dux-Soup payload format:
 *   { userid, time, type, event, data: { url, profile, first_name, last_name, ... } }
 * 
 * Types: visit, connection, message, session, rccommand
 * Events: sent, received, accepted, requested, create, update, ready
 * 
 * Maps to: warm_outreach_queue + call_list_prospects
 */

// Map Dux-Soup's {type, event} to our internal event types
function mapEventType(type: string, event: string): string | null {
  const key = `${type}:${event}`;
  const mapping: Record<string, string> = {
    'visit:sent': 'profile_visit',
    'visit:done': 'profile_visit',
    'connection:sent': 'connection_request',
    'connection:accepted': 'connection_accept',
    'connection:received': 'connection_accept',
    'message:sent': 'message_sent',
    'message:received': 'message_received',
    'message:reply': 'prospect_replied',
    'inmail:reply': 'prospect_replied',
    'inmail:sent': 'inmail_sent',
    'inmail:received': 'message_received',
  };
  return mapping[key] || null;
}

// Extract contact fields from Dux-Soup's nested data object
function extractContact(data: Record<string, unknown>) {
  return {
    first_name: (data.first_name || data.firstName || '') as string,
    last_name: (data.last_name || data.lastName || '') as string,
    title: (data.title || data.job_title || data.headline || '') as string,
    company: (data.company || data.organization || '') as string,
    email: (data.email || '') as string,
    phone: (data.phone || '') as string,
    location: (data.location || '') as string,
    industry: (data.industry || '') as string,
    linkedin_url: (data.url || data.profile || data.linkedin_url || '') as string,
    message_text: (data.message || data.text || data.body || '') as string,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
  const url = new URL(req.url);

  // ── Query-parameter secret validation ──
  const expectedSecret = Deno.env.get('DUXSOUP_WEBHOOK_SECRET') || 'duxsoup_lbd_webhook_2026';
  const providedSecret = url.searchParams.get('secret');
  if (providedSecret && providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Invalid secret' }), { status: 401, headers });
  }

  // ── /ping endpoint for Dux-Soup "Send Sample" connectivity test ──
  if (url.searchParams.get('ping') === '1' || url.pathname.endsWith('/ping')) {
    return new Response(JSON.stringify({ status: 'ok', message: 'Dux-Soup webhook is live', timestamp: new Date().toISOString() }), { headers });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    const events = Array.isArray(payload) ? payload : [payload];
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    const results: string[] = [];

    for (const raw of events) {
      try {
        // Dux-Soup format: { type, event, data: {...}, time, userid }
        const dsType = (raw.type || '').toLowerCase();
        const dsEvent = (raw.event || '').toLowerCase();
        const dsData = raw.data || {};
        const dsTime = raw.time || new Date().toISOString();

        // Skip system/session events (not contact-related)
        if (['session', 'rccommand', 'system', 'queue'].includes(dsType)) {
          console.log(`⏭️ Skipping system event: ${dsType}:${dsEvent}`);
          skipped++;
          continue;
        }

        const eventType = mapEventType(dsType, dsEvent);
        if (!eventType) {
          // Also support legacy flat format with event_type field
          if (raw.event_type) {
            // Fall through to legacy handling below
          } else {
            console.log(`⏭️ Unmapped Dux-Soup event: ${dsType}:${dsEvent}`);
            skipped++;
            continue;
          }
        }

        // Extract contact info from nested data or flat payload (legacy)
        const contact = raw.event_type
          ? {
              first_name: raw.first_name || '',
              last_name: raw.last_name || '',
              title: raw.title || '',
              company: raw.company || '',
              email: raw.email || '',
              phone: raw.phone || '',
              location: raw.location || '',
              industry: raw.industry || '',
              linkedin_url: raw.linkedin_url || '',
              message_text: raw.message_text || '',
            }
          : extractContact(dsData);

        const resolvedEventType = eventType || raw.event_type;
        const contactName = `${contact.first_name} ${contact.last_name}`.trim();
        const contactEmail = contact.email.toLowerCase().trim();

        console.log(`📥 Dux-Soup: ${resolvedEventType} — ${contactName || 'unknown'} @ ${contact.company || 'unknown'}`);

        // ── HANDLE BY EVENT TYPE ──
        switch (resolvedEventType) {
          case 'profile_visit': {
            console.log(`  👁️ Visited: ${contactName} (${contact.title}) @ ${contact.company}`);
            results.push(`visited:${contactName}`);
            processed++;
            break;
          }

          case 'connection_request':
          case 'connection_accept': {
            if (contactEmail && contactEmail.includes('@')) {
              const { data: existing } = await supabase
                .from('warm_outreach_queue')
                .select('id, score')
                .eq('contact_email', contactEmail)
                .limit(1);

              if (existing?.length) {
                // Bump score by 15 and add note
                const newScore = Math.min((existing[0].score || 0) + 15, 100);
                await supabase.from('warm_outreach_queue').update({
                  score: newScore,
                  updated_at: new Date().toISOString(),
                }).eq('id', existing[0].id);
                results.push(`bumped:${contactName}:+15`);
              } else {
                await supabase.from('warm_outreach_queue').insert({
                  company_name: contact.company || '',
                  contact_name: contactName,
                  contact_email: contactEmail,
                  contact_title: contact.title || '',
                  contact_phone: contact.phone || '',
                  source_keyword: `duxsoup:${resolvedEventType}`,
                  status: 'pending',
                  industry: contact.industry || '',
                  score: resolvedEventType === 'connection_accept' ? 70 : 65,
                });
                results.push(`queued:${contactName}`);
              }
            }

            if (contactName) {
              const { data: existingCall } = await supabase
                .from('call_list_prospects')
                .select('id')
                .or(`email.eq.${contactEmail},and(first_name.ilike.${contact.first_name || '__'},company.ilike.${contact.company || '__'})`)
                .limit(1);

              if (!existingCall?.length) {
                await supabase.from('call_list_prospects').insert({
                  first_name: contact.first_name || contactName,
                  last_name: contact.last_name || '',
                  email: contactEmail || '',
                  company: contact.company || '',
                  phone: contact.phone || '',
                  title: contact.title || '',
                  status: 'pending',
                  source: `duxsoup-${resolvedEventType}`,
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
            if (contactEmail) {
              await supabase
                .from('warm_outreach_queue')
                .update({
                  status: 'emailed',
                  email_sent_at: dsTime,
                  email_body: contact.message_text?.substring(0, 500) || '',
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
            if (contactEmail) {
              await supabase
                .from('warm_outreach_queue')
                .update({
                  status: 'replied',
                  updated_at: new Date().toISOString(),
                })
                .eq('contact_email', contactEmail);
            }

            // Hot lead alert
            try {
              await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
                body: JSON.stringify({
                  channel: 'leads-and-signups',
                  eventType: 'system_error',
                  data: {
                    function: '🔥 LinkedIn Reply Received',
                    error: `*${contactName}* (${contact.title}) @ ${contact.company}\nMessage: "${contact.message_text.substring(0, 200)}"`,
                  },
                }),
              });
            } catch { /* best effort */ }

            results.push(`reply:${contactName}`);
            processed++;
            break;
          }

          default: {
            console.log(`  ⏭️ Unhandled event type: ${resolvedEventType}`);
            results.push(`unknown:${resolvedEventType}`);
            skipped++;
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Event processing error:', msg);
        errors++;
      }
    }

    console.log(`✅ Dux-Soup webhook: ${processed} processed, ${skipped} skipped, ${errors} errors`);

    // Slack summary if meaningful activity
    const queued = results.filter(r => r.startsWith('queued:')).length;
    const replies = results.filter(r => r.startsWith('reply:')).length;
    if (queued > 0 || replies > 0) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
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

    return new Response(JSON.stringify({ success: true, processed, skipped, errors, results }), { headers });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('duxsoup-webhook error:', errMsg);
    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers });
  }
});
