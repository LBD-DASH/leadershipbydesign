import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DiagnosticResult, workshopDetails } from "@/lib/diagnosticScoring";
import WorkshopCard from "./WorkshopCard";
import ExpertContactForm from "./ExpertContactForm";
import DownloadLeadForm from "./DownloadLeadForm";
import { MessageSquare, BarChart3, Sparkles, ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosticResultsProps {
  result: DiagnosticResult;
  submissionId: string | null;
}

export default function DiagnosticResults({ result, submissionId }: DiagnosticResultsProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  
  const { scores, primaryRecommendation, secondaryRecommendation } = result;
  const primaryWorkshop = workshopDetails[primaryRecommendation];
  
  const maxScore = 25;
  const workshopOrder: ('clarity' | 'motivation' | 'leadership')[] = ['clarity', 'motivation', 'leadership'];

  const handleFindOutMore = (workshopKey: 'clarity' | 'motivation' | 'leadership') => {
    // For now, open the contact form - later we can link to specific pages
    setShowContactForm(true);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Results Header */}
      <div className="text-center max-w-3xl mx-auto px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          Your Team's Primary Need Right Now:
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          {primaryWorkshop.resultSummary}
        </p>
        {secondaryRecommendation && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-4">
            You may also benefit from addressing{' '}
            <span className="font-medium text-foreground">
              {workshopDetails[secondaryRecommendation].title.replace('The ', '').replace(' Workshop', '')}
            </span>
          </p>
        )}
      </div>

      {/* SHIFT Skills to Develop */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-primary/20">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground">SHIFT™ Skills to Develop</h3>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Based on your results, your team would benefit from strengthening these core capabilities:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {primaryWorkshop.shiftSkills.map((item, index) => (
            <div key={index} className="bg-background rounded-xl p-3 sm:p-4 border border-border">
              <span className="text-primary font-semibold text-sm sm:text-base">{item.skill}</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link 
            to="/shift-methodology" 
            className="inline-flex items-center text-xs sm:text-sm font-medium text-primary hover:underline"
          >
            Learn more about the SHIFT Methodology™
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Score Visualization */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Your Diagnostic Scores</h3>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {workshopOrder.map((key) => {
            const score = scores[key];
            const percentage = (score / maxScore) * 100;
            const isHighest = key === primaryRecommendation;
            
            return (
              <div key={key} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                  <span className={cn(
                    "font-medium",
                    isHighest ? "text-primary" : "text-foreground"
                  )}>
                    {key === 'clarity' && 'SHIFT Team Alignment'}
                    {key === 'motivation' && 'SHIFT Team Energy'}
                    {key === 'leadership' && 'SHIFT Team Ownership'}
                  </span>
                  <span className="text-muted-foreground flex-shrink-0">{score}/{maxScore}</span>
                </div>
                <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isHighest ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4">
          Higher scores indicate greater friction in that area
        </p>

        {/* Download Button */}
        <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setShowDownloadForm(true)}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Download Your Results Overview</span>
            <span className="sm:hidden">Download Results</span>
          </Button>
        </div>
      </div>

      {/* Workshop Cards */}
      <div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground text-center mb-6 sm:mb-8">
          Choose Your Path Forward
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {workshopOrder.map((key) => (
            <WorkshopCard
              key={key}
              workshopKey={key}
              title={workshopDetails[key].title}
              duration={workshopDetails[key].duration}
              summary={workshopDetails[key].summary}
              delivers={workshopDetails[key].delivers}
              includes={workshopDetails[key].includes}
              shiftSkills={workshopDetails[key].shiftSkills}
              isRecommended={key === primaryRecommendation}
              onFindOutMore={handleFindOutMore}
            />
          ))}
        </div>
      </div>

      {/* Speak to Expert CTA */}
      <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 md:p-10 text-center border border-primary/20">
        <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
          Want a Tailored Solution?
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
          Our experts can help you design a customized intervention based on your specific team dynamics and challenges.
        </p>
        <Button
          size="lg"
          onClick={() => setShowContactForm(true)}
          className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full"
        >
          <span className="hidden sm:inline">Speak to an Expert - Design Your Solution</span>
          <span className="sm:hidden">Speak to an Expert</span>
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
        This diagnostic identifies the single intervention most likely to improve performance right now. 
        It does not replace full assessments or coaching programs.
      </p>

      {/* Contact Form Modal */}
      <ExpertContactForm
        open={showContactForm}
        onOpenChange={setShowContactForm}
        submissionId={submissionId}
        primaryRecommendation={primaryRecommendation}
      />

      {/* Download Lead Form Modal */}
      <DownloadLeadForm
        open={showDownloadForm}
        onOpenChange={setShowDownloadForm}
        submissionId={submissionId}
        result={result}
      />
    </div>
  );
}
