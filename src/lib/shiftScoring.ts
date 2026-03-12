import { ShiftSkill, shiftQuestions, shiftCategories, aiReadinessQuestions } from '@/data/shiftQuestions';
import { aiReadinessQuestions as detailedAIQuestions, aiReadinessCategories as detailedAICategories, type AIReadinessCategory } from '@/data/aiReadinessQuestions';

export interface ShiftScores {
  S: number;
  H: number;
  I: number;
  F: number;
  T: number;
}

export interface AIReadinessCategoryScores {
  awareness: number;
  collaboration: number;
  change: number;
  ethics: number;
  human_skills: number;
}

export interface ShiftResult {
  scores: ShiftScores;
  primaryDevelopment: ShiftSkill;
  secondaryDevelopment: ShiftSkill | null;
  primaryStrength: ShiftSkill;
  aiReadinessScore: number;
  aiReadinessLevel: 'strong' | 'developing' | 'foundation';
  aiCategoryScores: AIReadinessCategoryScores;
}

export interface SkillDetail {
  key: ShiftSkill;
  title: string;
  description: string;
  whenStrong: string[];
  needsDevelopment: string[];
  howToStrengthen: string[];
  workshopConnection: string;
}

export const skillDetails: Record<ShiftSkill, SkillDetail> = {
  S: {
    key: 'S',
    title: 'Self-Management',
    description: 'The foundation of effective leadership. Self-management is about regulating your internal state—emotions, energy, and reactions—especially when under pressure.',
    whenStrong: [
      'You stay composed in high-stakes situations',
      'You recover quickly from setbacks',
      'You maintain energy and focus throughout demanding periods',
      'Others see you as steady and reliable under pressure',
    ],
    needsDevelopment: [
      'Reactive responses that you later regret',
      'Energy crashes or burnout patterns',
      'Difficulty separating emotions from decisions',
      'Inconsistent presence in stressful moments',
    ],
    howToStrengthen: [
      'Practice pause techniques before responding',
      'Build awareness of your energy patterns',
      'Develop recovery rituals after demanding periods',
      'Seek feedback on how you show up under pressure',
    ],
    workshopConnection: 'The Motivation Workshop addresses self-management through intrinsic driver awareness and energy regulation techniques.',
  },
  H: {
    key: 'H',
    title: 'Human Intelligence',
    description: 'The ability to read people accurately, adapt your approach to different personalities, and build genuine trust across diverse stakeholders.',
    whenStrong: [
      'You quickly understand what drives different people',
      'You build rapport easily across personality types',
      'You navigate complex interpersonal dynamics effectively',
      'People feel understood and valued in your presence',
    ],
    needsDevelopment: [
      'Misreading situations or people\'s motivations',
      'One-size-fits-all communication approach',
      'Difficulty connecting with certain personality types',
      'Surface-level relationships that lack depth',
    ],
    howToStrengthen: [
      'Study and apply personality frameworks',
      'Ask more questions before offering solutions',
      'Observe how successful influencers adapt their style',
      'Seek feedback from people unlike yourself',
    ],
    workshopConnection: 'The Motivation Workshop develops human intelligence by exploring what truly drives different people beyond surface motivators.',
  },
  I: {
    key: 'I',
    title: 'Innovation',
    description: 'The capacity to question the status quo, take initiative without waiting for permission, and propose new ideas even when they might face resistance.',
    whenStrong: [
      'You challenge assumptions constructively',
      'You spot opportunities others miss',
      'You drive improvements without being asked',
      'You\'re known as someone who makes things better',
    ],
    needsDevelopment: [
      'Accepting "how things are done" without question',
      'Waiting for permission or direction',
      'Holding back ideas for fear of rejection',
      'Defaulting to the safe or familiar option',
    ],
    howToStrengthen: [
      'Practice asking "why" and "what if" regularly',
      'Start small experiments without seeking approval',
      'Build tolerance for idea rejection',
      'Study how innovators think and operate',
    ],
    workshopConnection: 'The Leadership Workshop cultivates innovation through strategic questioning and initiative-taking frameworks.',
  },
  F: {
    key: 'F',
    title: 'Focus',
    description: 'The discipline to prioritise ruthlessly, stay on track despite distractions, and align your effort to outcomes rather than just activity.',
    whenStrong: [
      'You consistently deliver on what matters most',
      'You say no to low-value demands',
      'You maintain clarity amid competing priorities',
      'Your effort translates directly to results',
    ],
    needsDevelopment: [
      'Spreading yourself too thin across priorities',
      'Difficulty saying no to requests',
      'Confusing busyness with productivity',
      'Losing sight of what truly matters',
    ],
    howToStrengthen: [
      'Define your top 3 priorities weekly',
      'Practice the "not now" conversation',
      'Review where your time actually goes',
      'Align daily actions to strategic outcomes',
    ],
    workshopConnection: 'The Alignment Workshop builds focus through clarity on purpose, priorities, and what success really looks like.',
  },
  T: {
    key: 'T',
    title: 'Thinking',
    description: 'The ability to make independent, well-reasoned decisions by considering context and nuance, then owning the conclusions you reach.',
    whenStrong: [
      'You form your own views rather than following the crowd',
      'You consider multiple perspectives before deciding',
      'You defend your conclusions when challenged',
      'Others trust your judgment and reasoning',
    ],
    needsDevelopment: [
      'Over-relying on others\' opinions',
      'Jumping to conclusions without analysis',
      'Avoiding taking a clear position',
      'Changing views too easily under pressure',
    ],
    howToStrengthen: [
      'Practice forming views before consulting others',
      'Build structured decision-making frameworks',
      'Articulate your reasoning, not just conclusions',
      'Seek out contrary perspectives deliberately',
    ],
    workshopConnection: 'The Leadership Workshop develops thinking through structured decision frameworks and independent reasoning practices.',
  },
};

