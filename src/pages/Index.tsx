import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Services from "@/components/Services";
import PartnerApps from "@/components/PartnerApps";
import ClientLogos from "@/components/ClientLogos";
import TestimonialSlider from "@/components/TestimonialSlider";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Services />
      <PartnerApps />
      <ClientLogos />
      <TestimonialSlider />
    </div>
  );
};

export default Index;
