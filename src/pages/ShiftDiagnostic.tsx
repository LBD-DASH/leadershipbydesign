import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Users, Lightbulb, Target, Cpu } from 'lucide-react';
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

const skillPreviews = [
  { icon: Brain, letter: 'S', title: 'Self-Management', desc: 'Regulate emotions and energy' },
  { icon: Users, letter: 'H', title: 'Human Intelligence', desc: 'Read and connect with people' },
  { icon: Lightbulb, letter: 'I', title: 'Innovation', desc: 'Challenge and create new ways' },
  { icon: Target, letter: 'F', title: 'Focus', desc: 'Prioritise what matters most' },
  { icon: Cpu, letter: 'T', title: 'Thinking', desc: 'Make independent decisions' },
];

export default function ShiftDiagnostic() {
  const [stage, setStage] = useState<DiagnosticStage>('questionnaire');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ShiftResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, number> | null>(null);
  const [userData, setUserData] = useState<LeadCaptureData | null>(null);
  const utmParams = useUtmParams();

  const handleQuestionnaireSubmit = async (answers: Record<number, number>) => {
    setIsSubmitting(true);
    try {
      const scores = calculateShiftScores(answers);
      const shiftResult = getShiftResult(scores);
      setResult(shiftResult);
      setPendingAnswers(answers);
      setStage('capture');
    } finally {
      setIsSubmitting(false);
    }
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
      <Header />
      <FloatingSocial />

      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {stage === 'questionnaire' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Back link */}
              <Link
                to="/shift-methodology"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to SHIFT Methodology
              </Link>

              {/* Hero */}
              <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Discover Your SHIFT Profile
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Answer 20 quick questions to identify your strongest skill and where to focus your development.
                </p>
              </div>

              {/* Skill previews */}
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {skillPreviews.map(({ icon: Icon, letter, title, desc }) => (
                  <div key={letter} className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-primary font-bold text-lg">{letter}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground hidden sm:block">{title}</p>
                  </div>
                ))}
              </div>

              {/* Form */}
              <ShiftDiagnosticForm
                onSubmit={handleQuestionnaireSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}

          {stage === 'capture' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LeadCaptureGate
                onSubmit={handleLeadCapture}
                isSubmitting={isSubmitting}
                variant="shift"
              />
            </motion.div>
          )}

          {stage === 'results' && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ShiftResultsPage
                result={result}
                submissionId={submissionId}
                userName={userData?.name}
              />
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
