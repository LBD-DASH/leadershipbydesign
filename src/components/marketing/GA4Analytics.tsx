import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, MousePointerClick, RefreshCw, Loader2, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 160 60% 45%))',
  'hsl(var(--chart-3, 30 80% 55%))',
  'hsl(var(--chart-4, 280 65% 60%))',
  'hsl(var(--chart-5, 340 75% 55%))',
  'hsl(200 70% 50%)',
  'hsl(120 50% 40%)',
  'hsl(45 90% 50%)',
];

interface GA4Source {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  newUsers: number;
  conversions: number;
  engagementRate: number;
  bounceRate: number;
}

interface GA4Daily {
  date: string;
  sessions: number;
  users: number;
  conversions: number;
}

interface ConversionEvent {
  eventName: string;
  eventCount: number;
  users: number;
}

interface PageData {
  pagePath: string;
  pageViews: number;
  users: number;
  engagementRate: number;
  conversions: number;
}

export default function GA4Analytics() {
  const [dateRange, setDateRange] = useState('28d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<GA4Source[]>([]);
  const [daily, setDaily] = useState<GA4Daily[]>([]);
  const [events, setEvents] = useState<ConversionEvent[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const fetchReport = useCallback(async (report: string, range: string) => {
    const { data, error } = await supabase.functions.invoke('ga4-analytics', {
      body: { dateRange: range, report },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trafficData, convData, pageData] = await Promise.all([
        fetchReport('traffic', dateRange),
        fetchReport('conversions', dateRange),
        fetchReport('pages', dateRange),
      ]);

      setSources(trafficData.sources || []);
      setDaily(trafficData.daily || []);
      setEvents(convData.events || []);
      setPages(pageData.pages || []);
      setLastFetched(new Date().toLocaleTimeString());
      toast.success('GA4 data refreshed');
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch GA4 data';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [dateRange, fetchReport]);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const totalSessions = sources.reduce((s, r) => s + r.sessions, 0);
  const totalUsers = sources.reduce((s, r) => s + r.users, 0);
  const totalConversions = sources.reduce((s, r) => s + r.conversions, 0);
  const avgEngagement = sources.length ? (sources.reduce((s, r) => s + r.engagementRate, 0) / sources.length) : 0;

  const topSources = [...sources].slice(0, 8);

  const channelMap = new Map<string, number>();
  sources.forEach(r => {
    const key = r.medium || r.source || 'unknown';
    channelMap.set(key, (channelMap.get(key) || 0) + r.sessions);
  });
  const pieData = Array.from(channelMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Format daily dates
  const formattedDaily = daily.map(d => ({
    ...d,
    label: d.date ? `${d.date.slice(4, 6)}/${d.date.slice(6, 8)}` : '',
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Live GA4 Data</span>
          {lastFetched && (
            <span className="text-xs text-muted-foreground">Updated {lastFetched}</span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Last 14 days</SelectItem>
              <SelectItem value="28d">Last 28 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={loadData} className="ml-auto">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && sources.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Fetching GA4 data...</p>
          </CardContent>
        </Card>
      ) : sources.length > 0 ? (
        <Tabs defaultValue="traffic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="traffic" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Sessions', value: totalSessions.toLocaleString(), icon: BarChart3, color: 'text-blue-500' },
                { label: 'Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-green-500' },
                { label: 'Conversions', value: totalConversions.toLocaleString(), icon: MousePointerClick, color: 'text-primary' },
                { label: 'Avg Engagement', value: `${(avgEngagement * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-orange-500' },
              ].map(stat => (
                <Card key={stat.label}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Daily trend */}
            {formattedDaily.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daily Sessions & Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={formattedDaily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2, 160 60% 45%))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Bar: Sessions by Source */}
              <Card>
                <CardHeader><CardTitle className="text-base">Sessions by Source</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topSources} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis type="category" dataKey="source" width={120} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                      <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pie: Channel Mix */}
              <Card>
                <CardHeader><CardTitle className="text-base">Channel Mix</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Source Detail Table */}
            <Card>
              <CardHeader><CardTitle className="text-base">Source Detail</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Source', 'Medium', 'Sessions', 'Users', 'New Users', 'Conversions', 'Engagement', 'Bounce'].map(h => (
                          <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topSources.map((row, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2 px-3 font-medium text-foreground">{row.source}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.medium || '–'}</td>
                          <td className="py-2 px-3">{row.sessions.toLocaleString()}</td>
                          <td className="py-2 px-3">{row.users.toLocaleString()}</td>
                          <td className="py-2 px-3">{row.newUsers.toLocaleString()}</td>
                          <td className="py-2 px-3 font-semibold text-primary">{row.conversions}</td>
                          <td className="py-2 px-3">{(row.engagementRate * 100).toFixed(1)}%</td>
                          <td className="py-2 px-3">{(row.bounceRate * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Conversion Events</CardTitle></CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={events}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="eventName" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} angle={-30} textAnchor="end" height={80} />
                        <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                        <Bar dataKey="eventCount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Events" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Event</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Count</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((e, i) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="py-2 px-3 font-medium text-foreground">{e.eventName}</td>
                              <td className="py-2 px-3 font-semibold text-primary">{e.eventCount.toLocaleString()}</td>
                              <td className="py-2 px-3">{e.users.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-8">No conversion events in this period.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Top Pages</CardTitle></CardHeader>
              <CardContent>
                {pages.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Page</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Views</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Users</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Engagement</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Conversions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pages.map((p, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-2 px-3 font-medium text-foreground max-w-xs truncate">{p.pagePath}</td>
                            <td className="py-2 px-3">{p.pageViews.toLocaleString()}</td>
                            <td className="py-2 px-3">{p.users.toLocaleString()}</td>
                            <td className="py-2 px-3">{(p.engagementRate * 100).toFixed(1)}%</td>
                            <td className="py-2 px-3 font-semibold text-primary">{p.conversions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-8">No page data in this period.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
