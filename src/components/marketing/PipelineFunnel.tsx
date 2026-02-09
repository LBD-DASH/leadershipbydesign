import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, TrendingUp, Loader2 } from 'lucide-react';

interface FunnelStage {
  name: string;
  count: number;
  color: string;
}

interface PipelineFunnelProps {
  className?: string;
}

export default function PipelineFunnel({ className = '' }: PipelineFunnelProps) {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFunnelData();
  }, []);

  const loadFunnelData = async () => {
    try {
      // Get counts for each stage
      const [discovered, researched, contacted, engaged, replied, converted] = await Promise.all([
        supabase.from('prospect_companies').select('*', { count: 'exact', head: true }),
        supabase.from('prospect_companies').select('*', { count: 'exact', head: true }).eq('status', 'researched'),
        supabase.from('prospect_companies').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
        supabase.from('prospect_companies').select('*', { count: 'exact', head: true }).eq('status', 'engaged'),
        supabase.from('prospect_companies').select('*', { count: 'exact', head: true }).eq('status', 'replied'),
        supabase.from('prospect_companies').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
      ]);

      setStages([
        { name: 'Discovered', count: discovered.count || 0, color: 'bg-blue-500' },
        { name: 'Researched', count: researched.count || 0, color: 'bg-indigo-500' },
        { name: 'Contacted', count: contacted.count || 0, color: 'bg-purple-500' },
        { name: 'Engaged', count: engaged.count || 0, color: 'bg-amber-500' },
        { name: 'Replied', count: replied.count || 0, color: 'bg-emerald-500' },
        { name: 'Converted', count: converted.count || 0, color: 'bg-green-600' },
      ]);
    } catch (error) {
      console.error('Error loading funnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConversionRate = (current: number, previous: number): string => {
    if (previous === 0) return '0%';
    return `${Math.round((current / previous) * 100)}%`;
  };

  if (loading) {
    return (
      <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Pipeline Funnel</h3>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const widthPercent = Math.max((stage.count / maxCount) * 100, 10);
          const conversionRate = index > 0 
            ? calculateConversionRate(stage.count, stages[index - 1].count)
            : null;

          return (
            <div key={stage.name} className="relative">
              {/* Conversion rate arrow */}
              {conversionRate && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowRight className="w-3 h-3 rotate-90" />
                  <span>{conversionRate}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-24 text-sm text-muted-foreground text-right shrink-0">
                  {stage.name}
                </div>
                <div className="flex-1 h-8 bg-muted/30 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full ${stage.color} rounded-lg transition-all duration-500 flex items-center justify-end px-3`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-white text-sm font-medium">
                      {stage.count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-foreground">{stages[0]?.count || 0}</div>
          <div className="text-xs text-muted-foreground">Total Leads</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary">
            {stages[0]?.count > 0 
              ? `${Math.round((stages[4]?.count || 0) / stages[0].count * 100)}%`
              : '0%'}
          </div>
          <div className="text-xs text-muted-foreground">Reply Rate</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {stages[0]?.count > 0 
              ? `${Math.round((stages[5]?.count || 0) / stages[0].count * 100)}%`
              : '0%'}
          </div>
          <div className="text-xs text-muted-foreground">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}
