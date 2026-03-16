import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { X, Gift, CheckCircle, ArrowLeft, TrendingUp, Zap, Clock, Download } from "lucide-react";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import { motion, AnimatePresence } from "framer-motion";
import newManagerHero from "@/assets/new-manager-hero.jpg";
import newManagerStruggle from "@/assets/new-manager-struggle.jpg";
import newManagerSuccess from "@/assets/new-manager-success.jpg";

const featurePills = [
  "5 Conversation Scripts",
  "1-on-1 Framework",
  "Self-Assessment",
  "30-60-90 Plan",
];

const painPoints = [
  "You don't know what to say in your first team meeting",
  "Your 1-on-1s feel awkward and unstructured",
  "You're avoiding a difficult conversation",
  "Former peers now report to you — and it's weird",
  "Working longer hours but getting less done",
  "Your boss expects results but hasn't defined 'good'",
];

const modules = [
  {
    number: "01",
    title: "Leadership Style Self-Assessment",
    description: "Scored diagnostic to identify your style — Driver, Connector, or Strategist — with guidance on when to flex each.",
  },
  {
    number: "02",
    title: "The 5 Critical Conversations",
    description: "Word-for-word scripts for trust-building: Expectation-Setting, Team Norms, Managing Up, and the Day 30 Feedback Loop.",
  },
  {
    number: "03",
    title: "1-on-1 Meeting Framework",
    description: "A proven 30-minute structure with time blocks, coaching questions, and non-negotiable rules.",
  },
  {
    number: "04",
    title: "30-60-90 Day Action Plan",
    description: "Phase-by-phase checklist. Days 1-30: Listen. Days 31-60: Build. Days 61-90: Accelerate.",
  },
  {
    number: "05",
    title: "Ready-to-Use Templates",
    description: "1-on-1 Notes, Team Norms Agreement, and Weekly Manager Reflection — printable and ready.",
  },
];

const personas = [
  {
    title: "Newly Promoted Manager",
    description: "You just got the title and want to start strong.",
  },
  {
    title: "Team Lead Moving Up",
    description: "You've led projects but never managed people.",
  },
  {
    title: "HR / L&D Professional",
    description: "Need a practical onboarding resource for first-time managers.",
  },
  {
    title: "Founder Hiring First Team",
    description: "Your business is growing and you need a framework — fast.",
  },
];

// Pricing CTA component — optimized for thumb reach on mobile
const PricingCTA = ({ onCheckout }: { onCheckout: () => void }) => (
  <div className="text-center px-2">
    {/* Speed indicators */}
    <div className="flex justify-center gap-4 mb-3">
      <span className="inline-flex items-center gap-1 text-xs text-white/80">
        <Zap className="w-3 h-3" />
        Instant
      </span>
      <span className="inline-flex items-center gap-1 text-xs text-white/80">
        <Clock className="w-3 h-3" />
        30 sec
      </span>
      <span className="inline-flex items-center gap-1 text-xs text-white/80">
        <Download className="w-3 h-3" />
        PDF
      </span>
    </div>

    <div className="mb-3">
      <span className="text-white/60 line-through text-base mr-2">R1,497</span>
      <motion.span 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-4xl md:text-5xl font-bold inline-block text-primary-foreground"
      >
        R497
      </motion.span>
    </div>
    <p className="text-white/70 text-xs mb-3">
      🔥 67% OFF • Limited time
    </p>
    <Button
      onClick={onCheckout}
      size="lg"
      className="text-base font-bold w-full max-w-sm min-h-[56px] bg-primary-foreground text-primary hover:bg-white transition-all duration-300 hover:shadow-lg rounded-xl"
    >
      GET INSTANT ACCESS →
    </Button>
    <p className="text-white/50 text-[11px] mt-3">
      ✓ Secure checkout • ✓ Works on any device
    </p>
  </div>
);

