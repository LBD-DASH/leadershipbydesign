import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Phone, Upload, Trash2, Users, FileText } from 'lucide-react';
import ApolloSearch from '@/components/marketing/ApolloSearch';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { ADMIN_AUTH_KEY, MASTER_TOKEN } from '@/lib/adminAuth';

interface CallLog {
  id: string;
  created_at: string;
  rep_name: string;
  contact_name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  initial_response: string;
  pitch_outcome: string | null;
  gatekeeper_outcome: string | null;
  programme_interest: string | null;
  objection_reason: string | null;
  proposed_meeting_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
}

interface CallListProspect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string;
  title: string;
  status: string;
  created_at: string;
  batch_id: string | null;
}

const responseBadge = (response: string) => {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    yes: { label: 'Yes', variant: 'default' },
    no: { label: 'No', variant: 'destructive' },
    voicemail: { label: 'Voicemail', variant: 'secondary' },
    gatekeeper: { label: 'Gatekeeper', variant: 'outline' },
  };
  const info = map[response] || { label: response, variant: 'outline' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
};

const outcomeBadge = (outcome: string | null) => {
  if (!outcome) return null;
  const map: Record<string, string> = {
    book_meeting: '📅 Meeting',
    need_info: '📋 Info',
    not_interested: '❌ Not Interested',
    transferred: '✅ Transferred',
    need_email: '📧 Email',
    blocked: '🚫 Blocked',
  };
  return <span className="text-xs">{map[outcome] || outcome}</span>;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') { inQuotes = !inQuotes; }
    else if (line[i] === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += line[i]; }
  }
  result.push(current.trim());
  return result;
};

