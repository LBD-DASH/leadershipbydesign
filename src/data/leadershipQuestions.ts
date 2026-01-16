export type LeadershipLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface LeadershipQuestion {
  id: number;
  level: LeadershipLevel;
  text: string;
}

export interface LeadershipCategory {
  key: LeadershipLevel;
  title: string;
  subtitle: string;
}

export const leadershipCategories: LeadershipCategory[] = [
  {
    key: 'L1',
    title: 'Personal Productivity',
    subtitle: 'Foundation: self-management, time, energy, consistency'
  },
  {
    key: 'L2',
    title: 'Leadership Development',
    subtitle: 'Team Operator: delegation, communication, conflict, trust'
  },
  {
    key: 'L3',
    title: 'Personal Leadership',
    subtitle: 'Identity & Meaning: self-awareness, purpose, resilience, balance'
  },
  {
    key: 'L4',
    title: 'Motivational Leadership',
    subtitle: 'People & Energy Driver: engagement, motivation, empowerment, change'
  },
  {
    key: 'L5',
    title: 'SHIFT Leadership Development',
    subtitle: 'Vision & System Builder: strategy, culture, long-term direction'
  }
];

export const leadershipQuestions: LeadershipQuestion[] = [
  // L1 - Personal Productivity Leader (Q1-Q4)
  {
    id: 1,
    level: 'L1',
    text: 'I consistently manage my time and energy effectively.'
  },
  {
    id: 2,
    level: 'L1',
    text: 'I follow through on commitments without needing reminders.'
  },
  {
    id: 3,
    level: 'L1',
    text: 'I prioritise important work over urgent distractions.'
  },
  {
    id: 4,
    level: 'L1',
    text: 'I have systems that help me stay focused and productive.'
  },
  // L2 - Leadership Development Leader (Q5-Q8)
  {
    id: 5,
    level: 'L2',
    text: 'I delegate effectively and trust others to deliver.'
  },
  {
    id: 6,
    level: 'L2',
    text: 'I address conflict directly and constructively.'
  },
  {
    id: 7,
    level: 'L2',
    text: 'I adapt my communication style to different people.'
  },
  {
    id: 8,
    level: 'L2',
    text: 'I take responsibility for my team\'s performance.'
  },
  // L3 - Personal / Purpose-Led Leader (Q9-Q12)
  {
    id: 9,
    level: 'L3',
    text: 'I am clear on my values and purpose as a leader.'
  },
  {
    id: 10,
    level: 'L3',
    text: 'I regularly reflect on my leadership impact.'
  },
  {
    id: 11,
    level: 'L3',
    text: 'I manage pressure without losing alignment.'
  },
  {
    id: 12,
    level: 'L3',
    text: 'I actively develop my self-awareness.'
  },
  // L4 - Motivational Leader (Q13-Q16)
  {
    id: 13,
    level: 'L4',
    text: 'I energise and inspire others to perform.'
  },
  {
    id: 14,
    level: 'L4',
    text: 'I recognise and develop people\'s strengths.'
  },
  {
    id: 15,
    level: 'L4',
    text: 'I lead change with optimism and momentum.'
  },
  {
    id: 16,
    level: 'L4',
    text: 'People feel motivated after engaging with me.'
  },
  // L5 - Strategic Leader (Q17-Q20)
  {
    id: 17,
    level: 'L5',
    text: 'I think long-term beyond immediate results.'
  },
  {
    id: 18,
    level: 'L5',
    text: 'I align people, culture, and strategy.'
  },
  {
    id: 19,
    level: 'L5',
    text: 'I anticipate change and prepare for it.'
  },
  {
    id: 20,
    level: 'L5',
    text: 'I translate vision into clear direction.'
  }
];
