import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lightbulb, Target, Users, MessageSquare } from "lucide-react";

const programmesData = {
  "bespoke-programme-design": {
    title: "Bespoke Programme Design",
    subtitle: "Custom-built solutions tailored to your unique challenges",
    description: "We design customized leadership development programmes that align perfectly with your organization's culture, challenges, and strategic goals.",
    duration: "Flexible (3-12 months)",
    format: "Tailored to Your Needs",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    icon: Lightbulb,
    whatYouLearn: [
      "Solutions designed specifically for your organizational context",
      "Integration of your company values and strategic objectives",
      "Flexible delivery formats: workshops, coaching, or blended approaches",
      "Custom frameworks and tools for your unique challenges",
      "Ongoing support and programme iteration based on feedback",
      "Measurable outcomes aligned with your business goals"
    ],
    idealFor: "Organizations seeking tailored leadership development, companies with specific cultural or strategic needs, teams requiring customized solutions"
  },
  "strategic-leadership-development": {
    title: "Strategic Leadership Development",
    subtitle: "Elevate your leadership impact at the executive level",
    description: "An intensive programme for senior leaders focused on strategic thinking, organizational vision, and driving transformation.",
    duration: "12 weeks",
    format: "In-person & Coaching Sessions",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    icon: Target,
    whatYouLearn: [
      "Advanced strategic thinking and decision-making frameworks",
      "Leading organizational change and transformation initiatives",
      "Building and communicating a compelling vision",
      "Navigating complexity and ambiguity at the executive level",
      "Developing high-performing leadership teams",
      "Balancing short-term results with long-term strategic goals"
    ],
    idealFor: "Senior executives, C-suite leaders, directors preparing for executive roles, leaders driving major organizational change"
  },
  "team-effectiveness-workshops": {
    title: "Team Effectiveness Workshops",
    subtitle: "Transform your team into a high-performing unit",
    description: "Interactive workshops designed to improve team dynamics, collaboration, and collective performance.",
    duration: "1-2 days",
    format: "In-person Workshop",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    icon: Users,
    whatYouLearn: [
      "Building trust and psychological safety within teams",
      "Improving communication and reducing conflicts",
      "Clarifying roles, responsibilities, and team purpose",
      "Developing collaborative problem-solving skills",
      "Creating actionable team agreements and norms",
      "Measuring and sustaining team performance improvements"
    ],
    idealFor: "Intact teams seeking better collaboration, newly formed teams, teams facing performance challenges, cross-functional project teams"
  },
  "executive-coaching": {
    title: "Executive Coaching",
    subtitle: "Personalized one-on-one leadership development",
    description: "Tailored coaching engagements for leaders seeking to enhance their effectiveness and navigate complex challenges.",
    duration: "3-6 months",
    format: "One-on-one Sessions",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
    icon: MessageSquare,
    whatYouLearn: [
      "Personalized development focused on your specific goals",
      "Enhanced self-awareness and emotional intelligence",
      "Strategies for navigating complex leadership challenges",
      "Improved executive presence and communication skills",
      "Work-life integration and resilience building",
      "Confidential space for reflection and growth"
    ],
    idealFor: "Senior leaders seeking personalized development, executives facing specific challenges, leaders in transition, high-potential individuals"
  }
};

export default function ProgrammeDetail() {
  const { id } = useParams<{ id: string }>();
  const programme = id ? programmesData[id as keyof typeof programmesData] : null;

  if (!programme) {
    return <Navigate to="/programmes" replace />;
  }

  const Icon = programme.icon;

  return (
    <>
      <SEO
        title={programme.title}
        description={programme.description}
        canonicalUrl={`/programmes/${id}`}
        keywords={`${programme.title.toLowerCase()}, leadership programme, ${programme.format.toLowerCase()}, leadership development`}
      />
      <div className="min-h-screen bg-background">
        <Header />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/programmes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programmes
          </Link>

          {/* Hero Image */}
          <div className="aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
            <img 
              src={programme.image} 
              alt={programme.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title Section */}
          <div className="bg-primary/5 rounded-xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {programme.title}
                </h1>
                <p className="text-lg text-primary font-medium">
                  {programme.subtitle}
                </p>
              </div>
            </div>
            
            <p className="text-foreground leading-relaxed">
              {programme.description}
            </p>
          </div>

          {/* Meta Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">Duration</h3>
              <p className="text-muted-foreground">{programme.duration}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p className="text-muted-foreground">{programme.format}</p>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              What You'll Learn
            </h2>
            <ul className="space-y-4">
              {programme.whatYouLearn.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal For */}
          <div className="bg-muted/30 rounded-lg p-8 mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Ideal For
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {programme.idealFor}
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              to="/contact"
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-4 px-12 rounded-md text-lg transition-colors"
            >
              Contact Us to Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
