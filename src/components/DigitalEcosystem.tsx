import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Block component with the blue/gray style from the diagram
function DiagramBlock({ 
  children, 
  className = "",
  size = "normal"
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: "small" | "normal" | "large" | "wide";
}) {
  const sizeClasses = {
    small: "px-4 py-3 text-sm",
    normal: "px-6 py-4",
    large: "px-8 py-6",
    wide: "px-8 py-4 w-full"
  };
  
  return (
    <div className={`bg-[#6B8BA4] text-white font-medium text-center ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Number icon with "1" like in the diagram
function NumberIcon() {
  return (
    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
      <span className="text-white font-bold text-lg">1</span>
    </div>
  );
}

// Arrow line component
function ArrowLine({ 
  direction,
  className = ""
}: { 
  direction: "left" | "right" | "up" | "down" | "up-left" | "up-right" | "down-left" | "down-right";
  className?: string;
}) {
  const getPath = () => {
    switch (direction) {
      case "left":
        return "M100,50 L10,50 M20,40 L10,50 L20,60";
      case "right":
        return "M0,50 L90,50 M80,40 L90,50 L80,60";
      case "up":
        return "M50,100 L50,10 M40,20 L50,10 L60,20";
      case "down":
        return "M50,0 L50,90 M40,80 L50,90 L60,80";
      case "up-left":
        return "M90,90 L20,20 M20,35 L20,20 L35,20";
      case "up-right":
        return "M10,90 L80,20 M65,20 L80,20 L80,35";
      case "down-left":
        return "M90,10 L20,80 M20,65 L20,80 L35,80";
      case "down-right":
        return "M10,10 L80,80 M65,80 L80,80 L80,65";
      default:
        return "";
    }
  };

  return (
    <svg className={`w-12 h-12 ${className}`} viewBox="0 0 100 100">
      <path
        d={getPath()}
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DigitalEcosystem() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6"
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
            Your leadership development journey — from assessment to contagious identity
          </motion.p>
        </div>

        {/* Desktop Diagram - matching the reference exactly */}
        <motion.div 
          className="hidden lg:block relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Top Row - Leadership Index */}
          <div className="flex items-start gap-4 mb-8">
            <NumberIcon />
            <Link to="/leadership-levels" className="hover:opacity-80 transition-opacity">
              <DiagramBlock size="wide" className="w-80">
                Leadership Index
              </DiagramBlock>
            </Link>
          </div>

          {/* Main Content Area */}
          <div className="flex gap-8 items-start">
            {/* Left Column - Stacked blocks */}
            <div className="flex flex-col gap-0 w-56">
              <Link to="/leadership-levels" className="hover:opacity-80 transition-opacity">
                <DiagramBlock className="mb-0">
                  Leadership Index
                </DiagramBlock>
              </Link>
              <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <DiagramBlock className="ml-4">
                  Values Assessment
                </DiagramBlock>
              </a>
              <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <DiagramBlock className="ml-8">
                  6 Human Needs
                </DiagramBlock>
              </a>
              <a href="https://findmypurpose.me" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <DiagramBlock className="ml-12">
                  Purpose
                </DiagramBlock>
              </a>
            </div>

            {/* Arrows pointing to/from center */}
            <div className="flex flex-col justify-center gap-8 py-8">
              <ArrowLine direction="left" />
              <ArrowLine direction="left" />
              <ArrowLine direction="left" />
            </div>

            {/* Center Hub */}
            <div className="flex flex-col items-center">
              <ArrowLine direction="up-left" className="mb-2" />
              <div className="relative">
                <ArrowLine direction="up-right" className="absolute -top-10 -right-10" />
                <DiagramBlock size="large" className="w-52 h-40 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold mb-2">Leader</div>
                  <div className="text-2xl font-bold mb-2">YOU</div>
                  <div className="text-sm mt-4">Designing your</div>
                  <div className="text-sm">COntagious Identity</div>
                </DiagramBlock>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <ArrowLine direction="down-right" />
                </div>
              </div>
            </div>

            {/* Right Side Content */}
            <div className="flex flex-col gap-6">
              {/* Leadership Diagnostic Row */}
              <div className="flex items-center gap-4">
                <ArrowLine direction="right" />
                <NumberIcon />
                <Link to="/leadership-diagnostic" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock size="normal" className="w-56">
                    Leadership Diagnostic
                  </DiagramBlock>
                </Link>
              </div>

              {/* Leadership Levels Grid - 3x2 */}
              <div className="grid grid-cols-3 gap-2 ml-16">
                <Link to="/leadership-levels" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock size="small">
                    Leadership<br />Development
                  </DiagramBlock>
                </Link>
                <Link to="/leadership-levels" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock size="small">
                    Personal<br />Productivity
                  </DiagramBlock>
                </Link>
                <Link to="/leadership-levels" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock size="small">
                    Purpose<br />Lead Leader
                  </DiagramBlock>
                </Link>
                <Link to="/leadership-levels" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock size="small">
                    Motivational<br />Leader
                  </DiagramBlock>
                </Link>
                <Link to="/leadership-levels" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock size="small">
                    Strategy<br />Leadership
                  </DiagramBlock>
                </Link>
              </div>

              {/* Coaching */}
              <div className="ml-16">
                <Link to="/executive-coaching" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock className="w-56">
                    Coaching
                  </DiagramBlock>
                </Link>
              </div>

              {/* Team Diagnostic */}
              <div className="flex items-center gap-4 ml-8">
                <NumberIcon />
                <Link to="/team-diagnostic" className="hover:opacity-80 transition-opacity">
                  <DiagramBlock className="w-48">
                    Team Diagnostic
                  </DiagramBlock>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Contagious Identity */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <DiagramBlock size="wide" className="text-xl py-6">
              Contagious Identity
            </DiagramBlock>
          </motion.div>
        </motion.div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Center Hub */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
          >
            <DiagramBlock size="large" className="w-52">
              <div className="text-lg font-bold">Leader YOU</div>
              <div className="text-sm mt-2">Designing your</div>
              <div className="text-sm">Contagious Identity</div>
            </DiagramBlock>
          </motion.div>

          {/* Leadership Index */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <NumberIcon />
              <h3 className="text-lg font-semibold">Leadership Index</h3>
            </div>
            <Link to="/leadership-levels">
              <DiagramBlock>Leadership Index</DiagramBlock>
            </Link>
          </motion.div>

          {/* Assessment Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold mb-4">Assessment Tools</h3>
            <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer">
              <DiagramBlock>Values Assessment</DiagramBlock>
            </a>
            <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer">
              <DiagramBlock>6 Human Needs</DiagramBlock>
            </a>
            <a href="https://findmypurpose.me" target="_blank" rel="noopener noreferrer">
              <DiagramBlock>Purpose</DiagramBlock>
            </a>
          </motion.div>

          {/* Leadership Diagnostic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <NumberIcon />
              <h3 className="text-lg font-semibold">Leadership Diagnostic</h3>
            </div>
            <Link to="/leadership-diagnostic">
              <DiagramBlock>Leadership Diagnostic</DiagramBlock>
            </Link>
          </motion.div>

          {/* Leadership Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Leadership Levels</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/leadership-levels">
                <DiagramBlock size="small">Leadership Development</DiagramBlock>
              </Link>
              <Link to="/leadership-levels">
                <DiagramBlock size="small">Personal Productivity</DiagramBlock>
              </Link>
              <Link to="/leadership-levels">
                <DiagramBlock size="small">Purpose Lead Leader</DiagramBlock>
              </Link>
              <Link to="/leadership-levels">
                <DiagramBlock size="small">Motivational Leader</DiagramBlock>
              </Link>
              <Link to="/leadership-levels">
                <DiagramBlock size="small">Strategy Leadership</DiagramBlock>
              </Link>
            </div>
          </motion.div>

          {/* Coaching & Team Diagnostic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <Link to="/executive-coaching">
              <DiagramBlock>Coaching</DiagramBlock>
            </Link>
            <div className="flex items-center gap-3">
              <NumberIcon />
              <Link to="/team-diagnostic" className="flex-1">
                <DiagramBlock>Team Diagnostic</DiagramBlock>
              </Link>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <DiagramBlock size="wide" className="text-lg py-5">
              Contagious Identity
            </DiagramBlock>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
