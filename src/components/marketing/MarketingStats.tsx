import { useQuery } from '@tanstack/react-query';
import { FileText, CheckCircle, Clock, Send, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function MarketingStats() {
  const { data: stats } = useQuery({
    queryKey: ['marketing-stats'],
    queryFn: async () => {
      const [contentResult, adsResult] = await Promise.all([
        supabase.from('marketing_content').select('status'),
        supabase.from('google_ads_content').select('status'),
      ]);
      
      if (contentResult.error) throw contentResult.error;

      const contentData = contentResult.data || [];
      const adsData = adsResult.data || [];

      return {
        total: contentData.length,
        pending: contentData.filter(d => d.status === 'pending_review').length,
        approved: contentData.filter(d => d.status === 'approved').length,
        published: contentData.filter(d => d.status === 'published').length,
        adDrafts: adsData.length,
      };
    },
  });

  const statCards = [
    { label: 'Social Content', value: stats?.total || 0, icon: FileText, color: 'text-blue-500' },
    { label: 'Pending Review', value: stats?.pending || 0, icon: Clock, color: 'text-yellow-500' },
    { label: 'Approved', value: stats?.approved || 0, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Published', value: stats?.published || 0, icon: Send, color: 'text-primary' },
    { label: 'Ad Drafts', value: stats?.adDrafts || 0, icon: Target, color: 'text-orange-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
