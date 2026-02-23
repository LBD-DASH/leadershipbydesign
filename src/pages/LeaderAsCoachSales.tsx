import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Star, Users, Target,
  TrendingUp, Lightbulb, Shield, Compass, Heart, Sparkles, Zap, MessageCircle, Layers
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

import heroImage from "@/assets/leader-as-coach.jpg";
import feedbackImage from "@/assets/leadership-feedback.jpg";
import teamHandsImage from "@/assets/product-team-hands-above.jpg";
import kevinImage from "@/assets/kevin-britz-facilitator.jpg";
import shiftHeroImage from "@/assets/shift-hero-team.jpg";
import shiftSkillFocus from "@/assets/shift-skill-focus.jpg";
import shiftSkillThinking from "@/assets/shift-skill-thinking.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const navy = "#0A1F44";
const gold = "#C9A84C";
const cream = "#FAF6EF";
const navyLight = "#0F2D5E";

const phases = [
  {
    num: "01",
    title: "Leadership Identity & Self-Awareness",
    duration: "Months 1–2",
    shift: "Self-Management",
    topics: ["Contagious Identity mapping", "Values & purpose alignment", "Leadership style diagnostic", "Emotional intelligence baseline"],
    image: heroImage,
  },
  {
    num: "02",
    title: "Communication Mastery & Emotional Intelligence",
    duration: "Months 3–4",
    shift: "Human Intelligence",
    topics: ["Difficult conversations framework", "Feedback Formula™ integration", "Active listening & coaching questions", "Conflict resolution without drama"],
    image: feedbackImage,
  },
  {
    num: "03",
    title: "Performance, Accountability & Boundaries",
    duration: "Months 5–6",
    shift: "Focus",
    topics: ["Setting non-negotiable standards", "Accountability conversations", "Delegation mastery", "Performance improvement process"],
    image: shiftSkillFocus,
  },
  {
    num: "04",
    title: "High-Performing Teams & Strategic Leadership",
    duration: "Months 7–8",
    shift: "Innovation & Thinking",
    topics: ["Team dynamics & psychological safety", "Strategic planning for people leaders", "Coaching for high-potential talent", "Building succession pipelines"],
    image: teamHandsImage,
  },
  {
    num: "05",
    title: "Sustainability, Succession & Embedding",
    duration: "Months 9–10",
    shift: "Thinking",
    topics: ["Coaching culture embedding", "Peer coaching circles", "Knowledge transfer systems", "Long-term sustainability planning"],
    image: shiftSkillThinking,
  },
];

const outcomes = [
  { icon: TrendingUp, label: "Culture shift visible within 90 days" },
  { icon: Heart, label: "Coaching capability embedded at every level" },
  { icon: Shield, label: "40% reduction in unresolved conflict" },
  { icon: Target, label: "Measurable ROI with pulse assessments" },
  { icon: Users, label: "Succession pipeline activated" },
  { icon: MessageCircle, label: "Common leadership language across the organisation" },
];

const testimonials = [
  { name: "Sarah K.", role: "Group HR Director, Financial Services", quote: "The Leader as Coach programme fundamentally changed how our managers lead. We went from a command-and-control culture to genuine coaching conversations in under 6 months." },
  { name: "David M.", role: "COO, Manufacturing Group", quote: "Our conflict resolution rate improved by 45%. Managers who used to avoid difficult conversations are now having them proactively and constructively." },
  { name: "Nandi T.", role: "Head of L&D, Retail Chain", quote: "The 10-month structure is what makes this different. It's not a workshop — it's a transformation. Our leaders actually sustained the changes." },
];

