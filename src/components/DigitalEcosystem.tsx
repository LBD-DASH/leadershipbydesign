import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Compass, Target, Heart, Sparkles, Layers, Crown, TrendingUp } from "lucide-react";
import ldbLogo from "@/assets/ldb-logo.png";
import shiftLogo from "@/assets/shift-logo.jpg";
import purposeLogo from "@/assets/purpose-blueprint-logo.png";
import valuesLogo from "@/assets/values-logo.png";
import leadershipIndexLogo from "@/assets/leadership-index-logo.png";

interface EcosystemNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  logo?: string;
  link?: string;
  external?: boolean;
  comingSoon?: boolean;
  position: { x: number; y: number };
  size: "sm" | "md" | "lg" | "xl";
  variant: "primary" | "secondary" | "accent" | "outline";
}

const nodes: EcosystemNode[] = [
  {
    id: "leader",
    label: "LEADER",
    sublabel: "You",
    logo: ldbLogo,
    position: { x: 50, y: 50 },
    size: "xl",
    variant: "primary",
  },
  {
    id: "assessment",
    label: "Leadership",
    sublabel: "Assessment",
    icon: <Compass className="w-6 h-6" />,
    link: "/leadership-diagnostic",
    position: { x: 50, y: 75 },
    size: "md",
    variant: "outline",
  },
  {
    id: "index",
    label: "Leadership",
    sublabel: "Index",
    logo: leadershipIndexLogo,
    comingSoon: true,
    position: { x: 50, y: 92 },
    size: "md",
    variant: "outline",
  },
  {
    id: "6hn",
    label: "6 Human",
    sublabel: "Needs",
    icon: <Heart className="w-5 h-5" />,
    link: "https://6humanneeds.online",
    external: true,
    position: { x: 20, y: 75 },
    size: "sm",
    variant: "outline",
  },
  {
    id: "purpose",
    label: "Purpose",
    sublabel: "Blueprint",
    logo: purposeLogo,
    link: "https://findmypurpose.me",
    external: true,
    position: { x: 80, y: 75 },
    size: "sm",
    variant: "outline",
  },
  {
    id: "values",
    label: "Values",
    sublabel: "Blueprint",
    logo: valuesLogo,
    link: "https://valuesblueprint.online",
    external: true,
    position: { x: 50, y: 25 },
    size: "sm",
    variant: "outline",
  },
  {
    id: "shift",
    label: "SHIFT",
    sublabel: "Foundation",
    logo: shiftLogo,
    link: "/shift-methodology",
    position: { x: 20, y: 25 },
    size: "md",
    variant: "secondary",
  },
  {
    id: "identity",
    label: "Contagious",
    sublabel: "Identity",
    icon: <Sparkles className="w-6 h-6" />,
    position: { x: 80, y: 25 },
    size: "lg",
    variant: "accent",
  },
];

// Connection paths between nodes
const connections = [
  { from: "leader", to: "assessment" },
  { from: "assessment", to: "index" },
  { from: "leader", to: "6hn" },
  { from: "leader", to: "purpose" },
  { from: "leader", to: "values" },
  { from: "6hn", to: "shift" },
  { from: "purpose", to: "identity" },
  { from: "values", to: "shift" },
  { from: "values", to: "identity" },
  { from: "shift", to: "identity" },
];

const sizeClasses = {
  sm: "w-20 h-20 md:w-24 md:h-24",
  md: "w-24 h-24 md:w-28 md:h-28",
  lg: "w-28 h-28 md:w-32 md:h-32",
  xl: "w-32 h-32 md:w-36 md:h-36",
};

const variantClasses = {
  primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
  secondary: "bg-secondary text-secondary-foreground border-2 border-primary",
  accent: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30",
  outline: "bg-background border-2 border-primary/50 text-foreground hover:border-primary",
};

function EcosystemNode({ node }: { node: EcosystemNode }) {
  const content = (
    <motion.div
      className={`
        ${sizeClasses[node.size]}
        ${variantClasses[node.variant]}
        rounded-full flex flex-col items-center justify-center
        cursor-pointer transition-all duration-300
        relative
      `}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
      viewport={{ once: true }}
    >
      {node.logo ? (
        <img 
          src={node.logo} 
          alt={node.label} 
          className={`${node.size === "xl" ? "w-16 h-16" : "w-10 h-10"} object-contain rounded-full`}
        />
      ) : (
        node.icon
      )}
      <span className={`font-semibold text-center leading-tight mt-1 ${node.size === "sm" ? "text-xs" : "text-sm"}`}>
        {node.label}
      </span>
      {node.sublabel && (
        <span className={`text-center leading-tight opacity-80 ${node.size === "sm" ? "text-[10px]" : "text-xs"}`}>
          {node.sublabel}
        </span>
      )}
      {node.comingSoon && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap">
          Coming Soon
        </span>
      )}
      {node.external && (
        <ExternalLink className="absolute top-1 right-1 w-3 h-3 opacity-50" />
      )}
    </motion.div>
  );

  if (node.link) {
    if (node.external) {
      return (
        <a href={node.link} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return <Link to={node.link}>{content}</Link>;
  }

  return content;
}

function ConnectionLine({ from, to }: { from: EcosystemNode; to: EcosystemNode }) {
  return (
    <motion.line
      x1={`${from.position.x}%`}
      y1={`${from.position.y}%`}
      x2={`${to.position.x}%`}
      y2={`${to.position.y}%`}
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeOpacity="0.3"
      strokeDasharray="4 4"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      viewport={{ once: true }}
    />
  );
}

export default function DigitalEcosystem() {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
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

        {/* Desktop Circular Layout */}
        <div className="hidden md:block relative w-full aspect-square max-w-3xl mx-auto">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, i) => (
              <ConnectionLine
                key={i}
                from={nodeMap[conn.from]}
                to={nodeMap[conn.to]}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
              }}
            >
              <EcosystemNode node={node} />
            </div>
          ))}
        </div>

        {/* Mobile Vertical Layout */}
        <div className="md:hidden space-y-8">
          {/* Journey Flow */}
          <div className="flex flex-col items-center space-y-4">
            <EcosystemNode node={nodeMap["leader"]} />
            <div className="w-0.5 h-8 bg-primary/30" />
            <EcosystemNode node={nodeMap["assessment"]} />
            <div className="w-0.5 h-8 bg-primary/30" />
            <EcosystemNode node={nodeMap["index"]} />
          </div>

          {/* Tools Row */}
          <div className="flex justify-center gap-4 flex-wrap">
            <EcosystemNode node={nodeMap["6hn"]} />
            <EcosystemNode node={nodeMap["purpose"]} />
            <EcosystemNode node={nodeMap["values"]} />
          </div>

          {/* Foundation & Outcome */}
          <div className="flex justify-center gap-6">
            <EcosystemNode node={nodeMap["shift"]} />
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-primary/50" />
            </div>
            <EcosystemNode node={nodeMap["identity"]} />
          </div>
        </div>

        {/* Legend */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
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
            <div className="w-3 h-3 rounded-full border-2 border-primary/50" />
            <span>Assessment Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600" />
            <span>Outcome</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
