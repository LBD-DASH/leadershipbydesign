import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import { motion } from "framer-motion";
import { Clock, Target, Zap, Users, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Identify what's really blocking your team",
  "Discover if it's clarity, motivation, or leadership",
  "Get a targeted workshop recommendation",
  "Stop wasting time on the wrong interventions"
];

const socialProof = [
  { stat: "1000+", label: "Teams assessed" },
  { stat: "3", label: "Focus areas" },
  { stat: "Free", label: "No cost ever" }
];

export default function TeamDiagnosticLanding() {
  return (
    <>
      <SEO
        title="Free Team Diagnostic — SHIFT Skills Assessment | Leadership by Design"
        description="Assess your team's performance across 5 critical human skills. Identify gaps in alignment, energy, and ownership. Free diagnostic from Leadership by Design."
        canonicalUrl="/team-assessment"
        ogImage="https://leadershipbydesign.co/og-team-diagnostic.jpg"
        keywords="team assessment, team diagnostic, team performance, SHIFT assessment, team alignment, team motivation, free team quiz"
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
                <span className="font-medium">3 min</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">15 questions</span>
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
              <span className="text-4xl">🔍</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              Your Team's Real Problem
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Isn't What You Think</span>
            </h1>
            
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              <span className="font-semibold text-foreground">Most leaders fix the wrong thing.</span> This 3-minute test reveals the ONE intervention that will actually unlock your team.
            </p>

            {/* Primary CTA - Large, Thumb-Friendly */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link to="/team-diagnostic">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Start Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">
                No email required • Results in 3 minutes
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

          {/* The 3 Focus Areas Preview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="container mx-auto px-4 max-w-lg mt-10"
          >
            <h2 className="text-xl font-semibold text-foreground text-center mb-5">
              The 3 Team Blockers
            </h2>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { area: "Clarity", desc: "Direction & goals", color: "bg-blue-500", icon: "🎯" },
                { area: "Motivation", desc: "Energy & drive", color: "bg-amber-500", icon: "⚡" },
                { area: "Leadership", desc: "Trust & ownership", color: "bg-primary", icon: "👥" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`${item.color} text-white text-2xl py-3 rounded-t-lg`}>
                    {item.icon}
                  </div>
                  <div className="bg-muted/50 py-2 rounded-b-lg">
                    <div className="text-xs font-semibold text-foreground">{item.area}</div>
                    <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Which one is holding your team back?
            </p>
          </motion.section>

          {/* Secondary CTA */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="container mx-auto px-4 max-w-lg mt-10 text-center"
          >
            <Link to="/team-diagnostic">
              <Button 
                size="lg" 
                className="w-full text-lg py-6 rounded-xl shadow-lg"
              >
                Diagnose Your Team Now
                <Users className="ml-2 w-5 h-5" />
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
