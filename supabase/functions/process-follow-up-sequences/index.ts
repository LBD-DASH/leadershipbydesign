import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limits
const MAX_NEW_OUTREACH_PER_DAY = 10;
const MAX_FOLLOWUPS_PER_DAY = 15;

// Template types
type TemplateVariant = 'hot' | 'warm' | 'cool';

interface ProspectData {
  companyName: string;
  contactName: string;
  contactFirstName: string;
  industry: string;
  location: string;
  painPoints: string[];
  opportunitySignals: string[];
  industryInsight?: string;
  prospectId: string;
}

// Calculate prospect score
function calculateProspectScore(prospect: Record<string, unknown>): number {
  let score = 0;
  if (prospect.contact_email) score += 25;
  if (prospect.hr_contacts && Array.isArray(prospect.hr_contacts) && prospect.hr_contacts.length > 0) score += 20;
  if (prospect.contact_phone) score += 10;
  if (prospect.pain_points && Array.isArray(prospect.pain_points) && prospect.pain_points.length > 0) score += 15;
  if (prospect.opportunity_signals && Array.isArray(prospect.opportunity_signals) && prospect.opportunity_signals.length > 0) score += 15;
  if (prospect.leadership_team && Array.isArray(prospect.leadership_team) && prospect.leadership_team.length > 0) score += 10;
  if (prospect.linkedin_url) score += 5;
  return score;
}

function getTemplateVariant(score: number): TemplateVariant {
  if (score >= 60) return 'hot';
  if (score >= 35) return 'warm';
  return 'cool';
}

// Get diagnostic URL with tracking
function getDiagnosticUrl(prospectId: string, step: number): string {
  return `https://leadershipbydesign.lovable.app/shift-diagnostic?utm_source=outreach&utm_medium=email&utm_campaign=prospect_${prospectId}&utm_content=step_${step}`;
}

function getUnsubscribeUrl(prospectId: string): string {
  return `https://leadershipbydesign.lovable.app/unsubscribe?id=${prospectId}`;
}

// ========================================
// HR-FOCUSED EMAIL TEMPLATES
// ========================================

function getStep1HotTemplate(data: ProspectData): { subject: string; body: string } {
  return {
    subject: `Quick question about manager effectiveness at ${data.companyName}`,
    body: `Hi ${data.contactFirstName},

I've been working with ${data.industry} companies in ${data.location} on a specific problem: the gap between the leadership skills managers were hired for and the skills they actually need now.

One question: if you could strengthen one capability across your management team right now, what would it be?

I ask because I've spent 11 years developing 4,000+ leaders across 30+ organisations, and the answer usually points to exactly where leadership development has the biggest impact on retention and engagement.

Happy to share what I've seen working for ${data.industry} companies if you're open to a 15-minute conversation.

— Kevin, Leadership by Design`
  };
}

function getStep1WarmTemplate(data: ProspectData): { subject: string; body: string } {
  const painPointRef = data.painPoints.length > 0 
    ? `especially given the challenges around ${data.painPoints[0].toLowerCase()}`
    : `especially given the growth I noticed`;
  
  return {
    subject: `Free team diagnostic for ${data.companyName}`,
    body: `Hi ${data.contactFirstName},

I put together a team diagnostic that helps HR and People leaders identify their biggest leadership skill gaps in about 5 minutes.

No sales pitch attached — it's a genuine tool we built based on 11 years of data from 50+ organisations and 4,000+ leaders.

Thought it might be useful for ${data.companyName}, ${painPointRef}.

Here's the link: ${getDiagnosticUrl(data.prospectId, 1)}

If the results raise any questions, happy to jump on a quick call to walk through what the data typically means for manager effectiveness and team performance.

— Kevin, Leadership by Design`
  };
}

function getStep1CoolTemplate(data: ProspectData): { subject: string; body: string } {
  const insight = data.industryInsight || `${data.industry} companies scaling past 200 people often see a sharp drop in middle-management effectiveness — impacting retention and engagement`;
  
  return {
    subject: `Something I noticed about ${data.industry} companies in ${data.location}`,
    body: `Hi ${data.contactFirstName},

I've been researching leadership capability in ${data.industry} companies across ${data.location}, and a pattern keeps showing up: ${insight}.

I work with HR and People teams on exactly this — developing the human skills in managers that don't improve on their own.

If this resonates, I'd welcome a conversation. If not, no worries at all.

— Kevin, Leadership by Design`
  };
}

