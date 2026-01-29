import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import ProgrammeOverviewTemplate, { 
  OverviewPage, 
  OverviewHeader, 
  OverviewSection, 
  OverviewFooter 
} from '@/components/admin/ProgrammeOverviewTemplate';
import { CheckCircle2, Loader2, Zap, Clock, Users } from 'lucide-react';

const outcomes = [
  { title: 'Re-engagement', description: 'Reconnect your team to the purpose behind the work.' },
  { title: 'Meaning & Recognition', description: 'Create systems for acknowledging contributions and celebrating progress.' },
  { title: 'Sustainable Energy', description: 'Build practices that maintain momentum without burning people out.' },
  { title: 'Emotional Investment', description: 'Shift from compliance to genuine commitment and discretionary effort.' },
  { title: 'Team Connection', description: 'Strengthen the human bonds that make teams resilient under pressure.' },
  { title: 'Morale Resilience', description: 'Build a foundation that isn\'t easily shaken by setbacks or pressure.' }
];

const steps = [
  { step: '01', title: 'Energy Audit', description: 'Identify what\'s draining your team\'s energy and what is currently energising them.' },
  { step: '02', title: 'Purpose Reconnection', description: 'Reconnect individuals and the team to the meaningful impact of their work.' },
  { step: '03', title: 'Recognition Design', description: 'Create practical, sustainable ways to acknowledge contributions that actually land.' },
  { step: '04', title: 'Sustainability Plan', description: 'Establish practices that protect energy over time, not just boost it temporarily.' }
];

export default function MotivationWorkshopOverview() {
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
        title="Team Energy Workshop Overview | Admin | Leadership by Design"
        description="Team Energy Workshop overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="SHIFT Team Energy Workshop">
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="Morning Workshop"
            title="SHIFT Team Energy Workshop"
            tagline="For teams that understand the work but lack energy and emotional commitment. This workshop addresses fatigue, compliance without commitment, and unmet human needs."
          />

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm">Energy & Motivation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">Morning Workshop</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm">All Teams</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <OverviewSection title="The Problem This Solves">
              <p className="text-sm text-muted-foreground">
                People do what's required, but rarely more. Energy in the team feels flat or forced. 
                Good work goes unnoticed. There's a pervasive sense of "why bother" when extra effort is required.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                This isn't about lazy people or poor performers. It's about disconnection—from meaning, 
                from recognition, from the reasons why the work matters.
              </p>
            </OverviewSection>

            <OverviewSection title="Who This Is For">
              <p className="text-sm text-muted-foreground">
                Teams where people know what to do but lack the emotional energy or commitment to do 
                it well. Ideal for groups experiencing fatigue, low morale, or a sense that effort 
                goes unrecognised.
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
                <p className="font-bold text-foreground mb-2">6 Human Needs Assessment</p>
                <p className="text-xs text-muted-foreground">
                  Reveals which of the six core human needs—Certainty, Variety, Significance, Connection, 
                  Growth, and Contribution—are being met or unmet for each team member.
                </p>
              </div>
            </div>
          </OverviewSection>

          <div className="bg-primary/5 rounded-lg p-6 text-center mt-8">
            <p className="font-medium text-foreground mb-2">Ready to Reignite Your Team's Energy?</p>
            <p className="text-sm text-muted-foreground">
              Contact kevin@kevinbritz.com to book your SHIFT Team Energy Workshop.
            </p>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
