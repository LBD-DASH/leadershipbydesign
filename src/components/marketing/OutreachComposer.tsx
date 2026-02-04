import { useState } from 'react';
import { Loader2, Send, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { prospectsApi, ProspectCompany } from '@/lib/api/prospects';

interface OutreachComposerProps {
  prospect: ProspectCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onSent: () => void;
}

export default function OutreachComposer({ prospect, isOpen, onClose, onSent }: OutreachComposerProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  // Pre-fill with AI-generated pitch when prospect changes
  const handleOpen = () => {
    if (prospect) {
      const contactName = prospect.contact_name || 'there';
      setSubject(`Leadership Development for ${prospect.company_name}`);
      setBody(
        prospect.personalised_pitch || 
        `Hi ${contactName},\n\nI came across ${prospect.company_name} and was impressed by your work in the ${prospect.industry || 'industry'}.\n\nWe help companies like yours develop stronger leaders through executive coaching and team development programmes.\n\nWould you be open to a brief conversation about how we could support your leadership development goals?\n\nBest regards,\nLeadership by Design`
      );
    }
  };

  // Call handleOpen when dialog opens
  useState(() => {
    if (isOpen && prospect) {
      handleOpen();
    }
  });

  const handleSend = async () => {
    if (!prospect) return;
    
    if (!prospect.contact_email) {
      toast({
        title: 'No email address',
        description: 'This prospect does not have a contact email. Research the company first to extract contact details.',
        variant: 'destructive',
      });
      return;
    }

    if (!consentChecked) {
      toast({
        title: 'Consent required',
        description: 'Please confirm POPIA compliance before sending',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await prospectsApi.sendOutreach(prospect.id, subject, body);

      if (response.success) {
        toast({
          title: 'Email Sent',
          description: `Successfully sent email to ${prospect.contact_email}`,
        });
        onSent();
        onClose();
      } else {
        toast({
          title: 'Send Failed',
          description: response.error || 'Could not send email',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!prospect) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Outreach Email
          </DialogTitle>
          <DialogDescription>
            Sending to: {prospect.contact_email || 'No email found'} ({prospect.company_name})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Your email message..."
              rows={10}
              className="resize-none"
            />
          </div>

          <div className="flex items-start space-x-2 p-4 border rounded-lg bg-muted/50">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
            />
            <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              I confirm this outreach complies with POPIA regulations. The recipient's business contact 
              information was obtained from publicly available sources, and this email relates to 
              legitimate business interests. An unsubscribe link will be included automatically.
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={isSending || !prospect.contact_email || !subject || !body}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
