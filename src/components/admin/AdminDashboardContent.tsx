import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, Target, TrendingUp, BarChart3, FileText, ArrowRight, BookOpen, Clock, Megaphone, Search, Zap, Settings, Mail } from 'lucide-react';
import AdminSettingsPanel from './AdminSettingsPanel';
import UTMBreakdownChart from './UTMBreakdownChart';
import SubmissionsTable from './SubmissionsTable';
import GoogleAdsGenerator from '@/components/marketing/GoogleAdsGenerator';
import ProspectingTool from '@/components/marketing/ProspectingTool';
import ProspectList from '@/components/marketing/ProspectList';
import ProspectingAutomation from '@/components/marketing/ProspectingAutomation';
interface AdminDashboardContentProps {
  onLogout: () => void;
}

export default function AdminDashboardContent({ onLogout }: AdminDashboardContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showWaitingListOnly, setShowWaitingListOnly] = useState(false);

  const { data: leadershipSubmissions, isLoading: loadingLeadership } = useQuery({
    queryKey: ['leadership-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leadership_diagnostic_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: teamSubmissions, isLoading: loadingTeam } = useQuery({
    queryKey: ['team-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnostic_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: shiftSubmissions, isLoading: loadingShift } = useQuery({
    queryKey: ['shift-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shift_diagnostic_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const isLoading = loadingLeadership || loadingTeam || loadingShift;

  // Calculate metrics
  const totalLeadership = leadershipSubmissions?.length || 0;
  const totalTeam = teamSubmissions?.length || 0;
  const totalShift = shiftSubmissions?.length || 0;
  const totalSubmissions = totalLeadership + totalTeam + totalShift;

  const leadershipWithEmail = leadershipSubmissions?.filter(s => s.email)?.length || 0;
  const teamWithEmail = teamSubmissions?.filter(s => s.email)?.length || 0;
  const shiftWithEmail = shiftSubmissions?.filter(s => s.email)?.length || 0;
  const totalWithEmail = leadershipWithEmail + teamWithEmail + shiftWithEmail;

  const leadershipWaitingList = leadershipSubmissions?.filter(s => s.waiting_list)?.length || 0;
  const teamWaitingList = teamSubmissions?.filter(s => s.waiting_list)?.length || 0;
  const shiftWaitingList = shiftSubmissions?.filter(s => s.waiting_list)?.length || 0;
  const totalWaitingList = leadershipWaitingList + teamWaitingList + shiftWaitingList;

  const conversionRate = totalSubmissions > 0 
    ? ((totalWithEmail / totalSubmissions) * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Diagnostic submissions & analytics</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/overviews">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Programme Overviews
            </Button>
          </Link>
          <Link to="/admin/programmes">
            <Button variant="default">
              <BookOpen className="w-4 h-4 mr-2" />
              All Programmes (Detailed)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Submissions</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              {isLoading ? '...' : totalSubmissions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {totalLeadership} Leadership · {totalTeam} Team · {totalShift} SHIFT
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Leads Captured</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Target className="w-6 h-6 text-green-500" />
              {isLoading ? '...' : totalWithEmail}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {leadershipWithEmail} Leadership · {teamWithEmail} Team · {shiftWithEmail} SHIFT
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              {isLoading ? '...' : `${conversionRate}%`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Submissions → Lead capture
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => {
            setShowWaitingListOnly(true);
            setActiveTab('waiting-list');
          }}
        >
          <CardHeader className="pb-2">
            <CardDescription>Waiting List</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-500" />
              {isLoading ? '...' : totalWaitingList}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Click to view all · {leadershipWaitingList} Leadership · {teamWaitingList} Team · {shiftWaitingList} SHIFT
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); if (val !== 'waiting-list') setShowWaitingListOnly(false); }}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">UTM Analytics</TabsTrigger>
          <TabsTrigger value="waiting-list" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Waiting List
            {totalWaitingList > 0 && <Badge variant="secondary">{totalWaitingList}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="shift">SHIFT</TabsTrigger>
          <TabsTrigger value="prospects" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Prospects
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="google-ads" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Google Ads
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UTMBreakdownChart
              title="Leadership - UTM Sources"
              submissions={leadershipSubmissions || []}
              isLoading={loadingLeadership}
            />
            <UTMBreakdownChart
              title="Team - UTM Sources"
              submissions={teamSubmissions || []}
              isLoading={loadingTeam}
            />
            <UTMBreakdownChart
              title="SHIFT - UTM Sources"
              submissions={shiftSubmissions || []}
              isLoading={loadingShift}
            />
          </div>
        </TabsContent>

        <TabsContent value="waiting-list" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Leadership Waiting List</CardDescription>
                  <CardTitle className="text-2xl">{leadershipWaitingList}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Team Waiting List</CardDescription>
                  <CardTitle className="text-2xl">{teamWaitingList}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>SHIFT Waiting List</CardDescription>
                  <CardTitle className="text-2xl">{shiftWaitingList}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {leadershipWaitingList > 0 && (
              <SubmissionsTable
                title="Leadership - Waiting List"
                submissions={(leadershipSubmissions || []).filter(s => s.waiting_list)}
                type="leadership"
                isLoading={loadingLeadership}
              />
            )}
            {teamWaitingList > 0 && (
              <SubmissionsTable
                title="Team - Waiting List"
                submissions={(teamSubmissions || []).filter(s => s.waiting_list)}
                type="team"
                isLoading={loadingTeam}
              />
            )}
            {shiftWaitingList > 0 && (
              <SubmissionsTable
                title="SHIFT - Waiting List"
                submissions={(shiftSubmissions || []).filter(s => s.waiting_list)}
                type="shift"
                isLoading={loadingShift}
              />
            )}
            {totalWaitingList === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No one on the waiting list yet.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leadership" className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant={showWaitingListOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWaitingListOnly(!showWaitingListOnly)}
            >
              <Clock className="w-4 h-4 mr-2" />
              {showWaitingListOnly ? "Showing Waiting List Only" : "Show Waiting List"}
              {leadershipWaitingList > 0 && (
                <Badge variant="secondary" className="ml-2">{leadershipWaitingList}</Badge>
              )}
            </Button>
          </div>
          <SubmissionsTable
            title={showWaitingListOnly ? "Leadership - Waiting List" : "Leadership Diagnostic Submissions"}
            submissions={showWaitingListOnly 
              ? (leadershipSubmissions || []).filter(s => s.waiting_list) 
              : (leadershipSubmissions || [])}
            type="leadership"
            isLoading={loadingLeadership}
          />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant={showWaitingListOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWaitingListOnly(!showWaitingListOnly)}
            >
              <Clock className="w-4 h-4 mr-2" />
              {showWaitingListOnly ? "Showing Waiting List Only" : "Show Waiting List"}
              {teamWaitingList > 0 && (
                <Badge variant="secondary" className="ml-2">{teamWaitingList}</Badge>
              )}
            </Button>
          </div>
          <SubmissionsTable
            title={showWaitingListOnly ? "Team - Waiting List" : "Team Diagnostic Submissions"}
            submissions={showWaitingListOnly 
              ? (teamSubmissions || []).filter(s => s.waiting_list) 
              : (teamSubmissions || [])}
            type="team"
            isLoading={loadingTeam}
          />
        </TabsContent>

        <TabsContent value="shift" className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant={showWaitingListOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWaitingListOnly(!showWaitingListOnly)}
            >
              <Clock className="w-4 h-4 mr-2" />
              {showWaitingListOnly ? "Showing Waiting List Only" : "Show Waiting List"}
              {shiftWaitingList > 0 && (
                <Badge variant="secondary" className="ml-2">{shiftWaitingList}</Badge>
              )}
            </Button>
          </div>
          <SubmissionsTable
            title={showWaitingListOnly ? "SHIFT - Waiting List" : "SHIFT Team Diagnostic Submissions"}
            submissions={showWaitingListOnly 
              ? (shiftSubmissions || []).filter(s => s.waiting_list) 
              : (shiftSubmissions || [])}
            type="shift"
            isLoading={loadingShift}
          />
        </TabsContent>

        <TabsContent value="prospects" className="mt-6">
          <Tabs defaultValue="research" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="research">Research Company</TabsTrigger>
              <TabsTrigger value="list">Prospect List</TabsTrigger>
            </TabsList>
            <TabsContent value="research">
              <ProspectingTool />
            </TabsContent>
            <TabsContent value="list">
              <ProspectList />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <ProspectingAutomation />
        </TabsContent>

        <TabsContent value="google-ads" className="mt-6">
          <GoogleAdsGenerator />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <AdminSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
