import { Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const FloatingSocial = () => {
  const whatsappMessage = encodeURIComponent(
    "Hi Kevin, I'd like to explore what Leadership by Design can do for my organisation."
  );

  return (
    <>
      {/* LinkedIn - bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <a
          href="https://www.linkedin.com/in/kevinbritz-leadership/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Linkedin className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Connect</span>
        </a>
      </motion.div>

      {/* WhatsApp - bottom right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <a
          href={`https://wa.me/27000000000?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">WhatsApp</span>
        </a>
      </motion.div>
    </>
  );
};

export default FloatingSocial;
