import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { Link } from "react-router-dom";
import { Target, Users, MessageSquare, ClipboardCheck, ArrowRight, Compass, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { leadershipLevelDetails, LeadershipLevel } from "@/lib/leadershipScoring";
const levelOrder: LeadershipLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
const teamWorkshops = [{
  id: "alignment",
  title: "Alignment Workshop",
  subtitle: "Clarity & Direction",
  description: "Build strategic clarity and get everyone rowing in the same direction with shared purpose and goals.",
  duration: "1-2 days",
  format: "In-person Workshop",
  image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  link: "/workshops/alignment"
}, {
  id: "motivation",
  title: "Motivation Workshop",
  subtitle: "Energy & Engagement",
  description: "Reignite team energy and create sustainable motivation through purpose-driven engagement strategies.",
  duration: "1-2 days",
  format: "In-person Workshop",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  link: "/workshops/motivation"
}, {
  id: "leadership",
  title: "Leadership Workshop",
  subtitle: "Accountability & Ownership",
  description: "Develop leadership capabilities at every level and create a culture of accountability and ownership.",
  duration: "1-2 days",
  format: "In-person Workshop",
  image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
  link: "/workshops/leadership"
}];
export default function Programmes() {
  return <>
      <SEO title="Programmes & Workshops" description="Explore leadership development programmes including executive coaching, team effectiveness workshops, SHIFT leadership development, and bespoke programme design." canonicalUrl="/programmes" keywords="leadership programmes, executive coaching, team workshops, leadership development, SHIFT leadership development" />
      <div className="min-h-screen bg-background">
        <Header />
      
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Programmes & Workshops
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mb-8" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore our comprehensive programmes designed to develop leaders at every level—from emerging managers to seasoned executives.
              </p>
            </motion.div>

            {/* Leadership Development Section */}
            <motion.section initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">The #1 Leadership System for Scaling Leaders</h2>
                  <p className="text-muted-foreground">35% faster decisions • 40% productivity gains • 94% accuracy rate</p>
                </div>
              </div>

              {/* Leadership Diagnostic CTA */}
              <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Not Sure Where You're Operating?
                    </h3>
                    <p className="text-muted-foreground">
                      Take our free 5-minute diagnostic to discover your primary leadership level and get personalised development recommendations.
                    </p>
                  </div>
                  <Link to="/leadership-diagnostic">
                    <Button size="lg" className="rounded-full group whitespace-nowrap">
                      Take Leadership Diagnostic
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Leadership Level Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelOrder.map((level, index) => {
                const details = leadershipLevelDetails[level];
                return <motion.div key={level} initial={{
                  opacity: 0,
                  y: 20
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: index * 0.1,
                  duration: 0.5
                }}>
                      <Link to="/leadership-diagnostic" className="block group">
                        <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
                          <div className="relative aspect-video overflow-hidden">
                            <img src={details.image} alt={details.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                            <div className="absolute top-3 left-3">
                              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                                {level}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                              {details.title}
                            </h3>
                            <p className="text-xs text-primary font-medium mb-2">{details.subtitle}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {details.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>;
              })}

                {/* Design Your Leadership Card */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.5,
                duration: 0.5
              }}>
                  <Link to="/contact" className="block group h-full">
                    <div className="bg-gradient-to-br from-primary/10 via-card to-primary/5 rounded-xl overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <Pencil className="w-8 h-8 text-primary" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                            Bespoke
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          Design Your Leadership
                        </h3>
                        <p className="text-xs text-primary font-medium mb-2">Tailored Development</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                          Custom leadership programme designed for your unique needs.
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.section>

            {/* Team Workshops Section */}
            <motion.section initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Team Effectiveness Workshops
                  </h2>
                  <p className="text-muted-foreground">50% less conflict • 40% better meetings • Results in 60 days</p>
                </div>
              </div>

              {/* Team Diagnostic CTA */}
              <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Not Sure What Your Team Needs?
                    </h3>
                    <p className="text-muted-foreground">
                      Take our free 5-minute diagnostic to discover the single intervention that will make the biggest difference for your team.
                    </p>
                  </div>
                  <Link to="/team-diagnostic">
                    <Button size="lg" className="rounded-full group whitespace-nowrap">
                      Take Team Diagnostic
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Team Workshop Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamWorkshops.map((workshop, index) => <motion.div key={workshop.id} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.1,
                duration: 0.5
              }}>
                    <Link to={workshop.link} className="block group">
                      <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
                        <div className="relative aspect-video overflow-hidden">
                          <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {workshop.title}
                          </h3>
                          <p className="text-xs text-primary font-medium mb-2">{workshop.subtitle}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {workshop.description}
                          </p>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>{workshop.duration}</span>
                            <span>•</span>
                            <span>{workshop.format}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>)}
              </div>
            </motion.section>

            {/* Executive Coaching Section */}
            <motion.section initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Executive Coaching
                  </h2>
                  <p className="text-muted-foreground">2x strategic clarity • 35% faster decisions • 90-day results guarantee</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80" alt="Executive Coaching" className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      One-on-One Executive Coaching
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Executives achieve 2x strategic clarity in 90 days. Tailored coaching for leaders seeking to enhance their effectiveness, navigate complex challenges, and accelerate their growth with measurable outcomes.
                    </p>
                    <div className="flex gap-4 mb-6 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">Duration:</span>{" "}
                        <span className="text-muted-foreground">3-6 months</span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Format:</span>{" "}
                        <span className="text-muted-foreground">One-on-one Sessions</span>
                      </div>
                    </div>
                    <Link to="/contact">
                      <Button className="rounded-full group">
                        Enquire About Coaching
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Social Share Section */}
            <motion.section initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="bg-sky-50/50 dark:bg-sky-950/30 rounded-xl p-6 border border-sky-200/50 dark:border-sky-800/50">
              <SocialShareButtons title="Explore leadership development programmes and workshops" description="Discover programmes designed to develop leaders at every level—from emerging managers to seasoned executives." />
            </motion.section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>;
}