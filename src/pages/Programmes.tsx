import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { CourseSchema, ServiceSchema, HowToSchema } from "@/components/StructuredData";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, MessageCircle, Compass, Users, Brain, MessageSquare, Target, GraduationCap, Shield, Headphones } from "lucide-react";
import InterestModal from "@/components/shared/InterestModal";
import leaderAsCoachImage from "@/assets/leader-as-coach.jpg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StatsBar from "@/components/StatsBar";

// --- Programme Card Data ---
const programmes = [
  {
    id: "leader-as-coach",
    icon: MessageCircle,
    title: "Leader as Coach",
    tagline: "Transform leaders into effective coaches",
    meta: "10 months • 5 phases",
    price: "Enquire",
    image: leaderAsCoachImage,
    link: "/leader-as-coach",
    tags: ["Trust Building", "Neuroscience", "Wellbeing"],
  },
  {
    id: "leadership-levels",
    icon: Compass,
    title: "Leadership Development (L1–L5)",
    tagline: "The #1 system for scaling leaders",
    meta: "4–12 weeks per level",
    price: "From R25,000 per level",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    link: "/leadership-development",
    tags: ["Productivity", "Strategy", "Purpose"],
  },
  {
    id: "corporate-mind-reset",
    icon: Brain,
    title: "The Corporate Mind Reset",
    tagline: "4 × 90-minute intentional mindset meditation sessions for teams. Reset the mind. Reclaim signal through stillness.",
    meta: "4 × 90-minute sessions • In-person",
    price: "From R25,000 per group",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    link: "/corporate-mind-reset",
    tags: ["Stress Reduction", "Resilience", "Mindset"],
  },
  {
    id: "contagious-identity",
    icon: MessageSquare,
    title: "Contagious Identity Coaching",
    tagline: "Lead from a clear, contagious identity",
    meta: "6–12 sessions • Premium 1:1",
    price: "From R15,000",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
    link: "/contagious-identity",
    tags: ["Identity", "Influence", "Legacy"],
  },
  {
    id: "enneagram-workshop",
    icon: Shield,
    title: "Enneagram Workshop",
    tagline: "Deep self-awareness and team understanding through the Enneagram personality framework",
    meta: "1 day • In-person",
    price: "R7,000 pp / R10,000 group",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    link: "/contact",
    tags: ["Self-Awareness", "Team Dynamics", "Personality"],
  },
  {
    id: "alignment-workshop",
    icon: Users,
    title: "Alignment Workshop",
    tagline: "Get everyone rowing in the same direction",
    meta: "1–2 days • In-person",
    price: "From R15,000",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    link: "/workshops/alignment",
    tags: ["Clarity", "Direction", "Strategy"],
  },
  {
    id: "motivation-workshop",
    icon: Users,
    title: "Motivation Workshop",
    tagline: "Reignite team energy and engagement",
    meta: "1–2 days • In-person",
    price: "From R15,000",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    link: "/workshops/motivation",
    tags: ["Energy", "Purpose", "Engagement"],
  },
  {
    id: "leadership-workshop",
    icon: Users,
    title: "Leadership Workshop",
    tagline: "Create a culture of accountability",
    meta: "1–2 days • In-person",
    price: "From R15,000",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    link: "/workshops/leadership",
    tags: ["Accountability", "Ownership", "Growth"],
  },
  {
    id: "executive-coaching",
    icon: Target,
    title: "Executive Coaching",
    tagline: "Bespoke 1:1 coaching for senior leaders",
    meta: "90-day engagement",
    price: "Custom pricing",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    link: "/executive-coaching",
    tags: ["Strategic Clarity", "Performance", "Presence"],
  },
  {
    id: "bespoke-meditations",
    icon: Headphones,
    title: "Bespoke Mindset Meditations",
    tagline: "Custom-scripted mindset and visualisation audio programmes built around your organisation's specific challenges",
    meta: "Custom duration • Digital delivery",
    price: "From R997",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
    link: "/bespoke-meditations",
    tags: ["Visualisation", "Performance", "Custom Audio"],
  },
];

