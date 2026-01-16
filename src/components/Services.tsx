import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "SHIFT Leadership Development",
    description: "Intensive executive development focused on strategic thinking, organizational vision, and driving transformation. We help senior leaders navigate complexity and inspire lasting change.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
  },
  {
    title: "Team Workshops",
    description: "Interactive sessions designed to build cohesion, improve communication, and unlock your team's full potential through collaborative learning experiences.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
  },
  {
    title: "Executive Coaching",
    description: "Personalized one-on-one guidance tailored for senior leaders. We help you refine your leadership approach, enhance decision-making, and drive organizational excellence.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
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
