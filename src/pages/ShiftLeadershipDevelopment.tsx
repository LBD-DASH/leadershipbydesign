import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, CheckCircle2, Compass, Target, TrendingUp, Sparkles, Users, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { leadershipLevelDetails, LeadershipLevel } from '@/lib/leadershipScoring';

// Import leadership images
import leadershipL1Image from '@/assets/leadership-l1-productivity.jpg';
import leadershipL2Image from '@/assets/leadership-l2-development.jpg';
import leadershipL3Image from '@/assets/leadership-l3-purpose.jpg';
import leadershipL4Image from '@/assets/leadership-l4-motivational.jpg';
import leadershipL5Image from '@/assets/leadership-l5-strategic.jpg';

const levelImages: Record<LeadershipLevel, string> = {
  L1: leadershipL1Image,
  L2: leadershipL2Image,
  L3: leadershipL3Image,
  L4: leadershipL4Image,
  L5: leadershipL5Image
};

const levels: LeadershipLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];

export default function ShiftLeadershipDevelopment() {
  const [selectedLevel, setSelectedLevel] = useState<LeadershipLevel | null>(null);

  return (
    <>
      <SEO 
        title="SHIFT Leadership Development | Internationally Recognised Programmes"
        description="Discover your leadership operating level and develop with our internationally recognised SHIFT Leadership Development programmes. Bespoke solutions tailored to your needs."
        keywords="SHIFT leadership, leadership development, leadership programmes, executive coaching, bespoke leadership, leadership operating level"
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
            
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Internationally Recognised Programme</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  SHIFT Leadership
                  <span className="text-primary block">Development</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Elevate your leadership impact with our internationally recognised framework. 
                  Discover your operating level and design a development path tailored to your unique needs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/leadership-diagnostic">
                    <Button size="lg" className="px-8 py-6 text-lg font-semibold rounded-full group">
                      Take the Leadership Diagnostic
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold rounded-full">
                      Request Bespoke Programme
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Leadership Operating Levels Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Leadership Operating Level
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every leader operates at a primary level. Understanding yours is the first step to intentional growth.
              </p>
            </motion.div>

            {/* Level Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {levels.map((level, index) => {
                const details = leadershipLevelDetails[level];
                const isSelected = selectedLevel === level;
                
                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => setSelectedLevel(isSelected ? null : level)}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-primary/30'
                    }`}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={levelImages[level]} 
                        alt={details.title}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          Level {level.replace('L', '')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{details.title}</h3>
                      <p className="text-sm text-primary font-medium mb-2">{details.subtitle}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{details.description}</p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-gray-100"
                        >
                          <p className="text-sm text-gray-700 mb-3">
                            <strong>Growth Edge:</strong> {details.growthEdge}
                          </p>
                          <p className="text-sm text-primary font-medium">
                            Recommended: {details.recommendedPath}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA to Diagnostic */}
            <div className="text-center">
              <Link to="/leadership-diagnostic">
                <Button size="lg" variant="outline" className="group">
                  Discover Your Level
                  <Compass className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SHIFT Methodology Integration */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Powered by SHIFT Methodology™
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our leadership development programmes are built on the internationally recognised SHIFT Methodology™, 
                  focusing on five essential human intelligence skills that drive lasting transformation.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Self-Management', 'Human Intelligence', 'Innovation', 'Focus', 'Thinking'].map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{skill}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/shift-methodology">
                  <Button variant="outline" className="group">
                    Explore SHIFT Methodology™
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Programme Outcomes</h3>
                    <p className="text-sm text-primary">What you can expect</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    'Clear understanding of your leadership operating level',
                    'Personalised development roadmap',
                    'Practical tools and frameworks',
                    'Ongoing coaching and support',
                    'Measurable leadership growth'
                  ].map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bespoke Programme Design Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-full mb-6 shadow-sm">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm font-medium">Tailored Solutions</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Bespoke Programme Design
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6">
                      Every organisation is unique. We design customized leadership development programmes 
                      that align perfectly with your culture, challenges, and strategic goals.
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {[
                        'Solutions designed for your organizational context',
                        'Integration of your company values and objectives',
                        'Flexible delivery: workshops, coaching, or blended',
                        'Custom frameworks for your unique challenges',
                        'Measurable outcomes aligned with business goals'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/contact">
                        <Button size="lg" className="group">
                          Discuss Your Needs
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h4 className="font-bold text-gray-900">For Teams</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Team-wide programmes that build collective leadership capability and drive cultural change.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-primary" />
                        <h4 className="font-bold text-gray-900">For Executives</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Senior leader programmes focused on strategic impact and organisational transformation.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h4 className="font-bold text-gray-900">For Growth</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Scalable programmes for high-growth organisations building their leadership pipeline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
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
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Take the first step. Discover your leadership operating level with our free diagnostic.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/leadership-diagnostic">
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold rounded-full group">
                    Start Free Diagnostic
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold rounded-full border-white text-white hover:bg-white hover:text-primary">
                    Contact Us
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
