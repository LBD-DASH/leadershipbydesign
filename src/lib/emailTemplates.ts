// Email Template System for Prospect Outreach Sequences
// HR-Focused templates for 4-step sequences with Hot/Warm/Cool variants

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
// STEP 1 TEMPLATES - Initial Outreach (HR-FOCUSED)
// ========================================

function getStep1HotTemplate(data: ProspectData): EmailTemplate {
  return {
    subject: `Quick question for the team at ${data.companyName}`,
    body: `Hi ${data.contactFirstName},

I've been doing some work with ${data.industry} companies in ${data.location} and one thing keeps coming up — there's usually a real gap between the leadership skills managers were hired for and what they actually need right now.

If you could wave a magic wand and strengthen one capability across your management team, what would it be?

I ask because after 11 years and 4,000+ leaders, the answer usually points straight to where development would make the biggest difference to retention and engagement.

Happy to share what I've been seeing if you're up for a 15-minute chat.

— Kevin, Leadership by Design`
  };
}

function getStep1WarmTemplate(data: ProspectData): EmailTemplate {
  const painPointRef = data.painPoints.length > 0 
    ? `especially with what's happening around ${data.painPoints[0].toLowerCase()}`
    : `especially given the growth I've seen`;
  
  return {
    subject: `Something useful for ${data.companyName}'s people team`,
    body: `Hi ${data.contactFirstName},

I built a quick team diagnostic that helps HR and People leaders spot their biggest leadership skill gaps — takes about 5 minutes, no strings attached.

Thought it might be genuinely useful for ${data.companyName}, ${painPointRef}.

Here's the link if you're curious: ${getDiagnosticUrl(data.prospectId, 1)}

If anything in the results raises questions, I'm happy to jump on a call and walk you through what it usually means for manager effectiveness.

— Kevin, Leadership by Design`
  };
}

function getStep1CoolTemplate(data: ProspectData): EmailTemplate {
  const insight = data.industryInsight || `${data.industry} companies scaling past 200 people often hit a wall with middle-management effectiveness — and it shows up in retention and engagement numbers`;
  
  return {
    subject: `A pattern I keep seeing in ${data.industry}`,
    body: `Hi ${data.contactFirstName},

I've been looking at leadership capability across ${data.industry} companies in ${data.location} and there's a pattern that keeps showing up: ${insight}.

It's the kind of thing that doesn't fix itself. I work with HR and People teams on developing the human skills in managers that training manuals can't cover.

If that resonates at all, I'd welcome a conversation. If not, no worries — I won't keep chasing.

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

Just bumping this up — I know inboxes are a nightmare.

Short version: I work with ${data.industry} companies on making their managers better leaders. Not theory — the actual human skills that move the needle on team performance.

If you've got 15 minutes this week or next, I think it'd be worth a quick chat. And if the timing's off, just say the word and I'll circle back later.

— Kevin`
  };
}

// ========================================
// STEP 3 TEMPLATE - Value-add (Day 7)
// ========================================

function getStep3Template(data: ProspectData): EmailTemplate {
  return {
    subject: `This might actually be useful for ${data.companyName}`,
    body: `Hi ${data.contactFirstName},

Rather than just following up again, I wanted to share something that might genuinely help.

I built a diagnostic that shows HR and People teams exactly where their managers' skill gaps are across 5 critical areas — self-management, human intelligence, innovation, focus, and thinking. Takes about 5 minutes.

Here's the link: ${getDiagnosticUrl(data.prospectId, 3)}

No catch, no follow-up unless you want it. I just think the data would be useful for your people strategy.

— Kevin`
  };
}

// ========================================
// STEP 4 TEMPLATE - Final Touch (Day 14)
// ========================================

function getStep4Template(data: ProspectData): EmailTemplate {
  return {
    subject: `Last one from me`,
    body: `Hi ${data.contactFirstName},

I'll leave it here — I know you're busy and I respect that.

If leadership development or manager effectiveness ever comes onto your radar, you know where to find me: leadershipbydesign.co

In the meantime, a couple of free things your people team might find useful:

• Team Diagnostic: ${getDiagnosticUrl(data.prospectId, 4)}
• Our SHIFT approach: https://leadershipbydesign.lovable.app/shift-methodology

Here's to a strong year for ${data.companyName}.

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
  
  // Adjust to next weekday at 8:00 AM SAST
  return adjustToSendWindow(nextDate);
}

export function adjustToSendWindow(date: Date): Date {
  const result = new Date(date);
  
  // Set to 8:00 AM SAST (UTC+2)
  result.setUTCHours(6, 0, 0, 0);
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const day = result.getDay();
  
  // Adjust to next weekday (Mon-Fri)
  if (day === 0) {
    // Sunday -> Monday
    result.setDate(result.getDate() + 1);
  } else if (day === 6) {
    // Saturday -> Monday
    result.setDate(result.getDate() + 2);
  }
  // Mon-Fri are already valid
  
  return result;
}

export function isWithinSendWindow(): boolean {
  const now = new Date();
  const hour = now.getUTCHours() + 2; // SAST is UTC+2
  const day = now.getDay();
  
  // Check if Mon-Fri (1-5)
  if (day === 0 || day === 6) return false;
  
  // Check if 8-10 AM SAST
  return hour >= 8 && hour < 10;
}
