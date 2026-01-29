import { BarChart3, Target, Users, Zap, Star, Award, Sparkles, Compass, Heart, Crown } from 'lucide-react';
import leadershipL1 from '@/assets/leadership-l1-productivity.jpg';
import leadershipL2 from '@/assets/leadership-l2-development.jpg';
import leadershipL3 from '@/assets/leadership-l3-purpose.jpg';
import leadershipL4 from '@/assets/leadership-l4-motivational.jpg';
import leadershipL5 from '@/assets/leadership-l5-strategic.jpg';
import leadershipWomen from '@/assets/leadership-women.jpg';
import grandMastersTeam from '@/assets/grand-masters-team.jpg';
import workshopAlignment from '@/assets/workshop-alignment.jpg';
import workshopMotivation from '@/assets/workshop-motivation.jpg';
import workshopLeadership from '@/assets/workshop-leadership.jpg';

export interface ProgrammeData {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  levelBadge: string;
  description: string;
  icon: typeof BarChart3;
  image?: string;
  topics: string[];
  outcomes: string[];
  targetAudience: string;
  duration?: string;
  format?: string;
}

export const adminProgrammesData: ProgrammeData[] = [
  {
    id: 'l1-productivity',
    title: 'Effective Personal Productivity',
    subtitle: 'Level 1 Leadership Development',
    level: 'L1',
    levelBadge: 'Foundation',
    description: 'Building the foundation for personal effectiveness and professional growth. This programme focuses on developing core skills that enable individuals to maximise their contribution and deliver consistent results.',
    icon: Target,
    image: leadershipL1,
    topics: [
      'Power of enthusiasm',
      'Increasing productivity',
      'Communication & Creative Listening',
      'Qualities of a successful executive',
      'Goal setting and prioritisation',
      'Personal accountability'
    ],
    outcomes: [
      'Delivering results consistently',
      'Building commonality with colleagues',
      'Understanding personal and organisational values',
      'Increasing personal performance',
      'Enhanced communication skills',
      'Greater self-discipline'
    ],
    targetAudience: 'Individual contributors and emerging professionals looking to build foundational leadership skills',
    duration: '8 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching'
  },
  {
    id: 'l2-development',
    title: 'Effective Leadership Development',
    subtitle: 'Level 2 Leadership Development',
    level: 'L2',
    levelBadge: 'Supervisory',
    description: 'Transitioning from individual contributor to team leader. This programme equips supervisors and team leads with essential management skills to lead small teams effectively.',
    icon: Users,
    image: leadershipL2,
    topics: [
      'Effective communication',
      'Time management',
      'Problem-solving',
      'Art of delegation',
      'Developing potential in others',
      'Giving and receiving feedback'
    ],
    outcomes: [
      'Keys to leading a team',
      'Resolving conflict effectively',
      'Building strong relationships',
      'Agile adaptability to change',
      'Effective delegation',
      'Developing team members'
    ],
    targetAudience: 'Supervisors, team leaders, and first-time managers responsible for small teams',
    duration: '13 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching'
  },
  {
    id: 'l3-purpose',
    title: 'Effective Personal Leadership',
    subtitle: 'Level 3 Leadership Development',
    level: 'L3',
    levelBadge: 'Management',
    description: 'Leading with purpose and self-awareness. This programme develops middle managers who lead through personal example and create meaningful work environments.',
    icon: Star,
    image: leadershipL3,
    topics: [
      'Self knowledge and emotional intelligence',
      'Follow through with persistence',
      'Effective planning',
      'Cognitive self-awareness',
      'Building personal resilience',
      'Vision and purpose alignment'
    ],
    outcomes: [
      'Building purpose and resilience',
      'Living a balanced life',
      'Understanding and communicating vision',
      'Enhanced self-awareness',
      'Stronger decision-making',
      'Leading by example'
    ],
    targetAudience: 'Middle managers and department heads seeking to deepen their leadership impact',
    duration: '12 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching'
  },
  {
    id: 'l4-motivational',
    title: 'Effective Motivational Leadership',
    subtitle: 'Level 4 Leadership Development',
    level: 'L4',
    levelBadge: 'Senior Leadership',
    description: 'Inspiring and empowering others to achieve extraordinary results. This programme develops senior leaders who drive motivation and engagement across large teams and functions.',
    icon: Zap,
    image: leadershipL4,
    topics: [
      'Developing & empowering people',
      'Leading change effectively',
      'Vision and communication',
      'Personal leadership potential',
      'Cross-functional collaboration',
      'Building high-performance culture'
    ],
    outcomes: [
      'Understanding people deeply',
      'Motivating across boundaries',
      'Driving sustained motivation',
      'Leading global and diverse teams',
      'Change leadership mastery',
      'Talent development expertise'
    ],
    targetAudience: 'Senior managers, directors, and functional leaders driving large-scale initiatives',
    duration: '8 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching'
  },
  {
    id: 'l5-strategic',
    title: 'Effective Strategic Leadership',
    subtitle: 'Level 5 Leadership Development',
    level: 'L5',
    levelBadge: 'Executive',
    description: 'Shaping the future of the organisation. This programme develops executive leaders who create vision, drive strategy, and transform organisational culture.',
    icon: BarChart3,
    image: leadershipL5,
    topics: [
      'Power of strategic leadership',
      'Strategic purpose and direction',
      'Strategic assessment and analysis',
      'Making strategy happen',
      'Stakeholder management',
      'Organisational transformation'
    ],
    outcomes: [
      'Creative vision development',
      'Developing and executing strategy',
      'Cultural transformation leadership',
      'Leading by example at scale',
      'Board and stakeholder engagement',
      'Legacy building'
    ],
    targetAudience: 'Executives, C-suite leaders, and senior directors shaping organisational direction',
    duration: '4 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching'
  },
  {
    id: 'leadership-women',
    title: 'Leadership for Women',
    subtitle: 'Specialised Leadership Programme',
    level: 'Special',
    levelBadge: 'Women in Leadership',
    description: 'Empowering women to lead with authenticity and impact. This programme addresses the unique challenges and opportunities women face in leadership roles.',
    icon: Sparkles,
    image: leadershipWomen,
    topics: [
      'Six essentials to leadership',
      'Living a balanced life',
      'Discover your purpose',
      'Art of communication',
      'Leader of the future',
      'Building executive presence'
    ],
    outcomes: [
      'Building purpose and resilience',
      'Persistence in the face of challenges',
      'Understanding leadership importance',
      'Enhanced confidence and presence',
      'Strategic networking skills',
      'Work-life integration'
    ],
    targetAudience: 'Women leaders at all levels seeking to advance their careers and leadership impact',
    duration: '8 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching'
  },
  {
    id: 'grand-masters',
    title: 'Grand Masters of Success',
    subtitle: 'Foundation Programme',
    level: 'Foundation',
    levelBadge: 'Entry Level',
    description: 'The essential starting point for leadership development. This programme establishes core mindsets and habits that underpin all future leadership growth.',
    icon: Award,
    image: grandMastersTeam,
    topics: [
      'I CAN approach to challenges',
      'How to master my time',
      'Personal accountability',
      'Goal setting fundamentals',
      'Building positive habits',
      'Growth mindset development'
    ],
    outcomes: [
      'Foundational leadership mindset',
      'Essential time management skills',
      'Personal accountability culture',
      'Clear goal orientation',
      'Consistent habit formation',
      'Readiness for L1 development'
    ],
    targetAudience: 'Teams seeking foundational leadership development and individuals beginning their leadership journey',
    duration: '8 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching'
  },
  {
    id: 'workshop-alignment',
    title: 'Team Alignment Workshop',
    subtitle: 'Team Effectiveness Workshop',
    level: 'Workshop',
    levelBadge: 'Team Development',
    description: 'Diagnose hidden team dysfunction and rebuild alignment. This workshop helps teams move from confusion to clarity by establishing shared purpose, clear roles, and collaborative working agreements.',
    icon: Compass,
    image: workshopAlignment,
    topics: [
      'Team purpose and vision alignment',
      'Role clarity and accountability',
      'Communication protocols',
      'Decision-making frameworks',
      'Conflict resolution strategies',
      'Collaborative working agreements'
    ],
    outcomes: [
      'Shared understanding of team purpose',
      'Clear roles and responsibilities',
      'Improved team communication',
      'Effective decision-making processes',
      'Reduced conflict and dysfunction',
      'Stronger team cohesion'
    ],
    targetAudience: 'Teams experiencing misalignment, unclear roles, or communication breakdowns',
    duration: '1-2 days',
    format: 'In-person Workshop | Virtual Facilitation'
  },
  {
    id: 'workshop-motivation',
    title: 'Team Motivation Workshop',
    subtitle: 'Team Effectiveness Workshop',
    level: 'Workshop',
    levelBadge: 'Team Development',
    description: 'Reignite team energy and engagement. This workshop addresses the root causes of disengagement and helps teams rediscover purpose, build trust, and create shared ownership of outcomes.',
    icon: Heart,
    image: workshopMotivation,
    topics: [
      'Understanding intrinsic motivation',
      'Building psychological safety',
      'Recognition and appreciation',
      'Autonomy and empowerment',
      'Purpose-driven work',
      'Team energy management'
    ],
    outcomes: [
      'Increased team engagement',
      'Stronger sense of purpose',
      'Improved trust and safety',
      'Greater autonomy and ownership',
      'Enhanced team morale',
      'Sustainable motivation practices'
    ],
    targetAudience: 'Teams struggling with low morale, disengagement, or burnout',
    duration: '1-2 days',
    format: 'In-person Workshop | Virtual Facilitation'
  },
  {
    id: 'workshop-leadership',
    title: 'Team Leadership Workshop',
    subtitle: 'Team Effectiveness Workshop',
    level: 'Workshop',
    levelBadge: 'Team Development',
    description: 'Develop leadership capability across the team. This workshop builds shared leadership skills and helps teams take collective ownership of their performance and development.',
    icon: Crown,
    image: workshopLeadership,
    topics: [
      'Shared leadership principles',
      'Situational leadership application',
      'Coaching and feedback skills',
      'Leading through influence',
      'Team accountability structures',
      'Developing others mindset'
    ],
    outcomes: [
      'Distributed leadership capability',
      'Stronger peer coaching culture',
      'Enhanced feedback skills',
      'Greater team accountability',
      'Improved influence and collaboration',
      'Leadership pipeline development'
    ],
    targetAudience: 'Teams wanting to build leadership depth and shared accountability',
    duration: '1-2 days',
    format: 'In-person Workshop | Virtual Facilitation'
  }
];

export const getProgrammeById = (id: string): ProgrammeData | undefined => {
  return adminProgrammesData.find(p => p.id === id);
};
