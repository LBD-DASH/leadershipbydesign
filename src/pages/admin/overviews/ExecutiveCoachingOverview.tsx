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
import { CheckCircle2, Loader2, Users, Target, Brain } from 'lucide-react';

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

const coachingTypes = [
  { 
    title: 'Executive Coaching', 
    description: 'A deliberate and personalised process to develop the learning agility of the executive in order to facilitate leadership growth.',
    icon: Target
  },
  { 
    title: 'Business Coaching', 
    description: 'Supporting individuals or teams to make necessary progress in business divisions, offering tools, solutions, and models.',
    icon: Brain
  },
  { 
    title: 'Team Coaching', 
    description: 'Improving work team performance by clarifying goals, establishing common ground, and developing cohesive ways of working.',
    icon: Users
  },
  { 
    title: 'Developmental Coaching', 
    description: 'Learning about our way of thinking, feeling, and behaving, as well as the impact on our experience of the world and actions.',
    icon: Brain
  }
];

const enneagramBenefits = {
  individual: [
    'Creates meta-awareness at the level of motivation',
    'Increases consciousness and confidence',
    'Enables clearing of core emotional issues',
    'Increases compassion for self and others',
    'Uncovers pathways to development and integration'
  ],
  team: [
    'Reduces judgement and criticism while building understanding',
    'Provides framework for making sense of team conflict',
    'Re-polarises teams while dismantling traditional "fault lines"',
    'Improves working relationships and team productivity',
    'Develops new language framework for team dynamics'
  ],
  organisational: [
    'Increases productivity and motivation',
    'Creates deeper sense-making framework than trait-based approaches',
    'Builds organisational integrity',
    'Enables more impactful corporate communication',
    'Plays a role in enabling culture change'
  ]
};

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

          <OverviewSection title="Coaching Approaches">
            <div className="grid grid-cols-2 gap-3">
              {coachingTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.title} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{type.title}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </OverviewSection>

          <OverviewSection title="The SHIFT Framework">
            <p className="text-muted-foreground mb-4 text-sm">
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
            <div className="space-y-2">
              {assessments.map((assessment) => (
                <div key={assessment.title} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
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
            <h2 className="text-2xl font-bold text-foreground">Enneagram for Leadership</h2>
            <p className="text-sm text-muted-foreground mt-2">Building Better Relationships Through Deep Self-Awareness</p>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="font-bold text-foreground text-sm mb-3 text-center">Individual Benefits</h3>
              <ul className="space-y-1">
                {enneagramBenefits.individual.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-bold text-foreground text-sm mb-3 text-center">Team Benefits</h3>
              <ul className="space-y-1">
                {enneagramBenefits.team.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-bold text-foreground text-sm mb-3 text-center">Organisational Benefits</h3>
              <ul className="space-y-1">
                {enneagramBenefits.organisational.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <OverviewSection title="Key Development Areas">
            <div className="grid grid-cols-2 gap-2">
              {developmentAreas.map((area) => (
                <div key={area} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{area}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Session Structure">
            <div className="flex gap-2">
              {sessionStructure.map((item, index) => (
                <div key={item.title} className="flex-1 bg-muted/30 rounded-lg p-2 text-center">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mx-auto mb-1">
                    {index + 1}
                  </div>
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </OverviewSection>

          <div className="bg-primary/5 rounded-lg p-4 text-center mt-4">
            <p className="font-medium text-foreground mb-2">Ready to Begin?</p>
            <p className="text-sm text-muted-foreground">
              Contact kevin@kevinbritz.com to schedule an exploratory call.
            </p>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
