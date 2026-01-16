import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import LeadershipDiagnosticForm from '@/components/leadership-diagnostic/LeadershipDiagnosticForm';
import LeadershipResults from '@/components/leadership-diagnostic/LeadershipResults';
import { calculateLeadershipScores, getLeadershipResult, LeadershipResult } from '@/lib/leadershipScoring';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Target, Compass, TrendingUp } from 'lucide-react';

export default function LeadershipDiagnostic() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<LeadershipResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  
  const handleSubmit = async (answers: Record<number, number>) => {
    setIsSubmitting(true);
    
    // Calculate scores immediately
    const scores = calculateLeadershipScores(answers);
    const diagnosticResult = getLeadershipResult(scores);
    
    // Show results immediately
    setResult(diagnosticResult);
    setIsSubmitting(false);
    
    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Save to database in background (non-blocking)
    try {
      const { data, error } = await supabase
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
      
      if (!error && data) {
        setSubmissionId(data.id);
      }
    } catch (error) {
      console.error('Error saving submission:', error);
      // Silent fail - don't block user experience
    }
  };
  
  return (
    <>
      <SEO 
        title="Free Leadership Diagnostic | Discover Your Leadership Operating Level"
        description="Take our free 20-question leadership diagnostic to discover your primary leadership operating level. Get instant insights and personalised development recommendations."
        keywords="leadership diagnostic, leadership assessment, leadership development, leadership test, leadership profile"
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        {!result && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="pt-32 pb-16 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Compass className="w-4 h-4" />
                <span className="text-sm font-medium">Free Leadership Assessment</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Discover Your Leadership
                <span className="text-primary block">Operating Level</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Where are you operating as a leader right now? Take this 5-minute diagnostic 
                to gain instant clarity on your leadership strengths and growth opportunities.
              </p>
              
              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Instant Clarity</h3>
                  <p className="text-sm text-gray-600">Know exactly where you stand</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Compass className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Clear Direction</h3>
                  <p className="text-sm text-gray-600">Understand your growth path</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Actionable Steps</h3>
                  <p className="text-sm text-gray-600">Practical recommendations</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Form or Results */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <LeadershipResults result={result} submissionId={submissionId} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <LeadershipDiagnosticForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                />
              </motion.div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
