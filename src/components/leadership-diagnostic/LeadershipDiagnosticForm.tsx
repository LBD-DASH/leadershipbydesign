import { useState } from "react";
import { Button } from "@/components/ui/button";
import { leadershipQuestions, leadershipCategories } from "@/data/leadershipQuestions";
import LeadershipQuestionRating from "./LeadershipQuestionRating";
import { ArrowRight, CheckCircle } from "lucide-react";

interface LeadershipDiagnosticFormProps {
  onSubmit: (answers: Record<number, number>) => void;
  isSubmitting: boolean;
}

export default function LeadershipDiagnosticForm({ onSubmit, isSubmitting }: LeadershipDiagnosticFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleRatingChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = leadershipQuestions.every((q) => answers[q.id] !== undefined);
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) {
      onSubmit(answers);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {leadershipCategories.map((category) => {
        const categoryQuestions = leadershipQuestions.filter((q) => q.level === category.key);
        const categoryAnswered = categoryQuestions.filter((q) => answers[q.id] !== undefined).length;
        
        return (
          <div key={category.key} className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{category.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{category.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {categoryAnswered === categoryQuestions.length ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="text-muted-foreground">
                    {categoryAnswered}/{categoryQuestions.length}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
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

      {/* Progress and Submit */}
      <div className="sticky bottom-4 bg-background/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              {answeredCount} of {leadershipQuestions.length} questions answered
            </p>
            <div className="w-full sm:w-48 h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / leadershipQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            size="lg"
            disabled={!allAnswered || isSubmitting}
            className="w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-full group"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                See My Results
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
        
        {!allAnswered && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Please answer all questions to see your results
          </p>
        )}
      </div>
    </form>
  );
}
