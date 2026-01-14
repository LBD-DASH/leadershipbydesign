import { cn } from "@/lib/utils";

interface QuestionRatingProps {
  questionId: number;
  questionText: string;
  value: number | undefined;
  onChange: (questionId: number, value: number) => void;
}

export default function QuestionRating({ questionId, questionText, value, onChange }: QuestionRatingProps) {
  return (
    <div className="py-4 border-b border-border/50 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {/* Question text */}
        <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed flex-1">
          {questionId}. {questionText}
        </p>
        
        {/* Rating buttons with labels below */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(questionId, rating)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
                )}
                aria-label={`Rate ${rating}`}
              >
                <div
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-200",
                    value === rating
                      ? "bg-primary border-primary text-primary-foreground scale-110"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary hover:scale-105"
                  )}
                >
                  {rating}
                </div>
              </button>
            ))}
          </div>
          {/* Labels below numbers */}
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[10px] text-muted-foreground">Disagree</span>
            <span className="text-[10px] text-muted-foreground">Agree</span>
          </div>
        </div>
      </div>
    </div>
  );
}
