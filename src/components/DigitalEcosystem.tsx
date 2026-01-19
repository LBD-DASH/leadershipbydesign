import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

// Stacked documents visual component
function StackedDocs({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="relative">
      {/* Background stacked cards */}
      <div className="absolute top-2 left-2 w-full h-full bg-primary/20 rounded-lg border border-primary/30" />
      <div className="absolute top-1 left-1 w-full h-full bg-primary/30 rounded-lg border border-primary/40" />
      {/* Main card */}
      <div className="relative bg-background rounded-lg border-2 border-primary p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-2 bg-primary rounded" />
          <div className="w-16 h-2 bg-primary/50 rounded" />
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-1 bg-primary/60 rounded" />
              <span className="text-xs text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Org chart visual component
function OrgChart() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-6 bg-primary rounded mb-1" />
      <div className="w-0.5 h-4 bg-primary/50" />
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-3 bg-primary/50" />
          <div className="w-8 h-5 bg-primary/70 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-3 bg-primary/50" />
          <div className="w-8 h-5 bg-primary/70 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-3 bg-primary/50" />
          <div className="w-8 h-5 bg-primary/70 rounded" />
        </div>
      </div>
    </div>
  );
}

// Text with description lines
function TextBlock({ title, lines = 3 }: { title: string; lines?: number }) {
  return (
    <div className="space-y-2">
      <h4 className="font-bold text-primary text-lg">{title}</h4>
      <div className="space-y-1.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className="h-1.5 bg-muted-foreground/30 rounded" 
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Simple list visual
function ListBlock({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <div className="h-1.5 bg-muted-foreground/30 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}

// Card with icon header
function CardBlock({ title, hasProgress }: { title: string; hasProgress?: boolean }) {
  return (
    <div className="bg-background rounded-lg border-2 border-primary/50 p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-4 bg-primary rounded" />
        <span className="text-xs font-medium text-foreground">{title}</span>
      </div>
      {hasProgress && (
        <div className="h-1.5 bg-muted rounded overflow-hidden">
          <div className="h-full w-2/3 bg-primary/60 rounded" />
        </div>
      )}
    </div>
  );
}

interface NodePosition {
  x: number;
  y: number;
}

interface EcosystemItem {
  id: string;
  position: NodePosition;
  content: React.ReactNode;
  link?: string;
  external?: boolean;
}

const ecosystemItems: EcosystemItem[] = [
  {
    id: "foundation",
    position: { x: 8, y: 20 },
    content: (
      <StackedDocs 
        title="Foundation" 
        items={["SHIFT Methodology", "Core Framework", "Development Path"]} 
      />
    ),
    link: "/shift-methodology",
  },
  {
    id: "assessment",
    position: { x: 8, y: 55 },
    content: <OrgChart />,
    link: "/leadership-diagnostic",
  },
  {
    id: "tools",
    position: { x: 8, y: 80 },
    content: (
      <div className="space-y-2">
        <CardBlock title="6 Human Needs" />
        <CardBlock title="Purpose" hasProgress />
        <CardBlock title="Values" />
      </div>
    ),
  },
  {
    id: "purpose",
    position: { x: 72, y: 15 },
    content: <TextBlock title="Purpose" lines={3} />,
    link: "https://findmypurpose.me",
    external: true,
  },
  {
    id: "values",
    position: { x: 72, y: 45 },
    content: <TextBlock title="Values" lines={3} />,
    link: "https://valuesblueprint.online",
    external: true,
  },
  {
    id: "needs",
    position: { x: 72, y: 75 },
    content: <TextBlock title="6 Human Needs" lines={3} />,
    link: "https://6humanneeds.online",
    external: true,
  },
];

// Connection line with dot
function ConnectionLine({ 
  startX, 
  startY, 
  endX, 
  endY,
  delay = 0 
}: { 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number;
  delay?: number;
}) {
  return (
    <g>
      <motion.line
        x1={`${startX}%`}
        y1={`${startY}%`}
        x2={`${endX}%`}
        y2={`${endY}%`}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeOpacity="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
      />
      <motion.circle
        cx={`${endX}%`}
        cy={`${endY}%`}
        r="6"
        fill="hsl(var(--primary))"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.4 }}
        viewport={{ once: true }}
      />
    </g>
  );
}

export default function DigitalEcosystem() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/30 overflow-hidden">
      <div className="max-w-6xl mx-auto">
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
          <motion.div
            className="w-24 h-1 bg-primary mx-auto mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </div>

        {/* Desktop Diagram */}
        <div className="hidden lg:block relative" style={{ height: "600px" }}>
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Left side connections */}
            <ConnectionLine startX={50} startY={50} endX={28} endY={25} delay={0.2} />
            <ConnectionLine startX={50} startY={50} endX={28} endY={50} delay={0.3} />
            <ConnectionLine startX={50} startY={50} endX={28} endY={75} delay={0.4} />
            
            {/* Right side connections */}
            <ConnectionLine startX={50} startY={50} endX={68} endY={20} delay={0.2} />
            <ConnectionLine startX={50} startY={50} endX={68} endY={50} delay={0.3} />
            <ConnectionLine startX={50} startY={50} endX={68} endY={80} delay={0.4} />
            
            {/* Top connection */}
            <ConnectionLine startX={50} startY={50} endX={50} endY={12} delay={0.1} />
          </svg>

          {/* Center Hub */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
          >
            <div className="w-32 h-32 rounded-2xl bg-background border-4 border-primary shadow-xl flex flex-col items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary mb-1" />
              <span className="font-bold text-sm text-primary">LEADER</span>
              <span className="text-[10px] text-muted-foreground">(Contagious Identity)</span>
            </div>
          </motion.div>

          {/* Top Label */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "2%" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div className="w-4 h-4 rounded-full bg-primary mx-auto mb-2" />
              <span className="text-sm font-medium text-muted-foreground">Leadership Index</span>
              <span className="block text-[10px] text-muted-foreground/70">Coming Soon</span>
            </div>
          </motion.div>

          {/* Left Column Items */}
          <motion.div
            className="absolute"
            style={{ left: "2%", top: "10%", width: "24%" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link to="/shift-methodology" className="block hover:scale-105 transition-transform">
              <StackedDocs 
                title="Foundation" 
                items={["SHIFT Methodology", "Core Framework", "Development Path"]} 
              />
            </Link>
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: "5%", top: "42%", width: "20%" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/leadership-diagnostic" className="block hover:scale-105 transition-transform">
              <div className="text-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">Leadership Assessment</span>
              </div>
              <OrgChart />
            </Link>
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: "2%", top: "68%", width: "24%" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground block mb-2">Essential Tools</span>
              <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer">
                <CardBlock title="6 Human Needs" />
              </a>
              <a href="https://findmypurpose.me" target="_blank" rel="noopener noreferrer">
                <CardBlock title="Purpose Blueprint" hasProgress />
              </a>
              <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer">
                <CardBlock title="Values Blueprint" />
              </a>
            </div>
          </motion.div>

          {/* Right Column Items */}
          <motion.div
            className="absolute"
            style={{ right: "5%", top: "12%", width: "22%" }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <a href="https://findmypurpose.me" target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
              <TextBlock title="Purpose" lines={3} />
            </a>
          </motion.div>

          <motion.div
            className="absolute"
            style={{ right: "5%", top: "42%", width: "22%" }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
              <TextBlock title="Values" lines={3} />
            </a>
          </motion.div>

          <motion.div
            className="absolute"
            style={{ right: "5%", top: "72%", width: "22%" }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
              <TextBlock title="6 Human Needs" lines={3} />
            </a>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          {/* Center Hub */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
          >
            <div className="w-28 h-28 rounded-2xl bg-background border-4 border-primary shadow-xl flex flex-col items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary mb-1" />
              <span className="font-bold text-sm text-primary">LEADER</span>
              <span className="text-[9px] text-muted-foreground text-center">(Contagious Identity)</span>
            </div>
          </motion.div>

          {/* Foundation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Foundation</h3>
            <Link to="/shift-methodology">
              <StackedDocs 
                title="Foundation" 
                items={["SHIFT Methodology", "Core Framework", "Development Path"]} 
              />
            </Link>
          </motion.div>

          {/* Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Assessment</h3>
            <Link to="/leadership-diagnostic" className="block">
              <div className="bg-background rounded-lg border-2 border-primary/50 p-4">
                <OrgChart />
                <p className="text-xs text-muted-foreground text-center mt-3">Leadership Assessment</p>
              </div>
            </Link>
          </motion.div>

          {/* Essential Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Essential Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="https://findmypurpose.me" target="_blank" rel="noopener noreferrer">
                <TextBlock title="Purpose" lines={2} />
              </a>
              <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer">
                <TextBlock title="Values" lines={2} />
              </a>
              <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer">
                <TextBlock title="6 Human Needs" lines={2} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Core Framework</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-primary/50" />
            <span>Tools & Assessments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1.5 bg-muted-foreground/30 rounded" />
            <span>Resources</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
