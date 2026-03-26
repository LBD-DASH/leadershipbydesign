import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useMemo } from 'react';
import { Shield, Target, Mail, TrendingUp } from 'lucide-react';
import { CC, AGENTS, TYPE_BORDER_COLORS, TYPE_LABELS, AgentType, timeAgo } from './theme';

function HeroCard({ icon, value, label, sub, accent = CC.teal }: { icon: React.ReactNode; value: string | number; label: string; sub: string; accent?: string }) {
  return (
    <div style={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 12 }} className="p-5 hover:border-[rgba(42,123,136,0.4)] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div style={{ color: accent }} className="p-2 rounded-lg" >{icon}</div>
      </div>
      <p style={{ color: CC.text, fontVariantNumeric: 'tabular-nums' }} className="text-3xl font-bold">{value}</p>
      <p style={{ color: CC.text }} className="text-sm font-medium mt-1">{label}</p>
      <p style={{ color: CC.muted }} className="text-xs mt-0.5">{sub}</p>
    </div>
  );
}

function StatusDot({ status, lastRun }: { status: string; lastRun?: string }) {
  const now = new Date();
  const isRecent = lastRun && (now.getTime() - new Date(lastRun).getTime()) < 30 * 60000;

  if (status === 'error') return <span className="w-2.5 h-2.5 rounded-full inline-block animate-pulse" style={{ background: CC.error, boxShadow: `0 0 6px ${CC.error}` }} />;
  if (status === 'running') return <span className="w-2.5 h-2.5 rounded-full inline-block animate-pulse" style={{ background: CC.warning }} />;
  if (status === 'success' && isRecent) return <span className="cc-pulse-dot" />;
  if (status === 'success') return <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CC.success }} />;
  if (status === 'skipped') return <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CC.muted }} />;
  return <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CC.muted, opacity: 0.4 }} />;
}

export default function CommandCentreTab() {
  const [filter, setFilter] = useState<AgentType | 'all'>('all');

  const { data: agentLogs } = useQuery({
    queryKey: ['cc-agent-status'],
    queryFn: async () => {
      const { data } = await supabase
        .from('agent_activity_log')
        .select('agent_name, status, message, items_processed, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      return data || [];
    },
    refetchInterval: 30000,
  });

  const { data: dealCount } = useQuery({
    queryKey: ['cc-active-deals-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('active_deals')
        .select('*', { count: 'exact', head: true })
        .not('status', 'in', '("won","lost")');
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const latestPerAgent = useMemo(() => {
    if (!agentLogs) return {};
    const map: Record<string, typeof agentLogs[0]> = {};
    for (const log of agentLogs) {
      if (!map[log.agent_name]) map[log.agent_name] = log;
    }
    return map;
  }, [agentLogs]);

  const today = new Date().toISOString().split('T')[0];
  const activeAgents24h = useMemo(() => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60000).toISOString();
    return new Set(agentLogs?.filter(l => l.created_at >= cutoff).map(l => l.agent_name)).size;
  }, [agentLogs]);

  const signalsToday = useMemo(() => {
    return agentLogs?.filter(l => l.agent_name === 'Buying Signal Hunter' && l.created_at >= today + 'T00:00:00')
      .reduce((s, l) => s + (l.items_processed || 0), 0) || 0;
  }, [agentLogs, today]);

  const actionsToday = useMemo(() => {
    return agentLogs?.filter(l => l.created_at >= today + 'T00:00:00')
      .reduce((s, l) => s + (l.items_processed || 0), 0) || 0;
  }, [agentLogs, today]);

  const filteredAgents = filter === 'all' ? AGENTS : AGENTS.filter(a => a.type === filter);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    AGENTS.forEach(a => { counts[a.type] = (counts[a.type] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HeroCard icon={<Shield className="w-5 h-5" />} value={activeAgents24h} label="Agents Active" sub={`of ${AGENTS.length} total`} accent={CC.teal} />
        <HeroCard icon={<Target className="w-5 h-5" />} value={signalsToday} label="Signals Today" sub="buying signals detected" accent={CC.gold} />
        <HeroCard icon={<Mail className="w-5 h-5" />} value={actionsToday} label="Actions Today" sub="emails, posts, drafts" accent={CC.teal} />
        <HeroCard icon={<TrendingUp className="w-5 h-5" />} value={dealCount ?? 0} label="Active Deals" sub="in pipeline" accent={CC.gold} />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'sales', 'content', 'outreach', 'pipeline', 'monitoring'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === t ? CC.teal : 'transparent',
              color: filter === t ? CC.text : CC.muted,
              border: `1px solid ${filter === t ? CC.teal : CC.border}`,
            }}
          >
            {t === 'all' ? `All (${AGENTS.length})` : `${TYPE_LABELS[t]} (${typeCounts[t] || 0})`}
          </button>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAgents.map(agent => {
          const log = latestPerAgent[agent.name];
          const borderColor = TYPE_BORDER_COLORS[agent.type];
          return (
            <div
              key={agent.name}
              style={{
                background: CC.cardBg,
                border: `1px solid ${CC.border}`,
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: 12,
              }}
              className="p-4 hover:border-[rgba(42,123,136,0.4)] transition-all"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{agent.icon}</span>
                  <span style={{ color: CC.text }} className="font-semibold text-sm">{agent.name}</span>
                </div>
                <StatusDot status={log?.status || 'unknown'} lastRun={log?.created_at} />
              </div>
              <p style={{ color: CC.muted }} className="text-xs mb-2">{agent.schedule}</p>
              {log ? (
                <>
                  <p className="text-xs" style={{ color: log.status === 'error' ? CC.error : log.status === 'success' ? CC.success : CC.muted }}>
                    {log.status === 'success' ? '✓' : log.status === 'error' ? '✗' : '○'} {log.status === 'success' ? 'Completed' : log.status === 'error' ? 'Failed' : log.status} — {timeAgo(log.created_at)}
                  </p>
                  {log.items_processed > 0 && (
                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${CC.teal}20`, color: CC.teal }}>
                      {log.items_processed} items
                    </span>
                  )}
                </>
              ) : (
                <p style={{ color: CC.muted }} className="text-xs">No activity recorded</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
