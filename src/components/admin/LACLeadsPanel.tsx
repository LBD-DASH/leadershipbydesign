import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Search, Mail, Building, Calendar, Target, Users, Flame, Brain, Send, StickyNote, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface LACLead {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  company: string | null;
  job_title: string | null;
  version: string;
  total_score: number;
  profile: string;
  lowest_areas: any;
  lead_score: number | null;
  lead_temperature: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  buying_intent_score: number | null;
  buyer_type: string | null;
  urgency_level: string | null;
  ideal_next_step: string | null;
  ruflo_path: string | null;
  ruflo_processed_at: string | null;
  apollo_data: any;
  apollo_enrichment_status: string | null;
  vip_email_sent: boolean | null;
  vip_email_outcome: string | null;
  vip_email_subject: string | null;
  vip_email_body: string | null;
  vip_email_sent_at: string | null;
  status: string | null;
  admin_notes: string | null;
  ruflo_intelligence: any;
}

const pathColors: Record<string, string> = {
  vip: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
  enhanced: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  fsi: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  standard: 'bg-muted text-muted-foreground',
};

const statusColors: Record<string, string> = {
  new: 'bg-primary/10 text-primary',
  enriched: 'bg-blue-500/10 text-blue-600',
  contacted: 'bg-amber-500/10 text-amber-600',
  replied: 'bg-green-500/10 text-green-600',
  qualified: 'bg-emerald-500/10 text-emerald-700',
  booked: 'bg-green-600/10 text-green-700',
  closed_won: 'bg-green-700/20 text-green-800',
  nurturing: 'bg-violet-500/10 text-violet-600',
  closed_lost: 'bg-destructive/10 text-destructive',
  unresponsive: 'bg-muted text-muted-foreground',
};

function IntentBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-muted-foreground text-xs">—</span>;
  const color = score >= 70 ? 'text-red-600' : score >= 50 ? 'text-amber-600' : 'text-green-600';
  const icon = score >= 70 ? '🔥' : score >= 50 ? '🟡' : '🟢';
  return <span className={`font-semibold ${color}`}>{icon} {score}</span>;
}

