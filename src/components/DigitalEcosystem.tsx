import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Compass, 
  Target, 
  Heart, 
  Sparkles, 
  Crown,
  BarChart3,
  Lightbulb,
  Layers,
  Star,
  Users
} from "lucide-react";

interface EcosystemNode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
  external?: boolean;
  comingSoon?: boolean;
  type: "foundation" | "essential" | "outcome";
}

const foundationNodes: EcosystemNode[] = [
  {
    id: "shift",
    title: "SHIFT",
    description: "Core leadership development methodology",
    icon: <Layers className="w-6 h-6" />,
    link: "/shift-methodology",
    type: "foundation",
  },
  {
    id: "assessment",
    title: "Leadership Assessment",
    description: "Diagnose your leadership capabilities",
    icon: <Compass className="w-6 h-6" />,
    link: "/leadership-diagnostic",
    type: "foundation",
  },
  {
    id: "index",
    title: "Leadership Index",
    description: "Measure and track leadership growth",
    icon: <BarChart3 className="w-6 h-6" />,
    comingSoon: true,
    type: "foundation",
  },
];

const essentialNodes: EcosystemNode[] = [
  {
    id: "6hn",
    title: "6 Human Needs",
    description: "Understand core motivational drivers",
    icon: <Heart className="w-6 h-6" />,
    link: "https://6humanneeds.online",
    external: true,
    type: "essential",
  },
  {
    id: "purpose",
    title: "Purpose Blueprint",
    description: "Discover and align with your purpose",
    icon: <Target className="w-6 h-6" />,
    link: "https://findmypurpose.me",
    external: true,
    type: "essential",
  },
  {
    id: "values",
    title: "Values Blueprint",
    description: "Define your core leadership values",
    icon: <Star className="w-6 h-6" />,
    link: "https://valuesblueprint.online",
    external: true,
    type: "essential",
  },
];

const outcomeNode: EcosystemNode = {
  id: "identity",
  title: "Contagious Identity",
  description: "Lead with authentic influence",
  icon: <Sparkles className="w-6 h-6" />,
  type: "outcome",
};

function NodeCard({ node, index, side }: { node: EcosystemNode; index: number; side: "left" | "right" }) {
  const content = (
    <motion.div
      className={`
        flex items-start gap-4 p-4 rounded-xl bg-background border-2 
        ${node.type === "foundation" ? "border-primary" : node.type === "essential" ? "border-primary/50" : "border-emerald-500"}
        hover:shadow-lg hover:border-primary transition-all duration-300
        ${side === "left" ? "flex-row" : "flex-row-reverse text-right"}
        ${node.comingSoon ? "opacity-70" : ""}
      `}
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center shrink-0
        ${node.type === "foundation" ? "bg-primary text-primary-foreground" : 
          node.type === "essential" ? "bg-secondary text-primary" : 
          "bg-emerald-500 text-white"}
      `}>
        {node.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
          {node.title}
          {node.comingSoon && (
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          )}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
      </div>
    </motion.div>
  );

  if (node.link && !node.comingSoon) {
    if (node.external) {
      return (
        <a href={node.link} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      );
    }
    return <Link to={node.link} className="block">{content}</Link>;
  }

  return content;
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

        {/* Hub and Spoke Diagram */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* Left Column - Foundation */}
            <div className="space-y-4">
              <motion.div
                className="text-sm font-semibold text-primary uppercase tracking-wider mb-6 text-right"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Foundation
              </motion.div>
              {foundationNodes.map((node, i) => (
                <div key={node.id} className="relative">
                  <NodeCard node={node} index={i} side="left" />
                  {/* Connection line */}
                  <motion.div
                    className="absolute right-0 top-1/2 w-8 h-0.5 bg-primary/30"
                    style={{ transform: "translateX(100%)" }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                  />
                </div>
              ))}
            </div>

            {/* Center Hub */}
            <div className="flex items-center justify-center">
              {/* Combined Leader + Contagious Identity Hub */}
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
              >
                <div className="w-44 h-44 rounded-full bg-gradient-to-br from-primary via-primary to-emerald-600 text-primary-foreground flex flex-col items-center justify-center shadow-xl shadow-primary/30">
                  <Sparkles className="w-10 h-10 mb-2" />
                  <span className="font-bold text-lg">LEADER</span>
                  <span className="text-xs opacity-90 text-center px-4">(Contagious Identity)</span>
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 scale-125" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 scale-150" />
              </motion.div>
            </div>

            {/* Right Column - Essential */}
            <div className="space-y-4">
              <motion.div
                className="text-sm font-semibold text-primary uppercase tracking-wider mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Essential Tools
              </motion.div>
              {essentialNodes.map((node, i) => (
                <div key={node.id} className="relative">
                  {/* Connection line */}
                  <motion.div
                    className="absolute left-0 top-1/2 w-8 h-0.5 bg-primary/30"
                    style={{ transform: "translateX(-100%)" }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                  />
                  <NodeCard node={node} index={i} side="right" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-12">
            {/* Center Leader Hub */}
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              <div className="w-28 h-28 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-xl shadow-primary/30">
                <Crown className="w-8 h-8 mb-1" />
                <span className="font-bold">LEADER</span>
                <span className="text-xs opacity-80">You</span>
              </div>
            </motion.div>

            {/* Foundation Section */}
            <div>
              <motion.h3
                className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Foundation
              </motion.h3>
              <div className="space-y-3">
                {foundationNodes.map((node, i) => (
                  <NodeCard key={node.id} node={node} index={i} side="left" />
                ))}
              </div>
            </div>

            {/* Essential Section */}
            <div>
              <motion.h3
                className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Essential Tools
              </motion.h3>
              <div className="space-y-3">
                {essentialNodes.map((node, i) => (
                  <NodeCard key={node.id} node={node} index={i} side="left" />
                ))}
              </div>
            </div>

            {/* Outcome */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold">{outcomeNode.title}</h4>
                  <p className="text-sm text-white/80 mt-1">{outcomeNode.description}</p>
                </div>
              </div>
            </motion.div>
          </div>
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
            <span>Foundation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-primary/50 bg-secondary" />
            <span>Essential Tools</span>
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
