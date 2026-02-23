import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const paths = [
  {
    icon: Briefcase,
    title: "I'm a new manager",
    description: "Get plug-and-play scripts for your first conversations.",
    link: "/survival-pack",
    cta: "Get the Scripts",
  },
  {
    icon: Users,
    title: "I need leadership coaching",
    description: "Work with Kevin to transform how you lead.",
    link: "/contact",
    cta: "Book a Consultation",
  },
  {
    icon: ClipboardCheck,
    title: "I want to assess my team",
    description: "Free 5-minute diagnostic with instant results.",
    link: "/leadership-diagnostic",
    cta: "Take the Diagnostic",
  },
];

export default function StartHere() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            Where Should You Start?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Pick the path that fits where you are right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <Link key={path.title} to={path.link} className="group">
                <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{path.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{path.description}</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {path.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
