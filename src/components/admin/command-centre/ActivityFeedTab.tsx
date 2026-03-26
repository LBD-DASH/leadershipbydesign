import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CC, AGENTS, timeAgo } from './theme';

type Filter = 'all' | 'errors' | 'today' | '24h';

export default function ActivityFeedTab() {
  const [filter, setFilter] = useState<Filter>('today');

  const { data: activity } = useQuery({
    queryKey: ['cc-activity-feed'],
    queryFn: async () => {
      const { data } = await supabase
        .from('agent_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      return data || [];
    },
    refetchInterval: 30000,
  });

  const agentMap = Object.fromEntries(AGENTS.map(a => [a.name, a]));

  const today = new Date().toISOString().split('T')[0];
  const cutoff24h = new Date(Date.now() - 24 * 60 * 60000).toISOString();

  const filtered = (activity || []).filter(a => {
    if (filter === 'errors') return a.status === 'error';
    if (filter === 'today') return a.created_at >= today + 'T00:00:00';
    if (filter === '24h') return a.created_at >= cutoff24h;
    return true;
  });

  const statusIcon = (s: string) => {
    if (s === 'success') return <span style={{ color: CC.success }}>✓</span>;
    if (s === 'error') return <span style={{ color: CC.error }}>✗</span>;
    if (s === 'running') return <span style={{ color: CC.warning }}>◉</span>;
    return <span style={{ color: CC.muted }}>○</span>;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'today', '24h', 'errors'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ background: filter === f ? CC.teal : 'transparent', color: filter === f ? CC.text : CC.muted, border: `1px solid ${filter === f ? CC.teal : CC.border}` }}>
            {f === 'all' ? 'All' : f === 'errors' ? 'Errors Only' : f === 'today' ? 'Today' : 'Last 24h'}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.length === 0 && <p style={{ color: CC.muted }} className="text-sm py-8 text-center">No activity found</p>}
        {filtered.map(entry => {
          const agent = agentMap[entry.agent_name];
          const time = new Date(entry.created_at);
          return (
            <div key={entry.id} style={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 10 }} className="p-3 hover:border-[rgba(42,123,136,0.4)] transition-all">
              <div className="flex items-start gap-3">
                <span style={{ color: CC.muted }} className="text-xs font-mono w-12 flex-shrink-0 pt-0.5">
                  {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">{agent?.icon || '🤖'}</span>
                    <span style={{ color: CC.text }} className="text-sm font-semibold">{entry.agent_name}</span>
                    <span className="text-sm">{statusIcon(entry.status)}</span>
                    <span style={{ color: entry.status === 'error' ? CC.error : entry.status === 'success' ? CC.success : CC.muted }} className="text-xs">{entry.status}</span>
                  </div>
                  {entry.message && <p style={{ color: CC.muted }} className="text-xs mt-1 pl-6">"{entry.message}"</p>}
                  {entry.items_processed > 0 && (
                    <span className="inline-block ml-6 mt-1 text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${CC.teal}20`, color: CC.teal }}>
                      {entry.items_processed} items
                    </span>
                  )}
                </div>
                <span style={{ color: CC.muted }} className="text-[10px] flex-shrink-0">{timeAgo(entry.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
