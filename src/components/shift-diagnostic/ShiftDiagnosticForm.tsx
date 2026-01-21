import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { shiftQuestions, shiftCategories } from '@/data/shiftQuestions';
import ShiftQuestionRating from './ShiftQuestionRating';

interface ShiftDiagnosticFormProps {
  onSubmit: (answers: Record<number, number>) => void;
  isSubmitting: boolean;
}

export default function ShiftDiagnosticForm({ onSubmit, isSubmitting }: ShiftDiagnosticFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleRatingChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const totalQuestions = shiftQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) {
      onSubmit(answers);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {shiftCategories.map((category) => {
        const categoryQuestions = shiftQuestions.filter((q) => q.skill === category.key);
        const categoryAnswered = categoryQuestions.filter((q) => answers[q.id] !== undefined).length;
        const categoryComplete = categoryAnswered === categoryQuestions.length;

        return (
          <div key={category.key} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">{category.key}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{category.title}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>
              {categoryComplete && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>

            <div className="space-y-1">
              {categoryQuestions.map((question) => (
                <ShiftQuestionRating
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

      {/* Sticky progress bar and submit */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border py-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {answeredCount} of {totalQuestions} questions answered
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!allAnswered || isSubmitting}
          >
            {isSubmitting
              ? 'Processing...'
              : allAnswered
              ? 'See Your SHIFT Profile'
              : 'Please answer all questions'}
          </Button>
        </div>
      </div>
    </form>
  );
}
