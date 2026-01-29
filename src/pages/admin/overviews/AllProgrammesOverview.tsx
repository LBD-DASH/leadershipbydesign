import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';
import ProgrammeOverviewTemplate, {
  OverviewPage,
  OverviewHeader,
  OverviewSection,
  OverviewFooter
} from '@/components/admin/ProgrammeOverviewTemplate';
import { leadershipLevelDetails, LeadershipLevel } from '@/lib/leadershipScoring';

const levelOrder: LeadershipLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];

// Extended programme details for admin overview
const leadershipProgrammeDetails = {
  L1: {
    programmeTopics: [
      'Time blocking & energy management',
      'Priority matrix & decision frameworks',
      'Personal accountability systems',
      'Habit formation & consistency',
      'Managing workload & boundaries'
    ],
    outcomes: [
      '35% improvement in task completion',
      'Clear daily/weekly planning systems',
      'Reduced stress through better organisation',
      'Foundation for team leadership'
    ],
    duration: '2-3 days workshop',
    idealFor: 'Individual contributors moving into first leadership roles',
    investment: 'Contact for pricing'
  },
  L2: {
    programmeTopics: [
      'Delegation frameworks & trust building',
      'Effective feedback conversations',
      'Performance management cycles',
      'Conflict resolution strategies',
      'Team communication styles'
    ],
    outcomes: [
      '40% improvement in team productivity',
      'Confident delegation without micromanaging',
      'Constructive feedback culture',
      'Clear accountability structures'
    ],
    duration: '3-4 days workshop',
    idealFor: 'Team leaders, supervisors, first-time managers',
    investment: 'Contact for pricing'
  },
  L3: {
    programmeTopics: [
      'Values clarification & alignment',
      'Personal leadership purpose statement',
      'Emotional intelligence development',
      'Resilience under pressure',
      'Self-awareness & reflection practices'
    ],
    outcomes: [
      'Clear personal leadership identity',
      'Values-driven decision making',
      'Improved stress management',
      'Authentic leadership presence'
    ],
    duration: '2-3 days workshop',
    idealFor: 'Leaders seeking deeper self-awareness and purpose',
    investment: 'Contact for pricing'
  },
  L4: {
    programmeTopics: [
      'Inspiring vision communication',
      'Building emotional buy-in',
      'Change leadership & momentum',
      'Strengths-based development',
      'Creating high-energy team culture'
    ],
    outcomes: [
      '50% improvement in team engagement',
      'Increased discretionary effort',
      'Effective change leadership',
      'Sustainable team motivation'
    ],
    duration: '3-4 days workshop',
    idealFor: 'Senior managers, department heads, change leaders',
    investment: 'Contact for pricing'
  },
  L5: {
    programmeTopics: [
      'Strategic thinking & long-term planning',
      'Organisational culture design',
      'Systems thinking & alignment',
      'Future-readiness & anticipation',
      'Executive presence & influence'
    ],
    outcomes: [
      '2x strategic clarity within 90 days',
      'Aligned culture and strategy',
      'Prepared organisation for future challenges',
      'Sustainable leadership legacy'
    ],
    duration: '4-6 months programme',
    idealFor: 'Executives, C-suite leaders, business owners',
    investment: 'Contact for pricing'
  }
};

const teamWorkshopDetails = {
  alignment: {
    title: 'Team Alignment Workshop',
    subtitle: 'Clarity & Direction',
    description: 'For teams working hard but not in the same direction. This workshop creates strategic clarity and gets everyone rowing together.',
    symptoms: [
      'Team members unclear on priorities',
      'Conflicting goals across departments',
      'Decisions constantly revisited',
      'Lack of shared understanding of success'
    ],
    outcomes: [
      'Crystal-clear team purpose and direction',
      'Aligned priorities and decision criteria',
      '50% less conflict from misalignment',
      'Shared language and understanding'
    ],
    includes: [
      'Pre-workshop diagnostic assessment',
      'Full-day facilitated workshop',
      'Team purpose & values clarification',
      'Priority alignment matrix',
      'Decision framework creation',
      '30-day implementation support'
    ],
    duration: '1-2 days',
    format: 'In-person facilitated workshop',
    investment: 'Contact for pricing'
  },
  motivation: {
    title: 'Team Energy Workshop',
    subtitle: 'Energy & Engagement',
    description: 'For teams that lack energy and emotional commitment. This workshop reignites purpose-driven engagement and sustainable motivation.',
    symptoms: [
      'Low enthusiasm and engagement',
      'Minimal discretionary effort',
      'Going through the motions',
      'High turnover or absenteeism'
    ],
    outcomes: [
      'Reignited team energy and enthusiasm',
      'Clear motivational drivers for each member',
      '40% improvement in engagement scores',
      'Sustainable motivation strategies'
    ],
    includes: [
      'Individual motivation profiling',
      'Full-day facilitated workshop',
      'Strengths-based team mapping',
      'Recognition & reward framework',
      'Purpose connection exercises',
      '30-day implementation support'
    ],
    duration: '1-2 days',
    format: 'In-person facilitated workshop',
    investment: 'Contact for pricing'
  },
  leadership: {
    title: 'Team Ownership Workshop',
    subtitle: 'Accountability & Ownership',
    description: 'For capable teams where ownership is inconsistent. This workshop develops leadership at every level and creates accountability culture.',
    symptoms: [
      'Waiting for permission to act',
      'Blame culture or finger-pointing',
      'Leader dependency for decisions',
      'Inconsistent follow-through'
    ],
    outcomes: [
      'Distributed leadership across team',
      'Clear accountability structures',
      '35% faster decision-making',
      'Proactive problem-solving culture'
    ],
    includes: [
      'Team accountability assessment',
      'Full-day facilitated workshop',
      'Ownership matrix development',
      'Decision rights clarification',
      'Leadership behaviour contracts',
      '30-day implementation support'
    ],
    duration: '1-2 days',
    format: 'In-person facilitated workshop',
    investment: 'Contact for pricing'
  }
};

