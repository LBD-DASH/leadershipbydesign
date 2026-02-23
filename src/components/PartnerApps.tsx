import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const diagnostics = [
  {
    title: "Leadership Diagnostic",
    description: "Identify your leadership level and the single highest-leverage development area.",
    link: "/leadership-diagnostic",
  },
  {
    title: "Team Diagnostic",
    description: "Assess team alignment, motivation, and clarity — and pinpoint what's holding performance back.",
    link: "/team-diagnostic",
  },
  {
    title: "SHIFT Diagnostic",
    description: "Measure your organisation's readiness across the five SHIFT competencies.",
    link: "/shift-diagnostic",
  },
];

export default function PartnerApps() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            Start With a Free Diagnostic
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every diagnostic is free and takes under 5 minutes. Each one is designed to identify the single highest-leverage intervention for your leadership or team — and connect you with the exact programme that will address it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diagnostics.map((d) => (
            <div key={d.title} className="bg-background rounded-lg p-8 border border-border flex flex-col">
              <h3 className="font-serif text-lg font-bold text-foreground mb-3">{d.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{d.description}</p>
              <p className="text-xs text-accent font-medium mb-4">
                Completing this diagnostic unlocks a complimentary 30-minute Strategy Session with Kevin (value R3,500).
              </p>
              <Link to={d.link}>
                <Button variant="outline" className="w-full">
                  Take the Diagnostic
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
