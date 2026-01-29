import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PartnerApps from "@/components/PartnerApps";
import ClientLogos from "@/components/ClientLogos";
import TestimonialSlider from "@/components/TestimonialSlider";
import FloatingSocial from "@/components/FloatingSocial";
import ChatWidget from "@/components/chat/ChatWidget";
const Index = () => {
  return (
    <>
      <SEO
        title="Leadership by Design"
        description="Transform your leadership with expert executive coaching, team workshops, and bespoke leadership development programmes. Kevin Britz helps leaders achieve measurable results in South Africa."
        canonicalUrl="/"
        keywords="leadership development, executive coaching, team workshops, leadership training, South Africa, Kevin Britz"
      />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <ClientLogos />
        <Services />
        <PartnerApps />
        <TestimonialSlider />
        <FloatingSocial />
        <ChatWidget />
      </div>
    </>
  );
};

export default Index;
