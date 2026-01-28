import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, Building2, DollarSign, Clock, Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import RiskReversal from "@/components/RiskReversal";

const caseStudies = [
  {
    id: "tech-scaling",
    company: "Technology Scale-Up",
    industry: "Technology",
    employees: "250+ employees",
    challenge: "Rapid growth from 50 to 250 employees in 18 months was causing culture erosion, leadership gaps, and high turnover among mid-level managers.",
    solution: "SHIFT Leadership Development Programme for 25 managers over 6 months, combined with executive coaching for the leadership team.",
    results: [
      { metric: "$2M", label: "Revenue Increase", description: "in 12 months post-programme" },
      { metric: "50%", label: "Turnover Reduction", description: "Manager retention improved dramatically" },
      { metric: "32 → 67", label: "Employee NPS", description: "More than doubled satisfaction scores" },
      { metric: "40%", label: "Faster Decisions", description: "Leadership team decision velocity" }
    ],
    testimonial: {
      quote: "The SHIFT programme didn't just develop our managers—it transformed our entire leadership culture. We went from firefighting daily to leading strategically.",
      author: "CEO",
      company: "Technology Scale-Up"
    },
    color: "blue"
  },
  {
    id: "manufacturing",
    company: "Manufacturing Firm",
    industry: "Manufacturing",
    employees: "500+ employees",
    challenge: "High turnover (35% annually), low engagement scores, and a leadership team operating in silos with no succession planning.",
    solution: "Team Effectiveness Workshops for department heads, followed by Executive Coaching for the senior leadership team over 9 months.",
    results: [
      { metric: "35% → 15%", label: "Turnover Reduced", description: "Annual staff turnover cut by more than half" },
      { metric: "$500K", label: "Recruitment Savings", description: "Annual savings in hiring costs" },
      { metric: "28%", label: "Production Up", description: "Efficiency gains from aligned teams" },
      { metric: "4.2/5", label: "Engagement Score", description: "Up from 2.8/5 baseline" }
    ],
    testimonial: {
      quote: "Kevin helped us see that our 'people problem' was actually a leadership problem. The workshops gave us a common language and the coaching gave us accountability.",
      author: "Head of Operations",
      company: "Manufacturing Firm"
    },
    color: "green"
  },
  {
    id: "financial-services",
    company: "Financial Services Group",
    industry: "Financial Services",
    employees: "800+ employees",
    challenge: "No internal leadership succession pipeline. 90% of senior roles filled externally, creating culture friction and long ramp-up times.",
    solution: "Bespoke Leadership Development Programme spanning 12 months, integrating leadership diagnostics, group workshops, and individual coaching.",
    results: [
      { metric: "80%", label: "Internal Promotions", description: "Senior roles now filled internally" },
      { metric: "40%", label: "Faster Promotions", description: "Time-to-leadership reduced" },
      { metric: "4.2/5", label: "Bench Strength", description: "Up from 2.1/5 at baseline" },
      { metric: "3x", label: "Leadership Pipeline", description: "Identified successors for key roles" }
    ],
    testimonial: {
      quote: "We finally have a leadership pipeline. The diagnostic approach helped us identify high-potentials we'd overlooked, and the development path gave them clear direction.",
      author: "Chief People Officer",
      company: "Financial Services Group"
    },
    color: "purple"
  }
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800/50",
    accent: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800/50",
    accent: "text-green-600 dark:text-green-400",
    badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800/50",
    accent: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
  }
};

export default function CaseStudies() {
  return (
    <>
      <SEO
        title="Case Studies | Leadership by Design"
        description="Real results from real clients. See how our leadership development programmes have delivered $2M revenue increases, 50% turnover reductions, and measurable business impact."
        canonicalUrl="/case-studies"
        keywords="leadership case studies, executive coaching results, team workshop ROI, leadership development outcomes, business transformation"
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Proven Results</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Real Results.
                <span className="text-primary block">Real Numbers.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Don't take our word for it. See how our leadership development programmes have delivered 
                measurable business impact for organisations across industries.
              </p>

              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary">$2M+</div>
                  <div className="text-sm text-muted-foreground">Revenue Increases</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary">50%</div>
                  <div className="text-sm text-muted-foreground">Turnover Reduction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Companies Transformed</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            {caseStudies.map((study, index) => {
              const colors = colorClasses[study.color as keyof typeof colorClasses];
              
              return (
                <motion.article
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`${colors.bg} ${colors.border} border-2 rounded-3xl overflow-hidden`}
                >
                  {/* Header */}
                  <div className="p-8 md:p-10 border-b border-inherit">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`${colors.badge} px-3 py-1 rounded-full text-sm font-medium`}>
                        {study.industry}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {study.employees}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {study.company}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10">
                    <div className="grid lg:grid-cols-2 gap-8 mb-10">
                      {/* Challenge & Solution */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="flex items-center gap-2 font-bold text-foreground mb-3">
                            <Target className={`w-5 h-5 ${colors.accent}`} />
                            The Challenge
                          </h3>
                          <p className="text-muted-foreground">{study.challenge}</p>
                        </div>
                        <div>
                          <h3 className="flex items-center gap-2 font-bold text-foreground mb-3">
                            <CheckCircle2 className={`w-5 h-5 ${colors.accent}`} />
                            Our Solution
                          </h3>
                          <p className="text-muted-foreground">{study.solution}</p>
                        </div>
                      </div>

                      {/* Results Grid */}
                      <div>
                        <h3 className="font-bold text-foreground mb-4">The Results</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {study.results.map((result, idx) => (
                            <div key={idx} className="bg-background rounded-xl p-4 border border-border">
                              <div className={`text-2xl md:text-3xl font-bold ${colors.accent}`}>
                                {result.metric}
                              </div>
                              <div className="font-medium text-foreground text-sm">{result.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{result.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-background rounded-xl p-6 border border-border">
                      <blockquote className="text-lg italic text-foreground mb-4">
                        "{study.testimonial.quote}"
                      </blockquote>
                      <div className="text-sm text-muted-foreground">
                        — {study.testimonial.author}, {study.testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Risk Reversal */}
        <RiskReversal />

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Ready to Create Your Success Story?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Book a free strategy call to discuss how we can deliver similar results for your organisation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://calendar.app.google/F3D2TZ5ccJ58q4ML8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold rounded-full group">
                    Book Free Strategy Call
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <Link to="/team-diagnostic">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-6 text-lg font-semibold rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Take Free Diagnostic
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
