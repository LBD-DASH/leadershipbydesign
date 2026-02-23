import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import InterestModal from "@/components/shared/InterestModal";

export default function Hero() {
  const [showInterestModal, setShowInterestModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(58, 124, 165, 0.85) 0%, rgba(45, 99, 132, 0.75) 100%), url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80')`,
          }}
        />
        
        {/* Main Content - Centered */}
        <div className="relative z-10 flex-1 flex items-center justify-center pt-8 sm:pt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-6 leading-tight tracking-tight px-2"
            >
              We Turn Managers Into Leaders<br />
              <span className="text-white/90">Who Scale Business Performance</span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-sm sm:text-lg md:text-2xl text-white/85 max-w-3xl mx-auto mb-4 sm:mb-8 px-4 font-light leading-relaxed"
            >
              90-Day Leadership System That Delivers 40% Productivity Gains
            </motion.p>
            
            {/* Primary CTA - I'm Interested */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-4 sm:mb-6"
            >
              <Button 
                onClick={() => setShowInterestModal(true)}
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 px-8 sm:px-12 py-5 sm:py-7 text-base sm:text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group w-full sm:w-auto"
              >
                <Phone className="mr-3 w-5 h-5" />
                I'm Interested
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            {/* Secondary CTAs - Diagnostics */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"
            >
              <Link to="/team-diagnostic" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-5 sm:px-8 py-3 sm:py-5 text-xs sm:text-base font-medium rounded-full transition-all duration-300 group"
                >
                  Free Team Diagnostic
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/leadership-diagnostic" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-5 sm:px-8 py-3 sm:py-5 text-xs sm:text-base font-medium rounded-full transition-all duration-300 group"
                >
                  Free Leader Diagnostic
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <InterestModal 
        open={showInterestModal} 
        onOpenChange={setShowInterestModal}
        context="Homepage Hero"
      />
    </>
  );
}
