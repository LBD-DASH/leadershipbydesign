import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Bot, Brain, Users, Shield, Sparkles } from "lucide-react";
import { aiReadinessQuestions, aiReadinessCategories, AIReadinessCategory } from "@/data/aiReadinessQuestions";
import { AIReadinessQuestionRating } from "./AIReadinessQuestionRating";
import { cn } from "@/lib/utils";

interface AIReadinessFormProps {
  onComplete: (answers: Record<number, number>) => void;
}

const categoryIcons: Record<AIReadinessCategory, typeof Bot> = {
  awareness: Bot,
  collaboration: Users,
  change: Sparkles,
  ethics: Shield,
  human_skills: Brain,
};

export function AIReadinessForm({ onComplete }: AIReadinessFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const currentCategory = aiReadinessCategories[currentCategoryIndex];
  const categoryQuestions = aiReadinessQuestions.filter(q => q.category === currentCategory.key);
  
  const allCategoryQuestionsAnswered = categoryQuestions.every(q => answers[q.id] !== undefined);
  const totalQuestions = aiReadinessQuestions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleRatingChange = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentCategoryIndex < aiReadinessCategories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  const isLastCategory = currentCategoryIndex === aiReadinessCategories.length - 1;
  const CategoryIcon = categoryIcons[currentCategory.key];

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Category {currentCategoryIndex + 1} of {aiReadinessCategories.length}</span>
          <span>{answeredQuestions} of {totalQuestions} questions answered</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {aiReadinessCategories.map((cat, index) => {
            const catQuestions = aiReadinessQuestions.filter(q => q.category === cat.key);
            const catAnswered = catQuestions.every(q => answers[q.id] !== undefined);
            const Icon = categoryIcons[cat.key];
            
            return (
              <button
                key={cat.key}
                onClick={() => setCurrentCategoryIndex(index)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
                  index === currentCategoryIndex
                    ? "bg-primary text-primary-foreground"
                    : catAnswered
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.title}</span>
                {catAnswered && <span className="text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <CategoryIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{currentCategory.fullTitle}</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">{currentCategory.description}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        {categoryQuestions.map((question, index) => (
          <Card 
            key={question.id} 
            className={cn(
              "transition-all duration-300",
              answers[question.id] !== undefined 
                ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/10" 
                : "border-border"
            )}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="font-medium text-foreground">
                  <span className="text-primary mr-2">{index + 1}.</span>
                  {question.text}
                </p>
                <AIReadinessQuestionRating
                  questionId={question.id}
                  value={answers[question.id]}
                  onChange={handleRatingChange}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentCategoryIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!allCategoryQuestionsAnswered}
        >
          {isLastCategory ? "View Results" : "Next Category"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