function getStep2Template(data: ProspectData, originalSubject: string): { subject: string; body: string } {
  return {
    subject: `Re: ${originalSubject}`,
    body: `Hi ${data.contactFirstName},

Just following up on my note from earlier this week.

I know inboxes are brutal, so I'll keep this short: I work with ${data.industry} companies on leadership development — specifically helping HR and People teams improve manager effectiveness across the organisation.

If you have 15 minutes this week or next, I'd love to explore whether there's value in a conversation.

If the timing isn't right, just let me know and I'll check back in a few months.

— Kevin`
  };
}

function getStep3Template(data: ProspectData): { subject: string; body: string } {
  return {
    subject: `A resource for ${data.companyName}'s people team`,
    body: `Hi ${data.contactFirstName},

I wanted to share something genuinely useful rather than just follow up again.

We recently published a diagnostic tool that helps HR and People teams identify which of 5 critical human skills need strengthening across their management team — self-management, human intelligence, innovation, focus, and thinking.

It takes about 5 minutes and gives you a clear picture of where your managers' gaps are:

${getDiagnosticUrl(data.prospectId, 3)}

No obligation, no follow-up unless you want it. I just think the data would be valuable for ${data.companyName}'s people strategy.

— Kevin`
  };
}

function getStep4Template(data: ProspectData): { subject: string; body: string } {
  return {
    subject: `Last note from me`,
    body: `Hi ${data.contactFirstName},

I won't keep following up — I respect your time.

If leadership development or manager effectiveness comes onto your radar in the next 6-12 months, I'm here: leadershipbydesign.co

In the meantime, I've put together some free resources that might be useful for your people team:

• Team Diagnostic: ${getDiagnosticUrl(data.prospectId, 4)}
• SHIFT Methodology overview: https://leadershipbydesign.lovable.app/shift-methodology

Wishing you and the team at ${data.companyName} a strong year ahead.

— Kevin, Leadership by Design`
  };
}

function getEmailTemplate(
  step: number,
  variant: TemplateVariant,
  data: ProspectData,
  originalSubject?: string
): { subject: string; body: string } {
  switch (step) {
    case 1:
      switch (variant) {
        case 'hot': return getStep1HotTemplate(data);
        case 'warm': return getStep1WarmTemplate(data);
        case 'cool': return getStep1CoolTemplate(data);
      }
      break;
    case 2:
      return getStep2Template(data, originalSubject || `Quick question about ${data.companyName}`);
    case 3:
      return getStep3Template(data);
    case 4:
      return getStep4Template(data);
    default:
      throw new Error(`Invalid step: ${step}`);
  }
  throw new Error(`Invalid variant: ${variant}`);
}

