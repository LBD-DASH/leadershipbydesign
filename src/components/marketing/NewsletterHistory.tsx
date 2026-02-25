import { useEffect, useState } from 'react';
import { History, Loader2, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface NewsletterSend {
  id: string;
  subject: string;
  body_html: string;
  recipient_count: number | null;
  status: string;
  approval_status: string | null;
  auto_generated: boolean | null;
  research_topic: string | null;
  tag_filter: string | null;
  sent_at: string | null;
  created_at: string;
}

export default function NewsletterHistory() {
  const [sends, setSends] = useState<NewsletterSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewSubject, setPreviewSubject] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('newsletter_sends')
        .select('id, subject, body_html, recipient_count, status, approval_status, auto_generated, research_topic, tag_filter, sent_at, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      setSends((data as NewsletterSend[]) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusColor = (s: string) => {
    if (s === 'sent') return 'default' as const;
    if (s === 'sending') return 'secondary' as const;
    if (s === 'failed' || s === 'rejected') return 'destructive' as const;
    if (s === 'pending_approval') return 'outline' as const;
    if (s === 'draft' || s === 'scheduled') return 'secondary' as const;
    return 'outline' as const;
  };

  const statusLabel = (s: NewsletterSend) => {
    if (s.approval_status === 'pending') return 'Awaiting Approval';
    if (s.approval_status === 'rejected') return 'Rejected';
    if (s.status === 'scheduled') return 'Scheduled';
    if (s.status === 'draft') return 'Draft';
    return s.status;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Send History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sends.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No newsletters yet. Compose your first one!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sends.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium max-w-[260px] truncate">
                      {s.subject}
                      {s.research_topic && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">Topic: {s.research_topic}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {s.auto_generated ? (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Bot className="w-3 h-3" /> AI
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <User className="w-3 h-3" /> Manual
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{s.recipient_count ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor(s.status)}>{statusLabel(s)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {format(new Date(s.sent_at || s.created_at), 'dd MMM yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setPreviewHtml(s.body_html); setPreviewSubject(s.subject); }}
                      >
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!previewHtml} onOpenChange={() => setPreviewHtml(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewSubject}</DialogTitle>
          </DialogHeader>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHtml || '' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
