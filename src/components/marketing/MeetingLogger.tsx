import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Check, X, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MeetingLoggerProps {
  prospectId: string;
  companyName: string;
  contactName?: string | null;
  currentStatus: string;
  onUpdate?: () => void;
}

export default function MeetingLogger({ 
  prospectId, 
  companyName, 
  contactName,
  currentStatus,
  onUpdate 
}: MeetingLoggerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [outcome, setOutcome] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!outcome) {
      toast({
        title: 'Required',
        description: 'Please select a meeting outcome',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Determine new status based on outcome
      let newStatus = currentStatus;
      if (outcome === 'converted') newStatus = 'converted';
      else if (outcome === 'not_interested') newStatus = 'not_interested';
      else if (outcome === 'follow_up_later') newStatus = 'replied'; // Keep in replied for follow-up

      const { error } = await supabase
        .from('prospect_companies')
        .update({
          status: newStatus,
          meeting_date: meetingDate ? new Date(meetingDate).toISOString() : null,
          meeting_notes: meetingNotes || null,
          meeting_outcome: outcome,
          updated_at: new Date().toISOString()
        })
        .eq('id', prospectId);

      if (error) throw error;

      // If converted, also complete any active sequences
      if (outcome === 'converted' || outcome === 'not_interested') {
        await supabase
          .from('prospect_sequences')
          .update({
            status: outcome === 'converted' ? 'completed' : 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('prospect_id', prospectId)
          .eq('status', 'active');
      }

      toast({
        title: 'Meeting logged',
        description: `${companyName} marked as ${outcome.replace('_', ' ')}`
      });

      setOpen(false);
      setMeetingDate('');
      setMeetingNotes('');
      setOutcome('');
      onUpdate?.();
    } catch (error) {
      console.error('Error logging meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to log meeting',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show for prospects that have replied or engaged
  if (!['replied', 'engaged'].includes(currentStatus)) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Log Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Meeting with {companyName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {contactName && (
            <p className="text-sm text-muted-foreground">
              Contact: {contactName}
            </p>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Meeting Date (optional)
            </label>
            <Input
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Outcome *
            </label>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="converted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Converted (Won deal)
                  </div>
                </SelectItem>
                <SelectItem value="not_interested">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    Not Interested
                  </div>
                </SelectItem>
                <SelectItem value="follow_up_later">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Follow Up Later
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Notes (optional)
            </label>
            <Textarea
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="Add any notes about the meeting..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
