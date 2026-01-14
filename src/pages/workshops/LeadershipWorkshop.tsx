import { Link } from "react-router-dom";
import { Users, Clock, CheckCircle, ArrowLeft, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function LeadershipWorkshop() {
  return (
    <>
      <SEO
        title="The Leadership & Accountability Reset Workshop | Leadership by Design"
        description="A 90-minute workshop for capable teams where ownership is inconsistent. Address delayed decisions, avoided conversations, and dependency on authority."
        canonicalUrl="https://leadershipbydesign.lovable.app/workshops/leadership"
      />
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <Link 
              to="/team-diagnostic" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Diagnostic
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>Morning workshop</span>
            </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              The Leadership & Accountability Reset Workshop
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              For capable teams where ownership is inconsistent. This workshop addresses delayed decisions, 
              avoided conversations, and dependency on authority.
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                The Problem This Workshop Solves
              </h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
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
          </div>
        </section>

        {/* What You'll Achieve Section */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10">
              What You'll Achieve
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
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
              ].map((outcome, index) => (
                <div key={index} className="bg-background rounded-xl p-6 border border-border">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{outcome.title}</h3>
                      <p className="text-sm text-muted-foreground">{outcome.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10">
              How It Works
            </h2>
            <div className="max-w-3xl space-y-8">
              {[
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
              ].map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="text-4xl font-bold text-primary/20">{step.step}</div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Who This Workshop Is For
              </h2>
              <div className="flex items-start gap-4 mb-6">
                <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-lg text-muted-foreground">
                  Capable teams where ownership is inconsistent and decisions get stuck. Ideal for 
                  organisations where leaders avoid difficult conversations, performance issues are 
                  tolerated too long, or people wait for permission rather than taking initiative.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
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
