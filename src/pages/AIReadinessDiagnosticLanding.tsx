import { Link } from "react-router-dom";
import { ArrowRight, Bot, Brain, Shield, Users, Sparkles, CheckCircle, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function AIReadinessDiagnosticLanding() {
  const reasons = [
    {
      icon: Bot,
      title: "Understand Your AI Leadership Gap",
      description: "Get clarity on where your AI leadership capabilities stand today—and what needs development to lead effectively in an AI-augmented world.",
    },
    {
      icon: Brain,
      title: "Discover Your Human Edge",
      description: "AI is changing work—but human skills matter more than ever. Learn which SHIFT skills will give you the edge AI cannot replicate.",
    },
    {
      icon: Shield,
      title: "Get Actionable Recommendations",
      description: "Receive a personalised development path including specific programmes, workshops, and focus areas tailored to your assessment results.",
    },
  ];

  const categories = [
    { icon: Bot, title: "AI Awareness", description: "Understanding capabilities and limitations" },
    { icon: Users, title: "Human-AI Collaboration", description: "Working effectively WITH AI" },
    { icon: Sparkles, title: "Change Readiness", description: "Preparing teams for AI adoption" },
    { icon: Shield, title: "Ethical AI Leadership", description: "POPI Act compliance and responsible use" },
    { icon: Brain, title: "Human Skills Investment", description: "Developing the skills AI cannot replace" },
  ];

  return (
    <>
      <SEO
        title="AI Leadership Readiness Diagnostic | Leadership by Design"
        description="Assess your AI leadership capabilities. Discover your readiness to lead in an AI-augmented workplace and get personalised development recommendations."
        canonicalUrl="/ai-readiness"
      />
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Bot className="w-4 h-4" />
                <span>Leadership Capability Diagnostic (AI-Ready)</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Are You Ready to Lead in the{" "}
                <span className="text-primary">AI Era?</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                AI is transforming the workplace—but the leaders who thrive will be those who strengthen their <strong className="text-foreground">human edge</strong>. Take this 5-minute assessment to discover your AI leadership readiness.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild>
                  <Link to="/ai-readiness-diagnostic">
                    Start Your Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>5 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>20 questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Reasons Section */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why Take This Diagnostic?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {reasons.map((reason, index) => (
                <Card key={index} className="bg-background border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                      <reason.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {reason.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Measure */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Five Dimensions of AI Leadership
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                This diagnostic assesses your readiness across five critical dimensions that determine AI leadership effectiveness.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  className="p-4 bg-background rounded-xl border border-border text-center hover:border-primary/30 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-3">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {category.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHIFT Connection */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Built on the SHIFT Methodology
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                AI readiness isn't just about technology—it's about strengthening the human skills AI cannot replicate. This diagnostic connects to the five SHIFT skills that give leaders their edge.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['Self-Management', 'Human Intelligence', 'Innovation', 'Focus', 'Thinking'].map((skill) => (
                  <div 
                    key={skill}
                    className="px-4 py-2 bg-background rounded-full border border-primary/20 text-sm font-medium text-foreground"
                  >
                    <span className="text-primary font-bold mr-1">{skill[0]}</span>
                    {skill.slice(1)}
                  </div>
                ))}
              </div>
              <Button variant="outline" asChild>
                <Link to="/shift-methodology">
                  Learn about SHIFT Methodology
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Ready to Assess Your AI Leadership?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Take 5 minutes to discover your AI readiness score, identify development priorities, and get a personalised recommendation path.
              </p>
              <Button size="lg" asChild>
                <Link to="/ai-readiness-diagnostic">
                  Start Your Assessment Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
