import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiagnosticForm from "@/components/diagnostic/DiagnosticForm";
import DiagnosticResults from "@/components/diagnostic/DiagnosticResults";
import { calculateScores, getRecommendation, DiagnosticResult } from "@/lib/diagnosticScoring";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ClipboardCheck, Clock, Target, Zap } from "lucide-react";
import FloatingSocial from "@/components/FloatingSocial";

export default function TeamDiagnostic() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleSubmit = async (answers: Record<number, number>) => {
    setIsSubmitting(true);

    const scores = calculateScores(answers);
    const diagnosticResult = getRecommendation(scores);

    // Show results immediately - don't block on database
    setResult(diagnosticResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save to database in background (non-blocking)
    try {
      const { data } = await supabase
        .from('diagnostic_submissions')
        .insert({
          answers,
          clarity_score: scores.clarity,
          motivation_score: scores.motivation,
          leadership_score: scores.leadership,
          primary_recommendation: diagnosticResult.primaryRecommendation,
          secondary_recommendation: diagnosticResult.secondaryRecommendation
        })
        .select('id')
        .single();

      if (data) {
        setSubmissionId(data.id);
      }
    } catch (error) {
      // Silent fail - results are already shown
      console.error('Error saving diagnostic:', error);
    } finally {
      setIsSubmitting(false);
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
          {!result ? (
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
                <DiagnosticForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              </motion.section>
            </>
          ) : (
            /* Results Section */
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"
            >
              <DiagnosticResults result={result} submissionId={submissionId} />
            </motion.section>
          )}
        </main>
        
        <Footer />
        <FloatingSocial />
      </div>
    </>
  );
}
