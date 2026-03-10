import { Search, Wrench, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Diagnose",
    description:
      "We assess your management layer's coaching readiness using structured diagnostics — not guesswork.",
  },
  {
    icon: Wrench,
    title: "Install",
    description:
      "Over 90 days we build coaching capability through structured practice, not theory.",
  },
  {
    icon: BarChart3,
    title: "Embed",
    description:
      "We measure what changes: retention, engagement, performance conversations.",
  },
];

export default function HomeSolution() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            We don't run training days. We install a system.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-card rounded-2xl p-6 sm:p-8 border border-border text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
