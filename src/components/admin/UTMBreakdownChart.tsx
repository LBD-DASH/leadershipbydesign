import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface UTMBreakdownChartProps {
  title: string;
  submissions: Array<{
    utm_source?: string | null;
    utm_medium?: string | null;
    email?: string | null;
  }>;
  isLoading: boolean;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function UTMBreakdownChart({ title, submissions, isLoading }: UTMBreakdownChartProps) {
  // Calculate UTM source breakdown
  const sourceBreakdown = submissions.reduce((acc, sub) => {
    const source = sub.utm_source || 'Direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(sourceBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Calculate conversion by source
  const conversionBySource = submissions.reduce((acc, sub) => {
    const source = sub.utm_source || 'Direct';
    if (!acc[source]) {
      acc[source] = { total: 0, withEmail: 0 };
    }
    acc[source].total += 1;
    if (sub.email) {
      acc[source].withEmail += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; withEmail: number }>);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          Top traffic sources by submission count
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Conversion rates by source */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Conversion by Source</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(conversionBySource)
                  .sort((a, b) => b[1].total - a[1].total)
                  .slice(0, 4)
                  .map(([source, data]) => (
                    <div key={source} className="flex justify-between bg-muted/50 p-2 rounded">
                      <span className="truncate">{source}</span>
                      <span className="font-medium text-primary">
                        {data.total > 0 ? ((data.withEmail / data.total) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No submissions yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
