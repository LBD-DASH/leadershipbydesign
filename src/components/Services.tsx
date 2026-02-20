import ServiceCard from "./ServiceCard";
import shiftLeadershipImage from "@/assets/service-shift-leadership.jpg";
import executiveCoachingImage from "@/assets/service-executive-coaching.jpg";
import teamWorkshopsImage from "@/assets/service-team-workshops.jpg";

const services = [
  {
    title: "SHIFT Leadership Development",
    description: "Leaders report 35% faster decision-making within 60 days. Intensive executive development that sharpens how leaders think, align vision, and navigate complexity.",
    image: shiftLeadershipImage,
    metric: "35% faster decisions in 60 days"
  },
  {
    title: "Team Leadership Workshops",
    description: "Develop leadership capability at every level. High-impact sessions that build accountability, create shared ownership, and improve leadership behaviours across your team.",
    image: teamWorkshopsImage,
    metric: "Leadership at every level, 50% less conflict"
  },
  {
    title: "Contagious Identity Coaching",
    description: "Executives achieve leadership clarity where identity becomes influence. One-on-one coaching for senior leaders ready to lead from a clear, contagious identity that shapes culture and drives results.",
    image: executiveCoachingImage,
    metric: "Identity-driven leadership transformation"
  }
];

export default function Services() {
  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Core Services
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <div className="space-y-6 sm:space-y-12">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              image={service.image}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
