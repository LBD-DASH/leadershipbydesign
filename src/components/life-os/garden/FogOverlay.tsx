import { motion } from "framer-motion";

interface FogOverlayProps {
  growthLevel: number;
  isActive: boolean;
}

const FogOverlay = ({ growthLevel, isActive }: FogOverlayProps) => {
  // Fog clears as growth increases: 100% fog at 0 growth, 0% fog at 100 growth
  // Inactive slots always have heavy fog
  const fogOpacity = isActive 
    ? Math.max(0, 0.7 - (growthLevel / 100) * 0.7)
    : 0.8;

  const blurAmount = isActive 
    ? Math.max(0, 8 - (growthLevel / 100) * 8)
    : 10;

  // No fog overlay needed if growth is high and active
  if (isActive && growthLevel >= 90) {
    return null;
  }

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Base fog layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsla(var(--los-background), ${fogOpacity * 0.8}) 0%, 
            hsla(var(--los-background), ${fogOpacity}) 50%,
            hsla(var(--los-background), ${fogOpacity * 0.9}) 100%)`,
          backdropFilter: `blur(${blurAmount}px)`,
        }}
        animate={{
          opacity: fogOpacity > 0 ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Animated fog wisps */}
      {fogOpacity > 0.2 && (
        <>
          <motion.div
            className="absolute w-full h-1/2 bottom-0"
            style={{
              background: `radial-gradient(ellipse 100% 60% at 30% 100%, 
                hsla(var(--los-muted), ${fogOpacity * 0.6}) 0%, 
                transparent 70%)`,
            }}
            animate={{
              x: ["-10%", "10%", "-10%"],
              opacity: [fogOpacity * 0.6, fogOpacity * 0.8, fogOpacity * 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-full h-1/2 bottom-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 70% 100%, 
                hsla(var(--los-muted), ${fogOpacity * 0.5}) 0%, 
                transparent 60%)`,
            }}
            animate={{
              x: ["10%", "-10%", "10%"],
              opacity: [fogOpacity * 0.5, fogOpacity * 0.7, fogOpacity * 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}

      {/* Inactive overlay message */}
      {!isActive && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-muted-foreground))] opacity-60">
            Dormant
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FogOverlay;
