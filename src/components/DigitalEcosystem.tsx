import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Compass, 
  Heart, 
  Zap,
  Crown,
  Sparkles,
  BarChart3,
  Layers,
  Users,
  MessageCircle,
  Rocket,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  ArrowLeft
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Animated Flow Arrow
function FlowArrow({ direction = "right", delay = 0 }: { direction?: "right" | "down" | "left"; delay?: number }) {
  const pulseVariants = {
    animate: {
      opacity: [0.4, 1, 0.4],
      scale: [0.95, 1.05, 0.95],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay
      }
    }
  };

  const flowVariants = {
    animate: {
      x: direction === "right" ? [0, 4, 0] : direction === "left" ? [0, -4, 0] : 0,
      y: direction === "down" ? [0, 4, 0] : 0,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay
      }
    }
  };

  const icons = {
    right: ArrowRight,
    down: ArrowDown,
    left: ArrowLeft
  };
  const Icon = icons[direction];

  const containerClass = direction === "down" 
    ? "flex flex-col items-center py-2" 
    : "flex items-center px-2";

  const lineClass = direction === "down"
    ? "w-0.5 h-8 bg-gradient-to-b from-primary/60 via-primary to-primary/60 rounded-full"
    : direction === "right"
    ? "w-10 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
    : "w-10 h-0.5 bg-gradient-to-l from-primary/60 via-primary to-primary/60 rounded-full";

  return (
    <div className={containerClass}>
      <motion.div 
        className={lineClass}
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div
        variants={flowVariants}
        animate="animate"
        className={direction === "down" ? "-mt-1" : "-ml-1"}
      >
        <Icon className="w-5 h-5 text-primary" />
      </motion.div>
    </div>
  );
}