const executiveCoachingDetails = {
  title: 'Executive Coaching',
  subtitle: 'One-on-One Leadership Development',
  promise: 'Executives achieve 2x strategic clarity in 90 days',
  description: 'Tailored coaching for senior leaders seeking to enhance their effectiveness, navigate complex challenges, and accelerate their growth with measurable outcomes.',
  coachingTypes: [
    { name: 'Executive Coaching', description: 'For C-suite and senior executives navigating strategic complexity' },
    { name: 'Business Coaching', description: 'For business owners and entrepreneurs scaling their ventures' },
    { name: 'Team Coaching', description: 'For intact teams seeking collective development' },
    { name: 'Developmental Coaching', description: 'For high-potentials preparing for senior roles' },
    { name: 'Remedial Coaching', description: 'For leaders addressing specific performance challenges' }
  ],
  methodology: [
    'SHIFT Framework integration',
    'Enneagram personality assessment',
    'Leadership Levels diagnostic',
    '360-degree feedback (optional)',
    'Stakeholder interviews'
  ],
  outcomes: [
    '2x strategic clarity within 90 days',
    '35% faster decision-making',
    'Enhanced executive presence',
    'Clearer stakeholder relationships',
    'Sustainable leadership practices'
  ],
  structure: [
    { phase: 'Discovery', description: 'Assessments, stakeholder interviews, goal setting' },
    { phase: 'Development', description: 'Bi-weekly coaching sessions, skill building' },
    { phase: 'Integration', description: 'Application, review, sustainability planning' }
  ],
  duration: '3-6 months',
  format: 'Virtual or in-person sessions',
  investment: 'Contact for pricing'
};

