import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Star, Users, Target,
  TrendingUp, Lightbulb, Shield, Compass, Layers, Sparkles, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import ReferralSharePrompt from "@/components/shared/ReferralSharePrompt";

import leadershipL1Image from "@/assets/leadership-l1-productivity.jpg";
import leadershipL2Image from "@/assets/leadership-l2-development.jpg";
import leadershipL3Image from "@/assets/leadership-l3-purpose.jpg";
import leadershipL4Image from "@/assets/leadership-l4-motivational.jpg";
import leadershipL5Image from "@/assets/leadership-l5-strategic.jpg";
import kevinImage from "@/assets/kevin-britz-facilitator.jpg";
import shiftHeroImage from "@/assets/shift-hero-team.jpg";

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};
const staggerContainer = {
  visible: { transition: { staggerChildren: 0 } },
};

const navy = "#0A1F44";
const gold = "#C9A84C";
const cream = "#FAF6EF";
const navyLight = "#0F2D5E";

const levels = [
  {
    num: "L1",
    title: "Personal Productivity",
    subtitle: "Foundation: Self-Management & Consistency",
    duration: "8 Weeks",
    desc: "Master your time, energy, and commitments. Build the personal discipline that underpins every leadership level above.",
    outcomes: ["Effective time & energy management", "Systems for sustained productivity", "Consistent follow-through on commitments", "Priority clarity over reactive urgency"],
    icon: Zap,
    image: leadershipL1Image,
  },
  {
    num: "L2",
    title: "Leadership Development",
    subtitle: "Team Operator: Delegation & Trust",
    duration: "6 Weeks",
    desc: "Move from individual contributor to team enabler. Learn to delegate, communicate, and build the trust that unlocks team performance.",
    outcomes: ["Effective delegation & accountability", "Constructive conflict resolution", "Adaptive communication mastery", "Ownership of team outcomes"],
    icon: Users,
    image: leadershipL2Image,
  },
  {
    num: "L3",
    title: "Personal Leadership",
    subtitle: "Identity & Meaning: Purpose-Led Leading",
    duration: "12 Weeks",
    desc: "Ground your leadership in clarity of values, self-awareness, and inner resilience. Lead from who you are, not just what you do.",
    outcomes: ["Values & purpose alignment", "Deep self-awareness practices", "Pressure management without compromise", "Leadership identity crystallisation"],
    icon: Compass,
    image: leadershipL3Image,
  },
  {
    num: "L4",
    title: "Motivational Leadership",
    subtitle: "People & Energy: Inspiration at Scale",
    duration: "8 Weeks",
    desc: "Channel your presence into inspiring action. Learn to energise teams, drive change, and create the momentum that moves organisations.",
    outcomes: ["Inspire action & emotional buy-in", "Strengths-based people development", "Lead change with optimism", "Create high-engagement cultures"],
    icon: Sparkles,
    image: leadershipL4Image,
  },
  {
    num: "L5",
    title: "Strategic Leadership",
    subtitle: "Vision & System Builder: Long-Term Impact",
    duration: "4 Weeks",
    desc: "Think beyond the immediate. Align people, culture, and strategy to create lasting organisational impact and future-readiness.",
    outcomes: ["Long-term strategic thinking", "Culture-strategy alignment", "Change anticipation & preparation", "Vision-to-direction translation"],
    icon: Target,
    image: leadershipL5Image,
  },
];

const outcomes = [
  { icon: TrendingUp, label: "40% average improvement in leadership effectiveness" },
  { icon: Target, label: "94% diagnostic accuracy in identifying your operating level" },
  { icon: Zap, label: "40% faster decision-making within 60 days" },
  { icon: Users, label: "35% improvement in team engagement scores" },
  { icon: Shield, label: "Measurable ROI with progress tracking" },
  { icon: Lightbulb, label: "Personalised development roadmap per participant" },
];

const testimonials = [
  { name: "James P.", role: "MD, Financial Services", quote: "The L1–L5 framework gave our entire leadership pipeline a common language. The impact on decision-making was visible within weeks." },
  { name: "Lindiwe M.", role: "CHRO, Retail Group", quote: "We enrolled 40 managers across all five levels. The before-and-after data speaks for itself — engagement is up 38%." },
  { name: "Andre V.", role: "CEO, Tech Scale-Up", quote: "This isn't theory. Every session has practical tools we implement the same week. Our leadership bench has never been stronger." },
];

