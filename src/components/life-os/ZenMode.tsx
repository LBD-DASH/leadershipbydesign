import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Check, MoreHorizontal, Home, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  category: string;
  target_minutes?: number | null;
}

interface ZenModeProps {
  isActive: boolean;
  onClose: () => void;
  currentTask: Task | null;
  onCompleteTask: () => void;
}

const inspirationalQuotes = [
  "The sovereign mind conquers itself before it conquers the world.",
  "In stillness, we find our greatest strength.",
  "Master the moment, master your destiny.",
  "Deep focus is the gateway to excellence.",
  "One intentional hour outweighs a scattered day.",
];

const ZenMode = ({ isActive, onClose, currentTask, onCompleteTask }: ZenModeProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [quote] = useState(() =>
    inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]
  );

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Reset timer when entering zen mode
  useEffect(() => {
    if (isActive) {
      setElapsedSeconds(0);
    }
  }, [isActive]);

  // Format time as HH:MM:SS
  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100]"
        >
          {/* Forest background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80')`,
            }}
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[hsl(var(--los-background)/0.85)]" />

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[hsl(var(--los-gold)/0.1)] rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="relative h-full flex flex-col items-center justify-between p-6 pt-12 pb-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-[hsl(var(--los-gold))]" />
                <span className="text-sm uppercase tracking-[0.3em] text-[hsl(var(--los-gold))] font-medium">
                  The Sovereign
                </span>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-[hsl(var(--los-gold)/0.15)] border border-[hsl(var(--los-gold)/0.3)]">
                <span className="text-xs uppercase tracking-widest text-[hsl(var(--los-gold))]">
                  Current State: Zen Focus Active
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center space-y-6">
              <motion.p
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="text-6xl md:text-7xl font-light text-[hsl(var(--los-foreground))] tracking-wider"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatTime(elapsedSeconds)}
              </motion.p>

              {/* Current Task */}
              {currentTask && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--los-gold))]">
                    One Big Move
                  </p>
                  <p className="text-xl text-[hsl(var(--los-foreground))] font-medium max-w-xs mx-auto">
                    {currentTask.title}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-4">
                {currentTask ? (
                  <Button
                    onClick={onCompleteTask}
                    className="h-12 px-6 bg-gradient-to-r from-[hsl(var(--los-gold))] to-[hsl(var(--los-gold-dim))] text-[hsl(var(--los-background))] hover:opacity-90 rounded-xl font-medium"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Complete Intent
                  </Button>
                ) : (
                  <p className="text-sm text-[hsl(var(--los-muted-foreground))] italic">
                    No active intent — add one from your dashboard
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-[hsl(var(--los-muted)/0.5)] text-[hsl(var(--los-muted-foreground))] hover:bg-[hsl(var(--los-muted))]"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quote */}
            <div className="text-center space-y-8 max-w-sm">
              <p className="text-sm text-[hsl(var(--los-muted-foreground))] italic leading-relaxed">
                "{quote}"
              </p>

              {/* Focus Mode Toggle */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[hsl(var(--los-muted-foreground))]">
                  Focus Mode
                </span>
                <div className="w-10 h-6 bg-[hsl(var(--los-gold))] rounded-full p-1">
                  <div className="w-4 h-4 bg-[hsl(var(--los-background))] rounded-full ml-auto" />
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-center gap-8 pt-4">
                <button
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 text-[hsl(var(--los-muted-foreground))] hover:text-[hsl(var(--los-foreground))] transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-wider">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-[hsl(var(--los-gold))]">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-wider">Zen</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 text-[hsl(var(--los-muted-foreground))] hover:text-[hsl(var(--los-foreground))] transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-wider">Growth</span>
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[hsl(var(--los-muted)/0.5)] text-[hsl(var(--los-muted-foreground))] hover:bg-[hsl(var(--los-muted))] hover:text-[hsl(var(--los-foreground))] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZenMode;
