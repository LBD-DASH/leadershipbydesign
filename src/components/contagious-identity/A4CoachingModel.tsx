import { motion } from "framer-motion";

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

export default function A4CoachingModel() {
  return (
    <section className="py-16 sm:py-24 overflow-hidden bg-primary">
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
            <p className="font-sans font-semibold text-[11px] tracking-[5px] uppercase mb-1.5 text-primary-foreground/70">
              Leadership by Design
            </p>
            <h2 className="font-serif font-extrabold text-[22px] sm:text-[28px] tracking-wide text-primary-foreground">
              The <span className="text-primary-foreground/90">Contagious Identity</span> Coaching Model
            </h2>
            <div
              className="w-20 h-0.5 mx-auto mt-2.5"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(200, 70%, 80%), transparent)' }}
            />
          </motion.div>

          {/* Top Axis */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center mb-3.5"
          >
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(200, 70%, 70%))' }} />
            <span className="font-serif font-bold text-[15px] px-5 whitespace-nowrap text-primary-foreground">
              Active Listening
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, hsl(200, 70%, 70%), transparent)' }} />
          </motion.div>

          {/* Main Model */}
          <div className="flex items-stretch">
            {/* Left Side Label */}
            <div className="flex items-center justify-center w-[34px] sm:w-[46px] shrink-0">
              <span
                className="font-serif font-bold text-[11px] sm:text-[13px] tracking-wider whitespace-nowrap -rotate-90 text-primary-foreground"
                style={{ letterSpacing: '2px' }}
              >
                <span className="font-extrabold text-primary-foreground/90">Powerful</span> Questioning
              </span>
            </div>

            {/* Grid Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="flex-1 grid grid-cols-2 grid-rows-2 gap-[2px] rounded-2xl overflow-hidden relative"
              style={{
                minHeight: 580,
                border: '2px solid hsl(200, 70%, 70%)',
                background: 'hsl(200, 70%, 35%)',
              }}
            >
              {/* Quadrant 1 - Agreement (top-left) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center text-center relative overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(145deg, hsl(200, 70%, 45%), hsl(200, 70%, 35%))',
                  padding: '44px 22px 28px',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, hsla(200, 70%, 80%, 0.08) 0%, transparent 70%)' }} />
                <span className="font-serif font-bold text-[28px] text-primary-foreground/20 absolute top-3 left-4 z-[1]">01</span>
                <h3 className="font-serif font-bold text-[18px] sm:text-[22px] mb-1.5 relative z-[1] text-primary-foreground">
                  Agreement
                </h3>
                <p className="font-sans text-[10.5px] sm:text-[11.5px] text-center leading-[1.55] max-w-[210px] mb-3.5 relative z-[1] text-primary-foreground/80">
                  Mapping your current identity landscape — how you see yourself vs. how others experience you.
                </p>
                <div className="flex flex-wrap gap-[5px] justify-center relative z-[1]">
                  {["360° Identity Assessment", "Values Excavation", "Stakeholder Perception Mapping"].map((tag) => (
                    <span key={tag} className="font-sans font-semibold text-[8px] sm:text-[9px] tracking-wider uppercase rounded-full px-2.5 py-1 whitespace-nowrap transition-all text-primary-foreground/80 border border-primary-foreground/20 bg-primary-foreground/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Quadrant 2 - Awareness (top-right) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65 }}
                className="flex flex-col items-center text-center relative overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(145deg, hsl(200, 70%, 45%), hsl(200, 70%, 35%))',
                  padding: '44px 22px 28px',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, hsla(200, 70%, 80%, 0.08) 0%, transparent 70%)' }} />
                <span className="font-serif font-bold text-[28px] text-primary-foreground/20 absolute top-3 right-4 z-[1]">02</span>
                <h3 className="font-serif font-bold text-[18px] sm:text-[22px] mb-1.5 relative z-[1] text-primary-foreground">
                  Awareness
                </h3>
                <p className="font-sans text-[10.5px] sm:text-[11.5px] text-center leading-[1.55] max-w-[210px] mb-3.5 relative z-[1] text-primary-foreground/80">
                  Defining the identity you want to transmit and identifying the gaps.
                </p>
                <div className="flex flex-wrap gap-[5px] justify-center relative z-[1]">
                  {["Core Identity Definition", "Behavioural Blueprint", "Gap Analysis"].map((tag) => (
                    <span key={tag} className="font-sans font-semibold text-[8px] sm:text-[9px] tracking-wider uppercase rounded-full px-2.5 py-1 whitespace-nowrap transition-all text-primary-foreground/80 border border-primary-foreground/20 bg-primary-foreground/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Quadrant 3 - Action (bottom-left) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center justify-end text-center relative overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(145deg, hsl(200, 70%, 45%), hsl(200, 70%, 35%))',
                  padding: '28px 22px 44px',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, hsla(200, 70%, 80%, 0.08) 0%, transparent 70%)' }} />
                <span className="font-serif font-bold text-[28px] text-primary-foreground/20 absolute bottom-3 left-4 z-[1]">03</span>
                <h3 className="font-serif font-bold text-[18px] sm:text-[22px] mb-1.5 relative z-[1] text-primary-foreground">
                  Action
                </h3>
                <p className="font-sans text-[10.5px] sm:text-[11.5px] text-center leading-[1.55] max-w-[210px] mb-3.5 relative z-[1] text-primary-foreground/80">
                  Practising identity-congruent leadership in real situations.
                </p>
                <div className="flex flex-wrap gap-[5px] justify-center relative z-[1]">
                  {["Scenario Practice", "Real-time Application", "Feedback Integration"].map((tag) => (
                    <span key={tag} className="font-sans font-semibold text-[8px] sm:text-[9px] tracking-wider uppercase rounded-full px-2.5 py-1 whitespace-nowrap transition-all text-primary-foreground/80 border border-primary-foreground/20 bg-primary-foreground/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Quadrant 4 - Accountability (bottom-right) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.95 }}
                className="flex flex-col items-center justify-end text-center relative overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(145deg, hsl(200, 70%, 45%), hsl(200, 70%, 35%))',
                  padding: '28px 22px 44px',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, hsla(200, 70%, 80%, 0.08) 0%, transparent 70%)' }} />
                <h3 className="font-serif font-bold text-[18px] sm:text-[22px] mb-1.5 relative z-[1] text-primary-foreground">
                  Accountability
                </h3>
                <p className="font-sans text-[10.5px] sm:text-[11.5px] text-center leading-[1.55] max-w-[210px] mb-3.5 relative z-[1] text-primary-foreground/80">
                  Embedding your contagious identity into systems and succession.
                </p>
                <div className="flex flex-wrap gap-[5px] justify-center relative z-[1]">
                  {["System Integration", "Succession Planning", "Legacy Mapping"].map((tag) => (
                    <span key={tag} className="font-sans font-semibold text-[8px] sm:text-[9px] tracking-wider uppercase rounded-full px-2.5 py-1 whitespace-nowrap transition-all text-primary-foreground/80 border border-primary-foreground/20 bg-primary-foreground/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Center Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.65 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 15 }}
                className="absolute inset-0 m-auto z-10 w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] rounded-full flex flex-col items-center justify-center text-center p-4"
                style={{
                  background: 'hsl(200, 70%, 35%)',
                  border: '2px solid hsl(200, 70%, 70%)',
                  boxShadow: '0 0 0 6px hsl(200, 70%, 35%), 0 0 40px hsla(200, 70%, 70%, 0.18), 0 10px 40px rgba(0,0,0,0.45)',
                }}
              >
                <span className="font-sans font-semibold text-[8px] tracking-[3px] uppercase mb-0.5 text-primary-foreground/70">
                  LBD's
                </span>
                <span className="font-serif font-extrabold text-[14px] sm:text-[17px] leading-tight mb-1.5 text-primary-foreground">
                  <span className="text-primary-foreground/90">A4</span> Model
                </span>
                <div className="w-9 h-px mb-2" style={{ background: 'linear-gradient(90deg, transparent, hsl(200, 70%, 70%), transparent)' }} />
                <span className="font-sans font-bold text-[9px] tracking-[3px] uppercase mb-1 text-primary-foreground/70">
                  SHIFT Skills
                </span>
                <ul className="list-none p-0 m-0">
                  {shiftSkills.map((s) => (
                    <li key={s.initial} className="font-sans font-medium text-[8px] sm:text-[9px] leading-[1.7] tracking-wider text-primary-foreground/80">
                      <span className="font-bold text-[9px] sm:text-[10px] inline-block w-2.5 text-primary-foreground">
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
              <span
                className="font-serif font-bold text-[11px] sm:text-[13px] tracking-wider whitespace-nowrap rotate-90 text-primary-foreground"
                style={{ letterSpacing: '2px' }}
              >
                <span className="font-extrabold text-primary-foreground/90">Direct</span> Communication
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
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(200, 70%, 70%))' }} />
            <span className="font-serif font-bold text-[15px] px-5 whitespace-nowrap text-primary-foreground">
              Facilitates Client Growth
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, hsl(200, 70%, 70%), transparent)' }} />
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
                  {i > 0 && <span className="text-base text-primary-foreground/30">·</span>}
                  <span className="font-sans font-semibold text-[11px] tracking-[1.5px] uppercase rounded-full px-[18px] py-[7px] transition-all text-primary-foreground/80 border border-primary-foreground/20 bg-primary-foreground/5">
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
            <p className="font-serif font-bold text-sm tracking-wider text-primary-foreground">
              Leadership <span className="text-primary-foreground/60">by</span> Design
            </p>
            <p className="font-sans text-[10px] tracking-wider mt-0.5 text-primary-foreground/40">
              leadershipbydesign.co
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
