import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, TrendingUp, Loader2, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STAGES = [
  { key: 'new_lead', label: 'New Lead', color: 'bg-blue-500', emoji: '🆕' },
  { key: 'contacted', label: 'Contacted', color: 'bg-indigo-500', emoji: '📞' },
  { key: 'booked', label: 'Booked', color: 'bg-purple-500', emoji: '📅' },
  { key: 'met', label: 'Met', color: 'bg-amber-500', emoji: '🤝' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'bg-orange-500', emoji: '📄' },
  { key: 'won', label: 'Won', color: 'bg-green-600', emoji: '🏆' },
  { key: 'lost', label: 'Lost', color: 'bg-red-500', emoji: '❌' },
];

interface Deal {
  id: string;
  lead_name: string | null;
  lead_email: string | null;
  lead_company: string | null;
  lead_temperature: string | null;
  lead_score: number | null;
  stage: string;
  deal_value: number | null;
  notes: string | null;
  created_at: string;
}

export default function SalesPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({});

  const loadDeals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pipeline_deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading pipeline:', error);
    } else {
      setDeals((data as Deal[]) || []);
      const counts: Record<string, number> = {};
      STAGES.forEach(s => counts[s.key] = 0);
      (data || []).forEach((d: Deal) => {
        counts[d.stage] = (counts[d.stage] || 0) + 1;
      });
      setStageCounts(counts);
    }
    setLoading(false);
  };

  useEffect(() => { loadDeals(); }, []);

  const updateStage = async (dealId: string, newStage: string) => {
    const timestampField: Record<string, string> = {
      contacted: 'contacted_at',
      booked: 'booked_at',
      met: 'met_at',
      proposal_sent: 'proposal_sent_at',
      won: 'closed_at',
      lost: 'closed_at',
    };

    const updateData: Record<string, unknown> = {
      stage: newStage,
      updated_at: new Date().toISOString(),
    };

    if (timestampField[newStage]) {
      updateData[timestampField[newStage]] = new Date().toISOString();
    }
    if (newStage === 'lost') {
      updateData.close_reason = 'lost';
    }

    const { error } = await supabase
      .from('pipeline_deals')
      .update(updateData)
      .eq('id', dealId);

    if (error) {
      toast.error('Failed to update stage');
    } else {
      toast.success(`Moved to ${STAGES.find(s => s.key === newStage)?.label}`);
      loadDeals();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(stageCounts), 1);
  const activeStages = STAGES.filter(s => s.key !== 'lost');
  const totalDeals = deals.length;
  const wonDeals = stageCounts['won'] || 0;
  const lostDeals = stageCounts['lost'] || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Sales Pipeline</h3>
          <span className="text-sm text-muted-foreground">({totalDeals} deals)</span>
        </div>
        <Button variant="ghost" size="sm" onClick={loadDeals} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="space-y-3">
          {activeStages.map((stage, index) => {
            const count = stageCounts[stage.key] || 0;
            const widthPercent = Math.max((count / maxCount) * 100, 8);
            const prevCount = index > 0 ? (stageCounts[activeStages[index - 1].key] || 0) : null;
            const convRate = prevCount && prevCount > 0 ? Math.round((count / prevCount) * 100) : null;

            return (
              <div key={stage.key}>
                {convRate !== null && (
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground my-1">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                    <span>{convRate}%</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-28 text-sm text-muted-foreground text-right shrink-0 flex items-center gap-1.5 justify-end">
                    <span>{stage.emoji}</span>
                    <span>{stage.label}</span>
                  </div>
                  <div className="flex-1 h-9 bg-muted/30 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${stage.color} rounded-lg transition-all duration-500 flex items-center justify-end px-3`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      <span className="text-white text-sm font-bold">{count}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{totalDeals}</div>
            <div className="text-xs text-muted-foreground">Total Deals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{stageCounts['booked'] || 0}</div>
            <div className="text-xs text-muted-foreground">Booked</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{wonDeals}</div>
            <div className="text-xs text-muted-foreground">Won</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-500">{lostDeals}</div>
            <div className="text-xs text-muted-foreground">Lost</div>
          </div>
        </div>
      </div>

      {/* Deal List */}
      {deals.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Company</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Temp</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Stage</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {deals.slice(0, 50).map((deal) => (
                  <tr key={deal.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3">
                      <div className="font-medium text-foreground">{deal.lead_name || '—'}</div>
                      <div className="text-xs text-muted-foreground">{deal.lead_email || ''}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{deal.lead_company || '—'}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        deal.lead_temperature === 'hot' ? 'bg-red-100 text-red-700' :
                        deal.lead_temperature === 'warm' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {deal.lead_temperature || 'cool'}
                      </span>
                    </td>
                    <td className="p-3">
                      <Select
                        value={deal.stage}
                        onValueChange={(val) => updateStage(deal.id, val)}
                      >
                        <SelectTrigger className="h-7 text-xs w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map(s => (
                            <SelectItem key={s.key} value={s.key}>
                              {s.emoji} {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(deal.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deals.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Deals Yet</h3>
          <p className="text-muted-foreground text-sm">
            Deals are automatically created when leads come in through diagnostics, contact forms, and interest submissions.
          </p>
        </div>
      )}
    </div>
  );
}
