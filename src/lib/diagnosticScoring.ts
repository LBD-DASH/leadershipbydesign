export interface DiagnosticScores {
  clarity: number;
  motivation: number;
  leadership: number;
}

export interface DiagnosticResult {
  scores: DiagnosticScores;
  primaryRecommendation: 'clarity' | 'motivation' | 'leadership';
  secondaryRecommendation: 'clarity' | 'motivation' | 'leadership' | null;
}

export function calculateScores(answers: Record<number, number>): DiagnosticScores {
  // Questions 1-5 are clarity
  const clarity = [1, 2, 3, 4, 5].reduce((sum, q) => sum + (answers[q] || 0), 0);
  
  // Questions 6-10 are motivation
  const motivation = [6, 7, 8, 9, 10].reduce((sum, q) => sum + (answers[q] || 0), 0);
  
  // Questions 11-15 are leadership
  const leadership = [11, 12, 13, 14, 15].reduce((sum, q) => sum + (answers[q] || 0), 0);
  
  return { clarity, motivation, leadership };
}

export function getRecommendation(scores: DiagnosticScores): DiagnosticResult {
  const { clarity, motivation, leadership } = scores;
  
  // Find the highest scoring category (highest = most problems)
  const categories: { key: 'clarity' | 'motivation' | 'leadership'; score: number }[] = [
    { key: 'clarity', score: clarity },
    { key: 'motivation', score: motivation },
    { key: 'leadership', score: leadership }
  ];
  
  // Sort by score descending
  categories.sort((a, b) => b.score - a.score);
  
  const primary = categories[0];
  const secondary = categories[1];
  
  // Secondary recommendation if within 3 points of primary
  const hasSecondary = primary.score - secondary.score <= 3;
  
  return {
    scores,
    primaryRecommendation: primary.key,
    secondaryRecommendation: hasSecondary ? secondary.key : null
  };
}

export const workshopDetails = {
  clarity: {
    title: 'The Alignment Reset Workshop',
    duration: 'Morning workshop',
    summary: 'For teams working hard but not in the same direction. Addresses conflicting priorities, unclear success metrics, and reactive ways of working.',
    indicators: [
      'Conflicting priorities',
      'Unclear success metrics',
      'Reactive ways of working'
    ],
    delivers: [
      'Clear priorities',
      'Decision clarity',
      'Aligned expectations'
    ],
    includes: [
      'Values Assessment'
    ],
    resultSummary: 'Your team is working hard, but not in the same direction. Confusion and misalignment are draining energy and slowing execution.'
  },
  motivation: {
    title: 'The Motivation & Energy Reset Workshop',
    duration: 'Morning workshop',
    summary: 'For teams that understand the work but lack energy and emotional commitment. Addresses fatigue, compliance without commitment, and unmet human needs.',
    indicators: [
      'Emotional fatigue',
      'Compliance without commitment',
      'Unmet human needs'
    ],
    delivers: [
      'Re-engagement',
      'Meaning and recognition',
      'Sustainable energy'
    ],
    includes: [
      '6 Human Needs Assessment'
    ],
    resultSummary: 'Your team understands the work - but energy, engagement, and emotional commitment are low.'
  },
  leadership: {
    title: 'The Leadership & Accountability Reset Workshop',
    duration: 'Morning workshop',
    summary: 'For capable teams where ownership is inconsistent. Addresses delayed decisions, avoided conversations, and dependency on authority.',
    indicators: [
      'Delayed decisions',
      'Avoided conversations',
      'Dependency on authority'
    ],
    delivers: [
      'Clear ownership',
      'Faster decisions',
      'Stronger leadership behaviour'
    ],
    includes: [
      'Leadership Index'
    ],
    resultSummary: 'Your team is capable, but ownership and accountability are inconsistent. Avoidance is slowing performance.'
  }
};
