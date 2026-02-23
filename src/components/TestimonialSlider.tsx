import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestimonialCard from "./TestimonialCard";

const stats = [
  { icon: TrendingUp, value: "40%", label: "average productivity increase" },
  { icon: Zap, value: "35%", label: "faster decision-making" },
  { icon: Users, value: "50%", label: "reduction in team conflict" },
];

const testimonials = [
  {
    quote: "Within 3 months, our team productivity increased 40%. Kevin's coaching completely transformed how I approach leadership and helped me build a truly high-performing team.",
    author: "Sarah Mitchell",
    role: "CEO, Tech Innovations Ltd",
    industry: "Technology",
    metric: "40% productivity increase",
    companySize: "200+ employees",
  },
  {
    quote: "The SHIFT programme delivered a 50% reduction in team conflict within 60 days. Kevin's approach is practical, insightful, and immediately applicable.",
    author: "David Thompson",
    role: "Managing Director",
    industry: "Manufacturing",
    metric: "50% less team conflict",
    companySize: "500+ employees",
  },
  {
    quote: "Our turnover dropped from 35% to 15% after Kevin's intervention. His ability to identify blind spots and provide actionable strategies saved us over $500K in recruitment costs.",
    author: "Priya Naidoo",
    role: "Executive Director",
    industry: "Non-Profit Sector",
    metric: "$500K saved in recruitment",
    companySize: "300+ employees",
  },
  {
    quote: "Decision-making speed improved 35% across our leadership team. The tools and frameworks we learned continue to drive our success 18 months later.",
    author: "Michael van der Berg",
    role: "Head of Operations",
    industry: "Logistics",
    metric: "35% faster decisions",
    companySize: "400+ employees",
  },
  {
    quote: "My strategic clarity doubled in 90 days. Kevin's coaching provided the focus and direction I needed to take our company to the next level.",
    author: "Nomsa Dlamini",
    role: "Senior Manager",
    industry: "Financial Services",
    metric: "2x strategic clarity",
    companySize: "800+ employees",
  },
  {
    quote: "We now fill 80% of senior roles internally, up from just 10%. Kevin's expertise in building leadership pipelines transformed our succession planning.",
    author: "James Robertson",
    role: "Chief People Officer",
    industry: "Retail",
    metric: "80% internal promotions",
    companySize: "1000+ employees",
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => { setDirection(1); setCurrent((p) => (p + 1) % testimonials.length); };
  const prev = () => { setDirection(-1); setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length); };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 600 : -600, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 600 : -600, opacity: 0 }),
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            What Our Clients Say
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground">Results our clients report within 90 days:</p>
        </div>

        {/* Stat callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="text-center">
                <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-3xl font-serif font-bold text-accent">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              <TestimonialCard testimonial={testimonials[current]} index={0} />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full w-10 h-10">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-accent w-6" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full w-10 h-10">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
