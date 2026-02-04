import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLifeOS } from "@/hooks/useLifeOS";
import LifeOSLayout from "@/components/life-os/LifeOSLayout";
import MorningMuster from "@/components/life-os/MorningMuster";
import OneBigMove from "@/components/life-os/OneBigMove";
import LeadershipScorecard from "@/components/life-os/LeadershipScorecard";
import DigitalGarden from "@/components/life-os/DigitalGarden";
import ZenMode from "@/components/life-os/ZenMode";

const LifeOS = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    profile,
    pillars,
    focusTasks,
    gardenSlots,
    currentTask,
    loading,
    updateProfile,
    addFocusTask,
    setCurrentTask,
    completeTask,
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState("base");
  const [isZenMode, setIsZenMode] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/life-os/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Keyboard shortcut for Zen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    if (tab === "zen") {
      setIsZenMode(true);
    } else {
      setActiveTab(tab);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="life-os min-h-screen bg-[hsl(var(--los-background))] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-12 h-12 border-2 border-[hsl(var(--los-gold))] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <LifeOSLayout activeTab={activeTab} onTabChange={handleTabChange}>
        <div className="space-y-6">
          {/* Morning Muster Header */}
          <MorningMuster
            displayName={profile?.display_name || "Sovereign"}
            northStar={profile?.north_star_vision || ""}
            onNorthStarUpdate={(value) => updateProfile({ north_star_vision: value })}
          />

          {/* One Big Move Selector */}
          <OneBigMove
            tasks={focusTasks}
            currentTask={currentTask || null}
            onAddTask={addFocusTask}
            onSelectTask={setCurrentTask}
            onToggleZen={() => setIsZenMode(true)}
          />

          {/* Leadership Scorecard */}
          <LeadershipScorecard pillars={pillars} />

          {/* Digital Garden */}
          <DigitalGarden slots={gardenSlots} />
        </div>
      </LifeOSLayout>

      {/* Zen Mode Overlay */}
      <ZenMode
        isActive={isZenMode}
        onClose={() => setIsZenMode(false)}
        currentTask={currentTask || null}
        onCompleteTask={() => {
          if (currentTask) {
            completeTask(currentTask.id);
            setIsZenMode(false);
          }
        }}
      />
    </>
  );
};

export default LifeOS;
