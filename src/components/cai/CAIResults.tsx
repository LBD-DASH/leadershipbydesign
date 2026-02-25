import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CAIResult } from "@/lib/caiScoring";
import { caiSections } from "@/data/caiQuestions";
import { ArrowRight, Crown, Target, Flame, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CAIResultsProps {
  result: CAIResult;
  userName?: string;
}

const categoryConfig = {
  tactical: { icon: Target, accent: 'text-muted-foreground', bg: 'bg-muted/30' },
  growth: { icon: Flame, accent: 'text-primary', bg: 'bg-primary/10' },
  resonance: { icon: Shield, accent: 'text-primary', bg: 'bg-primary/10' },
  sovereign: { icon: Crown, accent: 'text-primary', bg: 'bg-primary/15' },
};

export default function CAIResults({ result, userName }: CAIResultsProps) {
  const navigate = useNavigate();
  const config = categoryConfig[result.category];
  const Icon = config.icon;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Score Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-full mb-6", config.bg)}>
          <Icon className={cn("w-8 h-8", config.accent)} />
        </div>

        {userName && (
          <p className="text-sm text-muted-foreground mb-2 tracking-wide uppercase">
            {userName}'s Alignment
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {result.categoryLabel}
        </h1>

        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-5xl font-bold text-primary">{result.totalScore}</span>
          <span className="text-lg text-muted-foreground">/ {result.maxScore}</span>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {result.message}
        </p>
      </motion.div>

      {/* Section Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8"
      >
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          Alignment Breakdown
        </h3>
        <div className="space-y-5">
          {caiSections.map((section) => {
            const score = result.sectionScores[section.key] || 0;
            return (
              <div key={section.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{section.title}</span>
                  <span className="text-sm text-muted-foreground">{score}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-12"
      >
        <Button
          size="lg"
          onClick={() => navigate(result.ctaLink)}
          className="px-10 py-6 text-lg font-semibold rounded-full group"
        >
          {result.ctaLabel}
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Closing Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center border-t border-border pt-8"
      >
        <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
          "Contagious Identity is not for everyone. It is for leaders prepared to become the standard."
        </p>
      </motion.div>
    </div>
  );
}
