import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DiagnosticResult, workshopDetails } from "@/lib/diagnosticScoring";
import WorkshopCard from "./WorkshopCard";
import ExpertContactForm from "./ExpertContactForm";
import { MessageSquare, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosticResultsProps {
  result: DiagnosticResult;
  submissionId: string | null;
}

export default function DiagnosticResults({ result, submissionId }: DiagnosticResultsProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  
  const { scores, primaryRecommendation, secondaryRecommendation } = result;
  const primaryWorkshop = workshopDetails[primaryRecommendation];
  
  const maxScore = 25;
  const workshopOrder: ('clarity' | 'motivation' | 'leadership')[] = ['clarity', 'motivation', 'leadership'];

  const handleFindOutMore = (workshopKey: 'clarity' | 'motivation' | 'leadership') => {
    // For now, open the contact form - later we can link to specific pages
    setShowContactForm(true);
  };

  return (
    <div className="space-y-12">
      {/* Results Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Your Team's Primary Need Right Now:
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          {primaryWorkshop.resultSummary}
        </p>
        {secondaryRecommendation && (
          <p className="text-sm text-muted-foreground mt-4">
            You may also benefit from addressing{' '}
            <span className="font-medium text-foreground">
              {workshopDetails[secondaryRecommendation].title.replace('The ', '').replace(' Workshop', '')}
            </span>
          </p>
        )}
      </div>

      {/* SHIFT Skills to Develop */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">SHIFT™ Skills to Develop</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Based on your results, your team would benefit from strengthening these core capabilities:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {primaryWorkshop.shiftSkills.map((item, index) => (
            <div key={index} className="bg-background rounded-xl p-4 border border-border">
              <span className="text-primary font-semibold">{item.skill}</span>
              <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link 
            to="/shift-methodology" 
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Learn more about the SHIFT Methodology™
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Score Visualization */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Your Diagnostic Scores</h3>
        </div>
        
        <div className="space-y-4">
          {workshopOrder.map((key) => {
            const score = scores[key];
            const percentage = (score / maxScore) * 100;
            const isHighest = key === primaryRecommendation;
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "font-medium",
                    isHighest ? "text-primary" : "text-foreground"
                  )}>
                    {key === 'clarity' && 'SHIFT Team Alignment'}
                    {key === 'motivation' && 'SHIFT Team Energy'}
                    {key === 'leadership' && 'SHIFT Team Ownership'}
                  </span>
                  <span className="text-muted-foreground">{score}/{maxScore}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
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
        
        <p className="text-xs text-muted-foreground mt-4">
          Higher scores indicate greater friction in that area
        </p>
      </div>

      {/* Workshop Cards */}
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground text-center mb-8">
          Choose Your Path Forward
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
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
      <div className="bg-primary/5 rounded-2xl p-8 sm:p-10 text-center border border-primary/20">
        <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-3">
          Want a Tailored Solution?
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Our experts can help you design a customized intervention based on your specific team dynamics and challenges.
        </p>
        <Button
          size="lg"
          onClick={() => setShowContactForm(true)}
          className="px-8 py-6 text-lg font-semibold rounded-full"
        >
          Speak to an Expert - Design Your Solution
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
    </div>
  );
}
