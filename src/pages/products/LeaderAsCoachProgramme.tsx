import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Gift, CheckCircle, ArrowLeft, Zap, Clock, BookOpen, GraduationCap, Users, Brain, Target, Shield, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUtmParams } from "@/hooks/useUtmParams";
import { processLead } from "@/utils/notifications";
import leaderAsCoach from "@/assets/leader-as-coach.jpg";
import leadershipFeedback from "@/assets/leadership-feedback.jpg";
import productTeamHandsAbove from "@/assets/product-team-hands-above.jpg";

const featurePills = [
  "10-Month Programme",
  "5-Phase Framework",
  "SHIFT Skills System",
  "Assessments Included",
  "Coaching Templates",
  "People-Profit-Process Model",
];

const painPoints = [
  "Your managers avoid difficult conversations and let poor behaviour slide",
  "You've invested in training before but nothing stuck — it was forgotten within weeks",
  "Toxicity and drama cycles drain your team's energy and productivity",
  "Your values exist on paper but aren't reflected in daily behaviour",
  "Conflict is poorly managed — avoidance, escalation, and personal attacks replace resolution",
  "Your leadership pipeline is thin and succession planning is reactive",
];

const phases = [
  {
    number: "01",
    title: "Leadership Identity & Self-Awareness",
    duration: "Months 1–2",
    shiftFocus: "Self-Management + Human Intelligence",
    topics: [
      "NLP Communication Model — how the brain processes information",
      "Values & Beliefs alignment — understanding what drives decisions",
      "6 Human Needs framework — what your leaders and teams really need",
      "DISC Behavioural Profiling — communication styles & conflict tendencies",
      "Building rapport, active listening, and coaching culture foundations",
      "Accountability partnerships and goal structures",
    ],
  },
  {
    number: "02",
    title: "Communication Mastery & Emotional Intelligence",
    duration: "Months 3–4",
    shiftFocus: "Human Intelligence + Thinking",
    topics: [
      "Persuasive language techniques for buy-in and agreement",
      "Emotional Intelligence deep-dive — self-awareness, regulation, empathy",
      "Neuroscience of bias — how unconscious biases shape decisions",
      "Conflict as a leadership competency — constructive engagement",
      "Building trust through vulnerability and psychological safety",
      "Difficult conversations framework with structured language",
    ],
  },
  {
    number: "03",
    title: "Performance, Accountability & Boundaries",
    duration: "Months 5–6",
    shiftFocus: "Focus + Self-Management",
    topics: [
      "Coaching best practices — empowering team ownership",
      "Solution-focused coaching techniques and powerful questioning",
      "Drama Triangle awareness — moving from Victim/Rescuer/Persecutor to Coach Mode",
      "Diversity & Inclusion as embedded leadership practice",
      "Performance standards linked to values-behaviours charter",
      "Building positive, high-accountability team culture",
    ],
  },
  {
    number: "04",
    title: "High-Performing Teams & Strategic Leadership",
    duration: "Months 7–8",
    shiftFocus: "Innovation + Thinking + AI Edge",
    topics: [
      "What separates high-performing teams from average ones",
      "Neuroscience of motivation — intrinsic vs extrinsic drivers",
      "Strategic thinking — systems thinking, scenario planning, decision frameworks",
      "Aligning culture with revenue and growth goals",
      "Leading through change — Prosci ADKAR principles",
      "AI tools and data to enhance leadership decision-making",
    ],
  },
  {
    number: "05",
    title: "Sustainability, Succession & Embedding",
    duration: "Months 9–10",
    shiftFocus: "All SHIFT Elements Integrated",
    topics: [
      "Succession pipeline assessment and readiness mapping",
      "Leadership legacy — what kind of leader will you be remembered as?",
      "Building internal mentoring capability beyond the programme",
      "Talent retention strategy — what keeps and drives away your best people",
      "Final leadership showcase presentations",
      "Transition plan for sustaining culture beyond the programme",
    ],
  },
];

