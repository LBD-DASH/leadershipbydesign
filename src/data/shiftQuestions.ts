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
  { id: 1, text: 'I remain calm and composed under pressure.', skill: 'S' },
  { id: 2, text: 'I regulate my energy effectively throughout the day.', skill: 'S' },
  { id: 3, text: 'I take responsibility for my reactions, regardless of circumstances.', skill: 'S' },
  { id: 4, text: 'I manage my emotions without letting them drive my decisions.', skill: 'S' },
  
  // Human Intelligence (H) - Questions 5-8
  { id: 5, text: 'I quickly read how others are feeling in a conversation.', skill: 'H' },
  { id: 6, text: 'I adapt my approach based on what drives different people.', skill: 'H' },
  { id: 7, text: 'I build trust easily with diverse personalities.', skill: 'H' },
  { id: 8, text: 'I understand what motivates others beyond surface-level.', skill: 'H' },
  
  // Innovation (I) - Questions 9-12
  { id: 9, text: 'I question assumptions rather than accept them.', skill: 'I' },
  { id: 10, text: 'I take initiative without waiting for permission.', skill: 'I' },
  { id: 11, text: 'I look for better ways to do things, even when current methods work.', skill: 'I' },
  { id: 12, text: 'I propose new ideas confidently, even if they might be rejected.', skill: 'I' },
  
  // Focus (F) - Questions 13-16
  { id: 13, text: 'I prioritise ruthlessly when under pressure.', skill: 'F' },
  { id: 14, text: 'I stay on track despite distractions and competing demands.', skill: 'F' },
  { id: 15, text: 'I align my effort to outcomes, not just activity.', skill: 'F' },
  { id: 16, text: 'I say no to low-value work, even when it\'s easy.', skill: 'F' },
  
  // Thinking (T) - Questions 17-20
  { id: 17, text: 'I make decisions independently without over-relying on others.', skill: 'T' },
  { id: 18, text: 'I consider context and nuance before forming conclusions.', skill: 'T' },
  { id: 19, text: 'I weigh options objectively rather than going with my gut.', skill: 'T' },
  { id: 20, text: 'I take ownership of my conclusions and defend them when challenged.', skill: 'T' },
];