export default function LeadershipDevelopmentSales() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_form_submissions").insert({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        message: formData.message || "Leadership Development L1-L5 Enquiry",
        service_interest: "Leadership Development L1-L5",
      });
      if (error) throw error;
      toast.success("Enquiry submitted! We'll be in touch shortly.");
      setSubmitted(true);
      setFormData({ name: "", company: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Leadership Development L1–L5 | Leadership by Design"
        description="A structured 5-level leadership development system proven to deliver 40% productivity gains. From personal productivity to strategic vision — develop leaders at every level."
        canonicalUrl="/leadership-development"
        keywords="leadership development, leadership levels, L1 L5, leadership programme, executive development, South Africa"
      />

      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: `${navy}ee`, borderColor: `${gold}33` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/programmes" className="flex items-center gap-2 text-sm font-medium" style={{ color: `${gold}cc` }}>
            <ArrowLeft className="w-4 h-4" /> Back to Programmes
          </Link>
          <span className="font-serif text-lg font-semibold hidden sm:block" style={{ color: cream }}>Leadership Development</span>
          <Button onClick={() => setBookingOpen(true)} className="text-sm font-semibold" style={{ background: gold, color: navy }}>
            Enquire Now
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: navy }}>
        <div className="absolute inset-0 opacity-40">
          <img src={shiftHeroImage} alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${navy}66 0%, ${navy}aa 50%, ${navy}ee 100%)` }} />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.3em] text-sm mb-6 font-medium" style={{ color: gold }}>
            Internationally Recognised Programme
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: cream }}>
            Build Leaders at<br /><span style={{ color: gold }}>Every Level.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl mb-4 max-w-2xl mx-auto" style={{ color: `${cream}bb` }}>
            A structured 5-level development system that takes leaders from personal productivity to strategic vision — with measurable results at every stage.
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm mb-10 font-medium" style={{ color: `${gold}cc` }}>
            From R25,000 per cohort · Hybrid Delivery · 4–12 Week Programmes
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setBookingOpen(true)} className="text-base font-semibold px-8 py-6" style={{ background: gold, color: navy }}>
              Request a Proposal
            </Button>
            <Link to="/leadership-diagnostic">
              <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6" style={{ borderColor: gold, color: gold, background: "transparent" }}>
                Take the Free Diagnostic
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2, background: `${gold}44`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </section>

      {/* THE PROBLEM */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: navy }}>
            Most leadership programmes <span style={{ color: gold }}>miss the mark</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Layers, title: "One-Size-Fits-All", stat: "Generic programmes ignore that a first-time manager and a C-suite exec need fundamentally different development." },
              { icon: Zap, title: "No Measurable ROI", stat: "83% of organisations can't measure the impact of their leadership development investment." },
              { icon: Users, title: "Theory Without Action", stat: "Leaders attend workshops, feel inspired, then return to old habits within 2 weeks." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="rounded-2xl p-8 text-center border" style={{ background: "white", borderColor: `${gold}22` }}>
                <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: `${gold}15` }}>
                  <item.icon className="w-6 h-6" style={{ color: gold }} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3" style={{ color: navy }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: `${navy}99` }}>{item.stat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* THE SOLUTION */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: navy }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: `${gold}99` }}>The Solution</motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold mb-8" style={{ color: cream }}>
            The L1–L5 Leadership System
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-10" style={{ color: `${cream}cc` }}>
            Five distinct operating levels. Each with its own curriculum, tools, and measurable outcomes. 
            Leaders are assessed, placed at the right level, and developed with precision — not guesswork.
            Built on the internationally recognised SHIFT Methodology™.
          </motion.p>
          <motion.div variants={fadeUp} className="w-32 h-px mx-auto" style={{ background: gold }} />
        </div>
      </motion.section>

      {/* THE 5 LEVELS */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-6xl mx-auto">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.25em] text-xs text-center mb-3" style={{ color: `${navy}66` }}>Programme Structure</motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: navy }}>
            5 Levels. <span style={{ color: gold }}>One System.</span>
          </motion.h2>
          <div className="space-y-12">
            {levels.map((level, idx) => (
              <motion.div
                key={level.num}
                variants={fadeUp}
                className={`grid md:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? "md:direction-rtl" : ""}`}
              >
                <div className={`rounded-2xl overflow-hidden aspect-[16/10] ${idx % 2 === 1 ? "md:order-2" : ""}`}>
                  <img src={level.image} alt={level.title} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className={idx % 2 === 1 ? "md:order-1" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-serif text-5xl font-bold" style={{ color: `${gold}44` }}>{level.num}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold" style={{ color: navy }}>{level.title}</h3>
                      <p className="text-sm font-medium" style={{ color: gold }}>{level.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: `${navy}99` }}>{level.desc}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${gold}15`, color: gold }}>{level.duration}</span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${navy}08`, color: `${navy}88` }}>Hybrid Delivery</span>
                  </div>
                  <ul className="space-y-2">
                    {level.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-sm" style={{ color: `${navy}88` }}>
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: gold }} />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* OUTCOMES */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: navy }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: cream }}>
            What Changes After <span style={{ color: gold }}>L1–L5 Development</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((o) => (
              <motion.div key={o.label} variants={fadeUp} className="rounded-xl p-6 flex items-start gap-4" style={{ background: navyLight }}>
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: `${gold}20` }}>
                  <o.icon className="w-5 h-5" style={{ color: gold }} />
                </div>
                <p className="text-sm font-medium" style={{ color: `${cream}dd` }}>{o.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: navy }}>
            How It <span style={{ color: gold }}>Works</span>
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Diagnose", desc: "Every leader takes our free diagnostic to identify their primary operating level." },
              { step: "02", title: "Place", desc: "Leaders are placed at the right level — no wasted time on content they've already mastered." },
              { step: "03", title: "Develop", desc: "Targeted curriculum with practical tools implemented week-by-week in the workplace." },
              { step: "04", title: "Measure", desc: "Progress tracked through scorecards, coaching sessions, and re-assessment." },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp} className="text-center">
                <span className="font-serif text-4xl font-bold block mb-3" style={{ color: `${gold}44` }}>{item.step}</span>
                <h3 className="font-serif text-lg font-bold mb-2" style={{ color: navy }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: `${navy}88` }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: navy }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: cream }}>
            What Our <span style={{ color: gold }}>Clients</span> Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="rounded-2xl p-8" style={{ background: navyLight }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: gold }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: `${cream}cc` }}>"{t.quote}"</p>
                <p className="text-sm font-semibold" style={{ color: cream }}>{t.name}</p>
                <p className="text-xs" style={{ color: `${cream}88` }}>{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FACILITATOR */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: navy }}>
            Meet Your <span style={{ color: gold }}>Facilitator</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2 rounded-2xl overflow-hidden aspect-[4/5]">
              <img src={kevinImage} alt="Kevin Britz — Founder, Leadership by Design" className="w-full h-full object-cover object-top" />
            </div>
            <div className="md:col-span-3">
              <h3 className="font-serif text-2xl font-bold mb-1" style={{ color: navy }}>Kevin Britz</h3>
              <p className="text-sm font-medium mb-4" style={{ color: gold }}>Founder — Leadership by Design</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: `${navy}99` }}>
                Kevin is the architect of the L1–L5 Leadership System and the SHIFT Methodology™. 
                With over 4,000 leaders developed, 750+ workshops delivered, and 11 years of experience across 
                50+ organisations, Kevin brings a rare combination of scientific rigour and practical wisdom.
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: `${navy}99` }}>
                Master Practitioner in NLP, Time Line Therapy & Hypnotherapy. Published author. 
                Trusted by blue-chip organisations across South Africa.
              </p>
              <div className="flex gap-6">
                {[
                  { num: "4,000+", label: "Leaders Developed" },
                  { num: "11", label: "Years" },
                  { num: "94%", label: "Diagnostic Accuracy" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <span className="font-serif text-xl font-bold block" style={{ color: gold }}>{s.num}</span>
                    <span className="text-xs" style={{ color: `${navy}88` }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* PRICING */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: navy }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold mb-6" style={{ color: cream }}>
            Investment & <span style={{ color: gold }}>Delivery</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg mb-12" style={{ color: `${cream}bb` }}>
            Programmes are priced per cohort and fully customisable to your organisation's needs.
          </motion.p>
          <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Single Level", price: "From R25,000", desc: "Per cohort, per level" },
              { label: "Full Pipeline (L1–L5)", price: "From R95,000", desc: "Complete leadership system" },
              { label: "Enterprise", price: "Custom", desc: "Multi-site, blended delivery" },
            ].map((tier) => (
              <div key={tier.label} className="rounded-2xl p-8 border" style={{ background: navyLight, borderColor: `${gold}22` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: `${gold}99` }}>{tier.label}</p>
                <p className="font-serif text-3xl font-bold mb-2" style={{ color: cream }}>{tier.price}</p>
                <p className="text-sm" style={{ color: `${cream}88` }}>{tier.desc}</p>
              </div>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm mb-8" style={{ color: `${cream}66` }}>
            All programmes include: Online LMS Portal · Hard Copy Materials · Online Coaching · Progress Tracking
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setBookingOpen(true)} className="text-base font-semibold px-8 py-6" style={{ background: gold, color: navy }}>
              Request a Proposal
            </Button>
            <Link to="/leadership-diagnostic">
              <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6" style={{ borderColor: gold, color: gold, background: "transparent" }}>
                Take the Free Diagnostic First
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold mb-6" style={{ color: navy }}>
            Ready to Build Your <span style={{ color: gold }}>Leadership Pipeline</span>?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg mb-8" style={{ color: `${navy}88` }}>
            Start with a conversation. We'll assess your needs and recommend the right levels for your team.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button size="lg" onClick={() => setBookingOpen(true)} className="text-base font-semibold px-10 py-6" style={{ background: gold, color: navy }}>
              Let's Talk <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {submitted && (
        <ReferralSharePrompt
          context="Leadership Development L1–L5"
        />
      )}

      <Footer />

      {/* BOOKING MODAL */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-lg" style={{ background: cream }}>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold" style={{ color: navy }}>
              Request a Proposal
            </DialogTitle>
            <p className="text-sm" style={{ color: `${navy}88` }}>
              Tell us about your team and we'll design the right programme for you.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input placeholder="Full Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ borderColor: `${gold}33` }} />
            <Input placeholder="Company *" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ borderColor: `${gold}33` }} />
            <Input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ borderColor: `${gold}33` }} />
            <Input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ borderColor: `${gold}33` }} />
            <Textarea placeholder="Tell us about your team size, challenges, and goals..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ borderColor: `${gold}33` }} />
            <Button type="submit" disabled={submitting} className="w-full font-semibold py-5" style={{ background: gold, color: navy }}>
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
