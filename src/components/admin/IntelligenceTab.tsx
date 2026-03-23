import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Flame, AlertTriangle, Mail, Target, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format, differenceInMinutes, differenceInDays } from 'date-fns';

interface LACLead {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  company: string | null;
  buying_intent_score: number | null;
  ruflo_path: string | null;
  ruflo_processed_at: string | null;
  apollo_enrichment_status: string | null;
  vip_email_sent: boolean | null;
  vip_email_outcome: string | null;
  vip_email_sent_at: string | null;
  status: string | null;
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color || 'text-primary'}`} />
          {value}
        </CardTitle>
      </CardHeader>
      {sub && <CardContent><p className="text-xs text-muted-foreground">{sub}</p></CardContent>}
    </Card>
  );
}

export default function IntelligenceTab() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['lac-intelligence'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leader_as_coach_assessments' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as LACLead[];
    },
  });

  if (isLoading) return <div className="text-center py-12 text-muted-foreground">Loading intelligence data...</div>;

  const all = leads || [];
  const processed = all.filter(l => l.ruflo_processed_at);
  const unprocessed = all.filter(l => !l.ruflo_processed_at);
  const byPath = (p: string) => all.filter(l => l.ruflo_path === p);
  const avgIntent = processed.length > 0
    ? Math.round(processed.reduce((s, l) => s + (l.buying_intent_score || 0), 0) / processed.length)
    : 0;

  const vipLeads = byPath('vip');
  const enhancedLeads = byPath('enhanced');
  const standardLeads = byPath('standard');
  const fsiLeads = byPath('fsi');

  const apolloSuccess = all.filter(l => l.apollo_enrichment_status === 'success').length;
  const apolloFailed = all.filter(l => l.apollo_enrichment_status === 'failed').length;
  const apolloSkipped = all.filter(l => l.apollo_enrichment_status === 'skipped').length;

  const vipSent = all.filter(l => l.vip_email_sent);
  const vipReplied = vipSent.filter(l => l.vip_email_outcome === 'replied');
  const vipBooked = vipSent.filter(l => l.vip_email_outcome === 'booked_call');
  const vipBounced = vipSent.filter(l => l.vip_email_outcome === 'bounced');

  // Attention required
  const now = new Date();
  const staleUnprocessed = unprocessed.filter(l => differenceInMinutes(now, new Date(l.created_at)) > 30);
  const staleAwaitingReply = vipSent.filter(l =>
    l.vip_email_outcome === 'awaiting_reply' &&
    l.vip_email_sent_at &&
    differenceInDays(now, new Date(l.vip_email_sent_at)) > 3
  );

  return (
    <div className="space-y-8">
      {/* Processing Status */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Processing Status</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Total Leads" value={all.length} />
          <StatCard icon={CheckCircle} label="Processed" value={processed.length} color="text-green-600" sub={`${unprocessed.length} pending`} />
          <StatCard icon={Target} label="Avg Intent" value={avgIntent} color="text-amber-600" sub="Buying intent score" />
          <StatCard icon={Flame} label="VIP" value={vipLeads.length} color="text-amber-500" />
          <StatCard icon={Brain} label="Enhanced" value={enhancedLeads.length} color="text-blue-600" sub={`FSI: ${fsiLeads.length} · Std: ${standardLeads.length}`} />
        </div>
      </section>

      {/* Lead Quality Breakdown */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Lead Quality Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30" variant="outline">VIP</Badge>
                {vipLeads.length} leads
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>Avg intent: <strong>{vipLeads.length > 0 ? Math.round(vipLeads.reduce((s, l) => s + (l.buying_intent_score || 0), 0) / vipLeads.length) : 0}</strong></p>
              <p>Emails sent: {vipLeads.filter(l => l.vip_email_sent).length}</p>
              <p>Replied: {vipLeads.filter(l => l.vip_email_outcome === 'replied').length}</p>
              <p>Booked: {vipLeads.filter(l => l.vip_email_outcome === 'booked_call').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30" variant="outline">Enhanced</Badge>
                {enhancedLeads.length} leads
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>Avg intent: <strong>{enhancedLeads.length > 0 ? Math.round(enhancedLeads.reduce((s, l) => s + (l.buying_intent_score || 0), 0) / enhancedLeads.length) : 0}</strong></p>
              <p>Contacted: {enhancedLeads.filter(l => l.status === 'contacted' || l.status === 'replied').length}</p>
              <p>Qualified: {enhancedLeads.filter(l => l.status === 'qualified' || l.status === 'booked').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className="bg-muted text-muted-foreground" variant="outline">Standard</Badge>
                {standardLeads.length} leads
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>Nurturing: {standardLeads.filter(l => l.status === 'nurturing').length}</p>
              <p>New: {standardLeads.filter(l => l.status === 'new' || !l.status).length}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enrichment Stats */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Enrichment Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CheckCircle} label="Apollo Success" value={apolloSuccess} color="text-green-600" />
          <StatCard icon={XCircle} label="Apollo Failed" value={apolloFailed} color="text-destructive" />
          <StatCard icon={Clock} label="Apollo Skipped" value={apolloSkipped} color="text-muted-foreground" />
          <StatCard icon={Brain} label="Ruflo Processed" value={processed.length} color="text-primary" sub={`${all.length - processed.length} remaining`} />
        </div>
      </section>

      {/* Email Performance */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Mail className="w-5 h-5" /> VIP Email Performance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={Mail} label="Sent" value={vipSent.length} />
          <StatCard icon={CheckCircle} label="Replied" value={vipReplied.length} color="text-green-600" />
          <StatCard icon={Target} label="Booked" value={vipBooked.length} color="text-emerald-700" />
          <StatCard icon={XCircle} label="Bounced" value={vipBounced.length} color="text-destructive" />
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reply Rate</CardDescription>
              <CardTitle className="text-2xl">
                {vipSent.length > 0 ? `${Math.round(((vipReplied.length + vipBooked.length) / vipSent.length) * 100)}%` : '—'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Attention Required */}
      {(staleUnprocessed.length > 0 || staleAwaitingReply.length > 0) && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Attention Required</h2>
          <div className="space-y-3">
            {staleUnprocessed.length > 0 && (
              <Card className="border-amber-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-amber-600">⚠️ {staleUnprocessed.length} leads unprocessed &gt;30 min</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {staleUnprocessed.slice(0, 5).map(l => (
                    <div key={l.id} className="flex items-center gap-2 py-1">
                      <span>{l.name || l.email || 'Anonymous'}</span>
                      <span className="text-muted-foreground">—</span>
                      <span className="text-muted-foreground">{l.company || '—'}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{format(new Date(l.created_at), 'MMM d HH:mm')}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {staleAwaitingReply.length > 0 && (
              <Card className="border-amber-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-amber-600">📧 {staleAwaitingReply.length} VIP emails awaiting reply &gt;3 days</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {staleAwaitingReply.slice(0, 5).map(l => (
                    <div key={l.id} className="flex items-center gap-2 py-1">
                      <span>{l.name || l.email || 'Anonymous'}</span>
                      <span className="text-muted-foreground">—</span>
                      <span className="text-xs text-muted-foreground ml-auto">Sent {l.vip_email_sent_at ? format(new Date(l.vip_email_sent_at), 'MMM d') : '—'}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
