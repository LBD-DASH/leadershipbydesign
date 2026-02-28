import { motion } from "framer-motion";

const quadrants = [
  {
    title: "Agreement",
    description: "Mapping your current identity landscape — how you see yourself vs. how others experience you.",
    tags: ["360° Identity Assessment", "Values Excavation", "Stakeholder Perception Mapping"],
    delay: 0.5,
    align: "items-start text-left",
    padding: "pt-10 sm:pt-12 pb-32 sm:pb-36 pl-6 sm:pl-8 pr-20 sm:pr-28",
    title: "Awareness",
    description: "Defining the identity you want to transmit and identifying the gaps.",
    tags: ["Core Identity Definition", "Behavioural Blueprint", "Gap Analysis"],
    delay: 0.65,
  },
  {
    title: "Action",
    description: "Practising identity-congruent leadership in real situations.",
    tags: ["Scenario Practice", "Real-time Application", "Feedback Integration"],
    delay: 0.8,
  },
  {
    title: "Accountability",
    description: "Embedding your contagious identity into systems and succession.",
    tags: ["System Integration", "Succession Planning", "Legacy Mapping"],
    delay: 0.95,
  },
];

const shiftSkills = [
  { initial: "S", label: "elf-Management" },
  { initial: "H", label: "uman Intelligence" },
  { initial: "I", label: "nnovation" },
  { initial: "F", label: "ocus" },
  { initial: "T", label: "hinking Creatively" },
];

const foundations = [
  "Cultivates Trust & Safety",
  "Maintains Presence",
  "Facilitates Client Growth",
];

const phaseNumbers = ["01", "02", "03", "04"];

