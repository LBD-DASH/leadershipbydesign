import { motion } from "framer-motion";
import { Brain, Heart, Flame, Target } from "lucide-react";

interface GardenSlot {
  id: string;
  slot_name: string;
  growth_level: number;
  is_active: boolean;
}

interface DigitalGardenProps {
  slots: GardenSlot[];
}

const slotConfig: Record<string, { icon: typeof Brain; gradient: string }> = {
  Mind: {
    icon: Brain,
    gradient: "from-[hsl(270,60%,40%)] to-[hsl(270,60%,30%)]",
  },
  Body: {
    icon: Flame,
    gradient: "from-[hsl(152,69%,35%)] to-[hsl(152,69%,25%)]",
  },
  Soul: {
    icon: Heart,
    gradient: "from-[hsl(350,80%,45%)] to-[hsl(350,80%,35%)]",
  },
  Impact: {
    icon: Target,
    gradient: "from-[hsl(43,74%,43%)] to-[hsl(43,74%,33%)]",
  },
};

const orderedSlots = ["Mind", "Body", "Soul", "Impact"];

const DigitalGarden = ({ slots }: DigitalGardenProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--los-gold))] font-medium">
          Digital Garden
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {orderedSlots.map((slotName, index) => {
          const slot = slots.find((s) => s.slot_name === slotName);
          const config = slotConfig[slotName];
          const Icon = config?.icon || Brain;
          const growthLevel = slot?.growth_level || 0;
          const isActive = slot?.is_active !== false;

          return (
            <motion.div
              key={slotName}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className={`relative overflow-hidden rounded-2xl p-4 h-28 transition-all duration-500 ${
                isActive
                  ? "backdrop-blur-xl bg-[hsl(var(--los-glass)/0.6)] border border-[hsl(var(--los-border))]"
                  : "bg-[hsl(var(--los-muted)/0.3)] border border-[hsl(var(--los-border)/0.3)] grayscale opacity-60"
              }`}
            >
              {/* Background gradient overlay based on growth */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${config?.gradient} transition-opacity duration-500`}
                style={{ opacity: (growthLevel / 100) * 0.3 }}
              />

              {/* Glow effect when active */}
              {isActive && growthLevel > 50 && (
                <motion.div
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${config?.gradient} rounded-full blur-2xl`}
                />
              )}

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <Icon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive
                      ? "text-[hsl(var(--los-foreground))]"
                      : "text-[hsl(var(--los-muted-foreground))]"
                  }`}
                />

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-muted-foreground))] mb-0.5">
                    {slotName}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[hsl(var(--los-muted))] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${growthLevel}%` }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${config?.gradient}`}
                      />
                    </div>
                    <span className="text-xs text-[hsl(var(--los-muted-foreground))]">
                      {growthLevel}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Fog overlay when inactive */}
              {!isActive && (
                <div className="absolute inset-0 bg-[hsl(var(--los-background)/0.5)] backdrop-blur-sm" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default DigitalGarden;
