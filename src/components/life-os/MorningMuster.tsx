import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Settings, Edit3, Check } from "lucide-react";

interface MorningMusterProps {
  displayName: string;
  northStar: string;
  onNorthStarUpdate?: (value: string) => void;
  onSettingsClick?: () => void;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const inspirationalQuotes = [
  "Master the day by mastering yourself",
  "Leadership begins within",
  "Build the life you are worthy of",
  "Today's focus shapes tomorrow's legacy",
  "Sovereignty is earned through discipline",
];

const MorningMuster = ({
  displayName,
  northStar,
  onNorthStarUpdate,
  onSettingsClick,
}: MorningMusterProps) => {
  const [isEditingNorthStar, setIsEditingNorthStar] = useState(false);
  const [editedNorthStar, setEditedNorthStar] = useState(northStar);
  const [quote] = useState(() => 
    inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]
  );

  useEffect(() => {
    setEditedNorthStar(northStar);
  }, [northStar]);

  const handleSaveNorthStar = () => {
    onNorthStarUpdate?.(editedNorthStar);
    setIsEditingNorthStar(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Top bar with logo and settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--los-gold))] to-[hsl(var(--los-gold-dim))] flex items-center justify-center">
            <Crown className="w-5 h-5 text-[hsl(var(--los-background))]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[hsl(var(--los-gold))] font-medium">
              Morning Muster
            </p>
            <p className="text-[10px] text-[hsl(var(--los-muted-foreground))] italic">
              {quote}
            </p>
          </div>
        </div>
        <button
          onClick={onSettingsClick}
          className="w-10 h-10 rounded-xl bg-[hsl(var(--los-muted))] border border-[hsl(var(--los-border))] flex items-center justify-center hover:bg-[hsl(var(--los-muted)/0.8)] transition-colors"
        >
          <Settings className="w-4 h-4 text-[hsl(var(--los-muted-foreground))]" />
        </button>
      </div>

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-[hsl(var(--los-foreground))]">
          {getGreeting()},{" "}
          <span className="text-[hsl(var(--los-gold))]">{displayName || "Sovereign"}</span>
        </h1>
      </div>

      {/* North Star Vision */}
      <div className="backdrop-blur-xl bg-[hsl(var(--los-glass)/0.6)] border border-[hsl(var(--los-border))] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-gold))] font-medium">
            Northstar Vision
          </span>
          <button
            onClick={() => {
              if (isEditingNorthStar) {
                handleSaveNorthStar();
              } else {
                setIsEditingNorthStar(true);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--los-muted))] transition-colors"
          >
            {isEditingNorthStar ? (
              <Check className="w-4 h-4 text-[hsl(var(--los-gold))]" />
            ) : (
              <Edit3 className="w-3.5 h-3.5 text-[hsl(var(--los-muted-foreground))]" />
            )}
          </button>
        </div>
        
        {isEditingNorthStar ? (
          <textarea
            value={editedNorthStar}
            onChange={(e) => setEditedNorthStar(e.target.value)}
            className="w-full bg-transparent text-[hsl(var(--los-foreground))] text-sm leading-relaxed resize-none focus:outline-none"
            rows={2}
            autoFocus
          />
        ) : (
          <p className="text-[hsl(var(--los-foreground))] text-sm leading-relaxed">
            {northStar || "Define your guiding vision..."}
          </p>
        )}
      </div>
    </motion.header>
  );
};

export default MorningMuster;
