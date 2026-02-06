import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { AIReadinessForm } from "@/components/ai-diagnostic/AIReadinessForm";
import { AIReadinessResults } from "@/components/ai-diagnostic/AIReadinessResults";
import LeadCaptureGate from "@/components/shared/LeadCaptureGate";
import { calculateAIReadinessScores, getAIReadinessResult, AIReadinessResult } from "@/lib/aiReadinessScoring";
import { supabase } from "@/integrations/supabase/client";
import { useUtmParams } from "@/hooks/useUtmParams";
import { LeadData } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";
import { toast } from "sonner";

type DiagnosticStage = 'questionnaire' | 'lead-capture' | 'results';

export default function AIReadinessDiagnostic() {
  const [stage, setStage] = useState<DiagnosticStage>('questionnaire');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AIReadinessResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string>('');
  const utmParams = useUtmParams();

  const handleFormComplete = (formAnswers: Record<number, number>) => {
    setAnswers(formAnswers);
    const scores = calculateAIReadinessScores(formAnswers);
    const diagnosticResult = getAIReadinessResult(scores);
    setResult(diagnosticResult);
    setStage('lead-capture');
  };

  const handleLeadCapture = async (leadInfo: {
    name: string;
    email: string;
    organisation?: string;
    role?: string;
    phone?: string;
    followUpPreference: 'yes' | 'maybe' | 'no';
  }) => {
    if (!result) return;

    try {
      // Save to database
      const { data, error } = await supabase
        .from('ai_readiness_submissions')
        .insert({
          answers,
          ai_awareness_score: result.scores.awareness,
          human_ai_collab_score: result.scores.collaboration,
          change_readiness_score: result.scores.change,
          ethical_ai_score: result.scores.ethics,
          human_skills_score: result.scores.human_skills,
          overall_score: result.overallScore,
          readiness_level: result.readinessLevel,
          primary_recommendation: result.primaryRecommendation,
          secondary_recommendation: result.secondaryRecommendation,
          name: leadInfo.name,
          email: leadInfo.email,
          organisation: leadInfo.organisation,
          role: leadInfo.role,
          phone: leadInfo.phone,
          follow_up_preference: leadInfo.followUpPreference,
          waiting_list: true,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
        })
        .select('id')
        .single();

      if (error) throw error;

      setSubmissionId(data.id);

      // Process lead scoring and notifications
      const leadData: LeadData = {
        name: leadInfo.name,
        email: leadInfo.email,
        phone: leadInfo.phone,
        role: leadInfo.role,
        organisation: leadInfo.organisation,
        followUpPreference: leadInfo.followUpPreference,
        source: 'shift-diagnostic', // Using closest matching source for AI diagnostic
        diagnosticResult: {
          type: 'shift',
          primaryStrength: result.strongestCategory,
          primaryDevelopment: result.weakestCategory,
        },
      };

      const diagnosticContext = `AI Readiness Diagnostic: Overall Score ${result.overallScore}/100 (${result.readinessLevel}). Strongest: ${result.strongestCategory}. Weakest: ${result.weakestCategory}. Recommendation: ${result.primaryRecommendation}`;

      const { leadScore, notificationResult } = await processLead(leadData, diagnosticContext);

      // Update submission with lead scoring data
      await supabase
        .from('ai_readiness_submissions')
        .update({
          lead_score: leadScore.score,
          lead_temperature: leadScore.temperature,
          buyer_persona: leadScore.buyerPersona,
          company_size: leadScore.companySize,
          urgency: leadScore.urgency,
          next_action: leadScore.nextAction,
          scoring_breakdown: leadScore.breakdown,
        })
        .eq('id', data.id);

      setStage('results');
    } catch (err) {
      console.error('Failed to save submission:', err);
      toast.error('Failed to save your results. Please try again.');
    }
  };

  const handleExpertContact = async () => {
    if (submissionId) {
      toast.success('Our team will be in touch within 24 hours.');
    }
  };

  return (
    <>
      <SEO
        title="AI Leadership Readiness Diagnostic | Leadership by Design"
        description="Assess your AI leadership capabilities across 5 dimensions. Get personalised recommendations for leading effectively in an AI-augmented workplace."
        canonicalUrl="/ai-readiness-diagnostic"
        ogImage="https://leadershipbydesign.co/og-ai-diagnostic.jpg"
      />
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Back Link */}
          <Link 
            to="/ai-readiness" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Link>

          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Bot className="w-4 h-4" />
              <span>Leadership Capability Diagnostic (AI-Ready)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {stage === 'questionnaire' && 'Assess Your AI Leadership Readiness'}
              {stage === 'lead-capture' && 'Almost There!'}
              {stage === 'results' && 'Your AI Leadership Profile'}
            </h1>
            <p className="text-muted-foreground">
              {stage === 'questionnaire' && 'Rate each statement honestly based on your current leadership practice.'}
              {stage === 'lead-capture' && 'Enter your details to see your personalised results and recommendations.'}
              {stage === 'results' && 'Based on your responses, here\'s your AI leadership readiness profile.'}
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {stage === 'questionnaire' && (
              <AIReadinessForm onComplete={handleFormComplete} />
            )}
            
            {stage === 'lead-capture' && (
              <LeadCaptureGate
                onSubmit={handleLeadCapture}
                variant="shift"
              />
            )}
            
            {stage === 'results' && result && (
              <AIReadinessResults 
                result={result} 
                submissionId={submissionId}
                onExpertContact={handleExpertContact}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
