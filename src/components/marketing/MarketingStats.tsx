import { useQuery } from '@tanstack/react-query';
import { FileText, CheckCircle, Clock, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function MarketingStats() {
  const { data: stats } = useQuery({
    queryKey: ['marketing-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_content')
        .select('status');
      
      if (error) throw error;

      const counts = {
        total: data?.length || 0,
        pending: data?.filter(d => d.status === 'pending_review').length || 0,
        approved: data?.filter(d => d.status === 'approved').length || 0,
        published: data?.filter(d => d.status === 'published').length || 0,
      };

      return counts;
    },
  });

  const statCards = [
    { label: 'Total Content', value: stats?.total || 0, icon: FileText, color: 'text-blue-500' },
    { label: 'Pending Review', value: stats?.pending || 0, icon: Clock, color: 'text-yellow-500' },
    { label: 'Approved', value: stats?.approved || 0, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Published', value: stats?.published || 0, icon: Send, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
