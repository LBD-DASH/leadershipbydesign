import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

export default function ServiceCard({ title, description, image, index }: ServiceCardProps) {
  const isEven = index % 2 === 0;
  
  // Determine link destination based on service title
  const getLinkDestination = () => {
    if (title === "SHIFT Leadership Development") {
      return "/leadership-levels";
    }
    return "/programmes";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group"
    >
      <div className={`bg-card rounded-2xl md:rounded-3xl shadow-lg border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 ${
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } flex flex-col lg:flex`}>
        {/* Image */}
        <div className="lg:w-2/5 w-full h-56 sm:h-64 lg:h-auto relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="lg:w-3/5 w-full p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4 md:mb-6 text-base sm:text-lg">
            {description}
          </p>
          <Link to={getLinkDestination()}>
            <button className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group/btn text-base sm:text-lg">
              Learn More
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
