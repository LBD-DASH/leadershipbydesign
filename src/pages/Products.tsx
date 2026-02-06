import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Package, 
  Award, 
  Users, 
  Download,
  ArrowRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import newManagerHero from "@/assets/new-manager-hero.jpg";
import leadershipFeedback from "@/assets/leadership-feedback.jpg";

const Products = () => {
  const [bundleCheckoutOpen, setBundleCheckoutOpen] = useState(false);

  const products = [
    {
      id: "new-manager-kit",
      title: "New Manager Survival Kit",
      shortDesc: "Your first 90 days, solved",
      price: "R497",
      link: "/new-manager-kit",
      image: newManagerHero,
      isExternal: false,
      features: ["30-60-90 Day Roadmap", "Team Assessment Tools", "Weekly Reflection Templates", "Quick-Win Strategies"],
    },
    {
      id: "difficult-conversations",
      title: "Difficult Conversations Playbook",
      shortDesc: "20 scripts for tough talks",
      price: "R397",
      link: "/difficult-conversations",
      image: leadershipFeedback,
      isExternal: false,
      features: ["20 Word-for-Word Scripts", "HEARD Framework", "Do & Don't Guides", "Preparation Template"],
    },
    {
      id: "values-blueprint",
      title: "Values Blueprint",
      shortDesc: "Discover your core values",
      price: "Free Tool",
      link: "https://valuesblueprint.online",
      image: newManagerHero,
      isExternal: true,
      features: ["Personal Values Assessment", "Team Values Alignment", "Decision Framework", "Values Integration Guide"],
    },
    {
      id: "purpose-blueprint",
      title: "Purpose Blueprint",
      shortDesc: "Find your leadership purpose",
      price: "Free Tool",
      link: "https://purposeblueprint.online",
      image: leadershipFeedback,
      isExternal: true,
      features: ["Purpose Discovery Process", "Mission Statement Builder", "Purpose-Driven Goals", "Legacy Planning"],
    },
    {
      id: "six-human-needs",
      title: "6 Human Needs",
      shortDesc: "Understand motivation drivers",
      price: "Free Tool",
      link: "https://6humanneeds.online",
      image: newManagerHero,
      isExternal: true,
      features: ["Needs Assessment", "Motivation Mapping", "Team Dynamics Insights", "Conflict Resolution Guide"],
    },
    {
      id: "leadership-index",
      title: "Leadership Index",
      shortDesc: "Measure your leadership",
      price: "Free Tool",
      link: "https://leadershipindex.lovable.app",
      image: leadershipFeedback,
      isExternal: true,
      features: ["360° Assessment", "Benchmark Scores", "Development Roadmap", "Progress Tracking"],
    },
    {
      id: "team-alignment",
      title: "Team Alignment Toolkit",
      shortDesc: "Get your team on the same page",
      price: "R297",
      link: "/products",
      image: newManagerHero,
      isExternal: false,
      comingSoon: true,
      features: ["Alignment Workshop Guide", "Team Charter Template", "Communication Protocols", "Meeting Frameworks"],
    },
    {
      id: "feedback-mastery",
      title: "Feedback Mastery Guide",
      shortDesc: "Give feedback that sticks",
      price: "R247",
      link: "/products",
      image: leadershipFeedback,
      isExternal: false,
      comingSoon: true,
      features: ["Feedback Models", "Recognition Scripts", "Coaching Questions", "Follow-up Templates"],
    },
    {
      id: "delegation-playbook",
      title: "Delegation Playbook",
      shortDesc: "Delegate without dropping balls",
      price: "R197",
      link: "/products",
      image: newManagerHero,
      isExternal: false,
      comingSoon: true,
      features: ["Delegation Matrix", "Handover Checklists", "Accountability Systems", "Progress Check Templates"],
    },
    {
      id: "one-on-one-toolkit",
      title: "1-on-1 Meeting Toolkit",
      shortDesc: "Run meetings that matter",
      price: "R197",
      link: "/products",
      image: leadershipFeedback,
      isExternal: false,
      comingSoon: true,
      features: ["Meeting Agendas", "Coaching Questions", "Career Conversation Guides", "Action Trackers"],
    },
    {
      id: "performance-review",
      title: "Performance Review Pack",
      shortDesc: "Reviews that drive results",
      price: "R247",
      link: "/products",
      image: newManagerHero,
      isExternal: false,
      comingSoon: true,
      features: ["Review Templates", "Goal-Setting Framework", "Self-Assessment Tools", "Development Plans"],
    },
    {
      id: "remote-leadership",
      title: "Remote Leadership Kit",
      shortDesc: "Lead from anywhere",
      price: "R297",
      link: "/products",
      image: leadershipFeedback,
      isExternal: false,
      comingSoon: true,
      features: ["Virtual Meeting Best Practices", "Async Communication Guide", "Remote Team Building", "Engagement Trackers"],
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
            className="text-center mb-12"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Leadership Tools & Products
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Practical frameworks and templates built from 11 years of coaching 3,000+ organizations.
            </p>
          </motion.div>

          {/* Featured Bundle Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  The New Manager Bundle
                </h2>
                <p className="text-sm text-muted-foreground">Best value • Save R147</p>
              </div>
            </div>

            <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
              <div className="grid md:grid-cols-3 gap-0">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <img 
                    src={newManagerHero}
                    alt="The New Manager Bundle" 
                    className="w-full h-full object-cover object-center" 
                    loading="lazy" 
                  />
                  <div className="absolute top-3 left-3">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
                    >
                      Best Value
                    </span>
                  </div>
                </div>
                <div className="md:col-span-2 p-5 flex flex-col justify-center">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Everything You Need to Lead with Confidence
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get the New Manager Survival Kit + Difficult Conversations Playbook together.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['90-Day Framework', '20 Scripts', 'Templates', 'Instant Access'].map((tag) => (
                      <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through text-sm">R894</span>
                      <span className="text-xl font-bold" style={{ color: "#C8A864" }}>R747</span>
                    </div>
                    <Button 
                      onClick={() => setBundleCheckoutOpen(true)}
                      size="sm"
                      className="rounded-full group"
                      style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
                    >
                      Get Bundle
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Products Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  All Leadership Tools
                </h2>
                <p className="text-sm text-muted-foreground">12 tools to transform your leadership</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full group flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy" 
                      />
                      {product.comingSoon && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-medium">
                            Coming Soon
                          </span>
                        </div>
                      )}
                      {product.isExternal && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px] font-medium">
                            Free
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-serif text-sm font-bold text-foreground mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {product.shortDesc}
                      </p>
                      
                      {/* Price & Actions */}
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">{product.price}</span>
                        
                        <div className="flex items-center gap-1">
                          {/* More Info Popover */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 hover:bg-primary/10"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent 
                              className="w-64 p-3 bg-card border border-border shadow-xl z-50" 
                              align="end"
                              sideOffset={5}
                            >
                              <h4 className="font-semibold text-sm text-foreground mb-2">{product.title}</h4>
                              <p className="text-xs text-muted-foreground mb-3">{product.shortDesc}</p>
                              <ul className="space-y-1.5 mb-3">
                                {product.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <span className="text-primary mt-0.5">•</span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <div className="pt-2 border-t border-border">
                                <span className="text-sm font-bold text-foreground">{product.price}</span>
                              </div>
                            </PopoverContent>
                          </Popover>

                          {/* Action Button */}
                          {product.comingSoon ? (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2"
                              disabled
                            >
                              Soon
                            </Button>
                          ) : product.isExternal ? (
                            <Button 
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs px-2"
                            >
                              <a href={product.link} target="_blank" rel="noopener noreferrer">
                                Open
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </Button>
                          ) : (
                            <Button 
                              asChild
                              size="sm"
                              className="h-7 text-xs px-2"
                            >
                              <Link to={product.link}>
                                View
                              </Link>
                            </Button>
                          )}
                        </div>
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
            className="mb-12"
          >
            <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                {trustItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 sm:p-8 text-center">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-primary-foreground mb-3">
                Want Personalized Guidance?
              </h2>
              <p className="text-primary-foreground/90 text-sm mb-4 max-w-xl mx-auto">
                These tools are great for self-guided development. For customized support, 
                our executive coaching programme delivers transformational results.
              </p>
              <Button 
                asChild
                variant="secondary"
                className="rounded-full group"
              >
                <Link to="/contact">
                  Book a Discovery Session
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
