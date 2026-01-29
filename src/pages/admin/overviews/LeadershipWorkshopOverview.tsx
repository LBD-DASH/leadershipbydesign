import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import ProgrammeOverviewTemplate, { 
  OverviewPage, 
  OverviewHeader, 
  OverviewSection, 
  OverviewFooter 
} from '@/components/admin/ProgrammeOverviewTemplate';
import { CheckCircle2, Loader2, Shield, Clock, Users } from 'lucide-react';

const outcomes = [
  { title: 'Clear Ownership', description: 'Define who owns what, so accountability is never in question.' },
  { title: 'Faster Decisions', description: 'Empower team members to make decisions at the appropriate level.' },
  { title: 'Stronger Leadership Behaviour', description: 'Build the confidence and skills to lead conversations and outcomes.' },
  { title: 'Difficult Conversations', description: 'Equip leaders to have the conversations they\'ve been avoiding.' },
  { title: 'Reduced Dependency', description: 'Free senior leaders from decisions that should be made elsewhere.' },
  { title: 'Performance Standards', description: 'Establish clear expectations and address underperformance promptly.' }
];

const steps = [
  { step: '01', title: 'Ownership Mapping', description: 'Clarify who owns what decisions and outcomes, eliminating ambiguity.' },
  { step: '02', title: 'Decision Rights', description: 'Establish clear frameworks for what decisions can be made at each level.' },
  { step: '03', title: 'Conversation Practice', description: 'Practice the difficult conversations that have been avoided, building confidence.' },
  { step: '04', title: 'Accountability Agreements', description: 'Create explicit agreements about how accountability will be maintained going forward.' }
];

export default function LeadershipWorkshopOverview() {
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
        title="Team Ownership Workshop Overview | Admin | Leadership by Design"
        description="Team Ownership Workshop overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="SHIFT Team Ownership Workshop">
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="Morning Workshop"
            title="SHIFT Team Ownership Workshop"
            tagline="For capable teams where ownership is inconsistent. This workshop addresses delayed decisions, avoided conversations, and dependency on authority."
          />

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">Accountability Focus</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">Morning Workshop</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm">Leadership Teams</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <OverviewSection title="The Problem This Solves">
              <p className="text-sm text-muted-foreground">
                Difficult conversations get avoided or postponed. Decisions that could be made within 
                the team get escalated upward. When things go wrong, accountability is unclear. 
                People wait for permission rather than taking initiative.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                This isn't about having the wrong people. It's about unclear ownership and underdeveloped 
                leadership muscles. And these can be strengthened.
              </p>
            </OverviewSection>

            <OverviewSection title="Who This Is For">
              <p className="text-sm text-muted-foreground">
                Capable teams where ownership is inconsistent and decisions get stuck. Ideal for 
                organisations where leaders avoid difficult conversations, performance issues are 
                tolerated too long, or people wait for permission rather than taking initiative.
              </p>
            </OverviewSection>
          </div>

          <OverviewSection title="What You'll Achieve">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {outcomes.map((outcome) => (
                <div key={outcome.title} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{outcome.title}</p>
                      <p className="text-xs text-muted-foreground">{outcome.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="How It Works">
            <div className="flex gap-3">
              {steps.map((step) => (
                <div key={step.step} className="flex-1 bg-muted/30 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold text-primary">{step.step}</span>
                  </div>
                  <p className="font-medium text-foreground text-sm mb-1">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="What's Included">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="font-bold text-foreground mb-2">SHIFT Methodology™</p>
                <p className="text-xs text-muted-foreground">
                  Our proprietary framework creates lasting transformation by addressing root causes, not just symptoms.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-bold text-foreground mb-2">Leadership Index</p>
                <p className="text-xs text-muted-foreground">
                  Comprehensive assessment measuring decision-making confidence, accountability ownership, 
                  difficult conversation readiness, and initiative taking.
                </p>
              </div>
            </div>
          </OverviewSection>

          <div className="bg-primary/5 rounded-lg p-6 text-center mt-8">
            <p className="font-medium text-foreground mb-2">Ready to Strengthen Team Ownership?</p>
            <p className="text-sm text-muted-foreground">
              Contact kevin@kevinbritz.com to book your SHIFT Team Ownership Workshop.
            </p>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
