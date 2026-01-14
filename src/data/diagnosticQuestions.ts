export interface DiagnosticQuestion {
  id: number;
  category: 'clarity' | 'motivation' | 'leadership';
  text: string;
}

export interface DiagnosticCategory {
  key: 'clarity' | 'motivation' | 'leadership';
  title: string;
  subtitle: string;
}

export const categories: DiagnosticCategory[] = [
  {
    key: 'clarity',
    title: 'Team Alignment',
    subtitle: 'How clear and aligned is your team on priorities and direction?'
  },
  {
    key: 'motivation',
    title: 'Team Energy',
    subtitle: 'How engaged and energized is your team?'
  },
  {
    key: 'leadership',
    title: 'Team Ownership',
    subtitle: 'How well does your team take ownership and accountability?'
  }
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // CLARITY (Q1-5)
  {
    id: 1,
    category: 'clarity',
    text: 'Priorities change so often that people are unsure what really matters.'
  },
  {
    id: 2,
    category: 'clarity',
    text: 'Different leaders give conflicting messages about what success looks like.'
  },
  {
    id: 3,
    category: 'clarity',
    text: 'We spend more time reacting than executing planned work.'
  },
  {
    id: 4,
    category: 'clarity',
    text: 'People are busy, but outcomes are inconsistent.'
  },
  {
    id: 5,
    category: 'clarity',
    text: 'Meetings create more questions than answers.'
  },
  // MOTIVATION & ENERGY (Q6-10)
  {
    id: 6,
    category: 'motivation',
    text: 'People do what\'s required, but rarely more than that.'
  },
  {
    id: 7,
    category: 'motivation',
    text: 'Energy in the team feels flat or forced.'
  },
  {
    id: 8,
    category: 'motivation',
    text: 'Good work often goes unnoticed.'
  },
  {
    id: 9,
    category: 'motivation',
    text: 'There is a sense of "why bother" when extra effort is required.'
  },
  {
    id: 10,
    category: 'motivation',
    text: 'Morale feels fragile and easily affected by pressure.'
  },
  // LEADERSHIP & ACCOUNTABILITY (Q11-15)
  {
    id: 11,
    category: 'leadership',
    text: 'Difficult conversations are often avoided or postponed.'
  },
  {
    id: 12,
    category: 'leadership',
    text: 'Decisions are escalated upward that could be handled within the team.'
  },
  {
    id: 13,
    category: 'leadership',
    text: 'When things go wrong, accountability is unclear.'
  },
  {
    id: 14,
    category: 'leadership',
    text: 'People wait for permission rather than taking initiative.'
  },
  {
    id: 15,
    category: 'leadership',
    text: 'Performance issues are tolerated longer than they should be.'
  }
];
