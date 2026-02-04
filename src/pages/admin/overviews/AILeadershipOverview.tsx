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
import { CheckCircle2, Loader2, Bot, Brain, Shield, Zap, Target } from 'lucide-react';

const lessons = [
  {
    title: 'Understanding AI in the Workplace',
    topics: ['AI Capabilities and Limitations', 'Human-AI Collaboration Spectrum', 'Common AI Myths vs Reality', 'Industry-Specific Applications'],
    practicals: ['AI Impact Assessment', 'Team Readiness Survey', 'AI Opportunity Mapping']
  },
  {
    title: 'The Human Edge',
    topics: ['Tasks Humans Do Better Than AI', 'Irreplaceable Human Value Areas', 'Building Competitive Advantage', 'Future-Proofing Skills'],
    practicals: ['Task Mapping Exercise', 'Human Value Analysis', 'Skills Gap Assessment']
  },
  {
    title: 'SHIFT Skills for the AI Era',
    topics: ['Self-Management: Regulating AI Anxiety', 'Human Intelligence: What AI Cannot Replicate', 'Innovation: AI as Creative Tool', 'Focus: Cutting Through AI-Generated Noise'],
    practicals: ['SHIFT Skills AI Audit', 'Personal Development Plan', 'Team Skills Assessment']
  },
  {
    title: 'Ethical AI Leadership (POPI Act)',
    topics: ['POPI Act Compliance Fundamentals', 'Recognising AI Bias and Limitations', 'Responsible AI Decision-Making', 'Building Ethical Guidelines'],
    practicals: ['Ethics Checklist', 'Policy Review Template', 'Bias Recognition Exercise']
  },
  {
    title: 'Building AI-Augmented Workflows',
    topics: ['Practical AI Tool Integration', 'Maintaining Human Oversight', 'Measuring AI Effectiveness', 'Continuous Improvement Cycles'],
    practicals: ['Workflow Mapping', 'Pilot Project Design', 'Success Metrics Template']
  },
  {
    title: 'Leading AI-Driven Change',
    topics: ['Communication Strategies for AI', 'Managing Resistance and Anxiety', 'Sustaining Human Connection', 'Building AI-Ready Culture'],
    practicals: ['Change Communication Plan', 'Resistance Management Toolkit', 'Action Board Presentation']
  }
];

const shiftSkills = [
  { letter: 'S', title: 'Self-Management', description: 'Regulating AI anxiety and maintaining confidence' },
  { letter: 'H', title: 'Human Intelligence', description: 'What AI cannot replicate - empathy, connection' },
  { letter: 'I', title: 'Innovation', description: 'Using AI as a creative and strategic tool' },
  { letter: 'F', title: 'Focus', description: 'Cutting through AI-generated noise and distraction' },
  { letter: 'T', title: 'Thinking', description: 'Critical evaluation of AI outputs and decisions' }
];

const outcomes = [
  'Accurate assessment of AI opportunities and limitations',
  'Clear strategy for human-AI collaboration',
  'Confident team leadership through AI adoption',
  'POPI Act compliant AI implementation',
  'Strengthened SHIFT skills for the AI era',
  'Sustainable human connection practices'
];

export default function AILeadershipOverview() {
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
        title="Leading in the AI Era Overview | Admin | Leadership by Design"
        description="Leading in the AI Era programme overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="Leading in the AI Era">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="AI Leadership Development"
            title="Leading in the AI Era"
            tagline="Navigate AI adoption while strengthening your human edge. Build leadership capabilities that AI cannot replicate."
          />

          <OverviewStats stats={[
            { value: '6', label: 'Week Programme' },
            { value: 'POPI', label: 'Act Compliant' },
            { value: 'SHIFT', label: 'Framework' },
            { value: 'Hybrid', label: 'Delivery' }
          ]} />

          <OverviewSection title="Your Human Edge in an AI World">
            <p className="text-muted-foreground mb-4 text-sm">
              As AI transforms the workplace, leaders need new capabilities to thrive. This programme develops 
              the SHIFT skills that AI cannot replicate, while building practical strategies for leading teams 
              through AI adoption with confidence and ethical clarity.
            </p>
          </OverviewSection>

          <OverviewSection title="SHIFT Skills for AI Leadership">
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

          <OverviewSection title="Programme Curriculum">
            <div className="grid grid-cols-2 gap-3">
              {lessons.map((lesson, index) => (
                <div key={lesson.title} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lesson.topics.slice(0, 2).join(' • ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Programme Outcomes">
            <div className="grid grid-cols-2 gap-2">
              {outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{outcome}</span>
                </div>
              ))}
            </div>
          </OverviewSection>

          <div className="bg-primary/5 rounded-lg p-4 mt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-medium text-foreground">Duration</p>
                <p className="text-sm text-muted-foreground">6 weeks</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Format</p>
                <p className="text-sm text-muted-foreground">Online LMS | Hard Copy | Coaching</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Audience</p>
                <p className="text-sm text-muted-foreground">Leaders navigating AI adoption</p>
              </div>
            </div>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
