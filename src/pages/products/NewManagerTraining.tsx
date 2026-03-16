import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUtmParams } from "@/hooks/useUtmParams";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Download, Clock, Zap, Shield, Users,
  ChevronDown, ChevronUp, ArrowRight, Star, Package, X,
} from "lucide-react";

/* ───────────────────── DATA ───────────────────── */

const competitors = [
  { name: "UCT Online", price: "R17,995", duration: "10 weeks", format: "Online course" },
  { name: "Knowledge Academy", price: "R14,997", duration: "5 days", format: "In-person" },
  { name: "GIBS", price: "R29,500", duration: "3 days", format: "On campus" },
];

const faqs = [
  {
    q: "What format is this?",
    a: "Instant PDF download. You can read it on your phone, tablet or laptop — or print it out.",
  },
  {
    q: "Is this relevant to the South African market?",
    a: "Yes. Built by a Johannesburg-based leadership consultancy with 11 years and 4,000+ leaders across SA's private and public sector.",
  },
  {
    q: "Can my company pay for this?",
    a: "Absolutely. Digital skills development qualifies under B-BBEE skills spend (companies must allocate 3-6% of payroll). Forward your receipt to HR.",
  },
  {
    q: "What if it doesn't help?",
    a: "100% money-back guarantee. If it doesn't work for you, email us and we'll refund you — no questions asked.",
  },
  {
    q: "I need something more comprehensive.",
    a: "The R597 Bundle includes the full Survival Kit (R497) + Difficult Conversations Playbook — saving you 20%.",
  },
];

const socialProof = [
  { stat: "11 years", label: "Developing leaders" },
  { stat: "4,000+", label: "Leaders trained" },
  { stat: "30+", label: "Organisations" },
];

/* ───────────────────── COMPONENT ───────────────────── */

