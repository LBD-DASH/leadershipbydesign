import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import heroImage from "@/assets/hero-leadership-team.jpg";
import { useBookingLink } from "@/hooks/useBookingLink";
import { trackScheduleCallClick, trackCTAClick } from "@/utils/gtmEvents";

export default function Hero() {
  const bookingLink = useBookingLink();

  return (
    <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[85vh] flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(20, 50, 70, 0.92) 0%, rgba(30, 65, 90, 0.88) 100%), url('${heroImage}')`,
        }}
      />

      <div className="relative z-10 flex-1 flex items-center justify-center pt-8 sm:pt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-white/60 mb-3 sm:mb-5 font-medium">
            🇿🇦 South Africa's Manager Coaching Specialist
          </p>

          <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight px-2">
            Your managers are managing.{" "}
            <span className="text-white/70">They're not developing people.</span>
            <br className="hidden sm:block" />
            <span className="block mt-2 text-white">That's the gap costing you most.</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-6 sm:mb-10 px-4 font-light leading-relaxed">
            Leadership by Design works with financial services and professional services firms
            to install coaching capability into their management layer — structured, practical,
            and proven over 11 years.
          </p>

          <div className="mb-4 sm:mb-6">
            <a
              href={bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScheduleCallClick({ source: "homepage_hero" })}
            >
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 sm:px-12 py-5 sm:py-7 text-base sm:text-xl font-bold rounded-full shadow-2xl transition-all duration-300 group w-full sm:w-auto"
              >
                <Phone className="mr-3 w-5 h-5" />
                Book a Discovery Call
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>

          <Link
            to="/leader-as-coach-diagnostic"
            onClick={() => trackCTAClick({ cta_label: "Coaching Readiness Assessment", cta_location: "homepage_hero" })}
          >
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-5 sm:px-8 py-3 sm:py-5 text-xs sm:text-base font-medium rounded-full transition-all duration-300 group"
            >
              How Coaching-Ready Is Your Management Layer?
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Social proof bar */}
      <div className="relative z-10 py-4 sm:py-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 sm:gap-12 text-white/70 text-xs sm:text-sm font-medium tracking-wide">
          <span>4,000+ Leaders</span>
          <span>50+ Organisations</span>
          <span>750+ Programmes</span>
          <span>11 Years</span>
        </div>
      </div>
    </div>
  );
}
