import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import ProgrammeOverviewTemplate, { 
  OverviewPage, 
  OverviewHeader, 
  OverviewSection, 
  OverviewFooter 
} from '@/components/admin/ProgrammeOverviewTemplate';
import { CheckCircle2, Loader2, Target, Clock, Users } from 'lucide-react';

const outcomes = [
  { title: 'Clear Priorities', description: 'Shared understanding of what matters most—and what doesn\'t.' },
  { title: 'Decision Clarity', description: 'Clear criteria for making decisions so your team moves faster with confidence.' },
  { title: 'Aligned Expectations', description: 'Everyone understands what success looks like.' },
  { title: 'Reduced Meeting Chaos', description: 'Frameworks that make meetings productive rather than circular.' },
  { title: 'Proactive Execution', description: 'Shift from reactive firefighting to planned, purposeful work.' },
  { title: 'Unified Direction', description: 'Eliminate conflicting messages and give your team one clear path forward.' }
];

const steps = [
  { step: '01', title: 'Priority Mapping', description: 'Surface everyone\'s understanding of current priorities and identify where they diverge.' },
  { step: '02', title: 'Success Definition', description: 'Define what success actually looks like—in specific, measurable terms.' },
  { step: '03', title: 'Decision Framework', description: 'Establish clear criteria for making decisions, reducing the need for constant escalation.' },
  { step: '04', title: 'Communication Protocol', description: 'Create simple protocols for how priorities and changes will be communicated going forward.' }
];

export default function AlignmentWorkshopOverview() {
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
        title="Team Alignment Workshop Overview | Admin | Leadership by Design"
        description="Team Alignment Workshop overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="SHIFT Team Alignment Workshop">
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="Morning Workshop"
            title="SHIFT Team Alignment Workshop"
            tagline="For teams working hard but not in the same direction. This workshop addresses conflicting priorities, unclear success metrics, and reactive ways of working."
          />

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm">Alignment Focus</span>
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
                Your team is busy. Everyone's working hard. But somehow, outcomes remain inconsistent. 
                Different people have different ideas about what success looks like. Priorities shift 
                frequently, and meetings create more questions than answers.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                This isn't a motivation problem. It's an alignment problem. And more effort won't fix it—
                only clarity will.
              </p>
            </OverviewSection>

            <OverviewSection title="Who This Is For">
              <p className="text-sm text-muted-foreground">
                Leadership teams and cross-functional groups where effort is high but alignment is low. 
                Ideal for teams experiencing frequent priority shifts, conflicting direction from different 
                leaders, or a sense of "busy but not productive."
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
                <p className="font-bold text-foreground mb-2">Values Assessment</p>
                <p className="text-xs text-muted-foreground">
                  Every participant completes our Values Assessment revealing individual and collective values.
                </p>
              </div>
            </div>
          </OverviewSection>

          <div className="bg-primary/5 rounded-lg p-6 text-center mt-8">
            <p className="font-medium text-foreground mb-2">Ready to Align Your Team?</p>
            <p className="text-sm text-muted-foreground">
              Contact kevin@kevinbritz.com to book your SHIFT Team Alignment Workshop.
            </p>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
