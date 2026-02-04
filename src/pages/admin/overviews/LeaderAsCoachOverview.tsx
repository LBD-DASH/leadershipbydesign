import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import ProgrammeOverviewTemplate, { 
  OverviewPage, 
  OverviewHeader, 
  OverviewStats, 
  OverviewSection, 
  OverviewFooter 
} from '@/components/admin/ProgrammeOverviewTemplate';
import { CheckCircle2, Loader2 } from 'lucide-react';

const months = [
  {
    month: 1,
    title: 'Leadership Foundations',
    weeks: [
      { week: 1, topic: 'Leadership vs Management - Understanding responsibilities and importance of both' },
      { week: 2, topic: 'Modern Leadership - Traditional vs modern styles and relevance today' },
      { week: 3, topic: 'Effective Communication - Empowered adult-adult conversations' },
      { week: 4, topic: 'Building Trust - Tools for trust-based relationships and accountability' }
    ]
  },
  {
    month: 2,
    title: 'Leading Through Change',
    weeks: [
      { week: 1, topic: 'Conflict Management - Managing miscommunication and non-performance' },
      { week: 2, topic: 'Leading Change - Tools to support teams through change and build resilience' },
      { week: 3, topic: 'Leading a Diverse Team - Optimising diversity for performance and innovation' },
      { week: 4, topic: 'Round Up & Success Stories - Reflection and sustaining new habits' }
    ]
  },
  {
    month: 3,
    title: 'Human Behaviour & Personal Branding',
    weeks: [
      { week: 1, topic: 'NLP for Leaders - Understanding and adapting to communication styles' },
      { week: 2, topic: 'The Art of Influence - Tools for effective persuasion and engagement' },
      { week: 3, topic: 'Personal Branding - Creating a unique identity and building credibility' },
      { week: 4, topic: 'Round Up & Success Stories - Reflection and sustaining new habits' }
    ]
  },
  {
    month: 4,
    title: 'Trust Building & Neuroscience',
    weeks: [
      { week: 1, topic: 'Fostering Psychological Safety - Creating safety as a foundation for performance' },
      { week: 2, topic: 'Neuroscience of Trust - Understanding how trust develops in the brain' },
      { week: 3, topic: 'Engaging Remote Teams - Maintaining connection across distance' },
      { week: 4, topic: 'Round Up & Success Stories - Reflection and sustaining new habits' }
    ]
  },
  {
    month: 5,
    title: 'Conflict Management & Difficult Conversations',
    weeks: [
      { week: 1, topic: 'Managing Conflict - Effective techniques for navigating disagreements' },
      { week: 2, topic: 'Giving Feedback - Constructive feedback for improvement' },
      { week: 3, topic: 'Navigating Difficult Conversations - Approaching challenging discussions' },
      { week: 4, topic: 'Round Up & Success Stories - Reflection and sustaining new habits' }
    ]
  },
  {
    month: 6,
    title: 'Wellbeing & Bias Awareness',
    weeks: [
      { week: 1, topic: 'Leading Wellbeing - Managing stress and promoting team wellbeing' },
      { week: 2, topic: 'Bias in the Workplace - Recognising and addressing unconscious bias' },
      { week: 3, topic: 'Leading with Purpose - Navigating ethical dilemmas with integrity' },
      { week: 4, topic: 'Final Celebration - Graduation and next steps' }
    ]
  }
];

const keyFeatures = [
  { title: 'Weekly Virtual Sessions', description: 'Structured learning with expert facilitation' },
  { title: 'Monthly Assessments', description: 'Track progress and reinforce learning' },
  { title: 'Peer Coaching', description: 'Practice coaching skills with cohort members' },
  { title: 'Practical Application', description: 'Apply skills immediately in the workplace' }
];

const outcomes = [
  'Develop coaching mindset and skillset',
  'Build trust-based team relationships',
  'Navigate difficult conversations with confidence',
  'Understand neuroscience of leadership',
  'Create psychologically safe environments',
  'Lead with purpose and integrity'
];

export default function LeaderAsCoachOverview() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <SEO
        title="Leader as Coach Overview | Admin | Leadership by Design"
        description="Leader as Coach programme overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="Leader as Coach">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="6-Month Coaching Development"
            title="Leader as Coach"
            tagline="Transform leaders into effective coaches who build trust, develop teams, and drive performance through coaching conversations."
          />

          <OverviewStats stats={[
            { value: '6', label: 'Month Journey' },
            { value: '24', label: 'Weekly Sessions' },
            { value: 'Weekly', label: 'Virtual Sessions' },
            { value: 'Cohort', label: 'Learning Format' }
          ]} />

          <OverviewSection title="Programme Overview">
            <p className="text-muted-foreground mb-4 text-sm">
              This flagship programme cultivates successful, continuous, and empowered leadership coaches 
              who are motivated by leadership, have an understanding of human behaviour, and are equipped 
              with effective methods to get the most out of their teams and make stronger connections as leaders.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {keyFeatures.map((feature) => (
                <div key={feature.title} className="bg-muted/30 rounded-lg p-3">
                  <p className="font-medium text-foreground text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="6-Month Curriculum Overview">
            <div className="grid grid-cols-3 gap-3">
              {months.slice(0, 3).map((month) => (
                <div key={month.month} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {month.month}
                    </div>
                    <p className="font-medium text-foreground text-sm">{month.title}</p>
                  </div>
                  <ul className="space-y-1">
                    {month.weeks.map((week) => (
                      <li key={week.week} className="text-xs text-muted-foreground">
                        W{week.week}: {week.topic.split(' - ')[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </OverviewSection>
        </OverviewPage>

        {/* Page 2 */}
        <OverviewPage>
          <div className="text-center mb-6">
            <p className="text-primary uppercase tracking-widest text-sm font-medium mb-2">Leadership by Design</p>
            <h2 className="text-2xl font-bold text-foreground">Leader as Coach - Months 4-6</h2>
            <p className="text-sm text-muted-foreground mt-2">Advanced Coaching Skills & Integration</p>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <OverviewSection title="Curriculum Months 4-6">
            <div className="grid grid-cols-3 gap-3">
              {months.slice(3).map((month) => (
                <div key={month.month} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {month.month}
                    </div>
                    <p className="font-medium text-foreground text-sm">{month.title}</p>
                  </div>
                  <ul className="space-y-1">
                    {month.weeks.map((week) => (
                      <li key={week.week} className="text-xs text-muted-foreground">
                        W{week.week}: {week.topic.split(' - ')[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Programme Outcomes">
            <div className="grid grid-cols-2 gap-2">
              {outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2 bg-muted/30 rounded-lg p-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{outcome}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Core Competencies Developed">
            <div className="grid grid-cols-4 gap-2">
              {['NLP Communication', 'Neuroscience of Trust', 'Conflict Resolution', 'Bias Awareness'].map((competency) => (
                <div key={competency} className="bg-primary/5 rounded-lg p-3 text-center">
                  <p className="text-xs font-medium text-foreground">{competency}</p>
                </div>
              ))}
            </div>
          </OverviewSection>

          <div className="bg-primary/5 rounded-lg p-4 text-center mt-6">
            <p className="font-medium text-foreground mb-2">Ready to Transform Your Leaders into Coaches?</p>
            <p className="text-sm text-muted-foreground">
              Contact kevin@kevinbritz.com to discuss cohort enrollment and customisation options.
            </p>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
