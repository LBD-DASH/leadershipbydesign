import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface Pillar {
  id: string;
  pillar_name: string;
  current_score: number;
  target_score: number;
}

interface LeadershipScorecardProps {
  pillars: Pillar[];
}

const pillarColors: Record<string, string> = {
  Vitality: "hsl(152, 69%, 45%)",
  Sovereignty: "hsl(43, 74%, 53%)",
  Connection: "hsl(350, 80%, 65%)",
  Wisdom: "hsl(270, 60%, 60%)",
};

const LeadershipScorecard = ({ pillars }: LeadershipScorecardProps) => {
  // Calculate overall score
  const overallScore = pillars.length
    ? Math.round(
        pillars.reduce((sum, p) => sum + p.current_score, 0) / pillars.length
      )
    : 0;

  // Format data for radar chart - order for diamond shape
  const orderedPillars = ["Vitality", "Sovereignty", "Connection", "Wisdom"];
  const chartData = orderedPillars.map((name) => {
    const pillar = pillars.find((p) => p.pillar_name === name);
    return {
      pillar: name.toUpperCase(),
      score: pillar?.current_score || 50,
      fullMark: 100,
    };
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--los-gold))] font-medium">
          Leadership Scorecard
        </span>
      </div>

      <div className="backdrop-blur-xl bg-[hsl(var(--los-glass)/0.6)] border border-[hsl(var(--los-border))] rounded-2xl p-4">
        {/* Radar Chart */}
        <div className="h-64 -mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={chartData}
              startAngle={45}
              endAngle={-315}
            >
              <PolarGrid
                stroke="hsl(43, 30%, 25%)"
                strokeWidth={0.5}
                gridType="polygon"
              />
              <PolarAngleAxis
                dataKey="pillar"
                tick={{
                  fill: "hsl(43, 74%, 53%)",
                  fontSize: 9,
                  fontWeight: 500,
                }}
                tickLine={false}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(43, 74%, 53%)"
                strokeWidth={2}
                fill="hsl(43, 74%, 53%)"
                fillOpacity={0.2}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 pt-2 border-t border-[hsl(var(--los-border))]">
          <div className="text-center">
            <p className="text-2xl font-semibold text-[hsl(var(--los-gold))]">
              {overallScore}%
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-muted-foreground))]">
              Peak State
            </p>
          </div>
          <div className="w-px h-8 bg-[hsl(var(--los-border))]" />
          <div className="text-center">
            <p className="text-2xl font-semibold text-[hsl(var(--los-foreground))]">
              14d
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-muted-foreground))]">
              Consistency
            </p>
          </div>
        </div>
      </div>

      {/* Pillar Legend */}
      <div className="grid grid-cols-4 gap-2">
        {orderedPillars.map((name) => {
          const pillar = pillars.find((p) => p.pillar_name === name);
          const score = pillar?.current_score || 50;
          const color = pillarColors[name];

          return (
            <div
              key={name}
              className="text-center p-2 rounded-xl bg-[hsl(var(--los-muted)/0.5)]"
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-1"
                style={{ backgroundColor: color }}
              />
              <p className="text-[9px] uppercase tracking-wide text-[hsl(var(--los-muted-foreground))]">
                {name}
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color }}
              >
                {score}
              </p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default LeadershipScorecard;