export default function A4CoachingModel() {
  return (
    <section className="py-16 sm:py-24 bg-primary overflow-hidden">
      <div className="container mx-auto px-5 sm:px-4">
        <div className="max-w-[960px] mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-7"
          >
            <p className="font-sans font-semibold text-[11px] tracking-[5px] uppercase text-primary-foreground/70 mb-1.5">
              Leadership by Design
            </p>
            <h2 className="font-serif font-extrabold text-[22px] sm:text-[28px] text-primary-foreground tracking-wide">
              The <span className="text-primary-foreground">Contagious Identity</span>{" "}
              <span className="text-white/90">Coaching Model</span>
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent mx-auto mt-2.5" />
          </motion.div>

          {/* Top Axis */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center mb-3.5"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary-foreground/30" />
            <span className="font-serif font-bold text-[15px] text-primary-foreground px-5 whitespace-nowrap">
              Active Listening
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary-foreground/30" />
          </motion.div>

          {/* Main Model */}
          <div className="flex items-stretch">
            {/* Left Side Label */}
            <div className="flex items-center justify-center w-[34px] sm:w-[46px] shrink-0">
              <span className="font-serif font-bold text-[11px] sm:text-[13px] text-primary-foreground tracking-wider whitespace-nowrap -rotate-90">
                <span className="text-white font-extrabold">Powerful</span> Questioning
              </span>
            </div>

            {/* Grid Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="flex-1 grid grid-cols-2 grid-rows-2 gap-[2px] bg-primary rounded-2xl border-2 border-primary-foreground/25 overflow-hidden relative"
              style={{ minHeight: 580 }}
            >
              {/* Phase Numbers - positioned outside corners */}
              <span className="absolute -top-9 left-2 font-serif font-black text-[28px] text-primary-foreground/60 pointer-events-none z-[5] hidden sm:block">01</span>
              <span className="absolute -top-9 right-2 font-serif font-black text-[28px] text-primary-foreground/60 pointer-events-none z-[5] hidden sm:block">02</span>
              <span className="absolute -bottom-9 left-2 font-serif font-black text-[28px] text-primary-foreground/60 pointer-events-none z-[5] hidden sm:block">03</span>
              <span className="absolute -bottom-9 right-2 font-serif font-black text-[28px] text-primary-foreground/60 pointer-events-none z-[5] hidden sm:block">04</span>

              {quadrants.map((q, i) => (
                <motion.div
                  key={q.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: q.delay }}
                  className="bg-gradient-to-br from-primary/90 to-primary flex flex-col items-center justify-start text-center relative overflow-hidden hover:from-primary/70 hover:to-primary/80 transition-all duration-300 cursor-default"
                  style={{ padding: '44px 22px 28px' }}
                >
                  {/* Subtle radial glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] hover:bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)] transition-opacity" />

                  <h3 className="font-serif font-bold text-[18px] sm:text-[22px] text-primary-foreground mb-1.5 relative z-[1]">
                    {q.title}
                  </h3>
                  <p className="font-sans text-[10.5px] sm:text-[11.5px] text-primary-foreground/60 text-center leading-[1.55] max-w-[210px] mb-3.5 relative z-[1]">
                    {q.description}
                  </p>
                  <div className="flex flex-wrap gap-[5px] justify-center relative z-[1]">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans font-semibold text-[8px] sm:text-[9px] tracking-wider uppercase text-primary-foreground/80 border border-primary-foreground/20 rounded-full px-2.5 py-1 bg-primary-foreground/[0.04] hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Center Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.65 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 15 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] bg-primary border-2 border-primary-foreground/25 rounded-full flex flex-col items-center justify-center text-center p-4"
                style={{
                  boxShadow: '0 0 0 6px hsl(var(--primary)), 0 0 40px rgba(255,255,255,0.06), 0 10px 40px rgba(0,0,0,0.45)',
                }}
              >
                <span className="font-sans font-semibold text-[8px] tracking-[3px] uppercase text-primary-foreground/70 mb-0.5">
                  LBD's
                </span>
                <span className="font-serif font-extrabold text-[14px] sm:text-[17px] text-primary-foreground leading-tight mb-1.5">
                  <span className="text-white/90">A4</span> Model
                </span>
                <div className="w-9 h-px bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent mb-2" />
                <span className="font-sans font-bold text-[9px] tracking-[3px] uppercase text-primary-foreground/70 mb-1">
                  SHIFT Skills
                </span>
                <ul className="list-none p-0 m-0">
                  {shiftSkills.map((s) => (
                    <li key={s.initial} className="font-sans font-medium text-[8px] sm:text-[9px] text-primary-foreground/55 leading-[1.7] tracking-wider">
                      <span className="text-white font-bold text-[9px] sm:text-[10px] inline-block w-2.5">
                        {s.initial}
                      </span>
                      {s.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Right Side Label */}
            <div className="flex items-center justify-center w-[34px] sm:w-[46px] shrink-0">
              <span className="font-serif font-bold text-[11px] sm:text-[13px] text-primary-foreground tracking-wider whitespace-nowrap rotate-90">
                <span className="text-white font-extrabold">Direct</span> Communication
              </span>
            </div>
          </div>

          {/* Bottom Axis */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center mt-3.5"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary-foreground/30" />
            <span className="font-serif font-bold text-[15px] text-primary-foreground px-5 whitespace-nowrap">
              Facilitates Client Growth
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary-foreground/30" />
          </motion.div>

          {/* Foundation */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 }}
            className="mt-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {foundations.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 && <span className="text-primary-foreground/30 text-base">·</span>}
                  <span className="font-sans font-semibold text-[11px] tracking-[1.5px] uppercase text-primary-foreground/80 border border-primary-foreground/20 rounded-full px-[18px] py-[7px] bg-primary-foreground/[0.04] hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
            className="mt-6 text-center"
          >
            <p className="font-serif font-bold text-sm text-primary-foreground tracking-wider">
              Leadership <span className="text-white/70">by</span> Design
            </p>
            <p className="font-sans text-[10px] text-primary-foreground/30 tracking-wider mt-0.5">
              leadershipbydesign.co
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
