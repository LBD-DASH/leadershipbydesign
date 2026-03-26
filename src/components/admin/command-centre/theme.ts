// Command Centre dark theme constants
export const CC = {
  bg: '#0F1F2E',
  cardBg: '#162736',
  cardHover: '#1A3044',
  teal: '#2A7B88',
  gold: '#C8A864',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  text: '#F8F6F1',
  muted: '#94A3B8',
  border: 'rgba(42, 123, 136, 0.15)',
  borderHover: 'rgba(42, 123, 136, 0.4)',
  blue: '#3B82F6',
} as const;

export const AGENTS = [
  { name: "Daily Briefing", schedule: "06:30 SAST", type: "monitoring" as const, icon: "📊" },
  { name: "Pipeline Monitor", schedule: "Every 30 min", type: "monitoring" as const, icon: "🔍" },
  { name: "Hot Lead Responder", schedule: "Every 15 min", type: "sales" as const, icon: "🔥" },
  { name: "Diagnostic Processor", schedule: "Hourly", type: "pipeline" as const, icon: "⚡" },
  { name: "Booking Prep", schedule: "Every 30 min", type: "sales" as const, icon: "📋" },
  { name: "Apollo Auto-Enroller", schedule: "Every 30 min", type: "outreach" as const, icon: "🚀" },
  { name: "Reply Drafter", schedule: "Every 30 min", type: "sales" as const, icon: "✉️" },
  { name: "Apollo List Builder", schedule: "Sunday 18:00", type: "outreach" as const, icon: "🎯" },
  { name: "Booking Confirmation", schedule: "Every 15 min", type: "sales" as const, icon: "📅" },
  { name: "Win/Loss Tracker", schedule: "17:00 daily", type: "sales" as const, icon: "🏆" },
  { name: "LinkedIn Scheduler", schedule: "06:45 Tue/Thu/Sat", type: "content" as const, icon: "💼" },
  { name: "Stale Lead Re-engager", schedule: "Wed 09:00", type: "outreach" as const, icon: "🔄" },
  { name: "Blog Repurposer", schedule: "Thu 20:00", type: "content" as const, icon: "📝" },
  { name: "Multi-Channel Outreach", schedule: "08:00 weekdays", type: "outreach" as const, icon: "📡" },
  { name: "X Engagement", schedule: "07:30 weekdays", type: "content" as const, icon: "🐦" },
  { name: "Forum Engagement", schedule: "09:00 weekdays", type: "content" as const, icon: "💬" },
  { name: "Newsletter Curator", schedule: "Sunday 16:00", type: "content" as const, icon: "📰" },
  { name: "Competitor Monitor", schedule: "Monday 06:00", type: "monitoring" as const, icon: "👀" },
  { name: "Buying Signal Hunter", schedule: "07:00 weekdays", type: "sales" as const, icon: "🎯" },
] as const;

export type AgentType = 'sales' | 'content' | 'pipeline' | 'outreach' | 'monitoring';

export const TYPE_BORDER_COLORS: Record<AgentType, string> = {
  sales: CC.teal,
  content: CC.gold,
  pipeline: CC.success,
  outreach: CC.blue,
  monitoring: CC.muted,
};

export const TYPE_LABELS: Record<AgentType, string> = {
  sales: 'Sales',
  content: 'Content',
  pipeline: 'Pipeline',
  outreach: 'Outreach',
  monitoring: 'Monitoring',
};

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