function wrapEmailHtml(body: string, prospectId: string): string {
  const unsubscribeUrl = getUnsubscribeUrl(prospectId);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      ${body.replace(/\n/g, '<br>')}
      <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e5e5;">
      <p style="font-size: 12px; color: #666; margin-top: 20px;">
        This email was sent by Leadership by Design. 
        <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a> from future emails.
      </p>
    </div>
  `;
}

function getNextSendDate(currentStep: number): Date {
  const now = new Date();
  let daysToAdd: number;
  
  switch (currentStep) {
    case 1: daysToAdd = 3; break;
    case 2: daysToAdd = 4; break;
    case 3: daysToAdd = 7; break;
    default: return now;
  }
  
  const nextDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return adjustToSendWindow(nextDate);
}

// Adjust to next valid send window - 8 AM SAST, any weekday
function adjustToSendWindow(date: Date): Date {
  const result = new Date(date);
  result.setUTCHours(6, 0, 0, 0); // 8 AM SAST (UTC+2)
  const day = result.getDay();
  
  // Skip weekends
  if (day === 0) result.setDate(result.getDate() + 1); // Sunday -> Monday
  else if (day === 6) result.setDate(result.getDate() + 2); // Saturday -> Monday
  
  return result;
}

// Check if within send window - 8-10 AM SAST, weekdays only (Mon-Fri)
function isWithinSendWindow(): boolean {
  const now = new Date();
  const hour = now.getUTCHours() + 2; // SAST is UTC+2
  const day = now.getDay();
  
  // Skip weekends (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) return false;
  
  // Check if 8-10 AM SAST
  return hour >= 8 && hour < 10;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we're within send window (Mon-Fri, 8-10 AM SAST)
    if (!isWithinSendWindow()) {
      console.log('Outside send window, skipping follow-up processing');
      return new Response(
        JSON.stringify({ success: true, message: 'Outside send window', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get active sequences due for sending
    const now = new Date().toISOString();
    const { data: sequences, error: seqError } = await supabase
      .from('prospect_sequences')
      .select(`
        *,
        prospect:prospect_companies(*)
      `)
      .eq('status', 'active')
      .lte('next_send_at', now)
      .order('next_send_at', { ascending: true })
      .limit(MAX_FOLLOWUPS_PER_DAY);

    if (seqError) {
      console.error('Error fetching sequences:', seqError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch sequences' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!sequences || sequences.length === 0) {
      console.log('No sequences due for processing');
      return new Response(
        JSON.stringify({ success: true, message: 'No sequences due', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${sequences.length} sequences`);

    let sentCount = 0;
    const errors: string[] = [];

    for (const sequence of sequences) {
      try {
        const prospect = sequence.prospect;
        if (!prospect || !prospect.contact_email) {
          console.log(`Skipping sequence ${sequence.id}: No prospect or email`);
          continue;
        }

        // Calculate score and variant
        const score = calculateProspectScore(prospect);
        const variant = sequence.template_variant as TemplateVariant || getTemplateVariant(score);

        // Build prospect data for template
        const contactName = prospect.contact_name || 'there';
        const contactFirstName = contactName.split(' ')[0] || 'there';
        
        const prospectData: ProspectData = {
          companyName: prospect.company_name,
          contactName,
          contactFirstName,
          industry: prospect.industry || 'your industry',
          location: 'Gauteng',
          painPoints: prospect.pain_points || [],
          opportunitySignals: prospect.opportunity_signals || [],
          industryInsight: prospect.industry_insight,
          prospectId: prospect.id
        };

        // Get the appropriate template
        const template = getEmailTemplate(
          sequence.sequence_step,
          variant,
          prospectData,
          sequence.original_subject
        );

        // Send email
        console.log(`Sending step ${sequence.sequence_step} to ${prospect.contact_email}`);
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kevin Britz <hello@leadershipbydesign.co>',
            to: [prospect.contact_email],
            subject: template.subject,
            html: wrapEmailHtml(template.body, prospect.id),
          }),
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error('Resend error:', emailResult);
          errors.push(`Failed to send to ${prospect.company_name}: ${emailResult.message}`);
          continue;
        }

        console.log(`Email sent successfully: ${emailResult.id}`);

        // Record outreach
        await supabase
          .from('prospect_outreach')
          .insert({
            prospect_id: prospect.id,
            email_subject: template.subject,
            email_body: template.body,
            status: 'sent',
            sent_at: new Date().toISOString(),
            sequence_step: sequence.sequence_step,
            template_used: `step_${sequence.sequence_step}_${variant}`
          });

        // Update sequence
        if (sequence.sequence_step >= 4) {
          // Mark sequence as completed
          await supabase
            .from('prospect_sequences')
            .update({
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', sequence.id);
        } else {
          // Schedule next step
          const nextSendAt = getNextSendDate(sequence.sequence_step);
          await supabase
            .from('prospect_sequences')
            .update({
              sequence_step: sequence.sequence_step + 1,
              next_send_at: nextSendAt.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', sequence.id);
        }

        sentCount++;

        // Small delay between sends for deliverability
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error(`Error processing sequence ${sequence.id}:`, err);
        errors.push(`Sequence ${sequence.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    console.log(`Follow-up processing complete. Sent: ${sentCount}, Errors: ${errors.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing follow-ups:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process follow-ups';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
