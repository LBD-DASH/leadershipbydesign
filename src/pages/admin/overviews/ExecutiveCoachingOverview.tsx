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

const shiftSkills = [
  { letter: 'S', title: 'Self-Management', description: 'Emotional regulation, energy mastery, confidence under pressure' },
  { letter: 'H', title: 'Human Intelligence', description: 'Interpersonal awareness, communication, influence' },
  { letter: 'I', title: 'Innovation & Creativity', description: 'Strategic thinking, adaptive problem-solving' },
  { letter: 'F', title: 'Focused Attention', description: 'Clarity, prioritisation, goal execution' },
  { letter: 'T', title: 'Thinking Critically', description: 'Decision-making, strategic foresight' }
];

const assessments = [
  { title: '6 Human Needs Profile', description: 'Identifies core emotional needs driving leadership behaviour' },
  { title: 'Purpose & Values Mapping', description: 'Explores personal values and professional purpose' },
  { title: 'Leadership Assessment (Enneagram)', description: 'Insight into thinking patterns and stress responses' }
];

const developmentAreas = [
  'Leadership Presence & Executive Impact',
  'Strategic Communication & Storytelling',
  'Relationship & Stakeholder Leadership',
  'Decision-Making & Mental Models',
  'Boundary Management & Self-Mastery',
  'Team Dynamics & Culture Influence'
];

const sessionStructure = [
  { title: 'Insight & Awareness', description: 'Reviewing assessment insights and weekly challenges' },
  { title: 'Skill Development', description: 'Coaching on SHIFT skills' },
  { title: 'Leadership Application', description: 'Turning challenges into practical wins' },
  { title: 'Tools & Frameworks', description: 'Models you can apply immediately' },
  { title: 'Action & Accountability', description: 'Clear actions to build momentum' }
];

const outcomes = [
  '94% diagnostic accuracy in identifying leadership strengths',
  '2x increase in strategic clarity within 90 days',
  '35% improvement in team influence and engagement',
  '92% of clients report leading with calm focus under pressure',
  '40% faster decision-making on complex strategic issues'
];

export default function ExecutiveCoachingOverview() {
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
        title="Executive Coaching Overview | Admin | Leadership by Design"
        description="Executive coaching programme overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="Executive Coaching">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="Personalised Leadership Development"
            title="Executive Coaching"
            tagline="One-on-one guidance tailored for senior leaders. Refine your leadership approach, enhance decision-making, and drive organisational excellence."
          />

          <OverviewStats stats={[
            { value: '2x', label: 'Strategic Clarity in 90 Days' },
            { value: '35%', label: 'Improved Team Influence' },
            { value: '94%', label: 'Diagnostic Accuracy' },
            { value: '40%', label: 'Faster Decision-Making' }
          ]} />

          <OverviewSection title="Who This Is For">
            <p className="text-muted-foreground">
              CFOs, senior leaders, and executives seeking to elevate their leadership impact, 
              enhance strategic communication, and develop a more intentional leadership presence. 
              Ideal for leaders navigating complex stakeholder relationships, high-stakes decisions, 
              or organisational transformation.
            </p>
          </OverviewSection>

          <OverviewSection title="The SHIFT Framework">
            <p className="text-muted-foreground mb-4">
              Built on the WINGS methodology from <em>The Future of Work</em> by Kevin Britz, 
              SHIFT expands five core competencies into a practical, behaviour-based leadership system.
            </p>
            <div className="grid grid-cols-5 gap-2">
              {shiftSkills.map((skill) => (
                <div key={skill.letter} className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    {skill.letter}
                  </div>
                  <p className="text-xs font-medium text-foreground">{skill.title}</p>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Assessments & Diagnostics">
            <div className="space-y-3">
              {assessments.map((assessment) => (
                <div key={assessment.title} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{assessment.title}</p>
                    <p className="text-xs text-muted-foreground">{assessment.description}</p>
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
            <h2 className="text-2xl font-bold text-foreground">Executive Coaching — What's Included</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <OverviewSection title="Key Development Areas">
            <div className="grid grid-cols-2 gap-3">
              {developmentAreas.map((area) => (
                <div key={area} className="flex items-center gap-2 bg-muted/30 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{area}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Session Structure">
            <div className="flex gap-2">
              {sessionStructure.map((item, index) => (
                <div key={item.title} className="flex-1 bg-muted/30 rounded-lg p-3 text-center">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mx-auto mb-2">
                    {index + 1}
                  </div>
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Expected Outcomes">
            <div className="space-y-2">
              {outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-3 bg-primary/5 rounded-lg p-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{outcome}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Investment & Next Steps">
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Executive coaching engagements are tailored to your specific needs and goals. 
                Contact us to discuss your requirements and receive a customised proposal.
              </p>
              <p className="font-medium text-foreground">
                Ready to begin? Contact kevin@kevinbritz.com to schedule an exploratory call.
              </p>
            </div>
          </OverviewSection>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