export function calculateShiftScores(answers: Record<number, number>): ShiftScores {
  const scores: ShiftScores = { S: 0, H: 0, I: 0, F: 0, T: 0 };
  
  shiftQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      scores[question.skill] += answer;
    }
  });
  
  return scores;
}

export const AI_ID_OFFSET = 100;

export function calculateAIReadinessScore(answers: Record<number, number>): number {
  let total = 0;
  // Support both old 5-question format (IDs 21-25) and new 20-question format (IDs 101-120)
  detailedAIQuestions.forEach((question) => {
    const answer = answers[question.id + AI_ID_OFFSET];
    if (answer !== undefined) {
      total += answer;
    }
  });
  // Fallback to old format
  if (total === 0) {
    aiReadinessQuestions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        total += answer;
      }
    });
  }
  return total;
}

export function calculateAIReadinessCategoryScores(answers: Record<number, number>): AIReadinessCategoryScores {
  const scores: AIReadinessCategoryScores = { awareness: 0, collaboration: 0, change: 0, ethics: 0, human_skills: 0 };
  detailedAIQuestions.forEach((q) => {
    const answer = answers[q.id + AI_ID_OFFSET];
    if (answer !== undefined) {
      scores[q.category] += answer;
    }
  });
  return scores;
}

export const aiCategoryDetails: Record<AIReadinessCategory, { title: string; icon: string; description: string; whenStrong: string[]; needsDevelopment: string[]; howToStrengthen: string[]; workshopConnection: string }> = {
  awareness: {
    title: 'AI Awareness',
    icon: '🔍',
    description: 'Understanding AI capabilities, limitations, and appropriate applications in your workplace.',
    whenStrong: ['You know which tasks AI handles well vs. poorly', 'You spot AI opportunities others miss', 'You stay current on relevant AI developments', 'You set realistic expectations for AI outcomes'],
    needsDevelopment: ['Over-estimating or under-estimating AI capabilities', 'Missing obvious AI use cases', 'Falling behind on AI developments', 'Unrealistic expectations of AI tools'],
    howToStrengthen: ['Experiment with AI tools in low-risk settings', 'Follow industry-specific AI case studies', 'Attend AI literacy workshops', 'Map your workflows for AI augmentation potential'],
    workshopConnection: 'The SHIFT AI Leadership module builds foundational AI awareness through hands-on exploration.',
  },
  collaboration: {
    title: 'Human-AI Collaboration',
    icon: '🤝',
    description: 'Effectively working WITH AI tools while maintaining human oversight and critical evaluation.',
    whenStrong: ['Your team uses AI without over-relying on it', 'AI outputs are critically evaluated before action', 'You know when to trust AI vs. apply human judgment', 'Human oversight is maintained over AI processes'],
    needsDevelopment: ['Blind trust in AI-generated outputs', 'Under-utilising available AI tools', 'No quality checks on AI recommendations', 'Losing human agency in AI-assisted workflows'],
    howToStrengthen: ['Establish AI output review protocols', 'Create human-in-the-loop checkpoints', 'Train teams on prompt engineering basics', 'Define clear AI vs. human decision boundaries'],
    workshopConnection: 'The AI-Ready Leadership programme develops practical human-AI collaboration frameworks.',
  },
  change: {
    title: 'Change Readiness',
    icon: '🔄',
    description: 'Preparing teams for technological changes and building adaptive capacity for AI adoption.',
    whenStrong: ['You proactively prepare your team for AI changes', 'AI anxiety is addressed constructively', 'Clear communication about AI\'s impact on roles', 'Psychological safety for AI experimentation exists'],
    needsDevelopment: ['Reactive approach to AI adoption', 'Unaddressed team anxiety about AI', 'Poor communication about AI changes', 'Fear of failure prevents AI experimentation'],
    howToStrengthen: ['Create safe spaces for AI experimentation', 'Communicate transparently about AI strategy', 'Address concerns before rolling out AI tools', 'Celebrate learning from AI experiments, even failures'],
    workshopConnection: 'The Alignment Workshop builds change readiness through clarity on purpose and priorities.',
  },
  ethics: {
    title: 'Ethical AI Leadership',
    icon: '⚖️',
    description: 'Ensuring compliance, recognising bias, and making responsible AI decisions (including POPI Act).',
    whenStrong: ['AI use complies with data protection requirements', 'You can identify bias in AI systems', 'Clear guidelines for responsible AI use exist', 'Ethical implications are considered before implementation'],
    needsDevelopment: ['Data protection gaps in AI workflows', 'Inability to spot AI bias', 'No governance framework for AI use', 'Ethics treated as afterthought'],
    howToStrengthen: ['Audit current AI tools for POPI compliance', 'Learn to identify common AI biases', 'Create an AI ethics checklist for your team', 'Include ethical review in AI project planning'],
    workshopConnection: 'The Ethical AI Leadership module covers POPI Act compliance and responsible AI governance.',
  },
  human_skills: {
    title: 'Human Skills Investment',
    icon: '💡',
    description: 'Developing the uniquely human skills that AI cannot replicate — empathy, creativity, judgment.',
    whenStrong: ['You invest in empathy, creativity, and judgment', 'Self-management and emotional regulation are priorities', 'Human connection and relationships are strengthened', 'Critical thinking skills are actively developed'],
    needsDevelopment: ['Over-investing in technical skills, under-investing in human ones', 'Emotional intelligence neglected', 'Relationships deprioritised for efficiency', 'Critical thinking delegated to AI'],
    howToStrengthen: ['Dedicate development time to SHIFT skills', 'Create mentoring and coaching opportunities', 'Practise deliberate relationship-building', 'Use AI to handle routine work, freeing time for human skills'],
    workshopConnection: 'The full SHIFT programme is designed to develop exactly these uniquely human capabilities.',
  },
};

