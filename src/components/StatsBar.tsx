import { motion } from "framer-motion";

const stats = [
  { value: "11", label: "Years" },
  { value: "25+", label: "Programmes Implemented" },
  { value: "4,000+", label: "Leaders Impacted" },
  { value: "30+", label: "Organisations" },
  { value: "6", label: "Proprietary Methodologies" },
];

export default function StatsBar() {
  return (
    <section
      className="py-8 sm:py-12 bg-primary/5 border-y border-primary/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-14">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
