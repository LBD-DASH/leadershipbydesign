import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  industry: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Kevin's coaching completely transformed how I approach leadership. His insights into conscious leadership helped me build a more engaged, high-performing team. The results have been remarkable.",
    author: "Sarah Mitchell",
    role: "CEO, Tech Innovations Ltd",
    industry: "Technology"
  },
  {
    quote: "The SHIFT Leadership Programme was exactly what our management team needed. Kevin's approach is practical, insightful, and immediately applicable. We've seen measurable improvements in team cohesion and performance.",
    author: "David Thompson",
    role: "Managing Director",
    industry: "Manufacturing"
  },
  {
    quote: "Working with Kevin has been transformative for both me personally and our organization. His ability to identify blind spots and provide actionable strategies is exceptional. Highly recommend to any leader looking to elevate their impact.",
    author: "Priya Naidoo",
    role: "Executive Director",
    industry: "Non-Profit Sector"
  },
  {
    quote: "Kevin's training design for our team was outstanding. He understood our challenges and delivered a customized program that addressed our specific needs. The tools and frameworks we learned continue to drive our success.",
    author: "Michael van der Berg",
    role: "Head of Operations",
    industry: "Logistics"
  },
  {
    quote: "The coaching sessions with Kevin provided clarity and direction when I needed it most. His questions challenged my thinking and helped me see possibilities I hadn't considered. A truly valuable investment in my leadership development.",
    author: "Nomsa Dlamini",
    role: "Senior Manager",
    industry: "Financial Services"
  },
  {
    quote: "Leadership by Design delivered exceptional results for our organization. Kevin's expertise in building effective, empowered leaders is evident in every interaction. Our leadership team is stronger and more aligned than ever.",
    author: "James Robertson",
    role: "Chief People Officer",
    industry: "Retail"
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
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="bg-card rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 relative"
            >
              <Quote className="w-12 h-12 md:w-16 md:h-16 text-primary/20 mb-6" />
              
              <blockquote className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed mb-8 font-light italic">
                "{testimonials[current].quote}"
              </blockquote>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-semibold text-xl text-foreground">
                    {testimonials[current].author}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[current].role}
                  </div>
                  <div className="text-sm text-muted-foreground/80">
                    {testimonials[current].industry}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

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
