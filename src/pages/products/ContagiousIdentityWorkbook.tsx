import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Download,
  Lock,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Gift,
  Play,
  Brain,
  Compass,
  Flame,
  Shield,
  Zap,
  Eye,
  BarChart3,
  RefreshCw,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import contagiousHero from "@/assets/contagious-identity-coaching-hero.jpg";
import A4CoachingModel from "@/components/contagious-identity/A4CoachingModel";

const PRICE = 2700;
const PRICE_DISPLAY = "R2,700";

const modules = [
  {
    phase: "Phase 1: Identity Awareness",
    phaseDescription: "Who you are. What drives you. How you behave under pressure.",
    items: [
      {
        number: 1,
        title: "Identity Clarity",
        subtitle: "What Are You Transmitting?",
        icon: Eye,
        description:
          "Uncover the leadership signal you're already broadcasting — consciously and unconsciously. Includes the Leadership Elevation Index™ diagnostic.",
      },
      {
        number: 2,
        title: "The Values Beneath the Signal",
        subtitle: "From Stated to Lived",
        icon: Compass,
        description:
          "Go beyond aspirational values to find the ones you actually live by — especially under pressure. Integrates the Values Blueprint diagnostic.",
      },
      {
        number: 3,
        title: "Behaviour Under Pressure",
        subtitle: "The Pressure Reveal",
        icon: Flame,
        description:
          "Identify your default pressure responses and map how they distort or amplify your identity signal. Optional coaching checkpoint included.",
      },
    ],
  },
  {
    phase: "Phase 2: Systemic Impact",
    phaseDescription: "How flexible you are. How your identity affects your system. How you take up space.",
    items: [
      {
        number: 4,
        title: "Identity Flexibility",
        subtitle: "Law of Requisite Variety",
        icon: RefreshCw,
        description:
          "A proprietary 15-question assessment measures your ability to adapt without losing your core. Includes the Identity Flexibility Index.",
      },
      {
        number: 5,
        title: "Decision & Signal Alignment",
        subtitle: "Excellence Architecture",
        icon: Target,
        description:
          "Map how your decisions, routines, and habits either reinforce or undermine your intended identity.",
      },
      {
        number: 6,
        title: "Identity & Purpose Alignment",
        subtitle: "The Why Layer",
        icon: Brain,
        description:
          "Align your leadership identity with your deeper purpose. Integrates the Find My Purpose diagnostic. Optional coaching checkpoint.",
      },
    ],
  },
  {
    phase: "Phase 3: Performance & Sustainability",
    phaseDescription: "Flow state. Drift prevention. Commitment. Measurement.",
    items: [
      {
        number: 7,
        title: "The Flow State",
        subtitle: "The Execution Layer",
        icon: Zap,
        description:
          "Design the conditions where your best identity shows up effortlessly — the intersection of skill, challenge, and purpose.",
      },
      {
        number: 8,
        title: "Where Identity Leaks",
        subtitle: "Drift & Reinforcement",
        icon: Shield,
        description:
          "Identify the environments, relationships, and habits that cause identity drift — and build your reinforcement system.",
      },
      {
        number: 9,
        title: "The Identity Contract",
        subtitle: "Sustaining Contagion",
        icon: FileText,
        description:
          "Write a binding contract with yourself: what you start, stop, and continue. Optional coaching checkpoint.",
      },
      {
        number: 10,
        title: "90-Day Recalibration",
        subtitle: "Measure the Shift",
        icon: BarChart3,
        description:
          "Retake every diagnostic. Compare your scores. Measure real movement. Plan your next 90-day cycle.",
      },
    ],
  },
];

const diagnosticTools = [
  { name: "Leadership Elevation Index™", platform: "leadershipindex.online", modules: "1 & 10" },
  { name: "Values Blueprint", platform: "valuesblueprint.online", modules: "2" },
  { name: "6 Human Needs", platform: "6humanneeds.online", modules: "3" },
  { name: "Identity Flexibility Assessment", platform: "Built into workbook", modules: "4" },
  { name: "Find My Purpose", platform: "findmypurpose.me", modules: "6" },
];