export default function AllProgrammesOverview() {
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
    <ProgrammeOverviewTemplate
      title="All Programmes Overview"
      backLink="/admin/overviews"
      backLabel="Back to Programme Overviews"
    >
      {/* Page 1: Introduction & Leadership Development */}
      <OverviewPage isFirstPage>
        <OverviewHeader
          subtitle="Complete Programme Catalogue"
          title="Leadership by Design Programmes"
          tagline="Comprehensive leadership development for individuals, teams, and organisations"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary text-center">
            <p className="text-2xl font-bold text-primary">5</p>
            <p className="text-xs text-muted-foreground">Leadership Levels</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary text-center">
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-xs text-muted-foreground">Team Workshops</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary text-center">
            <p className="text-2xl font-bold text-primary">5</p>
            <p className="text-xs text-muted-foreground">Coaching Types</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary text-center">
            <p className="text-2xl font-bold text-primary">90</p>
            <p className="text-xs text-muted-foreground">Day Results Guarantee</p>
          </div>
        </div>

        <OverviewSection title="Leadership Development Programmes (L1-L5)">
          <p className="text-sm text-muted-foreground mb-4">
            The #1 Leadership System for Scaling Leaders. Our evidence-based framework develops leaders at every level with 94% accuracy rate and measurable outcomes.
          </p>
          
          <div className="space-y-4">
            {levelOrder.slice(0, 3).map((level) => {
              const details = leadershipLevelDetails[level];
              const programmeDetails = leadershipProgrammeDetails[level];
              return (
                <div key={level} className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary/50">
                  <div className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold shrink-0">
                      {level}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm">{details.title}</h4>
                      <p className="text-xs text-primary mb-1">{details.subtitle}</p>
                      <p className="text-xs text-muted-foreground mb-2">{details.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span><strong>Duration:</strong> {programmeDetails.duration}</span>
                        <span><strong>For:</strong> {programmeDetails.idealFor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </OverviewSection>

        <OverviewFooter />
      </OverviewPage>

      {/* Page 2: Leadership L4-L5 + Team Workshops */}
      <OverviewPage>
        <OverviewHeader
          title="Leadership Development (Continued)"
          tagline="Senior leadership and team effectiveness programmes"
        />

        <OverviewSection title="Leadership Levels L4-L5">
          <div className="space-y-4">
            {levelOrder.slice(3).map((level) => {
              const details = leadershipLevelDetails[level];
              const programmeDetails = leadershipProgrammeDetails[level];
              return (
                <div key={level} className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary/50">
                  <div className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold shrink-0">
                      {level}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm">{details.title}</h4>
                      <p className="text-xs text-primary mb-1">{details.subtitle}</p>
                      <p className="text-xs text-muted-foreground mb-2">{details.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div>
                          <strong className="text-foreground">Key Topics:</strong>
                          <ul className="list-disc list-inside text-muted-foreground mt-1">
                            {programmeDetails.programmeTopics.slice(0, 3).map((topic, i) => (
                              <li key={i}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong className="text-foreground">Outcomes:</strong>
                          <ul className="list-disc list-inside text-muted-foreground mt-1">
                            {programmeDetails.outcomes.slice(0, 3).map((outcome, i) => (
                              <li key={i}>{outcome}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span><strong>Duration:</strong> {programmeDetails.duration}</span>
                        <span><strong>For:</strong> {programmeDetails.idealFor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </OverviewSection>

        <OverviewSection title="Team Effectiveness Workshops">
          <p className="text-sm text-muted-foreground mb-4">
            50% less conflict • 40% better meetings • Results in 60 days
          </p>
          <div className="grid gap-4">
            {Object.entries(teamWorkshopDetails).map(([key, workshop]) => (
              <div key={key} className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground text-sm">{workshop.title}</h4>
                <p className="text-xs text-primary mb-1">{workshop.subtitle}</p>
                <p className="text-xs text-muted-foreground mb-2">{workshop.description}</p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <span><strong>Duration:</strong> {workshop.duration}</span>
                  <span><strong>Format:</strong> {workshop.format}</span>
                </div>
              </div>
            ))}
          </div>
        </OverviewSection>

        <OverviewFooter />
      </OverviewPage>

      {/* Page 3: Team Workshop Details */}
      <OverviewPage>
        <OverviewHeader
          title="Team Workshops — Detailed Breakdown"
          tagline="What each workshop addresses, includes, and delivers"
        />

        {Object.entries(teamWorkshopDetails).map(([key, workshop]) => (
          <OverviewSection key={key} title={workshop.title}>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-foreground">Symptoms Addressed:</strong>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  {workshop.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Outcomes Delivered:</strong>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  {workshop.outcomes.map((outcome, i) => (
                    <li key={i}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <strong className="text-foreground text-xs">What's Included:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {workshop.includes.map((item, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </OverviewSection>
        ))}

        <OverviewFooter />
      </OverviewPage>

      {/* Page 4: Executive Coaching */}
      <OverviewPage>
        <OverviewHeader
          subtitle={executiveCoachingDetails.promise}
          title={executiveCoachingDetails.title}
          tagline={executiveCoachingDetails.description}
        />

        <OverviewSection title="Coaching Types Available">
          <div className="grid sm:grid-cols-2 gap-3">
            {executiveCoachingDetails.coachingTypes.map((type, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-3">
                <h4 className="font-semibold text-foreground text-sm">{type.name}</h4>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </OverviewSection>

        <div className="grid md:grid-cols-2 gap-6">
          <OverviewSection title="Methodology & Assessments">
            <ul className="space-y-1">
              {executiveCoachingDetails.methodology.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </OverviewSection>

          <OverviewSection title="Expected Outcomes">
            <ul className="space-y-1">
              {executiveCoachingDetails.outcomes.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </OverviewSection>
        </div>

        <OverviewSection title="Engagement Structure">
          <div className="grid grid-cols-3 gap-4">
            {executiveCoachingDetails.structure.map((phase, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">{i + 1}</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm">{phase.phase}</h4>
                <p className="text-xs text-muted-foreground">{phase.description}</p>
              </div>
            ))}
          </div>
        </OverviewSection>

        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 mt-6">
          <h3 className="text-lg font-bold text-foreground mb-2">Ready to Transform Your Leadership?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contact us to discuss which programme is right for you or your organisation.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span><strong>Duration:</strong> {executiveCoachingDetails.duration}</span>
            <span><strong>Format:</strong> {executiveCoachingDetails.format}</span>
            <span><strong>Email:</strong> kevin@kevinbritz.com</span>
          </div>
        </div>

        <OverviewFooter />
      </OverviewPage>
    </ProgrammeOverviewTemplate>
  );
}
