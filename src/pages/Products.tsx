import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Package, 
  Award, 
  Users, 
  Download,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import newManagerHero from "@/assets/new-manager-hero.jpg";
import leadershipFeedback from "@/assets/leadership-feedback.jpg";

const Products = () => {
  const [bundleCheckoutOpen, setBundleCheckoutOpen] = useState(false);

  const products = [
    {
      id: "new-manager-kit",
      label: "90-Day Framework",
      title: "The New Manager Survival Kit",
      subtitle: "Your first 90 days, solved",
      description: "A complete system for new managers to build credibility, gain team trust, and deliver results—without the overwhelm.",
      features: ["30-60-90 Day Roadmap", "Team Assessment Tools", "Weekly Reflection Templates"],
      price: 497,
      priceDisplay: "R497",
      link: "/new-manager-kit",
      image: newManagerHero,
    },
    {
      id: "difficult-conversations",
      label: "20 Scripts",
      title: "The Difficult Conversations Playbook",
      subtitle: "Know exactly what to say",
      description: "Word-for-word scripts for the 20 most challenging workplace conversations every manager faces.",
      features: ["Performance Feedback Scripts", "Conflict Resolution Guides", "Exit Conversation Templates"],
      price: 397,
      priceDisplay: "R397",
      link: "/difficult-conversations",
      image: leadershipFeedback,
      comingSoon: true,
    },
  ];

  const trustItems = [
    { icon: Award, label: "11 Years of Coaching" },
    { icon: Users, label: "3,000+ Organizations" },
    { icon: Download, label: "Instant Download" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Leadership Tools & Resources | Leadership by Design"
        description="Practical leadership tools and frameworks for managers. From survival kits to conversation scripts—everything you need to lead with confidence."
      />
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Leadership Tools & Products
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Practical frameworks and templates built from 11 years of coaching 3,000+ organizations. 
              No theory—just results.
            </p>
          </motion.div>

          {/* Featured Bundle Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  The New Manager Bundle
                </h2>
                <p className="text-muted-foreground">Complete toolkit • Best value • Save R147</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <img 
                    src={newManagerHero}
                    alt="The New Manager Bundle" 
                    className="w-full h-full object-cover object-center" 
                    loading="lazy" 
                  />
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-3 py-1.5 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
                    >
                      Best Value
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    Everything You Need to Lead with Confidence
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get both the New Manager Survival Kit and the Difficult Conversations Playbook together. 
                    A complete toolkit for navigating your first management role with clarity and confidence.
                  </p>
                  
                  {/* Bundle Contents */}
                  <div className="space-y-3 mb-6">
                    {products.map((product) => (
                      <div 
                        key={product.id}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <span className="font-medium text-foreground">{product.title}</span>
                          <span className="text-muted-foreground text-sm ml-2">({product.priceDisplay} value)</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div>
                      <span className="font-semibold text-foreground">Value:</span>{" "}
                      <span className="text-muted-foreground line-through">R894</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Bundle Price:</span>{" "}
                      <span className="text-2xl font-bold" style={{ color: "#C8A864" }}>R747</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {['90-Day Framework', '20 Scripts', 'Team Tools', 'Templates', 'Instant Access'].map((tag) => (
                      <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button 
                    onClick={() => setBundleCheckoutOpen(true)}
                    className="rounded-full group"
                    style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
                  >
                    Get the Bundle — R747
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Individual Products Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  Individual Products
                </h2>
                <p className="text-muted-foreground">Or choose exactly what you need</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full group">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                          {product.label}
                        </span>
                      </div>
                      {product.comingSoon && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-primary font-medium mb-2">{product.subtitle}</p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Features */}
                      <ul className="space-y-1.5 mb-4">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-2xl font-bold text-foreground">{product.priceDisplay}</span>
                        {product.comingSoon ? (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            disabled
                          >
                            Coming Soon
                          </Button>
                        ) : (
                          <Button 
                            asChild
                            size="sm"
                            className="rounded-full group/btn"
                          >
                            <Link to={product.link}>
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Trust Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
                {trustItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA to Coaching Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 sm:p-12 text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Want Personalized Guidance?
              </h2>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                These tools are great for self-guided development. But if you want customized support, 
                our executive coaching programme delivers transformational results.
              </p>
              <Button 
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full group"
              >
                <Link to="/contact">
                  Book a Discovery Session
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />

      {/* Bundle Checkout Modal */}
      <CheckoutModal
        open={bundleCheckoutOpen}
        onOpenChange={setBundleCheckoutOpen}
        productName="The New Manager Bundle"
        price={747}
        priceDisplay="R747"
      />
    </div>
  );
};

export default Products;
