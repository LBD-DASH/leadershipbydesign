import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Phone } from 'lucide-react';
import { format } from 'date-fns';

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

export default function CallLogsPanel() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const adminToken = sessionStorage.getItem('admin_token');
      const { data, error } = await supabase.functions.invoke('admin-call-logs', {
        headers: { 'x-admin-token': adminToken || '' },
      });
      if (!error && data?.logs) {
        setLogs(data.logs);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
  );
}
