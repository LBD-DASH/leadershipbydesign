import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Target, Heart, Shield, Users, Lightbulb, Star, ArrowLeft, X, Sparkles, Focus, HeartHandshake, Eye, Volume2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { generateCorporateMindResetPdf } from "@/lib/generateCorporateMindResetPdf";
import heroImage from "@/assets/corporate-mind-reset-hero.jpg";
import problemImage from "@/assets/cmr-problem-burnout.jpg";
import sessionsImage from "@/assets/cmr-sessions-team.jpg";
import facilitatorImage from "@/assets/cmr-facilitator-kevin.jpg";
import ctaImage from "@/assets/cmr-cta-reset.jpg";
import kevinImage from "@/assets/kevin-britz-facilitator.jpg";

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

const sessions = [
  { num: "01", title: "Clearing the Noise", subtitle: "Stress Reduction & Burnout Prevention", desc: "Identify and release the mental patterns driving chronic stress. Walk away with tools to immediately reduce overwhelm.", icon: Volume2 },
  { num: "02", title: "Sharpening the Edge", subtitle: "High-Performance Focus & Mental Clarity", desc: "Train the mind to move from reactive to intentional. Build the focus muscle your team needs to perform at the highest level.", icon: Focus },
  { num: "03", title: "Bouncing Forward", subtitle: "Emotional Resilience Under Pressure", desc: "Develop the emotional agility to stay grounded, adaptive, and effective — even when conditions are challenging.", icon: HeartHandshake },
  { num: "04", title: "Leading From Within", subtitle: "Intentional Leadership Mindset", desc: "Anchor the entire programme with a deep dive into purposeful, conscious leadership. Leave with a personal mindset blueprint.", icon: Eye },
];

const outcomes = [
  { icon: Brain, label: "Measurable reduction in workplace stress" },
  { icon: Target, label: "Sharper focus and faster decision-making" },
  { icon: Shield, label: "Greater emotional resilience" },
  { icon: Users, label: "Improved team cohesion and communication" },
  { icon: Heart, label: "Reduced absenteeism and presenteeism" },
  { icon: Lightbulb, label: "A culture of psychological safety" },
];

const audiences = [
  { title: "HR Directors & L&D Managers", desc: "Looking to invest in employee wellbeing with measurable ROI" },
  { title: "C-Suite Executives", desc: "Seeking to build a high-performance culture from the top down" },
  { title: "Team Leaders & Middle Management", desc: "Ready to lead with more presence, clarity, and impact" },
];

const testimonials = [
  { name: "Sarah M.", role: "Head of People, FinTech SA", quote: "The shift in our leadership team's presence was noticeable within days. This programme is a game-changer." },
  { name: "David K.", role: "CEO, Manufacturing Group", quote: "Practical, powerful, and surprisingly transformative. Our executive team now operates with a completely different mindset." },
  { name: "Nomsa T.", role: "L&D Director, Banking Sector", quote: "Finally, a programme that treats mental performance as a business priority — not a 'nice to have'." },
];

