import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, UserCircle, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Target,
      title: "Strategic Leadership",
      description: "Intensive executive development focused on strategic thinking, organizational vision, and driving transformation. We help senior leaders navigate complexity and inspire lasting change.",
    },
    {
      icon: Users,
      title: "Team Workshops",
      description: "Interactive sessions designed to build cohesion, improve communication, and unlock your team's full potential through collaborative learning experiences.",
    },
    {
      icon: UserCircle,
      title: "Executive Coaching",
      description: "Personalized one-on-one guidance tailored for senior leaders. We help you refine your leadership approach, enhance decision-making, and drive organizational excellence.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Core Services
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <Button variant="ghost" className="group p-0 h-auto text-primary hover:text-primary">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
