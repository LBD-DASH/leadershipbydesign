import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, CheckCircle2, Target, Brain, Users, Compass, Sparkles, Lightbulb, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import executiveCoachingImage from '@/assets/service-executive-coaching.jpg';

const shiftSkills = [
  { letter: 'S', title: 'Self-Management', description: 'Emotional regulation, energy mastery, confidence under pressure, and resilience.' },
  { letter: 'H', title: 'Human Intelligence', description: 'Interpersonal awareness, communication, influence, and relational leadership.' },
  { letter: 'I', title: 'Innovation & Creativity', description: 'Strategic thinking, adaptive problem-solving, and creative leadership.' },
  { letter: 'F', title: 'Focused Attention', description: 'Clarity, prioritisation, and goal execution in high-demand roles.' },
  { letter: 'T', title: 'Thinking Critically', description: 'Decision-making, strategic foresight, and leadership reasoning.' }
];

const assessments = [
  { title: '6 Human Needs Profile', description: 'Identifies core emotional needs driving your leadership behaviour, motivation, and patterns under stress.' },
  { title: 'Purpose & Values Mapping', description: 'Explores your personal values, professional purpose, and the legacy you want to create.' },
  { title: 'Leadership Assessment (Enneagram)', description: 'Insight into how you think, respond under pressure, relate to others, and lead teams.' }
];

const developmentAreas = [
  'Leadership Presence & Executive Impact',
  'Strategic Communication & Storytelling',
  'Relationship & Stakeholder Leadership',
  'Decision-Making & Mental Models',
  'Boundary Management & Self-Mastery',
  'Team Dynamics & Culture Influence'
];

const sessionStructure = [
  { title: 'Insight & Awareness', description: 'Reviewing assessment insights and weekly leadership challenges.' },
  { title: 'Skill Development', description: 'Coaching on SHIFT skills: communication, influence, mindset, focus, resilience.' },
  { title: 'Leadership Application', description: 'Turning real challenges into practical leadership wins.' },
  { title: 'Tools & Frameworks', description: 'Leadership models and strategies you can apply immediately.' },
  { title: 'Action & Accountability', description: 'Clear actions to build momentum and embed behavioural change.' }
];

const outcomes = [
  'Clear understanding of your leadership strengths and growth areas',
  'Higher confidence, clarity, and strategic presence',
  'Stronger ability to influence people, teams, and executive decisions',
  'Communicate with more authority and connection',
  'Lead with focus, calmness, and resilience under pressure',
  'Increased impact on business performance and culture'
];

export default function ExecutiveCoaching() {
  return (
    <>
      <SEO 
        title="Executive Coaching | SHIFT Framework | Leadership by Design"
        description="Personalised executive coaching built on the SHIFT methodology. Develop leadership presence, strategic communication, and influence at the highest levels."
        keywords="executive coaching, leadership coaching, SHIFT framework, CFO coaching, senior leader development, executive presence"
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Link 
              to="/programmes"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programmes
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Personalised Leadership Development</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Executive
                  <span className="text-primary block">Coaching</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8">
                  One-on-one guidance tailored for senior leaders. Refine your leadership approach, 
                  enhance decision-making, and drive organisational excellence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact">
                    <Button size="lg" className="px-8 py-6 text-lg font-semibold rounded-full group">
                      Start Your Journey
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/leadership-diagnostic">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold rounded-full">
                      Take Leadership Diagnostic
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={executiveCoachingImage} 
                    alt="Executive Coaching Session"
                    className="w-full aspect-[4/3] object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SHIFT Framework Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The SHIFT Framework
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Built on the WINGS methodology from <em>The Future of Work</em> by Kevin Britz, 
                SHIFT expands five core competencies into a practical, behaviour-based leadership system 
                designed for real-world application.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-4">
              {shiftSkills.map((skill, index) => (
                <motion.div
                  key={skill.letter}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-background rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    {skill.letter}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Assessments Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                    <Compass className="w-4 h-4" />
                    <span className="text-sm font-medium">Personalised Approach</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Assessments & Diagnostics
                  </h2>
                  
                  <p className="text-lg text-muted-foreground mb-8">
                    We begin with a series of assessments that provide a complete picture of your 
                    leadership profile, strengths, and developmental opportunities.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {assessments.map((assessment, index) => (
                    <motion.div
                      key={assessment.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-card rounded-xl p-6 border border-border"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{assessment.title}</h3>
                          <p className="text-sm text-muted-foreground">{assessment.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Development Areas Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Key Development Areas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Focused coaching areas designed to elevate your leadership impact and executive presence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developmentAreas.map((area, index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all flex items-center gap-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-foreground">{area}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Session Structure Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  What to Expect in Sessions
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Each coaching session is structured to maximise learning, application, and accountability.
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-4">
                {sessionStructure.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-background rounded-xl p-6 border border-border text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-foreground mb-2 text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-card text-primary px-4 py-2 rounded-full mb-6 shadow-sm">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm font-medium">Your Transformation</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                      Expected Outcomes
                    </h2>
                    
                    <p className="text-lg text-muted-foreground mb-8">
                      By the end of your coaching journey, you will have strengthened your leadership identity, 
                      built deeper self-awareness, and developed frameworks that elevate your strategic contribution.
                    </p>
                    
                    <Link to="/contact">
                      <Button size="lg" className="group">
                        Begin Your Coaching Journey
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {outcomes.map((outcome, index) => (
                      <motion.div
                        key={outcome}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-start gap-3 bg-card rounded-lg p-4"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{outcome}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Foundation Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Foundation of the Work
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                This coaching is not only about skills – it is about strengthening your leadership identity, 
                building self-awareness, and equipping you with frameworks that elevate your strategic contribution. 
                Your values, purpose, and personal leadership philosophy become anchors for growth, consistency, 
                and long-term impact.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Leadership?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Take the first step towards becoming the leader you were meant to be.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold rounded-full group">
                    Get in Touch
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/leadership-diagnostic">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Take Leadership Diagnostic
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}