import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { X, Gift, CheckCircle, ArrowLeft } from "lucide-react";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import newManagerHero from "@/assets/new-manager-hero.jpg";
import newManagerStruggle from "@/assets/new-manager-struggle.jpg";
import newManagerSuccess from "@/assets/new-manager-success.jpg";

// Custom colors for this page
const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
  cream: "#F8F6F1",
  goldLight: "#C8A86420",
};

const featurePills = [
  "5 Critical Conversation Scripts",
  "1-on-1 Meeting Framework",
  "Self-Assessment Tools",
  "30-60-90 Day Plan",
];

const painPoints = [
  "You don't know what to say in your first team meeting",
  "Your 1-on-1s feel awkward and unstructured",
  "You're avoiding a difficult conversation you know you need to have",
  "Your former peers now report to you — and it's weird",
  "You're working longer hours but somehow getting less done",
  "Your boss expects results but hasn't told you what 'good' looks like",
];

const modules = [
  {
    number: "01",
    title: "Leadership Style Self-Assessment",
    description: "A scored diagnostic to identify whether you're a Driver, Connector, or Strategist — with specific guidance on when to flex each style.",
  },
  {
    number: "02",
    title: "The 5 Critical Conversations",
    description: "Word-for-word scripts for the 5 conversations that build trust in your first 90 days: Expectation-Setting, Team Norms, \"What I Won't Change,\" Managing Up, and the Day 30 Feedback Loop.",
  },
  {
    number: "03",
    title: "The 1-on-1 Meeting Framework",
    description: "A proven 30-minute structure with time blocks, coaching questions, and non-negotiable rules.",
  },
  {
    number: "04",
    title: "30-60-90 Day Action Plan",
    description: "Phase-by-phase checklist with clear milestones. Days 1-30: Listen & Learn. Days 31-60: Build & Align. Days 61-90: Lead & Accelerate.",
  },
  {
    number: "05",
    title: "Ready-to-Use Templates",
    description: "Three printable templates: 1-on-1 Meeting Notes, Team Norms Agreement, and Weekly Manager Reflection.",
  },
];

const personas = [
  {
    title: "Newly Promoted Manager",
    description: "You just got the title and want to start strong, not stumble through your first quarter.",
  },
  {
    title: "Team Lead Moving Up",
    description: "You've led projects but never managed people. The gap is bigger than you expected.",
  },
  {
    title: "HR / L&D Professional",
    description: "You need a practical onboarding resource for first-time managers across your organization.",
  },
  {
    title: "Founder Hiring Their First Team",
    description: "Your business is growing and you need a management framework — fast.",
  },
];

// Pricing CTA component used in hero and final section
const PricingCTA = ({ onCheckout }: { onCheckout: () => void }) => (
  <div className="text-center">
    <div className="mb-4">
      <span className="text-white/60 line-through text-xl mr-3">R1,497</span>
      <span className="text-5xl md:text-6xl font-bold" style={{ color: colors.gold }}>R497</span>
    </div>
    <p className="text-white/70 text-sm mb-6">
      Introductory price • Instant PDF download • 21 pages
    </p>
    <Button
      onClick={onCheckout}
      size="lg"
      className="text-lg px-8 py-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
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

export default function NewManagerKit() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen scroll-smooth">
      <SEO
        title="The New Manager Survival Kit: Your First 90 Days"
        description="Your complete 90-day roadmap to go from 'just promoted' to trusted leader — with the exact scripts, frameworks, and templates used by 3,000+ organizations."
        canonicalUrl="/new-manager-kit"
        keywords="new manager, leadership, first 90 days, management training, team leadership, 1-on-1 meetings, leadership scripts"
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        productName="The New Manager Survival Kit"
        price={497}
        priceDisplay="R497"
      />

      {/* HERO SECTION */}
      <section 
        className="relative py-16 md:py-24 px-4 overflow-hidden"
        style={{ backgroundColor: colors.navy }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={newManagerHero} 
            alt="Professional coaching session" 
            className="w-full h-full object-cover object-top opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/80 via-[#1B2A4A]/90 to-[#1B2A4A]" />
        </div>

        {/* Decorative elements */}
        <div 
          className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10"
          style={{ border: `1px solid ${colors.gold}` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-5"
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
              The New Manager Survival Kit
            </span>
            <span 
              className="block text-2xl md:text-3xl lg:text-4xl font-serif"
              style={{ color: colors.gold }}
            >
              Your First 90 Days
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-center text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Your complete 90-day roadmap to go from "just promoted" to trusted leader — with the exact scripts, frameworks, and templates used by 3,000+ organizations.
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
                src={newManagerStruggle} 
                alt="New manager facing challenges" 
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
                The skills that got you promoted are not the skills that will make you succeed
              </h2>

              {/* Body */}
              <p className="text-gray-700 text-lg mb-8">
                You were promoted because you were great at your job. But nobody taught you how to manage people. And the first 90 days are when your team decides whether to trust you, test you, or tune you out.
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
                This kit gives you the exact words, frameworks, and plan to handle every one of these situations — starting today.
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
            Everything you need for your first 90 days
          </h2>

          {/* Subheading */}
          <p className="text-center text-gray-600 text-lg mb-12">
            21 pages of actionable frameworks, word-for-word scripts, and ready-to-use templates
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
            The Emergency Playbook
          </h2>

          {/* Description */}
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Word-for-word scripts for the 6 most common management crises: underperformance, team conflict, losing your best person, inherited problems, delivering bad news, and owning your own mistakes.
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
            This kit is built for you if…
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
            Use it in your very first meeting
          </h2>
          <p className="text-gray-700 text-lg">
            This kit is designed to be used immediately, not studied for weeks. Open it, find the conversation you need, and use the script in your next meeting.
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
            src={newManagerSuccess} 
            alt="Confident leader presenting to team" 
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
            Stop guessing. Start leading.
          </h2>

          {/* Subheading */}
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Your team is watching. The first 90 days set the tone for everything that follows. Get the scripts, frameworks, and plan that 3,000+ organizations trust.
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