export default function CallLogsPanel() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [prospects, setProspects] = useState<CallListProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const token = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ? MASTER_TOKEN : '';

  const fetchData = useCallback(async () => {
    const [logsRes, prospectsRes] = await Promise.all([
      supabase.functions.invoke('admin-call-logs', {
        headers: { 'x-admin-token': token },
      }),
      supabase.functions.invoke('admin-call-list', {
        method: 'GET',
      }),
    ]);

    if (!logsRes.error && logsRes.data?.logs) setLogs(logsRes.data.logs);
    if (!prospectsRes.error && prospectsRes.data?.prospects) setProspects(prospectsRes.data.prospects);
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) { setUploading(false); return; }

      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        toast({ title: 'Empty CSV', description: 'No data rows found.', variant: 'destructive' });
        setUploading(false);
        return;
      }

      const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
      const nameIdx = headers.findIndex((h) => h === 'name' || h === 'first name' || h === 'firstname');
      const surnameIdx = headers.findIndex((h) => h === 'surname' || h === 'last name' || h === 'lastname');
      const emailIdx = headers.findIndex((h) => h.includes('email') && !h.includes('status') && !h.includes('source') && !h.includes('confidence') && !h.includes('verification') && !h.includes('catch') && !h.includes('verified') && !h.includes('sent') && !h.includes('open') && !h.includes('bounced') && !h.includes('secondary') && !h.includes('tertiary'));
      const companyIdx = headers.findIndex((h) => h === 'company' || h === 'company name' || h === 'organisation' || h === 'company name for emails');
      const phoneIdx = headers.findIndex((h) => h === 'phone' || h === 'tel' || h === 'mobile' || h === 'mobile phone' || h === 'work direct phone' || h === 'corporate phone');
      const titleIdx = headers.findIndex((h) => h === 'title' || h === 'job title');

      if (nameIdx === -1 || emailIdx === -1) {
        toast({ title: 'Missing columns', description: "CSV needs at least 'Name'/'First Name' and 'Email' columns.", variant: 'destructive' });
        setUploading(false);
        return;
      }

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (!cols[emailIdx]) continue;
        parsed.push({
          first_name: cols[nameIdx] || '',
          last_name: surnameIdx >= 0 ? cols[surnameIdx] || '' : '',
          email: cols[emailIdx] || '',
          company: companyIdx >= 0 ? cols[companyIdx] || '' : '',
          phone: phoneIdx >= 0 ? cols[phoneIdx] || '' : '',
          title: titleIdx >= 0 ? cols[titleIdx] || '' : '',
        });
      }

      if (parsed.length === 0) {
        toast({ title: 'No valid contacts', description: 'Could not parse any contacts from the CSV.', variant: 'destructive' });
        setUploading(false);
        return;
      }

      const batchId = `batch-${Date.now()}`;
      const { data, error } = await supabase.functions.invoke('admin-call-list', {
        body: { action: 'bulk_upload', prospects: parsed, batch_id: batchId },
        headers: { 'x-admin-token': token },
      });

      if (error || !data?.success) {
        toast({ title: 'Upload failed', description: error?.message || data?.error || 'Unknown error', variant: 'destructive' });
      } else {
        toast({ title: 'Call list uploaded', description: `${data.imported} prospects added to the call list.` });
        fetchData();
      }
      setUploading(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearList = async () => {
    if (!confirm('Clear all prospects from the call list? This cannot be undone.')) return;
    setClearing(true);
    const { data, error } = await supabase.functions.invoke('admin-call-list', {
      body: { action: 'clear_all' },
      headers: { 'x-admin-token': token },
    });
    if (error || !data?.success) {
      toast({ title: 'Failed to clear', description: error?.message || 'Unknown error', variant: 'destructive' });
    } else {
      toast({ title: 'Call list cleared' });
      setProspects([]);
    }
    setClearing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = prospects.filter(p => p.status === 'pending').length;
  const calledCount = prospects.filter(p => p.status === 'called').length;

  return (
    <div className="space-y-6">
      {/* Apollo Search */}
      <ApolloSearch onImported={fetchData} />

      {/* Call List Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Call List ({prospects.length} prospects)
            </CardTitle>
            <div className="flex items-center gap-2">
              {prospects.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearList} disabled={clearing} className="gap-1.5 text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                  {clearing ? 'Clearing...' : 'Clear List'}
                </Button>
              )}
              <label className="cursor-pointer">
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploading ? 'Uploading...' : 'Upload CSV'}
                </span>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {prospects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No prospects in the call list</p>
              <p className="text-sm mt-1">Upload a CSV (Apollo, HubSpot, etc.) with Name, Email, Company columns.</p>
              <p className="text-xs mt-2">Prospects will appear automatically for callers on the prompter.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-3 text-sm">
                <span className="text-muted-foreground">Pending: <strong className="text-foreground">{pendingCount}</strong></span>
                <span className="text-muted-foreground">Called: <strong className="text-foreground">{calledCount}</strong></span>
              </div>
              <div className="overflow-x-auto max-h-64 border border-border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospects.map((p, idx) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="text-sm font-medium">{p.first_name} {p.last_name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.title || '—'}</TableCell>
                        <TableCell className="text-sm">{p.company || '—'}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.email}</TableCell>
                        <TableCell className="text-xs">{p.phone || '—'}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'called' ? 'default' : 'secondary'} className="text-[10px]">
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Call Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Cold Call Logs ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No call logs yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Rep</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Follow-up</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {format(new Date(log.created_at), 'dd MMM HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{log.rep_name}</TableCell>
                      <TableCell className="text-sm">
                        {log.contact_name || '—'}
                        {log.email && <div className="text-xs text-muted-foreground">{log.email}</div>}
                      </TableCell>
                      <TableCell className="text-sm">{log.company || '—'}</TableCell>
                      <TableCell>{responseBadge(log.initial_response)}</TableCell>
                      <TableCell>{outcomeBadge(log.pitch_outcome || log.gatekeeper_outcome)}</TableCell>
                      <TableCell className="text-xs">{log.programme_interest || '—'}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        {log.follow_up_date ? format(new Date(log.follow_up_date), 'dd MMM') : 
                         log.proposed_meeting_date ? format(new Date(log.proposed_meeting_date), 'dd MMM') : '—'}
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{log.notes || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
