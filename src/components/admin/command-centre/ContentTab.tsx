import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CC, AGENTS, timeAgo } from './theme';
import { format, startOfWeek, addDays } from 'date-fns';

const SCHEDULE = [
  { days: [2, 4, 6], time: '06:45', label: 'LinkedIn', icon: '💼' },
  { days: [1, 2, 3, 4, 5], time: '07:30', label: 'X Engagement', icon: '🐦' },
  { days: [1, 2, 3, 4, 5], time: '09:00', label: 'Forum', icon: '💬' },
  { days: [4], time: '20:00', label: 'Blog Repurpose', icon: '📝' },
  { days: [0], time: '16:00', label: 'Newsletter', icon: '📰' },
  { days: [0], time: '18:00', label: 'Apollo Build', icon: '🎯' },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ContentTab() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: contentLogs } = useQuery({
    queryKey: ['cc-content-logs'],
    queryFn: async () => {
      const start = format(weekStart, "yyyy-MM-dd'T'00:00:00");
      const { data } = await supabase
        .from('agent_activity_log')
        .select('*')
        .eq('agent_type', 'content')
        .gte('created_at', start)
        .order('created_at', { ascending: false });
      return data || [];
    },
    refetchInterval: 30000,
  });

  const publishedMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    contentLogs?.forEach(log => {
      const day = log.created_at.split('T')[0];
      if (!map[day]) map[day] = new Set();
      map[day].add(log.agent_name);
    });
    return map;
  }, [contentLogs]);

  const { data: recentContent } = useQuery({
    queryKey: ['cc-content-recent'],
    queryFn: async () => {
      const { data } = await supabase
        .from('agent_activity_log')
        .select('*')
        .eq('agent_type', 'content')
        .order('created_at', { ascending: false })
        .limit(20);
      return data || [];
    },
    refetchInterval: 30000,
  });

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      <h2 style={{ color: CC.gold }} className="font-serif text-lg font-bold">Weekly Content Calendar</h2>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, i) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayOfWeek = day.getDay();
          const isToday = dayStr === today;
          const published = publishedMap[dayStr] || new Set();
          const scheduled = SCHEDULE.filter(s => s.days.includes(dayOfWeek));

          return (
            <div key={i} style={{
              background: isToday ? CC.cardHover : CC.cardBg,
              border: `1px solid ${isToday ? CC.teal : CC.border}`,
              borderRadius: 10,
            }} className="p-3 min-h-[120px]">
              <p style={{ color: isToday ? CC.teal : CC.muted }} className="text-xs font-bold mb-2">
                {DAY_NAMES[dayOfWeek]} {format(day, 'd')}
              </p>
              <div className="space-y-1">
                {scheduled.map((s, j) => {
                  const agentName = AGENTS.find(a => a.icon === s.icon)?.name || s.label;
                  const isDone = published.has(agentName);
                  return (
                    <div key={j} className="flex items-center gap-1">
                      <span className="text-xs">{s.icon}</span>
                      <span style={{ color: isDone ? CC.success : dayStr <= today ? CC.muted : CC.muted }} className="text-[10px]">
                        {isDone ? '✓' : dayStr < today ? '—' : s.time}
                      </span>
                    </div>
                  );
                })}
                {scheduled.length === 0 && <p style={{ color: CC.muted }} className="text-[10px]">—</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Content Log */}
      <div>
        <h3 style={{ color: CC.text }} className="font-semibold text-sm mb-3">Recent Content Actions</h3>
        <div style={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 12 }} className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${CC.border}` }}>
                <th style={{ color: CC.muted }} className="text-left p-3 text-xs font-medium">Date</th>
                <th style={{ color: CC.muted }} className="text-left p-3 text-xs font-medium">Agent</th>
                <th style={{ color: CC.muted }} className="text-left p-3 text-xs font-medium">Status</th>
                <th style={{ color: CC.muted }} className="text-left p-3 text-xs font-medium hidden md:table-cell">Message</th>
              </tr>
            </thead>
            <tbody>
              {(recentContent || []).map(log => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${CC.border}` }} className="hover:bg-[#1A3044]">
                  <td style={{ color: CC.muted }} className="p-3 text-xs">{timeAgo(log.created_at)}</td>
                  <td style={{ color: CC.text }} className="p-3 text-xs font-medium">{log.agent_name}</td>
                  <td className="p-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      background: log.status === 'success' ? `${CC.success}20` : log.status === 'error' ? `${CC.error}20` : `${CC.muted}20`,
                      color: log.status === 'success' ? CC.success : log.status === 'error' ? CC.error : CC.muted,
                    }}>{log.status}</span>
                  </td>
                  <td style={{ color: CC.muted }} className="p-3 text-xs truncate max-w-[300px] hidden md:table-cell">{log.message || '—'}</td>
                </tr>
              ))}
              {!recentContent?.length && (
                <tr><td colSpan={4} style={{ color: CC.muted }} className="p-6 text-center text-xs">No content activity yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
