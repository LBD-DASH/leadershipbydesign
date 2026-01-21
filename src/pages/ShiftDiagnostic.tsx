import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Clock, Target, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingSocial from '@/components/FloatingSocial';
import SEO from '@/components/SEO';
import ShiftDiagnosticForm from '@/components/shift-diagnostic/ShiftDiagnosticForm';
import ShiftResultsPage from '@/components/shift-diagnostic/ShiftResultsPage';
import LeadCaptureGate, { LeadCaptureData } from '@/components/shared/LeadCaptureGate';
import { supabase } from '@/integrations/supabase/client';
import { calculateShiftScores, getShiftResult, ShiftResult } from '@/lib/shiftScoring';
import { useUtmParams } from '@/hooks/useUtmParams';

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
    const shiftResult = getShiftResult(scores);
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

      setStage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="SHIFT Skills Diagnostic | Discover Your Leadership Profile"
        description="Take the free SHIFT Skills Diagnostic to discover your strengths and development areas across Self-Management, Human Intelligence, Innovation, Focus, and Thinking."
        canonicalUrl="/shift-diagnostic"
        keywords="SHIFT skills, leadership diagnostic, self-management, human intelligence, innovation, focus, thinking, leadership development"
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
                    <span>20 questions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>Instant results</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Free SHIFT Skills Assessment</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
                  Discover Your
                  <br />
                  <span className="text-primary">SHIFT Skills Profile</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
                  Rate the 20 statements below and discover your strongest skill and where to focus your development.
                </p>
                
                <p className="text-xs sm:text-sm text-muted-foreground italic px-2">
                  Answer based on how you actually behave - not how you aspire to behave.
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