export default function NewManagerTraining() {
  const utm = useUtmParams();
  const [checkoutProduct, setCheckoutProduct] = useState<{
    name: string; price: number; display: string; path: string;
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [exitEmail, setExitEmail] = useState("");
  const [showExit, setShowExit] = useState(false);
  const [exitSubmitting, setExitSubmitting] = useState(false);
  const [exitDismissed, setExitDismissed] = useState(false);

  // Exit-intent detection (mouse leaving viewport top)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY < 5 && !exitDismissed && !showExit) {
        setShowExit(true);
      }
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [exitDismissed, showExit]);

  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitEmail.trim()) return;
    setExitSubmitting(true);
    try {
      await supabase.from("email_subscribers" as any).insert({
        email: exitEmail.trim(),
        source: "new-manager-training-exit",
        tags: ["new-manager-funnel"],
      } as any);

      // Trigger checklist email
      await supabase.functions.invoke("send-lead-magnet-email", {
        body: {
          email: exitEmail.trim(),
          leadMagnet: "First 90 Days Checklist",
          downloadUrl: `${window.location.origin}/new-manager-kit.pdf`,
        },
      });

      toast.success("Checklist sent! Check your inbox.");
      setShowExit(false);
      setExitDismissed(true);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setExitSubmitting(false);
    }
  };

  const openCheckout = (variant: "pack" | "kit" | "bundle") => {
    const products = {
      pack: { name: "New Manager Survival Pack", price: 147, display: "R147", path: "/survival-pack/success" },
      kit: { name: "The New Manager Survival Kit", price: 497, display: "R497", path: "/new-manager-kit/success" },
      bundle: { name: "The New Manager Bundle", price: 597, display: "R597", path: "/bundle/success" },
    };
    setCheckoutProduct(products[variant]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="New Manager Training — R497 (Not R17,995) | Leadership by Design"
        description="Practical new manager training used by 4,000+ South African leaders. Scripts, templates & a 90-day plan. Instant PDF download from R147."
        canonicalUrl="/new-manager-training"
        ogImage="https://leadershipbydesign.co/og-products.jpg"
        keywords="new manager training south africa, first time manager course, new manager course SA, leadership training johannesburg, management training B-BBEE"
      />

      {/* Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal
          open={!!checkoutProduct}
          onOpenChange={(open) => !open && setCheckoutProduct(null)}
          productName={checkoutProduct.name}
          price={checkoutProduct.price}
          priceDisplay={checkoutProduct.display}
          successPath={checkoutProduct.path}
        />
      )}

      {/* ── HERO ── */}
      <section className="bg-primary text-primary-foreground pt-12 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-4">
            Trusted by 4,000+ leaders across 30+ South African organisations
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight">
            New Manager Training<br />
            <span className="text-primary-foreground/80">R497</span>{" "}
            <span className="text-primary-foreground/50 line-through text-2xl sm:text-3xl">R17,995</span>
          </h1>

          <p className="text-primary-foreground/70 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Everything you need for your first 90 days as a manager. Scripts, templates, a step-by-step plan — instant PDF download.
          </p>

          {/* Social proof */}
          <div className="flex justify-center gap-6 sm:gap-10 mb-8">
            {socialProof.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold">{s.stat}</div>
                <div className="text-[11px] text-primary-foreground/50">{s.label}</div>
              </div>
            ))}
          </div>

          {/* 3 Product Cards */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Impulse — R147 */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 border border-primary-foreground/20">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-2">Quick Start</p>
              <h3 className="text-lg font-serif mb-1">Survival Pack</h3>
              <p className="text-2xl font-bold mb-2">R147</p>
              <p className="text-xs text-primary-foreground/60 mb-4">3 conversation scripts + team expectations sheet</p>
              <Button
                onClick={() => openCheckout("pack")}
                className="w-full bg-primary-foreground text-primary hover:bg-white font-semibold"
                size="sm"
              >
                Get Scripts →
              </Button>
            </div>

            {/* Anchor — R497 */}
            <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-xl p-5 border-2 border-primary-foreground/40 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-foreground text-primary text-[10px] font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <p className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-2">Complete System</p>
              <h3 className="text-lg font-serif mb-1">Survival Kit</h3>
              <p className="text-2xl font-bold mb-2">R497</p>
              <p className="text-xs text-primary-foreground/60 mb-4">5 scripts + 30-60-90 day plan + self-assessment + templates</p>
              <Button
                onClick={() => openCheckout("kit")}
                className="w-full bg-primary-foreground text-primary hover:bg-white font-bold"
              >
                Get Full Kit →
              </Button>
            </div>

            {/* Value — R597 */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 border border-primary-foreground/20 relative">
              <div className="absolute -top-3 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:block">
                SAVE 20%
              </div>
              <p className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-2">Best Value</p>
              <h3 className="text-lg font-serif mb-1">Bundle</h3>
              <p className="text-2xl font-bold mb-2">R597</p>
              <p className="text-xs text-primary-foreground/60 mb-4">Kit + Difficult Conversations Playbook (save R147)</p>
              <Button
                onClick={() => openCheckout("bundle")}
                className="w-full bg-primary-foreground text-primary hover:bg-white font-semibold"
                size="sm"
              >
                Get Bundle →
              </Button>
            </div>
          </div>

          <p className="text-primary-foreground/40 text-[11px] mt-4 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> 100% money-back guarantee • Secure payment via Paystack
          </p>
        </div>
      </section>

      {/* ── PRICE COMPARISON ── */}
      <section className="py-12 px-4 bg-muted">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-serif text-center mb-2 text-foreground">
            Why pay R17,995 when R497 covers what matters?
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Traditional courses teach theory. This gives you the exact words and plans to use immediately.
          </p>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="p-3 text-left text-foreground font-medium">Provider</th>
                  <th className="p-3 text-left text-foreground font-medium">Price</th>
                  <th className="p-3 text-left text-foreground font-medium hidden sm:table-cell">Duration</th>
                  <th className="p-3 text-left text-foreground font-medium hidden sm:table-cell">Format</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.name} className="border-b border-border">
                    <td className="p-3 text-muted-foreground">{c.name}</td>
                    <td className="p-3 text-muted-foreground line-through">{c.price}</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{c.duration}</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{c.format}</td>
                  </tr>
                ))}
                <tr className="bg-primary/5">
                  <td className="p-3 font-semibold text-primary">Leadership by Design</td>
                  <td className="p-3 font-bold text-primary">R497</td>
                  <td className="p-3 text-primary hidden sm:table-cell">Instant</td>
                  <td className="p-3 text-primary hidden sm:table-cell">PDF download</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">B-BBEE Skills Development:</strong> Companies must spend 3-6% of payroll on skills development.
              Digital training qualifies. Forward your receipt to HR for reimbursement.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-serif text-center mb-8 text-foreground">
            What's Inside the Kit
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Users, title: "5 Critical Conversation Scripts", desc: "Word-for-word scripts for your first 1:1, team meeting, feedback session, underperformance talk, and upward management." },
              { icon: Clock, title: "30-60-90 Day Plan", desc: "A step-by-step roadmap for your first quarter. Know exactly what to do each week." },
              { icon: Star, title: "Self-Assessment Tool", desc: "Identify your strengths and blind spots before you start. Page 3." },
              { icon: Download, title: "Team Expectations Template", desc: "A printable one-pager to align your team from day one." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-4 bg-card rounded-lg border border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => openCheckout("kit")} size="lg" className="font-bold min-h-[52px] px-10">
              Get the Full Kit — R497 →
            </Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-12 px-4 bg-muted">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl font-serif text-center mb-6 text-foreground">What Managers Are Saying</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { quote: "I used the first 1:1 script that same afternoon. My team member actually opened up for the first time.", author: "New Manager", industry: "Financial Services" },
              { quote: "Simple, practical, no fluff. Exactly what I needed in my first week.", author: "Team Lead", industry: "Tech Startup" },
              { quote: "The underperformance script saved me from a really awkward conversation.", author: "First-time Manager", industry: "Retail" },
            ].map((t, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-3">"{t.quote}"</p>
                <p className="text-xs font-semibold text-foreground">
                  — {t.author}, <span className="text-muted-foreground font-normal">{t.industry}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-xl font-serif text-center mb-6 text-foreground">Frequently Asked Questions</h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card rounded-lg border border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-12 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-serif mb-3">Your next conversation is too important to improvise.</h2>
          <p className="text-primary-foreground/70 text-sm mb-6">Join 4,000+ leaders who stopped winging it.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => openCheckout("kit")}
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-white font-bold min-h-[52px] px-10"
            >
              Get the Kit — R497 →
            </Button>
            <Button
              onClick={() => openCheckout("pack")}
              size="lg"
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold"
            >
              Just the Scripts — R147
            </Button>
          </div>

          <p className="text-primary-foreground/40 text-[11px] mt-4 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> 100% money-back guarantee • Instant download
          </p>
        </div>
      </section>

      {/* ── FOOTER (minimal) ── */}
      <footer className="py-6 px-4 bg-muted border-t border-border">
        <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Leadership by Design</p>
          <div className="flex gap-4">
            <Link to="/products" className="text-xs text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
            <Link to="/leadership-diagnostic" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Free Leadership Diagnostic</Link>
            <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      {/* ── EXIT INTENT POPUP ── */}
      <AnimatePresence>
        {showExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => { setShowExit(false); setExitDismissed(true); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl p-6 sm:p-8 max-w-md w-full border border-border shadow-2xl relative"
            >
              <button
                onClick={() => { setShowExit(false); setExitDismissed(true); }}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-serif text-foreground mb-2 text-center">
                Wait — grab the free checklist first.
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-5">
                The First 90 Days Checklist for New Managers. Free. No strings attached.
              </p>
              <form onSubmit={handleExitSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={exitEmail}
                  onChange={(e) => setExitEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={exitSubmitting} className="whitespace-nowrap">
                  {exitSubmitting ? "Sending..." : "Send Checklist"}
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-3">No spam. Unsubscribe anytime.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