export default function LACLeadsPanel() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [minIntent, setMinIntent] = useState(0);
  const [pathFilter, setPathFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LACLead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const { data: leads, isLoading } = useQuery({
    queryKey: ['lac-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leader_as_coach_assessments' as any)
        .select('*')
        .order('buying_intent_score', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as LACLead[];
    },
  });

  const filtered = (leads || []).filter((l) => {
    if (search) {
      const s = search.toLowerCase();
      if (
        !l.name?.toLowerCase().includes(s) &&
        !l.email?.toLowerCase().includes(s) &&
        !l.company?.toLowerCase().includes(s)
      ) return false;
    }
    if (minIntent > 0 && (l.buying_intent_score ?? 0) < minIntent) return false;
    if (pathFilter !== 'all' && l.ruflo_path !== pathFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const totalLeads = leads?.length || 0;
  const enrichedCount = leads?.filter(l => l.ruflo_processed_at).length || 0;
  const hotCount = leads?.filter(l => (l.buying_intent_score ?? 0) >= 70).length || 0;
  const vipCount = leads?.filter(l => l.ruflo_path === 'vip').length || 0;

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('leader_as_coach_assessments' as any)
      .update({ status } as any)
      .eq('id', id);
    if (error) { toast.error('Failed to update status'); return; }
    toast.success(`Status updated to ${status}`);
    queryClient.invalidateQueries({ queryKey: ['lac-leads'] });
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
  };

  const handleAddNote = async (id: string, note: string) => {
    const existing = selectedLead?.admin_notes || '';
    const timestamp = format(new Date(), 'MMM d HH:mm');
    const updated = `[${timestamp}] ${note}\n${existing}`.trim();
    const { error } = await supabase
      .from('leader_as_coach_assessments' as any)
      .update({ admin_notes: updated } as any)
      .eq('id', id);
    if (error) { toast.error('Failed to save note'); return; }
    toast.success('Note added');
    setNoteText('');
    queryClient.invalidateQueries({ queryKey: ['lac-leads'] });
    if (selectedLead) setSelectedLead({ ...selectedLead, admin_notes: updated });
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardDescription>Total LAC Leads</CardDescription><CardTitle className="text-2xl flex items-center gap-2"><Users className="w-5 h-5 text-primary" />{totalLeads}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Ruflo Enriched</CardDescription><CardTitle className="text-2xl flex items-center gap-2"><Brain className="w-5 h-5 text-blue-600" />{enrichedCount}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Hot Leads (70+)</CardDescription><CardTitle className="text-2xl flex items-center gap-2"><Flame className="w-5 h-5 text-red-500" />{hotCount}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>VIP Path</CardDescription><CardTitle className="text-2xl flex items-center gap-2"><Target className="w-5 h-5 text-amber-600" />{vipCount}</CardTitle></CardHeader></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Name, email, company..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="w-48">
              <label className="text-xs text-muted-foreground mb-1 block">Min Buying Intent: {minIntent}</label>
              <Slider min={0} max={100} step={5} value={[minIntent]} onValueChange={([v]) => setMinIntent(v)} />
            </div>
            <div className="w-36">
              <label className="text-xs text-muted-foreground mb-1 block">Ruflo Path</label>
              <Select value={pathFilter} onValueChange={setPathFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Paths</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  <SelectItem value="fsi">FSI</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="unprocessed">Unprocessed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-36">
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="enriched">Enriched</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="nurturing">Nurturing</SelectItem>
                  <SelectItem value="closed_won">Won</SelectItem>
                  <SelectItem value="closed_lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leader as Coach Assessments</CardTitle>
          <CardDescription>{filtered.length} of {totalLeads} leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>🎯 Intent</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>📧 Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No leads found</TableCell></TableRow>
                  ) : (
                    filtered.map(lead => (
                      <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedLead(lead); setNewStatus(lead.status || 'new'); }}>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {format(new Date(lead.created_at), 'MMM d')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{lead.name || 'Anonymous'}</span>
                            {lead.job_title && <span className="text-xs text-muted-foreground">{lead.job_title}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{lead.company || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.total_score}/75</Badge>
                        </TableCell>
                        <TableCell><IntentBadge score={lead.buying_intent_score} /></TableCell>
                        <TableCell>
                          {lead.ruflo_path ? (
                            <Badge variant="outline" className={pathColors[lead.ruflo_path] || ''}>{lead.ruflo_path.toUpperCase()}</Badge>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell>
                          {lead.vip_email_sent ? (
                            <Badge variant="outline" className={
                              lead.vip_email_outcome === 'replied' ? 'bg-green-500/10 text-green-600' :
                              lead.vip_email_outcome === 'booked_call' ? 'bg-emerald-500/10 text-emerald-700' :
                              lead.vip_email_outcome === 'bounced' ? 'bg-destructive/10 text-destructive' :
                              'bg-amber-500/10 text-amber-600'
                            }>
                              {lead.vip_email_outcome || 'sent'}
                            </Badge>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[lead.status || 'new'] || ''} variant="outline">
                            {(lead.status || 'new').replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={open => { if (!open) setSelectedLead(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedLead.name || 'Anonymous Lead'}
                  {selectedLead.ruflo_path && (
                    <Badge variant="outline" className={pathColors[selectedLead.ruflo_path] || ''}>{selectedLead.ruflo_path.toUpperCase()}</Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Diagnostic Profile */}
                <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Diagnostic Profile</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Version:</span> {selectedLead.version === 'hr_leader' ? 'HR/L&D Leader' : 'Manager'}</div>
                    <div><span className="text-muted-foreground">Score:</span> <strong>{selectedLead.total_score}/75</strong></div>
                    <div><span className="text-muted-foreground">Profile:</span> <Badge variant="outline">{selectedLead.profile}</Badge></div>
                    <div><span className="text-muted-foreground">Email:</span> {selectedLead.email || '—'}</div>
                  </div>
                  {selectedLead.lowest_areas && Array.isArray(selectedLead.lowest_areas) && selectedLead.lowest_areas.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Lowest areas: </span>
                      {selectedLead.lowest_areas.map((a: any, i: number) => (
                        <Badge key={i} variant="secondary" className="mr-1 text-xs">{a.theme || a}</Badge>
                      ))}
                    </div>
                  )}
                </section>

                {/* Lead Intelligence */}
                <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Lead Intelligence</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Buying Intent:</span> <IntentBadge score={selectedLead.buying_intent_score} /></div>
                    <div><span className="text-muted-foreground">Buyer Type:</span> {selectedLead.buyer_type || '—'}</div>
                    <div><span className="text-muted-foreground">Urgency:</span> {selectedLead.urgency_level || '—'}</div>
                    <div><span className="text-muted-foreground">Ruflo Path:</span> {selectedLead.ruflo_path || '—'}</div>
                  </div>
                  {selectedLead.ideal_next_step && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <strong>Ideal Next Step:</strong> {selectedLead.ideal_next_step}
                    </div>
                  )}
                </section>

                {/* Apollo Data */}
                {selectedLead.apollo_data && (
                  <section>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Apollo Data</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Title:</span> {selectedLead.apollo_data?.person?.title || selectedLead.job_title || '—'}</div>
                      <div><span className="text-muted-foreground">Industry:</span> {selectedLead.apollo_data?.organization?.industry || '—'}</div>
                      <div><span className="text-muted-foreground">Employees:</span> {selectedLead.apollo_data?.organization?.estimated_num_employees || '—'}</div>
                      <div><span className="text-muted-foreground">LinkedIn:</span> {selectedLead.apollo_data?.person?.linkedin_url ? <a href={selectedLead.apollo_data.person.linkedin_url} target="_blank" className="text-primary underline">View</a> : '—'}</div>
                    </div>
                  </section>
                )}

                {/* Outreach Status */}
                <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Outreach Status</h3>
                  {selectedLead.vip_email_sent ? (
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Sent:</span> {selectedLead.vip_email_sent_at ? format(new Date(selectedLead.vip_email_sent_at), 'MMM d, HH:mm') : '—'}</div>
                      <div><span className="text-muted-foreground">Subject:</span> {selectedLead.vip_email_subject || '—'}</div>
                      <div><span className="text-muted-foreground">Outcome:</span> <Badge variant="outline">{selectedLead.vip_email_outcome || 'awaiting_reply'}</Badge></div>
                      {selectedLead.vip_email_body && (
                        <details className="mt-1">
                          <summary className="text-xs text-muted-foreground cursor-pointer">View email body</summary>
                          <pre className="text-xs mt-1 p-2 bg-muted rounded whitespace-pre-wrap">{selectedLead.vip_email_body}</pre>
                        </details>
                      )}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No outreach email sent yet</p>}
                </section>

                {/* Quick Actions */}
                <section className="border-t pt-4 space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Actions</h3>
                  <div className="flex items-center gap-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(statusColors).map(s => (
                          <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => handleUpdateStatus(selectedLead.id, newStatus)} disabled={newStatus === selectedLead.status}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Update
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Textarea placeholder="Add a note..." value={noteText} onChange={e => setNoteText(e.target.value)} className="min-h-[60px]" />
                    <Button size="sm" className="self-end" onClick={() => handleAddNote(selectedLead.id, noteText)} disabled={!noteText.trim()}>
                      <StickyNote className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedLead.admin_notes && (
                    <pre className="text-xs p-2 bg-muted rounded whitespace-pre-wrap max-h-32 overflow-y-auto">{selectedLead.admin_notes}</pre>
                  )}
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
