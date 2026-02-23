import { useEffect, useState } from 'react';
import { History, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface NewsletterSend {
  id: string;
  subject: string;
  recipient_count: number;
  status: string;
  sent_at: string;
}

export default function NewsletterHistory() {
  const [sends, setSends] = useState<NewsletterSend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('newsletter_sends')
        .select('id, subject, recipient_count, status, sent_at')
        .order('sent_at', { ascending: false })
        .limit(50);
      setSends((data as NewsletterSend[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const statusColor = (s: string) => {
    if (s === 'sent') return 'default';
    if (s === 'sending') return 'secondary';
    if (s === 'failed') return 'destructive';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
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
            No newsletters sent yet. Compose your first one!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sends.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.subject}</TableCell>
                  <TableCell>{s.recipient_count}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor(s.status)}>{s.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(s.sent_at), 'dd MMM yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
