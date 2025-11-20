import Header from "@/components/Header";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Expert Coaches",
    description: "Access to experienced leadership coaches committed to your growth"
  },
  {
    icon: Target,
    title: "Personalized Approach",
    description: "Coaching tailored to your specific goals and challenges"
  },
  {
    icon: Zap,
    title: "Flexible Sessions",
    description: "Schedule sessions that fit your busy executive lifestyle"
  }
];

const benefits = [
  "One-on-one personalized coaching sessions",
  "Confidential and safe space for growth",
  "Action-oriented strategies and frameworks",
  "Ongoing support between sessions",
  "Measurable progress tracking",
  "Access to resources and tools"
];

export default function HelloCoach() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-6 lg:px-8 py-16 bg-gradient-to-br from-primary to-primary/80">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6"
            >
              HelloCoach
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed"
            >
              Your partner in leadership excellence. Connect with expert coaches who understand your challenges and are committed to your success.
            </motion.p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-16 px-6 lg:px-8 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              What You Get
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3 bg-card p-4 rounded-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary text-center mb-8">
              About HelloCoach
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                HelloCoach is our executive coaching platform that connects leaders with experienced coaches who understand the unique challenges of leadership at every level.
              </p>
              <p className="mb-4">
                Whether you're navigating a career transition, leading through change, or looking to elevate your leadership impact, our coaches provide the support, insights, and accountability you need to succeed.
              </p>
              <p>
                Every coaching engagement is tailored to your specific goals and context, ensuring you get the most relevant and actionable guidance for your leadership journey.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Start Your Coaching Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with us to learn more about HelloCoach and find the right coaching engagement for your needs.
            </p>
            <Link to="/contact">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