function ProgrammeCard({ programme, index }: { programme: typeof programmes[0]; index: number }) {
  const Icon = programme.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      <Link to={programme.link} className="block group h-full">
        <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          <div className="relative h-44 overflow-hidden">
            <img
              src={typeof programme.image === "string" ? programme.image : programme.image}
              alt={programme.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div className="absolute top-3 right-3">
              <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                {programme.price}
              </span>
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {programme.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{programme.tagline}</p>
            <p className="text-xs text-muted-foreground/70 mb-4">{programme.meta}</p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {programme.tags.map((tag) => (
                <span key={tag} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Programmes() {
  const [facilitatorModalOpen, setFacilitatorModalOpen] = useState(false);
  return (
    <>
      <SEO
        title="Leadership Programmes & Team Workshops | Leadership by Design"
        description="Executive coaching, team workshops, and bespoke leadership development programmes. Contagious Identity coaching, SHIFT methodology, and team effectiveness training."
        canonicalUrl="/programmes"
        ogImage="https://leadershipbydesign.co/og-programmes.jpg"
        keywords="leadership programmes, executive coaching, team workshops, SHIFT methodology, contagious identity coaching, leadership development South Africa"
      />

      {/* Structured Data */}
      <CourseSchema name="Leading in the AI Era" description="Move from AI uncertainty to confident integration in 6 weeks." duration="P6W" url="/programmes" />
      <CourseSchema name="Leader as Coach Programme" description="Transform leaders into effective coaches over 6 months." duration="P6M" url="/programmes" />
      <ServiceSchema name="Team Alignment Workshop" description="Build strategic clarity. 1-2 day in-person workshop." url="/workshops/alignment" />
      <ServiceSchema name="Executive Coaching" description="One-on-one coaching for senior leaders. 90-day engagement." url="/executive-coaching" />
      <HowToSchema
        name="How to Develop Leadership Skills with the L1-L5 Framework"
        description="Progress through 5 leadership levels from personal productivity to strategic leadership."
        totalTime="P12M"
        steps={[
          { name: "L1: Master Personal Productivity", text: "Focus on personal output and self-management." },
          { name: "L2: Develop Others", text: "Invest in growing team members through coaching." },
          { name: "L3: Lead with Purpose", text: "Connect work to meaning and vision." },
          { name: "L4: Motivate Teams", text: "Energize teams through motivational leadership." },
          { name: "L5: Think Strategically", text: "Drive long-term success through strategic thinking." },
        ]}
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {/* Hero Offer — Leading in the AI Era */}
          <section className="relative overflow-hidden mb-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, hsla(200, 70%, 25%, 0.92) 0%, hsla(200, 60%, 35%, 0.85) 100%), url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80')`,
              }}
            />
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              >
                <div>
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/20">
                    Featured Programme
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Leading in the AI Era
                  </h1>
                  <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed">
                    Move from AI uncertainty to confident integration in 6 weeks. Protect your Human Edge and build augmented workflows that enhance—not replace—human judgment.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-8 text-sm text-white/70">
                    <span>6 weeks</span>
                    <span className="text-white/30">•</span>
                    <span>Online + Coaching</span>
                    <span className="text-white/30">•</span>
                    <span className="text-white font-semibold">From R35,000 per cohort</span>
                  </div>
                  <Link to="/contact">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group">
                      Get a Custom Quote
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:flex flex-wrap gap-2 justify-end">
                  {["AI Capabilities", "Human Edge", "POPI Act", "Augmented Workflows", "Change Management"].map((tag) => (
                    <span key={tag} className="bg-white/10 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Bar */}
          <StatsBar />

          {/* All Programmes Grid */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                All Programmes & Workshops
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                From half-day workshops to 6-month coaching journeys — find the right intervention for your team.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {programmes.map((programme, index) => (
                <ProgrammeCard key={programme.id} programme={programme} index={index} />
              ))}
            </div>

            {/* Certified Facilitator — Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-muted/30 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                      Certified Leadership by Design Facilitator
                    </h3>
                    <span className="bg-primary/15 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Coming Q3 2026
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Deliver our proven methodology in your organisation or coaching practice. License the SHIFT Framework™, Contagious Identity tools, and L1–L5 system.
                  </p>
                </div>
                <Button
                  onClick={() => setFacilitatorModalOpen(true)}
                  className="rounded-full shrink-0"
                >
                  Expression of Interest
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 bg-muted/50 rounded-2xl p-6 sm:p-8 border border-border text-center"
            >
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">Not sure where to start?</h3>
              <p className="text-muted-foreground text-sm mb-5 max-w-xl mx-auto">
                Take a free 5-minute diagnostic to discover which programme fits your team's biggest challenge.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link to="/team-diagnostic">
                  <Button variant="outline" className="rounded-full group">
                    Team Diagnostic
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/leadership-diagnostic">
                  <Button variant="outline" className="rounded-full group">
                    Leadership Diagnostic
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Social Share */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
              <SocialShareButtons
                title="Explore leadership development programmes and workshops"
                description="Discover programmes designed to develop leaders at every level."
              />
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <InterestModal
        open={facilitatorModalOpen}
        onOpenChange={setFacilitatorModalOpen}
        context="Certified Facilitator Programme — Expression of Interest"
      />
    </>
  );
}
