import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LACVersion, hrLeaderQuestions, managerQuestions, lacScaleLabels } from "@/data/lacQuestions";

interface LACFormProps {
  version: LACVersion;
  onSubmit: (answers: Record<number, number>) => void;
}

export default function LACForm({ version, onSubmit }: LACFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const questions = version === 'hr_leader' ? hrLeaderQuestions : managerQuestions;

  const handleChange = (qId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
        <div className="space-y-2">
          {questions.map(question => (
            <div key={question.id} className="py-4 border-b border-border/50 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed flex-1">
                  {question.id}. {question.text}
                </p>
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleChange(question.id, rating)}
                        className="flex flex-col items-center gap-1 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
                        aria-label={`Rate ${lacScaleLabels[rating - 1]}`}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-200",
                            answers[question.id] === rating
                              ? "bg-primary border-primary text-primary-foreground scale-110"
                              : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary hover:scale-105"
                          )}
                        >
                          {rating}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">Rarely</span>
                    <span className="text-[10px] text-muted-foreground">Always</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress + Submit */}
      <div className="sticky bottom-4 bg-background/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              {answeredCount} of {questions.length} questions answered
            </p>
            <div className="w-full sm:w-48 h-2 bg-muted rounded-full mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!allAnswered}
            className="w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-full group"
          >
            See My Results
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
