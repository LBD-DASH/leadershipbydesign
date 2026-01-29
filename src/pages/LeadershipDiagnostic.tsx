import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadershipDiagnosticForm from "@/components/leadership-diagnostic/LeadershipDiagnosticForm";
import LeadershipResults from "@/components/leadership-diagnostic/LeadershipResults";
import LeadCaptureGate, { LeadCaptureData } from "@/components/shared/LeadCaptureGate";
import { calculateLeadershipScores, getLeadershipResult, LeadershipResult } from "@/lib/leadershipScoring";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ClipboardCheck } from "lucide-react";
import { useUtmParams } from "@/hooks/useUtmParams";
import { calculateLeadScore, formatDiagnosticContext } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";

type DiagnosticStage = 'questionnaire' | 'capture' | 'results';

export default function LeadershipDiagnostic() {
  const [stage, setStage] = useState<DiagnosticStage>('questionnaire');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<LeadershipResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, number> | null>(null);
  const [userData, setUserData] = useState<LeadCaptureData | null>(null);
  const utmParams = useUtmParams();

  const handleQuestionnaireSubmit = async (answers: Record<number, number>) => {
    // Calculate scores but don't show results yet
    const scores = calculateLeadershipScores(answers);
    const diagnosticResult = getLeadershipResult(scores);
    
    setResult(diagnosticResult);
    setPendingAnswers(answers);
    
    // Move to lead capture stage
    setStage('capture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeadCapture = async (data: LeadCaptureData) => {
    if (!result || !pendingAnswers) return;
    
    setIsSubmitting(true);
    setUserData(data);

    try {
      // Prepare lead data for scoring
      const leadData = {
        name: data.name,
        email: data.email,
        role: data.role,
        organisation: data.organisation,
        followUpPreference: data.followUpPreference,
        source: 'leadership-diagnostic' as const,
        diagnosticResult: {
          type: 'leadership' as const,
          primaryLevel: result.primaryLevel,
          scores: result.scores
        }
      };

      // Calculate lead score
      const leadScore = calculateLeadScore(leadData);
      const diagnosticContext = formatDiagnosticContext(leadData);

      console.log(`📊 Lead scored: ${leadScore.score}/100 (${leadScore.temperature})`);

      // Save to database with user data, follow-up preference, UTM params, AND lead scoring
      const { data: insertedData } = await supabase
        .from('leadership_diagnostic_submissions')
        .insert({
          answers: pendingAnswers,
          l1_score: result.scores.L1,
          l2_score: result.scores.L2,
          l3_score: result.scores.L3,
          l4_score: result.scores.L4,
          l5_score: result.scores.L5,
          primary_level: result.primaryLevel,
          secondary_level: result.secondaryLevel,
          is_hybrid: result.isHybrid,
          low_foundation_flag: result.lowFoundationFlag,
          name: data.name,
          email: data.email,
          organisation: data.organisation || null,
          role: data.role || null,
          follow_up_preference: data.followUpPreference,
          waiting_list: data.followUpPreference === 'yes' || data.followUpPreference === 'maybe',
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
          // Lead scoring data
          lead_score: leadScore.score,
          lead_temperature: leadScore.temperature,
          buyer_persona: leadScore.buyerPersona,
          company_size: leadScore.companySize,
          urgency: leadScore.urgency,
          next_action: leadScore.nextAction,
          scoring_breakdown: leadScore.breakdown
        })
        .select('id')
        .single();

      if (insertedData) {
        setSubmissionId(insertedData.id);
      }

      // Send welcome email if user joined waiting list
      if (data.followUpPreference === 'yes' || data.followUpPreference === 'maybe') {
        try {
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              name: data.name,
              email: data.email,
              diagnosticType: 'leadership',
              primaryLevel: result.primaryLevel,
              followUpPreference: data.followUpPreference
            }
          });
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't block the flow if email fails
        }
      }

      // Process lead for AI analysis and notification (non-blocking)
      processLead(leadData, diagnosticContext).then(({ leadScore: score, aiAnalysis }) => {
        // Update the submission with AI analysis
        if (insertedData?.id && aiAnalysis) {
          supabase
            .from('leadership_diagnostic_submissions')
            .update({ ai_analysis: aiAnalysis })
            .eq('id', insertedData.id)
            .then(() => console.log('💾 AI analysis saved'));
        }
      }).catch(err => console.error('Lead processing error:', err));
    } catch (error) {
      console.error('Error saving diagnostic:', error);
    } finally {
      setIsSubmitting(false);
      // Move to results stage
      setStage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO
        title="Leadership Diagnostic | Leadership by Design"
        description="Discover your leadership operating level with our free 20-question diagnostic. Get instant clarity on your strengths and growth opportunities."
        canonicalUrl="/leadership-diagnostic"
        keywords="leadership diagnostic, leadership assessment, leadership development, leadership test, leadership profile"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          {stage === 'questionnaire' && (
            <>
              {/* Hero Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center mb-8 sm:mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Free Leadership Assessment</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
                  Discover Your Leadership
                  <br />
                  <span className="text-primary">Operating Level</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
                  Rate the 20 statements below and discover your primary leadership level with personalised development recommendations.
                </p>
                
                <p className="text-xs sm:text-sm text-muted-foreground italic px-2">
                  Answer based on how you actually lead - not how you aspire to lead.
                </p>
              </motion.section>

              {/* Diagnostic Form */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
              >
                <LeadershipDiagnosticForm onSubmit={handleQuestionnaireSubmit} isSubmitting={false} />
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
              className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"
            >
              <LeadershipResults 
                result={result} 
                submissionId={submissionId}
                userName={userData?.name}
              />
            </motion.section>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
