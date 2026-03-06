import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPanel() {
  const [bookingLink, setBookingLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
