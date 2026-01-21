import { Button } from '@/components/ui/button';
import { LeadershipResult, LeadershipLevel, leadershipLevelDetails, getHybridTitle } from '@/lib/leadershipScoring';
import LeadershipLevelCard from './LeadershipLevelCard';
import { AlertTriangle, Sparkles, Target, Users, TrendingUp, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SocialShareButtons from '@/components/shared/SocialShareButtons';

interface LeadershipResultsProps {
  result: LeadershipResult;
  submissionId: string | null;
  userName?: string;
}

export default function LeadershipResults({ result, submissionId, userName }: LeadershipResultsProps) {
  const primaryDetails = leadershipLevelDetails[result.primaryLevel];
  const levels: LeadershipLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
  const maxScore = 20; // 4 questions x 5 max points
  
  const primaryTitle = result.isHybrid && result.secondaryLevel
    ? getHybridTitle(result.primaryLevel, result.secondaryLevel)
    : primaryDetails.title;
  
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
          These results are based on observable leadership behaviour patterns, not personality traits or self-perception.
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
          <span className="text-xs sm:text-sm font-medium">Your Leadership Operating Level</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 px-2 leading-tight">
          {primaryTitle}
        </h1>
        
        {result.isHybrid && result.secondaryLevel && (
          <p className="text-lg text-amber-600 font-medium mb-4">
            Hybrid Profile: You demonstrate strong capabilities across multiple leadership levels
          </p>
        )}
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
          {primaryDetails.description}
        </p>
        
        {/* Low Foundation Warning */}
        {result.lowFoundationFlag && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-semibold text-amber-800">Insight: Foundation Strengthening</h4>
                <p className="text-sm text-amber-700">
                  Your leadership ambition is ahead of your operational foundation. 
                  Consider strengthening personal productivity systems to sustain your higher-level capabilities.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Score Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border shadow-sm"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 text-center">Your Leadership Profile</h2>
        
        <div className="space-y-4">
          {levels.map((level) => {
            const score = result.scores[level];
            const percentage = (score / maxScore) * 100;
            const isPrimary = level === result.primaryLevel;
            const isSecondary = result.isHybrid && level === result.secondaryLevel;
            const details = leadershipLevelDetails[level];
            
            return (
              <div key={level} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn(
                    "font-medium text-sm sm:text-base truncate",
                    isPrimary ? "text-primary" : isSecondary ? "text-amber-600" : "text-muted-foreground"
                  )}>
                    {details.title}
                  </span>
                  <span className={cn(
                    "font-bold text-sm sm:text-base flex-shrink-0",
                    isPrimary ? "text-primary" : isSecondary ? "text-amber-600" : "text-muted-foreground"
                  )}>
                    {score}/{maxScore}
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      isPrimary ? "bg-primary" : isSecondary ? "bg-amber-400" : "bg-muted-foreground/30"
                    )}
                  />
                </div>
              </div>
            );
          })}
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
              <p className="font-medium text-foreground text-sm">Strategic Decision Quality</p>
              <p className="text-xs text-muted-foreground">How you navigate complexity</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Team Trust & Followership</p>
              <p className="text-xs text-muted-foreground">How others respond to your lead</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Performance Under Pressure</p>
              <p className="text-xs text-muted-foreground">Consistency when stakes are high</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Long-Term Trajectory</p>
              <p className="text-xs text-muted-foreground">Career and impact potential</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Detailed Level Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Leadership Level Details</h2>
          <p className="text-sm text-muted-foreground">
            Explore each level and discover development pathways
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <LeadershipLevelCard
              key={level}
              level={level}
              score={result.scores[level]}
              maxScore={maxScore}
              isPrimary={level === result.primaryLevel}
              isSecondary={result.isHybrid && level === result.secondaryLevel}
            />
          ))}
        </div>
      </motion.div>

      {/* Social Sharing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-muted/50 rounded-xl p-6 border border-border"
      >
        <SocialShareButtons
          title={`I just discovered my Leadership Operating Level: ${primaryTitle}`}
          description="Take the free Leadership Diagnostic to discover yours!"
        />
      </motion.div>

      {/* Secondary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center space-y-4"
      >
        <Link to="/programmes">
          <Button variant="outline" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore Programmes
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
