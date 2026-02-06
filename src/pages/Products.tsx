import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  Package, 
  Award, 
  Users, 
  Download,
  ArrowRight,
  CheckCircle,
  UserCheck,
  TrendingUp
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/products/CheckoutModal";

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
      icon: FileText,
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
      icon: MessageSquare,
      comingSoon: true,
    },
  ];

  const trustItems = [
    { icon: Award, label: "11 Years of Coaching" },
    { icon: Users, label: "3,000+ Organizations" },
    { icon: Download, label: "Instant Download" },
  ];

  const targetPersonas = [
    { icon: UserCheck, text: "First-time managers finding their footing" },
    { icon: TrendingUp, text: "Experienced leaders stepping into bigger roles" },
    { icon: Users, text: "HR teams building consistent management skills" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Leadership Tools & Resources | Leadership by Design"
        description="Practical leadership tools and frameworks for managers. From survival kits to conversation scripts—everything you need to lead with confidence."
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pb-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary-foreground mb-6">
              Leadership Tools That Work
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Practical frameworks and templates built from 11 years of coaching 3,000+ organizations. 
              No theory—just results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Bundle Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl border-2 border-primary/20 p-8 sm:p-12 relative overflow-hidden"
          >
            {/* Best Value Badge */}
            <div 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
            >
              Best Value — Save R147
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Complete Bundle</p>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  The New Manager Bundle
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 max-w-2xl">
              Get both the New Manager Survival Kit and the Difficult Conversations Playbook together. 
              Everything you need to lead with confidence from day one.
            </p>

            {/* Bundle Contents */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30"
                >
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{product.title}</p>
                    <p className="text-sm text-muted-foreground">{product.priceDisplay} value</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl text-muted-foreground line-through">R894</span>
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: "#C8A864" }}
                  >
                    R747
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">One-time payment • Instant access</p>
              </div>
              
              <Button 
                size="lg"
                onClick={() => setBundleCheckoutOpen(true)}
                className="rounded-full px-8 py-6 text-lg font-semibold group transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
              >
                Get the Bundle
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Individual Products Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Or Choose What You Need
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                {product.comingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    Coming Soon
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <product.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">{product.label}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2">
                  {product.title}
                </h3>
                <p className="text-muted-foreground mb-4">{product.subtitle}</p>
                <p className="text-muted-foreground text-sm mb-6">{product.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <span className="text-2xl font-bold text-foreground">{product.priceDisplay}</span>
                  {product.comingSoon ? (
                    <Button 
                      variant="outline"
                      className="rounded-full"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  ) : (
                    <Button 
                      asChild
                      className="rounded-full bg-primary hover:bg-primary/90 group"
                    >
                      <Link to={product.link}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            {trustItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Are These For Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Built for Managers Who Want to Lead, Not Just Manage
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </motion.div>

          <div className="space-y-4">
            {targetPersonas.map((persona, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="p-3 rounded-xl bg-primary/10">
                  <persona.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground">{persona.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to Coaching Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-foreground mb-6">
              Want Personalized Guidance?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              These tools are great for self-guided development. But if you want customized support, 
              our executive coaching programme delivers transformational results.
            </p>
            <Button 
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-8 py-6 text-lg font-semibold group hover:scale-105 transition-all duration-300"
            >
              <Link to="/contact">
                Book a Discovery Session
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

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
