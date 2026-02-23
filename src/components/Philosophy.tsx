import { motion } from "framer-motion";

export default function Philosophy() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
  );
}
