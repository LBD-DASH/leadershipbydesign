import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Target, TrendingUp, BarChart3, FileText, ArrowRight, BookOpen, Clock } from 'lucide-react';
import UTMBreakdownChart from './UTMBreakdownChart';
import SubmissionsTable from './SubmissionsTable';
import LACLeadsPanel from './LACLeadsPanel';

export default function SubmissionsPanel() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showWaitingListOnly, setShowWaitingListOnly] = useState(false);

  const handleDeleteLeadership = async (id: string) => {
    const { error } = await supabase
      .from('leadership_diagnostic_submissions')
      .delete()
      .eq('id', id);
    if (error) {
      toast.error('Failed to delete submission');
      return;
    }
    toast.success('Submission deleted');
    queryClient.invalidateQueries({ queryKey: ['leadership-submissions'] });
  };
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
      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/overviews">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Programme Overviews
          </Button>
        </Link>
        <Link to="/admin/programmes">
          <Button variant="outline" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            All Programmes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Submissions</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
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
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              {isLoading ? '...' : totalWithEmail}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {leadershipWithEmail} L · {teamWithEmail} T · {shiftWithEmail} S
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {isLoading ? '...' : `${conversionRate}%`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Submissions → Leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Waiting List</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              {isLoading ? '...' : totalWaitingList}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Priority requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">UTM Analytics</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="shift">SHIFT</TabsTrigger>
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
            onDelete={handleDeleteLeadership}
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
      </Tabs>
    </div>
  );
}
