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

const leadershipLevels = [
  { 
    level: 'L1', 
    title: 'Personal Productivity Leader',
    subtitle: 'Foundation',
    description: 'Excels at managing self — time, energy, and commitments. Reliable, consistent, focused on getting things done right.'
  },
  { 
    level: 'L2', 
    title: 'Leadership Development Leader',
    subtitle: 'Team Operator',
    description: 'Skilled at working through others — delegating, communicating, and building trust.'
  },
  { 
    level: 'L3', 
    title: 'Purpose-Led Leader',
    subtitle: 'Identity & Meaning',
    description: 'Leads from clarity about who they are and what matters. Grounded in values and self-awareness.'
  },
  { 
    level: 'L4', 
    title: 'Motivational Leader',
    subtitle: 'People & Energy Driver',
    description: 'Naturally energises people, drives engagement, and creates momentum.'
  },
  { 
    level: 'L5', 
    title: 'Strategic Leader',
    subtitle: 'Vision & System Builder',
    description: 'Thinks beyond the immediate. Aligns people, culture, and strategy for lasting impact.'
  }
];

const programmeOutcomes = [
  'Pinpoint your exact leadership operating level (94% accuracy rate)',
  'Personalised development roadmap with clear milestones',
  '35% average improvement in leadership effectiveness scores',
  '40% faster decision-making within 60 days',
  'Ongoing coaching support with measurable progress tracking'
];

const bespokeFeatures = [
  'Solutions designed for your organizational context',
  'Integration of your company values and objectives',
  'Flexible delivery: workshops, coaching, or blended',
  'Custom frameworks for your unique challenges',
  'Measurable outcomes aligned with business goals'
];

export default function ShiftLeadershipOverview() {
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
        title="SHIFT Leadership Development Overview | Admin | Leadership by Design"
        description="SHIFT Leadership Development programme overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="SHIFT Leadership Development">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="Internationally Recognised Programme"
            title="SHIFT Leadership Development"
            tagline="Elevate your leadership impact with our internationally recognised framework. Discover your operating level and design a development path tailored to your unique needs."
          />

          <OverviewStats stats={[
            { value: '94%', label: 'Diagnostic Accuracy' },
            { value: '35%', label: 'Effectiveness Improvement' },
            { value: '40%', label: 'Faster Decisions' },
            { value: '5', label: 'Leadership Levels' }
          ]} />

          <OverviewSection title="Your Leadership Operating Level">
            <p className="text-muted-foreground mb-4">
              Every leader operates at a primary level. Understanding yours is the first step to intentional growth.
            </p>
            <div className="space-y-3">
              {leadershipLevels.map((level) => (
                <div key={level.level} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm">{level.title}</p>
                      <span className="text-xs text-primary">({level.subtitle})</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewFooter />
        </OverviewPage>

        {/* Page 2 */}
        <OverviewPage>
          <div className="text-center mb-6">
            <p className="text-primary uppercase tracking-widest text-sm font-medium mb-2">Leadership by Design</p>
            <h2 className="text-2xl font-bold text-foreground">SHIFT Leadership Development — Programme Details</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <OverviewSection title="Powered by SHIFT Methodology™">
            <p className="text-muted-foreground mb-4">
              Our leadership development programmes are built on the internationally recognised SHIFT Methodology™, 
              focusing on five essential human intelligence skills that drive lasting transformation:
            </p>
            <div className="flex gap-2 mb-4">
              {['Self-Management', 'Human Intelligence', 'Innovation', 'Focus', 'Thinking'].map((skill, idx) => (
                <div key={idx} className="flex-1 bg-primary/10 rounded-lg p-2 text-center">
                  <span className="text-xs font-medium text-primary">{skill}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Programme Outcomes">
            <div className="space-y-2">
              {programmeOutcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{outcome}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Bespoke Programme Design">
            <p className="text-muted-foreground mb-4">
              Every organisation is unique. We design customized leadership development programmes 
              that align perfectly with your culture, challenges, and strategic goals.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {bespokeFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-2 bg-primary/5 rounded-lg p-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Delivery Options">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="font-bold text-foreground mb-1">For Teams</p>
                <p className="text-xs text-muted-foreground">Team-wide programmes building collective capability</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="font-bold text-foreground mb-1">For Executives</p>
                <p className="text-xs text-muted-foreground">Senior leader programmes for strategic impact</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="font-bold text-foreground mb-1">For Growth</p>
                <p className="text-xs text-muted-foreground">Scalable programmes for leadership pipelines</p>
              </div>
            </div>
          </OverviewSection>

          <OverviewSection title="Next Steps">
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Take the free Leadership Diagnostic to discover your operating level, 
                or contact us to discuss a bespoke programme for your organisation.
              </p>
              <p className="font-medium text-foreground">
                Contact kevin@kevinbritz.com to begin your leadership transformation.
              </p>
            </div>
          </OverviewSection>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
