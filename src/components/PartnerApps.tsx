import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import confidenceCultureLogo from "@/assets/confidence-culture-logo.png";
import partnerLogo1 from "@/assets/partner-logo-1.png";
import valuesLogo from "@/assets/values-logo.png";
import leadershipIndexLogo from "@/assets/leadership-index-logo.png";
import purposeBlueprintLogo from "@/assets/purpose-blueprint-logo.png";

const partnerApps = [
  {
    name: "Confidence Culture",
    logo: confidenceCultureLogo,
    description: "Transform your mindset and cultivate elite confidence for peak performance",
    link: "https://confidenceculture.online",
    comingSoon: false
  },
  {
    name: "6 Human Needs",
    logo: partnerLogo1,
    description: "Collaborative tools and resources for community building",
    link: "https://6humanneeds.online/",
    comingSoon: false
  },
  {
    name: "Values",
    logo: valuesLogo,
    description: "Identity Engineering - Building strong organizational values and culture",
    link: "https://valuesblueprint.online",
    comingSoon: false
  },
  {
    name: "Leadership Index",
    logo: leadershipIndexLogo,
    description: "Measure and elevate your leadership effectiveness with data-driven insights",
    link: "https://leadershipindex.lovable.app",
    comingSoon: false
  },
  {
    name: "Purpose Blueprint",
    logo: purposeBlueprintLogo,
    description: "Discover and design your life's purpose with clarity and intention",
    link: "https://findmypurpose.me",
    comingSoon: false
  }
];

export default function PartnerApps() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Our Apps & Tools
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mb-4 sm:mb-6" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Explore these carefully selected tools that complement our leadership development approach.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {partnerApps.map((app) => {
            const Wrapper = app.link ? 'a' : 'div';
            const wrapperProps = app.link 
              ? { href: app.link, target: "_blank", rel: "noopener noreferrer", className: "group" }
              : { className: "group" };

            return (
              <Wrapper key={app.name} {...wrapperProps}>
                <Card className="hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[300px] lg:min-h-[320px]">
                    <div className="w-full h-28 sm:h-32 lg:h-40 flex items-center justify-center mb-4 sm:mb-6">
                      <img 
                        src={app.logo} 
                        alt={app.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{app.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4 line-clamp-3">
                      {app.description}
                    </p>
                    {app.comingSoon ? (
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        Coming Soon
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-primary font-medium">
                        Visit Platform
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
