import { Link } from "react-router-dom";
import { Target, Clock, Users, CheckCircle, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function AlignmentWorkshop() {
  return (
    <>
      <SEO
        title="The Alignment Reset Workshop | Leadership by Design"
        description="A 90-minute workshop for teams working hard but not in the same direction. Address conflicting priorities, unclear success metrics, and reactive ways of working."
        canonicalUrl="https://leadershipbydesign.lovable.app/workshops/alignment"
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
                <Target className="w-8 h-8 text-primary" />
              </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>Morning workshop</span>
            </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              The Alignment Reset Workshop
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              For teams working hard but not in the same direction. This workshop addresses conflicting 
              priorities, unclear success metrics, and reactive ways of working.
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
                  Leadership teams and cross-functional groups where effort is high but alignment is low. 
                  Ideal for teams experiencing frequent priority shifts, conflicting direction from different 
                  leaders, or a sense of "busy but not productive."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Includes Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                What's Included
              </h2>
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Values Assessment</h3>
                    <p className="text-muted-foreground">
                      Every participant completes our proprietary Values Assessment before the workshop. 
                      This reveals individual and collective values, helping the team understand what 
                      drives decision-making and where values may be creating invisible friction. 
                      The assessment forms the foundation for meaningful alignment conversations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to Align Your Team?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a call to discuss how the Alignment Reset Workshop can help your team move in the same direction.
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
