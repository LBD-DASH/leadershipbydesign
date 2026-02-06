import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { X, Gift, CheckCircle, ArrowLeft, TrendingUp, Zap, Clock, Download } from "lucide-react";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import { motion } from "framer-motion";
import productHandshake from "@/assets/product-handshake.jpg";
import productLightbulbIdea from "@/assets/product-lightbulb-idea.jpg";
import productTeamHandsAbove from "@/assets/product-team-hands-above.jpg";

const featurePills = [
  "12 Conversation Scripts",
  "Conflict Resolution Framework",
  "De-escalation Techniques",
  "Follow-up Templates",
];

const painPoints = [
  "You've been avoiding 'that conversation' for weeks (or months)",
  "Feedback discussions turn into defensive arguments",
  "You soften the message so much it loses its impact",
  "Performance issues fester because you don't know what to say",
  "Team conflicts go unresolved and affect everyone",
  "You dread giving constructive criticism even when it's needed",
];

const modules = [
  {
    number: "01",
    title: "The CLEAR Conversation Framework",
    description: "A 5-step structure for any difficult conversation: Context, Listen, Explore, Agree, Reinforce. Works for performance issues, conflict resolution, and boundary-setting.",
  },
  {
    number: "02",
    title: "12 Ready-to-Use Scripts",
    description: "Word-for-word scripts for: underperformance, attitude problems, missed deadlines, personal hygiene, salary negotiations, peer conflicts, and more.",
  },
  {
    number: "03",
    title: "The De-escalation Toolkit",
    description: "Techniques to handle emotional reactions, defensive responses, and heated moments. Includes specific phrases that diffuse tension without backing down.",
  },
  {
    number: "04",
    title: "Pre-Conversation Planner",
    description: "A structured worksheet to prepare for any difficult conversation: clarify your objective, anticipate reactions, and plan your key messages.",
  },
  {
    number: "05",
    title: "Follow-up Documentation Templates",
    description: "Professional templates for documenting conversations, creating improvement plans, and establishing clear expectations after tough discussions.",
  },
];

const personas = [
  {
    title: "Manager Avoiding 'The Talk'",
    description: "You know you need to address something but keep putting it off because you don't know how to start.",
  },
  {
    title: "Leader Dealing with Conflict",
    description: "Two team members are at odds and you need to mediate without taking sides or making it worse.",
  },
  {
    title: "HR Professional",
    description: "You need a practical framework to coach managers through difficult employee conversations.",
  },
  {
    title: "Anyone Who Hates Confrontation",
    description: "You consider yourself conflict-averse but know some conversations simply can't be avoided.",
  },
];

