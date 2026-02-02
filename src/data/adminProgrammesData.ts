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

export interface LessonContent {
  title: string;
  topics: string[];
}

export interface ProgrammeData {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  levelBadge: string;
  description: string;
  tagline?: string;
  icon: typeof BarChart3;
  image?: string;
  topics: string[];
  outcomes: string[];
  targetAudience: string;
  duration?: string;
  format?: string;
  authors?: string[];
  introduction?: LessonContent;
  lessons?: LessonContent[];
}

export const adminProgrammesData: ProgrammeData[] = [
  {
    id: 'l1-productivity',
    title: 'Effective Personal Productivity',
    subtitle: 'Level 1 Leadership Development',
    level: 'L1',
    levelBadge: 'Foundation',
    description: 'Building the foundation for personal effectiveness and professional growth. This programme focuses on developing core skills that enable individuals to maximise their contribution and deliver consistent results.',
    tagline: 'Maximising your personal contribution',
    icon: Target,
    image: leadershipL1,
    authors: ['Paul J. Meyer', 'Randy Slechta'],
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'The Total Leader® Concept and Personal Productivity',
        'Understanding What Personal Productivity Means',
        'How to Develop Personal Productivity',
        'Starting the Goal-Setting Process'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: The Power of Enthusiasm',
        topics: [
          'Understanding the Role of Enthusiasm',
          'How Enthusiasm Affects Performance',
          'Building and Maintaining Enthusiasm',
          'Transferring Enthusiasm to Others'
        ]
      },
      {
        title: 'Lesson Two: Increasing Productivity',
        topics: [
          'Understanding Productivity Drivers',
          'Eliminating Productivity Barriers',
          'Building Productive Habits',
          'Measuring and Improving Output'
        ]
      },
      {
        title: 'Lesson Three: Communication & Creative Listening',
        topics: [
          'The Art of Effective Communication',
          'Active and Creative Listening Skills',
          'Building Rapport Through Communication',
          'Overcoming Communication Barriers'
        ]
      },
      {
        title: 'Lesson Four: Qualities of a Successful Executive',
        topics: [
          'Core Qualities of High Performers',
          'Developing Executive Presence',
          'Professional Excellence Standards',
          'Building Your Professional Brand'
        ]
      },
      {
        title: 'Lesson Five: Goal Setting and Prioritisation',
        topics: [
          'The Science of Goal Setting',
          'Prioritisation Frameworks',
          'Aligning Goals with Values',
          'Tracking and Adjusting Goals'
        ]
      },
      {
        title: 'Lesson Six: Personal Accountability',
        topics: [
          'Taking Ownership of Results',
          'Building an Accountability Mindset',
          'Overcoming Victim Mentality',
          'Creating Accountability Systems'
        ]
      }
    ],
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
    tagline: 'Developing others to achieve results',
    icon: Users,
    image: leadershipL2,
    authors: ['Paul J. Meyer', 'Randy Slechta'],
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'The Total Leader® Concept and Leadership Development',
        'Understanding the Leadership Journey',
        'Transitioning from Contributor to Leader',
        'The Responsibilities of Leadership'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: Effective Communication',
        topics: [
          'Leadership Communication Fundamentals',
          'Clear and Compelling Messaging',
          'Communicating Vision and Expectations',
          'Two-Way Communication Practices'
        ]
      },
      {
        title: 'Lesson Two: Time Management',
        topics: [
          'Prioritising Leadership Activities',
          'Managing Multiple Demands',
          'Delegation vs. Personal Tasks',
          'Creating Time for Development'
        ]
      },
      {
        title: 'Lesson Three: Problem-Solving',
        topics: [
          'Structured Problem-Solving Approaches',
          'Root Cause Analysis',
          'Collaborative Solution Finding',
          'Implementing and Tracking Solutions'
        ]
      },
      {
        title: 'Lesson Four: The Art of Delegation',
        topics: [
          'Understanding What to Delegate',
          'Selecting the Right People',
          'Clear Delegation Communication',
          'Following Up Without Micromanaging'
        ]
      },
      {
        title: 'Lesson Five: Developing Potential in Others',
        topics: [
          'Identifying Team Member Potential',
          'Creating Development Opportunities',
          'Coaching for Growth',
          'Building a Development Culture'
        ]
      },
      {
        title: 'Lesson Six: Giving and Receiving Feedback',
        topics: [
          'Constructive Feedback Techniques',
          'Creating a Feedback Culture',
          'Receiving Feedback Gracefully',
          'Turning Feedback into Action'
        ]
      }
    ],
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
    duration: '6 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching | Workshop | Action Board Presentation'
  },
  {
    id: 'l3-purpose',
    title: 'Effective Personal Leadership',
    subtitle: 'Level 3 Leadership Development',
    level: 'L3',
    levelBadge: 'Management',
    description: 'Leading with purpose and self-awareness. This programme develops middle managers who lead through personal example and create meaningful work environments.',
    tagline: 'Releasing your untapped potential',
    icon: Star,
    image: leadershipL3,
    authors: ['Paul J. Meyer', 'Randy Slechta'],
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'The Total Leader® Concept and Personal Leadership',
        'Understanding What Personal Leadership Means',
        'Personal Leadership versus Formal Leadership',
        'How to Develop Personal Leadership',
        'Developing Personal Leadership through Goals',
        'Starting the Goal-Setting Process'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: Your Potential for Personal Leadership',
        topics: [
          'Believing in Your Full Potential',
          'Discovering Your Untapped Potential',
          'Your Opportunity for Leadership Growth',
          'Personal Leadership Requires Courage',
          'Focusing on Your Strengths',
          'The Rewards of Leadership',
          'The Internal Nature of Personal Leadership'
        ]
      },
      {
        title: 'Lesson Two: Self-Knowledge: The Source of Personal Leadership',
        topics: [
          'Self-Knowledge and Emotional Intelligence',
          'Leading with Emotional Intelligence',
          'Understanding Our Past',
          'Breaking Out of a Conditioned Existence',
          'Developing a Strong Self-Image',
          'True Leaders Are Authentic Leaders',
          'Committing to Authentic Leadership'
        ]
      },
      {
        title: 'Lesson Three: Six Essentials of Personal Leadership',
        topics: [
          'Success Essential #1: Personal Responsibility',
          'Success Essential #2: Purpose',
          'Success Essential #3: Plan',
          'Success Essential #4: Passion',
          'Success Essential #5: Positive Expectancy',
          'Success Essential #6: Persistence'
        ]
      },
      {
        title: 'Lesson Four: Take Personal Responsibility',
        topics: [
          'Personal Responsibility Equals Freedom',
          'Personal Responsibility and Self-Motivation',
          'Recognizing Our Basic Human Needs',
          'The Disadvantages of Motivation through Fear',
          'The Limits of Motivation through Incentive',
          'The Power of Motivation through Attitudes'
        ]
      },
      {
        title: 'Lesson Five: Discover Your Purpose',
        topics: [
          'Singleness of Purpose Requires Commitment',
          'Discovering Your Life Purpose',
          'Crystallizing Your Life Purpose',
          'Establishing Your Priorities',
          'Creating a Personal Mission Statement',
          'The Fundamentals of Goal Setting',
          'Avoiding Distractions on Your Path'
        ]
      },
      {
        title: 'Lesson Six: Plan Your Path',
        topics: [
          'Programming Your Goal-Setting Computer',
          'Committing to Your Goals',
          'Understanding Different Goals',
          'Tangible and Intangible Goals',
          'Obstacles to Goals Achievement',
          'The Power of Target Dates',
          'Is it Worth it to Me?'
        ]
      },
      {
        title: 'Lesson Seven: Ignite Your Passion',
        topics: [
          'Making Passion a Way of Life',
          'The Hallmarks of Genuine Passion',
          'Enthusiasm Reflects Your Passion',
          'Controlling the Emotional Climate',
          'How to Build Enthusiasm',
          'The Benefits of Enthusiasm'
        ]
      },
      {
        title: 'Lesson Eight: Act with Positive Expectancy',
        topics: [
          'Positive Expectancy Requires Belief',
          'How Positive Expectancy Works',
          'Positive Expectancy Starts with Affirmation',
          'The Power of Positive Thinking',
          'Creating a Positive Environment'
        ]
      },
      {
        title: 'Lesson Nine: Follow Through with Persistence',
        topics: [
          'Reasons Why People Quit',
          'Developing Iron-Willed Persistence',
          'Turning Adversity into Opportunity',
          'Making Good Decisions Requires Persistence',
          'Persistence Pays Off!'
        ]
      },
      {
        title: 'Lesson Ten: Living a Balanced Life',
        topics: [
          'The Total Person® and Personal Leadership',
          'Planning Your Time with Priorities in Mind',
          'Time Is Your Most Valuable Asset',
          'Taking Responsibility for the Time You Use',
          'Becoming a Total Person®'
        ]
      },
      {
        title: 'Lesson Eleven: The Art of Successful Communication',
        topics: [
          'Leaders Are Communicators',
          'The Critical Role of Empathy in Communication',
          'Learning to Listen with Empathy',
          'Developing Empathy',
          'Setting an Example by Relationship Management',
          'Leadership through Communication'
        ]
      },
      {
        title: 'Lesson Twelve: Multiplying Your Leadership',
        topics: [
          'Leaders Have Integrity and Character',
          'Leaders Are Role Models',
          'Leaders Are Developers of People',
          'Leaders Are Empowerers of People',
          'The Rewards of Empowering Others',
          'Living a Life Filled with Potential',
          'The Leadership Challenge'
        ]
      }
    ],
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
    tagline: 'Inspiring others to achieve extraordinary results',
    icon: Zap,
    image: leadershipL4,
    authors: ['Paul J. Meyer', 'Randy Slechta'],
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'The Total Leader® Concept and Motivational Leadership',
        'Understanding What Motivational Leadership Means',
        'The Science of Motivation',
        'Building Motivational Environments'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: Understanding Motivation',
        topics: [
          'The Psychology of Motivation',
          'Intrinsic vs Extrinsic Motivation',
          'Individual Motivation Drivers',
          'Creating Motivational Conditions'
        ]
      },
      {
        title: 'Lesson Two: Developing & Empowering People',
        topics: [
          'The Leader as Developer',
          'Creating Growth Opportunities',
          'Empowerment Strategies',
          'Building Capability and Confidence'
        ]
      },
      {
        title: 'Lesson Three: Leading Change Effectively',
        topics: [
          'Understanding Change Dynamics',
          'Communicating Change Vision',
          'Managing Resistance to Change',
          'Sustaining Momentum Through Change'
        ]
      },
      {
        title: 'Lesson Four: Vision and Communication',
        topics: [
          'Creating Compelling Vision',
          'Communicating Vision Effectively',
          'Connecting Daily Work to Vision',
          'Inspiring Through Storytelling'
        ]
      },
      {
        title: 'Lesson Five: Personal Leadership Potential',
        topics: [
          'Maximizing Your Leadership Impact',
          'Developing Your Leadership Brand',
          'Building Influence and Credibility',
          'Leading with Authenticity'
        ]
      },
      {
        title: 'Lesson Six: Cross-Functional Collaboration',
        topics: [
          'Breaking Down Silos',
          'Building Cross-Functional Relationships',
          'Collaborative Decision-Making',
          'Creating Shared Accountability'
        ]
      },
      {
        title: 'Lesson Seven: Building High-Performance Culture',
        topics: [
          'Elements of High-Performance Culture',
          'Setting and Reinforcing Standards',
          'Recognition and Celebration',
          'Sustaining Performance Excellence'
        ]
      }
    ],
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
    tagline: 'Shaping the future of your organisation',
    icon: BarChart3,
    image: leadershipL5,
    authors: ['Paul J. Meyer', 'Randy Slechta'],
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'The Total Leader® Concept and Strategic Leadership',
        'Understanding Strategic Leadership',
        'The Strategic Leader\'s Role',
        'Thinking Strategically'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: The Power of Strategic Leadership',
        topics: [
          'Defining Strategic Leadership',
          'The Strategic Mindset',
          'Balancing Today and Tomorrow',
          'Strategic Decision-Making'
        ]
      },
      {
        title: 'Lesson Two: Strategic Purpose and Direction',
        topics: [
          'Creating Organisational Purpose',
          'Defining Strategic Direction',
          'Aligning Purpose with Strategy',
          'Communicating Strategic Intent'
        ]
      },
      {
        title: 'Lesson Three: Strategic Assessment and Analysis',
        topics: [
          'Environmental Scanning',
          'Competitive Analysis',
          'Internal Capability Assessment',
          'Identifying Strategic Opportunities'
        ]
      },
      {
        title: 'Lesson Four: Making Strategy Happen',
        topics: [
          'From Strategy to Execution',
          'Building Strategic Alignment',
          'Resource Allocation',
          'Measuring Strategic Progress'
        ]
      },
      {
        title: 'Lesson Five: Stakeholder Management',
        topics: [
          'Identifying Key Stakeholders',
          'Building Stakeholder Relationships',
          'Managing Stakeholder Expectations',
          'Board and Investor Relations'
        ]
      },
      {
        title: 'Lesson Six: Organisational Transformation',
        topics: [
          'Leading Large-Scale Change',
          'Cultural Transformation',
          'Building Change Capability',
          'Legacy and Succession'
        ]
      }
    ],
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
    tagline: 'Leading with authenticity and impact',
    icon: Sparkles,
    image: leadershipWomen,
    authors: ['Paul J. Meyer', 'Randy Slechta'],
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'The Total Leader® Concept for Women',
        'Understanding Women in Leadership',
        'Unique Challenges and Opportunities',
        'Building Your Leadership Identity'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: Six Essentials to Leadership',
        topics: [
          'Personal Responsibility for Women Leaders',
          'Discovering Purpose as a Woman Leader',
          'Planning Your Leadership Path',
          'Leading with Passion',
          'Positive Expectancy in Challenging Environments',
          'Persistence Through Obstacles'
        ]
      },
      {
        title: 'Lesson Two: Living a Balanced Life',
        topics: [
          'Work-Life Integration Strategies',
          'Managing Multiple Priorities',
          'Self-Care as Leadership',
          'Building Support Systems'
        ]
      },
      {
        title: 'Lesson Three: Discover Your Purpose',
        topics: [
          'Defining Your Leadership Purpose',
          'Aligning Values and Career',
          'Creating Impact Through Purpose',
          'Purpose-Driven Decision Making'
        ]
      },
      {
        title: 'Lesson Four: The Art of Communication',
        topics: [
          'Finding Your Authentic Voice',
          'Communicating with Confidence',
          'Navigating Difficult Conversations',
          'Building Executive Presence'
        ]
      },
      {
        title: 'Lesson Five: Leader of the Future',
        topics: [
          'Trends Shaping Leadership',
          'Developing Future-Ready Skills',
          'Innovation and Adaptability',
          'Creating Your Leadership Legacy'
        ]
      },
      {
        title: 'Lesson Six: Building Executive Presence',
        topics: [
          'Understanding Executive Presence',
          'Developing Gravitas',
          'Strategic Networking',
          'Influencing at Senior Levels'
        ]
      }
    ],
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
    tagline: 'Building the foundation for success',
    icon: Award,
    image: grandMastersTeam,
    authors: ['Paul J. Meyer'],
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'Understanding Success Principles',
        'The Mindset of High Achievers',
        'Setting the Foundation for Growth',
        'Commitment to Personal Excellence'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: The I CAN Approach',
        topics: [
          'Developing a Positive Mindset',
          'Overcoming Self-Limiting Beliefs',
          'Building Confidence Through Action',
          'The Power of Positive Self-Talk'
        ]
      },
      {
        title: 'Lesson Two: Mastering Your Time',
        topics: [
          'Understanding Time Value',
          'Time Management Fundamentals',
          'Prioritisation Techniques',
          'Eliminating Time Wasters'
        ]
      },
      {
        title: 'Lesson Three: Personal Accountability',
        topics: [
          'Taking Ownership of Results',
          'Moving Beyond Blame',
          'Creating Accountability Habits',
          'The Freedom of Responsibility'
        ]
      },
      {
        title: 'Lesson Four: Goal Setting Fundamentals',
        topics: [
          'The Science of Goal Setting',
          'Writing Effective Goals',
          'Creating Action Plans',
          'Measuring Progress'
        ]
      },
      {
        title: 'Lesson Five: Building Positive Habits',
        topics: [
          'Understanding Habit Formation',
          'Replacing Negative Habits',
          'Creating Success Rituals',
          'Maintaining Consistency'
        ]
      },
      {
        title: 'Lesson Six: Growth Mindset Development',
        topics: [
          'Fixed vs Growth Mindset',
          'Embracing Challenges',
          'Learning from Failure',
          'Continuous Improvement'
        ]
      }
    ],
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
    tagline: 'From confusion to clarity',
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
    tagline: 'Reigniting team energy and engagement',
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
    tagline: 'Building shared leadership capability',
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
