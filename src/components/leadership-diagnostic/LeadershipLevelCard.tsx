import { LeadershipLevel, leadershipLevelDetails } from '@/lib/leadershipScoring';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadershipLevelCardProps {
  level: LeadershipLevel;
  score: number;
  maxScore: number;
  isPrimary: boolean;
  isSecondary: boolean;
  onFindOutMore?: (level: LeadershipLevel) => void;
}

export default function LeadershipLevelCard({
  level,
  score,
  maxScore,
  isPrimary,
  isSecondary,
  onFindOutMore
}: LeadershipLevelCardProps) {
  const details = leadershipLevelDetails[level];
  const percentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className={cn(
      "bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-300",
      isPrimary ? "border-primary ring-2 ring-primary/20" : 
      isSecondary ? "border-amber-400 ring-2 ring-amber-400/20" : 
      "border-gray-100"
    )}>
      {/* Image - Responsive */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={details.image} 
          alt={details.title}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="flex gap-2">
            {isPrimary && (
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                Primary
              </span>
            )}
            {isSecondary && (
              <span className="bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                Secondary
              </span>
            )}
          </div>
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{details.title}</h3>
        <p className="text-sm text-primary font-medium mb-3">{details.subtitle}</p>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">{details.description}</p>
      
      {/* Strengths */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-900">Strengths</span>
        </div>
        <ul className="space-y-1">
          {details.strengths.slice(0, 2).map((strength, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Growth Edge */}
      <div className="mb-4 p-3 bg-amber-50 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-gray-900">Growth Edge</span>
        </div>
        <p className="text-sm text-gray-700">{details.growthEdge}</p>
      </div>
      
      {/* Recommended Path */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <Lightbulb className="w-4 h-4 text-primary" />
        <span>Recommended: <strong>{details.recommendedPath}</strong></span>
      </div>
      
      {/* CTA */}
      {(isPrimary || isSecondary) && onFindOutMore && (
        <Button 
          onClick={() => onFindOutMore(level)}
          variant="outline"
          className="w-full group"
        >
          Explore This Path
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      )}
      </div>
    </div>
  );
}
