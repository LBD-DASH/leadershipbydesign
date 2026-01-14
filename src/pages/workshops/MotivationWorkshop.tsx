import { Link } from "react-router-dom";
import { Zap, Clock, Users, CheckCircle, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function MotivationWorkshop() {
  return (
    <>
      <SEO
        title="The Motivation & Energy Reset Workshop | Leadership by Design"
        description="A 90-minute workshop for teams that understand the work but lack energy and emotional commitment. Address fatigue, compliance without commitment, and unmet human needs."
        canonicalUrl="https://leadershipbydesign.lovable.app/workshops/motivation"
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
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>90 minutes</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              The Motivation & Energy Reset Workshop
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              For teams that understand the work but lack energy and emotional commitment. This workshop 
              addresses fatigue, compliance without commitment, and unmet human needs.
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
                  People do what's required, but rarely more. Energy in the team feels flat or forced. 
                  Good work goes unnoticed. There's a pervasive sense of "why bother" when extra effort 
                  is required.
                </p>
                <p>
                  This isn't about lazy people or poor performers. It's about disconnection—from meaning, 
                  from recognition, from the reasons why the work matters. And that can be fixed.
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
                  title: "Re-engagement",
                  description: "Reconnect your team to the purpose behind the work and why it matters."
                },
                {
                  title: "Meaning & Recognition",
                  description: "Create systems for acknowledging contributions and celebrating progress."
                },
                {
                  title: "Sustainable Energy",
                  description: "Build practices that maintain momentum without burning people out."
                },
                {
                  title: "Emotional Investment",
                  description: "Shift from compliance to genuine commitment and discretionary effort."
                },
                {
                  title: "Team Connection",
                  description: "Strengthen the human bonds that make teams resilient under pressure."
                },
                {
                  title: "Morale Resilience",
                  description: "Build a foundation that isn't easily shaken by setbacks or pressure."
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
                  title: "Energy Audit",
                  description: "We identify what's draining your team's energy and what (if anything) is currently energising them."
                },
                {
                  step: "02",
                  title: "Purpose Reconnection",
                  description: "We reconnect individuals and the team to the meaningful impact of their work."
                },
                {
                  step: "03",
                  title: "Recognition Design",
                  description: "We create practical, sustainable ways to acknowledge contributions that actually land."
                },
                {
                  step: "04",
                  title: "Sustainability Plan",
                  description: "We establish practices that protect energy over time, not just boost it temporarily."
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
                  Teams where people know what to do but lack the emotional energy or commitment to do 
                  it well. Ideal for groups experiencing fatigue, low morale, or a sense that effort 
                  goes unrecognised.
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
                Ready to Reignite Your Team's Energy?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a call to discuss how the Motivation & Energy Reset Workshop can help your team 
                rediscover their drive.
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
