import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { X, Gift, CheckCircle, ArrowLeft, Zap, Clock, Download, MessageSquare } from "lucide-react";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import { motion } from "framer-motion";
import { useGeoPricing } from "@/hooks/useGeoPricing";
import productLightbulbIdea from "@/assets/product-lightbulb-idea.jpg";
import leadershipFeedback from "@/assets/leadership-feedback.jpg";
import productTeamHandsBelow from "@/assets/product-team-hands-below.jpg";

const PRICE_ZAR = 97;
const STRIKETHROUGH_ZAR = 197;

const featurePills = [
  "4-Step Proprietary System",
  "10 Real-World Scripts",
  "Preparation Worksheets",
  "60-Second Cheat Sheet",
];

const painPoints = [
  "You give feedback but nothing changes",
  "Your team dreads performance conversations",
  "You default to \"good job\" because real praise feels awkward",
  "You soften criticism so much it loses all meaning",
  "You avoid giving feedback until it becomes a formal HR issue",
  "Your team says they want more feedback but you don't know how to deliver it",
];

const modules = [
  {
    number: "01",
    title: "The 4-Step Feedback System",
    description: "A proprietary method used in executive coaching that eliminates guesswork. You will know exactly what to say, in what order, every time.",
  },
  {
    number: "02",
    title: "10 Feedback Scripts",
    description: "Word-for-word scripts covering praise, correction, peer feedback, upward feedback, and development reviews. Copy, paste, deliver.",
  },
  {
    number: "03",
    title: "The \"Before You Speak\" Worksheet",
    description: "A preparation tool that ensures you never walk into a feedback conversation unprepared or emotionally reactive again.",
  },
  {
    number: "04",
    title: "Development Conversation Templates",
    description: "Quarterly review frameworks that transform reviews from box-ticking exercises into genuine growth conversations.",
  },
  {
    number: "05",
    title: "The Feedback Frequency Tracker",
    description: "A habit-building tool so feedback becomes a weekly rhythm, not an annual event.",
  },
];

const personas = [
  {
    title: "The Conflict-Averse Manager",
    description: "You know feedback matters but you avoid it because you don't want confrontation.",
  },
  {
    title: "The Blunt Leader",
    description: "Your feedback lands too hard — people hear criticism, not coaching.",
  },
  {
    title: "The New Manager",
    description: "You've never had to formally evaluate someone and you have no framework.",
  },
  {
    title: "The HR / L&D Professional",
    description: "You need a practical system to train managers on feedback delivery across your organization.",
  },
];

const PricingCTA = ({ onCheckout, localPrice, strikethroughLocal, isLocal }: { onCheckout: () => void; localPrice: string; strikethroughLocal: string; isLocal: boolean }) => (
  <div className="text-center px-4">
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-1 text-xs md:text-sm text-white/80"
      >
        <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        Instant Download
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-1 text-xs md:text-sm text-white/80"
      >
        <Clock className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        30 sec to access
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center gap-1 text-xs md:text-sm text-white/80"
      >
        <Download className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        PDF Ready
      </motion.span>
    </div>

    <div className="mb-4">
      <span className="text-white/60 line-through text-lg md:text-xl mr-2 md:mr-3">
        {isLocal ? `R${STRIKETHROUGH_ZAR}` : strikethroughLocal}
      </span>
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold inline-block text-primary-foreground"
      >
        {isLocal ? `R${PRICE_ZAR}` : localPrice}
      </motion.span>
    </div>
    {!isLocal && (
      <p className="text-white/50 text-xs mb-1">
        ≈ R{PRICE_ZAR} ZAR • Payment processed in ZAR
      </p>
    )}
    <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6">
      🔥 50% OFF • Limited time offer
    </p>
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={onCheckout}
        size="lg"
        className="text-base md:text-lg px-6 md:px-8 py-6 md:py-7 font-bold transition-all duration-300 hover:shadow-lg w-full sm:w-auto min-h-[56px] bg-primary-foreground text-primary hover:bg-white"
      >
        GET INSTANT ACCESS →
      </Button>
    </motion.div>
    <p className="text-white/50 text-xs mt-4">
      ✓ Secure checkout • ✓ Works on any device
    </p>
  </div>
);

