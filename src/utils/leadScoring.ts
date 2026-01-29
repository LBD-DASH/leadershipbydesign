// Lead Scoring System for Leadership by Design
// Scores leads based on multiple signals to prioritize follow-up

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  organisation?: string;
  company?: string;
  teamSize?: string;
  message?: string;
  followUpPreference?: 'yes' | 'maybe' | 'no';
  source: 'leadership-diagnostic' | 'team-diagnostic' | 'shift-diagnostic' | 'contact-form' | 'lead-magnet' | 'expert-consultation';
  diagnosticResult?: {
    type: 'leadership' | 'team' | 'shift';
    primaryLevel?: string;
    primaryRecommendation?: string;
    primaryDevelopment?: string;
    primaryStrength?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scores?: any;
  };
}

export interface LeadScore {
  score: number;
  temperature: 'hot' | 'warm' | 'cool';
  breakdown: {
    roleWeight: number;
    organisationSignal: number;
    urgencySignal: number;
    messageQuality: number;
    sourceMultiplier: number;
  };
  buyerPersona: string;
  companySize: string;
  urgency: string;
  nextAction: string;
}

// Role scoring - higher roles = more decision-making power
const ROLE_SCORES: Record<string, number> = {
  // C-Suite (30 points)
  'ceo': 30, 'chief': 30, 'founder': 30, 'owner': 30, 'md': 30,
  'managing director': 30, 'president': 30, 'partner': 30, 'principal': 30,
  // Directors (25 points)
  'director': 25, 'vp': 25, 'vice president': 25, 'head of': 25,
  'general manager': 25, 'gm': 25, 'executive': 25,
  // Senior Managers (20 points)
  'manager': 20, 'lead': 20, 'senior': 20, 'supervisor': 20,
  'coordinator': 15, 'team lead': 20,
  // Others (15 points for any role provided)
  'hr': 18, 'human resources': 18, 'people': 18, 'talent': 18,
  'learning': 18, 'development': 18, 'l&d': 18, 'od': 18
};

function getRoleScore(role?: string): number {
  if (!role) return 0;
  
  const normalizedRole = role.toLowerCase().trim();
  
  // Check for exact or partial matches
  for (const [keyword, score] of Object.entries(ROLE_SCORES)) {
    if (normalizedRole.includes(keyword)) {
      return score;
    }
  }
  
  // Any role provided gets base points
  return 15;
}

function getOrganisationScore(org?: string): number {
  if (!org || org.trim().length === 0) return 0;
  return 10; // Organisation provided = +10
}

function getUrgencyScore(preference?: string): number {
  switch (preference) {
    case 'yes': return 30;  // Ready for call now
    case 'maybe': return 15; // Interested but not urgent
    case 'no': return 0;     // Just exploring
    default: return 5;       // Unknown (slight benefit)
  }
}

function getMessageQualityScore(message?: string): number {
  if (!message) return 0;
  
  const length = message.trim().length;
  
  // Longer, more detailed messages = higher intent
  if (length > 200) return 15;
  if (length > 100) return 10;
  if (length > 50) return 5;
  return 2;
}

function getSourceMultiplier(source: LeadData['source']): number {
  switch (source) {
    case 'expert-consultation': return 1.4; // Highest intent - requesting expert contact after diagnostic
    case 'contact-form': return 1.3;        // High intent - actively reaching out
    case 'leadership-diagnostic': return 1.2;
    case 'team-diagnostic': return 1.2;
    case 'shift-diagnostic': return 1.2;
    case 'lead-magnet': return 1.1;         // Lower intent - just downloading content
    default: return 1.0;
  }
}

function determineBuyerPersona(data: LeadData, roleScore: number): string {
  const role = data.role?.toLowerCase() || '';
  
  if (roleScore >= 30) {
    return 'Executive Decision Maker';
  } else if (roleScore >= 25) {
    return 'Senior Leader';
  } else if (role.includes('hr') || role.includes('people') || role.includes('talent') || role.includes('l&d')) {
    return 'HR/L&D Professional';
  } else if (roleScore >= 20) {
    return 'Middle Manager';
  } else if (data.source === 'contact-form') {
    return 'Active Inquirer';
  } else {
    return 'Leadership Learner';
  }
}

