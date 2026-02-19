import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { CourseSchema, ServiceSchema, HowToSchema } from "@/components/StructuredData";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { Link } from "react-router-dom";
import { Target, Users, MessageSquare, ClipboardCheck, ArrowRight, Compass, Pencil, MessageCircle, Bot, Brain } from "lucide-react";
import leaderAsCoachImage from "@/assets/leader-as-coach.jpg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

import { leadershipLevelDetails, LeadershipLevel } from "@/lib/leadershipScoring";

export default function Programmes() {
  return <>
      <SEO title="Leadership Programmes & Team Workshops | Leadership by Design" description="Executive coaching, team workshops, and bespoke leadership development programmes. Contagious Identity coaching, SHIFT methodology, and team effectiveness training." canonicalUrl="/programmes" ogImage="https://leadershipbydesign.co/og-programmes.jpg" keywords="leadership programmes, executive coaching, team workshops, SHIFT methodology, contagious identity coaching, leadership development South Africa" />
      
      {/* Course Structured Data for AI Discovery */}
      <CourseSchema
        name="Leading in the AI Era"
        description="Move from AI uncertainty to confident integration in 6 weeks. Learn AI capabilities, protect your Human Edge, and build augmented workflows."
        duration="P6W"
        url="/programmes"
      />
      <CourseSchema
        name="Leader as Coach Programme"
        description="Transform leaders into effective coaches over 6 months with weekly virtual sessions covering trust building, conflict management, neuroscience, and wellbeing."
        duration="P6M"
        url="/programmes"
      />
      <CourseSchema
        name="Effective Personal Productivity (L1)"
        description="Master personal output and task completion. 8-week programme focusing on productivity systems and self-management."
        duration="P8W"
        url="/programmes"
      />
      <CourseSchema
        name="Effective Leadership Development (L2)"
        description="Learn to invest in growing others. 6-week programme on developing team members and coaching skills."
        duration="P6W"
        url="/programmes"
      />
      <CourseSchema
        name="Effective Personal Leadership (L3)"
        description="Connect work to meaning and vision. 12-week programme on purpose-driven leadership."
        duration="P12W"
        url="/programmes"
      />
      <CourseSchema
        name="Effective Motivational Leadership (L4)"
        description="Inspire and energize teams. 8-week programme on motivational leadership and team engagement."
        duration="P8W"
        url="/programmes"
      />
      <CourseSchema
        name="Effective Strategic Leadership (L5)"
        description="Drive long-term organizational success. 4-week intensive on strategic thinking and decision-making."
        duration="P4W"
        url="/programmes"
      />
      <ServiceSchema
        name="Team Alignment Workshop"
        description="Build strategic clarity and get everyone rowing in the same direction. 1-2 day in-person workshop achieving 50% reduction in team conflict."
        url="/workshops/alignment"
      />
      <ServiceSchema
        name="Team Motivation Workshop"
        description="Reignite team energy and create sustainable motivation through purpose-driven engagement strategies. 1-2 day workshop."
        url="/workshops/motivation"
      />
      <ServiceSchema
        name="Team Leadership Workshop"
        description="Develop leadership capabilities at every level and create a culture of accountability and ownership. 1-2 day workshop."
        url="/workshops/leadership"
      />
      <ServiceSchema
        name="Executive Coaching"
        description="One-on-one coaching for senior leaders achieving 2x strategic clarity in 90 days. Bespoke executive development."
        url="/executive-coaching"
      />
      <HowToSchema
        name="How to Develop Leadership Skills with the L1-L5 Framework"
        description="Progress through 5 leadership levels from personal productivity to strategic leadership. 35% faster decision-making within 60 days."
        totalTime="P12M"
        steps={[
          { name: "L1: Master Personal Productivity", text: "Focus on personal output, task completion, and self-management systems." },
          { name: "L2: Develop Others", text: "Invest in growing team members through coaching, feedback, and development conversations." },
          { name: "L3: Lead with Purpose", text: "Connect work to meaning and vision. Inspire through purpose-driven leadership." },
          { name: "L4: Motivate Teams", text: "Energize and inspire teams through motivational leadership and engagement." },
          { name: "L5: Think Strategically", text: "Drive long-term organizational success through strategic thinking and decision-making." }
        ]}
      />
      
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

            {/* Leading in the AI Era Section */}
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
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Leading in the AI Era
                  </h2>
                  <p className="text-muted-foreground">6-week programme • Level-agnostic • Future-proof your leadership</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" 
                      alt="Leading in the AI Era Programme" 
                      className="w-full h-full object-cover object-center" 
                      loading="lazy" 
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      From AI Uncertainty to Confident Integration
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Move from AI overwhelm to confident integration in 6 weeks. This cross-functional programme helps leaders at any level understand AI capabilities, protect their 'Human Edge', and build augmented workflows that enhance rather than replace human judgment.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">Duration:</span>{" "}
                        <span className="text-muted-foreground">6 weeks</span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Format:</span>{" "}
                        <span className="text-muted-foreground">Online + Coaching</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['AI Capabilities', 'Human Edge', 'POPI Act', 'Augmented Workflows', 'Change Management'].map((tag) => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link to="/contact">
                      <Button className="rounded-full group">
                        Enquire About Programme
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Leader as Coach Section */}
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
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Leader as Coach
                  </h2>
                  <p className="text-muted-foreground">6-month programme • Weekly sessions • Build coaching culture</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    <img src={leaderAsCoachImage} alt="Leader as Coach Programme" className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      Transform Leaders into Effective Coaches
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Cultivate successful, empowered leadership coaches who understand human behaviour and are equipped with effective methods to get the most out of their teams. Build a coaching culture that boosts company performance and reduces team overwhelm.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">Duration:</span>{" "}
                        <span className="text-muted-foreground">6 months</span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Format:</span>{" "}
                        <span className="text-muted-foreground">Weekly Virtual Sessions</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Trust Building', 'Conflict Management', 'Neuroscience', 'Bias Awareness', 'Wellbeing'].map((tag) => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link to="/contact">
                      <Button className="rounded-full group">
                        Enquire About Programme
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>

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
                    Team Leadership Workshops
                  </h2>
                  <p className="text-muted-foreground">Develop leadership at every level • 50% less conflict • Results in 60 days</p>
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

            {/* Corporate Mind Reset Section */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    The Corporate Mind Reset
                  </h2>
                  <p className="text-muted-foreground">4 × 90-minute sessions • Mindset training • Science-backed</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" alt="Corporate Mind Reset" className="w-full h-full object-cover object-center" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      Reset the Mind. Reclaim Performance.
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Science-backed, intentional mindset training that rewires how your people think, respond, and perform under pressure. Delivered in 4 × 90-minute facilitated sessions for measurable shifts in focus, resilience, and leadership presence.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Stress Reduction', 'Mental Clarity', 'Resilience', 'Mindset Blueprint'].map((tag) => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link to="/corporate-mind-reset">
                      <Button className="rounded-full group">
                        Explore Programme
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Contagious Identity Coaching Section */}
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
                    Contagious Identity Coaching
                  </h2>
                  <p className="text-muted-foreground">Identity-driven leadership • Culture shaping • Premium 1:1 coaching</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80" alt="Contagious Identity Coaching" className="w-full h-full object-cover object-top" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      Executive Coaching for Contagious Identity
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your identity as a leader is already spreading—through your decisions, presence, and how you show up under pressure. This premium coaching helps you lead from a clear, contagious identity that shapes culture and drives results.
                    </p>
                    
                    {/* Key Benefits */}
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Shape the identity others catch from you
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Build influence that transcends your position
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Create a legacy that survives your exit
                      </li>
                    </ul>

                    {/* Pricing Tiers */}
                    <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="font-semibold text-foreground">Foundation</p>
                        <p className="text-primary font-bold">R15,000</p>
                        <p className="text-muted-foreground">6 sessions</p>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/30">
                        <p className="font-semibold text-foreground">Executive</p>
                        <p className="text-primary font-bold">R45,000</p>
                        <p className="text-muted-foreground">12 sessions</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="font-semibold text-foreground">Strategic</p>
                        <p className="text-primary font-bold">R75,000</p>
                        <p className="text-muted-foreground">+ SHIFT</p>
                      </div>
                    </div>

                    <Link to="/contagious-identity">
                      <Button className="rounded-full group w-full sm:w-auto">
                        Explore Coaching Programme
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>

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
