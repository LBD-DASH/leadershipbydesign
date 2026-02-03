import { cn } from "@/lib/utils";

interface AIReadinessQuestionRatingProps {
  questionId: number;
  value: number | undefined;
  onChange: (questionId: number, value: number) => void;
}

const ratingLabels = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export function AIReadinessQuestionRating({ questionId, value, onChange }: AIReadinessQuestionRatingProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {ratingLabels.map((rating) => (
        <button
          key={rating.value}
          type="button"
          onClick={() => onChange(questionId, rating.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "border-2",
            value === rating.value
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
              : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
          )}
        >
          <span className="hidden sm:inline">{rating.label}</span>
          <span className="sm:hidden">{rating.value}</span>
        </button>
      ))}
    </div>
  );
}