export function getAIReadinessLevel(score: number): 'strong' | 'developing' | 'foundation' {
  if (score >= 70) return 'strong';
  if (score >= 45) return 'developing';
  return 'foundation';
}

export function getAIReadinessLevelInfo(level: 'strong' | 'developing' | 'foundation'): { title: string; description: string; color: string } {
  switch (level) {
    case 'strong':
      return {
        title: 'AI-Ready',
        description: 'Your team shows strong readiness to lead in an AI-augmented workplace.',
        color: 'text-green-600',
      };
    case 'developing':
      return {
        title: 'Developing AI Readiness',
        description: 'Your team has a solid foundation—targeted development will accelerate AI readiness.',
        color: 'text-blue-600',
      };
    case 'foundation':
      return {
        title: 'Building AI Foundation',
        description: 'Invest in AI leadership development to prepare your team for the AI-augmented workplace.',
        color: 'text-amber-600',
      };
  }
}

export function getShiftResult(scores: ShiftScores, aiScore: number = 0, aiCategoryScores?: AIReadinessCategoryScores): ShiftResult {
  const skillScores: { skill: ShiftSkill; score: number }[] = [
    { skill: 'S', score: scores.S },
    { skill: 'H', score: scores.H },
    { skill: 'I', score: scores.I },
    { skill: 'F', score: scores.F },
    { skill: 'T', score: scores.T },
  ];
  
  const sortedAsc = [...skillScores].sort((a, b) => a.score - b.score);
  const sortedDesc = [...skillScores].sort((a, b) => b.score - a.score);
  
  const primaryDevelopment = sortedAsc[0].skill;
  const primaryStrength = sortedDesc[0].skill;
  
  let secondaryDevelopment: ShiftSkill | null = null;
  if (sortedAsc[1].score - sortedAsc[0].score <= 3) {
    secondaryDevelopment = sortedAsc[1].skill;
  }
  
  return {
    scores,
    primaryDevelopment,
    secondaryDevelopment,
    primaryStrength,
    aiReadinessScore: aiScore,
    aiReadinessLevel: getAIReadinessLevel(aiScore),
    aiCategoryScores: aiCategoryScores || { awareness: 0, collaboration: 0, change: 0, ethics: 0, human_skills: 0 },
  };
}

export function getScoreInterpretation(score: number): { label: string; color: string } {
  if (score >= 17) return { label: 'Strong capability', color: 'text-green-600' };
  if (score >= 13) return { label: 'Developing well', color: 'text-blue-600' };
  if (score >= 9) return { label: 'Growth opportunity', color: 'text-amber-600' };
  return { label: 'Priority development', color: 'text-red-600' };
}

export function getSkillTitle(skill: ShiftSkill): string {
  const category = shiftCategories.find((c) => c.key === skill);
  return category?.title || skill;
}

export function getShiftInsights(result: ShiftResult): { title: string; description: string }[] {
  const primary = skillDetails[result.primaryDevelopment];
  const strength = skillDetails[result.primaryStrength];
  
  return [
    {
      title: `${primary.title} needs attention`,
      description: `Your team's lowest score suggests ${primary.title.toLowerCase()} is where focused development would create the biggest impact on team effectiveness.`,
    },
    {
      title: `${strength.title} is your team's foundation`,
      description: `This is your team's strongest skill—leverage it while developing others. Consider how you can use this strength to support growth areas.`,
    },
  ];
}
