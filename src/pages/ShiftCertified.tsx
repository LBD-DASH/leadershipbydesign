import { useState } from "react";
import { ArrowRight, Users, Award, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import SEO from "@/components/SEO";

const whoFor = [
  {
    icon: Users,
    title: "Internal HR & L&D Leaders",
    description: "Bring SHIFT capability in-house and build a coaching culture that doesn't depend on external consultants.",
  },
  {
    icon: Award,
    title: "Executive Coaches",
    description: "Add a proven, proprietary framework to your practice and differentiate your offering.",
  },
  {
    icon: Briefcase,
    title: "Organisational Development Specialists",
    description: "License the SHIFT system to deliver at scale within your organisation.",
  },
];

const includes = [
  "Full SHIFT methodology training (live virtual sessions)",
  "Facilitator guide, workbooks, and branded delivery materials",
  "Assessed practical delivery (minimum 2 live facilitations)",
  "SHIFT Certified Facilitator digital badge and certificate",
  "Access to annual SHIFT Facilitator Community",
  "Annual license renewal and updated materials",
];

export default function ShiftCertified() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organisation: "",
    role: "",
    motivation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      await supabase.from("contact_form_submissions").insert({
        name: form.name,
        email: form.email,
        company: form.organisation,
        role: form.role,
        message: `SHIFT Certification Waitlist — Motivation: ${form.motivation}`,
        service_interest: "SHIFT Certification",
      });
      setSubmitted(true);
      toast.success("You're on the waitlist! We'll be in touch.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="SHIFT Certified Facilitator Programme | Leadership by Design"
        description="Become accredited to deliver SHIFT methodology. The first formal certification programme for HR professionals, L&D specialists, and executive coaches. First cohort mid-2026."
        canonicalUrl="/shift-certified"
        keywords="SHIFT certification, facilitator training, leadership methodology, HR certification, executive coach accreditation, Kevin Britz"
      />
      <div className="min-h-screen">
        <Header />

        {/* Hero */}
        <section className="relative bg-primary pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A84C' fill-opacity='0.3'%3E%3Cpath d='M20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-6"
            >
              Become a SHIFT Certified Facilitator
            </motion.h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-6">
              The first formal certification programme accrediting HR professionals, L&D specialists, and executive coaches to deliver SHIFT methodology inside their organisations.
            </p>
            <span className="inline-block bg-accent text-accent-foreground text-sm font-bold px-5 py-2 rounded mb-8">
              First Cohort — Mid 2026 | Applications Now Open
            </span>
            <div>
              <Button
                size="lg"
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-accent text-accent-foreground hover:opacity-90 px-8 py-6 text-base font-semibold"
              >
                Join the Waitlist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary text-center mb-4">Who This Is For</h2>
            <div className="w-16 h-0.5 bg-accent mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whoFor.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-card rounded-lg p-8 border border-border text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What Certification Includes */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary text-center mb-4">What Certification Includes</h2>
            <div className="w-16 h-0.5 bg-accent mx-auto mb-12" />
            <div className="space-y-4">
              {includes.map((item) => (
                <div key={item} className="flex items-start gap-4 p-4 bg-background rounded border border-border">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Tiers */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary text-center mb-4">Certification Tiers</h2>
            <div className="w-16 h-0.5 bg-accent mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Organisational Facilitator</h3>
                <p className="text-sm text-muted-foreground">For internal use within your company only. Deploy SHIFT methodology across your teams with full licensing rights inside your organisation.</p>
              </div>
              <div className="bg-card rounded-lg p-8 border border-accent">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Licensed Practitioner</h3>
                <p className="text-sm text-muted-foreground">For independent coaches and consultants delivering to clients. Use SHIFT methodology as part of your external consulting practice.</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Investment by application. Tiers and pricing discussed on discovery call.
            </p>
            <p className="text-center text-xs text-accent mt-2">
              All engagements begin with a complimentary 30-minute discovery conversation.
            </p>
          </div>
        </section>

        {/* Waitlist Form */}
        <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground text-center mb-2">
              Join the First Cohort Waitlist
            </h2>
            <p className="text-center text-primary-foreground/70 text-sm mb-10">
              We are accepting a maximum of 20 participants in the inaugural cohort. Priority given to waitlist applicants.
            </p>

            {submitted ? (
              <div className="text-center bg-card rounded-lg p-10">
                <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">You're on the list!</h3>
                <p className="text-sm text-muted-foreground">We'll be in touch with more details as the first cohort takes shape.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 space-y-5">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="org">Organisation</Label>
                  <Input id="org" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="role">Role / Title</Label>
                  <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="motivation">What draws you to SHIFT certification?</Label>
                  <Textarea id="motivation" value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} rows={4} />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-accent text-accent-foreground hover:opacity-90 py-6 text-base font-semibold"
                >
                  {submitting ? "Submitting..." : "Join the Waitlist"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            )}
          </div>
        </section>

        <Footer />
        <FloatingSocial />
      </div>
    </>
  );
}
