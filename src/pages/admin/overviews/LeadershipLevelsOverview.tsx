import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import ProgrammeOverviewTemplate, { 
  OverviewPage, 
  OverviewHeader, 
  OverviewSection, 
  OverviewFooter 
} from '@/components/admin/ProgrammeOverviewTemplate';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const leadershipLevels = [
  { 
    level: 'L1', 
    title: 'Personal Productivity Leader',
    subtitle: 'Foundation',
    description: 'Excels at managing self — time, energy, and commitments. Reliable, consistent, focused.',
    programmeTopics: [
      'Power of enthusiasm',
      'Increasing productivity',
      'Communication & Creative Listening',
      'Qualities of a successful executive'
    ],
    outcomes: [
      'Delivering results consistently',
      'Building commonality in organisation',
      'Understanding values and culture',
      'Increasing personal performance'
    ],
    growthEdge: 'Leadership Development — moving from personal execution to enabling others to deliver.',
    recommendedPath: 'Effective Personal Productivity Programme'
  },
  { 
    level: 'L2', 
    title: 'Leadership Development Leader',
    subtitle: 'Team Operator',
    description: 'Skilled at working through others — delegating, communicating, and building trust.',
    programmeTopics: [
      'Effective communication',
      'Results through time management',
      'Preventing and solving problems',
      'Art of delegation',
      'Developing people\'s potential'
    ],
    outcomes: [
      'Keys to leading a team',
      'Resolving conflict effectively',
      'Building relationships effectively',
      'Agile adaptability and change'
    ],
    growthEdge: 'Personal Leadership — deepening self-awareness and leading from purpose.',
    recommendedPath: 'Effective Leadership Development Programme'
  },
  { 
    level: 'L3', 
    title: 'Purpose-Led Leader',
    subtitle: 'Identity & Meaning',
    description: 'Leads from clarity about who they are and what matters. Grounded in values.',
    programmeTopics: [
      'Self knowledge',
      'Follow through with persistence',
      'How to plan effectively',
      'Building cognitive self-awareness'
    ],
    outcomes: [
      'Building purpose and resilience',
      'Living a balanced life',
      'Understanding importance of vision',
      'Deep self-awareness and alignment'
    ],
    growthEdge: 'Motivational Leadership — channelling purpose into inspiring others.',
    recommendedPath: 'Effective Personal Leadership Programme'
  },
  { 
    level: 'L4', 
    title: 'Motivational Leader',
    subtitle: 'People & Energy Driver',
    description: 'Naturally energises people, drives engagement, and creates momentum.',
    programmeTopics: [
      'Developing & empowering people',
      'Leading change and innovation',
      'Vision and communication',
      'Your potential for personal leadership'
    ],
    outcomes: [
      'Understanding people deeply',
      'Motivating and working across boundaries',
      'Driving motivation in action',
      'Identifying people\'s strengths and opportunities',
      'Leading global teams'
    ],
    growthEdge: 'Strategic Leadership — translating energy into long-term systems and direction.',
    recommendedPath: 'Effective Motivational Leadership Programme'
  },
  { 
    level: 'L5', 
    title: 'Strategic Leader',
    subtitle: 'Vision & System Builder',
    description: 'Thinks beyond the immediate. Aligns people, culture, and strategy.',
    programmeTopics: [
      'Power of strategic leadership',
      'Strategic purpose',
      'Strategic assessment',
      'Making strategy happen'
    ],
    outcomes: [
      'Creative vision for the organisation',
      'Developing strategy',
      'Enabling cultural, leadership, talent, and business transformation',
      'Understanding change and how to impact it',
      'Leading by example'
    ],
    growthEdge: 'Foundation Strengthening — ensuring vision is grounded in operational excellence.',
    recommendedPath: 'Effective Strategic Leadership Programme'
  }
];

const womenLeadershipTopics = [
  'Six essentials to leadership',
  'Living a balanced life',
  'Discover your purpose',
  'Art of successful communication',
  'Leader of the future'
];

const grandMastersTopics = [
  'I CAN approach',
  'How to master my time',
  'Foundational leadership',
  'Essential skills for time management and productivity',
  'Accountability for self and business'
];

export default function LeadershipLevelsOverview() {
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
        title="Leadership Levels (L1-L5) Overview | Admin | Leadership by Design"
        description="Leadership Levels framework overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="Leadership Levels (L1-L5)">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="The Leadership Pipeline"
            title="Leadership Levels (L1-L5)"
            tagline="A comprehensive framework mapping each leadership level to specific development programmes and measurable outcomes."
          />

          <div className="bg-primary/5 rounded-lg p-4 text-center mb-6 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              Accountable • Support Business • Owners • Excellence • Trust • Vulnerable • Effective
            </p>
          </div>

          <div className="space-y-4">
            {leadershipLevels.slice(0, 3).map((level) => (
              <div key={level.level} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-sm">{level.title}</h3>
                      <span className="text-xs text-primary">({level.subtitle})</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{level.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Programme Topics:</p>
                        <ul className="space-y-0.5">
                          {level.programmeTopics.slice(0, 3).map((topic) => (
                            <li key={topic} className="flex items-start gap-1">
                              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Outcomes:</p>
                        <ul className="space-y-0.5">
                          {level.outcomes.slice(0, 3).map((outcome) => (
                            <li key={outcome} className="flex items-start gap-1">
                              <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-muted">
                      <span className="text-xs text-primary font-medium">{level.recommendedPath}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <OverviewFooter />
        </OverviewPage>

        {/* Page 2 */}
        <OverviewPage>
          <div className="text-center mb-6">
            <p className="text-primary uppercase tracking-widest text-sm font-medium mb-2">Leadership by Design</p>
            <h2 className="text-2xl font-bold text-foreground">Leadership Levels — L4 & L5</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="space-y-4 mb-6">
            {leadershipLevels.slice(3).map((level) => (
              <div key={level.level} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-sm">{level.title}</h3>
                      <span className="text-xs text-primary">({level.subtitle})</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{level.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Programme Topics:</p>
                        <ul className="space-y-0.5">
                          {level.programmeTopics.map((topic) => (
                            <li key={topic} className="flex items-start gap-1">
                              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Outcomes:</p>
                        <ul className="space-y-0.5">
                          {level.outcomes.map((outcome) => (
                            <li key={outcome} className="flex items-start gap-1">
                              <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-muted">
                      <span className="text-xs text-primary font-medium">{level.recommendedPath}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <OverviewSection title="Leadership for Women">
              <ul className="space-y-1">
                {womenLeadershipTopics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </OverviewSection>

            <OverviewSection title="Grand Masters of Success">
              <ul className="space-y-1">
                {grandMastersTopics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </OverviewSection>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <p className="font-medium text-foreground mb-2">Discover Your Leadership Level</p>
            <p className="text-sm text-muted-foreground">
              Take the Leadership Diagnostic to identify your primary operating level and receive personalised development recommendations.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Contact kevin@kevinbritz.com to explore leadership development for your team.
            </p>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
