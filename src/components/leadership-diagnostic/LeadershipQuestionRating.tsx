import { cn } from '@/lib/utils';

interface LeadershipQuestionRatingProps {
  questionId: number;
  questionText: string;
  value: number | undefined;
  onChange: (questionId: number, value: number) => void;
}

const ratingLabels = [
  { value: 1, label: 'Rarely true' },
  { value: 2, label: 'Occasionally' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Mostly true' },
  { value: 5, label: 'Consistently' }
];

export default function LeadershipQuestionRating({ 
  questionId, 
  questionText, 
  value, 
  onChange 
}: LeadershipQuestionRatingProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <p className="text-gray-800 font-medium mb-4">{questionText}</p>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-1">
        {ratingLabels.map((rating) => (
          <button
            key={rating.value}
            type="button"
            onClick={() => onChange(questionId, rating.value)}
            className={cn(
              "flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200",
              "border-2 hover:border-primary/50",
              value === rating.value
                ? "bg-primary text-white border-primary"
                : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100"
            )}
          >
            <span className="block text-xs opacity-70 mb-0.5">{rating.value}</span>
            <span className="block text-xs sm:text-[10px] lg:text-xs">{rating.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
