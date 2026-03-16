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
        description="A structured 90-day programme that installs coaching capability into your management layer. Proven across 50+ organisations and 4,000+ leaders."
        areaServed="South Africa"
        url="/leader-as-coach"
      />
      <ProductSchema
        name="Leader as Coach — 90-Day Manager Coaching Accelerator"
        description="A structured 90-day programme that installs coaching capability into your management layer. Equips managers with practical coaching tools for performance conversations, accountability frameworks, and needs-based coaching."
        image="https://leadershipbydesign.co/og-leader-as-coach.jpg"
        url="/leader-as-coach"
        price="35000"
        priceCurrency="ZAR"
        availability="InStock"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Programmes", url: "/programmes" },
          { name: "Leader as Coach", url: "/leader-as-coach" },
        ]}
      />

      <div className="min-h-screen">
        <Header />

        {/* ───────────── 1. HERO ───────────── */}
        <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center" style={{ backgroundColor: "#0F1F2E" }}>
          <img
            src={leaderAsCoachImage}
            alt="Leadership coaching session"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
          />
          <div
            className="absolute inset-0 animate-[heroGradient_12s_ease_infinite]"
            style={{
              background: "linear-gradient(135deg, rgba(15,31,46,0.85) 0%, rgba(26,50,69,0.75) 50%, rgba(15,31,46,0.85) 100%)",
              backgroundSize: "200% 200%",
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 sm:py-36">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(200,168,100,0.4)", color: "#C8A864" }}
              >
                <Clock className="w-3 h-3" /> 90-Day Accelerator
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(200,168,100,0.4)", color: "#C8A864" }}
              >
                <Briefcase className="w-3 h-3" /> Financial Services & Professional Services
              </span>
            </div>
            <h1
              className="font-serif font-bold mb-6 leading-tight"
              style={{ color: "#FFFFFF", fontSize: "clamp(32px, 4.5vw, 56px)" }}
            >
              Your Managers Are Managing.<br className="hidden sm:block" />
              They're Not Coaching.<br className="hidden sm:block" />
              <span style={{ color: "rgba(248,246,241,0.6)" }}>That's Costing You More Than You Think.</span>
            </h1>
            <p
              className="mb-8 sm:mb-10 mx-auto text-base sm:text-lg md:text-xl"
              style={{
                color: "rgba(248,246,241,0.7)",
                fontFamily: "'Source Sans 3', sans-serif",
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              The 90-Day Manager Coaching Accelerator for Financial Services and Professional Services firms.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold text-sm sm:text-base transition-opacity hover:opacity-90 w-full sm:w-auto"
                style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}
                onClick={handleCalendarOpen}
              >
                Book a Discovery Call
              </button>
              <Link to="/leader-as-coach-diagnostic" className="w-full sm:w-auto">
                <button
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold text-sm sm:text-base border-2 transition-opacity hover:opacity-80 w-full"
                  style={{ borderColor: "#C8A864", color: "#C8A864", backgroundColor: "transparent", fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Take the Free Assessment
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ───────────── PROOF BAR ───────────── */}
        <section style={{ backgroundColor: "#2A7B88" }} className="py-6 sm:py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
              {[
                { value: "4,000+", label: "Leaders Developed" },
                { value: "750+", label: "Programmes Delivered" },
                { value: "50+", label: "Organisations" },
                { value: "11 Years", label: "In Practice" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center sm:border-r last:border-r-0"
                  style={{ borderColor: "rgba(200,168,100,0.3)" }}
                >
                  <p className="font-serif font-bold text-xl sm:text-3xl text-white">{stat.value}</p>
                  <p style={{ color: "#F8F6F1", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13 }} className="mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── 2. THE PROBLEM ───────────── */}
        <section style={{ backgroundColor: "#F8F6F1" }} className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <p
              className="uppercase tracking-[0.2em] text-sm mb-4 text-center"
              style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              The Problem
            </p>
            <h2
              className="font-serif font-bold mb-10 text-center"
              style={{ color: "#0F1F2E", fontSize: "clamp(26px, 3vw, 38px)" }}
            >
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
                  className="rounded-lg p-6 border shadow-sm"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(220,53,69,0.08)" }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: "#DC3545" }} />
                  </div>
                  <p style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, lineHeight: 1.7 }}>
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── 3. THE SOLUTION ───────────── */}
        <section style={{ backgroundColor: "#F2F0EB" }} className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="uppercase tracking-[0.2em] text-sm mb-4"
              style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              The Solution
            </p>
            <h2
              className="font-serif font-bold mb-6"
              style={{ color: "#0F1F2E", fontSize: "clamp(26px, 3vw, 38px)" }}
            >
              Not a Course. Not a Workshop.<br />
              A 90-Day Operating System.
            </h2>
            <p
              className="mx-auto mb-8"
              style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 18, lineHeight: 1.8, maxWidth: 640 }}
            >
              Leader as Coach is a structured 90-day accelerator installed into your management layer. It equips managers with practical coaching tools they use every day — performance conversations, accountability frameworks, and needs-based coaching — so development happens in the flow of work, not in a classroom.
            </p>
            <div className="w-16 h-1 mx-auto" style={{ backgroundColor: "#C8A864" }} />
          </div>
        </section>

        {/* ───────────── 4. THE 90 DAYS ───────────── */}
        <section style={{ backgroundColor: "#F8F6F1" }} className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p
                className="uppercase tracking-[0.2em] text-sm mb-4"
                style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
              >
                The 90 Days
              </p>
              <h2
                className="font-serif font-bold mb-3"
                style={{ color: "#0F1F2E", fontSize: "clamp(26px, 3vw, 38px)" }}
              >
                What Happens Month by Month
              </h2>
              <div className="w-16 h-1 mx-auto mt-3" style={{ backgroundColor: "#C8A864" }} />
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
                    className="rounded-lg p-6 sm:p-8 border shadow-sm"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderTop: "3px solid #C8A864" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: "rgba(42,123,136,0.08)" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "#2A7B88" }} />
                    </div>
                    <p
                      className="text-xs font-semibold mb-1 text-center"
                      style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
                    >
                      {phase.subtitle}
                    </p>
                    <h3
                      className="font-serif text-lg sm:text-xl font-bold mb-3 text-center"
                      style={{ color: "#0F1F2E" }}
                    >
                      {phase.title}
                    </h3>
                    <p style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, lineHeight: 1.7 }}>
                      {phase.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────── 5. WHAT CHANGES ───────────── */}
        <section style={{ backgroundColor: "#FDFCF9" }} className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p
                className="uppercase tracking-[0.2em] text-sm mb-4"
                style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
              >
                What Changes
              </p>
              <h2
                className="font-serif font-bold mb-3"
                style={{ color: "#0F1F2E", fontSize: "clamp(26px, 3vw, 38px)" }}
              >
                Five Outcomes That Move the Needle
              </h2>
              <div className="w-16 h-1 mx-auto mt-3" style={{ backgroundColor: "#C8A864" }} />
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
                    className="rounded-lg p-5 border shadow-sm"
                    style={{ backgroundColor: "#F8F6F1", borderColor: "#E5E7EB" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "rgba(42,123,136,0.08)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "#2A7B88" }} />
                      </div>
                      <h3 className="font-semibold text-sm" style={{ color: "#0F1F2E" }}>{item.title}</h3>
                    </div>
                    <p style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, lineHeight: 1.7 }}>
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────── 6. PROOF ───────────── */}
        <section style={{ backgroundColor: "#F8F6F1" }} className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p
                className="uppercase tracking-[0.2em] text-sm mb-4"
                style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
              >
                Proven Results
              </p>
              <h2
                className="font-serif font-bold mb-3"
                style={{ color: "#0F1F2E", fontSize: "clamp(26px, 3vw, 38px)" }}
              >
                What Organisations Like Yours Have Achieved
              </h2>
              <div className="w-16 h-1 mx-auto mt-3" style={{ backgroundColor: "#C8A864" }} />
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
                  className="rounded-lg p-6 border shadow-sm"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderLeft: "4px solid #C8A864" }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}>{r.context}</p>
                  <p className="text-[10px] mb-3" style={{ color: "#888888", fontFamily: "'Source Sans 3', sans-serif" }}>{r.size}</p>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: "#0F1F2E" }}>{r.outcome}</p>
                </motion.div>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-y-1 gap-x-6 text-xs sm:text-sm font-medium text-center"
              style={{ color: "#888888", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              <span>4,000+ leaders developed</span>
              <span className="hidden sm:inline">·</span>
              <span>50+ organisations</span>
              <span className="hidden sm:inline">·</span>
              <span>11 years</span>
              <span className="hidden sm:inline">·</span>
              <span>750+ programmes delivered</span>
            </div>
          </div>
        </section>

        {/* ───────────── 7. WHO IT'S FOR ───────────── */}
        <section style={{ backgroundColor: "#F2F0EB" }} className="py-14 sm:py-20 px-4 sm:px-6 border-y" >
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="uppercase tracking-[0.2em] text-sm mb-4"
              style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Who It's For
            </p>
            <h2
              className="font-serif font-bold mb-4"
              style={{ color: "#0F1F2E", fontSize: "clamp(22px, 2.5vw, 32px)" }}
            >
              Built for HR Directors & L&D Heads
            </h2>
            <p
              className="mb-6"
              style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, lineHeight: 1.7 }}
            >
              At firms of 100–500 people in Financial Services, Insurance, Banking, Accounting, Legal, and Professional Services in South Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Financial Services", "Insurance", "Banking", "Accounting", "Legal", "Professional Services"].map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(42,123,136,0.08)", color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── 8. FACILITATOR ───────────── */}
        <section style={{ backgroundColor: "#F8F6F1" }} className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <p
              className="uppercase tracking-[0.2em] text-sm mb-8"
              style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Who Delivers This
            </p>
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg overflow-hidden shadow-lg">
                  <img src={kevinImage} alt="Kevin Britz — Leadership Facilitator" className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
              </div>
              <div className="md:col-span-3 text-center md:text-left">
                <h3 className="font-serif font-bold mb-1 text-xl sm:text-2xl md:text-[28px]" style={{ color: "#0F1F2E" }}>Kevin Britz</h3>
                <p className="font-serif mb-4 text-base sm:text-lg" style={{ color: "#0F1F2E" }}>Leadership Architect</p>
                <p
                  className="mb-6 text-sm sm:text-base"
                  style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.8 }}
                >
                  Business school faculty member, Master Practitioner in NLP & Time Line Therapy, and architect of the SHIFT Methodology™. 750+ workshops. 4,000+ leaders developed across Discovery, FNB, and 50+ organisations.
                </p>
                <Link to="/about">
                  <button
                    className="px-6 py-2.5 rounded-md font-semibold text-sm border-2 transition-opacity hover:opacity-80"
                    style={{ borderColor: "#0F1F2E", color: "#0F1F2E", backgroundColor: "transparent", fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    Read Full Bio →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── 9. INVESTMENT ───────────── */}
        <section style={{ backgroundColor: "#FDFCF9" }} className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="uppercase tracking-[0.2em] text-sm mb-4"
              style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Investment
            </p>
            <h2
              className="font-serif font-bold mb-4"
              style={{ color: "#0F1F2E", fontSize: "clamp(26px, 3vw, 38px)" }}
            >
              Structured for Organisations of 100–500 People
            </h2>
            <p
              className="mb-8 mx-auto"
              style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 17, lineHeight: 1.7, maxWidth: 560 }}
            >
              Discovery call required to confirm fit and scope. We'll map your management capability gaps and design the right cohort structure for your organisation.
            </p>
            <button
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold text-sm sm:text-base transition-opacity hover:opacity-90 w-full sm:w-auto"
              style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}
              onClick={handleCalendarOpen}
            >
              Book a Discovery Call — 30 Min, No Obligation
            </button>
          </div>
        </section>

        {/* ───────────── 10. DIAGNOSTIC CTA ───────────── */}
        <section style={{ backgroundColor: "#2A7B88" }} className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              Not Sure If Your Managers Need This?
            </h2>
            <p
              className="mb-8 mx-auto"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Source Sans 3', sans-serif", fontSize: 17, maxWidth: 560, lineHeight: 1.6 }}
            >
              Take the free 3-minute assessment. You'll get a coaching readiness profile, your three biggest gaps, and a clear recommendation.
            </p>
            <Link to="/leader-as-coach-diagnostic">
              <button
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold text-sm sm:text-base transition-opacity hover:opacity-90 w-full sm:w-auto"
                style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}
              >
                How Coaching-Ready Is Your Management Layer?
              </button>
            </Link>
            <p className="mt-3" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13 }}>
              Free. No email required to start.
            </p>
          </div>
        </section>

        {/* ───────────── 11. FINAL CTA ───────────── */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: "#0F1F2E" }}>
          <img
            src={productTeamHandsAbove}
            alt="Team collaboration"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-10"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(15,31,46,0.9) 0%, rgba(26,50,69,0.85) 50%, rgba(15,31,46,0.9) 100%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              className="font-serif font-bold mb-4"
              style={{ color: "#FFFFFF", fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              Your Managers Won't Coach Themselves.<br className="hidden sm:block" /> Let's Fix That in 90 Days.
            </h2>
            <p className="mb-8" style={{ color: "rgba(248,246,241,0.6)", fontFamily: "'Source Sans 3', sans-serif", fontSize: 16 }}>
              4,000+ leaders. 30+ organisations. 11 years of proven results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold text-sm sm:text-base transition-opacity hover:opacity-90 w-full sm:w-auto"
                style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}
                onClick={handleCalendarOpen}
              >
                Book a Discovery Call
              </button>
              <Link to="/leader-as-coach-diagnostic" className="w-full sm:w-auto">
                <button
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md font-semibold text-sm sm:text-base border-2 transition-opacity hover:opacity-80 w-full"
                  style={{ borderColor: "#C8A864", color: "#C8A864", backgroundColor: "transparent", fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Take the Free Assessment
                </button>
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
