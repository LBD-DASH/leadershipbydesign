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
    strengths: [
      'Strong personal discipline and follow-through',
      'Effective time and energy management',
      'Consistent delivery on commitments',
      'Systems-oriented approach to work'
    ],
    growthEdge: 'Leadership Development — moving from personal execution to enabling others to deliver.',
    recommendedPath: 'SHIFT Methodology™ + Leadership Development'
  },
  { 
    level: 'L2', 
    title: 'Leadership Development Leader',
    subtitle: 'Team Operator',
    description: 'Skilled at working through others — delegating, communicating, and building trust.',
    strengths: [
      'Effective delegation and trust-building',
      'Direct and constructive conflict resolution',
      'Adaptive communication styles',
      'Ownership of team performance'
    ],
    growthEdge: 'Personal Leadership — deepening self-awareness and leading from purpose.',
    recommendedPath: 'SHIFT Methodology™ + Personal Leadership'
  },
  { 
    level: 'L3', 
    title: 'Purpose-Led Leader',
    subtitle: 'Identity & Meaning',
    description: 'Leads from clarity about who they are and what matters. Grounded in values.',
    strengths: [
      'Clear values and purpose',
      'Regular self-reflection and growth',
      'Pressure management with alignment',
      'Deep self-awareness'
    ],
    growthEdge: 'Motivational Leadership — channelling purpose into inspiring others.',
    recommendedPath: 'SHIFT Methodology™ + Motivation Workshop'
  },
  { 
    level: 'L4', 
    title: 'Motivational Leader',
    subtitle: 'People & Energy Driver',
    description: 'Naturally energises people, drives engagement, and creates momentum.',
    strengths: [
      'Inspires action and engagement',
      'Builds emotional buy-in',
      'Drives change with optimism',
      'Develops people\'s strengths'
    ],
    growthEdge: 'Strategic Leadership — translating energy into long-term systems and direction.',
    recommendedPath: 'SHIFT Methodology™ + SHIFT Leadership Development'
  },
  { 
    level: 'L5', 
    title: 'Strategic Leader',
    subtitle: 'Vision & System Builder',
    description: 'Thinks beyond the immediate. Aligns people, culture, and strategy.',
    strengths: [
      'Long-term thinking and vision',
      'Alignment of people, culture, and strategy',
      'Change anticipation and preparation',
      'Translates vision into direction'
    ],
    growthEdge: 'Foundation Strengthening — ensuring vision is grounded in operational excellence.',
    recommendedPath: 'SHIFT Methodology™ + Executive Coaching'
  }
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
            subtitle="The Leadership Operating System"
            title="Leadership Levels (L1-L5)"
            tagline="Every leader operates at a primary level. Understanding yours is the first step to intentional growth and development."
          />

          <div className="bg-primary/5 rounded-lg p-4 text-center mb-8 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              The Leadership Levels framework identifies <span className="font-bold text-foreground">five distinct operating levels</span>, 
              each with unique strengths, growth edges, and development paths. Leaders can operate at multiple levels 
              depending on context, but typically have a <span className="font-bold text-foreground">primary level</span> that defines their default approach.
            </p>
          </div>

          <div className="space-y-4">
            {leadershipLevels.slice(0, 3).map((level) => (
              <div key={level.level} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{level.title}</h3>
                      <span className="text-xs text-primary">({level.subtitle})</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {level.strengths.map((strength) => (
                        <div key={strength} className="flex items-start gap-1">
                          <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
                          <span className="text-xs text-muted-foreground">{strength}</span>
                        </div>
                      ))}
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
            <h2 className="text-2xl font-bold text-foreground">Leadership Levels — Continued</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="space-y-4 mb-8">
            {leadershipLevels.slice(3).map((level) => (
              <div key={level.level} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{level.title}</h3>
                      <span className="text-xs text-primary">({level.subtitle})</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {level.strengths.map((strength) => (
                        <div key={strength} className="flex items-start gap-1">
                          <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
                          <span className="text-xs text-muted-foreground">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <OverviewSection title="Growth Pathways">
            <div className="space-y-2">
              {leadershipLevels.map((level) => (
                <div key={level.level} className="flex items-center gap-3 bg-primary/5 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{level.growthEdge}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-primary">{level.recommendedPath}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Discover Your Level">
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Take the free Leadership Diagnostic to discover your primary operating level 
                and receive personalised development recommendations.
              </p>
              <p className="font-medium text-foreground">
                Contact kevin@kevinbritz.com to explore leadership development for your team.
              </p>
            </div>
          </OverviewSection>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
