import { Home, TrendingUp, BookOpen, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "base", icon: Home, label: "Base" },
  { id: "growth", icon: TrendingUp, label: "Growth" },
  { id: "zen", icon: Sparkles, label: "Zen" },
  { id: "journal", icon: BookOpen, label: "Journal" },
  { id: "self", icon: User, label: "Self" },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-[hsl(var(--los-glass)/0.8)] border border-[hsl(var(--los-border))] rounded-2xl px-2 py-3">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[hsl(var(--los-gold)/0.15)] rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 relative z-10 transition-colors duration-300 ${
                      isActive
                        ? "text-[hsl(var(--los-gold))]"
                        : "text-[hsl(var(--los-muted-foreground))]"
                    }`}
                  />
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium relative z-10 transition-all duration-300 ${
                      isActive
                        ? "text-[hsl(var(--los-gold))] opacity-100"
                        : "text-[hsl(var(--los-muted-foreground))] opacity-0 h-0"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
