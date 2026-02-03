import { AIReadinessCategory, aiReadinessQuestions, aiReadinessCategories } from '@/data/aiReadinessQuestions';

export interface AIReadinessScores {
  awareness: number;
  collaboration: number;
  change: number;
  ethics: number;
  human_skills: number;
}

export type ReadinessLevel = 'ai_ready' | 'developing' | 'foundation';

export interface AIReadinessResult {
  scores: AIReadinessScores;
  overallScore: number;
  readinessLevel: ReadinessLevel;
  primaryRecommendation: string;
  secondaryRecommendation: string | null;
  weakestCategory: AIReadinessCategory;
  strongestCategory: AIReadinessCategory;
}

export interface CategoryDetail {
  key: AIReadinessCategory;
  title: string;
  description: string;
  whenStrong: string[];
  needsDevelopment: string[];
  howToStrengthen: string[];
  shiftConnection: string;
}

export const categoryDetails: Record<AIReadinessCategory, CategoryDetail> = {
  awareness: {
    key: 'awareness',
    title: 'AI Awareness',
    description: 'Understanding AI capabilities, limitations, and appropriate applications in the workplace.',
    whenStrong: [
      'You can accurately assess where AI adds value vs. human effort',
      'You make informed decisions about AI tool adoption',
      'You set realistic expectations for AI outcomes',
      'You stay current with relevant AI developments',
    ],
    needsDevelopment: [
      'Overestimating or underestimating AI capabilities',
      'Missing opportunities for AI augmentation',
      'Accepting AI outputs without understanding limitations',
      'Falling behind on AI trends affecting your industry',
    ],
    howToStrengthen: [
      'Take the "Leading in the AI Era" programme',
      'Experiment with AI tools in controlled settings',
      'Study case studies of AI success and failure',
      'Attend industry-specific AI briefings',
    ],
    shiftConnection: 'Thinking skill—making informed, independent assessments about AI capabilities.',
  },
  collaboration: {
    key: 'collaboration',
    title: 'Human-AI Collaboration',
    description: 'Effectively working WITH AI tools while maintaining human oversight and critical evaluation.',
    whenStrong: [
      'Your team leverages AI without becoming dependent',
      'AI outputs are validated before implementation',
      'Human judgment remains central to decisions',
      'AI augments rather than replaces human capability',
    ],
    needsDevelopment: [
      'Over-reliance on AI recommendations',
      'Accepting AI outputs uncritically',
      'Losing human skills through disuse',
      'Unclear boundaries between AI and human roles',
    ],
    howToStrengthen: [
      'Establish AI validation protocols',
      'Practice critical evaluation of AI outputs',
      'Define clear human oversight requirements',
      'Build AI-augmented workflows with checkpoints',
    ],
    shiftConnection: 'Thinking & Focus skills—evaluating AI outputs and staying aligned to human outcomes.',
  },
  change: {
    key: 'change',
    title: 'Change Readiness',
    description: 'Preparing teams for technological changes and building adaptive capacity.',
    whenStrong: [
      'Your team embraces AI as an opportunity',
      'Anxiety about AI is addressed constructively',
      'Change is communicated clearly and early',
      'Experimentation is encouraged and safe',
    ],
    needsDevelopment: [
      'Resistance or fear dominating AI conversations',
      'Lack of clarity about AI\'s impact on roles',
      'Teams feeling left behind by technology',
      'Change imposed without psychological safety',
    ],
    howToStrengthen: [
      'Address AI anxiety with open conversations',
      'Communicate a clear AI integration roadmap',
      'Create safe spaces for experimentation',
      'Build change resilience through SHIFT skills',
    ],
    shiftConnection: 'Self-Management skill—regulating anxiety and maintaining composure during change.',
  },
  ethics: {
    key: 'ethics',
    title: 'Ethical AI Leadership',
    description: 'Ensuring compliance, recognising bias, and making responsible AI decisions.',
    whenStrong: [
      'AI use complies with POPI Act and regulations',
      'Potential bias is identified and addressed',
      'Clear guidelines govern AI implementation',
      'Ethical implications are considered proactively',
    ],
    needsDevelopment: [
      'Compliance gaps in AI data usage',
      'Unrecognised bias in AI systems',
      'Ad-hoc AI adoption without guidelines',
      'Ethical considerations as afterthoughts',
    ],
    howToStrengthen: [
      'Review POPI Act requirements for AI',
      'Build AI bias recognition capability',
      'Create ethical AI use guidelines',
      'Include ethics in AI adoption decisions',
    ],
    shiftConnection: 'Thinking skill—independent ethical reasoning and responsible decision-making.',
  },
  human_skills: {
    key: 'human_skills',
    title: 'Human Skills Investment',
    description: 'Developing the uniquely human skills that AI cannot replicate—the SHIFT skills.',
    whenStrong: [
      'Your team\'s human skills are actively developed',
      'Empathy, creativity, and judgment are prioritised',
      'Human connection strengthens despite AI adoption',
      'SHIFT skills are seen as competitive advantage',
    ],
    needsDevelopment: [
      'Technical skills prioritised over human skills',
      'Neglecting emotional intelligence development',
      'Human connection declining with automation',
      'Missing the "human edge" opportunity',
    ],
    howToStrengthen: [
      'Implement the SHIFT Methodology',
      'Invest in Self-Management development',
      'Strengthen Human Intelligence capabilities',
      'Build Innovation and critical Thinking skills',
    ],
    shiftConnection: 'All SHIFT skills—the foundation of human advantage in an AI world.',
  },
};

