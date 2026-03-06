import { useState, useCallback } from 'react';
import { Upload, BarChart3, TrendingUp, Users, MousePointerClick, FileDown, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

interface GA4Row {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  newUsers: number;
  conversions: number;
  engagementRate: number;
  bounceRate: number;
  [key: string]: string | number;
}

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

function parseCSV(text: string): GA4Row[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());

  // Map common GA4 export header variations
  const headerMap: Record<string, string> = {};
  rawHeaders.forEach((h, i) => {
    const norm = h.replace(/[^a-z0-9]/g, '');
    if (norm.includes('source') && !norm.includes('medium')) headerMap['source'] = String(i);
    else if (norm.includes('medium') && !norm.includes('source')) headerMap['medium'] = String(i);
    else if (norm === 'sessiondefaultchannelgroup' || norm === 'defaultchannelgroup' || norm === 'channelgroup' || norm === 'channel') headerMap['source'] = String(i);
    else if (norm === 'sourcemed' || norm === 'sourcemedium') headerMap['sourcemedium'] = String(i);
    else if (norm.includes('session') && !norm.includes('source') && !norm.includes('duration') && !norm.includes('engaged')) headerMap['sessions'] = String(i);
    else if (norm === 'totalusers' || norm === 'users' || norm === 'activeusers') headerMap['users'] = String(i);
    else if (norm.includes('newuser')) headerMap['newUsers'] = String(i);
    else if (norm.includes('conversion') || norm.includes('keyevent')) headerMap['conversions'] = String(i);
    else if (norm.includes('engagementrate') || norm.includes('engagedse')) headerMap['engagementRate'] = String(i);
    else if (norm.includes('bouncerate')) headerMap['bounceRate'] = String(i);
  });

  const rows: GA4Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length < 2 || values.every(v => !v)) continue;

    let source = 'unknown';
    let medium = '';

    if (headerMap['sourcemedium']) {
      const sm = values[parseInt(headerMap['sourcemedium'])] || '';
      const parts = sm.split('/').map(p => p.trim());
      source = parts[0] || 'unknown';
      medium = parts[1] || '';
    } else {
      source = values[parseInt(headerMap['source'] || '0')] || 'unknown';
      medium = values[parseInt(headerMap['medium'] || '1')] || '';
    }

    const parseNum = (key: string) => {
      if (!headerMap[key]) return 0;
      const raw = values[parseInt(headerMap[key])] || '0';
      const num = parseFloat(raw.replace(/[,%]/g, ''));
      return isNaN(num) ? 0 : num;
    };

    rows.push({
      source,
      medium,
      sessions: parseNum('sessions'),
      users: parseNum('users'),
      newUsers: parseNum('newUsers'),
      conversions: parseNum('conversions'),
      engagementRate: parseNum('engagementRate'),
      bounceRate: parseNum('bounceRate'),
    });
  }

  return rows;
}

export default function GA4Analytics() {
  const [data, setData] = useState<GA4Row[]>(() => {
    const saved = localStorage.getItem('ga4-analytics-data');
    return saved ? JSON.parse(saved) : [];
  });
  const [fileName, setFileName] = useState(() => localStorage.getItem('ga4-analytics-filename') || '');

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        toast.error('Could not parse CSV. Export from GA4 → Explore → Export CSV.');
        return;
      }
      setData(parsed);
      setFileName(file.name);
      localStorage.setItem('ga4-analytics-data', JSON.stringify(parsed));
      localStorage.setItem('ga4-analytics-filename', file.name);
      toast.success(`Imported ${parsed.length} rows from ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const clearData = () => {
    setData([]);
    setFileName('');
    localStorage.removeItem('ga4-analytics-data');
    localStorage.removeItem('ga4-analytics-filename');
    toast.success('GA4 data cleared');
  };

  const totalSessions = data.reduce((s, r) => s + r.sessions, 0);
  const totalUsers = data.reduce((s, r) => s + r.users, 0);
  const totalConversions = data.reduce((s, r) => s + r.conversions, 0);
  const avgEngagement = data.length ? (data.reduce((s, r) => s + r.engagementRate, 0) / data.length) : 0;

  // Top sources by sessions
  const topSources = [...data].sort((a, b) => b.sessions - a.sessions).slice(0, 8);

  // Pie chart data for channel mix
  const channelMap = new Map<string, number>();
  data.forEach(r => {
    const key = r.source || 'unknown';
    channelMap.set(key, (channelMap.get(key) || 0) + r.sessions);
  });
  const pieData = Array.from(channelMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Upload Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Export from GA4: <strong>Explore</strong> → build report → <strong>Export → CSV</strong></span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {fileName && (
                <>
                  <span className="text-xs text-muted-foreground truncate max-w-40">{fileName}</span>
                  <Button variant="ghost" size="sm" onClick={clearData}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              <label>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                <Button variant="outline" size="sm" className="gap-2 cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    {data.length ? 'Update CSV' : 'Upload GA4 CSV'}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No GA4 Data Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Export a traffic acquisition report from GA4 as CSV and upload it above to see your channel performance here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sessions', value: totalSessions.toLocaleString(), icon: BarChart3, color: 'text-blue-500' },
              { label: 'Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-green-500' },
              { label: 'Conversions', value: totalConversions.toLocaleString(), icon: MousePointerClick, color: 'text-primary' },
              { label: 'Avg Engagement', value: `${avgEngagement.toFixed(1)}%`, icon: TrendingUp, color: 'text-orange-500' },
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

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar: Sessions by Source */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sessions by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topSources} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="source" width={120} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie: Channel Mix */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Channel Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion by Source */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Conversions by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topSources}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="source" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="conversions" fill="hsl(var(--chart-2, 160 60% 45%))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Source Detail</CardTitle>
            </CardHeader>
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
                        <td className="py-2 px-3">{row.engagementRate.toFixed(1)}%</td>
                        <td className="py-2 px-3">{row.bounceRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
