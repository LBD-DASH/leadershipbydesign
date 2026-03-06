import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  industry: string;
  metric?: string;
  companySize?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Within 3 months, our team productivity increased 40%. Kevin's coaching completely transformed how I approach leadership and helped me build a truly high-performing team.",
    author: "Sarah Mitchell",
    role: "CEO, Tech Innovations Ltd",
    industry: "Technology",
    metric: "40% productivity increase",
    companySize: "200+ employees"
  },
  {
    quote: "The SHIFT programme delivered a 50% reduction in team conflict within 60 days. Kevin's approach is practical, insightful, and immediately applicable.",
    author: "David Thompson",
    role: "Managing Director",
    industry: "Manufacturing",
    metric: "50% less team conflict",
    companySize: "500+ employees"
  },
  {
    quote: "Our turnover dropped from 35% to 15% after Kevin's intervention. His ability to identify blind spots and provide actionable strategies saved us over $500K in recruitment costs.",
    author: "Priya Naidoo",
    role: "Executive Director",
    industry: "Non-Profit Sector",
    metric: "$500K saved in recruitment",
    companySize: "300+ employees"
  },
  {
    quote: "Decision-making speed improved 35% across our leadership team. The tools and frameworks we learned continue to drive our success 18 months later.",
    author: "Michael van der Berg",
    role: "Head of Operations",
    industry: "Logistics",
    metric: "35% faster decisions",
    companySize: "400+ employees"
  },
  {
    quote: "My strategic clarity doubled in 90 days. Kevin's coaching provided the focus and direction I needed to take our company to the next level.",
    author: "Nomsa Dlamini",
    role: "Senior Manager",
    industry: "Financial Services",
    metric: "2x strategic clarity",
    companySize: "800+ employees"
  },
  {
    quote: "We now fill 80% of senior roles internally, up from just 10%. Kevin's expertise in building leadership pipelines transformed our succession planning.",
    author: "James Robertson",
    role: "Chief People Officer",
    industry: "Retail",
    metric: "80% internal promotions",
    companySize: "1000+ employees"
  }
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

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
    })
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 sm:mb-6">
            What Our Clients Say
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto" />
        </div>

        <div className="relative overflow-hidden min-h-[280px] sm:min-h-[240px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.35, ease: "easeInOut" },
                opacity: { duration: 0.25 }
              }}
              className="w-full"
            >
              <TestimonialCard testimonial={testimonials[current]} index={0} />
            </motion.div>
          </AnimatePresence>
        </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full w-12 h-12 border-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === current 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full w-12 h-12 border-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
