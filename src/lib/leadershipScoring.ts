import { LeadershipLevel as LeadershipLevelType, leadershipQuestions } from '@/data/leadershipQuestions';

export type LeadershipLevel = LeadershipLevelType;

export interface LeadershipScores {
  L1: number;
  L2: number;
  L3: number;
  L4: number;
  L5: number;
}

export interface LeadershipResult {
  scores: LeadershipScores;
  primaryLevel: LeadershipLevel;
  secondaryLevel: LeadershipLevel | null;
  isHybrid: boolean;
  lowFoundationFlag: boolean;
}

export interface LeadershipLevelDetail {
  key: LeadershipLevel;
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
  growthEdge: string;
  growthEdgeLevel: LeadershipLevel;
  recommendedPath: string;
}

export const leadershipLevelDetails: Record<LeadershipLevel, LeadershipLevelDetail> = {
  L1: {
    key: 'L1',
    title: 'Personal Productivity Leader',
    subtitle: 'Foundation',
    description: 'You excel at managing yourself — your time, energy, and commitments. You\'re reliable, consistent, and focused on getting things done right.',
    strengths: [
      'Strong personal discipline and follow-through',
      'Effective time and energy management',
      'Consistent delivery on commitments',
      'Systems-oriented approach to work'
    ],
    growthEdge: 'Leadership Development — moving from personal execution to enabling others to deliver.',
    growthEdgeLevel: 'L2',
    recommendedPath: 'Leadership Development Programme'
  },
  L2: {
    key: 'L2',
    title: 'Leadership Development Leader',
    subtitle: 'Team Operator',
    description: 'You\'re skilled at working through others — delegating, communicating, and building trust. Your team knows where they stand with you.',
    strengths: [
      'Effective delegation and trust-building',
      'Direct and constructive conflict resolution',
      'Adaptive communication styles',
      'Ownership of team performance'
    ],
    growthEdge: 'Personal Leadership — deepening self-awareness and leading from purpose rather than just process.',
    growthEdgeLevel: 'L3',
    recommendedPath: 'Personal Leadership Programme'
  },
  L3: {
    key: 'L3',
    title: 'Purpose-Led Leader',
    subtitle: 'Identity & Meaning',
    description: 'You lead from a place of clarity about who you are and what matters. Your leadership is grounded in values, self-awareness, and inner resilience.',
    strengths: [
      'Clear values and purpose',
      'Regular self-reflection and growth',
      'Pressure management with alignment',
      'Deep self-awareness'
    ],
    growthEdge: 'Motivational Leadership — channelling your purpose into inspiring and energising others.',
    growthEdgeLevel: 'L4',
    recommendedPath: 'Motivation & Engagement Workshop'
  },
  L4: {
    key: 'L4',
    title: 'Motivational Leader',
    subtitle: 'People & Energy Driver',
    description: 'You naturally energise people, drive engagement, and create momentum. Others are drawn to your enthusiasm and belief in what\'s possible.',
    strengths: [
      'Inspires action and engagement',
      'Builds emotional buy-in',
      'Drives change with optimism',
      'Develops people\'s strengths'
    ],
    growthEdge: 'Strategic Leadership — translating energy into long-term systems and direction.',
    growthEdgeLevel: 'L5',
    recommendedPath: 'Strategic Leadership Programme'
  },
  L5: {
    key: 'L5',
    title: 'Strategic Leader',
    subtitle: 'Vision & System Builder',
    description: 'You think beyond the immediate. You align people, culture, and strategy to create lasting impact and prepare your organisation for the future.',
    strengths: [
      'Long-term thinking and vision',
      'Alignment of people, culture, and strategy',
      'Change anticipation and preparation',
      'Translates vision into direction'
    ],
    growthEdge: 'Foundation Strengthening — ensuring your strategic vision is grounded in personal and team operational excellence.',
    growthEdgeLevel: 'L1',
    recommendedPath: 'Executive Coaching'
  }
};

export function calculateLeadershipScores(answers: Record<number, number>): LeadershipScores {
  const scores: LeadershipScores = { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 };
  
  leadershipQuestions.forEach((question) => {
    const answer = answers[question.id] || 0;
    scores[question.level] += answer;
  });
  
  return scores;
}

export function getLeadershipResult(scores: LeadershipScores): LeadershipResult {
  const levels: LeadershipLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
  
  // Sort levels by score descending
  const sortedLevels = [...levels].sort((a, b) => scores[b] - scores[a]);
  
  const primaryLevel = sortedLevels[0];
  const secondaryLevel = sortedLevels[1];
  
  // Check if hybrid (primary and secondary within 2 points)
  const isHybrid = scores[primaryLevel] - scores[secondaryLevel] <= 2;
  
  // Check low foundation flag (L1 < 10 AND any higher level > 15)
  const lowFoundationFlag = scores.L1 < 10 && 
    (scores.L2 > 15 || scores.L3 > 15 || scores.L4 > 15 || scores.L5 > 15);
  
  return {
    scores,
    primaryLevel,
    secondaryLevel: isHybrid ? secondaryLevel : null,
    isHybrid,
    lowFoundationFlag
  };
}

export function getLevelTitle(level: LeadershipLevel): string {
  return leadershipLevelDetails[level].title;
}

export function getHybridTitle(primary: LeadershipLevel, secondary: LeadershipLevel): string {
  const primaryTitle = leadershipLevelDetails[primary].title.replace(' Leader', '');
  const secondaryTitle = leadershipLevelDetails[secondary].title.replace(' Leader', '');
  return `${primaryTitle}–${secondaryTitle} Leader`;
}
