import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Mail, Users, Calendar, Flame, ClipboardCheck, FileText, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SequenceTemplatesPanel from '@/components/admin/SequenceTemplatesPanel';
import ManualOutreachKanban from '@/components/admin/ManualOutreachKanban';
import GoogleAnalyticsCard from '@/components/admin/GoogleAnalyticsCard';
import { Button } from '@/components/ui/button';
import { format, subDays, startOfWeek } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

function StatusDot({ status }: { status: 'green' | 'amber' | 'red' | 'unknown' }) {
  const colors = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    unknown: 'bg-muted-foreground/40',
  };
  return <span className={`inline-block w-3 h-3 rounded-full ${colors[status]}`} />;
}

function PipelineStatus() {
  const { data: campaignMode } = useQuery({
    queryKey: ['admin-settings-campaign'],
    queryFn: async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'outreach_campaign_mode')
        .maybeSingle();
      return data?.setting_value || 'unknown';
    },
  });

  const today = new Date().toISOString().split('T')[0];
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const { data: emailsSentToday } = useQuery({
    queryKey: ['pos-emails-today'],
    queryFn: async () => {
      const { count } = await supabase
        .from('prospect_outreach')
        .select('*', { count: 'exact', head: true })
        .gte('sent_at', today + 'T00:00:00')
        .eq('status', 'sent');
      return count || 0;
    },
  });

  const { data: bookingsThisWeek } = useQuery({
    queryKey: ['pos-bookings-week'],
    queryFn: async () => {
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart + 'T00:00:00');
      return count || 0;
    },
  });

  const { data: warmLeadQueue } = useQuery({
    queryKey: ['pos-queue-depth'],
    queryFn: async () => {
      const { count } = await supabase
        .from('warm_lead_sequences')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'awaiting_first_contact');
      return count || 0;
    },
  });

  const campaignLabel = (campaignMode || '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  const { data: lacSequencesActive } = useQuery({
    queryKey: ['pos-lac-sequences'],
    queryFn: async () => {
      const { count } = await supabase
        .from('diagnostic_nurture_sequences')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      return count || 0;
    },
  });

  const { data: lacAssessments } = useQuery({
    queryKey: ['pos-lac-all'],
    queryFn: async () => {
      const { count } = await supabase
        .from('leader_as_coach_assessments')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Pipeline Status</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{warmLeadQueue ?? '–'}</p>
            <p className="text-xs text-muted-foreground">Queue Depth</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Mail className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{emailsSentToday ?? '–'}</p>
            <p className="text-xs text-muted-foreground">Emails Sent Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Flame className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">–</p>
            <p className="text-xs text-muted-foreground">Replies Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Calendar className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{bookingsThisWeek ?? '–'}</p>
            <p className="text-xs text-muted-foreground">Bookings This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <ClipboardCheck className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{lacAssessments ?? '–'}</p>
            <p className="text-xs text-muted-foreground">LAC Assessments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Mail className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{lacSequencesActive ?? '–'}</p>
            <p className="text-xs text-muted-foreground">Active Sequences</p>
          </CardContent>
        </Card>
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-4 pb-4 text-center">
            <Activity className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-sm font-bold text-primary">{campaignLabel}</p>
            <p className="text-xs text-muted-foreground">Active Campaign</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SystemHealth() {
  const components = [
    { name: 'Firecrawl Scraper', status: 'unknown' as const, detail: 'Check edge function logs' },
    { name: 'Auto-Outreach', status: 'unknown' as const, detail: 'Check edge function logs' },
    { name: 'Gmail Reply Monitor', status: 'unknown' as const, detail: 'Not yet connected' },
    { name: 'Slack Notifications', status: 'green' as const, detail: 'Connected via connector' },
    { name: 'Google Tag (GTM-TV3SFR3G)', status: 'amber' as const, detail: 'Verify firing in GTM' },
    { name: 'Google Ads', status: 'amber' as const, detail: 'Credentials pending' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">System Health</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="w-20 text-center">Status</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-center"><StatusDot status={c.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ActiveProjects() {
  const { data: projects, refetch } = useQuery({
    queryKey: ['active-projects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('active_projects')
        .select('*')
        .order('priority', { ascending: true });
      return data || [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('active_projects').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    refetch();
  };

  const statusColors: Record<string, string> = {
    not_started: 'text-muted-foreground',
    in_progress: 'text-amber-600',
    done: 'text-emerald-600',
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Active Projects</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="w-40">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(projects || []).map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.emoji}</TableCell>
                  <TableCell className="font-medium text-sm">
                    {p.title}
                    {p.notes && <span className="text-muted-foreground ml-2">— {p.notes}</span>}
                  </TableCell>
                  <TableCell>
                    <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Last7DaysPerformance() {
  const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd'T'00:00:00");

  const queries = {
    prospects: useQuery({
      queryKey: ['pos-7d-prospects'],
      queryFn: async () => {
        const { count } = await supabase
          .from('prospect_outreach')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo);
        return count || 0;
      },
    }),
    emailsSent: useQuery({
      queryKey: ['pos-7d-emails'],
      queryFn: async () => {
        const { count } = await supabase
          .from('prospect_outreach')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'sent')
          .gte('sent_at', sevenDaysAgo);
        return count || 0;
      },
    }),
    assessments: useQuery({
      queryKey: ['pos-7d-lac'],
      queryFn: async () => {
        const { count } = await supabase
          .from('leader_as_coach_assessments')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo);
        return count || 0;
      },
    }),
    bookings: useQuery({
      queryKey: ['pos-7d-bookings'],
      queryFn: async () => {
        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo);
        return count || 0;
      },
    }),
    contacts: useQuery({
      queryKey: ['pos-7d-contacts'],
      queryFn: async () => {
        const { count } = await supabase
          .from('contact_form_submissions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo);
        return count || 0;
      },
    }),
  };

  const rows = [
    { label: 'Prospects added', value: queries.prospects.data },
    { label: 'Emails sent', value: queries.emailsSent.data },
    { label: 'LAC Assessments completed', value: queries.assessments.data },
    { label: 'Bookings', value: queries.bookings.data },
    { label: 'Contact form submissions', value: queries.contacts.data },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Last 7 Days Performance</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right w-24">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell className="text-right text-lg font-bold">{r.value ?? '–'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminOperatingSystem() {
  const { isAuthenticated, loading, authenticate, logout } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">Operating System</h1>
            <AdminLoginForm onAuthenticate={authenticate} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title="Operating System | Admin" description="Live system health dashboard" />
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Operating System</h1>
              <p className="text-sm text-muted-foreground">Live read-only dashboard — last refreshed {format(new Date(), 'HH:mm')}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>Sign Out</Button>
          </div>

          <Tabs defaultValue="overview" className="mt-2">
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="sequences" className="gap-2">
                <FileText className="w-4 h-4" />
                Sequence Templates
              </TabsTrigger>
              <TabsTrigger value="manual-outreach" className="gap-2">
                <Target className="w-4 h-4" />
                Manual Outreach
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-8">
                <PipelineStatus />
                <GoogleAnalyticsCard />
                <SystemHealth />
                <ActiveProjects />
                <Last7DaysPerformance />
              </div>
            </TabsContent>

            <TabsContent value="sequences">
              <SequenceTemplatesPanel />
            </TabsContent>

            <TabsContent value="manual-outreach">
              <ManualOutreachKanban />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
