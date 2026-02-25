import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { caiQuestions } from "@/data/caiQuestions";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface CAIFormProps {
  onSubmit: (answers: Record<number, number>) => void;
}

export default function CAIForm({ onSubmit }: CAIFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const question = caiQuestions[currentIndex];
  const total = caiQuestions.length;
  const progress = ((currentIndex + (answers[question.id] !== undefined ? 1 : 0)) / total) * 100;
  const isLastQuestion = currentIndex === total - 1;
  const allAnswered = caiQuestions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

    // Auto-advance after a brief delay
    if (!isLastQuestion) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 350);
    }
  };

  const handleSubmit = () => {
    if (allAnswered) onSubmit(answers);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
            Question {currentIndex + 1} of {total}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-1 bg-border" />
      </div>

      {/* Section Label */}
      <p className="text-xs tracking-widest uppercase text-primary/70 font-medium mb-4">
        {question.section.replace(/-/g, ' ')}
      </p>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = answers[question.id] === option.value;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200",
                    "hover:border-primary/60 hover:bg-primary/5",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card"
                  )}
                >
                  <span className={cn(
                    "text-sm sm:text-base",
                    isSelected ? "text-foreground font-medium" : "text-foreground/80"
                  )}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        {isLastQuestion && answers[question.id] !== undefined ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-8 py-5 font-semibold rounded-full"
          >
            See My Alignment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
            disabled={answers[question.id] === undefined}
            className="text-muted-foreground"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
