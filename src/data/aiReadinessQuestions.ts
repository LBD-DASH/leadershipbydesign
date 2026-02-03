export type AIReadinessCategory = 'awareness' | 'collaboration' | 'change' | 'ethics' | 'human_skills';

export interface AIReadinessQuestion {
  id: number;
  text: string;
  category: AIReadinessCategory;
}

export interface AIReadinessCategoryInfo {
  key: AIReadinessCategory;
  title: string;
  fullTitle: string;
  description: string;
}

export const aiReadinessCategories: AIReadinessCategoryInfo[] = [
  {
    key: 'awareness',
    title: 'AI Awareness',
    fullTitle: 'AI Awareness & Understanding',
    description: 'Understanding AI capabilities, limitations, and appropriate applications in the workplace.',
  },
  {
    key: 'collaboration',
    title: 'Human-AI Collaboration',
    fullTitle: 'Human-AI Collaboration',
    description: 'Effectively working WITH AI tools while maintaining human oversight and critical evaluation.',
  },
  {
    key: 'change',
    title: 'Change Readiness',
    fullTitle: 'Change Readiness for AI Adoption',
    description: 'Preparing teams for technological changes and building adaptive capacity.',
  },
  {
    key: 'ethics',
    title: 'Ethical AI Leadership',
    fullTitle: 'Ethical AI Leadership (POPI Act)',
    description: 'Ensuring compliance, recognising bias, and making responsible AI decisions.',
  },
  {
    key: 'human_skills',
    title: 'Human Skills Investment',
    fullTitle: 'Human Skills Investment',
    description: 'Developing the uniquely human skills that AI cannot replicate—the SHIFT skills.',
  },
];

export const aiReadinessQuestions: AIReadinessQuestion[] = [
  // AI Awareness (Questions 1-4)
  { id: 1, text: 'I understand which tasks AI can and cannot do effectively.', category: 'awareness' },
  { id: 2, text: 'I can identify opportunities where AI could augment my team\'s work.', category: 'awareness' },
  { id: 3, text: 'I understand the limitations of AI-generated outputs and recommendations.', category: 'awareness' },
  { id: 4, text: 'I stay informed about AI developments relevant to my industry.', category: 'awareness' },
  
  // Human-AI Collaboration (Questions 5-8)
  { id: 5, text: 'My team effectively uses AI tools without over-relying on them.', category: 'collaboration' },
  { id: 6, text: 'My team critically evaluates AI-generated outputs before acting on them.', category: 'collaboration' },
  { id: 7, text: 'I know when to trust AI recommendations and when to apply human judgment.', category: 'collaboration' },
  { id: 8, text: 'My team maintains human oversight over AI-assisted processes.', category: 'collaboration' },
  
  // Change Readiness (Questions 9-12)
  { id: 9, text: 'I proactively prepare my team for technological changes.', category: 'change' },
  { id: 10, text: 'I address AI-related anxiety and concerns in my team constructively.', category: 'change' },
  { id: 11, text: 'I communicate clearly about how AI will affect our work and roles.', category: 'change' },
  { id: 12, text: 'I create psychological safety for my team to experiment with new AI tools.', category: 'change' },
  
  // Ethical AI Leadership (Questions 13-16)
  { id: 13, text: 'I ensure AI use in my team complies with data protection requirements (POPI Act).', category: 'ethics' },
  { id: 14, text: 'I can identify potential bias in AI systems and their outputs.', category: 'ethics' },
  { id: 15, text: 'I have clear guidelines for responsible AI use within my team.', category: 'ethics' },
  { id: 16, text: 'I consider the ethical implications before implementing AI solutions.', category: 'ethics' },
  
  // Human Skills Investment (Questions 17-20)
  { id: 17, text: 'I invest in developing my team\'s uniquely human skills (empathy, creativity, judgment).', category: 'human_skills' },
  { id: 18, text: 'I prioritise building my team\'s self-management and emotional regulation capabilities.', category: 'human_skills' },
  { id: 19, text: 'I focus on strengthening human connection and relationship-building within my team.', category: 'human_skills' },
  { id: 20, text: 'I help my team develop critical thinking skills to evaluate AI recommendations.', category: 'human_skills' },
];
