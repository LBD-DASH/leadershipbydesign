import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type FollowUpPreference = "yes" | "maybe" | "no";

interface NextStepChoiceProps {
  onSelect: (preference: FollowUpPreference) => void;
  isSubmitting?: boolean;
  initialSelection?: FollowUpPreference | null;
}

const options: { 
  value: FollowUpPreference; 
  label: string; 
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "yes",
    label: "Yes — add me to the Priority Insight Waiting List for a short follow-up",
    description: "We'll reach out to discuss your results and potential next steps.",
    icon: MessageCircle,
  },
  {
    value: "maybe",
    label: "Maybe later — keep me on the waiting list for insights and updates",
    description: "Receive occasional insights relevant to your leadership profile.",
    icon: Clock,
  },
  {
    value: "no",
    label: "No — I'll reflect independently",
    description: "Your results are saved. You can return anytime.",
    icon: User,
  },
];

export default function NextStepChoice({ 
  onSelect, 
  isSubmitting = false,
  initialSelection = null 
}: NextStepChoiceProps) {
  const [selected, setSelected] = useState<FollowUpPreference | null>(initialSelection);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = async (value: FollowUpPreference) => {
    if (isSubmitting || confirmed) return;
    
    setSelected(value);
    
    // Auto-submit on selection
    await onSelect(value);
    
    if (value === "yes" || value === "maybe") {
      setConfirmed(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 sm:p-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          Your Next Step (Optional)
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Would you like support interpreting or acting on these insights?
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={isSubmitting || confirmed}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-background"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors",
                  isSelected 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground/40"
                )}>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-foreground" : "text-foreground/80"
                    )}>
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirmation Message */}
      <AnimatePresence>
        {confirmed && (selected === "yes" || selected === "maybe") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">You're on the list</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You're on the Priority Insight Waiting List. We'll be in touch only if there's a clear and relevant next step.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
