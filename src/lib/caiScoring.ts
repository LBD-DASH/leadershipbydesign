// Contagious Identity™ – Client Alignment Index Scoring Logic

export interface CAIResult {
  totalScore: number;
  maxScore: 85;
  minScore: 17;
  percentage: number;
  category: 'tactical' | 'growth' | 'resonance' | 'sovereign';
  categoryLabel: string;
  message: string;
  ctaLabel: string;
  ctaLink: string;
  sectionScores: Record<string, number>;
}

export function calculateCAIResult(answers: Record<number, number>): CAIResult {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const percentage = Math.round(((totalScore - 17) / (85 - 17)) * 100);

  // Calculate section scores
  const sectionMap: Record<string, number[]> = {
    'identity-readiness': [1, 2, 3],
    'responsibility': [4, 5],
    'depth': [6, 7],
    'growth-tolerance': [8, 9],
    'future-impact': [10, 11, 12],
    'values-resonance': [13, 14, 15, 16, 17],
  };

  const sectionScores: Record<string, number> = {};
  for (const [section, ids] of Object.entries(sectionMap)) {
    const maxForSection = ids.length * 5;
    const actual = ids.reduce((sum, id) => sum + (answers[id] || 0), 0);
    sectionScores[section] = Math.round((actual / maxForSection) * 100);
  }

  if (totalScore <= 39) {
    return {
      totalScore, maxScore: 85, minScore: 17, percentage, sectionScores,
      category: 'tactical',
      categoryLabel: 'Tactical Fit',
      message: 'You are currently seeking improvement, not identity evolution. The SHIFT Skills Programme is designed to build the foundational capabilities that precede identity-level work.',
      ctaLabel: 'Explore SHIFT Skills Programme',
      ctaLink: '/shift-methodology',
    };
  } else if (totalScore <= 60) {
    return {
      totalScore, maxScore: 85, minScore: 17, percentage, sectionScores,
      category: 'growth',
      categoryLabel: 'Growth Aligned',
      message: 'You are ready for structured leadership development. The Leadership Index Diagnostic will map your operating level and identify your precise growth trajectory.',
      ctaLabel: 'Book Leadership Index Diagnostic',
      ctaLink: '/leadership-diagnostic',
    };
  } else if (totalScore <= 75) {
    return {
      totalScore, maxScore: 85, minScore: 17, percentage, sectionScores,
      category: 'resonance',
      categoryLabel: 'Strong Resonance',
      message: 'You are aligned with identity-level leadership transformation. The Contagious Identity Programme is built for leaders like you — ready to operate from who they are, not just what they know.',
      ctaLabel: 'Apply for Contagious Identity Programme',
      ctaLink: '/contagious-identity',
    };
  } else {
    return {
      totalScore, maxScore: 85, minScore: 17, percentage, sectionScores,
      category: 'sovereign',
      categoryLabel: 'Sovereign Alignment',
      message: 'You are architect-level. You are ready for identity-based executive design — a private engagement that reshapes how you lead, influence, and build legacy.',
      ctaLabel: 'Apply for Private 1:1 Executive Architecture',
      ctaLink: '/contagious-identity',
    };
  }
}
