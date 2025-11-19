import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  testimonial: {
    quote: string;
    author: string;
    role: string;
    industry?: string;
  };
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>
      
      <Quote className="w-10 h-10 text-primary/20 mb-4" />
      
      <p className="text-muted-foreground leading-relaxed mb-6 flex-1 italic">
        "{testimonial.quote}"
      </p>
      
      <div className="pt-4 border-t border-border">
        <p className="font-bold text-foreground mb-1">
          {testimonial.author}
        </p>
        <p className="text-sm text-primary font-medium">
          {testimonial.role}
        </p>
        {testimonial.industry && (
          <p className="text-sm text-muted-foreground mt-1">
            {testimonial.industry}
          </p>
        )}
      </div>
    </motion.div>
  );
}
