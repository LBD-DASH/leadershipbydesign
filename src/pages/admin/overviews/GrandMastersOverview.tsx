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
    title: 'The I CAN Approach',
    topics: ['Developing a Positive Mindset', 'Overcoming Self-Limiting Beliefs', 'Building Confidence Through Action', 'The Power of Positive Self-Talk'],
    practicals: ['Mindset Self-Assessment', 'Limiting Beliefs Inventory', 'Positive Affirmations Exercise']
  },
  {
    title: 'Mastering Your Time',
    topics: ['Understanding Time Value', 'Time Management Fundamentals', 'Prioritisation Techniques', 'Creating Productive Routines'],
    practicals: ['Time Audit Worksheet', 'Priority Matrix Exercise', 'Weekly Planning Template']
  },
  {
    title: 'Personal Accountability',
    topics: ['Taking Ownership of Results', 'Moving Beyond Blame', 'Creating Accountability Habits', 'Tracking Progress'],
    practicals: ['Accountability Self-Assessment', 'Responsibility Inventory', 'Accountability Action Plan']
  },
  {
    title: 'Goal Setting Fundamentals',
    topics: ['The Science of Goal Setting', 'Writing Effective Goals', 'Creating Action Plans', 'Overcoming Goal Obstacles'],
    practicals: ['Goal Setting Worksheet', 'SMART Goals Template', 'Goal Tracking System']
  },
  {
    title: 'Building Positive Habits',
    topics: ['Understanding Habit Formation', 'Replacing Negative Habits', 'Creating Success Rituals', 'Maintaining Consistency'],
    practicals: ['Habit Audit', 'Habit Change Plan', '21-Day Habit Tracker']
  },
  {
    title: 'Growth Mindset Development',
    topics: ['Fixed vs Growth Mindset', 'Embracing Challenges', 'Learning from Failure', 'The Journey to Mastery'],
    practicals: ['Growth Mindset Assessment', 'Learning Journal', 'Personal Development Plan']
  }
];

const outcomes = [
  'Foundational leadership mindset',
  'Essential time management skills',
  'Personal accountability culture',
  'Clear goal orientation',
  'Consistent habit formation',
  'Readiness for L1 development'
];

export default function GrandMastersOverview() {
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
        title="Grand Masters of Success Overview | Admin | Leadership by Design"
        description="Grand Masters of Success programme overview for client discussions"
      />
      <ProgrammeOverviewTemplate title="Grand Masters of Success">
        {/* Page 1 */}
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle="Foundation Programme"
            title="Grand Masters of Success"
            tagline="The essential starting point for leadership development. Establishing core mindsets and habits that underpin all future leadership growth."
          />

          <OverviewStats stats={[
            { value: '8', label: 'Week Programme' },
            { value: '6', label: 'Core Lessons' },
            { value: 'Entry', label: 'Level' },
            { value: 'Hybrid', label: 'Delivery' }
          ]} />

          <OverviewSection title="The Foundation for Success">
            <p className="text-muted-foreground mb-4 text-sm">
              Grand Masters of Success provides the essential building blocks for personal and professional effectiveness. 
              This programme prepares participants for the L1-L5 leadership development pathway by establishing fundamental 
              mindsets, habits, and accountability structures.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
                <p className="font-medium text-foreground text-sm">Mindset</p>
                <p className="text-xs text-muted-foreground">I CAN approach to challenges</p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
                <p className="font-medium text-foreground text-sm">Discipline</p>
                <p className="text-xs text-muted-foreground">Time mastery and habits</p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
                <p className="font-medium text-foreground text-sm">Growth</p>
                <p className="text-xs text-muted-foreground">Continuous improvement</p>
              </div>
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
                      <p className="text-xs text-muted-foreground mt-1">{lesson.topics.slice(0, 3).join(' • ')}</p>
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
                <p className="text-sm text-muted-foreground">Teams & emerging leaders</p>
              </div>
            </div>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
