import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LeadershipResult, LeadershipLevel, leadershipLevelDetails, getHybridTitle } from '@/lib/leadershipScoring';
import LeadershipLevelCard from './LeadershipLevelCard';
import LeadershipDownloadForm from './LeadershipDownloadForm';
import LeadershipExpertForm from './LeadershipExpertForm';
import { Download, MessageCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LeadershipResultsProps {
  result: LeadershipResult;
  submissionId: string | null;
}

export default function LeadershipResults({ result, submissionId }: LeadershipResultsProps) {
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [showExpertForm, setShowExpertForm] = useState(false);
  
  const primaryDetails = leadershipLevelDetails[result.primaryLevel];
  const levels: LeadershipLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
  const maxScore = 20; // 4 questions x 5 max points
  
  const primaryTitle = result.isHybrid && result.secondaryLevel
    ? getHybridTitle(result.primaryLevel, result.secondaryLevel)
    : primaryDetails.title;
  
  const handleFindOutMore = (level: LeadershipLevel) => {
    setShowExpertForm(true);
  };
  
  return (
    <div className="space-y-8 sm:space-y-12 pt-24 sm:pt-28">
      {/* Hero Result Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">Your Leadership Operating Level</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-2 leading-tight">
          {primaryTitle}
        </h1>
        
        {result.isHybrid && result.secondaryLevel && (
          <p className="text-lg text-amber-600 font-medium mb-4">
            Hybrid Profile: You demonstrate strong capabilities across multiple leadership levels
          </p>
        )}
        
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
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
        className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Your Leadership Profile</h2>
        
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
                    isPrimary ? "text-primary" : isSecondary ? "text-amber-600" : "text-gray-600"
                  )}>
                    {details.title}
                  </span>
                  <span className={cn(
                    "font-bold text-sm sm:text-base flex-shrink-0",
                    isPrimary ? "text-primary" : isSecondary ? "text-amber-600" : "text-gray-500"
                  )}>
                    {score}/{maxScore}
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      isPrimary ? "bg-primary" : isSecondary ? "bg-amber-400" : "bg-gray-300"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Detailed Level Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Leadership Level Details</h2>
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
            Internationally Recognised Programmes
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
              onFindOutMore={handleFindOutMore}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Next Steps */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">What's Next?</h2>
        <p className="text-gray-600 text-center mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
          Leadership isn't one-size-fits-all. Choose your path forward.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <Button 
            onClick={() => setShowDownloadForm(true)}
            variant="outline"
            size="lg"
            className="h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Save My Results</span>
          </Button>
          
          <Button 
            onClick={() => setShowExpertForm(true)}
            size="lg"
            className="h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Speak to an Expert</span>
          </Button>
          
          <Link to="/programmes" className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Button 
              variant="secondary"
              size="lg"
              className="w-full h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Explore Programmes</span>
            </Button>
          </Link>
        </div>
      </motion.div>
      
      {/* Modal Forms */}
      <LeadershipDownloadForm
        open={showDownloadForm}
        onOpenChange={setShowDownloadForm}
        submissionId={submissionId}
        result={result}
      />
      
      <LeadershipExpertForm
        open={showExpertForm}
        onOpenChange={setShowExpertForm}
        submissionId={submissionId}
        primaryLevel={result.primaryLevel}
      />
    </div>
  );
}