const shiftSkills = [
  { letter: "S", skill: "Self-Management", description: "Emotional regulation, self-awareness, personal accountability", icon: Shield },
  { letter: "H", skill: "Human Intelligence", description: "Empathy, rapport, cultural intelligence, diversity awareness", icon: Users },
  { letter: "I", skill: "Innovation", description: "Creative problem-solving, design thinking, continuous improvement", icon: Lightbulb },
  { letter: "F", skill: "Focus", description: "Prioritisation, time management, strategic clarity", icon: Target },
  { letter: "T", skill: "Thinking", description: "Critical thinking, decision-making under pressure, systems thinking", icon: Brain },
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

const EnquiryCTA = ({ onEnquire }: { onEnquire: () => void }) => (
  <div className="text-center px-4">
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-1 text-xs md:text-sm text-white/80">
        <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        Online Programme
      </motion.span>
      <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-1 text-xs md:text-sm text-white/80">
        <Clock className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        10-Month Journey
      </motion.span>
      <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="inline-flex items-center gap-1 text-xs md:text-sm text-white/80">
        <GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        Certificate Included
      </motion.span>
    </div>

    <p className="text-white/70 text-sm md:text-base mb-4 md:mb-6">
      Customised to your organisation's needs. Get in touch for a tailored proposal.
    </p>
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={onEnquire}
        size="lg"
        className="text-base md:text-lg px-6 md:px-8 py-6 md:py-7 font-bold transition-all duration-300 hover:shadow-lg w-full sm:w-auto min-h-[56px] bg-primary-foreground text-primary hover:bg-white"
      >
        ENQUIRE NOW →
      </Button>
    </motion.div>
  </div>
);

export default function LeaderAsCoachProgramme() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", role: "", participants: "", timeline: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
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
      // Fire GA4 conversion event
      const { trackContactFormSubmit } = await import('@/utils/gtmEvents');
      trackContactFormSubmit({ service_interest: 'Leader as Coach Programme', source: 'leader_as_coach_product' });
      toast.success("Enquiry submitted! We'll be in touch shortly.");
      setEnquiryOpen(false);
      setFormData({ name: "", company: "", email: "", phone: "", role: "", participants: "", timeline: "", message: "" });

      // Send notification email
      supabase.functions.invoke("send-contact-email", {
        body: { name: formData.name, email: formData.email, company: formData.company, phone: formData.phone, serviceInterest: "Leader as Coach Programme", message: structuredMessage },
      }).catch(console.error);

      // Process lead scoring & AI analysis
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
    <div className="min-h-screen scroll-smooth">
      <SEO
        title="Leader as Coach Programme — 10-Month Leadership Transformation | Leadership by Design"
        description="A structured 10-month online programme that builds coaching capability, eliminates toxic patterns, and installs a culture of accountability. SHIFT Skills Framework, assessments, and coaching tools included."
        canonicalUrl="/leader-as-coach-programme"
        ogImage="https://leadershipbydesign.co/og-products.jpg"
        keywords="leader as coach, leadership programme, coaching culture, SHIFT skills, leadership development, NLP coaching, emotional intelligence, team leadership"
      />

      {/* ENQUIRY MODAL */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold text-foreground">
              Enquire About Leader as Coach
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Tell us about your team and we'll design the right programme for you.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input placeholder="Full Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input placeholder="Company *" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            <Input placeholder="Your Role (e.g. HR Director, L&D Manager) *" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
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
            <Button type="submit" disabled={submitting} className="w-full font-semibold py-5">
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* HERO SECTION */}
      <section className="relative py-12 md:py-24 px-4 overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={leaderAsCoach} alt="Leadership coaching session" className="w-full h-full object-cover object-top opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-primary" />
        </div>

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
            <span>🎓 FLAGSHIP PROGRAMME</span>
          </motion.div>
        </motion.div>

        <div className="absolute top-20 left-10 w-20 md:w-32 h-20 md:h-32 rounded-full opacity-10 hidden md:block border border-primary-foreground" />
        <div className="absolute bottom-20 right-10 w-32 md:w-48 h-32 md:h-48 rounded-full opacity-5 hidden md:block border-2 border-primary-foreground" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <Link to="/products" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Products</span>
          </Link>

          <div className="flex justify-center mb-8">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              Online Leadership Programme
            </span>
          </div>

          <motion.h1 className="text-center mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="block text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-2">
              Leader as Coach
            </span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-serif bg-gradient-to-r from-white via-primary-foreground to-white bg-clip-text text-transparent">
              Programme 🎓
            </span>
          </motion.h1>

          <p className="text-center text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            A structured 10-month culture architecture intervention that transforms managers into leaders who coach, not control — powered by the proprietary SHIFT Skills Framework.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {featurePills.map((pill) => (
              <span key={pill} className="px-4 py-2 rounded-full text-sm font-medium border border-primary-foreground/40 text-primary-foreground">
                {pill}
              </span>
            ))}
          </div>

          <EnquiryCTA onEnquire={() => setEnquiryOpen(true)} />
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="py-6 px-4 bg-background border-y border-border">
        <p className="text-center text-muted-foreground font-medium">
          Built on 11 years developing 4,000+ leaders across 30+ organisations • People–Profit–Process methodology
        </p>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src={leadershipFeedback} alt="Leadership challenges" className="w-full rounded-lg shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary">The Problem</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">
                Training doesn't stick. Culture doesn't change in a day.
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Most leadership programmes fail because they're events, not systems. A two-day workshop can't undo years of poor habits, weak boundaries, and inconsistent standards. Real transformation requires sustained, structured intervention.
              </p>
              <div className="space-y-3">
                {painPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{point}</span>
                  </div>
                ))}
              </div>
              <p className="font-semibold text-lg mt-8 text-foreground">
                This programme is the sustained, structured system that actually changes culture — over 10 months, not 10 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHIFT SKILLS FRAMEWORK */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center text-primary">The Foundation</p>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 text-foreground">
            The SHIFT Skills Framework
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            The behavioural operating system that gives your leaders a common language and daily practice
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {shiftSkills.map((skill) => (
              <div key={skill.letter} className="p-4 bg-card rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-primary/10">
                  <span className="text-xl font-bold text-primary">{skill.letter}</span>
                </div>
                <h3 className="text-sm font-semibold mb-1 text-foreground">{skill.skill}</h3>
                <p className="text-xs text-muted-foreground">{skill.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg text-center">
            <p className="text-sm text-foreground font-medium">
              <span className="text-primary font-bold">+ Your AI Edge</span> — Leveraging AI tools and data to enhance leadership decision-making and efficiency
            </p>
          </div>
        </div>
      </section>

      {/* 5-PHASE CURRICULUM */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center text-primary">The Programme</p>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 text-foreground">
            5 Phases. 10 Months. Complete Transformation.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Each phase builds on the last — creating deep, compounding leadership capability
          </p>

          <div className="space-y-6">
            {phases.map((phase) => (
              <div key={phase.number} className="p-6 bg-card rounded-lg shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-primary">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-serif font-bold text-primary">{phase.number}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-foreground">{phase.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{phase.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">SHIFT Focus: {phase.shiftFocus}</p>
                    <ul className="grid sm:grid-cols-2 gap-1.5">
                      {phase.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASSESSMENTS SECTION */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute top-10 right-20 w-24 h-24 rounded-full opacity-10 border border-primary-foreground" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary-foreground/20 text-primary-foreground">
              <Gift className="w-4 h-4" />
              Included in Programme
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            6 Professional Assessments
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Self-awareness is the foundation of leadership growth. These assessments create clarity, track progress, and inform coaching throughout the programme.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
            {assessments.map((assessment) => (
              <div key={assessment} className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle className="w-4 h-4 text-primary-foreground flex-shrink-0" />
                <span>{assessment}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PEOPLE-PROFIT-PROCESS */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center text-primary">The Three Lenses</p>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-foreground">
            People – Profit – Process
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg shadow-sm border border-border text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">People</h3>
              <p className="text-sm text-muted-foreground">Leadership identity, trust, psychological safety, engagement, retention, and behavioural standards.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border border-border text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Profit</h3>
              <p className="text-sm text-muted-foreground">Performance conversations, accountability frameworks, goal alignment, and measurable productivity uplift.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border border-border text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Process</h3>
              <p className="text-sm text-muted-foreground">Coaching embedded into management rhythm, defined cultural expectations, and data-informed decision-making.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-foreground">
            This programme is built for you if…
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((persona) => (
              <div key={persona.title} className="p-6 bg-card rounded-lg shadow-sm border border-border">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{persona.title}</h3>
                    <p className="text-muted-foreground">{persona.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-16 md:py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif mb-4 text-foreground">
            This is not another workshop that gets forgotten
          </h2>
          <p className="text-muted-foreground text-lg">
            If after completing the first two phases you don't see measurable improvement in your team's communication, accountability, and leadership behaviours, we'll work with you until you do — or refund your investment.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={productTeamHandsAbove} alt="Team collaboration" className="w-full h-full object-cover object-center opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full opacity-5 border-2 border-primary-foreground" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Stop training. Start transforming.
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Your leaders need more than a workshop. They need a system that builds coaching capability, installs behavioural standards, and creates lasting culture change — over 10 months, not 10 hours.
          </p>
          <EnquiryCTA onEnquire={() => setEnquiryOpen(true)} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t bg-primary border-primary-foreground/20">
        <p className="text-center text-white/60 text-sm">
          © 2026 Leadership by Design • 11 Years • 3,000+ Organisations • Built in South Africa
        </p>
      </footer>
    </div>
  );
}