export default function ContagiousIdentityWorkbook() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <SEO
        title="Contagious Identity™ — Self-Paced Executive Leadership Programme | Leadership by Design"
        description="10 modules. 5 proprietary diagnostic tools. A curated video library. The Contagious Identity™ programme is the self-paced executive leadership system that rewires how you lead. R2,700."
        canonicalUrl="/contagious-identity-workbook"
        ogImage="https://leadershipbydesign.co/og-contagious-identity.jpg"
        keywords="contagious identity, executive leadership programme, leadership identity, self-paced leadership, Kevin Britz, leadership by design"
      />
      <Header />

      <main className="min-h-screen bg-background">
        {/* Back Navigation */}
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-14 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={contagiousHero}
                    alt="Contagious Identity Self-Paced Executive Programme"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-primary px-6 py-3 rounded-xl shadow-lg">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {PRICE_DISPLAY}
                  </span>
                </div>
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                  <span className="text-xs font-semibold text-foreground tracking-wider uppercase">
                    10 Modules · 47 Pages
                  </span>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium text-sm uppercase tracking-wider">
                    Self-Paced Executive Programme
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                  Contagious Identity™
                </h1>

                <p className="text-lg text-muted-foreground mb-2 italic">
                  "You are always transmitting. The question is not whether you are influential — it is whether what you are transmitting is intentional."
                </p>
                <p className="text-sm text-muted-foreground mb-6">— Kevin Britz</p>

                <div className="space-y-3 mb-8">
                  {[
                    "10 structured leadership modules across 3 phases",
                    "5 proprietary diagnostic tools with free access tokens",
                    "Curated video library from The Lunchtime Series",
                    "3 optional coaching checkpoints built in",
                    "90-day recalibration and measurement system",
                    "Upgrade credit: 100% of purchase applied to coaching",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full text-lg px-10 py-6 font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get the Workbook — {PRICE_DISPLAY}
                </Button>

                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Instant PDF download · No expiry · Secure checkout via Paystack</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Opening Quote Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed">
              Every decision, every conversation, every moment of pressure reveals your identity to the people around you.
            </p>
            <p className="text-lg text-primary mt-4 font-semibold">
              This programme teaches you to transmit intentionally.
            </p>
          </div>
        </section>

        {/* Programme Structure */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                The 10-Module Programme
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three phases that take you from identity awareness to measurable transformation.
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-16">
              {modules.map((phase, phaseIndex) => (
                <div key={phaseIndex}>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-1">{phase.phase}</h3>
                    <p className="text-muted-foreground text-sm">{phase.phaseDescription}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {phase.items.map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <motion.div
                          key={mod.number}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: mod.number * 0.05 }}
                          className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground tracking-wider">
                              MODULE {mod.number}
                            </span>
                          </div>
                          <h4 className="font-bold text-foreground mb-1">{mod.title}</h4>
                          <p className="text-xs text-primary mb-2">{mod.subtitle}</p>
                          <p className="text-sm text-muted-foreground">{mod.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diagnostic Ecosystem */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  5 Diagnostic Tools Included
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Free access tokens to proprietary diagnostic platforms are printed inside the workbook. No extra cost.
                </p>
              </div>

              <div className="space-y-3">
                {diagnosticTools.map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-card rounded-xl p-4 sm:p-5 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.platform}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium whitespace-nowrap">
                      Module {tool.modules}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Video Library Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Play className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Curated Video Library</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Learn From The Lunchtime Series
                </h2>
                <p className="text-muted-foreground mb-4">
                  Each module includes curated video content from Kevin Britz's Lunchtime Series and expert sources. Watch prompts focus your attention on the concepts that matter most.
                </p>
                <p className="text-muted-foreground text-sm">
                  Topics include identity under pressure, values-based decision making, flow state performance, and leadership presence.
                </p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-8 border border-border text-center">
                <Play className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="font-semibold text-foreground mb-1">Video-Enhanced Learning</p>
                <p className="text-sm text-muted-foreground">Watch prompts guide your focus before each video for deeper integration</p>
              </div>
            </div>
          </div>
        </section>

        {/* Two Paths Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Two Ways to Work With This Programme
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Path 1: Self-Paced */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Path 1: Self-Paced</h3>
                <div className="text-2xl font-bold text-primary mb-4">{PRICE_DISPLAY}</div>
                <p className="text-muted-foreground mb-6 text-sm">
                  Work through all 10 modules at your own pace. Complete diagnostics, watch curated videos, and build your leadership identity independently.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  {[
                    "All 10 modules + 5 diagnostic tools",
                    "Curated video library access",
                    "No expiry — work at your pace",
                    "90-day recalibration built in",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => setCheckoutOpen(true)} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Buy Now — {PRICE_DISPLAY}
                </Button>
              </div>

              {/* Path 2: With Coaching */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 border-2 border-primary relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                    PREMIUM
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Path 2: With Coaching</h3>
                <div className="text-2xl font-bold text-primary mb-4">From R15,000</div>
                <p className="text-muted-foreground mb-6 text-sm">
                  Get the programme included free as part of a coaching engagement. Your coach walks you through each module with personalised guidance.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  {[
                    "Programme included at no extra cost",
                    "6 × 90-minute coaching sessions",
                    "Personalised identity development",
                    "3 built-in coaching checkpoints",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contagious-identity">Explore Coaching Options</Link>
                </Button>
              </div>
            </div>

            {/* Upgrade Credit */}
            <div className="max-w-3xl mx-auto mt-12 text-center">
              <div className="bg-card rounded-xl p-6 border border-border">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-foreground">Upgrade Credit Available</h3>
                <p className="text-muted-foreground text-sm">
                  Purchase the self-paced programme at {PRICE_DISPLAY} and later decide to upgrade to coaching?
                  Your full purchase is credited toward the coaching package if you upgrade within 90 days. Zero-risk entry point.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coaching Checkpoints */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Optional Coaching Checkpoints
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Three strategic inflection points where a trained mirror makes all the difference. Not required — but powerful.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { module: "Module 3", title: "Pressure Reveal", desc: "Process your pressure patterns with a coach before moving into systemic impact." },
                  { module: "Module 6", title: "Purpose Alignment", desc: "Align your identity with your purpose — the deepest and most pivotal inflection point." },
                  { module: "Module 9", title: "Identity Contract", desc: "Pressure-test your commitments and build accountability before your 90-day cycle." },
                ].map((checkpoint, i) => (
                  <div key={i} className="bg-card rounded-xl p-6 border border-border text-center">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{checkpoint.module}</span>
                    <h4 className="font-bold text-foreground mt-2 mb-2">{checkpoint.title}</h4>
                    <p className="text-sm text-muted-foreground">{checkpoint.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8 text-sm text-muted-foreground">
                <p>Individual session: R2,500 · All 3 checkpoints: R6,000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Identity is not a destination. It is a practice.
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-4 text-sm italic">
              — Kevin Britz
            </p>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              10 modules. 5 diagnostics. A curated video library. Everything you need to rewire how you lead.
            </p>
            <Button
              size="lg"
              onClick={() => setCheckoutOpen(true)}
              className="text-lg px-10 py-6 font-semibold bg-background text-foreground hover:bg-background/90"
            >
              <Download className="w-5 h-5 mr-2" />
              Get the Workbook — {PRICE_DISPLAY}
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        productName="Contagious Identity™ Self-Paced Programme"
        price={PRICE}
        priceDisplay={PRICE_DISPLAY}
        successPath="/contagious-identity-workbook/success"
      />
    </>
  );
}
