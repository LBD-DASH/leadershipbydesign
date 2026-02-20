import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Mail, Loader2, CheckCircle } from "lucide-react";
import ReferralSharePrompt from "@/components/shared/ReferralSharePrompt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateLeadScore } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";
import { useUtmParams } from "@/hooks/useUtmParams";

interface InterestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: string; // e.g., "Homepage Hero", "Services Section"
}

export default function InterestModal({ 
  open, 
  onOpenChange, 
  context = "General Interest" 
}: InterestModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    promoCode: ''
  });
  const utmParams = useUtmParams();

  const CALENDAR_LINK = "https://calendar.app.google/vFHzgHMvUqU6vzgv6";

  const handleBookAppointment = () => {
    window.open(CALENDAR_LINK, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast.error("Please provide your name and email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare lead data
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'interest-modal' as const,
        followUpPreference: 'yes' as const
      };

      // Calculate lead score
      const leadScore = calculateLeadScore(leadData);

      // Store in contact_form_submissions
      const { error } = await supabase
        .from('contact_form_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: `Interest expressed via: ${context}${formData.promoCode ? ` | Promo Code: ${formData.promoCode}` : ''}`,
          lead_score: leadScore.score,
          lead_temperature: leadScore.temperature,
          buyer_persona: leadScore.buyerPersona,
          company_size: leadScore.companySize,
          urgency: leadScore.urgency,
          next_action: leadScore.nextAction,
          scoring_breakdown: leadScore.breakdown,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
        });

      if (error) throw error;

      // Process lead for AI analysis and notifications (non-blocking)
      processLead(leadData, `Interest modal submission. Context: ${context}`)
        .catch(err => console.error('Lead processing error:', err));

      setIsSubmitted(true);
      toast.success("Thank you! We'll be in touch soon.");
      
      // Keep open longer so user can see referral prompt
      setTimeout(() => {
        onOpenChange(false);
        setShowForm(false);
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', promoCode: '' });
      }, 8000);

    } catch (error) {
      console.error('Error submitting interest form:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setShowForm(false);
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', promoCode: '' });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center">
            Let's Connect
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose how you'd like to get started
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-lg font-medium">Thank you!</p>
            <p className="text-muted-foreground text-sm mb-2">We'll be in touch within 24 hours.</p>
            <ReferralSharePrompt context="Leadership by Design" variant="inline" shareUrl="https://leadershipbydesign.lovable.app" />
          </div>
        ) : !showForm ? (
          <div className="space-y-4 py-4">
            {/* Option 1: Book Appointment */}
            <Button
              onClick={handleBookAppointment}
              size="lg"
              className="w-full py-6 text-lg"
            >
              <Calendar className="mr-3 w-5 h-5" />
              Book an Appointment
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Option 2: Send Info */}
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              size="lg"
              className="w-full py-6 text-lg"
            >
              <Mail className="mr-3 w-5 h-5" />
              Send Me Info
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-2">
              We'll reach out within 24 hours with personalized insights.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+27 XX XXX XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoCode">Promo Code (optional)</Label>
              <Input
                id="promoCode"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                placeholder="Enter promo code"
                maxLength={50}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send My Info"
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              We'll reach out within 24 hours.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
