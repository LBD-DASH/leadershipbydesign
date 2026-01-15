import { Link } from "react-router-dom";
import { ArrowRight, Target, Zap, Shield, CheckCircle, Lightbulb, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import shiftLogo from "@/assets/shift-logo.jpg";

export default function ShiftMethodology() {
  const shiftSteps = [
    {
      letter: "S",
      title: "See",
      description: "Surface the current reality. We help teams see clearly what's actually happening—not what they assume or hope is true.",
      detail: "Through diagnostic tools and facilitated conversations, we uncover the hidden patterns, unspoken tensions, and systemic issues that are holding your team back."
    },
    {
      letter: "H",
      title: "Hear",
      description: "Listen to what's not being said. The most important information is often in the silences and the avoided topics.",
      detail: "We create safe spaces for honest dialogue, helping teams surface the conversations they've been avoiding and the concerns that haven't been voiced."
    },
    {
      letter: "I",
      title: "Identify",
      description: "Pinpoint the root causes. Symptoms are easy to see; causes require deeper investigation.",
      detail: "We move beyond surface-level problems to identify the underlying beliefs, structures, and behaviours that are creating the issues your team faces."
    },
    {
      letter: "F",
      title: "Frame",
      description: "Reframe the challenge. How you see the problem determines what solutions become possible.",
      detail: "We help teams shift their perspective from blame and limitation to ownership and possibility, opening up new paths forward."
    },
    {
      letter: "T",
      title: "Transform",
      description: "Take action that sticks. Real change requires new behaviours, not just new intentions.",
      detail: "We establish concrete commitments, accountability structures, and follow-through mechanisms that turn insights into lasting transformation."
    }
  ];

  const differentiators = [
    {
      icon: Lightbulb,
      title: "Root Cause Focus",
      description: "We address underlying issues, not just symptoms. This creates lasting change rather than temporary relief."
    },
    {
      icon: Users,
      title: "Team-Centred",
      description: "Solutions emerge from within the team, not from external prescription. This builds ownership and commitment."
    },
    {
      icon: TrendingUp,
      title: "Sustainable Results",
      description: "Our approach creates new capabilities, not just quick fixes. Teams continue to improve long after the workshop ends."
    }
  ];

  const workshops = [
    {
      key: "alignment",
      title: "SHIFT Team Alignment",
      description: "For teams working hard but not in the same direction.",
      icon: Target,
      link: "/workshops/alignment"
    },
    {
      key: "energy",
      title: "SHIFT Team Energy",
      description: "For teams that understand the work but lack energy and commitment.",
      icon: Zap,
      link: "/workshops/motivation"
    },
    {
      key: "ownership",
      title: "SHIFT Team Ownership",
      description: "For capable teams where ownership is inconsistent.",
      icon: Shield,
      link: "/workshops/leadership"
    }
  ];

  return (
    <>
      <SEO
        title="SHIFT Methodology™ | Leadership by Design"
        description="Discover the SHIFT Methodology™—our proprietary framework for creating lasting team transformation. See, Hear, Identify, Frame, Transform."
        canonicalUrl="https://leadershipbydesign.lovable.app/shift-methodology"
      />
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <Link 
              to="/programmes" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programmes
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span>Our Proprietary Framework</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  The SHIFT<br />
                  <span className="text-primary">Methodology™</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                  A proven framework for creating lasting team transformation. Not a quick fix—a 
                  fundamental shift in how your team operates, communicates, and delivers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/team-diagnostic">
                      Take the Team Diagnostic
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/contact">
                      Book a Consultation
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
                  <img 
                    src={shiftLogo} 
                    alt="SHIFT Methodology"
                    className="relative w-64 h-64 sm:w-80 sm:h-80 object-contain rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-16 sm:py-20 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Why Most Team Interventions Fail
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Traditional team-building events create a temporary boost, then reality returns. 
                One-size-fits-all training programs address symptoms, not causes. Generic frameworks 
                get applied without understanding the unique dynamics at play.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong className="text-foreground">The SHIFT Methodology™ is different.</strong> It's designed to 
                create permanent change by addressing what's actually happening in your team—not what 
                we assume is happening.
              </p>
            </div>
          </div>
        </section>

        {/* SHIFT Steps */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                The Five Stages of SHIFT
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each stage builds on the previous, creating a comprehensive transformation process.
              </p>
            </div>
            
            <div className="space-y-8 max-w-4xl mx-auto">
              {shiftSteps.map((step, index) => (
                <div 
                  key={step.letter}
                  className="relative flex gap-6 sm:gap-8 p-6 sm:p-8 bg-gradient-to-r from-muted/50 to-transparent rounded-2xl border border-border hover:border-primary/30 transition-colors"
                >
                  {/* Letter */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                      <span className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                        {step.letter}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg text-foreground/90 mb-3">
                      {step.description}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                  
                  {/* Connector line */}
                  {index < shiftSteps.length - 1 && (
                    <div className="absolute left-[2.5rem] sm:left-[3rem] top-full w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes It Different */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                What Makes SHIFT™ Different
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our methodology is designed for sustainable transformation, not temporary improvement.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {differentiators.map((item, index) => (
                <div 
                  key={index}
                  className="bg-background rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Apply SHIFT */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                SHIFT™ in Action
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We apply the SHIFT Methodology™ across three focused workshops, each addressing 
                different team challenges.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {workshops.map((workshop) => (
                <Link 
                  key={workshop.key}
                  to={workshop.link}
                  className="group bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <workshop.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {workshop.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {workshop.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Expected Outcomes */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  What Teams Experience
                </h2>
                <p className="text-muted-foreground">
                  Teams that go through a SHIFT workshop consistently report these outcomes.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Clearer understanding of priorities and expectations",
                  "More honest and productive conversations",
                  "Faster decision-making with less escalation",
                  "Stronger sense of ownership and accountability",
                  "Improved team energy and engagement",
                  "Sustainable behaviour change, not just temporary motivation"
                ].map((outcome, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border"
                  >
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to SHIFT Your Team?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start with our free Team Diagnostic to understand where your team needs the most support, 
                or book a consultation to discuss how SHIFT can work for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/team-diagnostic">
                    Take the Free Diagnostic
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">
                    Book a Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}