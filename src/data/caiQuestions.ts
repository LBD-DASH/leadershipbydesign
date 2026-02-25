// Contagious Identity™ – Client Alignment Index (CAI) Questions

export interface CAIQuestion {
  id: number;
  section: string;
  text: string;
  options: { label: string; value: number }[];
}

export const caiSections = [
  { key: 'identity-readiness', title: 'Identity Readiness', subtitle: 'How ready are you for identity-level work?' },
  { key: 'responsibility', title: 'Responsibility & Ownership', subtitle: 'Your relationship with accountability' },
  { key: 'depth', title: 'Depth & Self-Awareness', subtitle: 'How deep are you willing to go?' },
  { key: 'growth-tolerance', title: 'Growth Tolerance', subtitle: 'Your capacity for transformation' },
  { key: 'future-impact', title: 'Future Impact', subtitle: 'The legacy you are building' },
  { key: 'values-resonance', title: 'Values Resonance', subtitle: 'Alignment with Contagious Identity principles' },
];

export const caiQuestions: CAIQuestion[] = [
  // SECTION 1 – Identity Readiness
  {
    id: 1,
    section: 'identity-readiness',
    text: 'Which statement feels most true right now?',
    options: [
      { label: 'I need motivation.', value: 1 },
      { label: 'I need better strategies.', value: 2 },
      { label: 'I feel misaligned with who I am capable of being.', value: 4 },
      { label: 'I want to fundamentally evolve my identity and leadership presence.', value: 5 },
    ],
  },
  {
    id: 2,
    section: 'identity-readiness',
    text: 'When facing setbacks, I usually:',
    options: [
      { label: 'Look for external reasons.', value: 1 },
      { label: 'Analyze what went wrong logically.', value: 2 },
      { label: 'Reflect on my patterns and contribution.', value: 4 },
      { label: 'Take full ownership and redesign my approach.', value: 5 },
    ],
  },
  {
    id: 3,
    section: 'identity-readiness',
    text: 'How willing are you to have your assumptions challenged?',
    options: [
      { label: 'Not comfortable', value: 1 },
      { label: 'Slightly uncomfortable', value: 2 },
      { label: 'Open but cautious', value: 3 },
      { label: 'Fully open', value: 4 },
      { label: 'Actively want it', value: 5 },
    ],
  },
  // SECTION 2 – Responsibility & Ownership
  {
    id: 4,
    section: 'responsibility',
    text: 'When conflict happens at work, my first instinct is:',
    options: [
      { label: 'Defend myself', value: 1 },
      { label: 'Explain my side', value: 2 },
      { label: 'Seek understanding', value: 4 },
      { label: 'Examine my identity and influence in the dynamic', value: 5 },
    ],
  },
  {
    id: 5,
    section: 'responsibility',
    text: 'I believe leadership is primarily about:',
    options: [
      { label: 'Authority', value: 1 },
      { label: 'Skill', value: 2 },
      { label: 'Influence', value: 4 },
      { label: 'Identity and energetic presence', value: 5 },
    ],
  },
  // SECTION 3 – Depth & Self-Awareness
  {
    id: 6,
    section: 'depth',
    text: 'I regularly reflect on:',
    options: [
      { label: 'Tasks', value: 1 },
      { label: 'Goals', value: 2 },
      { label: 'Behaviors', value: 4 },
      { label: 'Emotional drivers and unmet needs', value: 5 },
    ],
  },
  {
    id: 7,
    section: 'depth',
    text: 'How comfortable are you exploring subconscious drivers (needs, ego states, patterns)?',
    options: [
      { label: 'Not comfortable', value: 1 },
      { label: 'Slightly uncomfortable', value: 2 },
      { label: 'Neutral', value: 3 },
      { label: 'Comfortable', value: 4 },
      { label: 'Deeply interested', value: 5 },
    ],
  },
  // SECTION 4 – Growth Tolerance
  {
    id: 8,
    section: 'growth-tolerance',
    text: 'If coaching reveals uncomfortable truths about your leadership style, you would:',
    options: [
      { label: 'Feel defensive', value: 1 },
      { label: 'Need reassurance', value: 2 },
      { label: 'Sit with it', value: 4 },
      { label: 'Implement change immediately', value: 5 },
    ],
  },
  {
    id: 9,
    section: 'growth-tolerance',
    text: 'I am currently looking for:',
    options: [
      { label: 'Quick wins', value: 1 },
      { label: 'Performance improvement', value: 2 },
      { label: 'Long-term evolution', value: 4 },
      { label: 'Transformation that reshapes how I operate everywhere', value: 5 },
    ],
  },
  // SECTION 5 – Future Impact
  {
    id: 10,
    section: 'future-impact',
    text: 'I want my impact to:',
    options: [
      { label: 'Improve my results', value: 1 },
      { label: 'Improve my team', value: 2 },
      { label: 'Influence culture', value: 4 },
      { label: 'Shift how people experience leadership', value: 5 },
    ],
  },
  {
    id: 11,
    section: 'future-impact',
    text: 'I am prepared to invest time weekly into deep identity work:',
    options: [
      { label: 'Not really', value: 1 },
      { label: 'Possibly', value: 2 },
      { label: 'Yes', value: 3 },
      { label: 'Absolutely', value: 4 },
      { label: 'Non-negotiable', value: 5 },
    ],
  },
  {
    id: 12,
    section: 'future-impact',
    text: 'Which describes your ambition?',
    options: [
      { label: 'Stability', value: 1 },
      { label: 'Success', value: 2 },
      { label: 'Significance', value: 4 },
      { label: 'Legacy', value: 5 },
    ],
  },
  // SECTION 6 – Values Resonance
  {
    id: 13,
    section: 'values-resonance',
    text: 'Growth is:',
    options: [
      { label: 'Optional', value: 1 },
      { label: 'Situational', value: 2 },
      { label: 'Intentional', value: 4 },
      { label: 'Non-negotiable', value: 5 },
    ],
  },
  {
    id: 14,
    section: 'values-resonance',
    text: 'My relationship with risk and expansion:',
    options: [
      { label: 'I avoid it', value: 1 },
      { label: 'I take safe steps', value: 2 },
      { label: 'I experiment strategically', value: 4 },
      { label: 'I pursue bold expansion', value: 5 },
    ],
  },
  {
    id: 15,
    section: 'values-resonance',
    text: 'Wealth is:',
    options: [
      { label: 'A necessity', value: 1 },
      { label: 'A success metric', value: 2 },
      { label: 'A tool for freedom and impact', value: 4 },
      { label: 'A responsibility to build consciously', value: 5 },
    ],
  },
  {
    id: 16,
    section: 'values-resonance',
    text: 'Under pressure I:',
    options: [
      { label: 'React emotionally', value: 1 },
      { label: 'Withdraw', value: 2 },
      { label: 'Regulate and recalibrate', value: 4 },
      { label: 'Model grounded presence', value: 5 },
    ],
  },
  {
    id: 17,
    section: 'values-resonance',
    text: 'I value:',
    options: [
      { label: 'Control', value: 1 },
      { label: 'Predictability', value: 2 },
      { label: 'Psychological safety', value: 4 },
      { label: 'Creating safe environments for bold growth', value: 5 },
    ],
  },
];
