import React from "react";
import { motion } from "framer-motion";
import { Target, Lightbulb, Award, Heart } from "lucide-react";
import TestimonialCard from "@/components/TestimonialCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "We focus on measurable outcomes that make a tangible difference in your organization.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Thinking",
    description: "We challenge conventional wisdom and design fresh approaches tailored to your unique context.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in everything we do, from strategy to execution.",
  },
  {
    icon: Heart,
    title: "People-Centered",
    description: "We believe in the power of human potential and prioritize authentic, meaningful relationships.",
  },
];

const testimonials = [
  {
    quote: "Kevin's coaching completely transformed how I approach leadership. His insights into conscious leadership helped me build a more engaged, high-performing team.",
    author: "Sarah Mitchell",
    role: "CEO, Tech Innovations Ltd",
    industry: "Technology"
  },
  {
    quote: "The SHIFT Leadership Programme was exactly what our management team needed. Kevin's approach is practical, insightful, and immediately applicable.",
    author: "David Thompson",
    role: "Managing Director",
    industry: "Manufacturing"
  },
  {
    quote: "Working with Kevin has been transformative for both me personally and our organization. His ability to identify blind spots and provide actionable strategies is exceptional.",
    author: "Priya Naidoo",
    role: "Executive Director",
    industry: "Non-Profit Sector"
  }
];

const partners = [
  {
    name: "SHIFT",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6914661fa894ae1081602d0f/976ae82bf_SHIFTLogo4.png"
  },
  {
    name: "HelloCoach",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6914661fa894ae1081602d0f/5df0b32d8_Hellocoachlogo33.png"
  },
  {
    name: "6 Human Needs",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6914661fa894ae1081602d0f/262e61b5f_transparetnt.png"
  },
  {
    name: "Regenesys Business School",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6914661fa894ae1081602d0f/b4162178e_Regenesys_Business_School_logosvg.png"
  }
];

export default function About() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Leadership by Design's philosophy, values, and approach to transforming leaders. We design people solutions through leadership design, training design, and coaching design."
        canonicalUrl="/about"
        keywords="about leadership by design, Kevin Britz, leadership philosophy, executive coaching approach, leadership values"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-24 px-6 lg:px-8 bg-gradient-to-br from-primary to-primary/80">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-5xl md:text-6xl font-bold text-primary-foreground mb-6"
            >
              About Leadership by Design
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed font-light"
            >
              We design people solutions. That's it.
            </motion.p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
                Our Philosophy
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8" />
              <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-left md:text-center">
                <p>
                  We believe that exceptional leadership is not innate — it is designed, embodied, and made contagious.
                </p>
                <p>
                  At the core of our work is the understanding that leadership identity shapes behaviour, and behaviour shapes results. Leaders don't just influence through strategy and systems — they influence through how they show up, what they tolerate, and the energy they create around them.
                </p>
                <p>
                  Our approach integrates the principles of Contagious Identity with the SHIFT Methodology™, helping leaders consciously design the identity they lead from — and understand how that identity spreads through teams, culture, and performance.
                </p>
                <p>
                  By combining human behaviour diagnostics, practical skill development, and identity-level insight, we craft bespoke leadership strategies that deliver measurable outcomes. We equip leaders to navigate complexity, build ownership, and create lasting change — not through control, but through clarity, alignment, and example.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
                Our Values
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="bg-card rounded-3xl p-10 border border-border hover:shadow-xl transition-all duration-500"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-2xl text-foreground mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
                What Leaders Say
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
                Our Approach
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-12"
            >
              <div className="bg-card rounded-3xl p-10 border border-border shadow-lg">
                <h3 className="font-bold text-2xl text-foreground mb-4">1. Listen & Understand</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We begin by deeply understanding your unique challenges, goals, and organizational context. 
                  Every engagement starts with listening.
                </p>
              </div>

              <div className="bg-card rounded-3xl p-10 border border-border shadow-lg">
                <h3 className="font-bold text-2xl text-foreground mb-4">2. Design & Strategize</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We craft bespoke strategies tailored to your specific needs, drawing on proven frameworks 
                  and innovative thinking.
                </p>
              </div>

              <div className="bg-card rounded-3xl p-10 border border-border shadow-lg">
                <h3 className="font-bold text-2xl text-foreground mb-4">3. Execute & Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We partner with you through implementation, providing ongoing support and adjusting our 
                  approach as needed to ensure success.
                </p>
              </div>

              <div className="bg-card rounded-3xl p-10 border border-border shadow-lg">
                <h3 className="font-bold text-2xl text-foreground mb-4">4. Measure & Optimize</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We track outcomes, celebrate wins, and continuously refine our strategies to deliver 
                  sustained, measurable results.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
                Our Partners
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We collaborate with leading organizations to deliver comprehensive leadership solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[160px]"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-24 w-auto object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
