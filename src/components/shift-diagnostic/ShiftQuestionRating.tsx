import { cn } from '@/lib/utils';

interface ShiftQuestionRatingProps {
  questionId: number;
  questionText: string;
  value: number | undefined;
  onChange: (questionId: number, value: number) => void;
}

export default function ShiftQuestionRating({
  questionId,
  questionText,
  value,
  onChange,
}: ShiftQuestionRatingProps) {
  return (
    <div className="py-4 border-b border-border/50 last:border-b-0">
      <p className="text-sm sm:text-base text-foreground mb-3">
        <span className="text-muted-foreground mr-2">{questionId}.</span>
        {questionText}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground hidden sm:block">Disagree</span>
        <div className="flex gap-2 sm:gap-3 flex-1 justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(questionId, rating)}
              className={cn(
                'w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 font-semibold transition-all',
                'hover:border-primary hover:bg-primary/10',
                value === rating
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-muted-foreground/30 text-muted-foreground'
              )}
              aria-label={`Rate ${rating} out of 5`}
            >
              {rating}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">Agree</span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1 sm:hidden">
        <span>Disagree</span>
        <span>Agree</span>
      </div>
    </div>
  );
}
