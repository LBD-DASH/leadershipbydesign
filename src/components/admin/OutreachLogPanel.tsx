import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface OutreachEmail {
  id: string;
  email_subject: string;
  email_body: string;
  status: string;
  sent_at: string | null;
  sequence_step: number | null;
  template_used: string | null;
  prospect_id: string | null;
}

interface QueueEntry {
  id: string;
  contact_name: string | null;
  contact_email: string | null;
  company_name: string | null;
  contact_title: string | null;
  status: string;
  source_keyword: string | null;
  created_at: string;
}

export default function OutreachLogPanel() {
  const [selectedEmail, setSelectedEmail] = useState<OutreachEmail | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: outreachEmails, isLoading: loadingEmails } = useQuery({
    queryKey: ['outreach-emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospect_outreach')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as OutreachEmail[];
    },
  });

  const { data: queueEntries, isLoading: loadingQueue } = useQuery({
    queryKey: ['outreach-queue-log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warm_outreach_queue')
        .select('id, contact_name, contact_email, company_name, contact_title, status, source_keyword, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as QueueEntry[];
    },
  });

  const sentEmails = outreachEmails?.filter(e => e.status === 'sent') || [];
  const emailedQueue = queueEntries?.filter(q => q.status === 'emailed') || [];
  const pendingQueue = queueEntries?.filter(q => q.status === 'pending') || [];

  const statusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'emailed': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'failed': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Emails Sent</p>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Mail className="w-6 h-6 text-green-500" />
              {sentEmails.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Emailed (Queue)</p>
            <CardTitle className="text-3xl">{emailedQueue.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Pending in Queue</p>
            <CardTitle className="text-3xl">{pendingQueue.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Sent Emails with expandable body */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📧 Sent Outreach Emails</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEmails ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : sentEmails.length === 0 ? (
            <p className="text-muted-foreground">No outreach emails sent yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead className="w-[80px]">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentEmails.map((email) => (
                  <>
                    <TableRow key={email.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedRow(expandedRow === email.id ? null : email.id)}>
                      <TableCell className="text-sm">
                        {email.sent_at ? format(new Date(email.sent_at), 'dd MMM yyyy HH:mm') : '—'}
                      </TableCell>
                      <TableCell className="font-medium text-sm max-w-[300px] truncate">
                        {email.email_subject}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Step {email.sequence_step || 1}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {email.template_used || '—'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedEmail(email); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRow === email.id && (
                      <TableRow key={`${email.id}-body`}>
                        <TableCell colSpan={5} className="bg-muted/30">
                          <pre className="whitespace-pre-wrap text-sm text-foreground p-4 max-h-[300px] overflow-y-auto font-sans">
                            {email.email_body}
                          </pre>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Queue Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Outreach Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingQueue ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !queueEntries?.length ? (
            <p className="text-muted-foreground">Queue is empty.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium text-sm">{entry.contact_name || '—'}</TableCell>
                    <TableCell className="text-sm">{entry.contact_email || '—'}</TableCell>
                    <TableCell className="text-sm">{entry.company_name || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">{entry.contact_title || '—'}</TableCell>
                    <TableCell>
                      <Badge className={statusColor(entry.status)}>{entry.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{entry.source_keyword || '—'}</TableCell>
                    <TableCell className="text-sm">{format(new Date(entry.created_at), 'dd MMM HH:mm')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Full email dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.email_subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Sent: {selectedEmail?.sent_at ? format(new Date(selectedEmail.sent_at), 'dd MMM yyyy HH:mm') : '—'}</span>
              <span>Step: {selectedEmail?.sequence_step || 1}</span>
              <span>Template: {selectedEmail?.template_used || '—'}</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm bg-muted/30 p-4 rounded-lg font-sans">
              {selectedEmail?.email_body}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