export default function LeaderAsCoachSales() {
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
        message: formData.message || "Leader as Coach Programme Enquiry",
        service_interest: "Leader as Coach Programme",
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
        title="Leader as Coach Programme | Leadership by Design"
        description="A 10-month coaching transformation programme that turns managers into leaders who coach, not control. Built on the SHIFT Skills Framework with the People-Profit-Process model."
        canonicalUrl="/leader-as-coach"
        keywords="leader as coach, coaching culture, leadership development, coaching programme, SHIFT methodology, South Africa"
      />

      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: `${navy}ee`, borderColor: `${gold}33` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/programmes" className="flex items-center gap-2 text-sm font-medium" style={{ color: `${gold}cc` }}>
            <ArrowLeft className="w-4 h-4" /> Back to Programmes
          </Link>
          <span className="font-serif text-lg font-semibold hidden sm:block" style={{ color: cream }}>Leader as Coach</span>
          <Button onClick={() => setBookingOpen(true)} className="text-sm font-semibold" style={{ background: gold, color: navy }}>
            Enquire Now
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: navy }}>
        <div className="absolute inset-0 opacity-40">
          <img src={heroImage} alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${navy}66 0%, ${navy}aa 50%, ${navy}ee 100%)` }} />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.3em] text-sm mb-6 font-medium" style={{ color: gold }}>
            Flagship 10-Month Programme
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: cream }}>
            Transform Managers into<br />Leaders Who <span style={{ color: gold }}>Coach, Not Control.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl mb-4 max-w-2xl mx-auto" style={{ color: `${cream}bb` }}>
            A comprehensive 5-phase system built on the SHIFT Skills Framework and the People-Profit-Process model — embedding real coaching capability into your organisation's DNA.
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm mb-10 font-medium" style={{ color: `${gold}cc` }}>
            From R45,000 per cohort · 10 Months · Hybrid Delivery
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setBookingOpen(true)} className="text-base font-semibold px-8 py-6" style={{ background: gold, color: navy }}>
              Request a Proposal
            </Button>
            <Link to="/shift-diagnostic">
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
            Why most leadership development <span style={{ color: gold }}>doesn't stick</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Layers, title: "One-Day Workshops Don't Work", stat: "Training events are forgotten within 2 weeks. Behaviour change requires sustained intervention, not inspiration." },
              { icon: Zap, title: "Toxic Culture Persists", stat: "Drama cycles, conflict avoidance, and blame culture remain because managers were never taught how to coach through them." },
              { icon: Users, title: "No Coaching Capability", stat: "Managers are promoted for technical skill, not leadership ability. They manage tasks, not people." },
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
            The 5-Phase Coaching System
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-10" style={{ color: `${cream}cc` }}>
            Built on the People-Profit-Process methodology and the SHIFT Skills Framework™, this 10-month programme
            takes managers through a structured transformation — from self-awareness to coaching mastery to
            organisational embedding. No shortcuts. No theory-only workshops. Real, lasting change.
          </motion.p>
          <motion.div variants={fadeUp} className="w-32 h-px mx-auto" style={{ background: gold }} />
        </div>
      </motion.section>

      {/* THE 5 PHASES */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-6xl mx-auto">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.25em] text-xs text-center mb-3" style={{ color: `${navy}66` }}>Programme Structure</motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: navy }}>
            5 Phases. <span style={{ color: gold }}>10 Months.</span>
          </motion.h2>
          <div className="space-y-12">
            {phases.map((phase, idx) => (
              <motion.div
                key={phase.num}
                variants={fadeUp}
                className={`grid md:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? "md:direction-rtl" : ""}`}
              >
                <div className={`rounded-2xl overflow-hidden aspect-[16/10] ${idx % 2 === 1 ? "md:order-2" : ""}`}>
                  <img src={phase.image} alt={phase.title} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className={idx % 2 === 1 ? "md:order-1" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-serif text-5xl font-bold" style={{ color: `${gold}44` }}>{phase.num}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold" style={{ color: navy }}>{phase.title}</h3>
                      <p className="text-sm font-medium" style={{ color: gold }}>{phase.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${gold}15`, color: gold }}>SHIFT: {phase.shift}</span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${navy}08`, color: `${navy}88` }}>Hybrid Delivery</span>
                  </div>
                  <ul className="space-y-2">
                    {phase.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm" style={{ color: `${navy}88` }}>
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: gold }} />
                        {topic}
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
            What Changes After <span style={{ color: gold }}>Leader as Coach</span>
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
              { step: "01", title: "Diagnose", desc: "Every manager takes our SHIFT Diagnostic to map their coaching strengths and gaps." },
              { step: "02", title: "Design", desc: "We customise the 5-phase programme to your organisation's culture, language, and priorities." },
              { step: "03", title: "Deliver", desc: "Monthly modules with coaching sessions, practical tools, and real-world application between sessions." },
              { step: "04", title: "Embed", desc: "Coaching circles, peer accountability, and sustainability planning ensure lasting change." },
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
                Kevin is the architect of the Leader as Coach Programme and the SHIFT Methodology™.
                With over 4,000 leaders developed, 750+ workshops delivered, and 11 years of experience across
                50+ organisations, Kevin brings a rare combination of scientific rigour and practical wisdom to coaching culture transformation.
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
              { label: "Single Cohort", price: "From R45,000", desc: "Up to 15 leaders, full 10-month programme" },
              { label: "Multi-Cohort", price: "From R120,000", desc: "Multiple cohorts, staggered rollout" },
              { label: "Enterprise", price: "Custom", desc: "Multi-site, blended delivery, executive sponsorship" },
            ].map((tier) => (
              <div key={tier.label} className="rounded-2xl p-8 border" style={{ background: navyLight, borderColor: `${gold}22` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: `${gold}99` }}>{tier.label}</p>
                <p className="font-serif text-3xl font-bold mb-2" style={{ color: cream }}>{tier.price}</p>
                <p className="text-sm" style={{ color: `${cream}88` }}>{tier.desc}</p>
              </div>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm mb-8" style={{ color: `${cream}66` }}>
            All programmes include: Online LMS Portal · Hard Copy Materials · Online Coaching · 6 Professional Assessments · Progress Tracking
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setBookingOpen(true)} className="text-base font-semibold px-8 py-6" style={{ background: gold, color: navy }}>
              Request a Proposal
            </Button>
            <Link to="/shift-diagnostic">
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
            Ready to Build a <span style={{ color: gold }}>Coaching Culture</span>?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg mb-8" style={{ color: `${navy}88` }}>
            Start with a conversation. We'll assess your needs and design the right programme for your organisation.
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
          context="Leader as Coach Programme"
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
              Tell us about your team and we'll design the right coaching programme for you.
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
