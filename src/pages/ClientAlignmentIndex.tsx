import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CAIForm from "@/components/cai/CAIForm";
import CAIResults from "@/components/cai/CAIResults";
import LeadCaptureGate, { LeadCaptureData } from "@/components/shared/LeadCaptureGate";
import { calculateCAIResult, CAIResult } from "@/lib/caiScoring";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useUtmParams } from "@/hooks/useUtmParams";
import { calculateLeadScore, formatDiagnosticContext } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";

type Stage = 'assessment' | 'capture' | 'results';

export default function ClientAlignmentIndex() {
  const [stage, setStage] = useState<Stage>('assessment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CAIResult | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, number> | null>(null);
  const [userData, setUserData] = useState<LeadCaptureData | null>(null);
  const utmParams = useUtmParams();

  const handleFormSubmit = (answers: Record<number, number>) => {
    const caiResult = calculateCAIResult(answers);
    setResult(caiResult);
    setPendingAnswers(answers);
    setStage('capture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeadCapture = async (data: LeadCaptureData) => {
    if (!result || !pendingAnswers) return;
    setIsSubmitting(true);
    setUserData(data);

    try {
      const leadData = {
        name: data.name,
        email: data.email,
        role: data.role,
        organisation: data.organisation,
        followUpPreference: data.followUpPreference,
        source: 'interest-modal' as const,
        message: `CAI Score: ${result.totalScore}/85 — ${result.categoryLabel}`,
        diagnosticResult: {
          type: 'leadership' as const,
          primaryLevel: result.categoryLabel,
        },
      };

      const leadScore = calculateLeadScore(leadData);
      const diagnosticContext = `Client Alignment Index Result: ${result.categoryLabel} (${result.totalScore}/85). ${result.message}`;

      // Save to contact_form_submissions (reusing existing table for CAI)
      const { data: insertedData } = await supabase
        .from('contact_form_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.organisation || null,
          role: data.role || null,
          service_interest: 'Contagious Identity — CAI',
          message: `CAI Score: ${result.totalScore}/85 — ${result.categoryLabel}. ${result.message}`,
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
        })
        .select('id')
        .single();

      // Process lead notification (non-blocking)
      processLead(leadData, diagnosticContext).then(({ aiAnalysis }) => {
        if (insertedData?.id && aiAnalysis) {
          supabase
            .from('contact_form_submissions')
            .update({ ai_analysis: aiAnalysis })
            .eq('id', insertedData.id)
            .then(() => console.log('💾 CAI AI analysis saved'));
        }
      }).catch(err => console.error('CAI lead processing error:', err));

    } catch (error) {
      console.error('Error saving CAI submission:', error);
    } finally {
      setIsSubmitting(false);
      setStage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO
        title="Client Alignment Index | Contagious Identity™ | Leadership by Design"
        description="Discover your alignment with identity-level executive coaching. A 17-question diagnostic to determine your readiness for the Contagious Identity programme."
        canonicalUrl="/client-alignment-index"
        ogImage="https://leadershipbydesign.co/og-contagious-identity.jpg"
        keywords="executive coaching assessment, leadership alignment, contagious identity, identity coaching, leadership readiness"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {stage === 'assessment' && (
            <>
              {/* Hero */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium tracking-widest uppercase">Executive Self-Assessment</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Contagious Identity™
                  <br />
                  <span className="text-primary">Client Alignment Index</span>
                </h1>

                <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-2">
                  17 questions. No fluff. Discover whether you are ready for identity-level leadership transformation.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Answer from instinct, not aspiration.
                </p>
              </motion.section>

              {/* Form */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8"
              >
                <CAIForm onSubmit={handleFormSubmit} />
              </motion.section>
            </>
          )}

          {stage === 'capture' && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8"
            >
              <LeadCaptureGate
                onSubmit={handleLeadCapture}
                isSubmitting={isSubmitting}
                variant="leadership"
              />
            </motion.section>
          )}

          {stage === 'results' && result && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
            >
              <CAIResults result={result} userName={userData?.name} />
            </motion.section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
