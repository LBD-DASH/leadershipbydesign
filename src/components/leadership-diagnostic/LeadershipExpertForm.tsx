import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LeadershipLevel, leadershipLevelDetails } from '@/lib/leadershipScoring';

interface LeadershipExpertFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string | null;
  primaryLevel: LeadershipLevel;
}

export default function LeadershipExpertForm({ 
  open, 
  onOpenChange, 
  submissionId,
  primaryLevel 
}: LeadershipExpertFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in your name and email');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the submission with contact info
      if (submissionId) {
        await supabase
          .from('leadership_diagnostic_submissions')
          .update({ 
            email: email.trim(), 
            name: name.trim(),
            company: company.trim() || null
          })
          .eq('id', submissionId);
      }
      
      // Send notification email via edge function
      try {
        await supabase.functions.invoke('send-contact-email', {
          body: {
            name: name.trim(),
            email: email.trim(),
            company: company.trim(),
            message: `Leadership Diagnostic Enquiry\n\nPrimary Level: ${leadershipLevelDetails[primaryLevel].title}\n\n${message}`,
            subject: `Leadership Diagnostic: ${leadershipLevelDetails[primaryLevel].title}`
          }
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't block on email failure
      }
      
      setIsComplete(true);
      toast.success('Thank you! We\'ll be in touch soon.');
      
      // Auto-close after delay
      setTimeout(() => {
        onOpenChange(false);
        setIsComplete(false);
        setName('');
        setEmail('');
        setCompany('');
        setMessage('');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
            <p className="text-gray-600">
              One of our leadership experts will be in touch within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Speak with a Leadership Expert</DialogTitle>
          <DialogDescription>
            Book a deeper diagnostic conversation to explore your leadership development options.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="expert-name">Name *</Label>
            <Input
              id="expert-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expert-email">Email address *</Label>
            <Input
              id="expert-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expert-company">Company (optional)</Label>
            <Input
              id="expert-company"
              type="text"
              placeholder="Your organisation"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expert-message">What would you like to discuss? (optional)</Label>
            <Textarea
              id="expert-message"
              placeholder="Tell us about your leadership goals or challenges..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Request Conversation
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
