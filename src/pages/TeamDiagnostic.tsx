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
import { ClipboardCheck } from "lucide-react";

export default function TeamDiagnostic() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleSubmit = async (answers: Record<number, number>) => {
    setIsSubmitting(true);

    try {
      const scores = calculateScores(answers);
      const diagnosticResult = getRecommendation(scores);

      // Save to database
      const { data, error } = await supabase
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

      if (error) throw error;

      setSubmissionId(data.id);
      setResult(diagnosticResult);
      
      // Scroll to top to see results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting diagnostic:', error);
      toast.error("Something went wrong. Please try again.");
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
              {/* Hero Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6">
                  <ClipboardCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Free Team Assessment</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Your Team Doesn't Need Everything.
                  <br />
                  <span className="text-primary">It Needs the Right Thing.</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                  Rate the 15 statements below and discover the single intervention that will unlock momentum fastest.
                </p>
                
                <p className="text-sm text-muted-foreground italic">
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
      </div>
    </>
  );
}
