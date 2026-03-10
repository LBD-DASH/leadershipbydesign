import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/utils/gtmEvents";

export default function HomeOffer() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
          Leader as Coach — 90-Day Manager Coaching Accelerator
        </h2>
        <div className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed space-y-4 mb-8">
          <p>
            The only structured programme in South Africa built specifically to
            turn managers into coaches. Not a workshop. Not a course. A 90-day
            operating system for your management layer.
          </p>
          <p className="text-foreground/80 font-medium text-sm">
            Built for HR Directors and L&D Heads at 100–500 person firms in
            financial services, insurance, banking, accounting, legal and
            professional services.
          </p>
        </div>

        <Link
          to="/leader-as-coach"
          onClick={() =>
            trackCTAClick({
              cta_label: "See How It Works",
              cta_location: "homepage_offer",
            })
          }
        >
          <Button
            size="lg"
            className="rounded-full px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-bold group"
          >
            See How It Works
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
