import { motion } from "framer-motion";
import { 
  ArrowDown, 
  CheckCircle, 
  Users, 
  Target, 
  Brain, 
  Lightbulb,
  ChevronDown,
  Clock,
  Shield,
  MessageSquare
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InterestForm from "@/components/contagious-identity/InterestForm";
import A4CoachingModel from "@/components/contagious-identity/A4CoachingModel";

// Images
import heroImage from "@/assets/contagious-identity-coaching-hero.jpg";
import reflectionImage from "@/assets/contagious-identity-reflection.jpg";
import influenceImage from "@/assets/contagious-identity-influence.jpg";
import legacyImage from "@/assets/contagious-identity-legacy.jpg";

const fadeInUp = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const painPoints = [
  {
    title: "Values-Behaviour Disconnect",
    description: "You know what you stand for, but your team isn't reflecting it consistently.",
  },
  {
    title: "Identity Shifts",
    description: "Different stakeholders see different versions of your leadership.",
  },
  {
    title: "Cultural Drift",
    description: "The culture you built is slowly changing—and not in the direction you intended.",
  },
  {
    title: "Succession Anxiety",
    description: "You're not sure your leadership identity will survive your exit.",
  },
  {
    title: "Influence Plateau",
    description: "Your positional authority is strong, but your personal influence has stalled.",
  },
  {
    title: "Legacy Uncertainty",
    description: "You've built success, but you're not sure what you'll leave behind.",
  },
];

const coachingPhases = [
  {
    phase: "01",
    title: "Agreement",
    duration: "Weeks 1-2",
    description: "Mapping your current identity landscape—how you see yourself vs. how others experience you.",
    activities: ["360° Identity Assessment", "Values Excavation", "Stakeholder Perception Mapping"],
  },
  {
    phase: "02",
    title: "Awareness",
    duration: "Weeks 3-6",
    description: "Defining the identity you want to transmit and identifying the gaps.",
    activities: ["Core Identity Definition", "Behavioural Blueprint", "Gap Analysis"],
  },
  {
    phase: "03",
    title: "Action",
    duration: "Weeks 7-10",
    description: "Practising identity-congruent leadership in real situations.",
    activities: ["Scenario Practice", "Real-time Application", "Feedback Integration"],
  },
  {
    phase: "04",
    title: "Accountability",
    duration: "Weeks 11-12",
    description: "Embedding your contagious identity into systems and succession.",
    activities: ["System Integration", "Succession Planning", "Legacy Mapping"],
  },
];

const pricingTiers = [
  {
    name: "Foundation",
    price: "R15,000",
    description: "Are you ready to take action on your leadership skills?",
    duration: "6 sessions",
    features: [
      "6 × 90-minute coaching sessions",
      "Contagious Identity Workbook included",
      "Personal Identity Blueprint",
      "Email support between sessions",
      "Values & purpose discovery",
    ],
    highlight: false,
  },
  {
    name: "Executive",
    price: "R45,000",
    description: "For leaders ready to embed their identity",
    duration: "12 sessions",
    features: [
      "12 × 90-minute coaching sessions",
      "Contagious Identity Workbook included",
      "360° Identity Assessment",
      "Stakeholder interviews (5 people)",
      "Personal Identity Blueprint",
      "Implementation support",
      "Priority access & support",
    ],
    highlight: true,
  },
  {
    name: "Strategic",
    price: "R75,000",
    description: "For leaders building lasting legacy",
    duration: "Full engagement",
    features: [
      "Everything in Executive, plus:",
      "SHIFT Methodology training",
      "Team identity workshops included",
      "Comprehensive 360° Assessment",
      "Stakeholder interviews (10 people)",
      "Succession identity planning",
      "6-month follow-up session",
    ],
    highlight: false,
  },
];

const faqs = [
  {
    question: "How is this different from traditional executive coaching?",
    answer: "Traditional coaching often focuses on skills, behaviours, or performance metrics. Contagious Identity Coaching goes deeper—it focuses on who you are as a leader and how that identity spreads through your organisation. We're not fixing problems; we're shaping influence.",
  },
  {
    question: "What format are the coaching sessions?",
    answer: "Sessions are 90 minutes, conducted via video call (Zoom or Teams) or in-person if you're in the Gauteng area. We find 90 minutes allows for both strategic conversation and practical application.",
  },
  {
    question: "How do you ensure confidentiality?",
    answer: "Complete confidentiality is non-negotiable. Nothing discussed in our sessions is shared with anyone—including your board, investors, or HR. This is a safe space for honest leadership reflection.",
  },
  {
    question: "What is the 360° Identity Assessment?",
    answer: "The 360° Identity Assessment is a confidential, invitation-only process designed to surface how your leadership identity is experienced across your ecosystem. Through discreet, one-on-one conversations with a carefully selected group (typically 5–10 people such as direct reports, peers, board members, or other key stakeholders), we gather qualitative insights into how your presence, decisions, and behaviours are currently being perceived. All input is anonymised, synthesised, and handled with strict confidentiality. You receive no raw feedback—only a clear, professionally interpreted identity map that reveals patterns, gaps, and leverage points without exposing individual voices.",
  },
  {
    question: "Can I include my leadership team?",
    answer: "Yes. The Strategic tier includes two team identity workshops. For a fully integrated approach across your leadership team, we can design a custom engagement.",
  },
  {
    question: "What's the time commitment?",
    answer: "Beyond the coaching sessions themselves, expect 2-3 hours per week for reflection exercises, application practice, and workbook completion. The real work happens between sessions.",
  },
  {
    question: "How do I know if I'm the right fit?",
    answer: "If you're a senior leader who cares about legacy, influence, and the culture you're creating—and you're willing to do honest self-examination—you're likely a good fit. We'll have a brief conversation before committing to ensure mutual alignment.",
  },
];

export default function ContagiousIdentityCoaching() {
  const scrollToProcess = () => {
    document.getElementById("coaching-process")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInterest = () => {
    document.getElementById("interest-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Executive Coaching for Contagious Identity | Leadership by Design"
        description="Identity-driven executive coaching for senior leaders. 6 sessions focused on how you lead under pressure — because that is what becomes contagious. R15,000."
        canonicalUrl="/contagious-identity"
        ogImage="https://leadershipbydesign.co/og-contagious-identity.jpg"
        keywords="executive coaching, leadership identity, CEO coaching, contagious identity, leadership legacy, identity coaching South Africa"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Executive coaching session" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-white"
          >
            <p className="text-primary font-medium tracking-wider uppercase mb-4">
              Executive Coaching
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Contagious Identity
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Your leadership identity is spreading through your organisation right now. 
              The question is: is it the identity you intended?
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Shape the identity others catch from you",
                "Build influence that transcends your position",
                "Create a legacy that survives your exit",
              ].map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-lg text-gray-200">{point}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={scrollToProcess}
                className="text-lg px-8 py-6"
              >
                Explore the Coaching Process
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToInterest}
                className="text-lg px-8 py-6 border-gray-400 text-gray-200 hover:bg-white/10"
              >
                Start the Conversation
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What This Coaching Actually Does
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Leadership identity isn't about personal branding or impression management. 
              It's about the unconscious transmission of who you are—your values, standards, 
              and ways of being—to everyone who experiences your leadership.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div {...fadeInUp} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">This IS:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Deep identity work with strategic application</li>
                    <li>• Shaping how your leadership "lands" with others</li>
                    <li>• Building influence that transcends your title</li>
                    <li>• Creating a leadership legacy by design</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">This is NOT:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Therapy or counselling</li>
                    <li>• Generic executive coaching</li>
                    <li>• Personal branding or image consulting</li>
                    <li>• Quick-fix performance coaching</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why This Matters Now */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why This Matters Now
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <motion.div 
                {...fadeInUp}
                className="relative rounded-2xl overflow-hidden shadow-xl"
              >
                <img 
                  src={reflectionImage} 
                  alt="Executive leader in contemplation" 
                  className="w-full aspect-video object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </motion.div>

              {/* Content */}
              <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="text-lg leading-relaxed mb-6">
                    Most leaders believe they're defined by their achievements, decisions, and strategic 
                    choices. But your team isn't experiencing your strategy—they're experiencing <em>you</em>.
                  </p>
                  <p className="text-lg leading-relaxed mb-6">
                    Every interaction transmits something. Every decision reveals something. Every 
                    response under pressure teaches something. Your people are learning from you 
                    constantly—whether you're conscious of the lesson or not.
                  </p>
                  <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 text-xl font-medium text-foreground italic">
                    "Leaders are always teaching. The only question is: what?"
                  </blockquote>
                  <p className="text-lg leading-relaxed">
                    Contagious Identity Coaching helps you become intentional about the identity 
                    you're transmitting—so that the culture, values, and standards you want become 
                    the ones that actually spread.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* A4 Coaching Model */}
      <A4CoachingModel />

      {/* Pain Points Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              This Coaching Addresses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common challenges faced by senior leaders who care about their influence and legacy.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Who This Is For
              </h2>
            </div>

            {/* Top Image Banner */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <motion.div 
                {...fadeInUp}
                className="relative rounded-2xl overflow-hidden shadow-lg"
              >
                <img 
                  src={influenceImage} 
                  alt="Executive leader presenting to team" 
                  className="w-full aspect-video object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-semibold text-lg">Build Lasting Influence</p>
                  <p className="text-sm text-white/80">Lead with presence that shapes culture</p>
                </div>
              </motion.div>
              <motion.div 
                {...fadeInUp}
                className="relative rounded-2xl overflow-hidden shadow-lg"
              >
                <img 
                  src={legacyImage} 
                  alt="Leadership legacy and succession" 
                  className="w-full aspect-video object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-semibold text-lg">Create Enduring Legacy</p>
                  <p className="text-sm text-white/80">Your identity survives your exit</p>
                </div>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">Ideal Clients</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>New CEOs stepping into senior leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Senior executives responsible for large teams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Leaders preparing for succession or transition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Family business principals shaping generational culture</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <Brain className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">Right Mindset</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Committed to honest self-examination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Willing to receive feedback from stakeholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Focused on long-term impact, not quick fixes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Ready to invest time between sessions</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workbook Section - Now promoting paid product + included with coaching */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[hsl(210,35%,12%)] via-[hsl(200,30%,15%)] to-[hsl(210,35%,12%)] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeInUp}>
                <p className="text-primary font-medium tracking-wider uppercase mb-4">
                  The Companion Workbook
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  The Contagious Identity Workbook
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  The comprehensive self-coaching workbook used throughout our coaching engagements. 
                  Available standalone or included free with any coaching package.
                </p>
                <ul className="space-y-3 text-gray-300 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Complete identity discovery process</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>50% discount codes for 3 premium tools</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>"Ask Your Coach" prompts throughout</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="space-y-6">
                  {/* Option 1: Buy Standalone */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">Buy Standalone</h3>
                      <span className="text-2xl font-bold text-primary">R2,700</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Work through the 10-module programme at your own pace. Upgrade to coaching within 90 days and get the R2,700 credited.
                    </p>
                    <Button asChild className="w-full">
                      <a href="/contagious-identity-workbook">
                        Get the Workbook
                      </a>
                    </Button>
                  </div>

                  {/* Option 2: With Coaching */}
                  <div className="rounded-xl p-6 border-2" style={{ borderColor: "#C8A864", backgroundColor: "rgba(200, 168, 100, 0.1)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">With Coaching</h3>
                      <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}>
                        INCLUDED FREE
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Get the workbook included at no extra cost as part of any coaching package. Your coach walks you through it session by session.
                    </p>
                    <Button variant="outline" onClick={scrollToInterest} className="w-full border-gray-400 text-gray-200 hover:bg-white/10">
                      Explore Coaching Packages
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Process Section */}
      <section id="coaching-process" className="py-20 md:py-28 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Coaching Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured journey from identity discovery to organisational integration.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {coachingPhases.map((phase, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                className="relative pl-8 pb-12 last:pb-0"
              >
                {index < coachingPhases.length - 1 && (
                  <div className="absolute left-[15px] top-12 bottom-0 w-[2px] bg-border" />
                )}
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {phase.phase}
                </div>
                <div className="ml-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{phase.title}</h3>
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{phase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.activities.map((activity, actIndex) => (
                      <span
                        key={actIndex}
                        className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Investment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three engagement options designed for different stages of your leadership journey.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative rounded-2xl p-8 ${
                  tier.highlight
                    ? "bg-card border-2 border-primary shadow-xl"
                    : "bg-card border border-border"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-4">{tier.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{tier.duration}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={scrollToInterest}
                  className="w-full"
                  variant={tier.highlight ? "default" : "outline"}
                >
                  Express Interest
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-lg border border-border px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="interest-form" className="py-20 md:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start the Conversation
              </h2>
              <p className="text-lg text-muted-foreground">
                Tell us about your leadership situation. We'll respond within 24 hours to discuss 
                whether this coaching is the right fit for your goals.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
              <InterestForm />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
