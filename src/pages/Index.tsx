import SEO from "@/components/SEO";
import OrganizationSchema from "@/components/OrganizationSchema";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeProblem from "@/components/HomeProblem";
import HomeSolution from "@/components/HomeSolution";
import HomeOffer from "@/components/HomeOffer";
import ClientLogos from "@/components/ClientLogos";
import CredibilityBlock from "@/components/CredibilityBlock";
import HomeDiagnosticCTA from "@/components/HomeDiagnosticCTA";
import HomeFooterCTA from "@/components/HomeFooterCTA";
import TestimonialSlider from "@/components/TestimonialSlider";
import FloatingSocial from "@/components/FloatingSocial";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <SEO
        title="Manager Coaching Programme South Africa | Leader as Coach | Leadership by Design"
        description="Install coaching capability into your management layer in 90 days. Proven with 4,000+ leaders across 30+ organisations in South African financial services. Book a discovery call."
        canonicalUrl="/"
        keywords="manager coaching programme, leader as coach, leadership development, executive coaching, South Africa, financial services, Kevin Britz"
      />
      <OrganizationSchema />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <HomeProblem />
        <HomeSolution />
        <HomeOffer />
        <ClientLogos />
        <CredibilityBlock />
        <HomeDiagnosticCTA />
        <TestimonialSlider />
        <HomeFooterCTA />
        <Footer />
        <FloatingSocial />
      </div>
    </>
  );
};

export default Index;
