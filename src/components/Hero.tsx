import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(58, 124, 165, 0.85) 0%, rgba(45, 99, 132, 0.75) 100%), url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80')`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight tracking-tight px-2"
        >
          Transforming Leaders<br />
          <span className="text-white/90">Driving Results</span>
        </motion.h1>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4"
        >
          <Link to="/team-diagnostic" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              For Teams
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/programmes" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              For Leaders
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