// Flow Node with glow effect
function FlowNode({ 
  icon: Icon, 
  title, 
  subtitle,
  href,
  external = false,
  variant = "default",
  step
}: { 
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "accent" | "default";
  step?: number;
}) {
  const variants = {
    primary: "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
    accent: "bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 ring-2 ring-primary/20",
    default: "bg-card text-card-foreground border border-border shadow-md hover:shadow-lg hover:border-primary/30"
  };

  const Wrapper = external ? 'a' : Link;
  const wrapperProps = external 
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { to: href };

  return (
    <Wrapper {...wrapperProps as any} className="block group relative">
      {step && (
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
          {step}
        </div>
      )}
      <motion.div 
        className={`rounded-xl p-4 transition-all duration-300 ${variants[variant]}`}
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variant === "default" ? "bg-primary/10" : "bg-white/20"}`}>
            <Icon className={`w-5 h-5 ${variant === "default" ? "text-primary" : "text-current"}`} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm leading-tight">{title}</h4>
            {subtitle && (
              <p className={`text-xs leading-tight mt-0.5 ${variant === "default" ? "text-muted-foreground" : "opacity-75"}`}>{subtitle}</p>
            )}
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
}

// Assessment Stack with hover effects
function AssessmentStack({ step }: { step?: number }) {
  const items = [
    { icon: Crown, label: "Leadership Index", href: "/leadership-levels", external: false },
    { icon: Heart, label: "Values Assessment", href: "https://valuesblueprint.online", external: true },
    { icon: Zap, label: "6 Human Needs", href: "https://6humanneeds.online", external: true },
    { icon: Compass, label: "Purpose Discovery", href: "https://findmypurpose.me", external: true },
  ];

  return (
    <div className="relative">
      {step && (
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
          {step}
        </div>
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Self-Discovery</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {items.map((item, i) => {
            const Wrapper = item.external ? 'a' : Link;
            const props = item.external 
              ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
              : { to: item.href };
            return (
              <motion.div key={i} whileHover={{ x: 4, backgroundColor: "hsl(var(--secondary) / 0.5)" }}>
                <Wrapper {...props as any} className="flex items-center gap-3 px-4 py-2.5 transition-colors group">
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Leadership Levels Grid
function LevelsGrid({ step }: { step?: number }) {
  const levels = [
    { level: 1, title: "Personal Productivity", icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
    { level: 2, title: "Leadership Development", icon: TrendingUp, color: "from-blue-500 to-blue-600" },
    { level: 3, title: "Purpose-Led Leader", icon: Lightbulb, color: "from-purple-500 to-purple-600" },
    { level: 4, title: "Motivational Leader", icon: Heart, color: "from-rose-500 to-rose-600" },
    { level: 5, title: "Strategic Leader", icon: Rocket, color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="relative">
      {step && (
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
          {step}
        </div>
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">5 Leadership Levels</span>
          </div>
        </div>
        <div className="p-3 space-y-1.5">
          {levels.map((l) => (
            <Link key={l.level} to="/leadership-levels">
              <motion.div 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
                whileHover={{ x: 4 }}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${l.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                  L{l.level}
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{l.title}</span>
                <l.icon className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DigitalEcosystem() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 px-4 lg:px-8 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            Your Development Journey
          </motion.div>
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Digital Ecosystem
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            From self-discovery to leadership mastery — your complete development pathway
          </motion.p>
        </div>

        {/* Desktop Serpentine Flow */}
        <motion.div 
          className="hidden lg:block"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Row 1: Left to Right - Leader → Self Discovery → Diagnostic */}
          <div className="flex items-center justify-center gap-0 mb-4">
            {/* Leader Hub */}
            <motion.div variants={itemVariants} className="flex-shrink-0">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
                  1
                </div>
                <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-2xl shadow-primary/30 flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_60%)]" />
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Crown className="w-8 h-8 mb-1 relative z-10" />
                  </motion.div>
                  <span className="text-xs opacity-80 relative z-10">Leader</span>
                  <span className="text-2xl font-bold relative z-10">YOU</span>
                  <span className="text-[10px] opacity-60 mt-1 relative z-10">Contagious Identity</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="right" delay={0} /></motion.div>

            {/* Self Discovery */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-52">
              <AssessmentStack step={2} />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="right" delay={0.2} /></motion.div>

            {/* Leadership Diagnostic */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-52">
              <FlowNode
                icon={BarChart3}
                title="Leadership Diagnostic"
                subtitle="Assess your current level"
                href="/leadership-diagnostic"
                variant="accent"
                step={3}
              />
            </motion.div>
          </div>

          {/* Connector: Down + Right alignment */}
          <div className="flex justify-end pr-[6.5rem] mb-4">
            <FlowArrow direction="down" delay={0.4} />
          </div>

          {/* Row 2: Right to Left - Team ← SHIFT ← Coaching ← Levels */}
          <div className="flex items-center justify-center gap-0 flex-row-reverse">
            {/* Leadership Levels */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-64">
              <LevelsGrid step={4} />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="left" delay={0.5} /></motion.div>

            {/* Coaching */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-44">
              <FlowNode
                icon={MessageCircle}
                title="Executive Coaching"
                subtitle="1-on-1 sessions"
                href="/executive-coaching"
                variant="primary"
                step={5}
              />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="left" delay={0.6} /></motion.div>

            {/* SHIFT */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-44">
              <FlowNode
                icon={Rocket}
                title="SHIFT Programme"
                subtitle="Complete development"
                href="/shift-methodology"
                variant="primary"
                step={6}
              />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="left" delay={0.7} /></motion.div>

            {/* Team Diagnostic */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-44">
              <FlowNode
                icon={Users}
                title="Team Diagnostic"
                subtitle="Team dynamics"
                href="/team-diagnostic"
                variant="default"
                step={7}
              />
            </motion.div>
          </div>

          {/* Bottom Outcome Bar */}
          <motion.div 
            variants={itemVariants}
            className="mt-10"
          >
            <motion.div 
              className="bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground py-4 px-8 rounded-2xl text-center shadow-xl shadow-primary/20 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="text-lg font-bold">Contagious Leadership Identity</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-sm opacity-80 mt-1 relative z-10">Transform into a leader who inspires, influences, and creates lasting impact</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile Flow */}
        <motion.div 
          className="lg:hidden space-y-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Leader Hub */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
                1
              </div>
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl flex flex-col items-center justify-center text-primary-foreground">
                <Crown className="w-7 h-7 mb-1" />
                <span className="text-xs opacity-80">Leader</span>
                <span className="text-2xl font-bold">YOU</span>
              </div>
            </div>
          </motion.div>

          <FlowArrow direction="down" delay={0} />

          {/* Self Discovery */}
          <motion.div variants={itemVariants}>
            <AssessmentStack step={2} />
          </motion.div>

          <FlowArrow direction="down" delay={0.1} />

          {/* Leadership Diagnostic */}
          <motion.div variants={itemVariants}>
            <FlowNode
              icon={BarChart3}
              title="Leadership Diagnostic"
              subtitle="Assess your current level"
              href="/leadership-diagnostic"
              variant="accent"
              step={3}
            />
          </motion.div>

          <FlowArrow direction="down" delay={0.2} />

          {/* Levels */}
          <motion.div variants={itemVariants}>
            <LevelsGrid step={4} />
          </motion.div>

          <FlowArrow direction="down" delay={0.3} />

          {/* Coaching & SHIFT */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <FlowNode
              icon={MessageCircle}
              title="Coaching"
              subtitle="1-on-1"
              href="/executive-coaching"
              variant="primary"
              step={5}
            />
            <FlowNode
              icon={Rocket}
              title="SHIFT"
              subtitle="Programme"
              href="/shift-methodology"
              variant="primary"
              step={6}
            />
          </motion.div>

          <FlowArrow direction="down" delay={0.4} />

          {/* Team */}
          <motion.div variants={itemVariants}>
            <FlowNode
              icon={Users}
              title="Team Diagnostic"
              subtitle="Evaluate team dynamics"
              href="/team-diagnostic"
              variant="default"
              step={7}
            />
          </motion.div>

          {/* Bottom Bar */}
          <motion.div variants={itemVariants} className="pt-4">
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-4 px-4 rounded-xl text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">Contagious Leadership</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs opacity-80">Transform into an inspiring leader</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
