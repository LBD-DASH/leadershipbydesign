import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Target, Users, MessageSquare, ClipboardCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Programme {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  format: string;
  image: string;
  icon: typeof Target;
  isSpecialPage?: boolean;
}

const programmes = [
  {
    id: "shift-leadership-development",
    title: "SHIFT Leadership Development",
    subtitle: "Discover your leadership operating level",
    description: "Our internationally recognised programme helps you understand where you're operating as a leader and design a development path tailored to your unique needs.",
    duration: "Flexible",
    format: "Diagnostic + Bespoke Development",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    icon: Target,
    isSpecialPage: true
  },
  {
    id: "team-effectiveness-workshops",
    title: "Team Effectiveness Workshops",
    subtitle: "Transform your team into a high-performing unit",
    description: "Interactive workshops designed to improve team dynamics, collaboration, and collective performance.",
    duration: "1-2 days",
    format: "In-person Workshop",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    icon: Users
  },
  {
    id: "executive-coaching",
    title: "Executive Coaching",
    subtitle: "Personalized one-on-one leadership development",
    description: "Tailored coaching engagements for leaders seeking to enhance their effectiveness and navigate complex challenges.",
    duration: "3-6 months",
    format: "One-on-one Sessions",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
    icon: MessageSquare
  }
];

export default function Programmes() {
  return (
    <>
      <SEO
        title="Programmes & Workshops"
        description="Explore leadership development programmes including executive coaching, team effectiveness workshops, strategic leadership development, and bespoke programme design."
        canonicalUrl="/programmes"
        keywords="leadership programmes, executive coaching, team workshops, leadership development, strategic planning workshops"
      />
      <div className="min-h-screen bg-background">
        <Header />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
              Programmes & Workshops
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
              Transform Your Leadership Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive programmes designed to develop leaders at every level—from emerging managers to seasoned executives.
            </p>
          </div>

          {/* Diagnostic CTA Section */}
          <div className="bg-primary/5 rounded-2xl p-8 sm:p-10 text-center border border-primary/20 mb-12">
            <ClipboardCheck className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Not Sure What Your Team Needs?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Take our free 5-minute diagnostic to discover the single intervention that will make the biggest difference for your team.
            </p>
            <Link to="/team-diagnostic">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold rounded-full group">
                Take the Team Diagnostic
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Programme Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {programmes.map((programme) => {
              const Icon = programme.icon;
              return (
                <div key={programme.id} className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={programme.image} 
                      alt={programme.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-1">
                          {programme.title}
                        </h3>
                        <p className="text-sm text-primary font-medium">
                          {programme.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4">
                      {programme.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">Duration:</span>{" "}
                        <span className="text-muted-foreground">{programme.duration}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Format:</span>{" "}
                        <span className="text-muted-foreground">{programme.format}</span>
                      </div>
                    </div>

                    {/* Button */}
                    <Link 
                      to={(programme as Programme).isSpecialPage ? `/programmes/${programme.id}` : `/programmes/${programme.id}`}
                      className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-4 rounded-md text-center transition-colors"
                    >
                      {(programme as Programme).isSpecialPage ? 'Explore Programme' : 'Learn More'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
