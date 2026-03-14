import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle, Users, Target, Compass,
  MessageSquare, BarChart3, Calendar, Download, Building2,
  Briefcase, Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import StatsBar from "@/components/StatsBar";
import InterestModal from "@/components/shared/InterestModal";
import kevinPhoto from "@/assets/kevin-britz-facilitator.jpg";

const engagementTypes = [
  {
    icon: Users,
    title: "Workshop",
    duration: "1–2 days",
    description:
      "High-impact, in-person sessions that shift mindset and build skill in a single engagement. Ideal for team offsites, conferences, or leadership kickoffs.",
    outcomes: ["Immediate behaviour shifts", "Team alignment", "Shared leadership language"],
    investment: "From R15,000",
  },
  {
    icon: Compass,
    title: "Programme",
    duration: "4–12 weeks",
    description:
      "Structured development journeys with online learning, coaching, and applied projects. Built around the L1–L5 Leadership System and SHIFT Methodology™.",
    outcomes: ["Measurable capability uplift", "Sustained behaviour change", "ROI-linked outcomes"],
    investment: "From R25,000 per level",
  },
  {
    icon: Shield,
    title: "Retained Advisory",
    duration: "6–12 months",
    description:
      "Ongoing strategic partnership with embedded coaching, diagnostic cycles, and quarterly reviews. For organisations committed to systemic leadership transformation.",
    outcomes: ["Cultural transformation", "Succession pipeline", "Executive team alignment"],
    investment: "Custom pricing",
  },
];

const processSteps = [
  { icon: MessageSquare, title: "Discovery", description: "We listen deeply to understand your context, culture, and strategic priorities." },
  { icon: BarChart3, title: "Diagnosis", description: "We use proprietary diagnostics to identify the real leadership gaps — not just symptoms." },
  { icon: Target, title: "Design", description: "We craft a bespoke intervention strategy aligned to your budget, timelines, and outcomes." },
  { icon: Users, title: "Delivery", description: "We facilitate with energy, depth, and practical application. No death-by-PowerPoint." },
  { icon: CheckCircle, title: "Debrief", description: "We measure impact, share insights, and recommend next steps for sustained growth." },
];

const audiences = [
  "HR Directors & People Leaders",
  "Learning & Development Managers",
  "C-Suite & Executive Teams",
  "Procurement & Talent Teams",
  "Organisational Development Specialists",
];

export default function CorporateTraining() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SEO
        title="Corporate Leadership Training | Workshops & Programmes for Organisations"
        description="Bespoke corporate leadership training for HR Directors and L&D teams. Workshops, programmes, and retained advisory from Leadership by Design. 11 years, 4,000+ leaders, 30+ organisations."
        canonicalUrl="/corporate-training"
        keywords="corporate leadership training, leadership development for organisations, HR leadership programmes, L&D training South Africa, corporate workshops"
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.92) 0%, hsl(var(--primary) / 0.78) 100%), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80')`,
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 text-center">
            <div>
              <span className="inline-block bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
                For HR Directors & L&D Teams
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
                Leadership Development<br />That Delivers Measurable Results
              </h1>
              <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Bespoke workshops, structured programmes, and retained advisory designed for organisations that refuse to settle for generic training.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link to="https://calendar.app.google/seCHb5KB1PwGzJhQ6" target="_blank">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto">
                    Book a Discovery Call
                    <Calendar className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-primary-foreground hover:bg-white/10 rounded-full font-bold w-full sm:w-auto"
                  onClick={() => setModalOpen(true)}
                >
                  Download Capability Statement
                  <Download className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <StatsBar />

        {/* Who This Is For */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">Who This Is For</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {audiences.map((a) => (
                <span key={a} className="bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full border border-primary/20">
                  <Building2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Engagement Types */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">Three Ways to Engage</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                Every engagement is bespoke. Here's how most organisations start.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {engagementTypes.map((type, i) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.title}
                    className="bg-card rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-1">{type.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{type.duration}</p>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{type.description}</p>
                    <ul className="space-y-2 mb-5">
                      {type.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {o}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {type.investment}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">Our Process</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                A structured, proven approach that respects your time and delivers results.
              </p>
            </div>
            <div className="grid sm:grid-cols-5 gap-4">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Credibility */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden shadow-lg border-4 border-background">
                  <img src={kevinPhoto} alt="Kevin Britz" className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
              </div>
              <div className="md:col-span-3 text-center md:text-left">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3">Your Facilitator: Kevin Britz</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Business school faculty member, Master Practitioner in NLP & Time Line Therapy, and architect of the SHIFT Methodology™ and L1–L5 Leadership System. 750+ workshops. 4,000+ leaders developed across 30+ organisations including Discovery, FNB, and MIT Management School.
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

        {/* Final CTA */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Discuss Your Organisation's Needs?
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Every engagement starts with a 30-minute Discovery Call — no obligation, no pitch. Just a focused conversation about your people challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="https://calendar.app.google/seCHb5KB1PwGzJhQ6" target="_blank">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full font-bold group w-full sm:w-auto">
                  Book a Discovery Call
                  <Calendar className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/case-studies">
                <Button size="lg" variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10 rounded-full font-bold w-full sm:w-auto">
                  View Case Studies
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <InterestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        context="Corporate Training — Capability Statement Download"
      />
    </>
  );
}
