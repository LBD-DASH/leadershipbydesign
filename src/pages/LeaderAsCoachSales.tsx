import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Users, Target,
  TrendingUp, Shield, MessageCircle, Calendar,
  BarChart3, Briefcase, AlertTriangle, Zap,
  Brain, Lightbulb, Gift, X, Clock, BookOpen, GraduationCap
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
  "High performers promoted into leadership… but struggling to lead.",
  "Difficult conversations avoided — poor behaviour left unchecked.",
  "Micromanagement instead of coaching.",
  "Underperformance escalated to HR instead of handled directly.",
  "Team morale dependent on personality rather than structure.",
  "Values exist on paper but aren't reflected in daily behaviour.",
];

const costItems = [
  { icon: TrendingUp, label: "Productivity gaps" },
  { icon: Users, label: "Staff turnover" },
  { icon: AlertTriangle, label: "Escalations" },
  { icon: Zap, label: "Culture fatigue" },
];

const managerOutcomes = [
  "Run structured performance conversations.",
  "Diagnose what drives employee behaviour (using needs-based coaching).",
  "Reduce emotional escalation.",
  "Replace micromanagement with accountability frameworks.",
  "Coach for results, not comfort.",
  "Navigate conflict constructively using frameworks.",
];

const executiveOutcomes = [
  "Pre- and post-assessment data.",
  "Behavioural improvement metrics.",
  "Summary report with ROI indicators.",
  "360-degree feedback insights.",
];

const shiftSkills = [
  { letter: "S", skill: "Self-Management", description: "Emotional regulation, self-awareness, personal accountability", icon: Shield },
  { letter: "H", skill: "Human Intelligence", description: "Empathy, rapport, cultural intelligence, diversity awareness", icon: Users },
  { letter: "I", skill: "Innovation", description: "Creative problem-solving, design thinking, continuous improvement", icon: Lightbulb },
  { letter: "F", skill: "Focus", description: "Prioritisation, time management, strategic clarity", icon: Target },
  { letter: "T", skill: "Thinking", description: "Critical thinking, decision-making under pressure, systems thinking", icon: Brain },
];

const phases = [
  {
    num: "01",
    title: "Diagnostic",
    description: "Leadership Index + behavioural mapping. Values Blueprint, DISC profiling, and 6 Human Needs assessment to create a personalised development baseline.",
    icon: BarChart3,
  },
  {
    num: "02",
    title: "Skills Installation",
    description: "Live sessions focused on coaching frameworks, needs-based motivation, accountability conversations, conflict handling, and identity shift from 'doer' to 'leader'.",
    icon: Target,
    topics: [
      "NLP Communication & rapport building",
      "Emotional Intelligence deep-dive",
      "Difficult conversations framework",
      "Coaching for ownership — Drama Triangle awareness",
      "Performance & accountability structures",
    ],
  },
  {
    num: "03",
    title: "Application & Feedback",
    description: "Real case coaching. Measurement. Executive reporting. Sustainability planning and succession readiness mapping.",
    icon: MessageCircle,
  },
];

const assessments = [
  "Values Blueprint Assessment",
  "Find My Purpose Diagnostic",
  "6 Human Needs Assessment",
  "DISC Behavioural Profile",
  "Monthly Anonymous Pulse Assessments",
  "Quarterly 360-Degree Feedback",
];

const personas = [
  {
    title: "The Scaling Organisation",
    description: "You're growing fast and need leaders who can hold the line on culture while driving performance.",
  },
  {
    title: "The Culture-Frustrated CEO",
    description: "Your values exist on paper but aren't translating into daily behaviours and accountability.",
  },
  {
    title: "The HR / L&D Leader",
    description: "You need a structured, sustained programme — not another one-day workshop that gets forgotten.",
  },
  {
    title: "The New Leadership Team",
    description: "Your managers were promoted for technical skill but haven't been equipped to lead people.",
  },
];

const idealFor = [
  "Financial Services",
  "Insurance",
  "Mid-sized corporates",
  "Organisations with promoted technical managers",
];

