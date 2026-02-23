import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateLeadScore } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";
import ReferralSharePrompt from "@/components/shared/ReferralSharePrompt";

interface BlogCTAProps {
  postTitle?: string;
  variant?: "waitlist" | "diagnostic" | "contact";
}

export default function BlogCTA({ postTitle, variant = "waitlist" }: BlogCTAProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setSubmitting(true);

    try {
      const leadData = {
        name,
        email,
        phone,
        source: "contact-form" as const,
        followUpPreference: "yes" as const,
      };
      const leadScore = calculateLeadScore(leadData);

      const { error } = await supabase.from("contact_form_submissions").insert({
        name,
        email,
        phone: phone || null,
        message: `Blog CTA signup from: ${postTitle || "Blog"}`,
        service_interest: "Blog - Priority Insights",
        lead_score: leadScore.score,
        lead_temperature: leadScore.temperature,
        buyer_persona: leadScore.buyerPersona,
        company_size: leadScore.companySize,
        urgency: leadScore.urgency,
        next_action: leadScore.nextAction,
        scoring_breakdown: leadScore.breakdown,
      });

      if (error) throw error;

      processLead(leadData, `Blog CTA signup. Article: ${postTitle || "General"}`).catch(
        (err) => console.error("Lead processing error:", err)
      );

      setSubmitted(true);
      toast.success("You're in! Check your inbox soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="my-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 md:p-12 text-center"
      >
        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">You're on the list!</h3>
        <p className="text-muted-foreground mb-6">
          We'll send you leadership insights and frameworks — no spam, just substance.
        </p>
        <ReferralSharePrompt context="Leadership by Design insights" variant="inline" />
      </motion.div>
    );
  }

  return (
    <div
      className="my-16 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 md:p-12"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-5">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Want frameworks like this in your inbox?
        </h3>
        <p className="text-muted-foreground mb-8 text-base">
          Join the <span className="font-medium text-foreground">Priority Insight List</span> — practical leadership tools, diagnostic invitations, and frameworks delivered when they matter.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1"
          />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={submitting} className="gap-2 whitespace-nowrap">
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Join <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <Input
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="max-w-xs mx-auto mb-4"
        />

        <p className="text-xs text-muted-foreground">
          No spam. Unsubscribe anytime. We typically send 2-4 insights per month.
        </p>
      </div>
    </div>
  );
}
