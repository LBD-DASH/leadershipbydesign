import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

/**
 * Apollo Webhook Receiver
 * Receives events from Apollo via Zapier/Make/direct webhook
 * Events: contact_added, email_sent, email_opened, email_clicked, email_replied, email_bounced
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    const expectedSecret = Deno.env.get('WEBHOOK_CONTACTS_SECRET');
    if (!webhookSecret || webhookSecret.trim() !== expectedSecret?.trim()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    
    // Support single event or array of events
    const events = Array.isArray(payload) ? payload : [payload];
    let processed = 0;
    let errors = 0;

    for (const event of events) {
      try {
        const {
          event_type, // contact_added, email_sent, email_opened, email_clicked, email_replied, email_bounced
          contact_id, // Apollo contact ID
          sequence_id, // Apollo sequence/campaign ID
          sequence_name,
          contact_email,
          contact_name,
          contact_company,
          contact_title,
          contact_phone,
          email_step, // step number
          email_subject,
          email_body,
          industry_tag,
          offer_type,
          campaign_intent,
          date,
        } = event;

        if (!contact_email && !contact_id) {
          console.error('Event missing contact_email and contact_id, skipping');
          errors++;
          continue;
        }

        const contactIdentifier = contact_id || contact_email;
        const seqIdentifier = sequence_id || sequence_name || 'unknown';

        if (event_type === 'contact_added' || event_type === 'email_sent') {
          // Upsert the tracking record
          const emailStepData = email_step ? {
            step: email_step,
            subject: email_subject || '',
            body: email_body || '',
            sent_at: date || new Date().toISOString(),
            opened: false,
            clicked: false,
            replied: false,
          } : null;

          // Check if record exists
          const { data: existing } = await supabase
            .from('apollo_sequence_tracking')
            .select('id, email_steps, total_emails_sent')
            .eq('apollo_contact_id', contactIdentifier)
            .eq('apollo_sequence_id', seqIdentifier)
            .maybeSingle();

          if (existing) {
            // Update existing record
            const existingSteps = (existing.email_steps as any[]) || [];
            if (emailStepData) {
              // Add or update step
              const stepIdx = existingSteps.findIndex((s: any) => s.step === emailStepData.step);
              if (stepIdx >= 0) {
                existingSteps[stepIdx] = { ...existingSteps[stepIdx], ...emailStepData };
              } else {
                existingSteps.push(emailStepData);
              }
            }

            await supabase
              .from('apollo_sequence_tracking')
              .update({
                email_steps: existingSteps,
                current_step: email_step || existing.total_emails_sent || 0,
                total_emails_sent: (existing.total_emails_sent || 0) + (event_type === 'email_sent' ? 1 : 0),
                last_email_sent_at: event_type === 'email_sent' ? (date || new Date().toISOString()) : undefined,
                last_activity_at: new Date().toISOString(),
                contact_name: contact_name || undefined,
                contact_company: contact_company || undefined,
                contact_title: contact_title || undefined,
                industry_tag: industry_tag || undefined,
                offer_type: offer_type || undefined,
                campaign_intent: campaign_intent || undefined,
              })
              .eq('id', existing.id);
          } else {
            // Create new record
            await supabase
              .from('apollo_sequence_tracking')
              .insert({
                apollo_contact_id: contactIdentifier,
                apollo_sequence_id: seqIdentifier,
                apollo_sequence_name: sequence_name || seqIdentifier,
                contact_email: contact_email || '',
                contact_name: contact_name || '',
                contact_company: contact_company || null,
                contact_title: contact_title || null,
                email_steps: emailStepData ? [emailStepData] : [],
                current_step: email_step || 0,
                total_emails_sent: event_type === 'email_sent' ? 1 : 0,
                last_email_sent_at: event_type === 'email_sent' ? (date || new Date().toISOString()) : null,
                industry_tag: industry_tag || null,
                offer_type: offer_type || null,
                campaign_intent: campaign_intent || null,
                status: 'active',
                source: 'apollo-webhook',
              });
          }
        } else if (['email_opened', 'email_clicked', 'email_replied', 'email_bounced'].includes(event_type)) {
          // Update engagement on existing record
          const { data: existing } = await supabase
            .from('apollo_sequence_tracking')
            .select('*')
            .eq('apollo_contact_id', contactIdentifier)
            .eq('apollo_sequence_id', seqIdentifier)
            .maybeSingle();

          if (!existing) {
            console.warn(`No tracking record for ${contactIdentifier} in ${seqIdentifier}`);
            errors++;
            continue;
          }

          const updates: Record<string, any> = {
            last_activity_at: new Date().toISOString(),
          };

          // Update step-level engagement
          const steps = (existing.email_steps as any[]) || [];
          if (email_step) {
            const stepData = steps.find((s: any) => s.step === email_step);
            if (stepData) {
              if (event_type === 'email_opened') stepData.opened = true;
              if (event_type === 'email_clicked') stepData.clicked = true;
              if (event_type === 'email_replied') stepData.replied = true;
            }
            updates.email_steps = steps;
          }

          if (event_type === 'email_opened') {
            updates.total_opens = (existing.total_opens || 0) + 1;
          } else if (event_type === 'email_clicked') {
            updates.total_clicks = (existing.total_clicks || 0) + 1;
          } else if (event_type === 'email_replied') {
            updates.total_replies = (existing.total_replies || 0) + 1;
          } else if (event_type === 'email_bounced') {
            updates.has_bounced = true;
            updates.status = 'bounced';
          }

          // Calculate priority score
          const totalReplies = updates.total_replies ?? existing.total_replies ?? 0;
          const totalOpens = updates.total_opens ?? existing.total_opens ?? 0;
          const totalClicks = updates.total_clicks ?? existing.total_clicks ?? 0;
          const currentStep = existing.current_step || 0;

          let priorityScore = 0;
          let priorityReason = '';

          if (totalReplies > 0) {
            priorityScore = 100;
            priorityReason = 'REPLIED — Call immediately';
          } else if (totalOpens >= 2) {
            priorityScore = 80;
            priorityReason = `Opened ${totalOpens}x — High interest`;
          } else if (totalClicks > 0) {
            priorityScore = 70;
            priorityReason = 'Clicked link — Engaged';
          } else if (currentStep >= 2) {
            priorityScore = 40;
            priorityReason = `After email step ${currentStep} — Time to call`;
          }

          updates.priority_score = priorityScore;
          updates.priority_reason = priorityReason;

          // Generate suggested opener
          if (priorityScore >= 40 && !existing.suggested_opener) {
            const seqName = existing.apollo_sequence_name || '';
            const lastSubject = steps.length > 0 ? steps[steps.length - 1].subject : '';
            const industry = existing.industry_tag || '';
            
            updates.suggested_opener = generateOpener(seqName, lastSubject, industry, existing.contact_name, totalReplies > 0);
          }

          await supabase
            .from('apollo_sequence_tracking')
            .update(updates)
            .eq('id', existing.id);

          // Send Slack alert for high-priority signals
          if (priorityScore >= 70 && !existing.call_alert_sent) {
            updates.call_alert_sent = true;
            updates.call_alert_sent_at = new Date().toISOString();

            await supabase
              .from('apollo_sequence_tracking')
              .update({ call_alert_sent: true, call_alert_sent_at: new Date().toISOString() })
              .eq('id', existing.id);

            // Also add to call list
            const nameParts = (existing.contact_name || '').split(' ');
            await supabase
              .from('call_list_prospects')
              .insert({
                first_name: nameParts[0] || '',
                last_name: nameParts.slice(1).join(' ') || '',
                email: existing.contact_email,
                company: existing.contact_company || '',
                phone: '',
                title: existing.contact_title || '',
                source: 'apollo-engaged',
                batch_id: `apollo-hot-${Date.now()}`,
                status: 'pending',
              });

            try {
              await supabase.functions.invoke('slack-notify', {
                body: {
                  eventType: 'apollo_hot_lead',
                  channel: '#leads-and-signups',
                  data: {
                    blocks: [
                      { type: 'header', text: { type: 'plain_text', text: `🔥 HOT LEAD: ${existing.contact_name}` } },
                      { type: 'section', text: { type: 'mrkdwn', text: `*${existing.contact_name}* at *${existing.contact_company}*\n${priorityReason}\n📧 ${existing.contact_email}\n📋 Sequence: ${existing.apollo_sequence_name}\n\n_Added to call queue — call NOW_` } },
                    ],
                    fallback_text: `🔥 HOT LEAD: ${existing.contact_name} — ${priorityReason}`,
                  },
                },
              });
            } catch (e) {
              console.error('Slack error:', e);
            }
          }
        }

        processed++;
      } catch (eventErr) {
        console.error('Event processing error:', eventErr);
        errors++;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed, 
      errors,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateOpener(sequenceName: string, lastSubject: string, industry: string, contactName: string, isReply: boolean): string {
  const firstName = (contactName || '').split(' ')[0] || 'there';
  
  if (isReply) {
    return `"Hi ${firstName}, thanks for your reply — I wanted to connect directly to continue the conversation. You mentioned..."`;
  }

  // Parse sequence name for context
  const seqLower = (sequenceName || '').toLowerCase();
  let topic = 'leadership development';
  if (seqLower.includes('shift')) topic = 'the SHIFT methodology for team performance';
  else if (seqLower.includes('coach')) topic = 'the Leader as Coach programme';
  else if (seqLower.includes('performance')) topic = 'improving manager performance';
  else if (seqLower.includes('alignment')) topic = 'team alignment';
  else if (seqLower.includes('motivation')) topic = 'motivation and engagement';

  const industryPhrase = industry ? ` inside ${industry} firms` : '';

  if (lastSubject) {
    return `"Hi ${firstName}, you would have received an email from Kevin about ${topic}${industryPhrase} — I'm just following up to see if that's relevant for your team right now."`;
  }

  return `"Hi ${firstName}, Kevin has been reaching out about ${topic}${industryPhrase}. I'm just calling to see if this is something worth a quick 15-minute conversation about."`;
}
