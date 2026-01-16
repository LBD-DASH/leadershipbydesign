import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LeadershipResult, leadershipLevelDetails, getHybridTitle } from '@/lib/leadershipScoring';

interface LeadershipDownloadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string | null;
  result: LeadershipResult;
}

export default function LeadershipDownloadForm({ 
  open, 
  onOpenChange, 
  submissionId,
  result 
}: LeadershipDownloadFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the submission with email if we have an ID
      if (submissionId) {
        await supabase
          .from('leadership_diagnostic_submissions')
          .update({ email: email.trim(), name: name.trim() || null })
          .eq('id', submissionId);
      }
      
      setIsComplete(true);
      toast.success('Your results have been saved!');
      
      // Auto-close after delay
      setTimeout(() => {
        onOpenChange(false);
        setIsComplete(false);
        setEmail('');
        setName('');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving download info:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const primaryTitle = result.isHybrid && result.secondaryLevel
    ? getHybridTitle(result.primaryLevel, result.secondaryLevel)
    : leadershipLevelDetails[result.primaryLevel].title;
  
  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Results Saved!</h3>
            <p className="text-gray-600">
              We'll send your leadership profile summary to your inbox shortly.
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
          <DialogTitle>Save Your Leadership Profile</DialogTitle>
          <DialogDescription>
            Get your {primaryTitle} results delivered to your inbox for future reference.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
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
                Saving...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Save My Results
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to receive occasional leadership insights from us. 
            Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
