import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { X, Gift, CheckCircle, ArrowLeft, TrendingUp } from "lucide-react";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import productHandshake from "@/assets/product-handshake.jpg";
import productLightbulbIdea from "@/assets/product-lightbulb-idea.jpg";
import productTeamHandsAbove from "@/assets/product-team-hands-above.jpg";

// Custom colors for this page
const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
  cream: "#F8F6F1",
  goldLight: "#C8A86420",
};

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
    <div className="mb-4">
      <span className="text-white/60 line-through text-lg md:text-xl mr-2 md:mr-3">R497</span>
      <span className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: colors.gold }}>R247</span>
    </div>
    <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6">
      Introductory price • Instant PDF download • 18 pages
    </p>
    <Button
      onClick={onCheckout}
      size="lg"
      className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
      style={{ 
        backgroundColor: colors.gold, 
        color: colors.navy,
      }}
    >
      GET INSTANT ACCESS →
    </Button>
    <p className="text-white/50 text-xs mt-4">
      Secure checkout • Download in 30 seconds • Works on any device
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
      <section 
        className="relative py-12 md:py-24 px-4 overflow-hidden"
        style={{ backgroundColor: colors.navy }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={productHandshake} 
            alt="Professional handshake representing resolution" 
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/80 via-[#1B2A4A]/90 to-[#1B2A4A]" />
        </div>

        {/* Popular Badge */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <div 
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg"
            style={{ backgroundColor: colors.gold, color: colors.navy }}
          >
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>POPULAR</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div 
          className="absolute top-20 left-10 w-20 md:w-32 h-20 md:h-32 rounded-full opacity-10 hidden md:block"
          style={{ border: `1px solid ${colors.gold}` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-32 md:w-48 h-32 md:h-48 rounded-full opacity-5 hidden md:block"
          style={{ border: `2px solid ${colors.gold}` }}
        />

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
            <span 
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
            >
              Digital Leadership Product
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center mb-4">
            <span className="block text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-2">
              The Difficult Conversations
            </span>
            <span 
              className="block text-2xl md:text-3xl lg:text-4xl font-serif"
              style={{ color: colors.gold }}
            >
              Playbook
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-center text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Stop avoiding tough conversations. Get 12 word-for-word scripts and the CLEAR framework to handle any difficult workplace discussion with confidence.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 rounded-full text-sm font-medium border"
                style={{ borderColor: `${colors.gold}40`, color: colors.gold }}
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
      <section className="py-6 px-4 bg-white border-y border-gray-100">
        <p className="text-center text-gray-600 font-medium">
          Built on 11 years of executive coaching across 3,000+ organizations in Southern Africa
        </p>
      </section>

      {/* PROBLEM SECTION */}
      <section 
        className="py-16 md:py-24 px-4"
        style={{ backgroundColor: colors.cream }}
      >
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
              <p 
                className="text-sm font-semibold tracking-widest uppercase mb-4"
                style={{ color: colors.gold }}
              >
                The Problem
              </p>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-serif mb-6" style={{ color: colors.navy }}>
                Avoidance doesn't make problems disappear — it makes them grow
              </h2>

              {/* Body */}
              <p className="text-gray-700 text-lg mb-8">
                Every week you delay that conversation, the situation gets worse. The underperformer gets more comfortable. The conflict spreads. Your credibility erodes. You know this. But knowing what to say is the hard part.
              </p>

              {/* Pain points */}
              <div className="space-y-3">
                {painPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{point}</span>
                  </div>
                ))}
              </div>

              {/* Closing statement */}
              <p className="font-semibold text-lg mt-8" style={{ color: colors.navy }}>
                This playbook gives you the exact words for every difficult situation — so you can stop avoiding and start leading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE SECTION */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          {/* Section label */}
          <p 
            className="text-sm font-semibold tracking-widest uppercase mb-4 text-center"
            style={{ color: colors.gold }}
          >
            What's Inside
          </p>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4" style={{ color: colors.navy }}>
            Everything you need for confident conversations
          </h2>

          {/* Subheading */}
          <p className="text-center text-gray-600 text-lg mb-12">
            18 pages of frameworks, scripts, and templates you can use today
          </p>

          {/* Module cards */}
          <div className="space-y-6">
            {modules.map((module) => (
              <div
                key={module.number}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                style={{ borderLeftWidth: "4px", borderLeftColor: colors.gold }}
              >
                <div className="flex items-start gap-4">
                  <span 
                    className="text-3xl font-serif font-bold"
                    style={{ color: colors.gold }}
                  >
                    {module.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.navy }}>
                      {module.title}
                    </h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUS SECTION */}
      <section 
        className="py-16 md:py-24 px-4 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${colors.navy} 0%, #0f1a2e 100%)` 
        }}
      >
        {/* Decorative circles */}
        <div 
          className="absolute top-10 right-20 w-24 h-24 rounded-full opacity-10"
          style={{ border: `1px solid ${colors.gold}` }}
        />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
            >
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
      <section 
        className="py-16 md:py-24 px-4"
        style={{ backgroundColor: colors.cream }}
      >
        <div className="container mx-auto max-w-4xl">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12" style={{ color: colors.navy }}>
            This playbook is built for you if…
          </h2>

          {/* Persona cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((persona) => (
              <div
                key={persona.title}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: colors.gold }} />
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.navy }}>
                      {persona.title}
                    </h3>
                    <p className="text-gray-600">{persona.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section 
        className="py-16 md:py-20 px-4"
        style={{ backgroundColor: `${colors.gold}15` }}
      >
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif mb-4" style={{ color: colors.navy }}>
            Have the conversation today
          </h2>
          <p className="text-gray-700 text-lg">
            This playbook is designed for immediate use. Open it, find the script for your situation, customize the key phrases, and have the conversation you've been putting off.
          </p>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section 
        className="py-16 md:py-24 px-4 relative overflow-hidden"
        style={{ backgroundColor: colors.navy }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={productTeamHandsAbove} 
            alt="Team collaboration and resolution" 
            className="w-full h-full object-cover object-center opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-[#1B2A4A]/95 to-[#1B2A4A]/80" />
        </div>

        {/* Decorative elements */}
        <div 
          className="absolute bottom-10 left-20 w-40 h-40 rounded-full opacity-5"
          style={{ border: `2px solid ${colors.gold}` }}
        />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Stop avoiding. Start resolving.
          </h2>

          {/* Subheading */}
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Every day you delay, the problem compounds. Get the exact scripts and frameworks that give you the confidence to have any conversation — today.
          </p>

          {/* Pricing CTA */}
          <PricingCTA onCheckout={handleOpenCheckout} />
        </div>
      </section>

      {/* FOOTER */}
      <footer 
        className="py-8 px-4 border-t"
        style={{ backgroundColor: colors.navy, borderColor: `${colors.gold}20` }}
      >
        <p className="text-center text-white/60 text-sm">
          © 2026 Leadership by Design • 11 Years • 3,000+ Organizations • Built in South Africa
        </p>
      </footer>
    </div>
  );
}
