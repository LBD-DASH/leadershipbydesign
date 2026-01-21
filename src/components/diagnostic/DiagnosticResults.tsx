import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DiagnosticResult, workshopDetails } from "@/lib/diagnosticScoring";
import WorkshopCard from "./WorkshopCard";
import { BarChart3, Sparkles, ArrowRight, Target, Users, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SocialShareButtons from "@/components/shared/SocialShareButtons";

interface DiagnosticResultsProps {
  result: DiagnosticResult;
  submissionId: string | null;
  userName?: string;
}

export default function DiagnosticResults({ result, submissionId, userName }: DiagnosticResultsProps) {
  const { scores, primaryRecommendation, secondaryRecommendation } = result;
  const primaryWorkshop = workshopDetails[primaryRecommendation];
  
  const maxScore = 25;
  const workshopOrder: ('clarity' | 'motivation' | 'leadership')[] = ['clarity', 'motivation', 'leadership'];

  return (
    <div className="space-y-8 sm:space-y-12 pt-8 sm:pt-12">
      {/* Behaviour-Based Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto px-4">
          These results are based on observable team dynamics, not personality profiles or opinions.
        </p>
      </motion.div>

      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center max-w-3xl mx-auto px-2"
      >
        {userName && (
          <p className="text-lg text-muted-foreground mb-2">
            Thank you, {userName}
          </p>
        )}
        
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
      </motion.div>

      {/* What This Typically Impacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-primary/5 border border-primary/10 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 text-center">
          What This Typically Impacts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Performance Consistency</p>
              <p className="text-xs text-muted-foreground">How reliably the team delivers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Team Dynamics</p>
              <p className="text-xs text-muted-foreground">Trust, collaboration, and morale</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Decision Quality</p>
              <p className="text-xs text-muted-foreground">Speed and accuracy of choices</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Momentum & Energy</p>
              <p className="text-xs text-muted-foreground">Sustained drive toward goals</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SHIFT Skills to Develop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-primary/20"
      >
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
      </motion.div>

      {/* Score Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border"
      >
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
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      isHighest ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4">
          Higher scores indicate greater friction in that area
        </p>
      </motion.div>

      {/* Workshop Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground text-center mb-6 sm:mb-8">
          Available Interventions
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
            />
          ))}
        </div>
      </motion.div>

      {/* Social Sharing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-sky-50/50 dark:bg-sky-950/30 rounded-xl p-6 border border-sky-200/50 dark:border-sky-800/50"
      >
        <SocialShareButtons
          title={`I just identified my team's primary development need: ${primaryWorkshop.title.replace('The ', '').replace(' Workshop', '')}`}
          description="Take the free Team Diagnostic to discover what's holding your team back!"
        />
      </motion.div>

      {/* Secondary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center space-y-4"
      >
        <Link to="/shift-methodology">
          <Button variant="outline" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore SHIFT Methodology™
          </Button>
        </Link>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
        This diagnostic identifies the single intervention most likely to improve performance right now. 
        It does not replace full assessments or coaching programs.
      </p>
    </div>
  );
}
