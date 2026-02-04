import { motion } from "framer-motion";

interface GrowthPlantProps {
  type: "Mind" | "Body" | "Soul" | "Impact";
  growthLevel: number; // 0-100
  isActive: boolean;
}

const plantConfigs = {
  Mind: {
    // Crystal/gem that grows upward
    color1: "hsl(270, 60%, 50%)",
    color2: "hsl(270, 60%, 35%)",
    glowColor: "hsl(270, 60%, 60%)",
  },
  Body: {
    // Strong tree with branches
    color1: "hsl(152, 69%, 45%)",
    color2: "hsl(152, 69%, 30%)",
    glowColor: "hsl(152, 69%, 55%)",
  },
  Soul: {
    // Flowering lotus
    color1: "hsl(350, 80%, 55%)",
    color2: "hsl(350, 80%, 40%)",
    glowColor: "hsl(350, 80%, 65%)",
  },
  Impact: {
    // Radiating sun/star
    color1: "hsl(43, 74%, 53%)",
    color2: "hsl(43, 74%, 38%)",
    glowColor: "hsl(43, 74%, 63%)",
  },
};

const GrowthPlant = ({ type, growthLevel, isActive }: GrowthPlantProps) => {
  const config = plantConfigs[type];
  const progress = growthLevel / 100;
  const scale = 0.3 + progress * 0.7; // Scale from 30% to 100%

  // Crystal/Gem for Mind
  if (type === "Mind") {
    return (
      <motion.svg
        viewBox="0 0 60 80"
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isActive ? 1 : 0.3, 
          scale: isActive ? scale : 0.3,
          filter: isActive && growthLevel > 50 ? `drop-shadow(0 0 ${growthLevel / 10}px ${config.glowColor})` : "none"
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Base crystal */}
        <motion.polygon
          points="30,5 50,40 30,75 10,40"
          fill={`url(#crystal-gradient-${type})`}
          stroke={config.color1}
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        {/* Inner facet */}
        <motion.polygon
          points="30,15 42,40 30,65 18,40"
          fill={config.color2}
          opacity={0.6}
          initial={{ scale: 0 }}
          animate={{ scale: progress > 0.3 ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        {/* Highlight */}
        <motion.polygon
          points="22,25 30,15 35,30"
          fill="white"
          opacity={0.3}
        />
        {/* Growth sparkles */}
        {progress > 0.7 && (
          <>
            <motion.circle
              cx="15"
              cy="20"
              r="2"
              fill="white"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0 }}
            />
            <motion.circle
              cx="45"
              cy="25"
              r="1.5"
              fill="white"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.7 }}
            />
          </>
        )}
        <defs>
          <linearGradient id={`crystal-gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.color1} />
            <stop offset="100%" stopColor={config.color2} />
          </linearGradient>
        </defs>
      </motion.svg>
    );
  }

  // Tree for Body
  if (type === "Body") {
    const branchCount = Math.floor(progress * 4);
    return (
      <motion.svg
        viewBox="0 0 60 80"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isActive ? 1 : 0.3,
          filter: isActive && growthLevel > 50 ? `drop-shadow(0 0 ${growthLevel / 10}px ${config.glowColor})` : "none"
        }}
        transition={{ duration: 0.8 }}
      >
        {/* Trunk */}
        <motion.rect
          x="27"
          y="45"
          width="6"
          height="30"
          fill={config.color2}
          rx="2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ originY: 1 }}
          transition={{ duration: 0.6 }}
        />
        {/* Main canopy */}
        <motion.ellipse
          cx="30"
          cy="35"
          rx={8 + progress * 12}
          ry={6 + progress * 14}
          fill={`url(#tree-gradient-${type})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        {/* Branch layers */}
        {branchCount >= 1 && (
          <motion.ellipse
            cx="20"
            cy="40"
            rx={4 + progress * 6}
            ry={3 + progress * 5}
            fill={config.color1}
            initial={{ scale: 0, x: 10 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        )}
        {branchCount >= 2 && (
          <motion.ellipse
            cx="40"
            cy="38"
            rx={4 + progress * 6}
            ry={3 + progress * 5}
            fill={config.color1}
            initial={{ scale: 0, x: -10 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          />
        )}
        {branchCount >= 3 && (
          <motion.ellipse
            cx="30"
            cy="22"
            rx={3 + progress * 5}
            ry={2 + progress * 4}
            fill={config.color1}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          />
        )}
        <defs>
          <linearGradient id={`tree-gradient-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={config.color1} />
            <stop offset="100%" stopColor={config.color2} />
          </linearGradient>
        </defs>
      </motion.svg>
    );
  }

  // Lotus for Soul
  if (type === "Soul") {
    const petalCount = Math.max(3, Math.floor(progress * 8));
    return (
      <motion.svg
        viewBox="0 0 60 80"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isActive ? 1 : 0.3,
          filter: isActive && growthLevel > 50 ? `drop-shadow(0 0 ${growthLevel / 10}px ${config.glowColor})` : "none"
        }}
        transition={{ duration: 0.8 }}
      >
        {/* Water base */}
        <motion.ellipse
          cx="30"
          cy="65"
          rx="20"
          ry="6"
          fill="hsl(200, 60%, 30%)"
          opacity={0.5}
        />
        {/* Stem */}
        <motion.path
          d="M30 65 Q28 50 30 40"
          stroke={config.color2}
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
        {/* Petals */}
        {Array.from({ length: petalCount }).map((_, i) => {
          const angle = (i * 360) / petalCount - 90;
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.ellipse
              key={i}
              cx={30 + Math.cos(rad) * 8}
              cy={35 + Math.sin(rad) * 8}
              rx={4 + progress * 4}
              ry={8 + progress * 6}
              fill={i % 2 === 0 ? config.color1 : config.color2}
              transform={`rotate(${angle + 90}, ${30 + Math.cos(rad) * 8}, ${35 + Math.sin(rad) * 8})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            />
          );
        })}
        {/* Center */}
        <motion.circle
          cx="30"
          cy="35"
          r={3 + progress * 3}
          fill="hsl(43, 74%, 53%)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
      </motion.svg>
    );
  }

  // Sun/Star for Impact
  return (
    <motion.svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3,
        filter: isActive && growthLevel > 50 ? `drop-shadow(0 0 ${growthLevel / 10}px ${config.glowColor})` : "none"
      }}
      transition={{ duration: 0.8 }}
    >
      {/* Core */}
      <motion.circle
        cx="30"
        cy="40"
        r={6 + progress * 6}
        fill={`url(#sun-gradient-${type})`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      {/* Rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const rayLength = 8 + progress * 12;
        const innerR = 8 + progress * 6;
        return (
          <motion.line
            key={i}
            x1={30 + Math.cos(angle) * innerR}
            y1={40 + Math.sin(angle) * innerR}
            x2={30 + Math.cos(angle) * (innerR + rayLength)}
            y2={40 + Math.sin(angle) * (innerR + rayLength)}
            stroke={config.color1}
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: progress > 0.2 ? 1 : 0, 
              opacity: progress > 0.2 ? 1 : 0 
            }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
          />
        );
      })}
      {/* Pulse effect for high growth */}
      {progress > 0.8 && (
        <motion.circle
          cx="30"
          cy="40"
          r={6 + progress * 6}
          stroke={config.glowColor}
          strokeWidth="2"
          fill="none"
          animate={{
            r: [12 + progress * 6, 20 + progress * 8],
            opacity: [0.6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeOut",
          }}
        />
      )}
      <defs>
        <radialGradient id={`sun-gradient-${type}`}>
          <stop offset="0%" stopColor={config.color1} />
          <stop offset="100%" stopColor={config.color2} />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

export default GrowthPlant;
