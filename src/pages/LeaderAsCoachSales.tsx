import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Users, Target,
  TrendingUp, Shield, MessageCircle, Calendar,
  BarChart3, AlertTriangle, Zap,
  Brain, Lightbulb, X, Clock, BookOpen, GraduationCap, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUtmParams } from "@/hooks/useUtmParams";
import { processLead } from "@/utils/notifications";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatsBar from "@/components/StatsBar";
import ReferralSharePrompt from "@/components/shared/ReferralSharePrompt";
import kevinImage from "@/assets/kevin-britz-facilitator.jpg";
import leaderAsCoachImage from "@/assets/leader-as-coach.jpg";
import leadershipFeedback from "@/assets/leadership-feedback.jpg";
import productTeamHandsAbove from "@/assets/product-team-hands-above.jpg";

// --- Data ---

const problemItems = [
  "Promoted managers avoiding difficult performance conversations — issues fester for months",
  "Underperformance escalated to HR instead of coached directly by the line manager",
  "Managers defaulting to micromanagement because they lack coaching frameworks",
  "HR spending 40%+ of time on people issues that should be handled at manager level",
  "New leaders promoted for technical skill but never trained to lead people",
  "Exit interviews citing 'my manager' as the primary reason for leaving",
];

const costItems = [
  { icon: TrendingUp, label: "Productivity gaps" },
  { icon: Users, label: "Staff turnover" },
  { icon: AlertTriangle, label: "HR escalations" },
  { icon: Zap, label: "Culture erosion" },
];

const caseResults = [
  {
    context: "Financial Services Firm",
    size: "800+ employees",
    outcome: "Manager-led performance conversations increased from 20% to 85% within 90 days. HR escalations dropped 47%.",
  },
  {
    context: "Insurance Group",
    size: "1,200 employees",
    outcome: "Internal promotion rate for leadership roles rose from 12% to 68% within 12 months of programme completion.",
  },
  {
    context: "Mid-size Corporate",
    size: "350 employees",
    outcome: "Staff turnover in coached divisions reduced from 32% to 14%. Estimated saving: R2.4M annually.",
  },
];

const managerOutcomes = [
  "Run structured performance conversations weekly.",
  "Diagnose what drives employee behaviour using needs-based coaching.",
  "Reduce emotional escalation and manage conflict constructively.",
  "Replace micromanagement with accountability frameworks.",
  "Coach for results, not comfort.",
  "Hold difficult conversations without HR involvement.",
];

const executiveOutcomes = [
  "Pre- and post-assessment data.",
  "Behavioural improvement metrics.",
  "Summary report with ROI indicators.",
  "360-degree feedback insights.",
];

const shiftSkills = [
  { letter: "S", skill: "Self-Management", icon: Shield },
  { letter: "H", skill: "Human Intelligence", icon: Users },
  { letter: "I", skill: "Innovation", icon: Lightbulb },
  { letter: "F", skill: "Focus", icon: Target },
  { letter: "T", skill: "Thinking", icon: Brain },
];

const phases = [
  {
    num: "01",
    title: "Diagnostic",
    description: "Leadership Index assessment + behavioural baseline mapping. Includes 6 professional assessments: DISC, Values Blueprint, 360-Degree Feedback, and more.",
    icon: BarChart3,
  },
  {
    num: "02",
    title: "Skills Installation",
    description: "6 live coaching sessions: performance conversations, accountability frameworks, conflict handling, and identity shift from 'doer' to 'leader'.",
    icon: Target,
  },
  {
    num: "03",
    title: "Application & Reporting",
    description: "Real-case coaching practice, measurement against baseline, executive summary with ROI data and succession readiness mapping.",
    icon: MessageCircle,
  },
];

const CTA_TEXT = "Book a Free 30-Min Call — We'll Map Your Gaps";

