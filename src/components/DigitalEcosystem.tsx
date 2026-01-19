import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Compass, 
  Target, 
  Heart, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Award,
  Rocket,
  Brain,
  Zap,
  Crown,
  ArrowRight,
  ArrowDown,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Layers,
  BookOpen,
  UserCheck,
  MessageCircle
} from "lucide-react";

// Flow Node Component
function FlowNode({ 
  icon: Icon, 
  title, 
  description,
  variant = "default",
  step,
  className = ""
}: { 
  icon: React.ElementType;
  title: string;
  description?: string;
  variant?: "primary" | "secondary" | "accent" | "default";
  step?: number;
  className?: string;
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground border border-border",
    accent: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30",
    default: "bg-card text-card-foreground border border-border shadow-md"
  };

  return (
    <div className={`relative group ${className}`}>
      {step && (
        <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
          {step}
        </div>
      )}
      <div className={`rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${variants[variant]}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${variant === "primary" || variant === "accent" ? "bg-white/20" : "bg-primary/10"}`}>
            <Icon className={`w-6 h-6 ${variant === "primary" || variant === "accent" ? "text-current" : "text-primary"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base leading-tight">{title}</h4>
            {description && (
              <p className={`text-sm mt-1 leading-relaxed ${variant === "primary" || variant === "accent" ? "opacity-80" : "text-muted-foreground"}`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stack Component for grouped items
function FlowStack({ 
  title,
  items,
  step
}: { 
  title: string;
  items: { icon: React.ElementType; label: string; href: string; external?: boolean }[];
  step?: number;
}) {
  return (
    <div className="relative">
      {step && (
        <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
          {step}
        </div>
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="bg-primary/10 px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-primary">{title}</h4>
        </div>
        <div className="divide-y divide-border">
          {items.map((item, i) => {
            const Wrapper = item.external ? 'a' : Link;
            const wrapperProps = item.external 
              ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
              : { to: item.href };
            
            return (
              <Wrapper key={i} {...wrapperProps as any} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Animated Connection Line
function FlowLine({ direction = "down", className = "" }: { direction?: "down" | "right" | "left"; className?: string }) {
  const directionStyles = {
    down: "w-px h-12 bg-gradient-to-b from-primary/50 to-primary/20",
    right: "h-px w-12 bg-gradient-to-r from-primary/50 to-primary/20",
    left: "h-px w-12 bg-gradient-to-l from-primary/50 to-primary/20"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div 
        className={directionStyles[direction]}
        initial={{ scaleY: direction === "down" ? 0 : 1, scaleX: direction !== "down" ? 0 : 1 }}
        whileInView={{ scaleY: 1, scaleX: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      />
      {direction === "down" && (
        <ArrowDown className="w-4 h-4 text-primary/50 absolute -bottom-2" />
      )}
    </div>
  );
}

// Leadership Level Mini Card
function LevelCard({ 
  level, 
  title, 
  icon: Icon,
  color
}: { 
  level: number;
  title: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Link 
      to="/leadership-levels" 
      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all group"
    >
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white font-bold text-sm`}>
        L{level}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-muted-foreground">Level {level}</span>
        <h5 className="text-sm font-medium text-foreground truncate">{title}</h5>
      </div>
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}

export default function DigitalEcosystem() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const assessmentTools = [
    { icon: Crown, label: "Leadership Index", href: "/leadership-levels", external: false },
    { icon: Heart, label: "Values Assessment", href: "https://valuesblueprint.online", external: true },
    { icon: Zap, label: "6 Human Needs", href: "https://6humanneeds.online", external: true },
    { icon: Compass, label: "Purpose Discovery", href: "https://findmypurpose.me", external: true },
  ];

  const leadershipLevels = [
    { level: 1, title: "Personal Productivity", icon: CheckCircle2, color: "bg-emerald-500" },
    { level: 2, title: "Leadership Development", icon: TrendingUp, color: "bg-blue-500" },
    { level: 3, title: "Purpose-Led Leader", icon: Lightbulb, color: "bg-purple-500" },
    { level: 4, title: "Motivational Leader", icon: Heart, color: "bg-rose-500" },
    { level: 5, title: "Strategic Leader", icon: Rocket, color: "bg-amber-500" },
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/30 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Layers className="w-4 h-4" />
            Your Development Journey
          </motion.span>
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Digital Ecosystem
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            A comprehensive framework that guides you from self-discovery to leadership mastery, 
            with integrated tools and assessments at every stage.
          </motion.p>
        </div>

        {/* Desktop Flowchart */}
        <motion.div 
          className="hidden lg:block"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Row 1: Entry Point */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Start Your Journey
              </div>
            </div>
          </motion.div>

          <FlowLine direction="down" className="relative h-8 mb-4" />

          {/* Row 2: Self-Discovery Phase */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 mb-8">
            {/* Assessment Stack */}
            <div className="flex justify-end">
              <div className="w-72">
                <FlowStack 
                  title="Self-Discovery Tools"
                  step={1}
                  items={assessmentTools}
                />
              </div>
            </div>

            {/* Center Hub */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Connection lines */}
                <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center">
                  <div className="w-8 h-px bg-gradient-to-l from-primary/50 to-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/50 -ml-1" />
                </div>
                <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary/50 -mr-1" />
                  <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-primary/20" />
                </div>

                <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-2xl shadow-primary/30 flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8" />
                    </div>
                    <span className="text-lg opacity-90 block">Leader</span>
                    <span className="text-4xl font-bold block">YOU</span>
                    <div className="mt-4 px-4">
                      <span className="text-xs opacity-70 block">Developing your</span>
                      <span className="text-sm font-semibold">Contagious Identity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Entry */}
            <div className="flex justify-start">
              <div className="w-72">
                <Link to="/leadership-diagnostic">
                  <FlowNode
                    icon={BarChart3}
                    title="Leadership Diagnostic"
                    description="Assess your current leadership level and get personalized recommendations"
                    variant="accent"
                    step={2}
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-3 gap-8 w-full">
              <div className="flex justify-end pr-36">
                <FlowLine direction="down" className="relative h-12" />
              </div>
              <div className="flex justify-center">
                <FlowLine direction="down" className="relative h-12" />
              </div>
              <div className="flex justify-start pl-36">
                <FlowLine direction="down" className="relative h-12" />
              </div>
            </div>
          </div>

          {/* Row 3: Development Phase */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 mb-8">
            {/* Coaching */}
            <div className="flex justify-end">
              <div className="w-72">
                <Link to="/executive-coaching">
                  <FlowNode
                    icon={MessageCircle}
                    title="Executive Coaching"
                    description="1-on-1 coaching sessions to accelerate your growth"
                    variant="primary"
                    step={3}
                  />
                </Link>
              </div>
            </div>

            {/* Leadership Levels */}
            <div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">5 Leadership Levels</h4>
                </div>
                <div className="space-y-2">
                  {leadershipLevels.map((level) => (
                    <LevelCard key={level.level} {...level} />
                  ))}
                </div>
              </div>
            </div>

            {/* SHIFT Programme */}
            <div className="flex justify-start">
              <div className="w-72">
                <Link to="/shift-methodology">
                  <FlowNode
                    icon={Rocket}
                    title="SHIFT Programme"
                    description="Complete leadership development programme with measurable outcomes"
                    variant="primary"
                    step={4}
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Connection to Team */}
          <FlowLine direction="down" className="relative h-8 mb-4" />

          {/* Row 4: Team Impact */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-full max-w-2xl">
              <Link to="/team-diagnostic">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md z-10">
                    5
                  </div>
                  <div className="bg-gradient-to-r from-secondary via-card to-secondary border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-xl bg-primary/10">
                          <Users className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-foreground">Team Diagnostic</h4>
                          <p className="text-muted-foreground">Evaluate team dynamics and identify growth opportunities</p>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Final Outcome */}
          <FlowLine direction="down" className="relative h-8 mb-4" />

          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-6 px-8 rounded-2xl text-center shadow-xl shadow-primary/25">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Award className="w-6 h-6" />
                <span className="text-xl font-bold">Contagious Leadership Identity</span>
                <Award className="w-6 h-6" />
              </div>
              <p className="text-sm opacity-80">Transform into a leader who inspires, influences, and creates lasting impact</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Layout */}
        <motion.div 
          className="lg:hidden space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Start Point */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Start Your Journey
            </div>
          </motion.div>

          {/* Center Hub */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl flex flex-col items-center justify-center text-primary-foreground">
              <Crown className="w-10 h-10 mb-2 opacity-90" />
              <span className="text-sm opacity-90">Leader</span>
              <span className="text-3xl font-bold">YOU</span>
              <span className="text-xs mt-2 opacity-70">Contagious Identity</span>
            </div>
          </motion.div>

          {/* Step 1: Self-Discovery */}
          <motion.div variants={itemVariants}>
            <FlowStack 
              title="Step 1: Self-Discovery"
              step={1}
              items={assessmentTools}
            />
          </motion.div>

          {/* Step 2: Diagnostic */}
          <motion.div variants={itemVariants}>
            <Link to="/leadership-diagnostic">
              <FlowNode
                icon={BarChart3}
                title="Leadership Diagnostic"
                description="Assess your current leadership level"
                variant="accent"
                step={2}
              />
            </Link>
          </motion.div>

          {/* Step 3: Coaching */}
          <motion.div variants={itemVariants}>
            <Link to="/executive-coaching">
              <FlowNode
                icon={MessageCircle}
                title="Executive Coaching"
                description="1-on-1 coaching sessions"
                variant="primary"
                step={3}
              />
            </Link>
          </motion.div>

          {/* Leadership Levels */}
          <motion.div variants={itemVariants}>
            <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">5 Leadership Levels</h4>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {leadershipLevels.map((level) => (
                  <LevelCard key={level.level} {...level} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Step 4: SHIFT */}
          <motion.div variants={itemVariants}>
            <Link to="/shift-methodology">
              <FlowNode
                icon={Rocket}
                title="SHIFT Programme"
                description="Complete leadership development"
                variant="primary"
                step={4}
              />
            </Link>
          </motion.div>

          {/* Step 5: Team */}
          <motion.div variants={itemVariants}>
            <Link to="/team-diagnostic">
              <FlowNode
                icon={Users}
                title="Team Diagnostic"
                description="Evaluate team dynamics"
                variant="secondary"
                step={5}
              />
            </Link>
          </motion.div>

          {/* Final Outcome */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-5 px-6 rounded-xl text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-5 h-5" />
                <span className="font-bold">Contagious Leadership</span>
              </div>
              <p className="text-xs opacity-80">Transform into an inspiring leader</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