// Pricing CTA component used in hero and final section
const PricingCTA = ({ onCheckout }: { onCheckout: () => void }) => (
  <div className="text-center px-4">
    {/* Speed indicators for TikTok audience */}
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
      <span className="text-white/60 line-through text-lg md:text-xl mr-2 md:mr-3">R497</span>
      <motion.span 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold inline-block text-primary-foreground"
      >
        R247
      </motion.span>
    </div>
    <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6">
      🔥 50% OFF • Limited time offer
    </p>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
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

export default function DifficultConversationsPlaybook() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen scroll-smooth">
      <SEO
        title="The Difficult Conversations Playbook | Leadership by Design"
        description="Stop avoiding tough conversations. Get 12 word-for-word scripts and the CLEAR framework to handle any difficult workplace discussion with confidence."
        canonicalUrl="/difficult-conversations"
        ogImage="https://leadershipbydesign.co/og-products.jpg"
        keywords="difficult conversations, workplace conflict, feedback, performance management, conflict resolution, leadership communication, tough conversations"
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        productName="The Difficult Conversations Playbook"
        price={247}
        priceDisplay="R247"
      />

      {/* HERO SECTION */}
      <section className="relative py-12 md:py-24 px-4 overflow-hidden bg-primary">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={productHandshake} 
            alt="Professional handshake representing resolution" 
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-primary" />
        </div>

        {/* Popular Badge - Animated */}
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
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>💬 POPULAR</span>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 md:w-32 h-20 md:h-32 rounded-full opacity-10 hidden md:block border border-primary-foreground" />
        <div className="absolute bottom-20 right-10 w-32 md:w-48 h-32 md:h-48 rounded-full opacity-5 hidden md:block border-2 border-primary-foreground" />

        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Back Button */}
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Products</span>
          </Link>

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              Digital Leadership Product
            </span>
          </div>

          {/* Headline with gradient text */}
          <motion.h1 
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="block text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-2">
              Difficult Conversations
            </span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-serif bg-gradient-to-r from-white via-primary-foreground to-white bg-clip-text text-transparent">
              Playbook 💬
            </span>
          </motion.h1>

          {/* Subheading */}
          <p className="text-center text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Stop avoiding tough conversations. Get 12 word-for-word scripts and the CLEAR framework to handle any difficult workplace discussion with confidence.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 rounded-full text-sm font-medium border border-primary-foreground/40 text-primary-foreground"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Pricing CTA */}
          <PricingCTA onCheckout={handleOpenCheckout} />
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="py-6 px-4 bg-background border-y border-border">
        <p className="text-center text-muted-foreground font-medium">
          Built on 11 years of executive coaching across 3,000+ organizations in Southern Africa
        </p>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <img 
                src={productLightbulbIdea} 
                alt="Finding clarity in difficult situations" 
                className="w-full rounded-lg shadow-xl object-cover aspect-[4/3]"
              />
            </div>

            {/* Content */}
            <div className="order-1 md:order-2">
              {/* Section label */}
              <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary">
                The Problem
              </p>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">
                Avoidance doesn't make problems disappear — it makes them grow
              </h2>

              {/* Body */}
              <p className="text-muted-foreground text-lg mb-8">
                Every week you delay that conversation, the situation gets worse. The underperformer gets more comfortable. The conflict spreads. Your credibility erodes. You know this. But knowing what to say is the hard part.
              </p>

              {/* Pain points */}
              <div className="space-y-3">
                {painPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{point}</span>
                  </div>
                ))}
              </div>

              {/* Closing statement */}
              <p className="font-semibold text-lg mt-8 text-foreground">
                This playbook gives you the exact words for every difficult situation — so you can stop avoiding and start leading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE SECTION */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          {/* Section label */}
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center text-primary">
            What's Inside
          </p>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 text-foreground">
            Everything you need for confident conversations
          </h2>

          {/* Subheading */}
          <p className="text-center text-muted-foreground text-lg mb-12">
            18 pages of frameworks, scripts, and templates you can use today
          </p>

          {/* Module cards */}
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
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUS SECTION */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        {/* Decorative circles */}
        <div className="absolute top-10 right-20 w-24 h-24 rounded-full opacity-10 border border-primary-foreground" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              <Gift className="w-4 h-4" />
              Included Free
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            The Emotional Intelligence Quick Reference
          </h2>

          {/* Description */}
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            A one-page guide to reading emotional cues, adjusting your approach mid-conversation, and recognizing when to pause, push, or pivot.
          </p>
        </div>
      </section>

      {/* WHO IS THIS FOR SECTION */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-foreground">
            This playbook is built for you if…
          </h2>

          {/* Persona cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((persona) => (
              <div
                key={persona.title}
                className="p-6 bg-card rounded-lg shadow-sm border border-border"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {persona.title}
                    </h3>
                    <p className="text-muted-foreground">{persona.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="py-16 md:py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif mb-4 text-foreground">
            Use it in your very next conversation
          </h2>
          <p className="text-muted-foreground text-lg">
            This playbook is designed to be used immediately, not studied for weeks. Open it, find the script you need, and use it in your next difficult conversation.
          </p>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-primary">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={productTeamHandsAbove} 
            alt="Team collaboration and success" 
            className="w-full h-full object-cover object-center opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full opacity-5 border-2 border-primary-foreground" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Stop avoiding. Start leading.
          </h2>

          {/* Subheading */}
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            The conversation you've been avoiding is costing you more than you think. Get the scripts, frameworks, and confidence to handle any difficult discussion.
          </p>

          {/* Pricing CTA */}
          <PricingCTA onCheckout={handleOpenCheckout} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t bg-primary border-primary-foreground/20">
        <p className="text-center text-white/60 text-sm">
          © 2026 Leadership by Design • 11 Years • 3,000+ Organizations • Built in South Africa
        </p>
      </footer>
    </div>
  );
}
