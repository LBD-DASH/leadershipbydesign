import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <PhilosophySection />
        <ServicesSection />
        <ClientsSection />
      </main>
    </div>
  );
};

export default Index;
