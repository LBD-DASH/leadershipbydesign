import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Target, DollarSign, List, Calendar, Brain, BarChart3, Settings, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SequenceTemplatesPanel from '@/components/admin/SequenceTemplatesPanel';
import AdminSettingsPanel from '@/components/admin/AdminSettingsPanel';
import IntelligenceTab from '@/components/admin/IntelligenceTab';
import LACLeadsPanel from '@/components/admin/LACLeadsPanel';
import CommandCentreTab from '@/components/admin/command-centre/CommandCentreTab';
import DealsTab from '@/components/admin/command-centre/DealsTab';
import ActivityFeedTab from '@/components/admin/command-centre/ActivityFeedTab';
import ContentTab from '@/components/admin/command-centre/ContentTab';
import PipelineTab from '@/components/admin/command-centre/PipelineTab';
import { CC } from '@/components/admin/command-centre/theme';
import { format } from 'date-fns';

const TABS = [
  { id: 'command', label: 'Command Centre', icon: Target, mobileLabel: '🎯' },
  { id: 'deals', label: 'Deals', icon: DollarSign, mobileLabel: '💰' },
  { id: 'activity', label: 'Activity', icon: List, mobileLabel: '📋' },
  { id: 'content', label: 'Content', icon: Calendar, mobileLabel: '📅' },
  { id: 'intelligence', label: 'Intelligence', icon: Brain, mobileLabel: '🧠' },
  { id: 'pipeline', label: 'Pipeline', icon: BarChart3, mobileLabel: '📊' },
  { id: 'sequences', label: 'Sequences', icon: List, mobileLabel: '📧' },
  { id: 'settings', label: 'Settings', icon: Settings, mobileLabel: '⚙️' },
] as const;

export default function AdminOperatingSystem() {
  const { isAuthenticated, loading, authenticate, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('command');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const qc = useQueryClient();

  const refresh = useCallback(() => {
    qc.invalidateQueries();
    setLastRefresh(new Date());
  }, [qc]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CC.bg }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: CC.teal }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CC.bg }}>
        <div className="w-full max-w-md mx-4">
          <h1 style={{ color: CC.gold }} className="text-2xl font-serif font-bold text-center mb-6">LBD Command Centre</h1>
          <AdminLoginForm onAuthenticate={authenticate} />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Command Centre | LBD" description="Leadership by Design Operating System" />
      <div className="min-h-screen" style={{ background: CC.bg }}>
        {/* Header */}
        <header style={{ borderBottom: `1px solid ${CC.border}` }} className="px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 style={{ color: CC.gold }} className="text-xl md:text-2xl font-serif font-bold tracking-wide">LBD COMMAND CENTRE</h1>
              <p style={{ color: CC.muted }} className="text-xs">Leadership by Design Operating System</p>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: CC.muted }} className="text-xs hidden sm:block">Last sync: {format(lastRefresh, 'HH:mm:ss')}</span>
              <button onClick={refresh} className="p-2 rounded-lg hover:bg-[#1A3044] transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" style={{ color: CC.teal }} />
              </button>
              <button onClick={logout} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: CC.muted, border: `1px solid ${CC.border}` }}>
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav style={{ borderBottom: `1px solid ${CC.border}` }} className="px-4 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex gap-0">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 md:px-4 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-all relative"
                  style={{ color: active ? CC.teal : CC.muted }}
                >
                  <span className="md:hidden">{tab.mobileLabel}</span>
                  <Icon className="w-4 h-4 hidden md:block" />
                  <span className="hidden md:inline">{tab.label}</span>
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: CC.teal }} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'command' && <CommandCentreTab />}
          {activeTab === 'deals' && <DealsTab />}
          {activeTab === 'activity' && <ActivityFeedTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'intelligence' && (
            <div className="space-y-6">
              <LACLeadsPanel />
              <IntelligenceTab />
            </div>
          )}
          {activeTab === 'pipeline' && <PipelineTab />}
          {activeTab === 'sequences' && <SequenceTemplatesPanel />}
          {activeTab === 'settings' && <AdminSettingsPanel />}
        </main>
      </div>
    </>
  );
}
