import { motion } from "framer-motion";
import { Quote, Star, TrendingUp } from "lucide-react";

interface TestimonialCardProps {
  testimonial: {
    quote: string;
    author: string;
    role: string;
    industry?: string;
    metric?: string;
    companySize?: string;
  };
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <div
      className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      {/* Metric Badge */}
      {testimonial.metric && (
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full w-fit mb-4">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{testimonial.metric}</span>
        </div>
      )}
      
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
        <div className="flex flex-wrap gap-2 mt-2">
          {testimonial.industry && (
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
              {testimonial.industry}
            </span>
          )}
          {testimonial.companySize && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {testimonial.companySize}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
