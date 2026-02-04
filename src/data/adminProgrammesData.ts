import { BarChart3, Target, Users, Zap, Star, Award, Sparkles, Compass, Heart, Crown, Bot, MessageCircle } from 'lucide-react';
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
import leaderAsCoach from '@/assets/leader-as-coach.jpg';

export interface LessonContent {
  title: string;
  topics: string[];
  practicals?: string[];
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
        ],
        practicals: [
          'Action Steps',
          'Enthusiasm Self-Assessment',
          'Daily Enthusiasm Log',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Two: Increasing Productivity',
        topics: [
          'Understanding Productivity Drivers',
          'Eliminating Productivity Barriers',
          'Building Productive Habits',
          'Measuring and Improving Output'
        ],
        practicals: [
          'Action Steps',
          'Productivity Audit',
          'Time-Energy Matrix',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Three: Communication & Creative Listening',
        topics: [
          'The Art of Effective Communication',
          'Active and Creative Listening Skills',
          'Building Rapport Through Communication',
          'Overcoming Communication Barriers'
        ],
        practicals: [
          'Action Steps',
          'Listening Skills Assessment',
          'Communication Style Inventory',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: Qualities of a Successful Executive',
        topics: [
          'Core Qualities of High Performers',
          'Developing Executive Presence',
          'Professional Excellence Standards',
          'Building Your Professional Brand'
        ],
        practicals: [
          'Action Steps',
          'Executive Qualities Self-Rating',
          'Professional Development Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Five: Goal Setting and Prioritisation',
        topics: [
          'The Science of Goal Setting',
          'Prioritisation Frameworks',
          'Aligning Goals with Values',
          'Tracking and Adjusting Goals'
        ],
        practicals: [
          'Action Steps',
          'Goal Setting Worksheet',
          'Priority Matrix Exercise',
          'Goal Tracking Template',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Six: Personal Accountability',
        topics: [
          'Taking Ownership of Results',
          'Building an Accountability Mindset',
          'Overcoming Victim Mentality',
          'Creating Accountability Systems'
        ],
        practicals: [
          'Action Steps',
          'Accountability Assessment',
          'Personal Accountability Plan',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Communication Style Assessment',
          'Message Clarity Exercise',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Two: Time Management',
        topics: [
          'Prioritising Leadership Activities',
          'Managing Multiple Demands',
          'Delegation vs. Personal Tasks',
          'Creating Time for Development'
        ],
        practicals: [
          'Action Steps',
          'Weekly Time Audit',
          'Priority Quadrant Analysis',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Three: Problem-Solving',
        topics: [
          'Structured Problem-Solving Approaches',
          'Root Cause Analysis',
          'Collaborative Solution Finding',
          'Implementing and Tracking Solutions'
        ],
        practicals: [
          'Action Steps',
          'Problem Analysis Worksheet',
          'Solution Implementation Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: The Art of Delegation',
        topics: [
          'Understanding What to Delegate',
          'Selecting the Right People',
          'Clear Delegation Communication',
          'Following Up Without Micromanaging'
        ],
        practicals: [
          'Action Steps',
          'Delegation Assessment',
          'Task-Person Match Matrix',
          'Delegation Tracking Template',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Five: Developing Potential in Others',
        topics: [
          'Identifying Team Member Potential',
          'Creating Development Opportunities',
          'Coaching for Growth',
          'Building a Development Culture'
        ],
        practicals: [
          'Action Steps',
          'Team Potential Assessment',
          'Development Planning Worksheet',
          'Coaching Conversation Guide',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Six: Giving and Receiving Feedback',
        topics: [
          'Constructive Feedback Techniques',
          'Creating a Feedback Culture',
          'Receiving Feedback Gracefully',
          'Turning Feedback into Action'
        ],
        practicals: [
          'Action Steps',
          'Feedback Style Self-Assessment',
          'Feedback Practice Scenarios',
          'Action Board Presentation',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'The Leader I Want to Be',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Emotional Intelligence Self-Evaluation',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Do You Have the Essentials for Personal Leadership?',
          'Essentials for My Success',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: Take Personal Responsibility',
        topics: [
          'Personal Responsibility Equals Freedom',
          'Personal Responsibility and Self-Motivation',
          'Recognizing Our Basic Human Needs',
          'The Disadvantages of Motivation through Fear',
          'The Limits of Motivation through Incentives',
          'The Power of Motivation through Attitude'
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'My Self-Motivation Plan',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Purpose Questionnaire',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Personal Leadership Evaluation',
          'Mid-Course Evaluation',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Developing Enthusiasm',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Eight: Act with Positive Expectancy',
        topics: [
          'Positive Expectancy Requires Belief',
          'How Positive Expectancy Works',
          'Positive Expectancy Starts with Affirmation',
          'Positive Expectancy Is Made with Visualization',
          'Developing an Attitude of Positive Expectancy',
          'How Our Attitudes and Habits Are Formed',
          'Changing Current Attitudes and Habits',
          'The Self-Fulfilling Prophecy'
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Attitudes and Statements',
          'Daily Record',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Persistence for My Success',
          'Decision Analyzer',
          'Problem Solver',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Wheel of Life',
          'Daily Time Use Analysis',
          'Weekly Time Summary',
          'My Ideal Week',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Eleven: The Art of Successful Communication',
        topics: [
          'Leaders Are Communicators',
          'The Critical Role of Empathy in Communication',
          'Learning to Listen with Empathy',
          'Developing Empathy',
          'Setting an Example by Relational Leadership',
          'Leadership through Communication'
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Attitudes for Effective Communication',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Application and Action',
          'Personal Leadership Evaluation',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
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
          'Creating Motivational Conditions',
          'The Six Human Needs Framework',
          'Motivation Assessment Tools'
        ],
        practicals: [
          'Action Steps',
          '6 Human Needs Assessment',
          'Motivation Drivers Inventory',
          'Team Motivation Analysis',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Two: Developing & Empowering People',
        topics: [
          'The Leader as Developer',
          'Creating Growth Opportunities',
          'Empowerment Strategies',
          'Building Capability and Confidence',
          'Coaching for Performance',
          'Mentoring Relationships'
        ],
        practicals: [
          'Action Steps',
          'Empowerment Assessment',
          'Development Conversation Guide',
          'Talent Development Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Three: Leading Change Effectively',
        topics: [
          'Understanding Change Dynamics',
          'Communicating Change Vision',
          'Managing Resistance to Change',
          'Sustaining Momentum Through Change',
          'The Emotional Journey of Change',
          'Building Change Resilience'
        ],
        practicals: [
          'Action Steps',
          'Change Readiness Assessment',
          'Stakeholder Impact Analysis',
          'Change Communication Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: Vision and Communication',
        topics: [
          'Creating Compelling Vision',
          'Communicating Vision Effectively',
          'Connecting Daily Work to Vision',
          'Inspiring Through Storytelling',
          'The Power of Purpose Communication',
          'Building Shared Understanding'
        ],
        practicals: [
          'Action Steps',
          'Vision Crafting Workshop',
          'Storytelling Practice',
          'Vision Communication Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Five: Recognition and Engagement',
        topics: [
          'The Science of Recognition',
          'Building Recognition Systems',
          'Personalized Appreciation Strategies',
          'Creating Engagement Rituals',
          'Measuring Engagement Impact',
          'Sustaining High Engagement'
        ],
        practicals: [
          'Action Steps',
          'Recognition Preferences Survey',
          'Engagement Action Plan',
          'Team Recognition Calendar',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Six: Cross-Functional Collaboration',
        topics: [
          'Breaking Down Silos',
          'Building Cross-Functional Relationships',
          'Collaborative Decision-Making',
          'Creating Shared Accountability',
          'Managing Competing Priorities',
          'Building Trust Across Teams'
        ],
        practicals: [
          'Action Steps',
          'Stakeholder Mapping Exercise',
          'Collaboration Assessment',
          'Cross-Functional Project Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Seven: Building High-Performance Culture',
        topics: [
          'Elements of High-Performance Culture',
          'Setting and Reinforcing Standards',
          'Recognition and Celebration',
          'Sustaining Performance Excellence',
          'Culture Shaping Behaviours',
          'Leading Cultural Change'
        ],
        practicals: [
          'Action Steps',
          'Culture Assessment Tool',
          'Performance Standards Framework',
          'Motivation Leadership Action Plan',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
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
          'Strategic Decision-Making',
          'Strategic vs Operational Thinking',
          'The Strategic Leader\'s Role'
        ],
        practicals: [
          'Action Steps',
          'Strategic Thinking Assessment',
          'Strategic Leadership Self-Evaluation',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Two: Strategic Purpose and Direction',
        topics: [
          'Creating Organisational Purpose',
          'Defining Strategic Direction',
          'Aligning Purpose with Strategy',
          'Communicating Strategic Intent',
          'Building Shared Purpose',
          'Purpose-Driven Leadership'
        ],
        practicals: [
          'Action Steps',
          'Organisational Purpose Statement',
          'Strategic Direction Framework',
          'Purpose Alignment Audit',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Three: Strategic Assessment and Analysis',
        topics: [
          'Environmental Scanning',
          'Competitive Analysis',
          'Internal Capability Assessment',
          'Identifying Strategic Opportunities',
          'SWOT and PESTLE Analysis',
          'Scenario Planning'
        ],
        practicals: [
          'Action Steps',
          'Environmental Scan Template',
          'Competitive Analysis Matrix',
          'Capability Assessment Tool',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: Making Strategy Happen',
        topics: [
          'From Strategy to Execution',
          'Building Strategic Alignment',
          'Resource Allocation',
          'Measuring Strategic Progress',
          'Cascading Strategy Through the Organisation',
          'Strategic Performance Indicators'
        ],
        practicals: [
          'Action Steps',
          'Strategy Execution Plan',
          'Strategic Alignment Audit',
          'KPI Framework Development',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Five: Stakeholder Management',
        topics: [
          'Identifying Key Stakeholders',
          'Building Stakeholder Relationships',
          'Managing Stakeholder Expectations',
          'Board and Investor Relations',
          'Executive Influence Strategies',
          'Strategic Communication'
        ],
        practicals: [
          'Action Steps',
          'Stakeholder Mapping Exercise',
          'Influence Strategy Plan',
          'Board Presentation Framework',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Six: Organisational Transformation',
        topics: [
          'Leading Large-Scale Change',
          'Cultural Transformation',
          'Building Change Capability',
          'Legacy and Succession',
          'Sustainable Transformation',
          'The Strategic Leader\'s Legacy'
        ],
        practicals: [
          'Action Steps',
          'Transformation Roadmap',
          'Culture Change Assessment',
          'Succession Planning Framework',
          'Strategic Leadership Action Plan',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
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
        ],
        practicals: [
          'Action Steps',
          'Leadership Essentials Self-Assessment',
          'Personal Leadership Inventory',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Two: Living a Balanced Life',
        topics: [
          'Work-Life Integration Strategies',
          'Managing Multiple Priorities',
          'Self-Care as Leadership',
          'Building Support Systems',
          'Energy Management for Leaders',
          'Setting Healthy Boundaries'
        ],
        practicals: [
          'Action Steps',
          'Wheel of Life Assessment',
          'Work-Life Integration Plan',
          'Support System Mapping',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Three: Discover Your Purpose',
        topics: [
          'Defining Your Leadership Purpose',
          'Aligning Values and Career',
          'Creating Impact Through Purpose',
          'Purpose-Driven Decision Making',
          'Overcoming Purpose Blockers',
          'Living Your Purpose Daily'
        ],
        practicals: [
          'Action Steps',
          'Purpose Discovery Questionnaire',
          'Values Alignment Exercise',
          'Personal Mission Statement',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: The Art of Communication',
        topics: [
          'Finding Your Authentic Voice',
          'Communicating with Confidence',
          'Navigating Difficult Conversations',
          'Building Executive Presence',
          'Influence Without Authority',
          'Strategic Visibility'
        ],
        practicals: [
          'Action Steps',
          'Communication Style Inventory',
          'Difficult Conversation Planner',
          'Visibility Strategy Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Five: Leader of the Future',
        topics: [
          'Trends Shaping Leadership',
          'Developing Future-Ready Skills',
          'Innovation and Adaptability',
          'Creating Your Leadership Legacy',
          'Building Resilience',
          'Leading Through Uncertainty'
        ],
        practicals: [
          'Action Steps',
          'Future Skills Assessment',
          'Innovation Action Plan',
          'Legacy Statement',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Six: Building Executive Presence',
        topics: [
          'Understanding Executive Presence',
          'Developing Gravitas',
          'Strategic Networking',
          'Influencing at Senior Levels',
          'Sponsorship and Mentoring',
          'Career Advancement Strategies'
        ],
        practicals: [
          'Action Steps',
          'Executive Presence Self-Rating',
          'Strategic Network Map',
          'Career Advancement Plan',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
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
          'The Power of Positive Self-Talk',
          'Attitude as a Choice',
          'The Success Mindset'
        ],
        practicals: [
          'Action Steps',
          'Mindset Self-Assessment',
          'Limiting Beliefs Inventory',
          'Positive Affirmations Exercise',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Two: Mastering Your Time',
        topics: [
          'Understanding Time Value',
          'Time Management Fundamentals',
          'Prioritisation Techniques',
          'Eliminating Time Wasters',
          'Creating Productive Routines',
          'Energy and Time Alignment'
        ],
        practicals: [
          'Action Steps',
          'Time Audit Worksheet',
          'Priority Matrix Exercise',
          'Weekly Planning Template',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Three: Personal Accountability',
        topics: [
          'Taking Ownership of Results',
          'Moving Beyond Blame',
          'Creating Accountability Habits',
          'The Freedom of Responsibility',
          'Accountability Partners',
          'Tracking and Measuring Progress'
        ],
        practicals: [
          'Action Steps',
          'Accountability Self-Assessment',
          'Responsibility Inventory',
          'Accountability Action Plan',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: Goal Setting Fundamentals',
        topics: [
          'The Science of Goal Setting',
          'Writing Effective Goals',
          'Creating Action Plans',
          'Measuring Progress',
          'Overcoming Goal Obstacles',
          'Celebrating Achievement'
        ],
        practicals: [
          'Action Steps',
          'Goal Setting Worksheet',
          'SMART Goals Template',
          'Goal Tracking System',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Five: Building Positive Habits',
        topics: [
          'Understanding Habit Formation',
          'Replacing Negative Habits',
          'Creating Success Rituals',
          'Maintaining Consistency',
          'The 21-Day Habit Challenge',
          'Building Habit Stacks'
        ],
        practicals: [
          'Action Steps',
          'Habit Audit',
          'Habit Change Plan',
          '21-Day Habit Tracker',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Six: Growth Mindset Development',
        topics: [
          'Fixed vs Growth Mindset',
          'Embracing Challenges',
          'Learning from Failure',
          'Continuous Improvement',
          'Developing Resilience',
          'The Journey to Mastery'
        ],
        practicals: [
          'Action Steps',
          'Growth Mindset Assessment',
          'Learning Journal',
          'Personal Development Plan',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
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
  },
  {
    id: 'ai-leadership',
    title: 'Leading in the AI Era',
    subtitle: 'AI Leadership Development',
    level: 'Cross-functional',
    levelBadge: 'AI Leadership',
    description: 'Navigate AI adoption while strengthening your human edge. This programme develops the leadership capabilities required to lead effectively in an AI-augmented workplace, building on SHIFT skills that AI cannot replicate.',
    tagline: 'Your Human Edge in an AI World',
    icon: Bot,
    topics: [
      'Understanding AI capabilities and limitations',
      'Identifying human vs AI-augmentable tasks',
      'Managing AI-anxious teams',
      'Ethical AI use and POPI Act compliance',
      'Building AI-augmented workflows',
      'Maintaining human connection in automated environments'
    ],
    outcomes: [
      'Accurate assessment of AI opportunities and limitations',
      'Clear strategy for human-AI collaboration',
      'Confident team leadership through AI adoption',
      'POPI Act compliant AI implementation',
      'Strengthened SHIFT skills for the AI era',
      'Sustainable human connection practices'
    ],
    targetAudience: 'Leaders at all levels navigating AI adoption and seeking to strengthen their human leadership capabilities',
    duration: '6 weeks',
    format: 'Online LMS Portal | Hard Copy | Online Coaching',
    introduction: {
      title: 'Introduction / Kickoff',
      topics: [
        'The AI Transformation Context',
        'Why Human Skills Matter More in an AI World',
        'The SHIFT Framework as Your AI Edge',
        'Setting Your AI Leadership Development Goals'
      ]
    },
    lessons: [
      {
        title: 'Lesson One: Understanding AI in the Workplace',
        topics: [
          'AI Capabilities and Current Limitations',
          'The Human-AI Collaboration Spectrum',
          'Common AI Myths vs Reality',
          'Industry-Specific AI Applications'
        ],
        practicals: [
          'Action Steps',
          'AI Impact Assessment',
          'Team Readiness Survey',
          'AI Opportunity Mapping',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Two: The Human Edge',
        topics: [
          'Tasks Humans Do Better Than AI',
          'Irreplaceable Human Value Areas',
          'Building Your Human Competitive Advantage',
          'Future-Proofing Your Team\'s Skills'
        ],
        practicals: [
          'Action Steps',
          'Task Mapping Exercise',
          'Human Value Analysis',
          'Skills Gap Assessment',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Three: SHIFT Skills for the AI Era',
        topics: [
          'Self-Management: Regulating AI Anxiety',
          'Human Intelligence: What AI Cannot Replicate',
          'Innovation: Using AI as a Creative Tool',
          'Focus: Cutting Through AI-Generated Noise',
          'Thinking: Critical Evaluation of AI Outputs'
        ],
        practicals: [
          'Action Steps',
          'SHIFT Skills AI Audit',
          'Personal Development Plan',
          'Team Skills Assessment',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Four: Ethical AI Leadership (POPI Act)',
        topics: [
          'POPI Act Compliance Fundamentals',
          'Recognising AI Bias and Limitations',
          'Responsible AI Decision-Making',
          'Building Ethical AI Guidelines'
        ],
        practicals: [
          'Action Steps',
          'Ethics Checklist',
          'Policy Review Template',
          'Bias Recognition Exercise',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Five: Building AI-Augmented Workflows',
        topics: [
          'Practical AI Tool Integration',
          'Maintaining Human Oversight',
          'Measuring AI Effectiveness',
          'Continuous Improvement Cycles'
        ],
        practicals: [
          'Action Steps',
          'Workflow Mapping',
          'Pilot Project Design',
          'Success Metrics Template',
          'Participant\'s Feedback Sheet'
        ]
      },
      {
        title: 'Lesson Six: Leading AI-Driven Change',
        topics: [
          'Communication Strategies for AI Initiatives',
          'Managing Resistance and Anxiety',
          'Sustaining Human Connection',
          'Building an AI-Ready Culture'
        ],
        practicals: [
          'Action Steps',
          'Change Communication Plan',
          'Resistance Management Toolkit',
          'Action Board Presentation',
          'Program Review',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
        ]
      }
    ]
  },
  {
    id: 'leader-as-coach',
    title: 'Leader as Coach',
    subtitle: 'Coaching Skills for Leaders',
    level: 'Coaching',
    levelBadge: 'Coaching',
    description: 'This programme cultivates successful, continuous, and empowered leadership coaches who are motivated by leadership, have an understanding of human behaviour, and are equipped with effective methods that can be implemented to get the most out of their teams and make stronger connections with them as leaders.',
    tagline: 'Transform leaders into effective coaches',
    icon: MessageCircle,
    image: leaderAsCoach,
    introduction: {
      title: 'Programme Overview',
      topics: [
        'Understanding coaching culture and its impact on business performance',
        'The role of leaders as coaches in modern organisations',
        'Building trust-based relationships for improved accountability',
        'Developing active listening skills for inclusive leadership'
      ]
    },
    lessons: [
      {
        title: 'Month 1: Leadership Foundations',
        topics: [
          'Week 1: Leadership vs Management - Understanding responsibilities and the importance of both',
          'Week 2: Modern Leadership - Traditional vs modern leadership styles and relevance today',
          'Week 3: Effective Leadership Communication - Empowered adult-adult conversations',
          'Week 4: Building Trust - Tools for trust-based relationships that improve accountability'
        ],
        practicals: [
          'Monthly Assessment',
          'Reflection Exercises',
          'Leadership Style Evaluation',
          'Trust Building Action Plan'
        ]
      },
      {
        title: 'Month 2: Leading Through Change',
        topics: [
          'Week 1: Conflict Management - Managing miscommunication and non-performance',
          'Week 2: Leading Change - Tools to support teams through change and build resilience',
          'Week 3: Leading a Diverse Team - Optimising diversity for improved performance and innovation',
          'Week 4: Round Up & Success Stories - Reflection and sustaining new habits'
        ],
        practicals: [
          'Conflict Resolution Scenarios',
          'Change Readiness Assessment',
          'Diversity Optimisation Toolkit',
          'Habit Sustainability Plan'
        ]
      },
      {
        title: 'Month 3: Human Behaviour & Personal Branding',
        topics: [
          'Week 1: Foundation of Human Behaviour - NLP Communication Model and decision-making',
          'Week 2: Presentation Skills & Storytelling - Personal branding and audience connection',
          'Week 3: Building Confidence & Resilience - Self-efficacy and empowering others',
          'Week 4: Round Up & Success Stories - Planning the way forward'
        ],
        practicals: [
          'NLP Assessment',
          'Personal Branding Workshop',
          'Confidence Building Exercises',
          'Values and Beliefs Analysis'
        ]
      },
      {
        title: 'Month 4: Mindset & Coaching Mode',
        topics: [
          'Week 1: Inward vs Outward Mindset - Transformational process and avoiding collusion',
          'Week 2: Drama Triangle - Stepping out of Victim/Rescuer/Persecutor into coaching roles',
          'Week 3: Building Confidence in Self & Cultivating Others - Self-efficacy and empowerment',
          'Week 4: Round Up & Success Stories - Sustaining new habits'
        ],
        practicals: [
          'Mindset Transformation Exercise',
          'Drama Triangle Analysis',
          'Self-Efficacy Assessment',
          'Team Empowerment Plan'
        ]
      },
      {
        title: 'Month 5: Advanced Coaching Skills',
        topics: [
          'Week 1: 10 Success-Minded Principles - Laws modelled from key performers and systems theory',
          'Week 2: Conflict to Collaboration - Thomas-Kilmann Conflict Mode Instrument (TKI)',
          'Week 3: Neuroscience in Leadership - Head, Heart & Gut Brain decision-making',
          'Week 4: Understanding Bias - Cognizance of 185+ biases and mitigation tools'
        ],
        practicals: [
          'Success Principles Application',
          'TKI Assessment',
          'Holistic Decision-Making Framework',
          'Bias Mitigation Toolkit'
        ]
      },
      {
        title: 'Month 6: Wellbeing & Leadership Integration',
        topics: [
          'Week 1: Wellbeing vs Burnout - Recognising signs and practical mitigation tools',
          'Week 2: 6 Q\'s of Leadership - SQ, EQ, purpose, values and self-regulation',
          'Week 3: Influence Pyramid - S.A.M tool for positive impact on your environment',
          'Week 4: Final Round Up & Success Stories - Planning for sustainable impact'
        ],
        practicals: [
          'Burnout Assessment',
          'Leadership Q\'s Self-Evaluation',
          'S.A.M Practical Tool',
          'Programme Graduation',
          'Final Evaluation',
          'Participant\'s Feedback Sheet'
        ]
      }
    ],
    topics: [
      'Leadership vs Management',
      'Modern Leadership & Communication',
      'Building Trust & Managing Conflict',
      'Leading Change & Diversity',
      'Human Behaviour & Personal Branding',
      'Mindset Transformation & Coaching Mode',
      'Neuroscience in Leadership',
      'Understanding & Mitigating Bias',
      'Wellbeing & Burnout Prevention',
      'Influence & Leadership Integration'
    ],
    outcomes: [
      'A coaching culture to boost company performance',
      'Leaders who serve as resources offering assistance, knowledge and guidance',
      'Improved ability to model leadership and reinforce corporate strategy',
      'Increased leadership awareness and ability to provide constructive feedback',
      'Reduced team overwhelm and enhanced job satisfaction and productivity',
      'Improved decision-making and better relationships and communication',
      'Skills development for promotion or higher-level functions',
      'Sustainable habits and continuous leadership development'
    ],
    targetAudience: 'Organisational leaders looking to develop coaching capabilities, build cohesive teams, and foster a collaborative mindset that positively impacts organisational culture',
    duration: '6 months',
    format: 'Weekly Virtual Sessions | Monthly Assessments | Session Recordings | Coach Moderation'
  }
];

export const getProgrammeById = (id: string): ProgrammeData | undefined => {
  return adminProgrammesData.find(p => p.id === id);
};