export function calculateAIReadinessScores(answers: Record<number, number>): AIReadinessScores {
  const scores: AIReadinessScores = { awareness: 0, collaboration: 0, change: 0, ethics: 0, human_skills: 0 };
  
  aiReadinessQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      scores[question.category] += answer;
    }
  });
  
  return scores;
}

export function getAIReadinessResult(scores: AIReadinessScores): AIReadinessResult {
  // Calculate overall score (sum of all categories, max = 100)
  const overallScore = scores.awareness + scores.collaboration + scores.change + scores.ethics + scores.human_skills;
  
  // Determine readiness level
  let readinessLevel: ReadinessLevel;
  if (overallScore >= 75) {
    readinessLevel = 'ai_ready';
  } else if (overallScore >= 50) {
    readinessLevel = 'developing';
  } else {
    readinessLevel = 'foundation';
  }
  
  // Find weakest and strongest categories
  const categoryScores: { category: AIReadinessCategory; score: number }[] = [
    { category: 'awareness', score: scores.awareness },
    { category: 'collaboration', score: scores.collaboration },
    { category: 'change', score: scores.change },
    { category: 'ethics', score: scores.ethics },
    { category: 'human_skills', score: scores.human_skills },
  ];
  
  const sortedAsc = [...categoryScores].sort((a, b) => a.score - b.score);
  const sortedDesc = [...categoryScores].sort((a, b) => b.score - a.score);
  
  const weakestCategory = sortedAsc[0].category;
  const strongestCategory = sortedDesc[0].category;
  
  // Determine recommendations
  let primaryRecommendation = 'Leading in the AI Era';
  let secondaryRecommendation: string | null = null;
  
  if (readinessLevel === 'ai_ready') {
    primaryRecommendation = 'Advanced AI Integration Strategies';
    secondaryRecommendation = `Strengthen ${categoryDetails[weakestCategory].title} further`;
  } else if (readinessLevel === 'developing') {
    primaryRecommendation = 'Leading in the AI Era';
    secondaryRecommendation = getShiftRecommendation(weakestCategory);
  } else {
    primaryRecommendation = 'Leading in the AI Era (Full Programme)';
    secondaryRecommendation = 'SHIFT Methodology Foundation';
  }
  
  return {
    scores,
    overallScore,
    readinessLevel,
    primaryRecommendation,
    secondaryRecommendation,
    weakestCategory,
    strongestCategory,
  };
}

function getShiftRecommendation(category: AIReadinessCategory): string {
  switch (category) {
    case 'awareness':
    case 'collaboration':
    case 'ethics':
      return 'SHIFT Thinking Development';
    case 'change':
      return 'SHIFT Self-Management Development';
    case 'human_skills':
      return 'Full SHIFT Skills Programme';
    default:
      return 'SHIFT Methodology';
  }
}

export function getScoreInterpretation(score: number): { label: string; color: string } {
  if (score >= 17) return { label: 'Strong capability', color: 'text-green-600' };
  if (score >= 13) return { label: 'Developing well', color: 'text-blue-600' };
  if (score >= 9) return { label: 'Growth opportunity', color: 'text-amber-600' };
  return { label: 'Priority development', color: 'text-red-600' };
}

export function getReadinessLevelInfo(level: ReadinessLevel): { title: string; description: string; color: string } {
  switch (level) {
    case 'ai_ready':
      return {
        title: 'AI-Ready Leader',
        description: 'You demonstrate strong AI leadership capabilities. Focus on advanced integration and leveraging your strengths.',
        color: 'text-green-600',
      };
    case 'developing':
      return {
        title: 'Developing AI Leadership',
        description: 'You have a solid foundation. Targeted development in specific areas will accelerate your AI readiness.',
        color: 'text-blue-600',
      };
    case 'foundation':
      return {
        title: 'Building Foundation',
        description: 'Invest in comprehensive AI leadership development. The "Leading in the AI Era" programme is recommended.',
        color: 'text-amber-600',
      };
  }
}

export function getCategoryTitle(category: AIReadinessCategory): string {
  const categoryInfo = aiReadinessCategories.find((c) => c.key === category);
  return categoryInfo?.title || category;
}

export function getAIReadinessInsights(result: AIReadinessResult): { title: string; description: string }[] {
  const weakest = categoryDetails[result.weakestCategory];
  const strongest = categoryDetails[result.strongestCategory];
  
  return [
    {
      title: `${weakest.title} needs attention`,
      description: `This is your lowest-scoring area. Focused development here would create the biggest impact on your AI leadership capability.`,
    },
    {
      title: `${strongest.title} is your foundation`,
      description: `This is your strongest AI leadership skill. Leverage it while developing other areas. ${weakest.shiftConnection}`,
    },
    {
      title: 'SHIFT Skills Connection',
      description: `Your AI readiness is built on human skills. ${weakest.shiftConnection}`,
    },
  ];
}
