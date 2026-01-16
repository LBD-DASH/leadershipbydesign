import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadershipDiagnosticForm from "@/components/leadership-diagnostic/LeadershipDiagnosticForm";
import LeadershipResults from "@/components/leadership-diagnostic/LeadershipResults";
import { calculateLeadershipScores, getLeadershipResult, LeadershipResult } from "@/lib/leadershipScoring";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ClipboardCheck } from "lucide-react";

export default function LeadershipDiagnostic() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<LeadershipResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleSubmit = async (answers: Record<number, number>) => {
    setIsSubmitting(true);

    const scores = calculateLeadershipScores(answers);
    const diagnosticResult = getLeadershipResult(scores);

    // Show results immediately - don't block on database
    setResult(diagnosticResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save to database in background (non-blocking)
    try {
      const { data } = await supabase
        .from('leadership_diagnostic_submissions')
        .insert({
          answers,
          l1_score: scores.L1,
          l2_score: scores.L2,
          l3_score: scores.L3,
          l4_score: scores.L4,
          l5_score: scores.L5,
          primary_level: diagnosticResult.primaryLevel,
          secondary_level: diagnosticResult.secondaryLevel,
          is_hybrid: diagnosticResult.isHybrid,
          low_foundation_flag: diagnosticResult.lowFoundationFlag
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
        title="Leadership Diagnostic | Leadership by Design"
        description="Discover your leadership operating level with our free 20-question diagnostic. Get instant clarity on your strengths and growth opportunities."
        canonicalUrl="/leadership-diagnostic"
        keywords="leadership diagnostic, leadership assessment, leadership development, leadership test, leadership profile"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          {!result ? (
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
                <LeadershipDiagnosticForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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
              <LeadershipResults result={result} submissionId={submissionId} />
            </motion.section>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