export default function LeaderAsCoachSales() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
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
        title="Leader as Coach Programme | Turn Managers Into Coaching Leaders in 90 Days"
        description="Equip technical and operational managers with practical coaching tools that improve accountability, performance conversations, and team results. 90-day leadership accelerator from Leadership by Design."
        canonicalUrl="/leader-as-coach"
        keywords="leader as coach, coaching culture, leadership development, coaching programme, manager training, South Africa"
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
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <Clock className="w-3 h-3" /> 90-Day Accelerator
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <BookOpen className="w-3 h-3" /> Hybrid Delivery
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <GraduationCap className="w-3 h-3" /> Certificate Included
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
              Turn Managers Into Leaders Who Can Coach and Drive Productivity in 90 Days
            </h1>
            <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Equip technical and operational managers with practical coaching tools that improve accountability, performance conversations, and team results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto min-h-[56px]"
                onClick={() => setCalendarOpen(true)}
              >
                Book a 30-Minute Strategy Call
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-primary-foreground hover:bg-white/10 rounded-full font-bold w-full sm:w-auto min-h-[56px]"
                onClick={() => setBookingOpen(true)}
              >
                Request a Proposal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
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
                  If You Manage Managers, You've Likely Seen This
                </h2>
                <div className="space-y-3 mb-6">
                  {problemItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-destructive shrink-0 mt-1" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="font-serif text-lg font-bold text-foreground mb-4">
                  Technical excellence does not equal leadership capability.
                </p>
                <div className="flex flex-wrap gap-2">
                  {costItems.map((c) => (
                    <span key={c.label} className="bg-destructive/10 text-destructive text-xs font-medium px-3 py-1.5 rounded-full border border-destructive/20 flex items-center gap-1.5">
                      <c.icon className="w-3 h-3" />
                      {c.label}
                    </span>
                  ))}
                </div>
                <p className="text-primary font-semibold text-sm mt-4">
                  This is a coaching capability problem — not a motivation problem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THE PROMISE */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-6">
              Leader as Coach is a 90-day leadership accelerator designed to equip managers with practical, measurable coaching capability.
            </h2>
            <div className="flex flex-col items-center gap-2 text-primary-foreground/80">
              <p className="text-lg font-medium">Not theory.</p>
              <p className="text-lg font-medium">Not inspirational talks.</p>
              <p className="text-2xl font-bold text-primary-foreground mt-2">Behaviour change.</p>
            </div>
          </div>
        </section>

        {/* 4. SHIFT SKILLS FRAMEWORK */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">The Foundation</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                The SHIFT Skills Framework
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                The behavioural operating system that gives your leaders a common language and daily practice
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {shiftSkills.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={skill.letter}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card rounded-xl p-4 sm:p-5 border border-border text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-primary/10">
                      <span className="text-lg sm:text-xl font-bold text-primary">{skill.letter}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold mb-1 text-foreground">{skill.skill}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed hidden sm:block">{skill.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 p-3 sm:p-4 bg-primary/5 rounded-xl text-center border border-primary/10">
              <p className="text-xs sm:text-sm text-foreground font-medium">
                <span className="text-primary font-bold">+ Your AI Edge</span> — Leveraging AI tools and data to enhance leadership decision-making
              </p>
            </div>
          </div>
        </section>

        {/* 5. WHAT THEY WALK AWAY WITH */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                What They Walk Away With
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

        {/* 6. HOW IT WORKS — 3-Phase Roadmap */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                How It Works
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
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
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{phase.description}</p>
                    {phase.topics && (
                      <ul className="space-y-1.5 mt-3 border-t border-border pt-3">
                        {phase.topics.map((t) => (
                          <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. ASSESSMENTS */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/15 text-primary-foreground border border-white/20">
                <Gift className="w-4 h-4" />
                Included in Programme
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              6 Professional Assessments
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Self-awareness is the foundation of leadership growth. These assessments create clarity, track progress, and inform coaching throughout the programme.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
              {assessments.map((a) => (
                <div key={a} className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary-foreground shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PEOPLE-PROFIT-PROCESS */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">The Three Lenses</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                People – Profit – Process
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
              {[
                { icon: Users, title: "People", text: "Leadership identity, trust, psychological safety, engagement, retention, and behavioural standards." },
                { icon: TrendingUp, title: "Profit", text: "Performance conversations, accountability frameworks, goal alignment, and measurable productivity uplift." },
                { icon: Target, title: "Process", text: "Coaching embedded into management rhythm, defined cultural expectations, and data-informed decision-making." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border text-center"
                  >
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. WHO IT'S FOR — Personas */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                This Programme Is Built for You If…
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-8">
              {personas.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold mb-1.5 text-foreground">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">Ideal industries:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {idealFor.map((item) => (
                  <span key={item} className="bg-primary/10 text-primary text-xs sm:text-sm font-medium px-4 py-2 rounded-full border border-primary/20 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. GUARANTEE */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-primary/10">
          <div className="max-w-2xl mx-auto text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4">
              This is not another workshop that gets forgotten
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              If after completing the first two phases you don't see measurable improvement in your team's communication, accountability, and leadership behaviours, we'll work with you until you do — or refund your investment.
            </p>
          </div>
        </section>

        {/* 11. FACILITATOR */}
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
                  Business school faculty member, Master Practitioner in NLP & Time Line Therapy, and architect of the SHIFT Methodology™ and L1–L5 Leadership System. 750+ workshops. 4,000+ leaders developed across 50+ organisations.
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

        {/* 12. FINAL CTA */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <img src={productTeamHandsAbove} alt="Team collaboration" className="w-full h-full object-cover object-center opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Book a 30-Minute Strategy Call to Assess Fit
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Not "learn more." Not "download." A direct conversation about whether this is the right solution for your team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto min-h-[56px]"
                onClick={() => setCalendarOpen(true)}
              >
                Book a Strategy Call
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-primary-foreground hover:bg-white/10 rounded-full font-bold w-full sm:w-auto min-h-[56px]"
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
              Book a 30-Minute Strategy Call
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose a time that works for you — no commitment required.
            </p>
          </DialogHeader>
          <div className="w-full h-[600px]">
            <iframe
              src="https://calendar.app.google/seCHb5KB1PwGzJhQ6"
              className="w-full h-full border-0"
              title="Book a strategy call"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
