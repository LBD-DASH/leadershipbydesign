import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { shiftQuestions, shiftCategories, aiReadinessQuestions, aiReadinessCategories, totalDiagnosticQuestions } from '@/data/shiftQuestions';
import ShiftQuestionRating from './ShiftQuestionRating';
import { ArrowRight, CheckCircle, Bot } from 'lucide-react';

interface ShiftDiagnosticFormProps {
  onSubmit: (answers: Record<number, number>) => void;
  isSubmitting: boolean;
}

export default function ShiftDiagnosticForm({ onSubmit, isSubmitting }: ShiftDiagnosticFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleRatingChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allShiftAnswered = shiftQuestions.every((q) => answers[q.id] !== undefined);
  const allAIAnswered = aiReadinessQuestions.every((q) => answers[q.id] !== undefined);
  const allAnswered = allShiftAnswered && allAIAnswered;
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) {
      onSubmit(answers);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* SHIFT Skill Categories */}
      {shiftCategories.map((category) => {
        const categoryQuestions = shiftQuestions.filter((q) => q.skill === category.key);
        const categoryAnswered = categoryQuestions.filter((q) => answers[q.id] !== undefined).length;
        
          const colors = categoryColors[category.key];
        return (
          <div key={category.key} className={`rounded-2xl p-6 sm:p-8 shadow-sm border ${colors.border} ${colors.cardBg}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                  <span className={`${colors.text} font-bold text-lg`}>{category.key}</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                </div>
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

      {/* AI Readiness Section */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">AI Readiness</h3>
              <p className="text-muted-foreground text-sm mt-1">Your team's ability to lead effectively in an AI-augmented workplace.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {allAIAnswered ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <span className="text-muted-foreground">
                {aiReadinessQuestions.filter((q) => answers[q.id] !== undefined).length}/{aiReadinessQuestions.length}
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {aiReadinessQuestions.map((question) => (
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

      {/* Progress and Submit */}
      <div className="sticky bottom-4 bg-background/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              {answeredCount} of {totalDiagnosticQuestions} questions answered
            </p>
            <div className="w-full sm:w-48 h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalDiagnosticQuestions) * 100}%` }}
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
