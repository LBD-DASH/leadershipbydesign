import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Zap, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShiftResult, skillDetails, getSkillTitle, getShiftInsights, getScoreInterpretation } from '@/lib/shiftScoring';
import { shiftCategories, ShiftSkill } from '@/data/shiftQuestions';
import SocialShareButtons from '@/components/shared/SocialShareButtons';
import SkillDetailCard from './SkillDetailCard';

interface ShiftResultsPageProps {
  result: ShiftResult;
  submissionId: string | null;
  userName?: string;
}

export default function ShiftResultsPage({ result, submissionId, userName }: ShiftResultsPageProps) {
  const primarySkill = skillDetails[result.primaryDevelopment];
  const strengthSkill = skillDetails[result.primaryStrength];
  const insights = getShiftInsights(result);

  const skillOrder: ShiftSkill[] = ['S', 'H', 'I', 'F', 'T'];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <p className="text-sm text-primary font-medium">Your SHIFT Skills Profile</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {userName ? `${userName}, here's` : "Here's"} your profile
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Based on your responses, we've identified your strongest skill and where to focus your development.
        </p>
      </motion.div>

      {/* Key insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-2 gap-4"
      >
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
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
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
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
      </motion.div>

      {/* Score visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h2 className="font-semibold text-foreground mb-4">Your SHIFT Scores</h2>
        <div className="space-y-4">
          {skillOrder.map((skill) => {
            const score = result.scores[skill];
            const percentage = (score / 20) * 100;
            const isPrimary = skill === result.primaryDevelopment;
            const isStrength = skill === result.primaryStrength;
            const interpretation = getScoreInterpretation(score);

            return (
              <div key={skill} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                        isPrimary && 'bg-amber-100 text-amber-600',
                        isStrength && 'bg-green-100 text-green-600',
                        !isPrimary && !isStrength && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {skill}
                    </span>
                    <span className="font-medium text-foreground">{getSkillTitle(skill)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs', interpretation.color)}>{interpretation.label}</span>
                    <span className="font-medium text-foreground">{score}/20</span>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={cn(
                      'h-full rounded-full',
                      isPrimary && 'bg-amber-500',
                      isStrength && 'bg-green-500',
                      !isPrimary && !isStrength && 'bg-primary/60'
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Impact areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="font-semibold text-foreground">What This Typically Impacts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Target, label: 'Decision Quality' },
            { icon: Users, label: 'Team Influence' },
            { icon: TrendingUp, label: 'Career Progress' },
            { icon: Zap, label: 'Daily Effectiveness' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-muted/50 rounded-lg p-4 text-center">
              <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* All skills breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="font-semibold text-foreground">Skill Breakdown</h2>
        <div className="space-y-3">
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

      {/* Social sharing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-muted/50 rounded-xl p-6 text-center"
      >
        <h3 className="font-semibold text-foreground mb-2">Share Your Profile</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Let others know about the SHIFT Skills Diagnostic
        </p>
        <SocialShareButtons
          title={`I just discovered my SHIFT profile - ${getSkillTitle(result.primaryStrength)} is my strongest skill!`}
          description="Take the free SHIFT Skills Diagnostic to discover your leadership profile."
        />
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-4"
      >
        <h3 className="font-semibold text-foreground">Ready to develop your skills?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Explore our programmes designed to strengthen each SHIFT skill through practical application.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/programmes">
              Explore Programmes
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/shift-methodology">Learn About SHIFT</Link>
          </Button>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center max-w-lg mx-auto">
        This diagnostic provides a snapshot based on self-assessment. For deeper insight and development planning,
        consider a conversation with one of our coaches.
      </p>
    </div>
  );
}
