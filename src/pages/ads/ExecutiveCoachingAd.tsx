import { useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, MapPin, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import InterestModal from "@/components/shared/InterestModal";
import BookingWidget from "@/components/shared/BookingWidget";
import { trackScheduleCallClick } from "@/utils/gtmEvents";

const outcomes = [
  "40% average productivity increase within 90 days",
  "Shape the leadership identity your organisation catches from you",
  "Build influence that transcends your job title",
  "Create a legacy that survives your exit",
];

const tiers = [
  {
    name: "Foundation",
    price: "R15,000",
    sessions: "6 sessions",
    best: "Leaders starting their identity journey",
    features: ["6 × 90-min coaching sessions", "Contagious Identity Workbook", "Personal Identity Blueprint", "Email support between sessions"],
  },
  {
    name: "Executive",
    price: "R45,000",
    sessions: "12 sessions",
    best: "Leaders ready to embed their identity",
    highlight: true,
    features: ["12 × 90-min coaching sessions", "360° Identity Assessment", "Stakeholder interviews (5 people)", "Implementation support", "Priority access"],
  },
  {
    name: "Strategic",
    price: "R75,000",
    sessions: "Full engagement",
    best: "Leaders building lasting legacy",
    features: ["Everything in Executive", "Team identity workshops", "Succession identity planning", "6-month follow-up session"],
  },
];

export default function ExecutiveCoachingAd() {
  const [showModal, setShowModal] = useState(false);

  const handleCTA = () => {
    trackScheduleCallClick({ source: "ad-executive-coaching" });
    setShowModal(true);
  };

  return (
    <>
      <SEO
        title="Executive Coaching South Africa | From R15,000 | Leadership by Design"
        description="Identity-driven executive coaching for senior leaders in South Africa. 6-session programme from R15,000. Shape how your leadership lands with others."
        canonicalUrl="/ad/executive-coaching"
        ogImage="https://leadershipbydesign.co/og-contagious-identity.jpg"
        keywords="executive coaching South Africa, leadership coaching Johannesburg, CEO coaching, executive coaching Gauteng, leadership development South Africa"
      />

      <div className="min-h-screen bg-background">
        {/* Minimal top bar */}
        <div className="border-b border-border/50 bg-card">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-3xl">
            <span className="font-serif text-lg font-bold text-primary">Leadership by Design</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" /> Gauteng, South Africa
            </span>
          </div>
        </div>

        <main className="container mx-auto px-4 max-w-3xl py-8 sm:py-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center gap-3 mb-5">
              {[
                { icon: Clock, label: "90-day system" },
                { icon: Users, label: "1-on-1 coaching" },
                { icon: Star, label: "Senior leaders" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Executive Coaching That{" "}
              <span className="text-primary">Shapes Your Leadership Identity</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Your people aren't experiencing your strategy — they're experiencing <strong className="text-foreground">you</strong>. This coaching makes that intentional.
            </p>
          </motion.div>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-center mb-10"
          >
            <Button
              size="lg"
              onClick={handleCTA}
              className="w-full sm:w-auto text-lg py-7 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start the Conversation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-3">Free exploratory call · No obligation · Confidential</p>
          </motion.div>

          {/* Outcomes */}
          <div className="space-y-3 mb-12">
            <h2 className="text-xl font-semibold text-foreground text-center mb-5">What Clients Achieve</h2>
            {outcomes.map((o, i) => (
              <div key={i} className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border/50">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{o}</span>
              </div>
            ))}
          </div>

          {/* Pricing tiers */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-foreground text-center mb-2">Clear Pricing</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">No hidden fees. Choose the depth that fits your needs.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {tiers.map((t, i) => (
                <div
                  key={i}
                  className={`bg-card rounded-xl p-5 border ${t.highlight ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-border/50"} flex flex-col`}
                >
                  {t.highlight && (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Most popular</span>
                  )}
                  <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
                  <div className="text-2xl font-bold text-primary mt-1">{t.price}</div>
                  <div className="text-xs text-muted-foreground mb-3">{t.sessions}</div>
                  <ul className="space-y-2 flex-1">
                    {t.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleCTA}
                    variant={t.highlight ? "default" : "outline"}
                    className="mt-4 w-full rounded-lg"
                    size="sm"
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-muted/30 rounded-xl p-6 mb-10">
            <blockquote className="text-sm text-foreground italic text-center leading-relaxed">
              "Within 3 months, our team productivity increased 40%. Kevin's coaching completely transformed how I approach leadership."
            </blockquote>
            <p className="text-xs text-muted-foreground text-center mt-3">
              — Sarah Mitchell, CEO, Tech Innovations Ltd
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mb-8">
            <Button size="lg" onClick={handleCTA} className="w-full text-lg py-7 rounded-xl shadow-lg">
              Book Your Free Exploratory Call
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Trust footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pb-6">
            <Shield className="w-4 h-4" />
            <span>Confidential · Based in Gauteng · Serving leaders across South Africa</span>
          </div>
        </main>
      </div>

      <InterestModal
        open={showModal}
        onOpenChange={setShowModal}
        context="Executive Coaching Ad Landing Page"
      />
    </>
  );
}
