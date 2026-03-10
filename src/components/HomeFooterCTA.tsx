import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingLink } from "@/hooks/useBookingLink";
import { trackScheduleCallClick } from "@/utils/gtmEvents";

export default function HomeFooterCTA() {
  const bookingLink = useBookingLink();

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Ready to talk about your management layer?
        </h2>
        <p className="text-background/70 text-sm sm:text-base mb-8">
          Book a 30-minute discovery call. No obligation.
        </p>

        <a
          href={bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackScheduleCallClick({ source: "homepage_footer_cta" })}
        >
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-bold group"
          >
            <Phone className="mr-3 w-5 h-5" />
            Book a Discovery Call
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </a>
      </div>
    </section>
  );
}