function determineCompanySize(data: LeadData): string {
  const teamSize = data.teamSize?.toLowerCase() || '';
  const org = (data.organisation || data.company || '').toLowerCase();
  
  // Check for enterprise signals
  const enterpriseSignals = ['limited', 'ltd', 'inc', 'corporation', 'group', 'holdings', 'international'];
  const isEnterprise = enterpriseSignals.some(signal => org.includes(signal));
  
  if (teamSize.includes('100') || teamSize.includes('large') || isEnterprise) {
    return 'Enterprise (100+)';
  } else if (teamSize.includes('50') || teamSize.includes('medium')) {
    return 'Mid-Market (50-100)';
  } else if (teamSize.includes('small') || teamSize.includes('10')) {
    return 'SMB (10-50)';
  }
  
  return 'Unknown';
}

function determineUrgency(data: LeadData, score: number): string {
  if (data.followUpPreference === 'yes') {
    return 'High - Ready for call';
  } else if (data.followUpPreference === 'maybe') {
    return 'Medium - Interested';
  } else if (data.source === 'contact-form' && data.message && data.message.length > 100) {
    return 'Medium - Detailed inquiry';
  } else if (score >= 70) {
    return 'High - Strong signals';
  } else if (score >= 40) {
    return 'Medium - Worth pursuing';
  }
  return 'Low - Nurture only';
}

function determineNextAction(temperature: 'hot' | 'warm' | 'cool', data: LeadData): string {
  if (temperature === 'hot') {
    if (data.followUpPreference === 'yes') {
      return 'Call within 2 hours - they requested immediate contact';
    }
    return 'Priority email within 4 hours with calendar link';
  } else if (temperature === 'warm') {
    return 'Personalized email within 24 hours with value add';
  }
  return 'Add to nurture sequence - weekly insights newsletter';
}

export function calculateLeadScore(data: LeadData): LeadScore {
  // Calculate component scores
  const roleWeight = getRoleScore(data.role);
  const organisationSignal = getOrganisationScore(data.organisation || data.company);
  const urgencySignal = getUrgencyScore(data.followUpPreference);
  const messageQuality = getMessageQualityScore(data.message);
  const sourceMultiplier = getSourceMultiplier(data.source);
  
  // Base score before multiplier
  const baseScore = roleWeight + organisationSignal + urgencySignal + messageQuality;
  
  // Apply source multiplier and cap at 100
  const rawScore = Math.round(baseScore * sourceMultiplier);
  const score = Math.min(100, rawScore);
  
  // Determine temperature
  let temperature: 'hot' | 'warm' | 'cool';
  if (score >= 70) {
    temperature = 'hot';
  } else if (score >= 40) {
    temperature = 'warm';
  } else {
    temperature = 'cool';
  }
  
  return {
    score,
    temperature,
    breakdown: {
      roleWeight,
      organisationSignal,
      urgencySignal,
      messageQuality,
      sourceMultiplier
    },
    buyerPersona: determineBuyerPersona(data, roleWeight),
    companySize: determineCompanySize(data),
    urgency: determineUrgency(data, score),
    nextAction: determineNextAction(temperature, data)
  };
}

// Helper to format diagnostic results for AI analysis
export function formatDiagnosticContext(data: LeadData): string {
  if (!data.diagnosticResult) return '';
  
  const { type, primaryLevel, primaryRecommendation, primaryDevelopment, primaryStrength } = data.diagnosticResult;
  
  switch (type) {
    case 'leadership':
      return `Leadership Diagnostic Result: Primary Level is ${primaryLevel}`;
    case 'team':
      return `Team Diagnostic Result: Primary recommendation is ${primaryRecommendation}`;
    case 'shift':
      return `SHIFT Diagnostic Result: Primary strength is ${primaryStrength}, Primary development area is ${primaryDevelopment}`;
    default:
      return '';
  }
}

