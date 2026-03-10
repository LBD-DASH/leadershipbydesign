import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/utils/gtmEvents";

export default function HomeDiagnosticCTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ClipboardCheck className="w-8 h-8 text-primary" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
          Not sure where your management layer stands?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          Answer 15 questions and find out whether your managers are coaching,
          controlling, or somewhere in between. Free. Takes 3 minutes. You'll
          get a profile and a recommendation.
        </p>

        <Link
          to="/leader-as-coach-diagnostic"
          onClick={() =>
            trackCTAClick({
              cta_label: "Take the Free Assessment",
              cta_location: "homepage_diagnostic_cta",
            })
          }
        >
          <Button
            size="lg"
            className="rounded-full px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-bold group"
          >
            Take the Free Assessment
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
