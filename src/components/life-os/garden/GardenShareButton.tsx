import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, Twitter, Linkedin, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GardenShareButtonProps {
  gardenRef: React.RefObject<HTMLDivElement>;
  slots: Array<{ slot_name: string; growth_level: number }>;
}

const GardenShareButton = ({ gardenRef, slots }: GardenShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const getOverallGrowth = () => {
    const total = slots.reduce((acc, slot) => acc + slot.growth_level, 0);
    return Math.round(total / slots.length);
  };

  const getShareText = () => {
    const overall = getOverallGrowth();
    const topSlot = slots.reduce((a, b) => a.growth_level > b.growth_level ? a : b);
    return `🌱 My Digital Garden Progress: ${overall}% overall growth\n\n` +
      `Strongest: ${topSlot.slot_name} (${topSlot.growth_level}%)\n\n` +
      `Growing intentionally with Life-OS 🧠✨`;
  };

  const captureGarden = async (): Promise<string | null> => {
    if (!gardenRef.current) return null;
    
    setIsCapturing(true);
    
    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(gardenRef.current, {
        backgroundColor: "#0a0a14",
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Failed to capture garden:", error);
      toast.error("Failed to capture garden image");
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await captureGarden();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `my-digital-garden-${new Date().toISOString().split("T")[0]}.png`;
    link.href = dataUrl;
    link.click();
    
    toast.success("Garden image downloaded!");
    setIsOpen(false);
  };

  const handleShare = async (platform: "twitter" | "linkedin") => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
    setIsOpen(false);
  };

  const handleCopyStats = () => {
    const text = getShareText();
    navigator.clipboard.writeText(text);
    toast.success("Stats copied to clipboard!");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-[hsl(var(--los-glass)/0.6)] border border-[hsl(var(--los-border))] 
                   hover:bg-[hsl(var(--los-gold)/0.1)] hover:border-[hsl(var(--los-gold)/0.3)] transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="w-4 h-4 text-[hsl(var(--los-gold))]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="absolute right-0 top-full mt-2 z-50 w-48 py-2 rounded-xl 
                         bg-[hsl(var(--los-background-elevated))] border border-[hsl(var(--los-border))]
                         shadow-xl backdrop-blur-xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-3 py-2 border-b border-[hsl(var(--los-border))]">
                <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-muted-foreground))]">
                  Share Progress
                </p>
                <p className="text-sm text-[hsl(var(--los-foreground))] font-medium">
                  {getOverallGrowth()}% Overall Growth
                </p>
              </div>

              <button
                onClick={handleDownload}
                disabled={isCapturing}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-[hsl(var(--los-foreground))]
                           hover:bg-[hsl(var(--los-muted)/0.5)] transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isCapturing ? "Capturing..." : "Download Image"}
              </button>

              <button
                onClick={() => handleShare("twitter")}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-[hsl(var(--los-foreground))]
                           hover:bg-[hsl(var(--los-muted)/0.5)] transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Share on X
              </button>

              <button
                onClick={() => handleShare("linkedin")}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-[hsl(var(--los-foreground))]
                           hover:bg-[hsl(var(--los-muted)/0.5)] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </button>

              <button
                onClick={handleCopyStats}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-[hsl(var(--los-foreground))]
                           hover:bg-[hsl(var(--los-muted)/0.5)] transition-colors"
              >
                <Check className="w-4 h-4" />
                Copy Stats
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GardenShareButton;
