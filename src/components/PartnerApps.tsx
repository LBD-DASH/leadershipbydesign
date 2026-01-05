import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import partnerLogo1 from "@/assets/partner-logo-1.png";
import valuesLogo from "@/assets/values-logo.png";
import shiftLogo from "@/assets/shift-logo.jpg";
import purposeBlueprintLogo from "@/assets/purpose-blueprint-logo.png";

const partnerApps = [
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
    name: "Shift Daily Companion",
    logo: shiftLogo,
    description: "Your daily companion for mindset shifts and personal transformation",
    link: null,
    comingSoon: true
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
    <section className="py-24 px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Our Apps & Tools
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore these carefully selected tools that complement our leadership development approach.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {partnerApps.map((app) => {
            const Wrapper = app.link ? 'a' : 'div';
            const wrapperProps = app.link 
              ? { href: app.link, target: "_blank", rel: "noopener noreferrer", className: "group" }
              : { className: "group" };

            return (
              <Wrapper key={app.name} {...wrapperProps}>
                <Card className="hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8 flex flex-col items-center justify-center min-h-[320px]">
                    <div className="w-full h-40 flex items-center justify-center mb-6">
                      <img 
                        src={app.logo} 
                        alt={app.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{app.name}</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
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
