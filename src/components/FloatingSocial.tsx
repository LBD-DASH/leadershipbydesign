import { useState, useEffect } from "react";
import { Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const FloatingSocial = () => {
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      setNearBottom(distanceFromBottom < 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (nearBottom) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-20 sm:bottom-6 left-6 z-50 flex flex-col gap-3"
    >
      <a
        href="https://www.linkedin.com/in/kevinbritz-leadership/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Connect on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Connect</span>
      </a>
    </motion.div>
  );
};

export default FloatingSocial;
