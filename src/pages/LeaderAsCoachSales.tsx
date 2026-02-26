import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Star, Users, Target,
  TrendingUp, Shield, MessageCircle, Calendar,
  BarChart3, Briefcase, AlertTriangle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const problemItems = [
  "High performers promoted into leadership… but struggling to lead.",
  "Difficult conversations avoided.",
  "Micromanagement instead of coaching.",
  "Underperformance escalated to HR instead of handled directly.",
  "Team morale dependent on personality rather than structure.",
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
];

const executiveOutcomes = [
  "Pre- and post-assessment data.",
  "Behavioural improvement metrics.",
  "Summary report with ROI indicators.",
];

const phases = [
  {
    num: "01",
    title: "Diagnostic",
    description: "Leadership Index + behavioural mapping.",
    icon: BarChart3,
  },
  {
    num: "02",
    title: "Skills Installation",
    description: "Live sessions focused on coaching frameworks, needs-based motivation, accountability conversations, conflict handling, and identity shift from 'doer' to 'leader'.",
    icon: Target,
  },
  {
    num: "03",
    title: "Application & Feedback",
    description: "Real case coaching. Measurement. Executive reporting.",
    icon: MessageCircle,
  },
];

const idealFor = [
  "Financial Services",
  "Insurance",
  "Mid-sized corporates with promoted technical managers",
  "Organisations experiencing performance stagnation",
];

export default function LeaderAsCoachSales() {
  const [bookingOpen, setBookingOpen] = useState(false);
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
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.92) 0%, hsl(var(--primary) / 0.78) 100%), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80')`,
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 text-center">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
              90-Day Leadership Accelerator
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
              Turn Managers Into Leaders Who Can Coach and Drive Productivity in 90 Days
            </h1>
            <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Equip technical and operational managers with practical coaching tools that improve accountability, performance conversations, and team results.
            </p>
            <Link to="https://calendar.app.google/seCHb5KB1PwGzJhQ6" target="_blank">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group">
                Book a 30-Minute Strategy Call
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        <StatsBar />

        {/* 2. THE PROBLEM */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                If You Manage Managers, You've Likely Seen This
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </div>

            <div className="bg-muted/30 rounded-2xl p-8 sm:p-10 border border-border mb-8">
              <ul className="space-y-4">
                {problemItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-center font-serif text-lg sm:text-xl font-bold text-foreground mb-8">
              Technical excellence does not equal leadership capability.
            </p>

            <div className="text-center mb-4">
              <p className="text-muted-foreground text-sm mb-4">And the cost shows up in:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {costItems.map((c) => (
                  <span key={c.label} className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-2 rounded-full border border-destructive/20 flex items-center gap-2">
                    <c.icon className="w-4 h-4" />
                    {c.label}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-center text-primary font-semibold text-sm mt-6">
              This is a coaching capability problem — not a motivation problem.
            </p>
          </div>
        </section>

        {/* 3. THE PROMISE */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary">
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

        {/* 4. WHAT THEY WALK AWAY WITH */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                What They Walk Away With
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="font-serif text-lg font-bold text-foreground mb-5">After 90 days, your managers will:</h3>
                <ul className="space-y-3">
                  {managerOutcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="font-serif text-lg font-bold text-foreground mb-5">Executives receive:</h3>
                <ul className="space-y-3">
                  {executiveOutcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-sm text-foreground">
                      <BarChart3 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                How It Works
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {phases.map((phase) => {
                const Icon = phase.icon;
                return (
                  <div key={phase.num} className="bg-card rounded-2xl p-8 border border-border text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-primary mb-2 block">Phase {phase.num}</span>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. WHO IT'S FOR */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Who It's For
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6" />
              <p className="text-muted-foreground text-sm">Ideal for:</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {idealFor.map((item) => (
                <span key={item} className="bg-primary/10 text-primary text-sm font-medium px-5 py-2.5 rounded-full border border-primary/20 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Facilitator */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden shadow-lg border-4 border-background">
                  <img src={kevinImage} alt="Kevin Britz" className="w-full h-full object-cover object-top" loading="lazy" />
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

        {/* 7. FINAL CTA */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Book a 30-Minute Strategy Call to Assess Fit
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Not "learn more." Not "download." A direct conversation about whether this is the right solution for your team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="https://calendar.app.google/seCHb5KB1PwGzJhQ6" target="_blank">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto">
                  Book a Strategy Call
                  <Calendar className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-primary-foreground hover:bg-white/10 rounded-full font-bold w-full sm:w-auto"
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
        <DialogContent className="sm:max-w-lg">
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
    </>
  );
}
