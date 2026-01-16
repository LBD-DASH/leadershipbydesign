import { motion } from "framer-motion";
import { ArrowRight, Award, Sparkles, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { leadershipLevelDetails, LeadershipLevel } from "@/lib/leadershipScoring";

const levelOrder: LeadershipLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];

export default function LeadershipLevels() {
  return (
    <>
      <SEO
        title="Leadership Operating Levels | SHIFT Leadership Development"
        description="Discover the 5 Leadership Operating Levels framework. Take our free diagnostic to find your primary leadership level and get personalised programme recommendations."
        canonicalUrl="/leadership-levels"
        keywords="leadership levels, leadership development, leadership diagnostic, SHIFT methodology, leadership assessment"
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Internationally Recognised Framework
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Leadership Operating Levels
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Every leader operates at a primary level. Understanding yours is the first step 
                to targeted growth. Explore the 5 levels below and discover which one defines 
                your current leadership approach.
              </p>
              <Link to="/leadership-diagnostic">
                <Button size="lg" className="group">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Take the Free Diagnostic
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Leadership Levels Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {levelOrder.map((level, index) => {
                const details = leadershipLevelDetails[level];
                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Link to="/leadership-diagnostic" className="block group">
                      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={details.image}
                            alt={details.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                              {level}
                            </span>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded">
                              {details.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {details.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {details.description}
                          </p>
                          
                          {/* Key Strengths Preview */}
                          <div className="space-y-2 mb-4">
                            {details.strengths.slice(0, 2).map((strength, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {strength}
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                            Discover Your Level
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Design Your Leadership Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link to="/contact" className="block group h-full">
                  <div className="bg-gradient-to-br from-primary/10 via-card to-primary/5 rounded-2xl overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Icon Header */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Pencil className="w-12 h-12 text-primary" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                          Bespoke
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded">
                          Tailored Development
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        Design Your Leadership
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        Need a customised leadership development programme? Work with our experts to design a bespoke journey that addresses your unique challenges and aspirations.
                      </p>
                      
                      {/* Key Features */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Tailored to your organisation
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Custom content & delivery
                        </div>
                      </div>

                      <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                        Get in Touch
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Discover Your Leadership Level?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Take our free 5-minute diagnostic assessment to identify your primary operating level 
                and receive personalised programme recommendations tailored to your growth edge.
              </p>
              <Link to="/leadership-diagnostic">
                <Button size="lg" className="group">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Diagnostic
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
