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
  Sparkles,
  Star,
  Crown,
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
import leaderAsCoach from "@/assets/leader-as-coach.jpg";
import workshopLeadership from "@/assets/workshop-leadership.jpg";
import workshopMotivation from "@/assets/workshop-motivation.jpg";
import workshopAlignment from "@/assets/workshop-alignment.jpg";
import shiftHeroTeam from "@/assets/shift-hero-team.jpg";
import grandMastersTeam from "@/assets/grand-masters-team.jpg";
import productHandshake from "@/assets/product-handshake.jpg";
import productBusyCrossing from "@/assets/product-busy-crossing.jpg";
import productTeamHandsAbove from "@/assets/product-team-hands-above.jpg";
import productTeamHandsBelow from "@/assets/product-team-hands-below.jpg";
import productKeysHandoff from "@/assets/product-keys-handoff.jpg";
import productRopesConnecting from "@/assets/product-ropes-connecting.jpg";
import productRopesFocus from "@/assets/product-ropes-focus.jpg";
import productLightbulbIdea from "@/assets/product-lightbulb-idea.jpg";

const Products = () => {
  const [bundleCheckoutOpen, setBundleCheckoutOpen] = useState(false);

  const tier1Products = [
    {
      id: "difficult-conversations",
      title: "Difficult Conversations Playbook",
      shortDesc: "12 scripts for tough talks",
      price: "R247",
      link: "/difficult-conversations",
      image: productHandshake,
      isExternal: false,
      isBuilt: true,
      features: ["12 Word-for-Word Scripts", "CLEAR Framework", "De-escalation Toolkit", "Follow-up Templates"],
    },
    {
      id: "feedback-formula",
      title: "The Feedback Formula",
      shortDesc: "Give feedback people actually hear",
      price: "R297",
      link: "/products",
      image: productLightbulbIdea,
      isExternal: false,
      comingSoon: true,
      features: ["10 Feedback Frameworks", "Praise & Correction Scripts", "Development Review Templates", "Real-time Feedback Tools"],
    },
    {
      id: "meeting-detox",
      title: "The Meeting Detox Kit",
      shortDesc: "Cut 50% of your meetings",
      price: "R197",
      link: "/products",
      image: productBusyCrossing,
      isExternal: false,
      comingSoon: true,
      features: ["Should This Be a Meeting? Decision Tree", "Agenda Templates", "Async Communication Frameworks", "Meeting Audit Checklist"],
    },
    {
      id: "delegation-playbook",
      title: "The Delegation Playbook",
      shortDesc: "Hand off work without it breaking",
      price: "R297",
      link: "/products",
      image: productKeysHandoff,
      isExternal: false,
      comingSoon: true,
      features: ["5 Levels of Delegation", "Task Handoff Template", "Control Release Scripts", "Accountability Framework"],
    },
  ];

  const tier2Products = [
    {
      id: "new-manager-kit",
      title: "New Manager Survival Kit",
      shortDesc: "Your first 90 days, solved",
      price: "R497",
      link: "/new-manager-kit",
      image: newManagerHero,
      isExternal: false,
      isBuilt: true,
      features: ["30-60-90 Day Roadmap", "Team Assessment Tools", "Weekly Reflection Templates", "Quick-Win Strategies"],
    },
    {
      id: "one-on-one-mastery",
      title: "1-on-1 Mastery System",
      shortDesc: "Run meetings that transform performance",
      price: "R697",
      link: "/products",
      image: productRopesFocus,
      isExternal: false,
      comingSoon: true,
      features: ["Question Banks by Scenario", "Meeting Notes System", "Development Tracking", "90-Day Improvement Plan"],
    },
    {
      id: "team-culture",
      title: "Team Culture Blueprint",
      shortDesc: "Build high-performance culture",
      price: "R597",
      link: "/products",
      image: productTeamHandsAbove,
      isExternal: false,
      comingSoon: true,
      features: ["Psychological Safety Framework", "Values Creation Workshop", "Trust-Building Rituals", "Team Health Assessments"],
    },
    {
      id: "remote-leadership",
      title: "Remote Leadership Toolkit",
      shortDesc: "Lead distributed teams effectively",
      price: "R497",
      link: "/products",
      image: productRopesConnecting,
      isExternal: false,
      comingSoon: true,
      features: ["Communication Rhythms", "Virtual 1-on-1 Frameworks", "Async Decision-Making", "Culture Across Time Zones"],
    },
  ];

  const tier3Products = [
    {
      id: "leadership-diagnostic",
      title: "Leadership Diagnostic",
      shortDesc: "Discover your leadership level",
      price: "Free",
      link: "/leader-assessment",
      image: leadershipFeedback,
      isExternal: false,
      isBuilt: true,
      isFree: true,
      features: ["5-Minute Assessment", "Instant Results", "Personalized Insights", "Development Roadmap"],
    },
    {
      id: "90-day-intensive",
      title: "90-Day Leadership Intensive",
      shortDesc: "Self-coaching journal & workbook",
      price: "R1,497",
      link: "/products",
      image: leaderAsCoach,
      isExternal: false,
      comingSoon: true,
      features: ["Daily Leadership Prompts", "Weekly Reflections", "Monthly Assessments", "DIY Coaching Methodology"],
    },
    {
      id: "first-year-playbook",
      title: "Manager's First Year Playbook",
      shortDesc: "Months 4-12 after the survival kit",
      price: "R997",
      link: "/products",
      image: grandMastersTeam,
      isExternal: false,
      comingSoon: true,
      features: ["Leadership Brand Building", "Bench Strength Development", "Annual Review Framework", "Strategic Planning Tools"],
    },
    {
      id: "difficult-decisions",
      title: "Difficult Decisions Framework",
      shortDesc: "Make high-stakes calls with confidence",
      price: "R697",
      link: "/products",
      image: shiftHeroTeam,
      isExternal: false,
      comingSoon: true,
      features: ["Decision Matrices", "Stakeholder Mapping", "Trade-off Analysis", "Post-Decision Communication"],
    },
  ];

  const freeTools = [
    {
      id: "values-blueprint",
      title: "Values Blueprint",
      shortDesc: "Discover your core values",
      price: "Free",
      link: "https://valuesblueprint.online",
      image: productTeamHandsBelow,
      isExternal: true,
      comingSoon: false,
      features: ["Personal Values Assessment", "Team Values Alignment", "Decision Framework"],
    },
    {
      id: "purpose-blueprint",
      title: "Purpose Blueprint",
      shortDesc: "Find your leadership purpose",
      price: "Free",
      link: "https://purposeblueprint.online",
      image: workshopMotivation,
      isExternal: true,
      comingSoon: false,
      features: ["Purpose Discovery Process", "Mission Statement Builder", "Purpose-Driven Goals"],
    },
    {
      id: "six-human-needs",
      title: "6 Human Needs",
      shortDesc: "Understand motivation drivers",
      price: "Free",
      link: "https://6humanneeds.online",
      image: workshopAlignment,
      isExternal: true,
      comingSoon: false,
      features: ["Needs Assessment", "Motivation Mapping", "Team Dynamics Insights"],
    },
    {
      id: "leadership-index",
      title: "Leadership Index",
      shortDesc: "Measure your leadership",
      price: "Free",
      link: "https://leadershipindex.lovable.app",
      image: workshopLeadership,
      isExternal: true,
      comingSoon: false,
      features: ["360° Assessment", "Benchmark Scores", "Development Roadmap"],
    },
  ];

  const trustItems = [
    { icon: Award, label: "11 Years of Coaching" },
    { icon: Users, label: "3,000+ Organizations" },
    { icon: Download, label: "Instant Download" },
  ];

  // Define product type explicitly
  type Product = {
    id: string;
    title: string;
    shortDesc: string;
    price: string;
    link: string;
    image: string;
    isExternal?: boolean;
    isBuilt?: boolean;
    comingSoon?: boolean;
    isFree?: boolean;
    features: string[];
  };

  const ProductCard = ({ product, index }: { product: Product, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full group flex flex-col">
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
          {product.isBuilt && !product.isFree && (
            <div className="absolute top-2 right-2">
              <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                Available
              </span>
            </div>
          )}
          {(product.isExternal || product.isFree) && (
            <div className="absolute top-2 right-2">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px] font-medium">
                Free
              </span>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-serif text-sm font-bold text-foreground mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {product.shortDesc}
          </p>
          
          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-foreground">{product.price}</span>
            
            <div className="flex items-center gap-1">
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
              ) : product.isFree ? (
                <Button 
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Link to={product.link}>
                    Start
                  </Link>
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
  );

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

          {/* Featured Bundle Section - HERO DEAL */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div 
              className="relative rounded-2xl overflow-hidden border-2 shadow-2xl"
              style={{ borderColor: "#C8A864", background: "linear-gradient(135deg, #1B2A4A 0%, #2a3f6a 100%)" }}
            >
              {/* Floating Badge */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [0.9, 1.05, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
                >
                  <Sparkles className="w-4 h-4" />
                  BEST VALUE — SAVE R147
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </div>

              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <img 
                    src={newManagerHero}
                    alt="The New Manager Bundle" 
                    className="w-full h-full object-cover object-center" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1B2A4A]/50 lg:block hidden" />
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-6 h-6" style={{ color: "#C8A864" }} />
                    <span className="text-sm font-medium uppercase tracking-wider" style={{ color: "#C8A864" }}>
                      Complete Leadership Toolkit
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4">
                    The New Manager Bundle
                  </h2>
                  
                  <p className="text-white/80 text-lg mb-6">
                    Everything you need to lead with confidence from day one. Get both flagship products together at an unbeatable price.
                  </p>

                  {/* What's Included */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 bg-white/10 rounded-lg p-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C8A864" }}>
                        <span className="text-sm font-bold" style={{ color: "#1B2A4A" }}>1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">New Manager Survival Kit</h4>
                        <p className="text-white/70 text-sm">30-60-90 day roadmap, team assessments, weekly templates</p>
                        <span className="text-xs" style={{ color: "#C8A864" }}>Value: R497</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-white/10 rounded-lg p-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C8A864" }}>
                        <span className="text-sm font-bold" style={{ color: "#1B2A4A" }}>2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Difficult Conversations Playbook</h4>
                        <p className="text-white/70 text-sm">20 word-for-word scripts, HEARD framework, preparation guides</p>
                        <span className="text-xs" style={{ color: "#C8A864" }}>Value: R397</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['90-Day Framework', '20 Scripts', 'Team Tools', 'Templates', 'HEARD Framework', 'Instant PDF Access'].map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-3 py-1 rounded-full border"
                        style={{ borderColor: "#C8A864", color: "#C8A864" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Block */}
                  <div className="bg-white/10 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-white/50 line-through text-xl">R894</span>
                          <span className="text-4xl lg:text-5xl font-bold" style={{ color: "#C8A864" }}>R747</span>
                        </div>
                        <p className="text-white/60 text-sm mt-1">One-time payment • Instant download • Lifetime access</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#C8A864" }}>
                          <span className="text-lg font-bold" style={{ color: "#C8A864" }}>16%</span>
                        </div>
                        <span className="text-xs text-white/60">OFF</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={() => setBundleCheckoutOpen(true)}
                    size="lg"
                    className="w-full rounded-full text-lg py-6 group shadow-xl hover:shadow-2xl transition-all duration-300"
                    style={{ backgroundColor: "#C8A864", color: "#1B2A4A" }}
                  >
                    Get The Complete Bundle — R747
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-4 mt-4 text-white/60 text-xs">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" /> Instant Download
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> 11 Years Experience
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> 3,000+ Organizations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Tier 1: Entry Products */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Entry Products
                </h2>
                <p className="text-xs text-muted-foreground">R197–R397 • Quick wins for immediate impact</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tier1Products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.section>

          {/* Tier 2: Core Systems */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Core Systems
                </h2>
                <p className="text-xs text-muted-foreground">R497–R697 • Comprehensive leadership frameworks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tier2Products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.section>

          {/* Tier 3: Premium Products */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Premium Products
                </h2>
                <p className="text-xs text-muted-foreground">R697–R1,497 • Deep transformation & coaching alternative</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tier3Products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.section>

          {/* Free Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Free Assessment Tools
                </h2>
                <p className="text-xs text-muted-foreground">Start your leadership journey today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {freeTools.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.section>

          {/* Trust Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
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
