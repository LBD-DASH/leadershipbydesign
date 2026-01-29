import { Link } from "react-router-dom";
import { ArrowRight, Target, Zap, Shield, CheckCircle, Brain, Users, Lightbulb, Focus, Cog, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import shiftLogo from "@/assets/shift-logo.jpg";
import heroTeamImage from "@/assets/shift-hero-team.jpg";
import methodologyPlanningImage from "@/assets/shift-methodology-planning.jpg";
import teamOwnershipImage from "@/assets/shift-team-ownership.jpg";
import skillSelfManagement from "@/assets/shift-skill-self-management.jpg";
import skillHumanIntelligence from "@/assets/shift-skill-human-intelligence.jpg";
import skillInnovation from "@/assets/shift-skill-innovation.jpg";
import skillFocus from "@/assets/shift-skill-focus.jpg";
import skillThinking from "@/assets/shift-skill-thinking.jpg";

export default function ShiftMethodology() {
  const shiftSkills = [
    {
      letter: "S",
      title: "Self-Management",
      description: "The ability to regulate emotions, behaviour, and energy. Taking responsibility for how you show up—regardless of circumstances.",
      icon: Cog,
      image: skillSelfManagement
    },
    {
      letter: "H",
      title: "Human Intelligence",
      description: "The ability to read, connect with, and influence others. Understanding needs, values, and what drives behaviour—in yourself and others.",
      icon: Users,
      image: skillHumanIntelligence
    },
    {
      letter: "I",
      title: "Innovation",
      description: "The ability to think beyond the obvious. Taking initiative, questioning assumptions, and finding better ways forward.",
      icon: Lightbulb,
      image: skillInnovation
    },
    {
      letter: "F",
      title: "Focus",
      description: "The ability to prioritise what matters. Cutting through noise, aligning effort to outcomes, and staying on track under pressure.",
      icon: Focus,
      image: skillFocus
    },
    {
      letter: "T",
      title: "Thinking",
      description: "The ability to make clear, independent decisions. Understanding context, weighing options, and taking ownership of conclusions.",
      icon: Brain,
      image: skillThinking
    }
  ];

  const workshops = [
    {
      key: "alignment",
      title: "SHIFT Team Alignment",
      primaryOutcome: "Clarity, cohesion, and direction",
      skillsActivated: [
        { skill: "Thinking", detail: "shared understanding, decision clarity" },
        { skill: "Focus", detail: "priorities, alignment to outcomes" },
        { skill: "Human Intelligence", detail: "values, trust, psychological safety" }
      ],
      tools: ["Values Assessment", "Alignment diagnostics"],
      result: "People stop working hard in different directions.",
      icon: Target,
      link: "/workshops/alignment"
    },
    {
      key: "energy",
      title: "SHIFT Team Energy",
      primaryOutcome: "Sustainable motivation and emotional regulation",
      skillsActivated: [
        { skill: "Self-Management", detail: "emotional awareness & regulation" },
        { skill: "Human Intelligence", detail: "needs-awareness (self & others)" },
        { skill: "Focus", detail: "reducing reactive behaviour" }
      ],
      tools: ["6 Human Needs Assessment"],
      result: "Energy moves from reactive and draining → intentional and constructive.",
      icon: Zap,
      link: "/workshops/motivation"
    },
    {
      key: "ownership",
      title: "SHIFT Team Ownership",
      primaryOutcome: "Accountability and leadership at every level",
      skillsActivated: [
        { skill: "Self-Management", detail: "responsibility for behaviour and outcomes" },
        { skill: "Thinking", detail: "independent decision-making" },
        { skill: "Innovation", detail: "initiative instead of permission-seeking" }
      ],
      tools: ["Leadership Index"],
      result: "Leaders stop carrying people. People start carrying outcomes.",
      icon: Shield,
      link: "/workshops/leadership"
    }
  ];

  const whatShiftIs = [
    { label: "Capability", contrast: "not character" },
    { label: "Skill", contrast: "not motivation" },
    { label: "Responsibility", contrast: "not compliance" }
  ];

  return (
    <>
      <SEO
        title="SHIFT Methodology™ | Leadership by Design"
        description="The SHIFT Methodology™ develops the five human skills required for performance: Self-Management, Human Intelligence, Innovation, Focus, and Thinking."
        canonicalUrl="/shift-methodology"
      />
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative">
          {/* Hero Image Background */}
          <div className="absolute inset-0 h-[500px] sm:h-[600px]">
            <img 
              src={heroTeamImage} 
              alt="Leadership team collaboration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          </div>
          
          <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <Link 
              to="/programmes" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programmes
            </Link>
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <span>A Human Performance System</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                The SHIFT<br />
                <span className="text-primary">Methodology™</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
                SHIFT is a skill-based methodology—not a personality model, motivation framework, or leadership style.
              </p>
              
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                It defines the <strong className="text-foreground">five core human capabilities</strong> required to perform, lead, and adapt in the modern workplace—especially in an AI-accelerated world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/shift-diagnostic">
                    Take the SHIFT Diagnostic
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-background/80 backdrop-blur-sm">
                  <Link to="/contact">
                    Book a Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* One-Sentence Truth */}
        <section className="py-12 sm:py-16 bg-primary/5 border-y border-primary/20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed">
                "The SHIFT Methodology™ develops the <span className="text-primary">five human skills</span> required for performance, and applies them through three focused interventions: <span className="text-primary">Alignment</span>, <span className="text-primary">Energy</span>, and <span className="text-primary">Ownership</span>."
              </p>
            </div>
          </div>
        </section>

        {/* What SHIFT Is */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Image */}
              <div className="order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={methodologyPlanningImage} 
                    alt="Strategic planning and methodology"
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  What the SHIFT Methodology™ Is
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  The SHIFT Methodology™ is a human performance system that develops the five critical skills that determine:
                </p>
                
                <div className="space-y-3 mb-8">
                  {[
                    "How people show up",
                    "How they work with others",
                    "How they make decisions",
                    "How they respond under pressure",
                    "How much responsibility they take"
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* SHIFT Focus Statement */}
            <div className="max-w-4xl mx-auto mt-16">
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-8 border border-border">
                <p className="text-center text-muted-foreground mb-6">
                  SHIFT works <strong className="text-foreground">below behaviour</strong> (habits) and <strong className="text-foreground">above personality</strong> (labels).
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {whatShiftIs.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-background rounded-xl px-6 py-4 border border-primary/20"
                    >
                      <span className="text-lg font-semibold text-primary">{item.label}</span>
                      <span className="text-muted-foreground">, {item.contrast}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center mt-8 text-lg font-medium text-foreground">
                  SHIFT answers one core question:<br />
                  <span className="text-primary">"Which human skills must strengthen for results to improve?"</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Five SHIFT Skills */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                The Five SHIFT™ Skills
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The core human capabilities required for performance, leadership, and adaptation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {shiftSkills.map((skill) => (
                <div 
                  key={skill.letter}
                  className="bg-background rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={skill.image} 
                        alt={skill.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-primary/50 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-foreground">
                          {skill.letter}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-foreground">
                        {skill.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How SHIFT Supports the 3 Workshops */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How SHIFT Powers the Workshops
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                The three workshops are <strong className="text-foreground">NOT</strong> three different methodologies. They are three <strong className="text-foreground">outcome-focused applications</strong> of the same SHIFT skill set.
              </p>
              <div className="inline-flex items-center gap-4 bg-muted/50 rounded-xl px-6 py-4 border border-border">
                <span className="text-foreground font-medium">SHIFT = the skill system</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-foreground font-medium">Workshops = where those skills are applied</span>
              </div>
            </div>
            
            <div className="space-y-8 max-w-5xl mx-auto">
              {workshops.map((workshop) => (
                <div 
                  key={workshop.key}
                  className="bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Header */}
                      <div className="lg:w-1/3">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <workshop.icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                          {workshop.title}
                        </h3>
                        <p className="text-primary font-medium mb-4">
                          Primary Outcome: {workshop.primaryOutcome}
                        </p>
                        <Link 
                          to={workshop.link}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Learn more about this workshop
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                      
                      {/* Skills & Details */}
                      <div className="lg:w-2/3 lg:border-l lg:border-border lg:pl-6">
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            SHIFT Skills Activated
                          </h4>
                          <div className="space-y-2">
                            {workshop.skillsActivated.map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                <span className="text-foreground">
                                  <strong>{item.skill}</strong>
                                  <span className="text-muted-foreground"> → {item.detail}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              Tools Used
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {workshop.tools.map((tool, index) => (
                                <span 
                                  key={index}
                                  className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="sm:flex-grow">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              Result
                            </h4>
                            <p className="text-foreground font-medium italic">
                              "{workshop.result}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value to Diagnostic */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Content */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  How SHIFT Adds Value to the Team Diagnostic
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  The Team Diagnostic identifies which SHIFT skills need strengthening in your team.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-background rounded-2xl p-5 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Alignment Issues?</h3>
                        <p className="text-sm text-muted-foreground">
                          Indicates need to develop <strong className="text-foreground">Thinking</strong>, <strong className="text-foreground">Focus</strong>, and <strong className="text-foreground">Human Intelligence</strong> skills.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-2xl p-5 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Energy Issues?</h3>
                        <p className="text-sm text-muted-foreground">
                          Indicates need to develop <strong className="text-foreground">Self-Management</strong>, <strong className="text-foreground">Human Intelligence</strong>, and <strong className="text-foreground">Focus</strong> skills.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-2xl p-5 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Ownership Issues?</h3>
                        <p className="text-sm text-muted-foreground">
                          Indicates need to develop <strong className="text-foreground">Self-Management</strong>, <strong className="text-foreground">Thinking</strong>, and <strong className="text-foreground">Innovation</strong> skills.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link to="/team-diagnostic">
                      Take the Free Team Diagnostic
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Image */}
              <div className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={teamOwnershipImage} 
                    alt="Professional leadership team"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
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
                Start with our free Team Diagnostic to understand which SHIFT skills your team needs to develop, 
                or book a consultation to discuss how we can help.
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