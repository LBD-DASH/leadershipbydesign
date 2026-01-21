import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkillDetail, getScoreInterpretation } from '@/lib/shiftScoring';
import { ShiftSkill } from '@/data/shiftQuestions';

interface SkillDetailCardProps {
  skill: SkillDetail;
  score: number;
  isPrimary: boolean;
  isStrength: boolean;
}

export default function SkillDetailCard({ skill, score, isPrimary, isStrength }: SkillDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(isPrimary);
  const interpretation = getScoreInterpretation(score);
  const percentage = (score / 20) * 100;

  return (
    <div
      className={cn(
        'bg-card rounded-xl border transition-all',
        isPrimary && 'border-amber-500/50 ring-1 ring-amber-500/20',
        isStrength && 'border-green-500/50 ring-1 ring-green-500/20',
        !isPrimary && !isStrength && 'border-border'
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-6 flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
              isPrimary && 'bg-amber-500/10',
              isStrength && 'bg-green-500/10',
              !isPrimary && !isStrength && 'bg-muted'
            )}
          >
            <span
              className={cn(
                'font-bold text-xl',
                isPrimary && 'text-amber-600',
                isStrength && 'text-green-600',
                !isPrimary && !isStrength && 'text-muted-foreground'
              )}
            >
              {skill.key}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{skill.title}</h3>
              {isPrimary && (
                <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full">
                  Focus Area
                </span>
              )}
              {isStrength && (
                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">
                  Strength
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 max-w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    score >= 17 && 'bg-green-500',
                    score >= 13 && score < 17 && 'bg-blue-500',
                    score >= 9 && score < 13 && 'bg-amber-500',
                    score < 9 && 'bg-red-500'
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium">{score}/20</span>
              <span className={cn('text-xs', interpretation.color)}>{interpretation.label}</span>
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">{skill.description}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">When Strong</span>
                  </div>
                  <ul className="space-y-1">
                    {skill.whenStrong.map((item, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-green-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Signs It Needs Work</span>
                  </div>
                  <ul className="space-y-1">
                    {skill.needsDevelopment.map((item, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-amber-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-primary">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">How to Strengthen</span>
                </div>
                <ul className="space-y-1">
                  {skill.howToStrengthen.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Workshop Connection:</span>{' '}
                  {skill.workshopConnection}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
