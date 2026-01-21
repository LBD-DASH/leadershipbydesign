import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiagnosticForm from "@/components/diagnostic/DiagnosticForm";
import DiagnosticResults from "@/components/diagnostic/DiagnosticResults";
import LeadCaptureGate, { LeadCaptureData } from "@/components/shared/LeadCaptureGate";
import { calculateScores, getRecommendation, DiagnosticResult } from "@/lib/diagnosticScoring";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ClipboardCheck, Clock, Target, Zap } from "lucide-react";
import FloatingSocial from "@/components/FloatingSocial";

type DiagnosticStage = 'questionnaire' | 'capture' | 'results';

export default function TeamDiagnostic() {
  const [stage, setStage] = useState<DiagnosticStage>('questionnaire');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, number> | null>(null);
  const [userData, setUserData] = useState<LeadCaptureData | null>(null);

  const handleQuestionnaireSubmit = async (answers: Record<number, number>) => {
    // Calculate scores but don't show results yet
    const scores = calculateScores(answers);
    const diagnosticResult = getRecommendation(scores);
    
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
      // Save to database with user data and follow-up preference
      const { data: insertedData } = await supabase
        .from('diagnostic_submissions')
        .insert({
          answers: pendingAnswers,
          clarity_score: result.scores.clarity,
          motivation_score: result.scores.motivation,
          leadership_score: result.scores.leadership,
          primary_recommendation: result.primaryRecommendation,
          secondary_recommendation: result.secondaryRecommendation,
          name: data.name,
          email: data.email,
          organisation: data.organisation || null,
          role: data.role || null,
          follow_up_preference: data.followUpPreference,
          waiting_list: data.followUpPreference === 'yes' || data.followUpPreference === 'maybe'
        })
        .select('id')
        .single();

      if (insertedData) {
        setSubmissionId(insertedData.id);
      }
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
        title="Team Diagnostic | Leadership by Design"
        description="Discover what your team really needs with our free 15-question diagnostic. Get a clear recommendation in under 5 minutes."
        canonicalUrl="/team-diagnostic"
        keywords="team diagnostic, leadership assessment, team alignment, team motivation, leadership accountability"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          {stage === 'questionnaire' && (
            <>
              {/* Hero Section - Optimized for TikTok/Mobile */}
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
                    <span>3 min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    <span>15 questions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>Instant results</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Free Team Assessment</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
                  Your Team Doesn't Need Everything.
                  <br />
                  <span className="text-primary">It Needs the Right Thing.</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
                  Rate the 15 statements below and discover the single intervention that will unlock momentum fastest.
                </p>
                
                <p className="text-xs sm:text-sm text-muted-foreground italic px-2">
                  Answer based on what you actually observe - not what you wish were true.
                </p>
              </motion.section>

              {/* Diagnostic Form */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
              >
                <DiagnosticForm onSubmit={handleQuestionnaireSubmit} isSubmitting={false} />
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
                variant="team"
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
              <DiagnosticResults 
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
