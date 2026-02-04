import type { CompanyResearchResult, ProspectCompany } from '@/lib/api/prospects';

export interface ProspectQualityScore {
  score: number;
  temperature: 'hot' | 'warm' | 'cool';
  color: 'green' | 'yellow' | 'red';
  label: string;
  breakdown: {
    contactEmail: number;
    hrContacts: number;
    contactPhone: number;
    painPoints: number;
    opportunitySignals: number;
    leadershipTeam: number;
    linkedIn: number;
  };
}

interface ScoringData {
  contact_email?: string | null;
  contact_phone?: string | null;
  linkedin_url?: string | null;
  hr_contacts?: { name: string; role: string; linkedin_search_url: string }[] | null;
  pain_points?: string[] | null;
  opportunity_signals?: string[] | null;
  leadership_team?: { name: string; role: string }[] | null;
}

const SCORING_WEIGHTS = {
  contactEmail: 25,
  hrContacts: 20,
  contactPhone: 10,
  painPoints: 15,
  opportunitySignals: 15,
  leadershipTeam: 10,
  linkedIn: 5,
} as const;

const THRESHOLDS = {
  hot: 60,
  warm: 35,
} as const;

export function calculateProspectScore(data: ScoringData): ProspectQualityScore {
  const breakdown = {
    contactEmail: data.contact_email ? SCORING_WEIGHTS.contactEmail : 0,
    hrContacts: data.hr_contacts && data.hr_contacts.length > 0 ? SCORING_WEIGHTS.hrContacts : 0,
    contactPhone: data.contact_phone ? SCORING_WEIGHTS.contactPhone : 0,
    painPoints: data.pain_points && data.pain_points.length > 0 ? SCORING_WEIGHTS.painPoints : 0,
    opportunitySignals: data.opportunity_signals && data.opportunity_signals.length > 0 ? SCORING_WEIGHTS.opportunitySignals : 0,
    leadershipTeam: data.leadership_team && data.leadership_team.length > 0 ? SCORING_WEIGHTS.leadershipTeam : 0,
    linkedIn: data.linkedin_url ? SCORING_WEIGHTS.linkedIn : 0,
  };

  const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  let temperature: 'hot' | 'warm' | 'cool';
  let color: 'green' | 'yellow' | 'red';
  let label: string;

  if (score >= THRESHOLDS.hot) {
    temperature = 'hot';
    color = 'green';
    label = 'Hot Lead';
  } else if (score >= THRESHOLDS.warm) {
    temperature = 'warm';
    color = 'yellow';
    label = 'Warm Lead';
  } else {
    temperature = 'cool';
    color = 'red';
    label = 'Needs Research';
  }

  return { score, temperature, color, label, breakdown };
}

export function scoreFromResearchResult(result: CompanyResearchResult): ProspectQualityScore {
  return calculateProspectScore({
    contact_email: result.contact_email,
    contact_phone: result.contact_phone,
    linkedin_url: result.linkedin_url,
    hr_contacts: result.hr_contacts,
    pain_points: result.pain_points,
    opportunity_signals: result.opportunity_signals,
    leadership_team: result.leadership_team,
  });
}

export function scoreFromProspect(prospect: ProspectCompany): ProspectQualityScore {
  return calculateProspectScore({
    contact_email: prospect.contact_email,
    contact_phone: prospect.contact_phone,
    linkedin_url: prospect.linkedin_url,
    hr_contacts: prospect.hr_contacts,
    pain_points: prospect.pain_points,
    opportunity_signals: prospect.opportunity_signals,
    leadership_team: prospect.leadership_team,
  });
}
