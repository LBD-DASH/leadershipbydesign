import { useParams, Navigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import { Loader2, ArrowLeft, Download, Printer, CheckCircle, Target, Clock, Users, BookOpen, GraduationCap } from 'lucide-react';
import { getProgrammeById } from '@/data/adminProgrammesData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ldbLogo from '@/assets/ldb-logo.png';

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

  const handlePrint = () => {
    window.print();
  };

  const hasDetailedContent = programme.lessons && programme.lessons.length > 0;

  return (
    <>
      <SEO
        title={`${programme.title} | Admin | Leadership by Design`}
        description={programme.description}
      />
      
      <div className="min-h-screen bg-background print:bg-white">
        {/* Action Bar - hidden when printing */}
        <div className="print:hidden pt-8 pb-6 bg-muted/30 border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Link to="/admin/programmes" className="text-primary hover:underline text-sm flex items-center gap-1 mb-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Programmes
                </Link>
                <h1 className="text-2xl font-bold text-foreground">{programme.title}</h1>
                <p className="text-muted-foreground">Programme Overview</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Content */}
        <div className="print:p-0">
          {/* Page 1: Cover Page */}
          <div className="print-page bg-white min-h-[11in] print:min-h-[10.5in] flex flex-col">
            {/* Header with logo */}
            <div className="p-8 print:p-6 flex justify-between items-start">
              <img src={ldbLogo} alt="Leadership by Design" className="h-12 print:h-10" />
              <Badge variant="outline" className="text-sm">
                {programme.levelBadge}
              </Badge>
            </div>

            {/* Cover Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 print:px-12 text-center">
              <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-6">
                The Total Leader®
              </p>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl print:text-5xl font-bold text-foreground mb-6 leading-tight">
                {programme.title.toUpperCase()}
              </h1>

              {programme.tagline && (
                <p className="text-xl md:text-2xl text-muted-foreground italic mb-12">
                  {programme.tagline}
                </p>
              )}

              {/* Programme Image */}
              {programme.image && (
                <div className="w-full max-w-lg mb-12">
                  <img 
                    src={programme.image} 
                    alt={programme.title}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}


              {/* Programme Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 text-center">
                <div>
                  <Clock className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">{programme.duration || 'Flexible'}</p>
                </div>
                <div>
                  <BookOpen className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="font-semibold text-foreground">{programme.lessons?.length || programme.topics.length}</p>
                </div>
                <div>
                  <GraduationCap className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-semibold text-foreground">{programme.level}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 print:p-6 text-center border-t">
              <p className="text-sm text-muted-foreground">
                Leadership Management® International | Leadership by Design
              </p>
            </div>
          </div>

          {/* Page 2: Curriculum Overview */}
          <div className="print-page bg-white p-8 md:p-12 print:p-8 min-h-[11in] print:min-h-[10.5in] page-break-before">
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{programme.title.toUpperCase()}</h2>
                <p className="text-primary italic">{programme.tagline}</p>
              </div>
              <img src={ldbLogo} alt="Leadership by Design" className="h-8" />
            </div>

            {/* Target Audience */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
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

            {/* Introduction Section */}
            {programme.introduction && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 border-primary/30 uppercase tracking-wide">
                  {programme.introduction.title}
                </h3>
                <ul className="space-y-2">
                  {programme.introduction.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-foreground">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lessons Grid - 2 column layout */}
            {hasDetailedContent && (
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {programme.lessons?.map((lesson, index) => (
                  <div key={index} className="border-l-4 border-primary/30 pl-4">
                    <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                      {lesson.title}
                    </h3>
                    <ul className="space-y-1 mb-2">
                      {lesson.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2 text-xs">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="text-muted-foreground">{topic}</span>
                        </li>
                      ))}
                    </ul>
                    {lesson.practicals && lesson.practicals.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-dashed border-muted">
                        <p className="text-xs font-semibold text-primary/80 mb-1">Practicals:</p>
                        <ul className="space-y-0.5">
                          {lesson.practicals.map((practical, pIndex) => (
                            <li key={pIndex} className="flex items-start gap-2 text-xs">
                              <span className="text-primary/60 mt-0.5">○</span>
                              <span className="text-muted-foreground/80 italic">{practical}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Fallback for workshops without detailed lessons */}
            {!hasDetailedContent && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 border-primary/30">
                    Topics Covered
                  </h3>
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
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 border-primary/30">
                    Expected Outcomes
                  </h3>
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
                </div>
              </div>
            )}

            {/* Expected Outcomes for detailed programmes */}
            {hasDetailedContent && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 border-primary/30">
                  Expected Outcomes
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {programme.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-green-500/10 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-foreground text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Programme Format */}
            {programme.format && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Programme Format</p>
                    <p className="font-medium text-foreground">{programme.format}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-8 border-t text-center text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Leadership by Design</p>
              <p>kevin@kevinbritz.com | leadershipbydesign.co</p>
              <p className="mt-2 text-xs">© {new Date().getFullYear()} Leadership by Design. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
