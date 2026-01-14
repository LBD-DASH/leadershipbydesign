import { Link } from "react-router-dom";
import { Shield, Clock, Users, CheckCircle, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import heroImage from "@/assets/workshop-leadership-hero.jpg";

export default function LeadershipWorkshop() {
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
        title="The Leadership & Accountability Reset Workshop | Leadership by Design"
        description="A morning workshop for capable teams where ownership is inconsistent. Address delayed decisions, avoided conversations, and dependency on authority."
        canonicalUrl="https://leadershipbydesign.lovable.app/workshops/leadership"
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
                  The Leadership & Accountability Reset Workshop
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
                What You'll Achieve
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Build leadership capability and accountability structures that stick.
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
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to Strengthen Leadership & Accountability?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a call to discuss how the Leadership & Accountability Reset Workshop can help your 
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
      </main>
      <Footer />
    </>
  );
}
