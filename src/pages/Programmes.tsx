import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Lightbulb, Target, Users, MessageSquare } from "lucide-react";

const programmes = [
  {
    id: "bespoke-programme-design",
    title: "Bespoke Programme Design",
    subtitle: "Custom-built solutions tailored to your unique challenges",
    description: "We design customized leadership development programmes that align perfectly with your organization's culture, challenges, and strategic goals.",
    duration: "Flexible (3-12 months)",
    format: "Tailored to Your Needs",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    icon: Lightbulb
  },
  {
    id: "strategic-leadership-development",
    title: "Strategic Leadership Development",
    subtitle: "Elevate your leadership impact at the executive level",
    description: "An intensive programme for senior leaders focused on strategic thinking, organizational vision, and driving transformation.",
    duration: "12 weeks",
    format: "In-person & Coaching Sessions",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    icon: Target
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
                      to={`/programmes/${programme.id}`}
                      className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-4 rounded-md text-center transition-colors"
                    >
                      Learn More
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
