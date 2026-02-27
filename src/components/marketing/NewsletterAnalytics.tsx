import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, MousePointer, Send, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TrackingStats {
  newsletter_id: string;
  subject: string;
  sent_at: string;
  recipient_count: number;
  opens: number;
  clicks: number;
  auto_generated: boolean;
}

export default function NewsletterAnalytics() {
  const [stats, setStats] = useState<TrackingStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ sent: 0, opens: 0, clicks: 0, ctr: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Fetch sent newsletters via admin edge function (bypasses RLS)
      const adminToken = sessionStorage.getItem('admin_token') || '';
      const { data: result } = await supabase.functions.invoke('admin-newsletters', {
        body: { action: 'sent_history' },
        headers: { 'x-admin-token': adminToken },
      });

      const newsletters = result?.data;
      if (!newsletters || newsletters.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch tracking events for these newsletters
      const ids = newsletters.map(n => n.id);
      const { data: tracking } = await supabase
        .from('newsletter_tracking')
        .select('newsletter_id, event_type')
        .in('newsletter_id', ids);

      const trackingMap: Record<string, { opens: number; clicks: number }> = {};
      (tracking || []).forEach((t: any) => {
        if (!trackingMap[t.newsletter_id]) trackingMap[t.newsletter_id] = { opens: 0, clicks: 0 };
        if (t.event_type === 'open') trackingMap[t.newsletter_id].opens++;
        if (t.event_type === 'click') trackingMap[t.newsletter_id].clicks++;
      });

      const combined = newsletters.map(n => ({
        newsletter_id: n.id,
        subject: n.subject,
        sent_at: n.sent_at || '',
        recipient_count: n.recipient_count || 0,
        opens: trackingMap[n.id]?.opens || 0,
        clicks: trackingMap[n.id]?.clicks || 0,
        auto_generated: n.auto_generated || false,
      }));

      const totalSent = combined.reduce((s, n) => s + n.recipient_count, 0);
      const totalOpens = combined.reduce((s, n) => s + n.opens, 0);
      const totalClicks = combined.reduce((s, n) => s + n.clicks, 0);

      setStats(combined);
      setTotals({
        sent: totalSent,
        opens: totalOpens,
        clicks: totalClicks,
        ctr: totalOpens > 0 ? Math.round((totalClicks / totalOpens) * 100) : 0,
      });
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground text-center py-8">Loading analytics...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Send className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totals.sent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Sends</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Eye className="w-5 h-5 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{totals.opens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Opens</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MousePointer className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{totals.clicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{totals.ctr}%</p>
            <p className="text-xs text-muted-foreground">CTR</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-newsletter breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            Newsletter Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No sent newsletters yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.map(n => {
                const openRate = n.recipient_count > 0 ? Math.round((n.opens / n.recipient_count) * 100) : 0;
                const clickRate = n.opens > 0 ? Math.round((n.clicks / n.opens) * 100) : 0;
                return (
                  <div key={n.newsletter_id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {n.auto_generated && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded mr-2">AI</span>}
                        {n.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {n.sent_at ? new Date(n.sent_at).toLocaleDateString() : 'N/A'} • {n.recipient_count} sent
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs shrink-0 ml-4">
                      <div className="text-center">
                        <p className="font-bold text-blue-500">{openRate}%</p>
                        <p className="text-muted-foreground">opens</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-500">{clickRate}%</p>
                        <p className="text-muted-foreground">CTR</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
