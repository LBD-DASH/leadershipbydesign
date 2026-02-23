import { Link } from "react-router-dom";
import { ArrowRight, Search, Users, Presentation, Crown, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const tiers = [
  {
    icon: Search,
    tier: "TIER 1 — Entry (Free)",
    title: "Diagnose First",
    description: "Start with one of our free 5-minute diagnostics to identify the exact intervention your team or leadership needs.",
    cta: "Explore Diagnostics",
    link: "/leadership-diagnostic",
    highlight: false,
  },
  {
    icon: Users,
    tier: "TIER 2 — Group Programmes",
    title: "SHIFT Group Programmes",
    description: "Cohort-based leadership development programmes delivered online and in-person. Sold as organisational licences with minimum cohort sizes.",
    cta: "View Programmes",
    link: "/programmes",
    highlight: false,
  },
  {
    icon: Presentation,
    tier: "TIER 3 — Workshops",
    title: "Leadership Workshops",
    description: "High-impact 1–2 day in-person workshops that deliver measurable organisational outcomes, not just training days.",
    cta: "Explore Workshops",
    link: "/programmes",
    highlight: false,
  },
  {
    icon: Crown,
    tier: "TIER 4 — Premium Coaching",
    title: "Contagious Identity Coaching",
    description: "A 12-month strategic leadership partnership for senior executives who want their identity to become their most powerful leadership tool.",
    cta: "Learn More",
    link: "/contagious-identity",
    highlight: false,
  },
  {
    icon: Award,
    tier: "TIER 5 — Certification & Licensing",
    title: "SHIFT Certified Facilitator Programme",
    description: "Become accredited to deliver SHIFT methodology inside your organisation. The first cohort opens mid-2026.",
    cta: "Apply Now",
    link: "/shift-certified",
    badge: "NOW OPEN — Join the Waitlist",
    highlight: true,
  },
  {
    icon: Shield,
    tier: "TIER 6 — Retainer Advisory",
    title: "Leadership Advisory Retainer",
    description: "A monthly retained relationship where Kevin serves as strategic thinking partner to your CEO or CHRO. Limited to 6 clients.",
    cta: "Enquire",
    link: "/contact",
    badge: "By Application Only",
    highlight: false,
  },
];

export default function Services() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            How We Work With You
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From free diagnostics to retained advisory — choose the engagement level that matches your organisation's needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative bg-card rounded-lg p-8 border ${
                  tier.highlight
                    ? "border-accent shadow-lg ring-1 ring-accent/20"
                    : "border-border"
                } flex flex-col h-full`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-6 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded">
                    {tier.badge}
                  </span>
                )}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {tier.tier}
                </p>
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{tier.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">{tier.description}</p>
                <Link to={tier.link}>
                  <Button
                    variant={tier.highlight ? "default" : "outline"}
                    className={`w-full ${
                      tier.highlight
                        ? "bg-accent text-accent-foreground hover:opacity-90"
                        : ""
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
