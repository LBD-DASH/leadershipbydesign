import SEO from "@/components/SEO";
import OrganizationSchema from "@/components/OrganizationSchema";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Services from "@/components/Services";
import PartnerApps from "@/components/PartnerApps";
import TestimonialSlider from "@/components/TestimonialSlider";
import InternationalSection from "@/components/InternationalSection";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";

const Index = () => {
  return (
    <>
      <SEO
        title="Leadership by Design | Executive Coaching & Leadership Development — South Africa & Global"
        description="The SHIFT Framework has transformed 3,000+ leaders across 11 years. Executive coaching, leadership development, and team workshops for ambitious organisations. Kevin Britz — Leadership Architect."
        canonicalUrl="/"
        keywords="executive coaching, leadership development, SHIFT framework, Kevin Britz, leadership training, South Africa, team workshops, leadership diagnostic"
      />
      <OrganizationSchema />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <ClientLogos />
        <Services />
        <PartnerApps />
        <TestimonialSlider />
        <InternationalSection />
        <Footer />
        <FloatingSocial />
      </div>
    </>
  );
};

export default Index;
