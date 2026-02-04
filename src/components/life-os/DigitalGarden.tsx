import { useRef } from "react";
import { motion } from "framer-motion";
import GrowthPlant from "./garden/GrowthPlant";
import MilestoneParticles from "./garden/MilestoneParticles";
import FogOverlay from "./garden/FogOverlay";
import GardenShareButton from "./garden/GardenShareButton";

interface GardenSlot {
  id: string;
  slot_name: string;
  growth_level: number;
  is_active: boolean;
}

interface DigitalGardenProps {
  slots: GardenSlot[];
}

const orderedSlots = ["Mind", "Body", "Soul", "Impact"];

const DigitalGarden = ({ slots }: DigitalGardenProps) => {
  const gardenRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--los-gold))] font-medium">
          Digital Garden
        </span>
        <GardenShareButton gardenRef={gardenRef} slots={slots} />
      </div>

      <div ref={gardenRef} className="grid grid-cols-2 gap-3 p-2 rounded-2xl bg-[hsl(var(--los-background))]">
        {orderedSlots.map((slotName, index) => {
          const slot = slots.find((s) => s.slot_name === slotName);
          const growthLevel = slot?.growth_level || 0;
          const isActive = slot?.is_active !== false;

          return (
            <motion.div
              key={slotName}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl h-32 backdrop-blur-xl 
                         bg-[hsl(var(--los-glass)/0.6)] border border-[hsl(var(--los-border))]"
            >
              {/* Background gradient based on growth */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: isActive 
                    ? `radial-gradient(circle at 50% 80%, 
                        hsla(var(--los-${slotName.toLowerCase() === 'mind' ? 'wisdom' : 
                          slotName.toLowerCase() === 'body' ? 'vitality' : 
                          slotName.toLowerCase() === 'soul' ? 'connection' : 'sovereignty'
                        }), ${growthLevel / 100 * 0.3}) 0%, 
                        transparent 70%)`
                    : "none"
                }}
                transition={{ duration: 0.8 }}
              />

              {/* Animated SVG Plant */}
              <div className="absolute inset-0 flex items-center justify-center p-3">
                <GrowthPlant 
                  type={slotName as "Mind" | "Body" | "Soul" | "Impact"} 
                  growthLevel={growthLevel} 
                  isActive={isActive} 
                />
              </div>

              {/* Milestone Particles */}
              <MilestoneParticles 
                isActive={isActive} 
                growthLevel={growthLevel} 
                slotName={slotName}
              />

              {/* Dynamic Fog Overlay */}
              <FogOverlay growthLevel={growthLevel} isActive={isActive} />

              {/* Label and Progress */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-muted-foreground))] mb-1">
                  {slotName}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[hsl(var(--los-muted))] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${growthLevel}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, 
                          hsl(var(--los-${slotName.toLowerCase() === 'mind' ? 'wisdom' : 
                            slotName.toLowerCase() === 'body' ? 'vitality' : 
                            slotName.toLowerCase() === 'soul' ? 'connection' : 'sovereignty'
                          })) 0%, 
                          hsl(var(--los-gold)) 100%)`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[hsl(var(--los-foreground))]">
                    {growthLevel}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall garden health indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 pt-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-muted-foreground))]">
          Garden Health
        </span>
        <span className="text-sm font-medium text-[hsl(var(--los-gold))]">
          {Math.round(slots.reduce((acc, slot) => acc + slot.growth_level, 0) / slots.length)}%
        </span>
      </motion.div>
    </motion.section>
  );
};

export default DigitalGarden;
