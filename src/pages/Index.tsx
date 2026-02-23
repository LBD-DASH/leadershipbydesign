import SEO from "@/components/SEO";
import OrganizationSchema from "@/components/OrganizationSchema";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StartHere from "@/components/StartHere";
import Services from "@/components/Services";
import PartnerApps from "@/components/PartnerApps";
import ClientLogos from "@/components/ClientLogos";
import TestimonialSlider from "@/components/TestimonialSlider";
import FloatingSocial from "@/components/FloatingSocial";
import StatsBar from "@/components/StatsBar";
import CredibilityBlock from "@/components/CredibilityBlock";

const Index = () => {
  return (
    <>
      <SEO
        title="Leadership by Design | Executive Coaching & Leadership Development in South Africa"
        description="Executive coaching, leadership development, and human performance systems for managers and senior leaders. 11 years, 4,000+ leaders developed across 50+ organisations. Based in South Africa."
        canonicalUrl="/"
        keywords="leadership development, executive coaching, team workshops, leadership training, South Africa, Kevin Britz, leadership coaching"
      />
      <OrganizationSchema />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <StartHere />
        <ClientLogos />
        <StatsBar />
        <Services />
        <CredibilityBlock />
        <PartnerApps />
        <TestimonialSlider />
        <FloatingSocial />
      </div>
    </>
  );
};

export default Index;
