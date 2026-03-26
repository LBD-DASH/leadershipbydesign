import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CC } from './theme';
import { format, startOfMonth } from 'date-fns';
import GoogleAnalyticsCard from '@/components/admin/GoogleAnalyticsCard';

function FunnelBar({ label, count, width, color }: { label: string; count: number; width: number; color: string }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <div
        style={{ background: color, width: `${width}%`, minWidth: 40, borderRadius: 6 }}
        className="h-14 flex items-center justify-center transition-all"
      >
        <span style={{ color: CC.text }} className="text-lg font-bold">{count}</span>
      </div>
      <p style={{ color: CC.muted }} className="text-[10px] mt-2 text-center font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function PipelineTab() {
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd'T'00:00:00");

  const { data: bookingsMonth } = useQuery({
    queryKey: ['cc-pipe-bookings'],
    queryFn: async () => {
      const { count } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', monthStart);
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: wonMonth } = useQuery({
    queryKey: ['cc-pipe-won'],
    queryFn: async () => {
      const { count } = await supabase.from('active_deals').select('*', { count: 'exact', head: true }).eq('status', 'won').gte('created_at', monthStart);
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: contacted } = useQuery({
    queryKey: ['cc-pipe-contacted'],
    queryFn: async () => {
      const { count } = await supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', monthStart);
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const funnel = [
    { label: 'Prospects', count: 581, width: 100, color: CC.teal },
    { label: 'Contacted', count: contacted ?? 0, width: 70, color: '#2A8B88' },
    { label: 'Replied', count: 14, width: 45, color: '#3A9B88' },
    { label: 'Booked', count: bookingsMonth ?? 0, width: 25, color: CC.gold },
    { label: 'Won', count: wonMonth ?? 0, width: 15, color: '#D4B878' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const { data: emailsToday } = useQuery({
    queryKey: ['cc-pipe-emails-today'],
    queryFn: async () => {
      const { count } = await supabase.from('prospect_outreach').select('*', { count: 'exact', head: true }).gte('sent_at', today + 'T00:00:00').eq('status', 'sent');
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: queueDepth } = useQuery({
    queryKey: ['cc-pipe-queue'],
    queryFn: async () => {
      const { count } = await supabase.from('warm_lead_sequences').select('*', { count: 'exact', head: true }).eq('status', 'awaiting_first_contact');
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: lacTotal } = useQuery({
    queryKey: ['cc-pipe-lac'],
    queryFn: async () => {
      const { count } = await supabase.from('leader_as_coach_assessments').select('*', { count: 'exact', head: true });
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const stats = [
    { label: 'Queue Depth', value: queueDepth },
    { label: 'Emails Sent Today', value: emailsToday },
    { label: 'LAC Assessments', value: lacTotal },
  ];

  return (
    <div className="space-y-6">
      <div style={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 12 }} className="p-6">
        <h3 style={{ color: CC.gold }} className="font-serif font-bold mb-4">Monthly Funnel</h3>
        <div className="flex items-end gap-2 justify-between">
          {funnel.map(f => <FunnelBar key={f.label} {...f} />)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} style={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 12 }} className="p-4 text-center">
            <p style={{ color: CC.text, fontVariantNumeric: 'tabular-nums' }} className="text-2xl font-bold">{s.value ?? '–'}</p>
            <p style={{ color: CC.muted }} className="text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <GoogleAnalyticsCard />
    </div>
  );
}
