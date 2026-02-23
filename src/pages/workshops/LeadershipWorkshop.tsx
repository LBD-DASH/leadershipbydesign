import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, Users, CheckCircle, ArrowLeft, Calendar, Target, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { EventSchema, BreadcrumbSchema } from "@/components/StructuredData";
import WorkshopDownloadForm from "@/components/diagnostic/WorkshopDownloadForm";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { motion } from "framer-motion";
import heroImage from "@/assets/workshop-leadership-hero.jpg";
import alignmentImage from "@/assets/workshop-alignment.jpg";
import motivationImage from "@/assets/workshop-motivation.jpg";

export default function LeadershipWorkshop() {
  const [showDownloadForm, setShowDownloadForm] = useState(false);

  const outcomes = [
    {
      title: "Clear Ownership",
      description: "Define who owns what, so accountability is never in question."
    },
    {
      title: "Faster Decisions",
      description: "Empower team members to make decisions at the appropriate level."
    },
    {
      title: "Stronger Leadership Behaviour",
      description: "Build the confidence and skills to lead conversations and outcomes."
    },
    {
      title: "Difficult Conversations",
      description: "Equip leaders to have the conversations they've been avoiding."
    },
    {
      title: "Reduced Dependency",
      description: "Free senior leaders from decisions that should be made elsewhere."
    },
    {
      title: "Performance Standards",
      description: "Establish clear expectations and address underperformance promptly."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Ownership Mapping",
      description: "We clarify who owns what decisions and outcomes, eliminating ambiguity."
    },
    {
      step: "02",
      title: "Decision Rights",
      description: "We establish clear frameworks for what decisions can be made at each level."
    },
    {
      step: "03",
      title: "Conversation Practice",
      description: "We practice the difficult conversations that have been avoided, building confidence."
    },
    {
      step: "04",
      title: "Accountability Agreements",
      description: "We create explicit agreements about how accountability will be maintained going forward."
    }
  ];

  return (
    <>
      <SEO
        title="SHIFT Team Ownership Workshop | Accountability & Leadership | Leadership by Design"
        description="A half-day workshop for capable teams where ownership is inconsistent. Build accountability, faster decisions, and leadership behaviour using the SHIFT Methodology™."
        canonicalUrl="/workshops/leadership"
        ogImage="https://leadershipbydesign.co/og-workshop-leadership.jpg"
        keywords="team accountability workshop, team ownership, leadership development workshop, SHIFT methodology, decision-making, team leadership"
      />
      <EventSchema
        name="SHIFT Team Ownership Workshop"
        description="A morning workshop for capable teams where ownership is inconsistent and decisions get stuck. Build accountability and leadership behaviour."
        url="/workshops/leadership"
        duration="PT4H"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Workshops", url: "/programmes" },
          { name: "Team Ownership", url: "/workshops/leadership" },
        ]}
      />
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <Link 
              to="/team-diagnostic" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Diagnostic
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content */}
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Morning workshop</span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  SHIFT Team Ownership Workshop
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  For capable teams where ownership is inconsistent. This workshop addresses delayed decisions, 
                  avoided conversations, and dependency on authority.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link to="/contact">
                      <Calendar className="w-5 h-5 mr-2" />
                      Book a Consultation
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setShowDownloadForm(true)}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Overview
                  </Button>
                </div>
              </div>
              
              {/* Image */}
              <div className="order-1 lg:order-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={heroImage} 
                    alt="Leadership accountability workshop session"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem + Who It's For */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  The Problem This Solves
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Difficult conversations get avoided or postponed. Decisions that could be made within 
                    the team get escalated upward. When things go wrong, accountability is unclear. People 
                    wait for permission rather than taking initiative.
                  </p>
                  <p>
                    This isn't about having the wrong people. It's about unclear ownership and underdeveloped 
                    leadership muscles. And these can be strengthened.
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  Who This Is For
                </h2>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Capable teams where ownership is inconsistent and decisions get stuck. Ideal for 
                    organisations where leaders avoid difficult conversations, performance issues are 
                    tolerated too long, or people wait for permission rather than taking initiative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Achieve */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Leadership Outcomes You'll Achieve
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Develop stronger leadership behaviours, build accountability, and create leaders at every level.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {outcomes.map((outcome, index) => (
                <div 
                  key={index} 
                  className="bg-background rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{outcome.title}</h3>
                      <p className="text-sm text-muted-foreground">{outcome.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works + Includes */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* How It Works */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
                  How It Works
                </h2>
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{step.step}</span>
                      </div>
                      <div className="pt-2">
                        <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
                  What's Included
                </h2>
                <div className="space-y-4">
                  {/* SHIFT Methodology */}
                  <Link 
                    to="/shift-methodology"
                    className="block bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6 border border-primary/30 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/30">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">SHIFT Methodology™</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Our proprietary SHIFT Methodology™ is the foundation of every workshop. This proven 
                      framework creates lasting transformation by addressing root causes, not just symptoms. 
                      It's what makes our workshops deliver sustainable change, not temporary fixes.
                    </p>
                    <span className="text-sm font-medium text-primary">Learn more about SHIFT →</span>
                  </Link>
                  
                  {/* Leadership Index */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Leadership Index</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every participant completes our Leadership Index assessment before the workshop. 
                      This comprehensive tool measures key leadership behaviours including decision-making 
                      confidence, accountability ownership, difficult conversation readiness, and initiative 
                      taking. Results provide a baseline for development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Workshops */}
        <section className="py-16 sm:py-20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Explore Other Leadership Workshops
              </h2>
              <p className="text-muted-foreground">
                Discover more ways to develop leadership capability and drive team performance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Link 
                to="/workshops/alignment" 
                className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={alignmentImage} 
                    alt="Alignment Reset Workshop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Morning workshop</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    The Alignment Reset
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    For teams working hard but not in the same direction.
                  </p>
                </div>
              </Link>
              
              <Link 
                to="/workshops/motivation" 
                className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={motivationImage} 
                    alt="Motivation & Energy Reset Workshop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Morning workshop</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Motivation & Energy Reset
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    For teams that understand the work but lack energy and emotional commitment.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to Strengthen Team Ownership?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a call to discuss how the SHIFT Team Ownership Workshop can help your 
                team take ownership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Consultation
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/team-diagnostic">
                    Take the Diagnostic First
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Share Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div
              className="max-w-2xl mx-auto bg-sky-50/50 dark:bg-sky-950/30 rounded-xl p-6 border border-sky-200/50 dark:border-sky-800/50"
            >
              <SocialShareButtons
                title="SHIFT Team Ownership Workshop | Build accountability and ownership"
                description="A morning workshop for capable teams where ownership is inconsistent and decisions get stuck."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <WorkshopDownloadForm
        open={showDownloadForm}
        onOpenChange={setShowDownloadForm}
        workshopKey="leadership"
      />
    </>
  );
}
