import { useParams, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import { Loader2, CheckCircle, Target, Clock, Users } from 'lucide-react';
import { getProgrammeById } from '@/data/adminProgrammesData';
import ProgrammeOverviewTemplate, { 
  OverviewPage, 
  OverviewHeader, 
  OverviewSection, 
  OverviewStats, 
  OverviewFooter 
} from '@/components/admin/ProgrammeOverviewTemplate';
import { Badge } from '@/components/ui/badge';

export default function ProgrammeDetailView() {
  const { id } = useParams<{ id: string }>();
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

  const programme = id ? getProgrammeById(id) : undefined;

  if (!programme) {
    return <Navigate to="/admin/programmes" replace />;
  }

  const stats = [
    { value: programme.level, label: 'Level' },
    { value: String(programme.topics.length), label: 'Topics' },
    { value: String(programme.outcomes.length), label: 'Outcomes' },
    { value: programme.duration || 'Flexible', label: 'Duration' }
  ];

  return (
    <>
      <SEO
        title={`${programme.title} | Admin | Leadership by Design`}
        description={programme.description}
      />
      <ProgrammeOverviewTemplate 
        title={programme.title} 
        backLink="/admin/programmes"
        backLabel="Back to All Programmes"
      >
        <OverviewPage isFirstPage>
          <OverviewHeader
            subtitle={programme.subtitle}
            title={programme.title}
            tagline={programme.description}
          />

          <OverviewStats stats={stats} />

          {/* Target Audience */}
          <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Target Audience</h3>
                <p className="text-muted-foreground">{programme.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* Programme Format */}
          {programme.format && (
            <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Programme Format</h3>
                  <p className="text-muted-foreground">{programme.format}</p>
                  {programme.duration && (
                    <Badge variant="secondary" className="mt-2">{programme.duration}</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Topics Covered */}
            <OverviewSection title="Topics Covered">
              <ul className="space-y-3">
                {programme.topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-primary/10 mt-0.5">
                      <Target className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </OverviewSection>

            {/* Expected Outcomes */}
            <OverviewSection title="Expected Outcomes">
              <ul className="space-y-3">
                {programme.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500/10 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-foreground">{outcome}</span>
                  </li>
                ))}
              </ul>
            </OverviewSection>
          </div>

          <OverviewFooter />
        </OverviewPage>
      </ProgrammeOverviewTemplate>
    </>
  );
}
