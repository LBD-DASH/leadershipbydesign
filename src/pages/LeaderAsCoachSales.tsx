import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Users, Target,
  TrendingUp, Shield, MessageCircle, Calendar,
  BarChart3, AlertTriangle, Zap, X, Clock, Briefcase, GraduationCap
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
import { ServiceSchema, BreadcrumbSchema, ProductSchema } from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatsBar from "@/components/StatsBar";
import ReferralSharePrompt from "@/components/shared/ReferralSharePrompt";
import kevinImage from "@/assets/kevin-britz-facilitator.jpg";
import leaderAsCoachImage from "@/assets/leader-as-coach.jpg";
import productTeamHandsAbove from "@/assets/product-team-hands-above.jpg";
import { useBookingLink } from "@/hooks/useBookingLink";
import { useHighIntentTracking, useBookingIntentTracking } from "@/hooks/useIntentTracking";

export default function LeaderAsCoachSales() {
  useHighIntentTracking();
  useBookingIntentTracking();
  const [bookingOpen, setBookingOpen] = useState(false);
  const bookingLink = useBookingLink();

  const handleCalendarOpen = () => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'schedule_call_click',
        event_category: 'engagement',
        event_label: 'Leader as Coach - Book Discovery Call',
      });
    }
    window.open(bookingLink, '_blank', 'noopener,noreferrer');
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
      const { trackContactFormSubmit } = await import('@/utils/gtmEvents');
      trackContactFormSubmit({ service_interest: 'Leader as Coach Programme', source: 'leader_as_coach_page' });
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
        title="Leader as Coach — 90-Day Manager Coaching Accelerator | South Africa"
        description="The only structured manager coaching programme built for financial services and professional services firms in South Africa. HR Directors — book a discovery call."
        canonicalUrl="/leader-as-coach"
        ogImage="https://leadershipbydesign.co/og-leader-as-coach.jpg"
        keywords="manager coaching programme, leader as coach, coaching capability, manager training South Africa, HR leadership development, financial services coaching"
      />
      <ServiceSchema
        name="Leader as Coach — 90-Day Manager Coaching Accelerator"
        description="A structured 90-day programme that installs coaching capability into your management layer. Proven across 30+ organisations and 4,000+ leaders."
        areaServed="South Africa"
        url="/leader-as-coach"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Leader as Coach — 90-Day Manager Coaching Accelerator",
        "description": "A structured 90-day programme that installs coaching capability into your management layer. Equips managers with practical coaching tools for performance conversations, accountability frameworks, and needs-based coaching.",
        "image": "https://www.leadershipbydesign.co/og-leader-as-coach.jpg",
        "brand": {
          "@type": "Brand",
          "name": "Leadership by Design"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://www.leadershipbydesign.co/leader-as-coach",
          "priceCurrency": "ZAR",
          "price": "35000",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Leadership by Design"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "30",
          "bestRating": "5"
        },
        "category": "Leadership Development Programme"
      }) }} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Programmes", url: "/programmes" },
          { name: "Leader as Coach", url: "/leader-as-coach" },
        ]}
      />

      <div className="min-h-screen bg-background">
        <Header />

        {/* ───────────── 1. HERO ───────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={leaderAsCoachImage} alt="Leadership coaching session" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-primary" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 text-center">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <Clock className="w-3 h-3" /> 90-Day Accelerator
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <Briefcase className="w-3 h-3" /> Financial Services & Professional Services
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
              Your Managers Are Managing.<br className="hidden sm:block" />
              They're Not Coaching.<br className="hidden sm:block" />
              <span className="text-white/70">That's Costing You More Than You Think.</span>
            </h1>
            <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              The 90-Day Manager Coaching Accelerator for Financial Services and Professional Services firms.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto min-h-[56px] text-sm sm:text-base"
                onClick={handleCalendarOpen}
              >
                Book a Discovery Call
                <Calendar className="ml-2 w-5 h-5 shrink-0" />
              </Button>
              <Link to="/leader-as-coach-diagnostic" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white/15 backdrop-blur-sm text-white border border-white/40 hover:bg-white/25 rounded-full font-bold w-full min-h-[56px]"
                >
                  Take the Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <StatsBar />

        {/* ───────────── 2. THE PROBLEM ───────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block text-center">The Problem</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              Sound Familiar?
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { icon: GraduationCap, text: "Managers promoted for technical skill, not people skill. They default to command-and-control because nobody taught them anything else." },
                { icon: AlertTriangle, text: "Development happens in workshops, not in daily work. The training budget gets spent but nothing actually changes on the floor." },
                { icon: TrendingUp, text: "You're losing your best people to managers who can't coach. Exit interviews keep citing 'my manager' as the reason." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-destructive" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── 3. THE SOLUTION ───────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">The Solution</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Not a Course. Not a Workshop.<br />
              A 90-Day Operating System.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Leader as Coach is a structured 90-day accelerator installed into your management layer. It equips managers with practical coaching tools they use every day — performance conversations, accountability frameworks, and needs-based coaching — so development happens in the flow of work, not in a classroom.
            </p>
            <div className="w-16 h-1 bg-primary mx-auto" />
          </div>
        </section>

        {/* ───────────── 4. THE 90 DAYS ───────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">The 90 Days</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                What Happens Month by Month
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-3" />
            </div>

            <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  num: "01",
                  title: "Foundation",
                  subtitle: "Month 1",
                  icon: BarChart3,
                  description: "Leadership Index + Enneagram assessment to map each manager's behavioural baseline and leadership style. Coaching mindset installed. Managers learn conversation frameworks, accountability tools, and the shift from 'doer' to 'leader'.",
                },
                {
                  num: "02",
                  title: "Practice",
                  subtitle: "Month 2",
                  icon: MessageCircle,
                  description: "Live coaching in the flow of work. Managers apply skills in real performance conversations with their teams. Weekly facilitated sessions reinforce and course-correct.",
                },
                {
                  num: "03",
                  title: "Embed",
                  subtitle: "Month 3",
                  icon: Target,
                  description: "Consistency, measurement, and culture shift. Post-assessment against baseline. Executive summary with ROI data and succession readiness mapping.",
                },
              ].map((phase, i) => {
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
                    <span className="text-xs font-semibold text-primary mb-1 block text-center">{phase.subtitle}</span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-3 text-center">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────── 5. WHAT CHANGES ───────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">What Changes</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Five Outcomes That Move the Needle
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-3" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Users, title: "Retention improves", text: "Managers who coach retain their best people. Exit interviews stop citing 'my manager' as the reason." },
                { icon: Zap, title: "Engagement rises", text: "Teams led by coaches show measurably higher discretionary effort and accountability." },
                { icon: MessageCircle, title: "Performance conversations happen", text: "Weekly, honest, two-way. Not annual reviews that change nothing." },
                { icon: AlertTriangle, title: "Escalations drop", text: "Managers handle conflict, feedback, and underperformance directly — HR stops being the middleman." },
                { icon: TrendingUp, title: "Pipeline develops", text: "Your next generation of leaders is identified and grown from within, not hired from outside." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card rounded-xl p-5 border border-border"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────── 6. PROOF ───────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Proven Results</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                What Organisations Like Yours Have Achieved
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-3" />
            </div>

            <div className="grid md:grid-cols-3 gap-5 sm:gap-6 mb-10">
              {[
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
              ].map((r, i) => (
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

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-y-1 gap-x-6 text-xs sm:text-sm text-muted-foreground font-medium text-center">
              <span>4,000+ leaders developed</span>
              <span className="hidden sm:inline">·</span>
              <span>30+ organisations</span>
              <span className="hidden sm:inline">·</span>
              <span>11 years</span>
              <span className="hidden sm:inline">·</span>
              <span>750+ programmes delivered</span>
            </div>
          </div>
        </section>

        {/* ───────────── 7. WHO IT'S FOR ───────────── */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Who It's For</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4">
              Built for HR Directors & L&D Heads
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              At firms of 100–500 people in Financial Services, Insurance, Banking, Accounting, Legal, and Professional Services in South Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Financial Services", "Insurance", "Banking", "Accounting", "Legal", "Professional Services"].map(tag => (
                <span key={tag} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── 8. FACILITATOR ───────────── */}
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
                  Business school faculty member, Master Practitioner in NLP & Time Line Therapy, and architect of the SHIFT Methodology™. 750+ workshops. 4,000+ leaders developed across Discovery, FNB, and 30+ organisations.
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

        {/* ───────────── 9. INVESTMENT ───────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Investment</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Structured for Organisations of 100–500 People
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
              Discovery call required to confirm fit and scope. We'll map your management capability gaps and design the right cohort structure for your organisation.
            </p>
            <Button
              size="lg"
              className="rounded-full font-bold group min-h-[56px]"
              onClick={handleCalendarOpen}
            >
              Book a Discovery Call — 30 Minutes, No Obligation
              <Calendar className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>


        {/* ───────────── 11. BOTTOM CTA — DIAGNOSTIC ───────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3">
              Not Sure If Your Managers Need This?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Take the free 3-minute assessment. You'll get a coaching readiness profile, your three biggest gaps, and a clear recommendation.
            </p>
            <Link to="/leader-as-coach-diagnostic">
              <Button size="lg" variant="outline" className="rounded-full font-bold group min-h-[56px]">
                How Coaching-Ready Is Your Management Layer?
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ───────────── 12. FINAL CTA ───────────── */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <img src={productTeamHandsAbove} alt="Team collaboration" className="w-full h-full object-cover object-center opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Your Managers Won't Coach Themselves.<br className="hidden sm:block" /> Let's Fix That in 90 Days.
            </h2>
            <p className="text-primary-foreground/70 text-sm mb-8">
              4,000+ leaders. 30+ organisations. 11 years of proven results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto min-h-[56px]"
                onClick={handleCalendarOpen}
              >
                Book a Discovery Call
                <Calendar className="ml-2 w-5 h-5 shrink-0" />
              </Button>
              <Link to="/leader-as-coach-diagnostic" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white/15 backdrop-blur-sm text-white border border-white/40 hover:bg-white/25 rounded-full font-bold w-full min-h-[56px]"
                >
                  Take the Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
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
    </>
  );
}
