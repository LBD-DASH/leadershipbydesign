import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import ProgrammeOverviewTemplate, { 
  OverviewPage, 
  OverviewHeader, 
  OverviewSection, 
  OverviewFooter 
} from '@/components/admin/ProgrammeOverviewTemplate';
import { CheckCircle2, Loader2, Target, Zap, Shield } from 'lucide-react';

const shiftSkills = [
  { 
    letter: 'S', 
    title: 'Self-Management', 
    description: 'The ability to regulate emotions, behaviour, and energy. Taking responsibility for how you show up—regardless of circumstances.'
  },
  { 
    letter: 'H', 
    title: 'Human Intelligence', 
    description: 'The ability to read, connect with, and influence others. Understanding needs, values, and what drives behaviour.'
  },
  { 
    letter: 'I', 
    title: 'Innovation', 
    description: 'The ability to think beyond the obvious. Taking initiative, questioning assumptions, and finding better ways forward.'
  },
  { 
    letter: 'F', 
    title: 'Focus', 
    description: 'The ability to prioritise what matters. Cutting through noise, aligning effort to outcomes, and staying on track under pressure.'
  },
  { 
    letter: 'T', 
    title: 'Thinking', 
    description: 'The ability to make clear, independent decisions. Understanding context, weighing options, and taking ownership of conclusions.'
  }
];

const workshops = [
  {
    title: 'SHIFT Team Alignment',
    icon: Target,
    primaryOutcome: 'Clarity, cohesion, and direction',
    skillsActivated: ['Thinking', 'Focus', 'Human Intelligence'],
    result: 'People stop working hard in different directions.'
  },
  {
    title: 'SHIFT Team Energy',
    icon: Zap,
    primaryOutcome: 'Sustainable motivation and emotional regulation',
    skillsActivated: ['Self-Management', 'Human Intelligence', 'Focus'],
    result: 'Energy moves from reactive → intentional and constructive.'
  },
  {
    title: 'SHIFT Team Ownership',
    icon: Shield,
    primaryOutcome: 'Accountability and leadership at every level',
    skillsActivated: ['Self-Management', 'Thinking', 'Innovation'],
    result: 'Leaders stop carrying people. People start carrying outcomes.'
  }
];

export default function ShiftMethodologyOverview() {
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
        title="SHIFT Methodology Overview | Admin | Leadership by Design"
        description="SHIFT Methodology programme overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="SHIFT Methodology™">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="A Human Performance System"
            title="The SHIFT Methodology™"
            tagline="SHIFT is a skill-based methodology—not a personality model, motivation framework, or leadership style. It defines the five core human capabilities required to perform, lead, and adapt in the modern workplace."
          />

          <div className="bg-primary/5 rounded-lg p-6 text-center mb-8 border border-primary/20">
            <p className="text-lg font-medium text-foreground">
              "The SHIFT Methodology™ develops the <span className="text-primary">five human skills</span> required for performance, 
              and applies them through three focused interventions: <span className="text-primary">Alignment</span>, 
              <span className="text-primary"> Energy</span>, and <span className="text-primary">Ownership</span>."
            </p>
          </div>

          <OverviewSection title="The Five SHIFT Skills">
            <div className="space-y-3">
              {shiftSkills.map((skill) => (
                <div key={skill.letter} className="flex items-start gap-3 bg-muted/30 rounded-lg p-4">
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {skill.letter}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{skill.title}</p>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
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
            <h2 className="text-2xl font-bold text-foreground">How SHIFT Powers the Workshops</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-center mb-8">
            <p className="text-sm text-muted-foreground">
              The three workshops are <strong className="text-foreground">NOT</strong> three different methodologies. 
              They are three <strong className="text-foreground">outcome-focused applications</strong> of the same SHIFT skill set.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="text-sm font-medium text-foreground">SHIFT = the skill system</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm font-medium text-foreground">Workshops = where those skills are applied</span>
            </div>
          </div>

          <div className="space-y-4">
            {workshops.map((workshop) => (
              <div key={workshop.title} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <workshop.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{workshop.title}</h3>
                    <p className="text-sm text-primary mb-2">Primary Outcome: {workshop.primaryOutcome}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {workshop.skillsActivated.map((skill) => (
                        <span key={skill} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic">{workshop.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <OverviewSection title="What SHIFT Is" className="mt-8">
            <div className="flex justify-center gap-4">
              {[
                { label: 'Capability', contrast: 'not character' },
                { label: 'Skill', contrast: 'not motivation' },
                { label: 'Responsibility', contrast: 'not compliance' }
              ].map((item) => (
                <div key={item.label} className="bg-muted/50 rounded-lg px-4 py-3 text-center">
                  <span className="font-bold text-primary">{item.label}</span>
                  <span className="text-muted-foreground text-sm">, {item.contrast}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              SHIFT answers one core question: <span className="text-primary font-medium">"Which human skills must strengthen for results to improve?"</span>
            </p>
          </OverviewSection>

          <OverviewSection title="Next Steps">
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Take the SHIFT Team Diagnostic to assess your team's skill profile, 
                or contact us to explore how SHIFT can transform your organisation.
              </p>
              <p className="font-medium text-foreground">
                Contact kevin@kevinbritz.com to schedule a consultation.
              </p>
            </div>
          </OverviewSection>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
