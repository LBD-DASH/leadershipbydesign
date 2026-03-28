import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, Phone, TrendingDown, Award, Mail, CheckCircle, Loader2 } from "lucide-react";
import { LACResult, LACVersion } from "@/data/lacQuestions";
import BookingWidget from "@/components/shared/BookingWidget";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  result: LACResult;
  version: LACVersion;
  userName?: string;
  userEmail?: string;
  userCompany?: string;
  utmParams?: Record<string, string | null>;
}

export default function LACResults({ result, version, userName, userEmail, userCompany, utmParams }: Props) {
  const { totalScore, profileName, profileDescription, lowestAreas, profile } = result;
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailResults = async () => {
    if (!userEmail) {
      toast.error("No email address available.");
      return;
    }
    setEmailSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-diagnostic-results", {
        body: {
          email: userEmail,
          name: userName,
          company: userCompany,
          profile_type: profile,
          score: totalScore,
          utm_source: utmParams?.utm_source,
          utm_medium: utmParams?.utm_medium,
          utm_campaign: utmParams?.utm_campaign,
          utm_content: utmParams?.utm_content,
        },
      });
      if (error) throw error;
      setEmailSent(true);
      toast.success("Your detailed results have been emailed!");
    } catch (err) {
      console.error("Failed to email results:", err);
      toast.error("Failed to send results email. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 pt-8 sm:pt-12">
      {/* Profile + Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        {userName && (
          <p className="text-lg text-muted-foreground mb-2">Thank you, {userName}</p>
        )}

        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
          <Award className="w-4 h-4" />
          <span className="text-sm font-medium">Your Profile</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
          {profileName}
        </h2>
        <p className="text-2xl sm:text-3xl font-bold text-primary mb-6">
          {totalScore}/75
        </p>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {profileDescription}
        </p>
      </motion.div>

      {/* Three Lowest Scoring Areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-card rounded-2xl p-6 sm:p-8 border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="w-5 h-5 text-destructive" />
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">
            Your Three Lowest Scoring Areas
          </h3>
        </div>

        <div className="space-y-4">
          {lowestAreas.map((area, index) => (
            <div key={area.questionId} className="bg-destructive/5 border border-destructive/10 rounded-xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="font-semibold text-foreground text-sm sm:text-base">
                  {index + 1}. {area.theme}
                </h4>
                <span className="text-xs font-medium text-destructive bg-destructive/10 rounded-full px-2 py-1 flex-shrink-0">
                  {area.score}/5
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{area.businessCost}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* The Business Cost */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">
            What This Is Costing {version === 'hr_leader' ? 'Your Organisation' : 'You'}
          </h3>
        </div>
        <ul className="space-y-3">
          {lowestAreas.map(area => (
            <li key={area.questionId} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
              {area.businessCost}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Recommendation Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 text-center"
      >
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
          Based on your profile, Leader as Coach is the right next step.
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
          The 90-Day Manager Coaching Accelerator installs coaching capability into your management layer — structured, practical, and proven across 30+ organisations and 4,000+ leaders in South Africa's financial services and professional services sector.
        </p>
      </motion.div>

      {/* Email Results CTA */}
      {userEmail && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={handleEmailResults}
            disabled={emailSending || emailSent}
            size="lg"
            variant={emailSent ? "outline" : "default"}
            className="gap-2"
          >
            {emailSent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Results Emailed
              </>
            ) : emailSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Email Me My Detailed Results
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Get your full breakdown with actionable recommendations sent to {userEmail}
          </p>
        </motion.div>
      )}


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <BookingWidget context="LAC Diagnostic Results" />
      </motion.div>

      {/* Social sharing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-sky-50/50 dark:bg-sky-950/30 rounded-xl p-6 border border-sky-200/50 dark:border-sky-800/50"
      >
        <SocialShareButtons
          title={`I scored ${totalScore}/75 on the Leader as Coach Readiness Assessment — my profile: ${profileName}`}
          description="Take the free assessment to discover your management layer's coaching readiness!"
        />
      </motion.div>

      <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
        This assessment identifies coaching readiness gaps and provides a starting point for structured development. It does not replace full organisational assessments.
      </p>
    </div>
  );
}
