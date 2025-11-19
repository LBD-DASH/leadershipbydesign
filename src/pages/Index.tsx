import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Services from "@/components/Services";
import ClientLogos from "@/components/ClientLogos";
import TestimonialSlider from "@/components/TestimonialSlider";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Services />
      <ClientLogos />
      <TestimonialSlider />
    </div>
  );
};

export default Index;
