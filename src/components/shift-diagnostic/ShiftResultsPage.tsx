import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, TrendingUp, Brain, Sparkles, Zap, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShiftResult, skillDetails, getSkillTitle, getShiftInsights, getScoreInterpretation, getAIReadinessLevelInfo, aiCategoryDetails } from '@/lib/shiftScoring';
import type { AIReadinessCategory } from '@/data/aiReadinessQuestions';
import { ShiftSkill } from '@/data/shiftQuestions';
import SocialShareButtons from '@/components/shared/SocialShareButtons';
import SkillDetailCard from './SkillDetailCard';
import AIDetailCard from './AIDetailCard';
import BookingWidget from '@/components/shared/BookingWidget';

interface ShiftResultsPageProps {
  result: ShiftResult;
  submissionId: string | null;
  userName?: string;
}

export default function ShiftResultsPage({ result, submissionId, userName }: ShiftResultsPageProps) {
  const primarySkill = skillDetails[result.primaryDevelopment];
  const strengthSkill = skillDetails[result.primaryStrength];
  const insights = getShiftInsights(result);
  const aiLevelInfo = getAIReadinessLevelInfo(result.aiReadinessLevel);

  const skillOrder: ShiftSkill[] = ['S', 'H', 'I', 'F', 'T'];
  const maxScore = 20;
  const aiMaxScore = 100; // 20 questions × 5 max

  const skillColors: Record<ShiftSkill, { bg: string; text: string; badge: string; bar: string }> = {
    S: { bg: 'bg-rose-100', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-600', bar: 'bg-rose-500' },
    H: { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-600', bar: 'bg-emerald-500' },
    I: { bg: 'bg-sky-100', text: 'text-sky-600', badge: 'bg-sky-100 text-sky-600', bar: 'bg-sky-500' },
    F: { bg: 'bg-violet-100', text: 'text-violet-600', badge: 'bg-violet-100 text-violet-600', bar: 'bg-violet-500' },
    T: { bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-600', bar: 'bg-amber-500' },
  };

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

      {/* Hero Result Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center"
      >
        {userName && (
          <p className="text-lg text-muted-foreground mb-2">
            Thank you, {userName}
          </p>
        )}
        
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">Your Team's SHIFT AI-Ready Profile</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 px-2 leading-tight">
          {getSkillTitle(result.primaryStrength)} is Your Team's Strength
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
          {strengthSkill.description}
        </p>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid sm:grid-cols-2 gap-4"
      >
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">{insights[1].title}</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">{insights[1].description}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">{insights[0].title}</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{insights[0].description}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Readiness Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Readiness</h3>
              <p className={cn("text-sm font-medium", aiLevelInfo.color)}>{aiLevelInfo.title}</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-3xl font-bold text-primary">{result.aiReadinessScore}/{aiMaxScore}</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{aiLevelInfo.description}</p>
        <div className="h-3 bg-muted rounded-full overflow-hidden mt-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(result.aiReadinessScore / aiMaxScore) * 100}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              result.aiReadinessLevel === 'strong' ? "bg-green-500" :
              result.aiReadinessLevel === 'developing' ? "bg-blue-500" : "bg-amber-400"
            )}
          />
        </div>

        {/* AI Category Breakdown */}
        <div className="mt-6 pt-6 border-t border-primary/10">
          <h4 className="text-sm font-semibold text-foreground mb-4">Category Breakdown</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(Object.keys(result.aiCategoryScores) as AIReadinessCategory[]).map((cat) => {
              const detail = aiCategoryDetails[cat];
              const score = result.aiCategoryScores[cat];
              const maxCatScore = 20; // 4 questions × 5 max
              const pct = (score / maxCatScore) * 100;
              return (
                <div key={cat} className="bg-background/60 rounded-xl p-3 border border-border/50">
                  <div className="text-lg mb-1">{detail.icon}</div>
                  <p className="text-xs font-semibold text-foreground leading-tight">{detail.title}</p>
                  <div className="text-lg font-bold text-primary mt-1">{score}/{maxCatScore}</div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className={cn(
                        "h-full rounded-full",
                        pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-400"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* What This Typically Impacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-primary/5 border border-primary/10 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 text-center">
          What This Typically Impacts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Decision Quality</p>
              <p className="text-xs text-muted-foreground">How you navigate complexity</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Team Influence</p>
              <p className="text-xs text-muted-foreground">How others respond to your lead</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">AI Integration</p>
              <p className="text-xs text-muted-foreground">Leading in an AI-augmented world</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Daily Effectiveness</p>
              <p className="text-xs text-muted-foreground">Consistency when stakes are high</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Score Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border shadow-sm"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 text-center">Your Team's SHIFT Profile</h2>
        
        <div className="space-y-4">
          {skillOrder.map((skill) => {
            const score = result.scores[skill];
            const percentage = (score / maxScore) * 100;
            const isPrimary = skill === result.primaryDevelopment;
            const isStrength = skill === result.primaryStrength;
            const details = skillDetails[skill];
            
            const colors = skillColors[skill];
            return (
              <div key={skill} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                        colors.badge
                      )}
                    >
                      {skill}
                    </span>
                    <span className={cn("font-medium text-sm sm:text-base truncate", colors.text)}>
                      {details.title}
                    </span>
                  </div>
                  <span className={cn("font-bold text-sm sm:text-base flex-shrink-0", colors.text)}>
                    {score}/{maxScore}
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full", colors.bar)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4">
          Higher scores indicate stronger capability in that skill
        </p>
      </motion.div>

      {/* Detailed Level Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">SHIFT Skill Details</h2>
          <p className="text-sm text-muted-foreground">
            Explore each skill and discover development pathways
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillOrder.map((skill) => (
            <SkillDetailCard
              key={skill}
              skill={skillDetails[skill]}
              score={result.scores[skill]}
              isPrimary={skill === result.primaryDevelopment}
              isStrength={skill === result.primaryStrength}
            />
          ))}
        </div>
      </motion.div>


      {/* Book a Strategy Call CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
      >
        <BookingWidget context="SHIFT Diagnostic Results" />
      </motion.div>

      {/* Social Sharing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-sky-50/50 dark:bg-sky-950/30 rounded-xl p-6 border border-sky-200/50 dark:border-sky-800/50"
      >
        <SocialShareButtons
          title={`I just discovered my team's SHIFT AI-Ready profile - ${getSkillTitle(result.primaryStrength)} is our strongest skill!`}
          description="Take the free SHIFT AI-Ready Diagnostic to discover your team's skills profile."
        />
      </motion.div>

      {/* Secondary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/programmes">
            <Button size="lg">
              Explore Programmes
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/shift-methodology">
            <Button variant="outline" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Learn About SHIFT
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
        This diagnostic identifies team skill patterns based on your observations. 
        It does not replace full assessments or coaching programs.
      </p>
    </div>
  );
}
