import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getScoreInterpretation } from '@/lib/shiftScoring';
import type { AIReadinessCategory } from '@/data/aiReadinessQuestions';

interface AIDetailCardProps {
  category: AIReadinessCategory;
  detail: {
    title: string;
    icon: string;
    description: string;
    whenStrong: string[];
    needsDevelopment: string[];
    howToStrengthen: string[];
    workshopConnection: string;
  };
  score: number;
  maxScore: number;
  isStrength: boolean;
  isFocusArea: boolean;
}

export default function AIDetailCard({ category, detail, score, maxScore, isStrength, isFocusArea }: AIDetailCardProps) {
  const interpretation = getScoreInterpretation(score);
  const percentage = (score / maxScore) * 100;

  return (
    <div
      className={cn(
        'rounded-2xl border shadow-sm transition-all bg-gradient-to-br from-primary/5 to-transparent',
        isStrength && 'border-green-200 ring-1 ring-green-500/20 dark:border-green-800',
        isFocusArea && 'border-amber-200 ring-1 ring-amber-500/20 dark:border-amber-800',
        !isStrength && !isFocusArea && 'border-border'
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full flex-shrink-0 bg-primary/10 flex items-center justify-center text-2xl">
            {detail.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{detail.title}</h3>
              {isStrength && (
                <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full dark:bg-green-900/50 dark:text-green-300">
                  Strength
                </span>
              )}
              {isFocusArea && (
                <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full dark:bg-amber-900/50 dark:text-amber-300">
                  Focus Area
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 max-w-32 h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8 }}
                  className={cn(
                    'h-full rounded-full',
                    percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-amber-400'
                  )}
                />
              </div>
              <span className="text-sm font-bold text-foreground">{score}/{maxScore}</span>
              <span className={cn('text-xs font-medium', interpretation.color)}>{interpretation.label}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{detail.description}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">When Strong</span>
              </div>
              <ul className="space-y-1">
                {detail.whenStrong.map((item, i) => (
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
                {detail.needsDevelopment.map((item, i) => (
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
              {detail.howToStrengthen.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 mt-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Programme Connection:</span>{' '}
              {detail.workshopConnection}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
