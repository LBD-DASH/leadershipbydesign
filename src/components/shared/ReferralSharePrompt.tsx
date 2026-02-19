import { motion } from "framer-motion";
import { MessageCircle, Users, Share2, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ReferralSharePromptProps {
  /** What to share, e.g. "Leadership Diagnostic", "Corporate Mind Reset" */
  context: string;
  /** Optional custom message for WhatsApp */
  customMessage?: string;
  /** Optional custom URL to share (defaults to current page) */
  shareUrl?: string;
  /** Visual variant */
  variant?: "card" | "inline";
}

export default function ReferralSharePrompt({
  context,
  customMessage,
  shareUrl,
  variant = "card",
}: ReferralSharePromptProps) {
  const [copied, setCopied] = useState(false);
  const url = shareUrl || window.location.href;

  const defaultMessage = `Hey! I just completed the ${context} from Leadership by Design — really insightful. You should check it out: ${url}`;
  const message = customMessage
    ? `${customMessage} ${url}`
    : defaultMessage;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
      >
        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          Know someone who'd benefit?
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleWhatsApp}
            className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white border-0"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="gap-2"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-6 rounded-xl border border-border bg-card p-5 text-center"
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/10 mb-3">
        <Share2 className="w-5 h-5 text-[#25D366]" />
      </div>
      <h4 className="font-semibold text-foreground mb-1 text-sm">
        Know a colleague who'd benefit?
      </h4>
      <p className="text-xs text-muted-foreground mb-4">
        Share this with someone in your network — it only takes a second.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button
          onClick={handleWhatsApp}
          className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white border-0"
        >
          <MessageCircle className="w-4 h-4" />
          Share via WhatsApp
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Link Copied!" : "Copy Link"}
        </Button>
      </div>
    </motion.div>
  );
}
