import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ProspectQualityScore } from '@/utils/prospectScoring';

interface QualityIndicatorProps {
  score: ProspectQualityScore;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const SCORING_LABELS: Record<keyof ProspectQualityScore['breakdown'], string> = {
  contactEmail: 'Contact Email',
  hrContacts: 'HR/L&D Contacts',
  contactPhone: 'Phone Number',
  painPoints: 'Pain Points',
  opportunitySignals: 'Opportunity Signals',
  leadershipTeam: 'Leadership Team',
  linkedIn: 'LinkedIn URL',
};

export default function QualityIndicator({ score, showLabel = true, size = 'md' }: QualityIndicatorProps) {
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const sizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
  };

  const labelSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 cursor-help',
              showLabel && 'px-2 py-0.5 rounded-full',
              showLabel && score.color === 'green' && 'bg-green-100 text-green-800',
              showLabel && score.color === 'yellow' && 'bg-yellow-100 text-yellow-800',
              showLabel && score.color === 'red' && 'bg-red-100 text-red-800'
            )}
            role="status"
            aria-label={`${score.label}: ${score.score} points`}
          >
            <span
              className={cn(
                'rounded-full shrink-0',
                colorClasses[score.color],
                sizeClasses[size]
              )}
            />
            {showLabel && (
              <span className={cn('font-medium whitespace-nowrap', labelSizeClasses[size])}>
                {score.label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-56">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-1 mb-1">
              <span className="font-semibold">Quality Score</span>
              <span className="font-bold">{score.score}/100</span>
            </div>
            <div className="space-y-1 text-xs">
              {(Object.entries(score.breakdown) as [keyof ProspectQualityScore['breakdown'], number][]).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{SCORING_LABELS[key]}</span>
                    <span className={value > 0 ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {value > 0 ? `+${value}` : '0'}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
