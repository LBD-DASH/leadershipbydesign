import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

interface MilestoneParticlesProps {
  isActive: boolean;
  growthLevel: number;
  slotName: string;
}

const particleColors: Record<string, string[]> = {
  Mind: ["hsl(270, 60%, 70%)", "hsl(280, 50%, 60%)", "hsl(260, 70%, 80%)"],
  Body: ["hsl(152, 69%, 55%)", "hsl(140, 60%, 50%)", "hsl(160, 70%, 65%)"],
  Soul: ["hsl(350, 80%, 70%)", "hsl(340, 70%, 65%)", "hsl(0, 60%, 75%)"],
  Impact: ["hsl(43, 74%, 63%)", "hsl(35, 80%, 55%)", "hsl(50, 70%, 70%)"],
};

const MilestoneParticles = ({ isActive, growthLevel, slotName }: MilestoneParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showBurst, setShowBurst] = useState(false);
  const [prevLevel, setPrevLevel] = useState(growthLevel);

  // Detect milestone crossings (25, 50, 75, 100)
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const crossedMilestone = milestones.find(
      (m) => prevLevel < m && growthLevel >= m
    );

    if (crossedMilestone && isActive) {
      setShowBurst(true);
      // Generate burst particles
      const colors = particleColors[slotName] || particleColors.Mind;
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 60,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
      
      setTimeout(() => {
        setShowBurst(false);
        setParticles([]);
      }, 1500);
    }

    setPrevLevel(growthLevel);
  }, [growthLevel, prevLevel, isActive, slotName]);

  // Ambient particles for high growth levels
  const ambientParticleCount = growthLevel > 75 ? 3 : growthLevel > 50 ? 2 : 0;
  const colors = particleColors[slotName] || particleColors.Mind;

  return (
    <>
      {/* Burst particles on milestone */}
      <AnimatePresence>
        {showBurst && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1, 0],
              y: [0, -30 - Math.random() * 20],
              x: [(Math.random() - 0.5) * 40],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Ambient floating particles */}
      {isActive && Array.from({ length: ambientParticleCount }).map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            backgroundColor: colors[i % colors.length],
            boxShadow: `0 0 4px ${colors[i % colors.length]}`,
          }}
          initial={{ 
            left: `${20 + Math.random() * 60}%`, 
            top: `${70 + Math.random() * 20}%`,
            opacity: 0 
          }}
          animate={{
            y: [-20, -60 - Math.random() * 40],
            opacity: [0, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 20],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 2,
            delay: i * 1.2,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

export default MilestoneParticles;