export default function LeaderAsCoachSales() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleCalendarOpen = () => {
    // Fire GA4 event via dataLayer (picked up by GTM)
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'schedule_call_click',
        event_category: 'engagement',
        event_label: 'Leader as Coach - Book a Free 30-Min Call',
      });
    }
    // Also fire via gtag directly as fallback
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'schedule_call_click', {
        event_category: 'engagement',
        event_label: 'Leader as Coach - Book a Free 30-Min Call',
      });
    }
    setCalendarOpen(true);
  };
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", role: "", participants: "", timeline: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const utmParams = useUtmParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const structuredMessage = [
        formData.message && `Message: ${formData.message}`,
        formData.participants && `Team Size: ${formData.participants}`,
        formData.timeline && `Timeline: ${formData.timeline}`,
      ].filter(Boolean).join("\n") || "Leader as Coach Programme Enquiry";

      const { error } = await supabase.from("contact_form_submissions").insert({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        role: formData.role,
        company_size: formData.participants,
        urgency: formData.timeline,
        message: structuredMessage,
        service_interest: "Leader as Coach Programme",
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term,
      });
      if (error) throw error;
      toast.success("Enquiry submitted! We'll be in touch shortly.");
      setSubmitted(true);
      setFormData({ name: "", company: "", email: "", phone: "", role: "", participants: "", timeline: "", message: "" });

      supabase.functions.invoke("send-contact-email", {
        body: { name: formData.name, email: formData.email, company: formData.company, phone: formData.phone, serviceInterest: "Leader as Coach Programme", message: structuredMessage },
      }).catch(console.error);

      processLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        company: formData.company,
        organisation: formData.company,
        message: structuredMessage,
        source: "contact-form",
      }).catch(console.error);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Reduce HR Escalations & Build Manager Coaching Capability in 90 Days"
        description="A structured 90-day programme that equips promoted managers with coaching skills to run performance conversations, reduce HR escalations by up to 50%, and drive measurable team productivity. For Financial Services and Insurance teams."
        canonicalUrl="/leader-as-coach"
        keywords="manager coaching programme, reduce HR escalations, leadership development financial services, coaching capability, manager training South Africa"
      />

      <div className="min-h-screen bg-background">
        <Header />

        {/* 1. HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={leaderAsCoachImage} alt="Leadership coaching" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/90 to-primary" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 text-center">
            <p className="text-primary-foreground/90 text-sm sm:text-base font-semibold tracking-wide mb-4">
              For HR Leaders & L&D Managers in Financial Services
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <Clock className="w-3 h-3" /> 90-Day Accelerator
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <Briefcase className="w-3 h-3" /> Financial Services & Insurance
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <GraduationCap className="w-3 h-3" /> Certificate Included
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
              Reduce Escalations, Improve Accountability, and Build Manager Coaching Capability in 90 Days
            </h1>
            <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
              A structured 90-day programme that equips promoted managers with the coaching skills to run performance conversations, reduce HR escalations by up to 50%, and drive measurable team productivity.
            </p>

            {/* Urgency strip */}
            <div className="mb-8">
              <p className="text-primary-foreground/70 text-xs sm:text-sm font-medium tracking-wide">
                Limited to 4 cohorts per quarter · Next intake: Q2 2026 · 3 spots remaining
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto min-h-[56px]"
                onClick={() => handleCalendarOpen()}
              >
                {CTA_TEXT}
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur-sm text-white border border-white/40 hover:bg-white/25 rounded-full font-bold w-full sm:w-auto min-h-[56px]"
                onClick={() => setBookingOpen(true)}
              >
                Request a Proposal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <p className="text-primary-foreground/70 text-sm mt-5 max-w-xl mx-auto">
              In 30 minutes, we'll assess your manager capability gaps and show you what's achievable in 90 days.
            </p>
          </div>
        </section>

        <StatsBar />

        {/* 2. THE PROBLEM */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <img
                  src={leadershipFeedback}
                  alt="Leadership challenges in the workplace"
                  className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3]"
                  loading="lazy"
                />
              </div>
              <div className="order-1 md:order-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">The Problem</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Sound Familiar?
                </h2>
                <div className="space-y-3 mb-6">
                  {problemItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-destructive shrink-0 mt-1" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {costItems.map((c) => (
                    <span key={c.label} className="bg-destructive/10 text-destructive text-xs font-medium px-3 py-1.5 rounded-full border border-destructive/20 flex items-center gap-1.5">
                      <c.icon className="w-3 h-3" />
                      {c.label}
                    </span>
                  ))}
                </div>
                <p className="text-primary font-semibold text-sm">
                  This is a coaching capability problem — not a motivation problem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SOCIAL PROOF — Case Results */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Proven Results</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                What Organisations Like Yours Have Achieved
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-5 sm:gap-6 mb-10">
              {caseResults.map((r, i) => (
                <motion.div
                  key={r.context}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border border-l-4 border-l-primary"
                >
                  <p className="text-xs font-semibold text-primary mb-1">{r.context}</p>
                  <p className="text-[10px] text-muted-foreground mb-3">{r.size}</p>
                  <p className="text-sm text-foreground leading-relaxed font-medium">{r.outcome}</p>
                </motion.div>
              ))}
            </div>

            {/* Authority signals */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground font-medium">
              <span>750+ workshops delivered</span>
              <span className="hidden sm:inline">·</span>
              <span>4,000+ leaders developed</span>
              <span className="hidden sm:inline">·</span>
              <span>Trusted by Discovery, FNB & 50+ organisations</span>
              <span className="hidden sm:inline">·</span>
              <span>Business School Faculty</span>
            </div>
          </div>
        </section>

        {/* 4. THE PROMISE (compact) */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
              Leader as Coach delivers behaviour change — not theory.
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              90 days. Measurable coaching capability. Executive reporting with ROI data.
            </p>
          </div>
        </section>

        {/* 5. WHAT THEY WALK AWAY WITH */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                What Your Managers Will Do Differently
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
                <h3 className="font-serif text-lg font-bold text-foreground mb-5">After 90 days, your managers will:</h3>
                <ul className="space-y-3">
                  {managerOutcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
                <h3 className="font-serif text-lg font-bold text-foreground mb-5">Executives receive:</h3>
                <ul className="space-y-3">
                  {executiveOutcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-sm text-foreground">
                      <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. MID-PAGE CTA */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2">
              Ready to upgrade your managers?
            </h3>
            <p className="text-muted-foreground text-sm mb-5">
              Limited quarterly intake. Secure your team's spot now.
            </p>
            <Button
              size="lg"
              className="rounded-full font-bold group min-h-[56px]"
              onClick={() => handleCalendarOpen()}
            >
              {CTA_TEXT}
              <Calendar className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* 7. HOW IT WORKS — 3 Phases */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                How It Works
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">Diagnostic → Skills Installation → Application & Reporting</p>
              <div className="w-16 h-1 bg-primary mx-auto mt-3" />
            </div>

            <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {phases.map((phase, i) => {
                const Icon = phase.icon;
                return (
                  <motion.div
                    key={phase.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-2xl p-6 sm:p-8 border border-border border-t-4 border-t-primary"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-primary mb-2 block text-center">Phase {phase.num}</span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-3 text-center">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. SHIFT SKILLS (simplified) */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">The Framework</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Built on the SHIFT Skills Framework
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                A common language for leadership behaviour that your managers practise daily.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-4">
              {shiftSkills.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={skill.letter}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-card rounded-xl p-3 sm:p-5 border border-border text-center"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center bg-primary/10">
                      <span className="text-lg sm:text-xl font-bold text-primary">{skill.letter}</span>
                    </div>
                    <h3 className="text-[10px] sm:text-sm font-semibold text-foreground">{skill.skill}</h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. GUARANTEE (compact) */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-primary/10">
          <div className="max-w-2xl mx-auto text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3">
              Results Guarantee
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              If after completing the first two phases you don't see measurable improvement in communication, accountability, and coaching behaviours, we'll work with you until you do — or refund your investment.
            </p>
          </div>
        </section>

        {/* 10. FACILITATOR (compact) */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-lg border-4 border-background">
                  <img src={kevinImage} alt="Kevin Britz — Leadership Facilitator" className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
              </div>
              <div className="md:col-span-3 text-center md:text-left">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3">Your Facilitator: Kevin Britz</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Business school faculty member, Master Practitioner in NLP & Time Line Therapy, and architect of the SHIFT Methodology™. 750+ workshops. 4,000+ leaders developed across Discovery, FNB, and 50+ organisations.
                </p>
                <Link to="/about">
                  <Button variant="outline" className="rounded-full group">
                    Read Full Bio <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 11. FINAL CTA */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <img src={productTeamHandsAbove} alt="Team collaboration" className="w-full h-full object-cover object-center opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Your Managers Won't Coach Themselves.<br className="hidden sm:block" /> Let's Fix That in 90 Days.
            </h2>
            <p className="text-primary-foreground/70 text-xs sm:text-sm mb-8">
              Limited quarterly intake. Book now to secure your Q2 cohort spot.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto min-h-[56px]"
                onClick={() => handleCalendarOpen()}
              >
                {CTA_TEXT}
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur-sm text-white border border-white/40 hover:bg-white/25 rounded-full font-bold w-full sm:w-auto min-h-[56px]"
                onClick={() => setBookingOpen(true)}
              >
                Request a Proposal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {submitted && <ReferralSharePrompt context="Leader as Coach Programme" />}

        <Footer />
      </div>

      {/* BOOKING MODAL */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold">
              Request a Proposal
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Tell us about your team and we'll design the right coaching programme for you.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input placeholder="Full Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input placeholder="Company *" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            <Input placeholder="Your Role (e.g. HR Director) *" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
            <Input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <Input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <Select value={formData.participants} onValueChange={(v) => setFormData({ ...formData, participants: v })}>
              <SelectTrigger><SelectValue placeholder="Number of Participants *" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5-10">5–10 participants</SelectItem>
                <SelectItem value="11-20">11–20 participants</SelectItem>
                <SelectItem value="21-50">21–50 participants</SelectItem>
                <SelectItem value="50+">50+ participants</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.timeline} onValueChange={(v) => setFormData({ ...formData, timeline: v })}>
              <SelectTrigger><SelectValue placeholder="Preferred Start Date *" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Next month">Next month</SelectItem>
                <SelectItem value="Next quarter">Next quarter</SelectItem>
                <SelectItem value="Next 6 months">Next 6 months</SelectItem>
                <SelectItem value="Just exploring">Just exploring</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Tell us about your challenges and goals..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
            <Button type="submit" disabled={submitting} className="w-full font-semibold py-5 min-h-[56px]">
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* CALENDAR POPUP */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-serif text-2xl font-bold">
              {CTA_TEXT}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              In 30 minutes, we'll map your manager capability gaps and show you what's possible in 90 days. No commitment required.
            </p>
          </DialogHeader>
          <div className="w-full h-[600px]">
            <iframe
              src="https://calendar.app.google/QvjXmUfXbfjrmrH78"
              className="w-full h-full border-0"
              title="Book a strategy call"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
