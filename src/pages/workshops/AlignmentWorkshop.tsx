import { useState } from "react";
import { Link } from "react-router-dom";
import { Target, Clock, Users, CheckCircle, ArrowLeft, Calendar, Zap, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import WorkshopDownloadForm from "@/components/diagnostic/WorkshopDownloadForm";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { motion } from "framer-motion";
import heroImage from "@/assets/workshop-alignment-hero.jpg";
import motivationImage from "@/assets/workshop-motivation.jpg";
import leadershipImage from "@/assets/workshop-leadership.jpg";
export default function AlignmentWorkshop() {
  const [showDownloadForm, setShowDownloadForm] = useState(false);

  const outcomes = [
    {
      title: "Clear Priorities",
      description: "Walk away with a shared understanding of what matters most—and what doesn't."
    },
    {
      title: "Decision Clarity",
      description: "Establish clear criteria for making decisions so your team can move faster with confidence."
    },
    {
      title: "Aligned Expectations",
      description: "Ensure everyone understands what success looks like and how their work contributes to it."
    },
    {
      title: "Reduced Meeting Chaos",
      description: "Create frameworks that make meetings productive rather than circular."
    },
    {
      title: "Proactive Execution",
      description: "Shift from reactive firefighting to planned, purposeful work."
    },
    {
      title: "Unified Direction",
      description: "Eliminate conflicting messages and give your team one clear path forward."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Priority Mapping",
      description: "We surface everyone's understanding of current priorities and identify where they diverge."
    },
    {
      step: "02",
      title: "Success Definition",
      description: "Together, we define what success actually looks like—in specific, measurable terms."
    },
    {
      step: "03",
      title: "Decision Framework",
      description: "We establish clear criteria for making decisions, reducing the need for constant escalation."
    },
    {
      step: "04",
      title: "Communication Protocol",
      description: "We create simple protocols for how priorities and changes will be communicated going forward."
    }
  ];

  return (
    <>
      <SEO
        title="SHIFT Team Alignment Workshop | Leadership by Design"
        description="A morning workshop for teams working hard but not in the same direction. Address conflicting priorities, unclear success metrics, and reactive ways of working using the SHIFT Methodology™."
        canonicalUrl="https://leadershipbydesign.lovable.app/workshops/alignment"
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
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Morning workshop</span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  SHIFT Team Alignment Workshop
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  For teams working hard but not in the same direction. This workshop addresses conflicting 
                  priorities, unclear success metrics, and reactive ways of working.
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
                    alt="Team alignment workshop session"
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
                    Your team is busy. Everyone's working hard. But somehow, outcomes remain inconsistent. 
                    Different people have different ideas about what success looks like. Priorities shift 
                    frequently, and meetings create more questions than answers.
                  </p>
                  <p>
                    This isn't a motivation problem. It's an alignment problem. And more effort won't fix it—
                    only clarity will.
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
                    Leadership teams and cross-functional groups where effort is high but alignment is low. 
                    Ideal for teams experiencing frequent priority shifts, conflicting direction from different 
                    leaders, or a sense of "busy but not productive."
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
                Walk away with clarity, frameworks, and agreements that transform how your team works together.
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
                        <Target className="w-5 h-5 text-primary" />
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
                  
                  {/* Values Assessment */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Values Assessment</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every participant completes our proprietary Values Assessment before the workshop. 
                      This reveals individual and collective values, helping the team understand what 
                      drives decision-making and where values may be creating invisible friction.
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
                Ready to Align Your Team?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a call to discuss how the SHIFT Team Alignment Workshop can help your team move in the same direction.
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto bg-sky-50/50 dark:bg-sky-950/30 rounded-xl p-6 border border-sky-200/50 dark:border-sky-800/50"
            >
              <SocialShareButtons
                title="SHIFT Team Alignment Workshop | Get your team rowing in the same direction"
                description="A morning workshop for teams working hard but not in the same direction. Address conflicting priorities and unclear success metrics."
              />
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      
      <WorkshopDownloadForm
        open={showDownloadForm}
        onOpenChange={setShowDownloadForm}
        workshopKey="clarity"
      />
    </>
  );
}
