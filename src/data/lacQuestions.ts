export type LACVersion = 'hr_leader' | 'manager';

export interface LACQuestion {
  id: number;
  text: string;
}

export const lacScaleLabels = ['Rarely', 'Sometimes', 'Often', 'Usually', 'Always'];

export const hrLeaderQuestions: LACQuestion[] = [
  { id: 1, text: "Our managers hold regular one-on-ones focused on development, not just task updates" },
  { id: 2, text: "When a team member struggles, our managers coach them through it rather than solving it for them" },
  { id: 3, text: "Our managers ask questions before giving answers" },
  { id: 4, text: "Performance conversations in our business are honest, timely and two-way" },
  { id: 5, text: "Our managers create psychological safety — people speak up without fear" },
  { id: 6, text: "When we promote high performers into management, they transition successfully into leading people" },
  { id: 7, text: "Our managers know how to develop the potential in their team, not just manage output" },
  { id: 8, text: "Difficult conversations happen proactively, not after problems escalate" },
  { id: 9, text: "Our managers give feedback that actually changes behaviour" },
  { id: 10, text: "Our people feel genuinely developed by their direct manager" },
  { id: 11, text: "Our managers retain their best people" },
  { id: 12, text: "Leadership capability is consistent across our management layer — not dependent on a few key individuals" },
  { id: 13, text: "Our managers adapt their style to what each person needs" },
  { id: 14, text: "We have a coaching culture — development happens in the flow of work, not just in formal programmes" },
  { id: 15, text: "Our management layer is ready to lead effectively in an AI-driven, high-pressure environment" },
];

export const managerQuestions: LACQuestion[] = [
  { id: 1, text: "I hold regular one-on-ones with my team focused on their development, not just task updates" },
  { id: 2, text: "When someone on my team struggles, I coach them through it rather than solving it for them" },
  { id: 3, text: "I ask questions before giving answers" },
  { id: 4, text: "I have honest, timely performance conversations with my team members" },
  { id: 5, text: "My team feels safe to speak up, disagree, and raise concerns with me" },
  { id: 6, text: "I successfully made the transition from individual contributor to people leader" },
  { id: 7, text: "I know how to develop the potential in each person on my team" },
  { id: 8, text: "I address difficult situations proactively before they escalate" },
  { id: 9, text: "My feedback actually changes behaviour" },
  { id: 10, text: "My team members feel genuinely developed by working with me" },
  { id: 11, text: "I retain my best people" },
  { id: 12, text: "I lead consistently — my team knows what to expect from me" },
  { id: 13, text: "I adapt my leadership style to what each person needs" },
  { id: 14, text: "Development happens naturally in my day-to-day conversations, not just in formal reviews" },
  { id: 15, text: "I feel equipped to lead effectively in an AI-driven, high-pressure environment" },
];

// Question theme labels for "lowest areas" display
export const questionThemes: Record<number, string> = {
  1: "Development-Focused One-on-Ones",
  2: "Coaching vs. Solving",
  3: "Asking Before Telling",
  4: "Performance Conversations",
  5: "Psychological Safety",
  6: "Manager Transition",
  7: "Developing Potential",
  8: "Proactive Difficult Conversations",
  9: "Behaviour-Changing Feedback",
  10: "People Feeling Developed",
  11: "Retaining Top Talent",
  12: "Leadership Consistency",
  13: "Adaptive Leadership Style",
  14: "Coaching Culture in Flow of Work",
  15: "AI-Era Leadership Readiness",
};

// Business cost per gap area
export const businessCosts: Record<number, string> = {
  1: "Managers default to status updates — development stalls and engagement drops",
  2: "Managers create dependency — teams can't solve problems without escalation",
  3: "Directive leadership kills innovation and slows decision-making across the layer",
  4: "Avoided or delayed feedback lets poor performance become normalised",
  5: "People withhold ideas and concerns — you lose intelligence from the front line",
  6: "New managers replicate what made them successful as ICs, failing their teams",
  7: "Output is managed but potential is wasted — your talent pipeline dries up",
  8: "Small issues compound into crises that cost time, money and relationships",
  9: "Feedback happens but nothing changes — effort without impact",
  10: "People leave for companies where they feel invested in",
  11: "Replacement costs average 6–9 months' salary per departure",
  12: "Performance varies wildly depending on who someone reports to",
  13: "One-size-fits-all management alienates high-performers and underserves others",
  14: "Development only happens in workshops — skills don't transfer to daily work",
  15: "Your management layer isn't equipped for the speed and complexity ahead",
};

export type LACProfile = 'operator' | 'emerging_coach' | 'ready_organisation';

export interface LACResult {
  totalScore: number;
  profile: LACProfile;
  profileName: string;
  profileDescription: string;
  lowestAreas: { questionId: number; theme: string; score: number; businessCost: string }[];
}

export function scoreLAC(answers: Record<number, number>): LACResult {
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);

  let profile: LACProfile;
  let profileName: string;
  let profileDescription: string;

  if (totalScore <= 35) {
    profile = 'operator';
    profileName = 'The Operator';
    profileDescription = "Your management layer is running on control, not coaching. Managers are solving problems, not developing people. This creates bottlenecks, disengagement, and a ceiling on growth. The gap between where you are and a high-performing coaching culture is significant — and closeable.";
  } else if (totalScore <= 55) {
    profile = 'emerging_coach';
    profileName = 'The Emerging Coach';
    profileDescription = "There's coaching happening but it's inconsistent. Some managers get it, others don't. Development is personality-dependent rather than systemic. You're leaving performance on the table because coaching capability isn't embedded across the layer.";
  } else {
    profile = 'ready_organisation';
    profileName = 'The Ready Organisation';
    profileDescription = "You have the foundation. The question isn't whether coaching matters to you — it's whether it's structured, measurable, and scalable. Without a system behind it, even strong coaching cultures plateau.";
  }

  // Find three lowest scoring areas
  const sorted = Object.entries(answers)
    .map(([qId, score]) => ({ questionId: Number(qId), score }))
    .sort((a, b) => a.score - b.score);

  const lowestAreas = sorted.slice(0, 3).map(item => ({
    questionId: item.questionId,
    theme: questionThemes[item.questionId] || `Question ${item.questionId}`,
    score: item.score,
    businessCost: businessCosts[item.questionId] || '',
  }));

  return { totalScore, profile, profileName, profileDescription, lowestAreas };
}
