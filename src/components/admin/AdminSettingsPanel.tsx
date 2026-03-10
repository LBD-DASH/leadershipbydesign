import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, Loader2, Megaphone, Rocket, Target } from 'lucide-react';
import { toast } from 'sonner';

const CAMPAIGN_MODES = [
  { value: 'general', label: 'General Leadership Development', description: 'Company observation → people development challenge → booking ask' },
  { value: 'leader_as_coach', label: 'Leader as Coach', description: '90-day programme to install coaching capability into management teams' },
  { value: 'shift_programme', label: 'SHIFT Programme', description: 'Leadership operating system for AI-driven, high-pressure environments' },
  { value: 'manager_coaching_accelerator', label: '90-Day Manager Coaching Accelerator', description: 'Transforms command-and-control managers into leader-coaches who drive engagement, performance, and retention' },
];

export default function AdminSettingsPanel() {
  const [bookingLink, setBookingLink] = useState('');
  const [campaignMode, setCampaignMode] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [runningProspecting, setRunningProspecting] = useState(false);
  const [runningApolloImport, setRunningApolloImport] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('admin_settings' as any)
      .select('setting_key, setting_value');
    
    if (data) {
      const settings = data as any[];
      const booking = settings.find((s: any) => s.setting_key === 'booking_link');
      if (booking) setBookingLink(booking.setting_value);
      const campaign = settings.find((s: any) => s.setting_key === 'campaign_mode');
      if (campaign) setCampaignMode(campaign.setting_value);
    }
    setLoading(false);
  };

  const saveBookingLink = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('admin_settings' as any)
      .update({ setting_value: bookingLink, updated_at: new Date().toISOString() } as any)
      .eq('setting_key', 'booking_link');
    
    if (error) {
      toast.error('Failed to save booking link');
    } else {
      toast.success('Booking link updated!');
    }
    setSaving(false);
  };

  const saveCampaignMode = async () => {
    setSavingCampaign(true);
    const { error } = await supabase
      .from('admin_settings' as any)
      .upsert({ setting_key: 'campaign_mode', setting_value: campaignMode, updated_at: new Date().toISOString() } as any, { onConflict: 'setting_key' });
    
    if (error) {
      toast.error('Failed to save campaign mode');
    } else {
      const label = CAMPAIGN_MODES.find(c => c.value === campaignMode)?.label;
      toast.success(`Campaign mode set to: ${label}`);
    }
    setSavingCampaign(false);
  };

  const runProspectingNow = async () => {
    setRunningProspecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('web-scraper-leads', {
        body: {},
      });

      if (error) {
        toast.error(`Prospecting failed: ${error.message}`);
      } else if (data?.success) {
        toast.success(`Apollo prospecting complete: ${data.prospects_added} new prospects added from ${data.industry}`);
      } else {
        toast.error(data?.error || 'Prospecting returned an error');
      }
    } catch (err: any) {
      toast.error(`Failed to run prospecting: ${err.message}`);
    }
    setRunningProspecting(false);
  };

  const runApolloImport = async () => {
    setRunningApolloImport(true);
    try {
      const { data, error } = await supabase.functions.invoke('apollo-prospect-import', {
        body: {},
      });

      if (error) {
        toast.error(`Apollo import failed: ${error.message}`);
      } else if (data?.success) {
        toast.success(`Apollo import complete: ${data.added} contacts added to queue (${data.skipped_duplicate} duplicates skipped)`);
      } else {
        toast.error(data?.error || 'Apollo import returned an error');
      }
    } catch (err: any) {
      toast.error(`Failed to run Apollo import: ${err.message}`);
    }
    setRunningApolloImport(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Settings</h3>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Signal-Based Prospecting</CardTitle>
          </div>
          <CardDescription>
            Searches for companies actively hiring HR/L&D roles or signalling leadership development need across SA Financial Services, Insurance, and Professional Services. Reports post to #mission-control 3× daily.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runProspectingNow} disabled={runningProspecting} className="w-full">
            {runningProspecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Searching for prospects…
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Run Prospecting Now
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Runs automatically at 7:00 AM SAST. Pipeline status reports post to Slack at 07:00, 13:00, and 18:00 SAST.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Apollo Decision-Maker Import</CardTitle>
          </div>
          <CardDescription>
            Pulls 50 named HR/L&D decision-makers from Apollo.io (Financial Services, Insurance, Banking, Accounting, Legal, Professional Services — SA, 100-500 employees). Feeds directly into the outreach queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runApolloImport} disabled={runningApolloImport} className="w-full" variant="outline">
            {runningApolloImport ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Importing from Apollo…
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Run Apollo Import Now
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Imports up to 50 qualified contacts per run. Results posted to #mission-control.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Outreach Campaign Mode</CardTitle>
          </div>
          <CardDescription>
            Controls the AI email prompt used when generating cold outreach. Change this monthly to align with your sales focus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>Active Campaign</Label>
          <div className="flex gap-2">
            <Select value={campaignMode} onValueChange={setCampaignMode}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={saveCampaignMode} disabled={savingCampaign} className="shrink-0">
              {savingCampaign ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {CAMPAIGN_MODES.find(c => c.value === campaignMode)?.description}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Calendar Link</CardTitle>
          <CardDescription>
            This link is used across all "Book a Strategy Call" buttons, diagnostic results CTAs, and nurture emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="booking-link">Google Calendar / Cal.com URL</Label>
          <div className="flex gap-2">
            <Input
              id="booking-link"
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              placeholder="https://calendar.google.com/calendar/appointments/schedules/..."
              className="flex-1"
            />
            <Button onClick={saveBookingLink} disabled={saving} className="shrink-0">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste your full Google Calendar appointment scheduling link or Cal.com link here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
