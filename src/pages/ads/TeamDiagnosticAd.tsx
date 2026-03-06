import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Clock, Target, Zap, ArrowRight, CheckCircle2, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackScheduleCallClick } from "@/utils/gtmEvents";
import BookingWidget from "@/components/shared/BookingWidget";

const benefits = [
  "Identify what's really blocking your team in 3 minutes",
  "Discover if it's clarity, motivation, or leadership gaps",
  "Get a targeted workshop recommendation instantly",
  "Stop wasting budget on the wrong interventions",
];

export default function TeamDiagnosticAd() {
  return (
    <>
      <SEO
        title="Free Team Diagnostic | Find What's Really Blocking Your Team"
        description="3-minute team assessment used by 1,000+ South African teams. Identify if your team's real problem is clarity, motivation, or leadership — and get a fix."
        canonicalUrl="/ad/team-diagnostic"
        ogImage="https://leadershipbydesign.co/og-team-diagnostic.jpg"
        keywords="team assessment South Africa, team diagnostic, team performance tool, free team quiz, team alignment assessment"
      />

      <div className="min-h-screen bg-background">
        {/* Minimal top bar — no navigation */}
        <div className="border-b border-border/50 bg-card">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-3xl">
            <span className="font-serif text-lg font-bold text-primary">Leadership by Design</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" /> South Africa
            </span>
          </div>
        </div>

        <main className="container mx-auto px-4 max-w-2xl py-8 sm:py-12">
          {/* Quick stats */}
          <div className="flex justify-center gap-3 mb-6">
            {[
              { icon: Clock, label: "3 min" },
              { icon: Target, label: "15 questions" },
              { icon: Zap, label: "Instant results" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Your Team's Real Problem{" "}
              <span className="text-primary">Isn't What You Think</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Most leaders fix the wrong thing. This free 3-minute diagnostic reveals the <strong className="text-foreground">ONE intervention</strong> that will actually unlock your team.
            </p>
          </motion.div>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-center mb-10"
          >
            <Link to="/team-diagnostic" onClick={() => trackScheduleCallClick({ source: "ad-team-diagnostic" })}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg py-7 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Team Diagnostic
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">No email required · Free forever · Results in 3 minutes</p>
          </motion.div>

          {/* Benefits */}
          <div className="space-y-3 mb-10">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border/50">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{b}</span>
              </div>
            ))}
          </div>

          {/* The 3 Focus Areas */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground text-center mb-5">We Assess 3 Critical Areas</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { area: "Clarity", desc: "Direction & goals", emoji: "🎯" },
                { area: "Motivation", desc: "Energy & drive", emoji: "⚡" },
                { area: "Leadership", desc: "Trust & ownership", emoji: "👥" },
              ].map((item, i) => (
                <div key={i} className="text-center bg-card rounded-xl border border-border/50 p-4">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="text-sm font-semibold text-foreground">{item.area}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof + pricing indicator */}
          <div className="bg-muted/30 rounded-xl p-6 mb-10 text-center space-y-4">
            <div className="flex justify-around">
              {[
                { stat: "1,000+", label: "Teams assessed" },
                { stat: "Free", label: "Always" },
                { stat: "🇿🇦", label: "South Africa" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-xl font-bold text-primary">{s.stat}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              The diagnostic is completely free. If you want help fixing what it finds, our workshops start from <strong className="text-foreground">R25,000</strong> and coaching from <strong className="text-foreground">R15,000</strong>.
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mb-8">
            <Link to="/team-diagnostic" onClick={() => trackScheduleCallClick({ source: "ad-team-diagnostic-bottom" })}>
              <Button size="lg" className="w-full text-lg py-7 rounded-xl shadow-lg">
                Diagnose Your Team Now — Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Trust footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pb-6">
            <Shield className="w-4 h-4" />
            <span>Backed by the SHIFT Methodology™ · No spam · No sales calls</span>
          </div>
        </main>
      </div>
    </>
  );
}
