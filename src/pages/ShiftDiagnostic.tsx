import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Clock, Target, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingSocial from '@/components/FloatingSocial';
import SEO from '@/components/SEO';
import { WebApplicationSchema, BreadcrumbSchema } from '@/components/StructuredData';
import ShiftDiagnosticForm from '@/components/shift-diagnostic/ShiftDiagnosticForm';
import ShiftResultsPage from '@/components/shift-diagnostic/ShiftResultsPage';
import LeadCaptureGate, { LeadCaptureData } from '@/components/shared/LeadCaptureGate';
import { supabase } from '@/integrations/supabase/client';
import { calculateShiftScores, calculateAIReadinessScore, getShiftResult, ShiftResult } from '@/lib/shiftScoring';
import { totalDiagnosticQuestions } from '@/data/shiftQuestions';
import { useUtmParams } from '@/hooks/useUtmParams';
import { calculateLeadScore, formatDiagnosticContext } from '@/utils/leadScoring';
import { processLead } from '@/utils/notifications';

type DiagnosticStage = 'questionnaire' | 'capture' | 'results';

export default function ShiftDiagnostic() {
  const [stage, setStage] = useState<DiagnosticStage>('questionnaire');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ShiftResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, number> | null>(null);
  const [userData, setUserData] = useState<LeadCaptureData | null>(null);
  const utmParams = useUtmParams();

  const handleQuestionnaireSubmit = async (answers: Record<number, number>) => {
    const scores = calculateShiftScores(answers);
    const aiScore = calculateAIReadinessScore(answers);
    const shiftResult = getShiftResult(scores, aiScore);
    setResult(shiftResult);
    setPendingAnswers(answers);
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
        source: 'shift-diagnostic' as const,
        diagnosticResult: {
          type: 'shift' as const,
          primaryDevelopment: result.primaryDevelopment,
          primaryStrength: result.primaryStrength,
          scores: result.scores
        }
      };

      // Calculate lead score
      const leadScore = calculateLeadScore(leadData);
      const diagnosticContext = formatDiagnosticContext(leadData);

      console.log(`📊 Lead scored: ${leadScore.score}/100 (${leadScore.temperature})`);

      // Fire GA4 conversion event
      const { trackDiagnosticComplete } = await import('@/utils/gtmEvents');
      trackDiagnosticComplete({ diagnostic_type: 'shift' });

      const { data: submission, error } = await supabase
        .from('shift_diagnostic_submissions')
        .insert({
          answers: pendingAnswers,
          self_management_score: result.scores.S,
          human_intelligence_score: result.scores.H,
          innovation_score: result.scores.I,
          focus_score: result.scores.F,
          thinking_score: result.scores.T,
          primary_development: result.primaryDevelopment,
          secondary_development: result.secondaryDevelopment,
          primary_strength: result.primaryStrength,
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
        .select()
        .single();

      if (error) throw error;
      setSubmissionId(submission?.id || null);

      // Trigger welcome email for waiting list
      if (data.followUpPreference === 'yes' || data.followUpPreference === 'maybe') {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            name: data.name,
            email: data.email,
            diagnosticType: 'shift',
            primaryDevelopment: result.primaryDevelopment,
            primaryStrength: result.primaryStrength,
            followUpPreference: data.followUpPreference,
          },
        });
      }

      // Process lead for AI analysis and notification (non-blocking)
      processLead(leadData, diagnosticContext).then(({ aiAnalysis }) => {
        // Update the submission with AI analysis
        if (submission?.id && aiAnalysis) {
          supabase
            .from('shift_diagnostic_submissions')
            .update({ ai_analysis: aiAnalysis })
            .eq('id', submission.id)
            .then(() => console.log('💾 AI analysis saved'));
        }
      }).catch(err => console.error('Lead processing error:', err));

      // Check if this came from a prospect outreach email (UTM tracking)
      if (utmParams.utm_campaign?.startsWith('prospect_') || utmParams.utm_source === 'outreach') {
        try {
          await supabase.functions.invoke('check-prospect-engagement', {
            body: {
              email: data.email,
              utmCampaign: utmParams.utm_campaign,
              diagnosticType: 'shift',
              diagnosticScores: {
                'Self-Management': result.scores.S,
                'Human Intelligence': result.scores.H,
                'Innovation': result.scores.I,
                'Focus': result.scores.F,
                'Thinking': result.scores.T
              },
              submissionId: submission?.id
            }
          });
          console.log('🎯 Prospect engagement check triggered');
        } catch (engagementError) {
          console.error('Prospect engagement check failed:', engagementError);
        }
      }

      setStage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Error saving shift submission:', error);
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: 'Something went wrong',
        description: error?.message || 'Could not save your results. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="SHIFT AI-Ready Diagnostic | Discover Your Team's Skills & AI Readiness"
        description="Take the free SHIFT AI-Ready Diagnostic to discover your team's strengths across Self-Management, Human Intelligence, Innovation, Focus, Thinking, and AI Readiness."
        canonicalUrl="/shift-diagnostic"
        ogImage="https://leadershipbydesign.co/og-shift-diagnostic.jpg"
        keywords="SHIFT skills, AI readiness, team diagnostic, self-management, human intelligence, innovation, focus, thinking, AI leadership"
      />
      <WebApplicationSchema
        name="SHIFT AI-Ready Diagnostic"
        description="Discover your team's strengths and AI readiness across the five SHIFT skills plus AI leadership capabilities."
        url="/shift-diagnostic"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Assessments", url: "/programmes" },
          { name: "SHIFT Diagnostic", url: "/shift-diagnostic" },
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          {stage === 'questionnaire' && (
            <>
              {/* Hero Section - Matches Team/Leadership Diagnostic */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center mb-6 sm:mb-12"
              >
                {/* Quick Value Props - Mobile First */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>4 min</span>
                  </div>
                   <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    <span>25 questions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>Instant results</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Free SHIFT AI-Ready Assessment</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
                  Discover Your Team's
                  <br />
                  <span className="text-primary">SHIFT & AI Readiness Profile</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
                  Rate the 25 statements below to uncover your team's human skills strengths and AI readiness — in one diagnostic.
                </p>
                
                <p className="text-xs sm:text-sm text-muted-foreground italic px-2">
                  Answer based on what you actually observe in your team - not what you wish were true.
                </p>
              </motion.section>

              {/* Diagnostic Form */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
              >
                <ShiftDiagnosticForm
                  onSubmit={handleQuestionnaireSubmit}
                  isSubmitting={false}
                />
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
                variant="shift"
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
              <ShiftResultsPage
                result={result}
                submissionId={submissionId}
                userName={userData?.name}
              />
            </motion.section>
          )}
        </main>
        
        <Footer />
        <FloatingSocial />
      </div>
    </>
  );
}
