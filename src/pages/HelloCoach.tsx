import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Users, Shield, Clock, CheckCircle, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hellocoachLogo from "@/assets/hellocoach-logo.png";
import hellocoachMockup from "@/assets/hellocoach-app-mockup.webp";

const features = [
  {
    icon: Users,
    title: "Flexible Coaching Options",
    description: "Book the same coach for continuity or try different coaches to gain fresh perspectives and insights."
  },
  {
    icon: Shield,
    title: "100% Confidential",
    description: "Your privacy is our priority. We guarantee complete confidentiality and protection of your personal information."
  },
  {
    icon: Clock,
    title: "40-Minute Sessions",
    description: "Focused, effective coaching sessions designed to fit into your busy schedule."
  },
  {
    icon: CheckCircle,
    title: "Experienced Coaches",
    description: "Work with our dedicated team of professional coaches who are committed to your success."
  },
  {
    icon: Sparkles,
    title: "Personalized Guidance",
    description: "Tailored coaching approach designed specifically for your unique needs and aspirations."
  },
  {
    icon: ArrowUpRight,
    title: "Meaningful Progress",
    description: "Achieve tangible results in both your personal life and professional career."
  }
];

const steps = [
  {
    number: 1,
    title: "Sign Up with Your Promo Code",
    description: "Use the promo code 'LunchTimeSeries' to get your special offer and create your account."
  },
  {
    number: 2,
    title: "Choose Your Coach",
    description: "Browse our experienced coaches and select the one that best fits your needs, or try different coaches for varied perspectives."
  },
  {
    number: 3,
    title: "Book Your Session",
    description: "Schedule a convenient 40-minute coaching session at a time that works for you."
  },
  {
    number: 4,
    title: "Start Your Journey",
    description: "Begin your personalized coaching experience and unlock your full potential with complete confidentiality."
  }
];

export default function HelloCoach() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Ambassador Card */}
      <section className="pt-24 pb-16 px-6 lg:px-8 bg-gradient-to-br from-[#3A7CA5] to-[#2d6384]">
        <div className="max-w-4xl mx-auto text-center">
          {/* HelloCoach Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-black rounded-2xl flex items-center justify-center shadow-xl">
              <img 
                src={hellocoachLogo}
                alt="HelloCoach"
                className="w-24 h-24 object-contain"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-serif text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Proud Ambassador
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-white/90 mb-12"
          >
            Unlock Your Full Potential with Professional Coaching
          </motion.p>

          {/* Promo Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#3A7CA5]" />
              <h3 className="font-bold text-xl text-foreground">Special Offer</h3>
              <Sparkles className="w-5 h-5 text-[#3A7CA5]" />
            </div>
            
            <p className="text-muted-foreground mb-6">
              Use this promo code to get your special offer today!
            </p>

            <div className="bg-[#2d6384] text-white rounded-xl p-6 mb-6">
              <p className="text-sm font-medium mb-2 opacity-90">PROMO CODE</p>
              <p className="text-3xl font-bold tracking-wider">LunchTimeSeries</p>
            </div>

            <a 
              href="https://www.app.hellocoach.co.za/welcome?q=lunchtime_kevin_britz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="w-full bg-[#3A7CA5] hover:bg-[#2d6384] text-white font-semibold py-6 text-lg"
              >
                Join HelloCoach Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Choose HelloCoach Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#3A7CA5] mb-4 pb-3 inline-block relative">
              Why Choose HelloCoach?
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#3A7CA5]" />
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-[#3A7CA5]/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[#3A7CA5]" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#3A7CA5] mb-4 inline-block relative">
              How It Works
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#3A7CA5]" />
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex gap-6 items-start bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-[#3A7CA5] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#3A7CA5] to-[#2d6384]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join HelloCoach today and start your journey towards personal and professional growth with Kevin Britz as your ambassador.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-md mx-auto">
              <p className="text-white/80 text-sm mb-2">Remember to use promo code:</p>
              <p className="text-3xl font-bold text-white tracking-wider">LunchTimeSeries</p>
            </div>

            <a 
              href="https://www.app.hellocoach.co.za/welcome?q=lunchtime_kevin_britz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-white text-[#3A7CA5] hover:bg-white/90 font-semibold px-8 py-6 text-lg"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Mobile App Showcase Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#3A7CA5] mb-4 inline-block relative">
              Coaching in Your Pocket
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#3A7CA5]" />
            </h2>
            <p className="text-lg text-muted-foreground mt-6 max-w-3xl mx-auto">
              Experience seamless coaching sessions through our intuitive mobile app. Book sessions, connect with coaches, and track your progress—all at your fingertips.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <img 
              src={hellocoachMockup}
              alt="HelloCoach Mobile App"
              className="w-full max-w-5xl rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#3A7CA5] mb-4 inline-block relative">
              About HelloCoach
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#3A7CA5]" />
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              At HelloCoach, we believe in the power of coaching to support, guide, and unlock your inherent personal and professional performance characteristics. Our mission is to help you tap into your full potential, fostering personal self-discovery and growth, leading to meaningful progress in both your life and career.
            </p>
            <p>
              With our dedicated team of experienced coaches, you can expect personalised guidance tailored to your unique needs and aspirations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
