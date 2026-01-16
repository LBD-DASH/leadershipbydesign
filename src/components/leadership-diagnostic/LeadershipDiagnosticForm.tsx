import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { leadershipQuestions, leadershipCategories } from '@/data/leadershipQuestions';
import LeadershipQuestionRating from './LeadershipQuestionRating';
import { ArrowRight, Loader2 } from 'lucide-react';

interface LeadershipDiagnosticFormProps {
  onSubmit: (answers: Record<number, number>) => void;
  isSubmitting: boolean;
}

export default function LeadershipDiagnosticForm({ onSubmit, isSubmitting }: LeadershipDiagnosticFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  const handleRatingChange = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = leadershipQuestions.length;
  const isComplete = answeredCount === totalQuestions;
  const progress = (answeredCount / totalQuestions) * 100;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onSubmit(answers);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {answeredCount} of {totalQuestions} questions answered
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Questions grouped by category */}
      {leadershipCategories.map((category) => {
        const categoryQuestions = leadershipQuestions.filter(q => q.level === category.key);
        
        return (
          <div key={category.key} className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
              <p className="text-gray-600 text-sm">{category.subtitle}</p>
            </div>
            
            <div className="space-y-4">
              {categoryQuestions.map((question) => (
                <LeadershipQuestionRating
                  key={question.id}
                  questionId={question.id}
                  questionText={question.text}
                  value={answers[question.id]}
                  onChange={handleRatingChange}
                />
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Submit button */}
      <div className="flex justify-center pt-8">
        <Button
          type="submit"
          size="lg"
          disabled={!isComplete || isSubmitting}
          className="px-12 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analysing Your Leadership...
            </>
          ) : (
            <>
              Discover My Leadership Level
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>
      
      {!isComplete && (
        <p className="text-center text-gray-500 text-sm">
          Please answer all {totalQuestions} questions to see your results
        </p>
      )}
    </form>
  );
}
