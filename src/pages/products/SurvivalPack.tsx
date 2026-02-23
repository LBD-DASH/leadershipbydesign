import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, Clock, Download, CheckCircle, FileText, Users, Headphones, Shield, Quote } from "lucide-react";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import newManagerHero from "@/assets/new-manager-hero.jpg";

const scriptCards = [
  {
    icon: Users,
    title: "First 1:1 Conversation",
    description: "Exact words to build trust and set expectations in your very first one-on-one.",
  },
  {
    icon: FileText,
    title: "Addressing Underperformance",
    description: "A step-by-step script to have the tough talk without destroying the relationship.",
  },
  {
    icon: Users,
    title: "First Team Meeting",
    description: "Run a team meeting that earns respect — not eye-rolls. Word for word.",
  },
];

const testimonials = [
  {
    quote: "I used the first 1:1 script in my meeting the same afternoon. My team member actually opened up for the first time.",
    author: "New Manager",
    industry: "Financial Services",
  },
  {
    quote: "Simple, practical, no fluff. Exactly what I needed in my first week.",
    author: "Team Lead",
    industry: "Tech Startup",
  },
  {
    quote: "The underperformance script saved me from a really awkward conversation. Worth every cent.",
    author: "First-time Manager",
    industry: "Retail",
  },
];

const bonusItems = [
  {
    icon: FileText,
    label: "Printable Team Expectations Sheet",
  },
  {
    icon: Headphones,
    label: '"Calm Authority Reset" audio mention',
  },
];

const GuaranteeBadge = () => (
  <div className="flex items-center justify-center gap-2 mt-4">
    <Shield className="w-4 h-4 text-white/50" />
    <p className="text-white/50 text-[11px]">
      100% Money-Back Guarantee — If these scripts don't help, get a full refund. No questions asked.
    </p>
  </div>
);

export default function SurvivalPack() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("email_subscribers" as any).insert({ email: email.trim(), source: "survival-pack-checklist" } as any);
      if (error) throw error;
      toast.success("Checklist on its way! Check your inbox.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen scroll-smooth">
      <SEO
        title="New Manager Survival Pack — 3 Scripts. R147. Use Today. | Leadership by Design"
        description="3 plug-and-play conversation scripts for new managers. First 1:1, addressing underperformance, running your first team meeting. R147 instant download."
        canonicalUrl="/survival-pack"
        ogImage="https://leadershipbydesign.co/og-products.jpg"
        keywords="new manager scripts, conversation templates, first 1 on 1, team meeting script, new manager, leadership scripts"
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        productName="New Manager Survival Pack"
        price={147}
        priceDisplay="R147"
        successPath="/survival-pack/success"
      />

      {/* HERO */}
      <section className="relative py-10 sm:py-16 md:py-24 px-4 overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={newManagerHero} alt="New manager coaching" className="w-full h-full object-cover object-top opacity-15" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-primary" />
        </div>

        <div className="container mx-auto max-w-3xl relative z-10">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Products</span>
          </Link>

          <div className="flex justify-center mb-4">
            <motion.span
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary-foreground text-primary"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🔥 MOST POPULAR
            </motion.span>
          </div>

          <h1 className="text-center mb-3">
            <span className="block text-2xl sm:text-4xl md:text-5xl font-serif text-white mb-1">3 Scripts. R147.</span>
            <span className="block text-xl sm:text-2xl md:text-3xl font-serif bg-gradient-to-r from-white via-primary-foreground to-white bg-clip-text text-transparent">Use Today. 🚀</span>
          </h1>

          <p className="text-center text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
            Plug-and-play conversation scripts for new managers. Open. Read. Use in your next meeting.
          </p>

          <div className="flex justify-center gap-4 mb-5">
            <span className="inline-flex items-center gap-1 text-xs text-white/80"><Zap className="w-3 h-3" /> Instant</span>
            <span className="inline-flex items-center gap-1 text-xs text-white/80"><Clock className="w-3 h-3" /> 2 min read</span>
            <span className="inline-flex items-center gap-1 text-xs text-white/80"><Download className="w-3 h-3" /> PDF</span>
          </div>

          <div className="text-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-3">
              R147
            </motion.div>
            <Button onClick={() => setCheckoutOpen(true)} size="lg" className="text-base font-bold w-full max-w-sm min-h-[56px] bg-primary-foreground text-primary hover:bg-white transition-all duration-300 hover:shadow-lg rounded-xl">
              GET INSTANT ACCESS →
            </Button>
            <p className="text-white/50 text-[11px] mt-3">✓ Secure checkout • ✓ Works on any device</p>
            <GuaranteeBadge />
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-10 sm:py-16 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-serif text-center mb-6 text-foreground">What's Inside</h2>

          <div className="space-y-3 sm:space-y-4">
            {scriptCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-card rounded-lg border border-border border-l-4 border-l-primary"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof Testimonials */}
          <div className="mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">What Managers Are Saying</p>
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-4 sm:p-5">
                <Quote className="w-5 h-5 text-primary/30 mb-2" />
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-3">"{t.quote}"</p>
                <p className="text-xs font-semibold text-foreground">
                  — {t.author}, <span className="text-muted-foreground font-normal">{t.industry}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Bonuses */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Also Included</p>
            {bonusItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 mb-2 last:mb-0">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-4 sm:py-6 px-4 bg-muted border-y border-border">
        <p className="text-center text-muted-foreground text-xs sm:text-sm font-medium">
          Built on 11 years of coaching across 3,000+ organizations
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="py-10 sm:py-16 px-4 bg-primary">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-xl sm:text-2xl font-serif text-white mb-3">Stop winging it. Start leading.</h2>
          <p className="text-white/70 text-sm mb-5">Your next conversation is too important to improvise.</p>
          <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">R147</div>
          <Button onClick={() => setCheckoutOpen(true)} size="lg" className="text-base font-bold w-full max-w-sm min-h-[56px] bg-primary-foreground text-primary hover:bg-white transition-all duration-300 hover:shadow-lg rounded-xl">
            GET INSTANT ACCESS →
          </Button>
          <p className="text-white/50 text-[11px] mt-3">✓ Secure checkout • ✓ Works on any device</p>
          <GuaranteeBadge />
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="py-10 sm:py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-lg sm:text-xl font-serif text-foreground mb-2">Not ready yet? Get the free checklist.</h2>
          <p className="text-sm text-muted-foreground mb-6">Download The First 90 Days Checklist for New Managers — free.</p>
          <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={submitting} className="whitespace-nowrap">
              {submitting ? "Sending..." : "Send Me The Checklist"}
            </Button>
          </form>
          <p className="text-muted-foreground text-[11px] mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-4 border-t bg-primary border-primary-foreground/20">
        <p className="text-center text-white/60 text-[11px] sm:text-sm">
          © 2026 Leadership by Design • 11 Years • 3,000+ Organizations • South Africa
        </p>
      </footer>
    </div>
  );
}
