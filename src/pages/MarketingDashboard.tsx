import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, PenTool, Calendar, BarChart3, Loader2, Target, Users, Zap } from 'lucide-react';
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

export default function MarketingDashboard() {
  const { isAuthenticated, loading, authenticate, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('prospects');

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
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-3">
                  <Megaphone className="w-4 h-4" />
                  <span className="text-sm font-medium">Marketing Engine</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Content Studio
                </h1>
                <p className="text-muted-foreground mt-1">
                  Generate, review, and schedule marketing content with AI
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
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
              <TabsList className="grid grid-cols-6 w-full max-w-3xl">
                <TabsTrigger value="prospects" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Prospects</span>
                </TabsTrigger>
                <TabsTrigger value="automation" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Automation</span>
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Social</span>
                </TabsTrigger>
                <TabsTrigger value="google-ads" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Google Ads</span>
                </TabsTrigger>
                <TabsTrigger value="queue" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Queue</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

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
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Track engagement, clicks, and conversions once you connect your social platforms.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
