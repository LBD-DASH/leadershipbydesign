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
    title: "Executive Coaching",
    description: "Executives achieve 2x strategic clarity in 90 days. One-on-one SHIFT-based coaching for senior leaders ready to lead with focus and measurable business impact.",
    image: executiveCoachingImage,
    metric: "2x strategic clarity in 90 days"
  }
];

export default function Services() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Core Services
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <div className="space-y-12">
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
