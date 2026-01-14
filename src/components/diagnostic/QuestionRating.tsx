import { cn } from "@/lib/utils";

interface QuestionRatingProps {
  questionId: number;
  questionText: string;
  value: number | undefined;
  onChange: (questionId: number, value: number) => void;
}

const ratingLabels = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
];

export default function QuestionRating({ questionId, questionText, value, onChange }: QuestionRatingProps) {
  return (
    <div className="py-6 border-b border-border/50 last:border-b-0">
      <p className="text-foreground font-medium mb-4 text-base sm:text-lg leading-relaxed">
        {questionId}. {questionText}
      </p>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center justify-between w-full max-w-md">
          {ratingLabels.map((rating) => (
            <button
              key={rating.value}
              type="button"
              onClick={() => onChange(questionId, rating.value)}
              className={cn(
                "flex flex-col items-center gap-1 group transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-2"
              )}
              aria-label={`Rate ${rating.value}: ${rating.label}`}
            >
              <div
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-200",
                  value === rating.value
                    ? "bg-primary border-primary text-primary-foreground scale-110"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary group-hover:scale-105"
                )}
              >
                {rating.value}
              </div>
            </button>
          ))}
        </div>
        
        <div className="hidden sm:flex items-center justify-between w-full max-w-md text-xs text-muted-foreground px-2">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
      </div>
      
      {/* Mobile labels */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-md text-xs text-muted-foreground mt-2 px-2">
        <span>Strongly Disagree</span>
        <span>Strongly Agree</span>
      </div>
    </div>
  );
}
