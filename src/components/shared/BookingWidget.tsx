import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackScheduleCallClick } from "@/utils/gtmEvents";
import { useBookingLink } from "@/hooks/useBookingLink";

interface BookingWidgetProps {
  /** Inline = button only; card = styled card with description; embed = iframe */
  variant?: "inline" | "card" | "embed";
  context?: string;
  className?: string;
  buttonText?: string;
}

export default function BookingWidget({
  variant = "card",
  context = "general",
  className = "",
  buttonText = "Book a Free Strategy Call",
}: BookingWidgetProps) {
  const handleClick = () => {
    trackScheduleCallClick({ source: context });
    window.open(BOOKING_LINK, "_blank", "noopener,noreferrer");
  };

  if (variant === "inline") {
    return (
      <Button onClick={handleClick} size="lg" className={className}>
        <Calendar className="w-5 h-5 mr-2" />
        {buttonText}
      </Button>
    );
  }

  if (variant === "embed") {
    return (
      <div className={`rounded-xl border border-border overflow-hidden ${className}`}>
        <iframe
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0vMzJjMjk5MzI1ZmUtYzI0Yy00MjAzLTkxMjAtYWEwNjhiMGUxNmE0?gv=true"
          className="w-full border-0"
          style={{ height: "420px" }}
          title="Book a Meeting"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
        <p className="text-xs text-muted-foreground text-center py-2">
          If calendar doesn't load,{" "}
          <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            open booking page here
          </a>
        </p>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 text-center ${className}`}>
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        Ready to Take the Next Step?
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Book a free 20-minute strategy call. We'll review your results and map out a clear action plan.
      </p>
      <Button onClick={handleClick} size="lg" className="text-lg px-8 py-6">
        <Calendar className="w-5 h-5 mr-2" />
        {buttonText}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
      <p className="text-xs text-muted-foreground mt-3">
        Free · No obligation · 20 minutes
      </p>
    </div>
  );
}

export { BOOKING_LINK };
