// Email Template System for Prospect Outreach Sequences
// Supports 4-step sequences with Hot/Warm/Cool variants

export type TemplateVariant = 'hot' | 'warm' | 'cool';

export interface ProspectData {
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

export interface EmailTemplate {
  subject: string;
  body: string;
}

const DIAGNOSTIC_BASE_URL = 'https://leadershipbydesign.lovable.app/shift-diagnostic';

export function getDiagnosticUrl(prospectId: string, step: number): string {
  return `${DIAGNOSTIC_BASE_URL}?utm_source=outreach&utm_medium=email&utm_campaign=prospect_${prospectId}&utm_content=step_${step}`;
}

export function getUnsubscribeUrl(prospectId: string): string {
  return `https://leadershipbydesign.lovable.app/unsubscribe?id=${prospectId}`;
}

// Calculate quality score for template selection (mirrors prospectScoring.ts logic)
export function calculateProspectScore(prospect: {
  contact_email?: string | null;
  contact_phone?: string | null;
  hr_contacts?: unknown[] | null;
  pain_points?: unknown[] | null;
  opportunity_signals?: unknown[] | null;
  leadership_team?: unknown[] | null;
  linkedin_url?: string | null;
}): number {
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

export function getTemplateVariant(score: number): TemplateVariant {
  if (score >= 60) return 'hot';
  if (score >= 35) return 'warm';
  return 'cool';
}

// ========================================
// STEP 1 TEMPLATES - Initial Outreach
// ========================================

function getStep1HotTemplate(data: ProspectData): EmailTemplate {
  return {
    subject: `Quick question about leadership capability at ${data.companyName}`,
    body: `Hi ${data.contactFirstName},

I've been working with ${data.industry} companies in ${data.location} on a specific problem: the gap between the leadership skills people were hired for and the skills they actually need now.

One question: if you could strengthen one capability across your management team right now, what would it be?

I ask because I've spent 11 years coaching 3,000+ organisations, and the answer usually points to exactly where intervention has the biggest ROI.

Happy to share what I've seen in ${data.industry} if you're open to a 15-minute conversation.

— Kevin, Leadership by Design`
  };
}

function getStep1WarmTemplate(data: ProspectData): EmailTemplate {
  const painPointRef = data.painPoints.length > 0 
    ? `especially given the challenges around ${data.painPoints[0].toLowerCase()}`
    : `especially given the growth signals I noticed`;
  
  return {
    subject: `Free leadership diagnostic for ${data.companyName}`,
    body: `Hi ${data.contactFirstName},

I put together a team diagnostic that helps companies identify their biggest leadership skill gaps in about 5 minutes.

No sales pitch attached — it's a genuine tool we built based on 11 years of data from 3,000+ organisations.

Thought it might be useful for ${data.companyName}, ${painPointRef}.

Here's the link: ${getDiagnosticUrl(data.prospectId, 1)}

If the results raise any questions, happy to jump on a quick call to walk through what the data typically means for ${data.industry} companies.

— Kevin, Leadership by Design`
  };
}

function getStep1CoolTemplate(data: ProspectData): EmailTemplate {
  const insight = data.industryInsight || `companies scaling past 200 people often see a sharp drop in middle-management effectiveness`;
  
  return {
    subject: `Something I noticed about ${data.industry} companies in ${data.location}`,
    body: `Hi ${data.contactFirstName},

I've been researching leadership capability in ${data.industry} companies across ${data.location}, and a pattern keeps showing up: ${insight}.

I work with organisations on exactly this — developing the human skills that don't improve on their own.

If this resonates, I'd welcome a conversation. If not, no worries at all.

— Kevin, Leadership by Design`
  };
}

// ========================================
// STEP 2 TEMPLATE - Simple Follow-up (Day 3)
// ========================================

function getStep2Template(data: ProspectData, originalSubject: string): EmailTemplate {
  return {
    subject: `Re: ${originalSubject}`,
    body: `Hi ${data.contactFirstName},

Just following up on my note from earlier this week.

I know inboxes are brutal, so I'll keep this short: I work with ${data.industry} companies on leadership development, and I think there might be a fit with what ${data.companyName} is building.

If you have 15 minutes this week or next, I'd love to explore whether there's value in a conversation.

If the timing isn't right, just let me know and I'll check back in a few months.

— Kevin`
  };
}

// ========================================
// STEP 3 TEMPLATE - Value-add (Day 7)
// ========================================

function getStep3Template(data: ProspectData): EmailTemplate {
  return {
    subject: `A resource for ${data.companyName}'s leadership team`,
    body: `Hi ${data.contactFirstName},

I wanted to share something genuinely useful rather than just follow up again.

We recently published a diagnostic tool that helps teams identify which of 5 critical human skills need strengthening — self-management, human intelligence, innovation, focus, and thinking.

It takes about 5 minutes and gives you a clear picture of where your team's gaps are:

${getDiagnosticUrl(data.prospectId, 3)}

No obligation, no follow-up unless you want it. I just think the data would be valuable for ${data.companyName}.

— Kevin`
  };
}

// ========================================
// STEP 4 TEMPLATE - Final Touch (Day 14)
// ========================================

function getStep4Template(data: ProspectData): EmailTemplate {
  return {
    subject: `Last note from me`,
    body: `Hi ${data.contactFirstName},

I won't keep following up — I respect your time.

If leadership development or team performance comes onto your radar in the next 6-12 months, I'm here: leadershipbydesign.co

In the meantime, I've put together some free resources that might be useful:

• Team Diagnostic: ${getDiagnosticUrl(data.prospectId, 4)}
• SHIFT Methodology overview: https://leadershipbydesign.lovable.app/shift-methodology

Wishing you and the team at ${data.companyName} a strong year ahead.

— Kevin, Leadership by Design`
  };
}

// ========================================
// MAIN TEMPLATE SELECTOR
// ========================================

export function getEmailTemplate(
  step: number,
  variant: TemplateVariant,
  data: ProspectData,
  originalSubject?: string
): EmailTemplate {
  switch (step) {
    case 1:
      switch (variant) {
        case 'hot':
          return getStep1HotTemplate(data);
        case 'warm':
          return getStep1WarmTemplate(data);
        case 'cool':
          return getStep1CoolTemplate(data);
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

// ========================================
// HTML EMAIL WRAPPER
// ========================================

export function wrapEmailHtml(body: string, prospectId: string): string {
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

// ========================================
// SCHEDULE HELPERS
// ========================================

export function getNextSendDate(currentStep: number): Date {
  const now = new Date();
  let daysToAdd: number;
  
  switch (currentStep) {
    case 1:
      daysToAdd = 3; // Step 2 in 3 days
      break;
    case 2:
      daysToAdd = 4; // Step 3 in 4 more days (7 total from step 1)
      break;
    case 3:
      daysToAdd = 7; // Step 4 in 7 more days (14 total from step 1)
      break;
    default:
      return now; // No more steps
  }
  
  const nextDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  
  // Adjust to next Tue-Thu at 8:00 AM SAST
  return adjustToSendWindow(nextDate);
}

export function adjustToSendWindow(date: Date): Date {
  const result = new Date(date);
  
  // Set to 8:00 AM SAST (UTC+2)
  result.setUTCHours(6, 0, 0, 0);
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const day = result.getDay();
  
  // Adjust to next Tue (2), Wed (3), or Thu (4)
  if (day === 0) {
    // Sunday -> Tuesday
    result.setDate(result.getDate() + 2);
  } else if (day === 1) {
    // Monday -> Tuesday
    result.setDate(result.getDate() + 1);
  } else if (day === 5) {
    // Friday -> Tuesday
    result.setDate(result.getDate() + 4);
  } else if (day === 6) {
    // Saturday -> Tuesday
    result.setDate(result.getDate() + 3);
  }
  // Tue, Wed, Thu are already valid
  
  return result;
}

export function isWithinSendWindow(): boolean {
  const now = new Date();
  const hour = now.getUTCHours() + 2; // SAST is UTC+2
  const day = now.getDay();
  
  // Check if Tue-Thu (2, 3, 4)
  if (day < 2 || day > 4) return false;
  
  // Check if 8-10 AM SAST
  return hour >= 8 && hour < 10;
}
