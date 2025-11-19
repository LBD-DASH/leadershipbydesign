import { motion } from "framer-motion";

export default function Philosophy() {
  return (
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
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We believe that exceptional leadership is not innate—it is designed. Our unique approach 
            focuses on crafting bespoke strategies and delivering measurable outcomes, empowering 
            leaders to navigate complexity and inspire lasting change.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
