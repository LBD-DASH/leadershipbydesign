import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { CC, timeAgo } from './theme';

const DEAL_STAGES = ['prospect', 'contacted', 'proposal_sent', 'negotiating', 'won', 'lost'] as const;
const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', contacted: 'Contacted', proposal_sent: 'Proposal Sent',
  negotiating: 'Negotiating', won: 'Won', lost: 'Lost',
};

interface Deal {
  id: string;
  contact_name: string;
  contact_email: string | null;
  company: string;
  contact_title: string | null;
  deal_value: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  next_action: string | null;
  next_action_date: string | null;
  last_activity_at: string | null;
  created_at: string;
}

function DealCard({ deal, onMove, onEdit }: { deal: Deal; onMove: (id: string, status: string) => void; onEdit: (deal: Deal) => void }) {
  const stageIdx = DEAL_STAGES.indexOf(deal.status as any);
  const nextStage = stageIdx < DEAL_STAGES.length - 2 ? DEAL_STAGES[stageIdx + 1] : null;
  const leftBorder = deal.status === 'won' ? CC.success : deal.status === 'lost' ? CC.error : CC.border;
  const bgTint = deal.status === 'won' ? 'rgba(34,197,94,0.05)' : deal.status === 'lost' ? 'rgba(239,68,68,0.05)' : CC.cardBg;

  return (
    <div
      onClick={() => onEdit(deal)}
      style={{ background: bgTint, border: `1px solid ${CC.border}`, borderLeft: `4px solid ${leftBorder}`, borderRadius: 10 }}
      className="p-3 cursor-pointer hover:border-[rgba(42,123,136,0.4)] transition-all mb-2"
    >
      <p style={{ color: CC.text }} className="font-semibold text-sm">{deal.contact_name}</p>
      <p style={{ color: CC.muted }} className="text-xs">{deal.company}</p>
      {deal.contact_title && <p style={{ color: CC.muted }} className="text-xs">{deal.contact_title}</p>}
      {deal.deal_value && <p style={{ color: CC.gold }} className="text-sm font-bold mt-1">{deal.deal_value}</p>}
      {deal.notes && <p style={{ color: CC.muted }} className="text-xs mt-1 truncate">📝 {deal.notes}</p>}
      {deal.last_activity_at && <p style={{ color: CC.muted }} className="text-[10px] mt-1">🕐 {timeAgo(deal.last_activity_at)}</p>}
      <div className="flex gap-1 mt-2" onClick={e => e.stopPropagation()}>
        {nextStage && (
          <button onClick={() => onMove(deal.id, nextStage)} className="text-[10px] px-2 py-0.5 rounded" style={{ background: `${CC.teal}20`, color: CC.teal }}>
            Move → {STAGE_LABELS[nextStage]}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DealsTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState({ contact_name: '', contact_email: '', company: '', contact_title: '', deal_value: '', status: 'prospect', notes: '', next_action: '' });

  const { data: deals } = useQuery({
    queryKey: ['cc-deals'],
    queryFn: async () => {
      const { data } = await supabase.from('active_deals').select('*').order('last_activity_at', { ascending: false });
      return (data || []) as Deal[];
    },
    refetchInterval: 30000,
  });

  const moveDeal = async (id: string, status: string) => {
    await supabase.from('active_deals').update({ status, last_activity_at: new Date().toISOString() }).eq('id', id);
    qc.invalidateQueries({ queryKey: ['cc-deals'] });
    toast.success(`Moved to ${STAGE_LABELS[status]}`);
  };

  const saveDeal = async () => {
    if (!form.contact_name || !form.company) return toast.error('Name and Company required');
    if (editing) {
      await supabase.from('active_deals').update({ ...form, last_activity_at: new Date().toISOString() }).eq('id', editing.id);
    } else {
      await supabase.from('active_deals').insert([form]);
    }
    qc.invalidateQueries({ queryKey: ['cc-deals'] });
    setShowForm(false);
    setEditing(null);
    setForm({ contact_name: '', contact_email: '', company: '', contact_title: '', deal_value: '', status: 'prospect', notes: '', next_action: '' });
    toast.success(editing ? 'Deal updated' : 'Deal added');
  };

  const openEdit = (deal: Deal) => {
    setEditing(deal);
    setForm({ contact_name: deal.contact_name, contact_email: deal.contact_email || '', company: deal.company, contact_title: deal.contact_title || '', deal_value: deal.deal_value || '', status: deal.status, notes: deal.notes || '', next_action: deal.next_action || '' });
    setShowForm(true);
  };

  const inputStyle = { background: CC.bg, border: `1px solid ${CC.border}`, color: CC.text, borderRadius: 8 };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ color: CC.gold }} className="font-serif text-lg font-bold">Active Deals</h2>
        <button onClick={() => { setEditing(null); setForm({ contact_name: '', contact_email: '', company: '', contact_title: '', deal_value: '', status: 'prospect', notes: '', next_action: '' }); setShowForm(true); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: CC.teal, color: CC.text }}>
          <Plus className="w-3.5 h-3.5" /> Add Deal
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 16 }} className="p-6 w-full max-w-md mx-4">
            <div className="flex justify-between mb-4">
              <h3 style={{ color: CC.text }} className="font-serif font-bold">{editing ? 'Edit Deal' : 'New Deal'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4" style={{ color: CC.muted }} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Contact Name *" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle} />
              <input placeholder="Email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle} />
              <input placeholder="Company *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle} />
              <input placeholder="Title" value={form.contact_title} onChange={e => setForm({ ...form, contact_title: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle} />
              <input placeholder="Deal Value (e.g. R120,000)" value={form.deal_value} onChange={e => setForm({ ...form, deal_value: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle} />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle}>
                {DEAL_STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle} rows={2} />
              <input placeholder="Next Action" value={form.next_action} onChange={e => setForm({ ...form, next_action: e.target.value })} className="w-full p-2.5 text-sm" style={inputStyle} />
              <button onClick={saveDeal} className="w-full py-2.5 rounded-lg font-medium text-sm" style={{ background: CC.teal, color: CC.text }}>{editing ? 'Update Deal' : 'Create Deal'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEAL_STAGES.map(stage => {
          const stageDeals = deals?.filter(d => d.status === stage) || [];
          const headerColor = stage === 'won' ? CC.success : stage === 'lost' ? CC.error : CC.text;
          return (
            <div key={stage}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: headerColor }} className="text-xs font-bold uppercase tracking-wider">{STAGE_LABELS[stage]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${CC.teal}20`, color: CC.teal }}>{stageDeals.length}</span>
              </div>
              <div className="min-h-[120px]">
                {stageDeals.map(deal => <DealCard key={deal.id} deal={deal} onMove={moveDeal} onEdit={openEdit} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
