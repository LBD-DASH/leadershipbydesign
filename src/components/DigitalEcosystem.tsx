import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Compass, 
  Heart, 
  Zap,
  Crown,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
  Users,
  MessageCircle,
  Rocket,
  TrendingUp,
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Compact Flow Node
function FlowNode({ 
  icon: Icon, 
  title, 
  subtitle,
  href,
  external = false,
  variant = "default"
}: { 
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "accent" | "default";
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg",
    default: "bg-card text-card-foreground border border-border"
  };

  const Wrapper = external ? 'a' : Link;
  const wrapperProps = external 
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { to: href };

  return (
    <Wrapper {...wrapperProps as any} className="block group">
      <div className={`rounded-lg p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${variants[variant]}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${variant === "default" ? "bg-primary/10" : "bg-white/20"}`}>
            <Icon className={`w-4 h-4 ${variant === "default" ? "text-primary" : "text-current"}`} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm leading-tight">{title}</h4>
            {subtitle && (
              <p className={`text-xs leading-tight ${variant === "default" ? "text-muted-foreground" : "opacity-70"}`}>{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

// Flow Arrow
function FlowArrow({ direction = "right" }: { direction?: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center py-1">
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-gradient-to-b from-primary/60 to-primary/30" />
          <ChevronRight className="w-4 h-4 text-primary/50 rotate-90 -mt-1" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center px-1">
      <div className="w-6 h-px bg-gradient-to-r from-primary/60 to-primary/30" />
      <ChevronRight className="w-4 h-4 text-primary/50 -ml-1" />
    </div>
  );
}

// Mini Assessment Stack
function AssessmentStack() {
  const items = [
    { icon: Crown, label: "Leadership Index", href: "/leadership-levels", external: false },
    { icon: Heart, label: "Values", href: "https://valuesblueprint.online", external: true },
    { icon: Zap, label: "6 Human Needs", href: "https://6humanneeds.online", external: true },
    { icon: Compass, label: "Purpose", href: "https://findmypurpose.me", external: true },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-primary/10 px-3 py-1.5 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Self-Discovery</span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, i) => {
          const Wrapper = item.external ? 'a' : Link;
          const props = item.external 
            ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
            : { to: item.href };
          return (
            <Wrapper key={i} {...props as any} className="flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 transition-colors group">
              <item.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">{item.label}</span>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}

// Leadership Levels Compact Grid
function LevelsGrid() {
  const levels = [
    { level: 1, title: "Productivity", icon: CheckCircle2, color: "bg-emerald-500" },
    { level: 2, title: "Development", icon: TrendingUp, color: "bg-blue-500" },
    { level: 3, title: "Purpose", icon: Lightbulb, color: "bg-purple-500" },
    { level: 4, title: "Motivational", icon: Heart, color: "bg-rose-500" },
    { level: 5, title: "Strategic", icon: Rocket, color: "bg-amber-500" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-primary/10 px-3 py-1.5 border-b border-border flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">5 Levels</span>
      </div>
      <div className="p-2 grid grid-cols-5 gap-1">
        {levels.map((l) => (
          <Link key={l.level} to="/leadership-levels" className="group">
            <div className="text-center p-1.5 rounded hover:bg-secondary/50 transition-colors">
              <div className={`w-6 h-6 mx-auto rounded ${l.color} flex items-center justify-center text-white text-xs font-bold mb-1`}>
                {l.level}
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight block">{l.title}</span>
            </div>
          </Link>
        ))}
      </div>
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section className="py-16 px-4 lg:px-8 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Your Journey
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
            className="text-muted-foreground max-w-2xl mx-auto text-sm"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            From self-discovery to leadership mastery — your complete development pathway
          </motion.p>
        </div>

        {/* Desktop Flow */}
        <motion.div 
          className="hidden lg:block"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main Flow Row */}
          <div className="flex items-start justify-center gap-0">
            {/* Leader Hub */}
            <motion.div variants={itemVariants} className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/25 flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                <Crown className="w-7 h-7 mb-1 relative z-10" />
                <span className="text-xs opacity-80 relative z-10">Leader</span>
                <span className="text-2xl font-bold relative z-10">YOU</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow /></motion.div>

            {/* Self Discovery */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-40">
              <AssessmentStack />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow /></motion.div>

            {/* Leadership Diagnostic */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-44">
              <FlowNode
                icon={BarChart3}
                title="Leadership Diagnostic"
                subtitle="Assess your level"
                href="/leadership-diagnostic"
                variant="accent"
              />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow /></motion.div>

            {/* Leadership Levels */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-64">
              <LevelsGrid />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow /></motion.div>

            {/* Coaching */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-36">
              <FlowNode
                icon={MessageCircle}
                title="Coaching"
                subtitle="1-on-1 sessions"
                href="/executive-coaching"
                variant="primary"
              />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow /></motion.div>

            {/* SHIFT */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-36">
              <FlowNode
                icon={Rocket}
                title="SHIFT"
                subtitle="Full programme"
                href="/shift-methodology"
                variant="primary"
              />
            </motion.div>

            <motion.div variants={itemVariants}><FlowArrow /></motion.div>

            {/* Team Diagnostic */}
            <motion.div variants={itemVariants} className="flex-shrink-0 w-40">
              <FlowNode
                icon={Users}
                title="Team Diagnostic"
                subtitle="Team dynamics"
                href="/team-diagnostic"
                variant="default"
              />
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-primary/80 via-primary to-primary/80 text-primary-foreground py-3 px-6 rounded-xl text-center shadow-lg">
              <span className="font-semibold">Contagious Leadership Identity</span>
              <span className="text-sm opacity-80 ml-2">— Transform into a leader who inspires</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Flow */}
        <motion.div 
          className="lg:hidden space-y-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Leader Hub */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl flex flex-col items-center justify-center text-primary-foreground">
              <Crown className="w-6 h-6 mb-1" />
              <span className="text-xs opacity-80">Leader</span>
              <span className="text-xl font-bold">YOU</span>
            </div>
          </motion.div>

          <FlowArrow direction="down" />

          {/* Self Discovery */}
          <motion.div variants={itemVariants}>
            <AssessmentStack />
          </motion.div>

          <FlowArrow direction="down" />

          {/* Leadership Diagnostic */}
          <motion.div variants={itemVariants}>
            <FlowNode
              icon={BarChart3}
              title="Leadership Diagnostic"
              subtitle="Assess your current level"
              href="/leadership-diagnostic"
              variant="accent"
            />
          </motion.div>

          <FlowArrow direction="down" />

          {/* Levels */}
          <motion.div variants={itemVariants}>
            <LevelsGrid />
          </motion.div>

          <FlowArrow direction="down" />

          {/* Coaching & SHIFT */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
            <FlowNode
              icon={MessageCircle}
              title="Coaching"
              subtitle="1-on-1"
              href="/executive-coaching"
              variant="primary"
            />
            <FlowNode
              icon={Rocket}
              title="SHIFT"
              subtitle="Programme"
              href="/shift-methodology"
              variant="primary"
            />
          </motion.div>

          <FlowArrow direction="down" />

          {/* Team */}
          <motion.div variants={itemVariants}>
            <FlowNode
              icon={Users}
              title="Team Diagnostic"
              subtitle="Evaluate team dynamics"
              href="/team-diagnostic"
              variant="default"
            />
          </motion.div>

          {/* Bottom Bar */}
          <motion.div variants={itemVariants} className="pt-2">
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-3 px-4 rounded-xl text-center">
              <span className="font-semibold text-sm">Contagious Leadership Identity</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