export default function CorporateMindReset() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", dates: "", attendees: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_form_submissions").insert({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        message: `Corporate Mind Reset Booking\nPreferred Dates: ${formData.dates}\nAttendees: ${formData.attendees}`,
        service_interest: "Corporate Mind Reset",
      });
      if (error) throw error;
      toast.success("Booking request submitted! We'll be in touch shortly.");
      setBookingOpen(false);
      setFormData({ name: "", company: "", email: "", phone: "", dates: "", attendees: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="The Corporate Mind Reset | Leadership by Design"
        description="A 4 x 90-Minute Intentional Mindset Meditation Programme for High-Performing Corporate Teams. Reset the mind. Reclaim performance."
      />

      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: `${navy}ee`, borderColor: `${gold}33` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/programmes" className="flex items-center gap-2 text-sm font-medium" style={{ color: `${gold}cc` }}>
            <ArrowLeft className="w-4 h-4" /> Back to Programmes
          </Link>
          <span className="font-serif text-lg font-semibold hidden sm:block" style={{ color: cream }}>The Corporate Mind Reset</span>
          <Button onClick={() => setBookingOpen(true)} className="text-sm font-semibold" style={{ background: gold, color: navy }}>
            Book Now
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: navy }}>
        <div className="absolute inset-0 opacity-50">
          <img src={problemImage} alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${navy}66 0%, ${navy}aa 50%, ${navy}ee 100%)` }} />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.3em] text-sm mb-6 font-medium" style={{ color: gold }}>Corporate Wellness</motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: cream }}>
            Reset the Mind.<br /><span style={{ color: gold }}>Reclaim Performance.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: `${cream}bb` }}>
            A 4 × 90-Minute Intentional Mindset Meditation Programme for High-Performing Corporate Teams
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setBookingOpen(true)} className="text-base font-semibold px-8 py-6" style={{ background: gold, color: navy }}>
              Book Your Programme
            </Button>
            <Button size="lg" variant="outline" onClick={() => generateCorporateMindResetPdf()} className="text-base font-semibold px-8 py-6" style={{ borderColor: gold, color: gold, background: "transparent" }}>
              Download the Brochure
            </Button>
          </motion.div>
        </motion.div>
        {/* Particle dots */}
        {[...Array(20)].map((_, i) => (
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
            Your team is showing up — but are they really <span style={{ color: gold }}>present</span>?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Zap, title: "Burnout", stat: "67% of employees report chronic stress directly affecting their output" },
              { icon: Sparkles, title: "Distraction", stat: "The average employee loses 2.1 hours per day to mental noise and reactive thinking" },
              { icon: Users, title: "Disengagement", stat: "Disengaged teams cost businesses up to 34% of an employee's annual salary" },
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
          <motion.p variants={fadeUp} className="text-center text-lg font-medium max-w-3xl mx-auto" style={{ color: navy }}>
            "The modern workplace demands peak mental performance. Most organisations are leaving it to chance."
          </motion.p>
        </div>
      </motion.section>

      {/* THE SOLUTION */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: navy }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: `${gold}99` }}>Introducing</motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold mb-8" style={{ color: cream }}>
            The Corporate Mind Reset
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-10" style={{ color: `${cream}cc` }}>
            This is not yoga. This is not relaxation. The Corporate Mind Reset is science-backed, intentional mindset training that rewires how your people think, respond, and perform under pressure. Delivered in 4 × 90-minute facilitated sessions, this programme creates measurable shifts in focus, resilience, and leadership presence.
          </motion.p>
          <motion.div variants={fadeUp} className="w-32 h-px mx-auto" style={{ background: gold }} />
        </div>
      </motion.section>

      {/* THE 4 SESSIONS */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-6xl mx-auto">
          <motion.p variants={fadeUp} className="uppercase tracking-[0.25em] text-xs text-center mb-3" style={{ color: `${navy}66` }}>Programme Structure</motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-10" style={{ color: navy }}>
            4 × 90-Minute <span style={{ color: gold }}>Sessions</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden mb-14 aspect-[21/9]">
            <img src={sessionsImage} alt="Corporate team in mindful meditation session" className="w-full h-full object-cover object-center" />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {sessions.map((s) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                className="group rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg"
                style={{ background: "white", borderColor: `${gold}22` }}
                whileHover={{ borderColor: gold }}
              >
                <div className="flex items-start gap-5">
                  <span className="font-serif text-5xl font-bold leading-none" style={{ color: `${gold}33` }}>{s.num}</span>
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-1" style={{ color: navy }}>{s.title}</h3>
                    <p className="text-sm font-medium mb-3" style={{ color: gold }}>{s.subtitle}</p>
                    <p className="text-sm leading-relaxed" style={{ color: `${navy}88` }}>{s.desc}</p>
                  </div>
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
            What Changes After <span style={{ color: gold }}>The Corporate Mind Reset</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((o) => (
              <motion.div key={o.label} variants={fadeUp} className="rounded-xl p-6 flex items-start gap-4" style={{ background: `${navyLight}` }}>
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: `${gold}20` }}>
                  <o.icon className="w-5 h-5" style={{ color: gold }} />
                </div>
                <p className="text-sm font-medium" style={{ color: `${cream}dd` }}>{o.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* WHO IS THIS FOR */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: cream }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: navy }}>
            Designed For Leaders at <span style={{ color: gold }}>Every Level</span>
          </motion.h2>
          <div className="space-y-5">
            {audiences.map((a) => (
              <motion.div key={a.title} variants={fadeUp} className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 border" style={{ background: "white", borderColor: `${gold}22` }}>
                <h3 className="font-serif text-lg font-bold flex-shrink-0 md:w-72" style={{ color: navy }}>{a.title}</h3>
                <p className="text-sm" style={{ color: `${navy}88` }}>{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SOCIAL PROOF */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="py-24 px-6" style={{ background: navy }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: cream }}>
            What Our <span style={{ color: gold }}>Clients</span> Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
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
          <motion.p variants={fadeUp} className="text-center text-sm" style={{ color: `${cream}66` }}>
            Trusted by organisations across South Africa
          </motion.p>
        </div>
      </motion.section>

      {/* FACILITATOR BIO */}
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
              <p className="text-sm font-medium mb-5" style={{ color: gold }}>Master Practitioner in Time Line Therapy & Hypnotherapy | Founder, Leadership by Design</p>
              <p className="text-sm leading-relaxed mb-8" style={{ color: `${navy}99` }}>
                With over 11 years of experience and more than 3,000 coaching sessions delivered, Kevin brings a unique blend of executive coaching expertise and mindset methodology to The Corporate Mind Reset. His approach is practical, evidence-based, and designed specifically for the pressures of the modern corporate environment.
              </p>
              <div className="flex flex-wrap gap-4">
                {["11 Years", "3,000+ Coaching Sessions", "10,000+ Leaders Impacted"].map((s) => (
                  <span key={s} className="rounded-full px-5 py-2 text-xs font-semibold" style={{ background: `${gold}15`, color: gold }}>{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={ctaImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `${navy}cc` }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-5xl font-bold mb-6" style={{ color: cream }}>
            Your team's next level starts with a single <span style={{ color: gold }}>reset</span>.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base mb-10" style={{ color: `${cream}99` }}>
            Limited group bookings available. Reach out to secure your dates.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button size="lg" onClick={() => setBookingOpen(true)} className="text-base font-semibold px-10 py-6 mb-4" style={{ background: gold, color: navy }}>
              Book The Corporate Mind Reset
            </Button>
            <p className="text-sm" style={{ color: `${cream}66` }}>
              hello@leadershipbydesign.co.za · www.leadershipbydesign.co.za
            </p>
          </motion.div>
        </div>
      </motion.section>

      <Footer />

      {/* BOOKING MODAL */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md" style={{ background: cream }}>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl" style={{ color: navy }}>Book Your Programme</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Input placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ borderColor: `${navy}22` }} />
            <Input placeholder="Company" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ borderColor: `${navy}22` }} />
            <Input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ borderColor: `${navy}22` }} />
            <Input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ borderColor: `${navy}22` }} />
            <Input placeholder="Preferred Dates" value={formData.dates} onChange={(e) => setFormData({ ...formData, dates: e.target.value })} style={{ borderColor: `${navy}22` }} />
            <Input type="number" placeholder="Number of Attendees" value={formData.attendees} onChange={(e) => setFormData({ ...formData, attendees: e.target.value })} style={{ borderColor: `${navy}22` }} />
            <Button type="submit" className="w-full font-semibold py-6" disabled={submitting} style={{ background: gold, color: navy }}>
              {submitting ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