export default function NewManagerKit() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);
  const lastScrollY = useRef(0);
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-direction downsell banner logic
  useEffect(() => {
    const dismissed = sessionStorage.getItem("downsell-dismissed");
    if (dismissed) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      
      // Show when scrolling UP and past the hero
      if (currentY < lastScrollY.current && currentY > 300 && heroBottom < 0) {
        setShowDownsell(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismissDownsell = () => {
    setShowDownsell(false);
    sessionStorage.setItem("downsell-dismissed", "true");
  };

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen scroll-smooth">
      <SEO
        title="The New Manager Survival Kit — Your First 90 Days | Leadership by Design"
        description="The complete 90-day roadmap for first-time managers. Leadership self-assessment, 5 conversation scripts, 1-on-1 framework, 30-60-90 day plan, and templates. R497."
        canonicalUrl="/new-manager-kit"
        ogImage="https://leadershipbydesign.co/og-products.jpg"
        keywords="new manager kit, first 90 days, management training, team leadership, 1-on-1 meetings, leadership scripts, new manager"
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        productName="The New Manager Survival Kit"
        price={497}
        priceDisplay="R497"
        orderBump={{
          title: "Manager Scripts Vault",
          price: 147,
          priceDisplay: "R147",
          description: "3 plug-and-play conversation scripts: First 1:1, Addressing Underperformance, Running Your First Team Meeting.",
        }}
      />

      {/* HERO — Compact for mobile, content above fold */}
      <section ref={heroRef} className="relative py-8 sm:py-12 md:py-24 px-4 overflow-hidden bg-primary">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src={newManagerHero} 
            alt="Professional coaching session" 
            className="w-full h-full object-cover object-top opacity-20"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-primary" />
        </div>

        {/* Top Seller Badge */}
        <motion.div 
          className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-8 md:left-8 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold shadow-lg bg-primary-foreground text-primary"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <TrendingUp className="w-3 h-3" />
            <span>🔥 TOP SELLER</span>
          </motion.div>
        </motion.div>

        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Back Button */}
          <Link 
            to="/products" 
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-5 sm:mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Products</span>
          </Link>

          {/* Badge */}
          <div className="flex justify-center mb-4 sm:mb-8">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              Digital Leadership Product
            </span>
          </div>

          {/* Headline — tighter on mobile */}
          <h1 className="text-center mb-3 sm:mb-4">
            <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-1">
              The New Manager
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif bg-gradient-to-r from-white via-primary-foreground to-white bg-clip-text text-transparent">
              Survival Kit 🚀
            </span>
          </h1>

          {/* Subheading — shorter on mobile */}
          <p className="text-center text-white/80 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-5 sm:mb-8 leading-relaxed px-2">
            Your complete 90-day roadmap from "just promoted" to trusted leader — with exact scripts, frameworks & templates.
          </p>

          {/* Feature pills — 2-col grid on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 mb-6 sm:mb-10 max-w-sm sm:max-w-none mx-auto">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-primary-foreground/40 text-primary-foreground text-center"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Pricing CTA */}
          <PricingCTA onCheckout={handleOpenCheckout} />
        </div>
      </section>

      {/* SOCIAL PROOF BAR — compact */}
      <section className="py-3 sm:py-6 px-4 bg-background border-y border-border">
        <p className="text-center text-muted-foreground text-xs sm:text-sm font-medium">
          Built on 11 years developing 4,000+ leaders across 50+ organisations
        </p>
      </section>

      {/* PROBLEM SECTION — stacked on mobile */}
      <section className="py-10 sm:py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Image — smaller aspect ratio on mobile */}
            <div className="order-2 md:order-1">
              <img 
                src={newManagerStruggle} 
                alt="New manager facing challenges" 
                className="w-full rounded-lg shadow-xl object-cover aspect-[16/10] sm:aspect-[4/3]"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="order-1 md:order-2">
              <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 sm:mb-4 text-primary">
                The Problem
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4 sm:mb-6 text-foreground leading-tight">
                The skills that got you promoted won't make you succeed
              </h2>

              <p className="text-muted-foreground text-sm sm:text-lg mb-5 sm:mb-8 leading-relaxed">
                Nobody taught you how to manage people. The first 90 days are when your team decides whether to trust you, test you, or tune you out.
              </p>

              {/* Pain points — tighter spacing */}
              <div className="space-y-2 sm:space-y-3">
                {painPoints.map((point) => (
                  <div key={point} className="flex items-start gap-2 sm:gap-3">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-xs sm:text-sm">{point}</span>
                  </div>
                ))}
              </div>

              <p className="font-semibold text-sm sm:text-lg mt-5 sm:mt-8 text-foreground">
                This kit gives you the exact words, frameworks, and plan — starting today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE — compact module cards */}
      <section className="py-10 sm:py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 sm:mb-4 text-center text-primary">
            What's Inside
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center mb-2 sm:mb-4 text-foreground">
            Everything for your first 90 days
          </h2>

          <p className="text-center text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-12">
            21 pages of frameworks, scripts, and templates
          </p>

          {/* Module cards — tighter on mobile */}
          <div className="space-y-3 sm:space-y-6">
            {modules.map((module) => (
              <div
                key={module.number}
                className="p-4 sm:p-6 bg-card rounded-lg shadow-sm border border-border border-l-4 border-l-primary"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-primary leading-none">
                    {module.number}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-foreground">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-base leading-relaxed">{module.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUS — compact */}
      <section className="py-10 sm:py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
              Included Free
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-4 sm:mb-6">
            The Emergency Playbook
          </h2>

          <p className="text-white/80 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Word-for-word scripts for 6 common crises: underperformance, team conflict, losing your best person, inherited problems, delivering bad news, and owning mistakes.
          </p>
        </div>
      </section>

      {/* WHO IS THIS FOR — 2-col on mobile too */}
      <section className="py-10 sm:py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center mb-6 sm:mb-12 text-foreground">
            Built for you if…
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {personas.map((persona) => (
              <div
                key={persona.title}
                className="p-4 sm:p-6 bg-card rounded-lg shadow-sm border border-border"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-foreground">
                      {persona.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-base">{persona.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE — compact */}
      <section className="py-8 sm:py-16 md:py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif mb-3 sm:mb-4 text-foreground">
            Use it in your very first meeting
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed">
            Designed to be used immediately, not studied for weeks. Open it, find the conversation you need, and use the script today.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-10 sm:py-16 md:py-24 px-4 relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img 
            src={newManagerSuccess} 
            alt="Confident leader" 
            className="w-full h-full object-cover object-center opacity-15"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-3 sm:mb-4">
            Stop guessing. Start leading.
          </h2>

          <p className="text-white/80 text-sm sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
            Your team is watching. The first 90 days set the tone for everything. Get the scripts & frameworks trusted by 30+ leading organisations.
          </p>

          <PricingCTA onCheckout={handleOpenCheckout} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 sm:py-8 px-4 border-t bg-primary border-primary-foreground/20">
        <p className="text-center text-white/60 text-[11px] sm:text-sm">
          © 2026 Leadership by Design • 11 Years • 4,000+ Leaders • 30+ Organisations • South Africa
        </p>
      </footer>

      {/* DOWNSELL BANNER */}
      <AnimatePresence>
        {showDownsell && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl p-3 sm:p-4 safe-bottom"
          >
            <div className="container mx-auto max-w-lg flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  Not ready for the full kit?
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Get 3 scripts for R147 →
                </p>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3 flex-shrink-0"
              >
                <Link to="/survival-pack">R147 →</Link>
              </Button>
              <button
                onClick={dismissDownsell}
                className="text-muted-foreground hover:text-foreground p-1 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
