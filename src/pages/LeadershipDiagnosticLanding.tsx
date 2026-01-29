import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import { motion } from "framer-motion";
import { Clock, Target, Zap, TrendingUp, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Pinpoint your exact leadership operating level",
  "Uncover blind spots holding you back",
  "Get a personalized development roadmap",
  "Discover your unique leadership strengths"
];

const socialProof = [
  { stat: "500+", label: "Leaders assessed" },
  { stat: "5", label: "Leadership levels" },
  { stat: "Free", label: "No cost ever" }
];

export default function LeadershipDiagnosticLanding() {
  return (
    <>
      <SEO
        title="Free Leadership Assessment | Find Your Level in 4 Minutes"
        description="Take the free leadership diagnostic used by 500+ leaders. Discover your operating level and get instant personalized development insights."
        canonicalUrl="/leader-assessment"
        keywords="leadership test, leadership assessment, free leadership quiz, leadership level, leadership diagnostic, leadership development"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />
        
        <main className="pt-20 pb-12">
          {/* Hero Section - Mobile First, TikTok Optimized */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 max-w-lg text-center"
          >
            {/* Quick Stats Bar */}
            <div className="flex justify-center gap-3 mb-5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">4 min</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">20 questions</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">Instant</span>
              </div>
            </div>

            {/* Main Headline - Punchy for Social */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-3"
            >
              <span className="text-4xl">🎯</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              What Level Leader
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Are You Really?</span>
            </h1>
            
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              <span className="font-semibold text-foreground">Most leaders overestimate their level.</span> This 4-minute test shows you the truth — and exactly how to level up.
            </p>

            {/* Primary CTA - Large, Thumb-Friendly */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link to="/leadership-diagnostic">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Start Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">
                No email required • Results in 4 minutes
              </p>
            </motion.div>
          </motion.section>

          {/* Social Proof Strip */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="container mx-auto px-4 max-w-lg mt-10"
          >
            <div className="flex justify-around py-4 bg-muted/30 rounded-xl">
              {socialProof.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">{item.stat}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Benefits Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="container mx-auto px-4 max-w-lg mt-10"
          >
            <h2 className="text-xl font-semibold text-foreground text-center mb-5">
              What You'll Discover
            </h2>
            
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border/50"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* The 5 Levels Preview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="container mx-auto px-4 max-w-lg mt-10"
          >
            <h2 className="text-xl font-semibold text-foreground text-center mb-5">
              The 5 Leadership Levels
            </h2>
            
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { level: "L1", name: "Productivity", color: "bg-blue-500" },
                { level: "L2", name: "Development", color: "bg-teal-500" },
                { level: "L3", name: "Purpose", color: "bg-amber-500" },
                { level: "L4", name: "Motivational", color: "bg-orange-500" },
                { level: "L5", name: "Strategic", color: "bg-primary" }
              ].map((level, index) => (
                <div key={index} className="text-center">
                  <div className={`${level.color} text-white text-xs font-bold py-2 rounded-t-lg`}>
                    {level.level}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground bg-muted/50 py-2 rounded-b-lg leading-tight px-1">
                    {level.name}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Which level matches your leadership style?
            </p>
          </motion.section>

          {/* Secondary CTA */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="container mx-auto px-4 max-w-lg mt-10 text-center"
          >
            <Link to="/leadership-diagnostic">
              <Button 
                size="lg" 
                className="w-full text-lg py-6 rounded-xl shadow-lg"
              >
                Find Your Level Now
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.section>

          {/* Trust Footer */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="container mx-auto px-4 max-w-lg mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>Backed by the SHIFT Methodology™</span>
            </div>
          </motion.section>
        </main>
        
        <Footer />
        <FloatingSocial />
      </div>
    </>
  );
}
