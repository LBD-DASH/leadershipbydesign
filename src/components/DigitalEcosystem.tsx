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
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Target
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Animated Flow Arrow with elegant styling
function FlowArrow({ direction = "right", delay = 0 }: { direction?: "right" | "down" | "left"; delay?: number }) {
  const isVertical = direction === "down";
  
  return (
    <div className={`flex ${isVertical ? "flex-col py-1" : "px-1"} items-center justify-center`}>
      <motion.div
        className={`flex items-center justify-center ${isVertical ? "flex-col" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
      >
        {/* Animated dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-1.5 h-1.5 rounded-full bg-primary/60 ${isVertical ? "my-0.5" : "mx-0.5"}`}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: delay + i * 0.2,
            }}
          />
        ))}
        <motion.div
          animate={{
            x: direction === "right" ? [0, 3, 0] : direction === "left" ? [0, -3, 0] : 0,
            y: direction === "down" ? [0, 3, 0] : 0,
          }}
          transition={{ duration: 1, repeat: Infinity, delay }}
          className={isVertical ? "mt-0.5" : "ml-0.5"}
        >
          {direction === "right" && <ChevronRight className="w-4 h-4 text-primary" />}
          {direction === "down" && <ChevronDown className="w-4 h-4 text-primary" />}
          {direction === "left" && <ChevronLeft className="w-4 h-4 text-primary" />}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Flow Node with glassmorphism and refined styling
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
    primary: "bg-gradient-to-br from-primary/95 to-primary text-primary-foreground shadow-lg shadow-primary/15 border border-primary/20",
    accent: "bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-xl shadow-primary/20 border border-white/10",
    default: "bg-card/80 backdrop-blur-sm text-card-foreground border border-border/50 shadow-sm hover:shadow-md"
  };

  const Wrapper = external ? 'a' : Link;
  const wrapperProps = external 
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { to: href };

  return (
    <Wrapper {...wrapperProps as any} className="block group relative">
      {step && (
        <motion.div 
          className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-lg z-10 ring-2 ring-background"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: step * 0.1 }}
        >
          {step}
        </motion.div>
      )}
      <motion.div 
        className={`rounded-xl p-4 transition-all duration-300 ${variants[variant]} group-hover:translate-y-[-2px]`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${variant === "default" ? "bg-primary/10" : "bg-white/15"} transition-colors`}>
            <Icon className={`w-5 h-5 ${variant === "default" ? "text-primary" : "text-current"}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm leading-tight">{title}</h4>
            {subtitle && (
              <p className={`text-xs leading-tight mt-0.5 ${variant === "default" ? "text-muted-foreground" : "text-white/70"}`}>{subtitle}</p>
            )}
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${variant === "default" ? "text-primary" : "text-white/70"}`} />
        </div>
      </motion.div>
    </Wrapper>
  );
}

// Assessment Stack with refined card design
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
        <motion.div 
          className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-lg z-10 ring-2 ring-background"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: step * 0.1 }}
        >
          {step}
        </motion.div>
      )}
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-secondary via-secondary/80 to-secondary px-4 py-2.5 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary/10">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">Self-Discovery Tools</span>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {items.map((item, i) => {
            const Wrapper = item.external ? 'a' : Link;
            const props = item.external 
              ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
              : { to: item.href };
            return (
              <motion.div 
                key={i} 
                whileHover={{ x: 2, backgroundColor: "hsl(var(--secondary) / 0.3)" }}
                transition={{ duration: 0.15 }}
              >
                <Wrapper {...props as any} className="flex items-center gap-3 px-4 py-2.5 transition-colors group">
                  <div className="p-1.5 rounded-lg bg-primary/8 group-hover:bg-primary/15 transition-colors">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground/90">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Leadership Levels Grid with refined styling
function LevelsGrid({ step }: { step?: number }) {
  const levels = [
    { level: 1, title: "Productivity", icon: CheckCircle2, color: "from-teal-500 to-teal-600" },
    { level: 2, title: "Development", icon: TrendingUp, color: "from-sky-500 to-sky-600" },
    { level: 3, title: "Purpose-Led", icon: Lightbulb, color: "from-violet-500 to-violet-600" },
    { level: 4, title: "Motivational", icon: Heart, color: "from-rose-500 to-rose-600" },
    { level: 5, title: "Strategic", icon: Rocket, color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="relative">
      {step && (
        <motion.div 
          className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-lg z-10 ring-2 ring-background"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: step * 0.1 }}
        >
          {step}
        </motion.div>
      )}
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-secondary via-secondary/80 to-secondary px-4 py-2.5 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary/10">
              <Layers className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">5 Leadership Levels</span>
          </div>
        </div>
        <div className="p-2.5 space-y-1">
          {levels.map((l) => (
            <Link key={l.level} to="/leadership-levels">
              <motion.div 
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/30 transition-colors group"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${l.color} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                  L{l.level}
                </div>
                <span className="text-xs font-medium text-foreground/90 group-hover:text-primary transition-colors">{l.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Leader Hub with enhanced visual design
function LeaderHub({ step }: { step?: number }) {
  return (
    <div className="relative">
      {step && (
        <motion.div 
          className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-lg z-10 ring-2 ring-background"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          {step}
        </motion.div>
      )}
      <motion.div 
        className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/85 shadow-xl shadow-primary/25 flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden border border-white/10"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <div className="p-2.5 rounded-xl bg-white/15 mb-1.5">
            <Crown className="w-6 h-6" />
          </div>
        </motion.div>
        <span className="text-[10px] uppercase tracking-wider opacity-70 relative z-10">Leader</span>
        <span className="text-xl font-bold relative z-10">YOU</span>
        <div className="flex items-center gap-1 mt-1 relative z-10">
          <Target className="w-2.5 h-2.5 opacity-60" />
          <span className="text-[9px] opacity-60">Contagious Identity</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function DigitalEcosystem() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section className="py-16 px-4 lg:px-8 bg-gradient-to-b from-background via-secondary/10 to-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Your Development Journey
          </motion.div>
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Digital Ecosystem
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-sm max-w-xl mx-auto"
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
          {/* Row 1: Left to Right */}
          <div className="flex items-center justify-center gap-0 mb-3">
            <motion.div variants={itemVariants} className="flex-shrink-0">
              <LeaderHub step={1} />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="right" delay={0} /></motion.div>

            <motion.div variants={itemVariants} className="flex-shrink-0 w-48">
              <AssessmentStack step={2} />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="right" delay={0.2} /></motion.div>

            <motion.div variants={itemVariants} className="flex-shrink-0 w-48">
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

          {/* Connector */}
          <div className="flex justify-end pr-24 mb-3">
            <FlowArrow direction="down" delay={0.4} />
          </div>

          {/* Row 2: Right to Left */}
          <div className="flex items-center justify-center gap-0 flex-row-reverse">
            <motion.div variants={itemVariants} className="flex-shrink-0 w-56">
              <LevelsGrid step={4} />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="left" delay={0.5} /></motion.div>

            <motion.div variants={itemVariants} className="flex-shrink-0 w-40">
              <FlowNode
                icon={MessageCircle}
                title="Executive Coaching"
                subtitle="1-on-1 guidance"
                href="/executive-coaching"
                variant="primary"
                step={5}
              />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="left" delay={0.6} /></motion.div>

            <motion.div variants={itemVariants} className="flex-shrink-0 w-40">
              <FlowNode
                icon={Rocket}
                title="SHIFT Programme"
                subtitle="Full transformation"
                href="/shift-methodology"
                variant="primary"
                step={6}
              />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow direction="left" delay={0.7} /></motion.div>

            <motion.div variants={itemVariants} className="flex-shrink-0 w-40">
              <FlowNode
                icon={Users}
                title="Team Diagnostic"
                subtitle="Team alignment"
                href="/team-diagnostic"
                variant="default"
                step={7}
              />
            </motion.div>
          </div>

          {/* Bottom Outcome */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 max-w-2xl mx-auto"
          >
            <motion.div 
              className="bg-gradient-to-r from-primary/95 via-primary to-primary/95 text-primary-foreground py-4 px-6 rounded-xl text-center shadow-lg shadow-primary/15 relative overflow-hidden border border-white/10"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_40%)]" />
              <div className="relative z-10 flex items-center justify-center gap-2.5">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-base font-bold">Contagious Leadership Identity</span>
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.25 }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </div>
              <p className="text-xs text-white/70 mt-1 relative z-10">Transform into a leader who inspires and creates lasting impact</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile Flow */}
        <motion.div 
          className="lg:hidden space-y-1"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <LeaderHub step={1} />
          </motion.div>

          <FlowArrow direction="down" delay={0} />

          <motion.div variants={itemVariants}>
            <AssessmentStack step={2} />
          </motion.div>

          <FlowArrow direction="down" delay={0.1} />

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

          <motion.div variants={itemVariants}>
            <LevelsGrid step={4} />
          </motion.div>

          <FlowArrow direction="down" delay={0.3} />

          <motion.div variants={itemVariants}>
            <FlowNode
              icon={MessageCircle}
              title="Executive Coaching"
              subtitle="1-on-1 guidance"
              href="/executive-coaching"
              variant="primary"
              step={5}
            />
          </motion.div>

          <FlowArrow direction="down" delay={0.4} />

          <motion.div variants={itemVariants}>
            <FlowNode
              icon={Rocket}
              title="SHIFT Programme"
              subtitle="Full transformation"
              href="/shift-methodology"
              variant="primary"
              step={6}
            />
          </motion.div>

          <FlowArrow direction="down" delay={0.5} />

          <motion.div variants={itemVariants}>
            <FlowNode
              icon={Users}
              title="Team Diagnostic"
              subtitle="Team alignment"
              href="/team-diagnostic"
              variant="default"
              step={7}
            />
          </motion.div>

          {/* Bottom Outcome */}
          <motion.div variants={itemVariants} className="pt-4">
            <div className="bg-gradient-to-r from-primary/95 via-primary to-primary/95 text-primary-foreground py-4 px-5 rounded-xl text-center shadow-lg shadow-primary/15 border border-white/10">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">Contagious Leadership Identity</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs text-white/70 mt-1">Transform into a leader who inspires</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
