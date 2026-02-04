import { useState, useEffect } from 'react';
import { Loader2, Send, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { prospectsApi, ProspectCompany, CompanyResearchResult } from '@/lib/api/prospects';

interface OutreachComposerProps {
  // Either provide a saved prospect OR research data for direct email
  prospect?: ProspectCompany | null;
  researchData?: CompanyResearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onSent: (prospectId?: string) => void;
}

export default function OutreachComposer({ prospect, researchData, isOpen, onClose, onSent }: OutreachComposerProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  // Get the data source (either saved prospect or research data)
  const data = prospect || researchData;
  const recipientEmail = prospect?.contact_email || researchData?.contact_email;
  const companyName = prospect?.company_name || researchData?.company_name || 'Unknown';
  const contactName = prospect?.contact_name || researchData?.contact_name || 'there';
  const industry = prospect?.industry || researchData?.industry || 'industry';
  const pitch = prospect?.personalised_pitch || researchData?.personalised_pitch;

  // Pre-fill with AI-generated pitch when dialog opens
  useEffect(() => {
    if (isOpen && data) {
      setSubject(`Leadership Development for ${companyName}`);
      setBody(
        pitch || 
        `Hi ${contactName},\n\nI came across ${companyName} and was impressed by your work in the ${industry}.\n\nWe help companies like yours develop stronger leaders through executive coaching and team development programmes.\n\nWould you be open to a brief conversation about how we could support your leadership development goals?\n\nBest regards,\nLeadership by Design`
      );
      setConsentChecked(false);
    }
  }, [isOpen, data, companyName, contactName, industry, pitch]);

  const handleSend = async () => {
    if (!data) return;
    
    if (!recipientEmail) {
      toast({
        title: 'No email address',
        description: 'This company does not have a contact email. Research the company first to extract contact details.',
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
      let response;
      
      if (prospect) {
        // Send to existing saved prospect
        response = await prospectsApi.sendOutreach(prospect.id, subject, body);
        if (response.success) {
          onSent(prospect.id);
        }
      } else if (researchData) {
        // Save and send in one go (direct email)
        response = await prospectsApi.sendDirectEmail(researchData, subject, body);
        if (response.success) {
          onSent(response.prospectId);
        }
      }

      if (response?.success) {
        toast({
          title: 'Email Sent',
          description: `Successfully sent email to ${recipientEmail}`,
        });
        onClose();
      } else {
        toast({
          title: 'Send Failed',
          description: response?.error || 'Could not send email',
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

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Outreach Email
          </DialogTitle>
          <DialogDescription>
            Sending to: {recipientEmail || 'No email found'} ({companyName})
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
            disabled={isSending || !recipientEmail || !subject || !body}
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
