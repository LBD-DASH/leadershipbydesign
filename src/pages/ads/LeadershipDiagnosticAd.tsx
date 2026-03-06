import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Clock, Target, Zap, ArrowRight, CheckCircle2, Shield, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackScheduleCallClick } from "@/utils/gtmEvents";

const benefits = [
  "Pinpoint your exact leadership operating level (1–5)",
  "Uncover the blind spots holding you back",
  "Get a personalised development roadmap",
  "Benchmark against 500+ South African leaders",
];

export default function LeadershipDiagnosticAd() {
  return (
    <>
      <SEO
        title="Free Leadership Assessment | What Level Leader Are You?"
        description="4-minute leadership diagnostic used by 500+ leaders. Discover your operating level across 5 dimensions and get a personalised development roadmap. Free."
        canonicalUrl="/ad/leadership-diagnostic"
        ogImage="https://leadershipbydesign.co/og-leadership-diagnostic.jpg"
        keywords="leadership assessment South Africa, leadership test, free leadership diagnostic, leadership level quiz, leadership development Johannesburg"
      />

      <div className="min-h-screen bg-background">
        {/* Minimal top bar */}
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
              { icon: Clock, label: "4 min" },
              { icon: Target, label: "20 questions" },
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
              What Level Leader{" "}
              <span className="text-primary">Are You Really?</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Most leaders overestimate their level. This free 4-minute assessment shows the <strong className="text-foreground">truth</strong> — and exactly how to level up.
            </p>
          </motion.div>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-center mb-10"
          >
            <Link to="/leadership-diagnostic" onClick={() => trackScheduleCallClick({ source: "ad-leadership-diagnostic" })}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg py-7 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Find Your Leadership Level
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">No email required · Free forever · Results in 4 minutes</p>
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

          {/* 5 Levels preview */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground text-center mb-5">The 5 Leadership Levels</h2>
            <div className="space-y-2">
              {[
                { level: "L1", name: "Productivity", desc: "Getting things done through personal effort" },
                { level: "L2", name: "Development", desc: "Growing yourself and your people" },
                { level: "L3", name: "Purpose", desc: "Leading with meaning and direction" },
                { level: "L4", name: "Motivational", desc: "Inspiring teams beyond compliance" },
                { level: "L5", name: "Strategic", desc: "Shaping the future of the organisation" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {l.level}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof + pricing indicator */}
          <div className="bg-muted/30 rounded-xl p-6 mb-10 text-center space-y-4">
            <div className="flex justify-around">
              {[
                { stat: "500+", label: "Leaders assessed" },
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
              The diagnostic is completely free. If you want personalised coaching to level up, engagements start from <strong className="text-foreground">R15,000</strong>.
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mb-8">
            <Link to="/leadership-diagnostic" onClick={() => trackScheduleCallClick({ source: "ad-leadership-diagnostic-bottom" })}>
              <Button size="lg" className="w-full text-lg py-7 rounded-xl shadow-lg">
                Take the Free Assessment Now
                <TrendingUp className="ml-2 w-5 h-5" />
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
