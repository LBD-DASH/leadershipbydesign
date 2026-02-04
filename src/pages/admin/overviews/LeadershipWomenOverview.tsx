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

const lessons = [
  {
    title: 'Six Essentials to Leadership',
    topics: ['Personal Responsibility', 'Purpose Discovery', 'Leadership Planning', 'Leading with Passion', 'Positive Expectancy', 'Persistence']
  },
  {
    title: 'Living a Balanced Life',
    topics: ['Work-Life Integration', 'Managing Multiple Priorities', 'Self-Care as Leadership', 'Building Support Systems']
  },
  {
    title: 'Discover Your Purpose',
    topics: ['Defining Leadership Purpose', 'Aligning Values and Career', 'Creating Impact Through Purpose', 'Purpose-Driven Decisions']
  },
  {
    title: 'The Art of Communication',
    topics: ['Finding Your Authentic Voice', 'Communicating with Confidence', 'Navigating Difficult Conversations', 'Executive Presence']
  },
  {
    title: 'Leader of the Future',
    topics: ['Trends Shaping Leadership', 'Developing Future-Ready Skills', 'Innovation and Adaptability', 'Creating Your Legacy']
  },
  {
    title: 'Building Executive Presence',
    topics: ['Developing Gravitas', 'Strategic Networking', 'Influencing at Senior Levels', 'Career Advancement Strategies']
  }
];

const outcomes = [
  'Building purpose and resilience in challenging environments',
  'Persistence when facing workplace obstacles',
  'Enhanced confidence and executive presence',
  'Strategic networking and sponsorship skills',
  'Work-life integration strategies',
  'Career advancement with authenticity'
];

const uniqueChallenges = [
  { title: 'Imposter Syndrome', description: 'Building confidence and recognising your value' },
  { title: 'Visibility Barriers', description: 'Strategic approaches to being seen and heard' },
  { title: 'Work-Life Integration', description: 'Managing competing demands without burnout' },
  { title: 'Authentic Leadership', description: 'Leading without compromising your identity' }
];

export default function LeadershipWomenOverview() {
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
        title="Leadership for Women Overview | Admin | Leadership by Design"
        description="Leadership for Women programme overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="Leadership for Women">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="Specialised Leadership Programme"
            title="Leadership for Women"
            tagline="Empowering women to lead with authenticity and impact. Addressing the unique challenges and opportunities women face in leadership roles."
          />

          <OverviewStats stats={[
            { value: '8', label: 'Week Programme' },
            { value: '6', label: 'Core Lessons' },
            { value: 'Hybrid', label: 'Delivery Format' },
            { value: '1:1', label: 'Online Coaching' }
          ]} />

          <OverviewSection title="Addressing Unique Challenges">
            <div className="grid grid-cols-2 gap-3">
              {uniqueChallenges.map((challenge) => (
                <div key={challenge.title} className="bg-muted/30 rounded-lg p-3">
                  <p className="font-medium text-foreground text-sm">{challenge.title}</p>
                  <p className="text-xs text-muted-foreground">{challenge.description}</p>
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
                      <p className="text-xs text-muted-foreground mt-1">{lesson.topics.join(' • ')}</p>
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
                <p className="text-sm text-muted-foreground">8 weeks</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Format</p>
                <p className="text-sm text-muted-foreground">Online LMS | Hard Copy | Coaching</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Audience</p>
                <p className="text-sm text-muted-foreground">Women leaders at all levels</p>
              </div>
            </div>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
