import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

// Elegant block component
function EcoBlock({ 
  children, 
  variant = "default",
  className = "",
  hasIcon = false
}: { 
  children: React.ReactNode; 
  variant?: "default" | "small" | "center";
  className?: string;
  hasIcon?: boolean;
}) {
  const baseStyles = "bg-primary/90 text-primary-foreground font-medium text-center transition-all duration-300 hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 rounded-lg";
  
  const variants = {
    default: "px-6 py-4",
    small: "px-4 py-3 text-sm",
    center: "px-8 py-8"
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {hasIcon && (
        <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-foreground flex items-center justify-center shadow-md">
          <span className="text-background font-bold text-sm">1</span>
        </div>
      )}
      {children}
    </div>
  );
}

// Connection dot
function ConnectionDot({ className = "" }: { className?: string }) {
  return (
    <div className={`w-2 h-2 rounded-full bg-primary/40 ${className}`} />
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
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block text-sm font-medium text-primary/70 uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Your Journey
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
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            From self-discovery to leadership mastery — your complete development pathway
          </motion.p>
        </div>

        {/* Desktop Layout */}
        <motion.div 
          className="hidden lg:block"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Top - Leadership Index */}
          <motion.div variants={itemVariants} className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-foreground flex items-center justify-center shadow-md">
                <span className="text-background font-bold text-sm">1</span>
              </div>
              <Link to="/leadership-levels" className="block">
                <EcoBlock className="w-72">
                  Leadership Index
                </EcoBlock>
              </Link>
            </div>
          </motion.div>

          {/* Connection line from top */}
          <div className="flex justify-center mb-6">
            <div className="w-px h-8 bg-gradient-to-b from-primary/40 to-primary/20" />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-12 items-center">
            {/* Left Column - Assessment Stack */}
            <motion.div variants={itemVariants} className="space-y-3 justify-self-end">
              <Link to="/leadership-levels" className="block">
                <EcoBlock className="w-52">Leadership Index</EcoBlock>
              </Link>
              <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer" className="block ml-6">
                <EcoBlock className="w-48">Values Assessment</EcoBlock>
              </a>
              <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer" className="block ml-12">
                <EcoBlock className="w-44">6 Human Needs</EcoBlock>
              </a>
              <a href="https://findmypurpose.me" target="_blank" rel="noopener noreferrer" className="block ml-16">
                <EcoBlock className="w-40">Purpose</EcoBlock>
              </a>
            </motion.div>

            {/* Center Hub */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              {/* Connection lines */}
              <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-12 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-primary/20 to-primary/40" />
                <ConnectionDot />
              </div>
              <div className="absolute right-0 top-1/3 translate-x-full -translate-y-1/2 w-12 flex items-center">
                <ConnectionDot />
                <div className="w-full h-px bg-gradient-to-r from-primary/40 to-primary/20" />
              </div>
              <div className="absolute right-0 top-2/3 translate-x-full -translate-y-1/2 w-12 flex items-center">
                <ConnectionDot />
                <div className="w-full h-px bg-gradient-to-r from-primary/40 to-primary/20" />
              </div>

              <div className="w-56 h-48 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <Sparkles className="w-8 h-8 mb-3 opacity-80" />
                <span className="text-lg font-medium opacity-90">Leader</span>
                <span className="text-3xl font-bold">YOU</span>
                <div className="mt-4 text-center">
                  <span className="text-xs opacity-70 block">Designing your</span>
                  <span className="text-sm font-medium">Contagious Identity</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div variants={itemVariants} className="space-y-6 justify-self-start">
              {/* Leadership Diagnostic */}
              <div className="relative">
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-foreground flex items-center justify-center shadow-md">
                  <span className="text-background font-bold text-sm">1</span>
                </div>
                <Link to="/leadership-diagnostic" className="block">
                  <EcoBlock className="w-56">Leadership Diagnostic</EcoBlock>
                </Link>
              </div>

              {/* Leadership Levels Grid */}
              <div className="grid grid-cols-3 gap-2">
                <Link to="/leadership-levels">
                  <EcoBlock variant="small">Leadership<br/>Development</EcoBlock>
                </Link>
                <Link to="/leadership-levels">
                  <EcoBlock variant="small">Personal<br/>Productivity</EcoBlock>
                </Link>
                <Link to="/leadership-levels">
                  <EcoBlock variant="small">Purpose<br/>Lead Leader</EcoBlock>
                </Link>
                <Link to="/leadership-levels">
                  <EcoBlock variant="small">Motivational<br/>Leader</EcoBlock>
                </Link>
                <Link to="/leadership-levels">
                  <EcoBlock variant="small">Strategy<br/>Leadership</EcoBlock>
                </Link>
              </div>

              {/* Coaching */}
              <Link to="/executive-coaching" className="block">
                <EcoBlock className="w-48">Coaching</EcoBlock>
              </Link>

              {/* Team Diagnostic */}
              <div className="relative">
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-foreground flex items-center justify-center shadow-md">
                  <span className="text-background font-bold text-sm">1</span>
                </div>
                <Link to="/team-diagnostic" className="block">
                  <EcoBlock className="w-48">Team Diagnostic</EcoBlock>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Connection line to bottom */}
          <div className="flex justify-center my-8">
            <div className="w-px h-12 bg-gradient-to-b from-primary/20 to-primary/40" />
          </div>

          {/* Bottom Bar - Contagious Identity */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-primary/80 via-primary to-primary/80 text-primary-foreground py-5 px-8 rounded-xl text-center text-xl font-semibold shadow-lg">
              Contagious Identity
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Layout */}
        <motion.div 
          className="lg:hidden space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Center Hub */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="w-48 h-40 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl flex flex-col items-center justify-center text-primary-foreground">
              <Sparkles className="w-6 h-6 mb-2 opacity-80" />
              <span className="text-sm opacity-90">Leader</span>
              <span className="text-2xl font-bold">YOU</span>
              <span className="text-xs mt-2 opacity-70">Contagious Identity</span>
            </div>
          </motion.div>

          {/* Leadership Index */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center">1</span>
              Leadership Index
            </h3>
            <Link to="/leadership-levels">
              <EcoBlock>Leadership Index</EcoBlock>
            </Link>
          </motion.div>

          {/* Assessment Tools */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Assessment Tools</h3>
            <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer">
              <EcoBlock>Values Assessment</EcoBlock>
            </a>
            <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer">
              <EcoBlock>6 Human Needs</EcoBlock>
            </a>
            <a href="https://findmypurpose.me" target="_blank" rel="noopener noreferrer">
              <EcoBlock>Purpose</EcoBlock>
            </a>
          </motion.div>

          {/* Leadership Diagnostic */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center">1</span>
              Leadership Diagnostic
            </h3>
            <Link to="/leadership-diagnostic">
              <EcoBlock>Leadership Diagnostic</EcoBlock>
            </Link>
          </motion.div>

          {/* Leadership Levels Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Leadership Levels</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/leadership-levels"><EcoBlock variant="small">Leadership Development</EcoBlock></Link>
              <Link to="/leadership-levels"><EcoBlock variant="small">Personal Productivity</EcoBlock></Link>
              <Link to="/leadership-levels"><EcoBlock variant="small">Purpose Lead Leader</EcoBlock></Link>
              <Link to="/leadership-levels"><EcoBlock variant="small">Motivational Leader</EcoBlock></Link>
              <Link to="/leadership-levels"><EcoBlock variant="small">Strategy Leadership</EcoBlock></Link>
            </div>
          </motion.div>

          {/* Coaching & Team */}
          <motion.div variants={itemVariants} className="space-y-3">
            <Link to="/executive-coaching">
              <EcoBlock>Coaching</EcoBlock>
            </Link>
            <div>
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center">1</span>
                Team Diagnostic
              </h3>
              <Link to="/team-diagnostic">
                <EcoBlock>Team Diagnostic</EcoBlock>
              </Link>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-primary/80 via-primary to-primary/80 text-primary-foreground py-4 px-6 rounded-xl text-center text-lg font-semibold shadow-lg">
              Contagious Identity
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
