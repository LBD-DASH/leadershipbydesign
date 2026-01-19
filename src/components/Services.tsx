import ServiceCard from "./ServiceCard";
import shiftLeadershipImage from "@/assets/service-shift-leadership.jpg";
import executiveCoachingImage from "@/assets/service-executive-coaching.jpg";
import teamWorkshopsImage from "@/assets/service-team-workshops.jpg";

const services = [
  {
    title: "SHIFT Leadership Development",
    description: "Intensive executive development that sharpens how leaders think, align vision, and navigate complexity to drive lasting organizational change.",
    image: shiftLeadershipImage
  },
  {
    title: "Team Workshops",
    description: "High-impact sessions that diagnose hidden team dysfunction, rebuild trust and alignment, and create shared ownership — so your team stops surviving and starts performing.",
    image: teamWorkshopsImage
  },
  {
    title: "Executive Coaching",
    description: "One-on-one SHIFT-based coaching for senior leaders ready to uncover blind spots, reclaim focus, and lead with clarity — resulting in sharper decisions, stronger presence, and measurable business impact.",
    image: executiveCoachingImage
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
