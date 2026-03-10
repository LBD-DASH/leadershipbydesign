import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Loader2, RefreshCw, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SourceMetrics {
  source: string;
  label: string;
  color: string;
  total: number;
  emailed: number;
  replied: number;
  interested: number;
  booked: number;
  replyRate: number;
  interestedRate: number;
  bookingRate: number;
}

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  apollo: { label: 'Apollo', color: 'bg-blue-500' },
  duxsoup: { label: 'Dux-Soup', color: 'bg-purple-500' },
  firecrawl: { label: 'Firecrawl', color: 'bg-orange-500' },
  diagnostic: { label: 'Diagnostic', color: 'bg-emerald-500' },
  'contact-form': { label: 'Contact Form', color: 'bg-primary' },
  'csv-upload': { label: 'CSV Upload', color: 'bg-amber-500' },
  other: { label: 'Other', color: 'bg-muted-foreground' },
};

function classifySource(sourceKeyword: string | null, source?: string | null): string {
  const val = (sourceKeyword || source || '').toLowerCase();
  if (val.includes('apollo')) return 'apollo';
  if (val.includes('duxsoup') || val.includes('dux-soup')) return 'duxsoup';
  if (val.includes('firecrawl') || val.includes('signal-search')) return 'firecrawl';
  if (val.includes('assessment') || val.includes('diagnostic')) return 'diagnostic';
  if (val.includes('contact') || val.includes('form')) return 'contact-form';
  if (val.includes('csv')) return 'csv-upload';
  if (val.includes('auto-pipeline')) return 'firecrawl';
  return 'other';
}

export default function SourceAttribution() {
  const [metrics, setMetrics] = useState<SourceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [topPerformer, setTopPerformer] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      // Pull from warm_outreach_queue (has source_keyword)
      const { data: outreach } = await supabase
        .from('warm_outreach_queue')
        .select('source_keyword, status, booked_at');

      // Pull from call_list_prospects (has source)
      const { data: callList } = await supabase
        .from('call_list_prospects')
        .select('source, status, call_outcome');

      // Pull from contact submissions
      const { data: contacts } = await supabase
        .from('contact_form_submissions')
        .select('id');

      // Pull from diagnostic submissions
      const { data: diagnostics } = await supabase
        .from('diagnostic_submissions')
        .select('id, email');

      // Pull from bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('source_table');

      // Aggregate by source
      const buckets: Record<string, { total: number; emailed: number; replied: number; interested: number; booked: number }> = {};

      const ensure = (key: string) => {
        if (!buckets[key]) buckets[key] = { total: 0, emailed: 0, replied: 0, interested: 0, booked: 0 };
      };

      // Outreach queue records
      (outreach || []).forEach(r => {
        const src = classifySource(r.source_keyword);
        ensure(src);
        buckets[src].total++;
        if (['emailed', 'followed_up', 'replied', 'interested', 'booked'].includes(r.status)) buckets[src].emailed++;
        if (['replied', 'interested', 'booked'].includes(r.status)) buckets[src].replied++;
        if (['interested', 'booked'].includes(r.status)) buckets[src].interested++;
        if (r.status === 'booked' || r.booked_at) buckets[src].booked++;
      });

      // Call list records
      (callList || []).forEach(r => {
        const src = classifySource(null, r.source);
        ensure(src);
        buckets[src].total++;
        if (r.status === 'called' || r.call_outcome) buckets[src].emailed++;
        if (r.call_outcome === 'interested') buckets[src].interested++;
        if (r.call_outcome === 'booked') buckets[src].booked++;
      });

      // Diagnostics
      ensure('diagnostic');
      buckets['diagnostic'].total += (diagnostics || []).length;

      // Contact forms
      ensure('contact-form');
      buckets['contact-form'].total += (contacts || []).length;

      // Bookings by source
      (bookings || []).forEach(b => {
        const src = classifySource(null, b.source_table);
        ensure(src);
        buckets[src].booked++;
      });

      // Build metrics array
      const result: SourceMetrics[] = Object.entries(buckets)
        .map(([source, data]) => {
          const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.other;
          return {
            source,
            label: config.label,
            color: config.color,
            ...data,
            replyRate: data.emailed > 0 ? Math.round((data.replied / data.emailed) * 100) : 0,
            interestedRate: data.total > 0 ? Math.round((data.interested / data.total) * 100) : 0,
            bookingRate: data.total > 0 ? Math.round((data.booked / data.total) * 100) : 0,
          };
        })
        .sort((a, b) => b.total - a.total);

      setMetrics(result);

      // Determine top performer (highest interested rate with >5 records)
      const qualified = result.filter(m => m.total >= 3);
      if (qualified.length > 0) {
        const top = qualified.reduce((best, curr) =>
          curr.interestedRate > best.interestedRate ? curr : best
        );
        setTopPerformer(top.label);
      }
    } catch (error) {
      console.error('Error loading source attribution:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const totalAll = metrics.reduce((sum, m) => sum + m.total, 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Source Attribution</h3>
          {topPerformer && (
            <Badge variant="secondary" className="ml-2 gap-1">
              <TrendingUp className="w-3 h-3" /> Top: {topPerformer}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Source bars */}
      {metrics.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No prospect data yet. Data will appear once Apollo, Dux-Soup, or Firecrawl start feeding the pipeline.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {metrics.map(m => {
            const widthPct = totalAll > 0 ? Math.max((m.total / totalAll) * 100, 8) : 8;
            return (
              <Card key={m.source}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${m.color}`} />
                      <span className="font-medium text-sm text-foreground">{m.label}</span>
                      <span className="text-xs text-muted-foreground">({m.total})</span>
                    </div>
                    {m.interestedRate > 0 && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {m.interestedRate}% interested
                      </Badge>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${m.color} rounded-full transition-all duration-500`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">{m.total}</p>
                      <p className="text-[10px] text-muted-foreground">Added</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{m.emailed}</p>
                      <p className="text-[10px] text-muted-foreground">Contacted</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{m.replyRate}%</p>
                      <p className="text-[10px] text-muted-foreground">Reply Rate</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{m.interestedRate}%</p>
                      <p className="text-[10px] text-muted-foreground">Interested</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{m.booked}</p>
                      <p className="text-[10px] text-muted-foreground">Booked</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
