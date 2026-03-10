import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Download, Lock, ArrowRight, AlertTriangle, TrendingDown, Users, MessageSquare, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackLeadMagnetDownload } from "@/utils/gtmEvents";
import { useNavigate } from "react-router-dom";

const signs = [
  {
    icon: AlertTriangle,
    title: "They solve problems instead of developing people",
    description: "When a team member brings a challenge, your manager gives the answer instead of coaching them to find it. The team stays dependent.",
  },
  {
    icon: TrendingDown,
    title: "1-on-1s are status updates, not development conversations",
    description: "Meetings become task lists. No questions about growth, career, or what's getting in the way. People leave these meetings feeling managed, not developed.",
  },
  {
    icon: Users,
    title: "Good people keep leaving — and managers don't know why",
    description: "Exit interviews mention 'lack of growth' but managers think they're doing a great job. The gap between perception and reality is the coaching gap.",
  },
  {
    icon: MessageSquare,
    title: "Difficult conversations get avoided or escalated to HR",
    description: "Instead of addressing performance directly, managers either ignore it or hand it off. Both cost you time, trust, and talent.",
  },
  {
    icon: BarChart3,
    title: "Engagement scores plateau despite investment in 'culture'",
    description: "You've done the surveys, the offsites, the values workshops. But nothing shifts because the daily management experience hasn't changed.",
  },
];

export default function CoachingReadinessGuide() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    try {
      // Save to lead_captures
      await supabase.from("lead_captures").insert({
        email: formData.email.trim().toLowerCase(),
        name: formData.name.trim(),
        company: formData.company.trim() || null,
        resource_slug: "coaching-readiness-guide",
        resource_title: "5 Signs Your Managers Are Managing, Not Coaching",
        source: "gated_lead_magnet",
      });

      // Also add to email subscribers
      await supabase.from("email_subscribers").insert({
        email: formData.email.trim().toLowerCase(),
        name: formData.name.trim(),
        company: formData.company.trim() || null,
        source: "lead_magnet:coaching-readiness-guide",
        tags: ["lead-magnet", "coaching-readiness-guide"],
      }).select().maybeSingle(); // ignore conflict

      // Fire GTM event
      trackLeadMagnetDownload({ lead_magnet: "coaching-readiness-guide" });

      // Notify via Slack
      try {
        await supabase.functions.invoke("slack-notify", {
          body: {
            channel: "#leads-and-signups",
            text: `📥 Lead Magnet Download\n*${formData.name}* (${formData.email})${formData.company ? ` at ${formData.company}` : ""}\nAsset: 5 Signs Your Managers Are Managing, Not Coaching`,
          },
        });
      } catch {} // non-blocking

      setIsDownloaded(true);
      toast.success("Guide unlocked! Your download will start shortly.");
      
      // Trigger PDF download
      window.open("/downloads/coaching-readiness-guide.pdf", "_blank");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Free Guide: 5 Signs Your Managers Are Managing, Not Coaching | Leadership by Design"
        description="Download the free guide for HR Directors and L&D Heads. Identify the 5 warning signs that your management layer lacks coaching capability — and what to do about it."
        ogImage="/og-products.jpg"
        canonicalUrl="https://leadershipbydesign.co/coaching-readiness-guide"
      />
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[hsl(var(--primary)/0.08)] to-background">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-4">
                Free Guide for HR Directors & L&D Heads
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                5 Signs Your Managers Are Managing, Not Coaching
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Most management layers have the same gap. This guide helps you identify it — 
                and shows you exactly what to do about it. Built from 11 years of working with 
                50+ organisations in South African financial services.
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Download className="w-4 h-4 text-primary" />
                <span>PDF · 2-minute read · Immediately actionable</span>
              </div>
            </motion.div>

            {/* Gate Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              {!isDownloaded ? (
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
                  <h2 className="text-xl font-bold text-foreground mb-1">Download the Free Guide</h2>
                  <p className="text-sm text-muted-foreground mb-6">Enter your details below to get instant access.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={e => { setFormData(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: "" })); }}
                        className={errors.name ? "border-destructive" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={e => { setFormData(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input
                        id="company"
                        placeholder="Your organisation"
                        value={formData.company}
                        onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Unlocking..." : "Download Free Guide"}
                      <Download className="w-4 h-4 ml-2" />
                    </Button>
                  </form>

                  <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <p>No spam. We only follow up if there's clear value. Unsubscribe anytime.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-primary/30 rounded-2xl p-8 shadow-lg text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Guide Unlocked!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your download should start automatically. If not, 
                    <a href="/downloads/coaching-readiness-guide.pdf" className="text-primary underline ml-1" target="_blank">click here</a>.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={() => navigate("/leader-as-coach-diagnostic")} className="w-full" variant="outline">
                      Take the Free Assessment <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button onClick={() => navigate("/leader-as-coach")} className="w-full">
                      See the 90-Day Programme <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Preview: The 5 Signs */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
            What's Inside the Guide
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Five observable patterns that reveal whether your management layer is coaching or just managing — 
            each with a diagnostic question and a concrete next step.
          </p>

          <div className="space-y-6">
            {signs.map((sign, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 bg-card border border-border rounded-xl p-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <sign.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Sign {i + 1}: {sign.title}</h3>
                  <p className="text-sm text-muted-foreground">{sign.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to go deeper?
          </h2>
          <p className="text-muted-foreground mb-8">
            The guide identifies the gap. The Leader as Coach Diagnostic measures it. 
            Takes 3 minutes. Free for HR Directors and L&D Heads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/leader-as-coach-diagnostic")}>
              Take the Free Assessment <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/leader-as-coach")}>
              See How Leader as Coach Works
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}