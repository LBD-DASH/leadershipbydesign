export type ShiftSkill = 'S' | 'H' | 'I' | 'F' | 'T';

export interface ShiftQuestion {
  id: number;
  text: string;
  skill: ShiftSkill;
}

export interface ShiftCategory {
  key: ShiftSkill;
  title: string;
  fullTitle: string;
  description: string;
}

export const shiftCategories: ShiftCategory[] = [
  {
    key: 'S',
    title: 'Self-Management',
    fullTitle: 'Self-Management',
    description: 'The ability to regulate emotions, energy, and reactions under pressure.',
  },
  {
    key: 'H',
    title: 'Human Intelligence',
    fullTitle: 'Human Intelligence',
    description: 'Reading people, adapting approach, and building trust across personalities.',
  },
  {
    key: 'I',
    title: 'Innovation',
    fullTitle: 'Innovation',
    description: 'Questioning assumptions, taking initiative, and proposing new ideas.',
  },
  {
    key: 'F',
    title: 'Focus',
    fullTitle: 'Focus',
    description: 'Prioritising ruthlessly, staying on track, and aligning effort to outcomes.',
  },
  {
    key: 'T',
    title: 'Thinking',
    fullTitle: 'Thinking',
    description: 'Making independent decisions with context, nuance, and ownership.',
  },
];

export const shiftQuestions: ShiftQuestion[] = [
  // Self-Management (S) - Questions 1-4
  { id: 1, text: 'My team remains calm and composed under pressure.', skill: 'S' },
  { id: 2, text: 'My team regulates energy effectively throughout demanding periods.', skill: 'S' },
  { id: 3, text: 'My team takes responsibility for reactions, regardless of circumstances.', skill: 'S' },
  { id: 4, text: 'My team manages emotions without letting them drive decisions.', skill: 'S' },
  
  // Human Intelligence (H) - Questions 5-8
  { id: 5, text: 'My team quickly reads how others are feeling in conversations.', skill: 'H' },
  { id: 6, text: 'My team adapts their approach based on what drives different people.', skill: 'H' },
  { id: 7, text: 'My team builds trust easily with diverse personalities.', skill: 'H' },
  { id: 8, text: 'My team understands what motivates others beyond surface-level.', skill: 'H' },
  
  // Innovation (I) - Questions 9-12
  { id: 9, text: 'My team questions assumptions rather than accepting them.', skill: 'I' },
  { id: 10, text: 'My team takes initiative without waiting for permission.', skill: 'I' },
  { id: 11, text: 'My team looks for better ways to do things, even when current methods work.', skill: 'I' },
  { id: 12, text: 'My team proposes new ideas confidently, even if they might be rejected.', skill: 'I' },
  
  // Focus (F) - Questions 13-16
  { id: 13, text: 'My team prioritises ruthlessly when under pressure.', skill: 'F' },
  { id: 14, text: 'My team stays on track despite distractions and competing demands.', skill: 'F' },
  { id: 15, text: 'My team aligns effort to outcomes, not just activity.', skill: 'F' },
  { id: 16, text: 'My team says no to low-value work, even when it\'s easy.', skill: 'F' },
  
  // Thinking (T) - Questions 17-20
  { id: 17, text: 'My team makes decisions independently without over-relying on others.', skill: 'T' },
  { id: 18, text: 'My team considers context and nuance before forming conclusions.', skill: 'T' },
  { id: 19, text: 'My team weighs options objectively rather than going with gut instinct.', skill: 'T' },
  { id: 20, text: 'My team takes ownership of conclusions and defends them when challenged.', skill: 'T' },
];