export default function FeedbackFormula() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const geo = useGeoPricing(PRICE_ZAR);
  const geoStrikethrough = useGeoPricing(STRIKETHROUGH_ZAR);

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen scroll-smooth">
      <SEO
        title="The Feedback Formula — Give Feedback People Actually Hear | Leadership by Design"
        description="A proprietary 4-step feedback system with 10 real-world scripts, preparation worksheets, and development templates. Stop guessing, start coaching. R97."
        canonicalUrl="/feedback-formula"
        ogImage="https://leadershipbydesign.co/og-products.jpg"
        keywords="feedback formula, feedback framework, leadership feedback, giving feedback, feedback scripts, manager feedback, coaching feedback"
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        productName="The Feedback Formula"
        price={PRICE_ZAR}
        priceDisplay={`R${PRICE_ZAR}`}
        successPath="/feedback-formula/success"
      />

      {/* HERO SECTION */}
      <section className="relative py-8 sm:py-12 md:py-24 px-4 overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src={productLightbulbIdea}
            alt="Feedback coaching session"
            className="w-full h-full object-cover object-top opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-primary" />
        </div>

        {/* NEW Badge */}
        <motion.div
          className="absolute top-4 left-4 md:top-8 md:left-8 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg bg-primary-foreground text-primary"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
            <span>✨ NEW</span>
          </motion.div>
        </motion.div>

        <div className="absolute top-20 left-10 w-20 md:w-32 h-20 md:h-32 rounded-full opacity-10 hidden md:block border border-primary-foreground" />
        <div className="absolute bottom-20 right-10 w-32 md:w-48 h-32 md:h-48 rounded-full opacity-5 hidden md:block border-2 border-primary-foreground" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Products</span>
          </Link>

          <div className="flex justify-center mb-8">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              Digital Leadership Product
            </span>
          </div>

          <motion.h1
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-1">
              The Feedback
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif bg-gradient-to-r from-white via-primary-foreground to-white bg-clip-text text-transparent">
              Formula 💬
            </span>
          </motion.h1>

          <p className="text-center text-white/80 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-5 sm:mb-10 px-2">
            A 4-step system that turns feedback into your team's biggest growth accelerator.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 mb-6 sm:mb-12 max-w-sm sm:max-w-none mx-auto">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-primary-foreground/40 text-primary-foreground text-center"
              >
                {pill}
              </span>
            ))}
          </div>

          <PricingCTA
            onCheckout={handleOpenCheckout}
            localPrice={geo.localPrice}
            strikethroughLocal={geoStrikethrough.localPrice}
            isLocal={geo.isLocal}
          />
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="py-6 px-4 bg-background border-y border-border">
        <p className="text-center text-muted-foreground font-medium">
          Built on 11 years of executive coaching across 3,000+ organizations in Southern Africa
        </p>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-10 sm:py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src={leadershipFeedback}
                alt="Leader struggling with feedback"
                className="w-full rounded-lg shadow-xl object-cover aspect-[16/10] sm:aspect-[4/3]"
              />
            </div>

            <div className="order-1 md:order-2">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary">
                The Problem
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4 sm:mb-6 text-foreground leading-tight">
                Most leaders give feedback that people ignore, resent, or misunderstand
              </h2>

              <p className="text-muted-foreground text-lg mb-8">
                Leaders who give consistent, effective feedback see 39% higher engagement and 27% lower turnover. But most managers have never been taught how to give feedback that actually changes behaviour.
              </p>

              <div className="space-y-3">
                {painPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{point}</span>
                  </div>
                ))}
              </div>

              <p className="font-semibold text-lg mt-8 text-foreground">
                This system gives you the exact 4-step method, word-for-word scripts, and preparation tools to deliver feedback that drives real change — starting today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE SECTION */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center text-primary">
            What's Inside
          </p>

          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 text-foreground">
            A complete feedback delivery system
          </h2>

          <p className="text-center text-muted-foreground text-lg mb-12">
            The proprietary framework, scripts, worksheets, and tools — everything you need to give feedback that people actually hear
          </p>

          <div className="space-y-6">
            {modules.map((module) => (
              <div
                key={module.number}
                className="p-6 bg-card rounded-lg shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-primary"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-serif font-bold text-primary">
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

      {/* BONUS SECTION */}
      <section className="py-10 sm:py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute top-10 right-20 w-24 h-24 rounded-full opacity-10 border border-primary-foreground" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              <Gift className="w-4 h-4" />
              Included Free
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            The 60-Second Feedback Cheat Sheet
          </h2>

          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            A one-page quick reference for when you need to give feedback right now. The entire proprietary system distilled into a single page you can keep on your desk or save to your phone.
          </p>
        </div>
      </section>

      {/* WHO IS THIS FOR SECTION */}
      <section className="py-10 sm:py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center mb-6 sm:mb-12 text-foreground">
            This system is built for you if…
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

      {/* GUARANTEE SECTION */}
      <section className="py-8 sm:py-16 md:py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif mb-4 text-foreground">
            Use it in your next 3 conversations
          </h2>
          <p className="text-muted-foreground text-lg">
            If you use the system in 3 feedback conversations and see no improvement in how people receive and act on your feedback, request a full refund. No questions asked.
          </p>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-10 sm:py-16 md:py-24 px-4 relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src={productTeamHandsBelow}
            alt="Team collaborating after feedback"
            className="w-full h-full object-cover object-center opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
        </div>

        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full opacity-5 border-2 border-primary-foreground" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Stop avoiding feedback. Start delivering it.
          </h2>

          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Your team needs to hear the truth — delivered in a way they can actually use. Get the exact system that turns feedback into your most powerful leadership tool.
          </p>

          <PricingCTA
            onCheckout={handleOpenCheckout}
            localPrice={geo.localPrice}
            strikethroughLocal={geoStrikethrough.localPrice}
            isLocal={geo.isLocal}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 sm:py-8 px-4 border-t bg-primary border-primary-foreground/20">
        <p className="text-center text-white/60 text-[11px] sm:text-sm">
          © 2026 Leadership by Design • 11 Years • 3,000+ Organizations • South Africa
        </p>
      </footer>
    </div>
  );
}
