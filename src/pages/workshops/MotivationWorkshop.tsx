import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Clock, Users, CheckCircle, ArrowLeft, Calendar, Target, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import WorkshopDownloadForm from "@/components/diagnostic/WorkshopDownloadForm";
import heroImage from "@/assets/workshop-motivation-hero.jpg";
import alignmentImage from "@/assets/workshop-alignment.jpg";
import leadershipImage from "@/assets/workshop-leadership.jpg";

export default function MotivationWorkshop() {
  const [showDownloadForm, setShowDownloadForm] = useState(false);

  const outcomes = [
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
  ];

  const steps = [
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
  ];

  return (
    <>
      <SEO
        title="SHIFT Team Energy Workshop | Leadership by Design"
        description="A morning workshop for teams that understand the work but lack energy and emotional commitment. Address fatigue, compliance without commitment, and unmet human needs using the SHIFT Methodology™."
        canonicalUrl="https://leadershipbydesign.lovable.app/workshops/motivation"
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
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Morning workshop</span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  SHIFT Team Energy Workshop
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  For teams that understand the work but lack energy and emotional commitment. This workshop 
                  addresses fatigue, compliance without commitment, and unmet human needs.
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
                    alt="Energized team motivation workshop"
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
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  Who This Is For
                </h2>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Teams where people know what to do but lack the emotional energy or commitment to do 
                    it well. Ideal for groups experiencing fatigue, low morale, or a sense that effort 
                    goes unrecognised.
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
                Reignite your team's energy and create sustainable practices for long-term motivation.
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
                        <Zap className="w-5 h-5 text-primary" />
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
                  
                  {/* 6 Human Needs Assessment */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">6 Human Needs Assessment</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every participant completes our 6 Human Needs Assessment before the workshop. 
                      Based on proven psychological research, this reveals which of the six core human 
                      needs—Certainty, Variety, Significance, Connection, Growth, and Contribution—are 
                      being met or unmet for each team member.
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
                Explore Other Workshops
              </h2>
              <p className="text-muted-foreground">
                Discover more ways to transform your team's performance.
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
                to="/workshops/leadership" 
                className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={leadershipImage} 
                    alt="Leadership & Accountability Reset Workshop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Morning workshop</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Leadership & Accountability Reset
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    For capable teams where ownership is inconsistent and decisions get stuck.
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
                Ready to Reignite Your Team's Energy?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a call to discuss how the SHIFT Team Energy Workshop can help your team 
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
      
      <WorkshopDownloadForm
        open={showDownloadForm}
        onOpenChange={setShowDownloadForm}
        workshopKey="motivation"
      />
    </>
  );
}
