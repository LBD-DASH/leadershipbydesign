import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { PenTool, Calendar, BarChart3, Loader2, Target, Users, Zap, Mail, TrendingUp, ClipboardList, FileText, BookOpen, Youtube, Image, Megaphone, Newspaper, Flame, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import ContentGenerator from '@/components/marketing/ContentGenerator';
import ContentQueue from '@/components/marketing/ContentQueue';
import MarketingStats from '@/components/marketing/MarketingStats';
import GoogleAdsGenerator from '@/components/marketing/GoogleAdsGenerator';
import ProspectingTool from '@/components/marketing/ProspectingTool';
import ProspectList from '@/components/marketing/ProspectList';
import ProspectingAutomation from '@/components/marketing/ProspectingAutomation';
import PipelineFunnel from '@/components/marketing/PipelineFunnel';
import SequenceStatusView from '@/components/marketing/SequenceStatusView';
import SubmissionsPanel from '@/components/admin/SubmissionsPanel';
import ContentEngine from '@/components/marketing/ContentEngine';
import NewsletterTab from '@/components/marketing/NewsletterTab';
import WarmLeadCadence from '@/components/marketing/WarmLeadCadence';
import CallLogsPanel from '@/components/admin/CallLogsPanel';
import SalesPipeline from '@/components/marketing/SalesPipeline';

export default function MarketingDashboard() {
  const { isAuthenticated, loading, authenticate, logout } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('submissions');
  const [autoOpenProspectId, setAutoOpenProspectId] = useState<string | null>(null);
  const [prospectsSubTab, setProspectsSubTab] = useState<string>('research');
  const [pendingDeepLink, setPendingDeepLink] = useState<{ action: string; prospectId: string } | null>(null);

  // Capture URL parameters on initial load
  useEffect(() => {
    const action = searchParams.get('action');
    const prospectId = searchParams.get('prospect');
    
    if (action === 'outreach' && prospectId) {
      console.log('[MarketingDashboard] Deep link captured:', { action, prospectId, isAuthenticated });
      
      if (isAuthenticated) {
        // Already authenticated - process immediately
        console.log('[MarketingDashboard] Processing immediately (already authenticated)');
        setActiveTab('prospects');
        setProspectsSubTab('list');
        setAutoOpenProspectId(prospectId);
        setSearchParams({});
      } else {
        // Not authenticated - store for later
        setPendingDeepLink({ action, prospectId });
        setSearchParams({});
      }
    }
  }, [searchParams, isAuthenticated]);

  // Process pending deep link after authentication
  useEffect(() => {
    if (isAuthenticated && pendingDeepLink && !loading) {
      console.log('[MarketingDashboard] Processing pending deep link after auth:', pendingDeepLink);
      setActiveTab('prospects');
      setProspectsSubTab('list');
      setAutoOpenProspectId(pendingDeepLink.prospectId);
      setPendingDeepLink(null);
    }
  }, [isAuthenticated, pendingDeepLink, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Megaphone className="w-4 h-4" />
                <span className="text-sm font-medium">Marketing Engine</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Dashboard</h1>
              <p className="text-muted-foreground">Sign in to access the AI marketing engine</p>
            </motion.div>
            <AdminLoginForm onAuthenticate={authenticate} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Content Studio
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Marketing engine — content, leads, and prospecting
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/admin/pdf-library">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="hidden md:inline">PDFs</span>
                  </Button>
                </Link>
                <Link to="/admin/infographics">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <Image className="w-4 h-4" />
                    <span className="hidden md:inline">Infographics</span>
                  </Button>
                </Link>
                <Link to="/admin/overviews">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden md:inline">Programmes</span>
                  </Button>
                </Link>
                <div className="w-px h-6 bg-border mx-1" />
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <MarketingStats />

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid grid-cols-12 w-full max-w-6xl">
                <TabsTrigger value="submissions" className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden sm:inline">Leads</span>
                </TabsTrigger>
                <TabsTrigger value="cadence" className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span className="hidden sm:inline">Cadence</span>
                </TabsTrigger>
                <TabsTrigger value="prospects" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Prospects</span>
                </TabsTrigger>
                <TabsTrigger value="sequences" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Sequences</span>
                </TabsTrigger>
                <TabsTrigger value="automation" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Automation</span>
                </TabsTrigger>
                <TabsTrigger value="content-engine" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  <span className="hidden sm:inline">YouTube</span>
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Social</span>
                </TabsTrigger>
                <TabsTrigger value="google-ads" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Ads</span>
                </TabsTrigger>
                <TabsTrigger value="queue" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Queue</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Pipeline</span>
                </TabsTrigger>
                <TabsTrigger value="newsletter" className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  <span className="hidden sm:inline">Newsletter</span>
                </TabsTrigger>
                <TabsTrigger value="call-logs" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Calls</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="submissions" className="mt-6">
                <SubmissionsPanel />
              </TabsContent>

              <TabsContent value="cadence" className="mt-6">
                <WarmLeadCadence />
              </TabsContent>

              <TabsContent value="prospects" className="mt-6">
                <Tabs value={prospectsSubTab} onValueChange={setProspectsSubTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="research">Research Company</TabsTrigger>
                    <TabsTrigger value="list">Prospect List</TabsTrigger>
                  </TabsList>
                  <TabsContent value="research">
                    <ProspectingTool />
                  </TabsContent>
                  <TabsContent value="list">
                    <ProspectList 
                      autoOpenProspectId={autoOpenProspectId} 
                      onAutoOpenHandled={() => setAutoOpenProspectId(null)} 
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="sequences" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <SequenceStatusView />
                  <PipelineFunnel />
                </div>
              </TabsContent>

              <TabsContent value="automation" className="mt-6">
                <ProspectingAutomation />
              </TabsContent>

              <TabsContent value="content-engine" className="mt-6">
                <ContentEngine />
              </TabsContent>

              <TabsContent value="generate" className="mt-6">
                <ContentGenerator />
              </TabsContent>

              <TabsContent value="google-ads" className="mt-6">
                <GoogleAdsGenerator />
              </TabsContent>

              <TabsContent value="queue" className="mt-6">
                <ContentQueue />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <PipelineFunnel />
                  <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Track engagement, email open rates, and conversion metrics over time.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="newsletter" className="mt-6">
                <NewsletterTab />
              </TabsContent>

              <TabsContent value="call-logs" className="mt-6">
                <CallLogsPanel />
              </TabsContent>
            </Tabs>

          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
