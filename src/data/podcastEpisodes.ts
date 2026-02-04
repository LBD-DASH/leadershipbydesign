export interface PodcastEpisode {
  id: string;
  spotifyId: string;
  title: string;
  description: string;
  fullDescription?: string;
  duration: string;
  publishedDate: string;
  guest?: string;
  guestTitle?: string;
  tags: string[];
}

export const PODCAST_SHOW_ID = "34amsn8UPkBhY0dRZYFf1u";
export const PODCAST_COVER_IMAGE = "https://i.scdn.co/image/ab67656300005f1fbd7d01ac2fb952cad2882b23";
export const SPOTIFY_SHOW_URL = `https://open.spotify.com/show/${PODCAST_SHOW_ID}`;

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "seven-workplace-trends-2026",
    spotifyId: "2kJ3G4X8vR5Y6Z7A8B9C0D", // Placeholder - update with real ID
    title: "Seven Key Workplace Trends Shaping 2026",
    description: "Join Kevin and marketing communications expert Craig Paisley as they explore seven critical workplace trends reshaping how organizations operate. From AI integration to leadership evolution, discover actionable insights for leaders navigating unprecedented change.",
    fullDescription: `In this episode, Kevin Britz sits down with Craig Paisley to unpack the seven most significant workplace trends that every leader needs to understand for 2026 and beyond.

Key Topics:
• The acceleration of AI in day-to-day operations
• Hybrid work models and their impact on leadership
• The growing importance of human skills
• Generational shifts in workplace expectations
• Purpose-driven organizational cultures
• Mental health and wellbeing as leadership priorities
• Continuous learning and adaptability

Whether you're leading a team of 5 or 500, these trends will directly impact how you lead, engage, and develop your people.`,
    duration: "38 min",
    publishedDate: "2025-01-15",
    guest: "Craig Paisley",
    guestTitle: "Marketing Communications Expert",
    tags: ["Workplace Trends", "AI", "Leadership", "Future of Work"]
  },
  {
    id: "prison-psychology-to-boardrooms",
    spotifyId: "3lM4N5O6pQ7R8S9T0U1V2W", // Placeholder - update with real ID
    title: "From Prison Psychology to Boardrooms",
    description: "Award-winning psychologist Nick Kinley reveals why power changes leaders and how to avoid the silent traps that cause most leaders to lose their effectiveness. Essential listening for any leader seeking to stay grounded and human.",
    fullDescription: `Nick Kinley, author of "The Power Trap," shares his remarkable journey from working with high-security prisoners to coaching C-suite executives—and the surprising similarities he discovered.

Key Insights:
• Why power fundamentally changes how leaders think and behave
• The three silent traps that derail even well-intentioned leaders
• How to maintain self-awareness as your influence grows
• Practical strategies for staying connected to your team
• The role of feedback in preventing leadership blindspots

This conversation challenges conventional leadership wisdom and offers a fresh perspective on what it truly means to lead with integrity.`,
    duration: "38 min",
    publishedDate: "2025-01-08",
    guest: "Nick Kinley",
    guestTitle: "Psychologist & Author of 'The Power Trap'",
    tags: ["Leadership Psychology", "Power", "Self-Awareness", "Coaching"]
  },
  {
    id: "leaders-reflecting-deeply-enough",
    spotifyId: "4mN5O6P7qR8S9T0U1V2W3X", // Placeholder - update with real ID
    title: "Are Leaders Reflecting Deeply Enough?",
    description: "Kevin explores why reflection is the most underutilized leadership practice and how building reflection habits can transform your decision-making, relationships, and overall leadership effectiveness.",
    fullDescription: `In a world of constant action and quick decisions, Kevin Britz makes the case for slowing down to speed up.

This episode covers:
• Why busy leaders often skip the most important leadership activity
• The difference between surface-level and deep reflection
• Practical frameworks for building reflection into your routine
• How reflection improves decision quality and reduces costly mistakes
• Stories of leaders who transformed their effectiveness through reflection

Learn how the best leaders use intentional pauses to drive better outcomes for themselves and their teams.`,
    duration: "29 min",
    publishedDate: "2024-12-18",
    tags: ["Reflection", "Self-Leadership", "Decision Making", "Mindfulness"]
  },
  {
    id: "employee-brand-proposition",
    spotifyId: "5nO6P7Q8rS9T0U1V2W3X4Y", // Placeholder - update with real ID
    title: "The Employee Brand Proposition",
    description: "Craig Page-Lee joins Kevin to discuss how organizations can build compelling employee value propositions that attract and retain top talent, and why leaders must champion their employer brand.",
    fullDescription: `Craig Page-Lee brings his expertise in talent strategy to explore the critical intersection of leadership and employer branding.

Discussion Points:
• What makes an employee value proposition truly compelling
• Why leaders are the primary ambassadors of employer brand
• How to align your external brand with internal employee experience
• Practical steps to audit and improve your EVP
• The role of authenticity in talent attraction and retention

Essential listening for leaders who want to win the war for talent in 2025 and beyond.`,
    duration: "32 min",
    publishedDate: "2024-12-04",
    guest: "Craig Page-Lee",
    guestTitle: "Talent Strategy Expert",
    tags: ["Employer Branding", "Talent", "Culture", "Employee Experience"]
  },
  {
    id: "strategic-ambiguity-vs-clarity",
    spotifyId: "6oP7Q8R9sT0U1V2W3X4Y5Z", // Placeholder - update with real ID
    title: "Strategic Ambiguity vs. Clarity in Leadership",
    description: "When should leaders be crystal clear, and when is strategic ambiguity the smarter choice? Kevin unpacks this nuanced leadership skill that separates good leaders from great ones.",
    fullDescription: `One of leadership's most challenging balancing acts: knowing when to provide clarity and when to leave room for interpretation.

This episode explores:
• The case for and against strategic ambiguity
• Situations where clarity is non-negotiable
• How ambiguity can empower teams and foster innovation
• The dangers of using ambiguity to avoid difficult decisions
• Practical guidelines for calibrating your communication approach

A thoughtful exploration of how great leaders use intentional communication to drive outcomes.`,
    duration: "24 min",
    publishedDate: "2024-11-20",
    tags: ["Communication", "Strategy", "Leadership Skills", "Decision Making"]
  },
  {
    id: "boss-or-leader",
    spotifyId: "7pQ8R9S0tU1V2W3X4Y5Z6A", // Placeholder - update with real ID
    title: "Are You a Boss or a Leader?",
    description: "Kevin challenges listeners to honestly assess whether they're simply managing people or truly leading them. Discover the key distinctions and how to make the shift from boss to leader.",
    fullDescription: `The difference between being a boss and being a leader is more than semantics—it's the difference between compliance and commitment.

Key Themes:
• The fundamental mindset shift from boss to leader
• How bosses and leaders approach the same situations differently
• Self-assessment questions to identify your current leadership style
• Practical steps to develop more leader-like behaviors
• Why some situations require more boss, others more leader

An honest, practical episode for anyone ready to examine their leadership approach and make meaningful changes.`,
    duration: "28 min",
    publishedDate: "2024-11-06",
    tags: ["Leadership Style", "Self-Assessment", "Management", "Growth"]
  }
];

export const getEpisodeBySlug = (slug: string): PodcastEpisode | undefined => {
  return podcastEpisodes.find(episode => episode.id === slug);
};

export const getRecentEpisodes = (count: number = 3): PodcastEpisode[] => {
  return [...podcastEpisodes]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, count);
};

export const getRelatedEpisodes = (currentSlug: string, count: number = 2): PodcastEpisode[] => {
  return podcastEpisodes
    .filter(episode => episode.id !== currentSlug)
    .slice(0, count);
};
