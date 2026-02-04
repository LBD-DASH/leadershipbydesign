import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "./BottomNav";

interface LifeOSLayoutProps {
  children: ReactNode;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const LifeOSLayout = ({ children, onTabChange, activeTab = "base" }: LifeOSLayoutProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="life-os min-h-screen bg-[hsl(var(--los-background))] text-[hsl(var(--los-foreground))]">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--los-gold)/0.03)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[hsl(var(--los-wisdom)/0.03)] rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Bottom navigation */}
      <BottomNav activeTab={currentTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default LifeOSLayout;
