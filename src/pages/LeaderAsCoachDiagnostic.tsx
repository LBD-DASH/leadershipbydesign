import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import { motion } from "framer-motion";
import { ClipboardCheck, Clock, Target, Zap, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LACForm from "@/components/lac-diagnostic/LACForm";
import LACLeadCapture from "@/components/lac-diagnostic/LACLeadCapture";
import LACResults from "@/components/lac-diagnostic/LACResults";
import { LACVersion, LACResult, scoreLAC } from "@/data/lacQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useUtmParams } from "@/hooks/useUtmParams";
import { calculateLeadScore } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";
import { useDiagnosticTracking } from "@/hooks/useIntentTracking";

type Stage = 'version-select' | 'questionnaire' | 'capture' | 'results';

interface LeadData {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
}

export default function LeaderAsCoachDiagnostic() {
  const [stage, setStage] = useState<Stage>('version-select');
  const [version, setVersion] = useState<LACVersion>('hr_leader');
  const [result, setResult] = useState<LACResult | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, number> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<LeadData | null>(null);
  const utmParams = useUtmParams();

  const hasStarted = stage !== 'version-select';
  const hasCompleted = stage === 'results';
  useDiagnosticTracking('leader-as-coach', hasStarted, hasCompleted);

  const handleVersionSelect = (v: LACVersion) => {
    setVersion(v);
    setStage('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (answers: Record<number, number>) => {
    const lacResult = scoreLAC(answers);
    setResult(lacResult);
    setPendingAnswers(answers);
    setStage('capture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeadCapture = async (data: LeadData) => {
    if (!result || !pendingAnswers) return;
    setIsSubmitting(true);
    setUserData(data);

    try {
      // Fire GA4 event
      const { trackDiagnosticComplete, trackGoogleAdsConversion } = await import('@/utils/gtmEvents');
      trackDiagnosticComplete({ diagnostic_type: 'leader-as-coach' });

      // Fire Google Ads conversion if paid lead
      if (utmParams.utm_source === 'google' || utmParams.utm_medium === 'cpc') {
        trackGoogleAdsConversion({
          diagnostic_type: 'leader-as-coach',
          value: 500,
          company: data.company,
        });
      }

      // Calculate lead score
      const leadData = {
        name: data.name,
        email: data.email,
        company: data.company,
        role: data.jobTitle,
        source: 'team-diagnostic' as const,
        diagnosticResult: {
          type: 'team' as const,
          primaryRecommendation: result.profile,
          scores: { total: result.totalScore },
        },
      };
      const leadScore = calculateLeadScore(leadData);

      // Build question score columns
      const qScores: Record<string, number> = {};
      for (let i = 1; i <= 15; i++) {
        qScores[`q${i}`] = pendingAnswers[i] || 1;
      }

      // Save to database
      const { error: insertError } = await supabase
        .from('leader_as_coach_assessments' as any)
        .insert({
          version,
          name: data.name,
          email: data.email,
          company: data.company,
          job_title: data.jobTitle,
          ...qScores,
          total_score: result.totalScore,
          profile: result.profile,
          lowest_areas: result.lowestAreas,
          lead_score: leadScore.score,
          lead_temperature: leadScore.temperature,
          buyer_persona: leadScore.buyerPersona,
          company_size: leadScore.companySize,
          urgency: leadScore.urgency,
          next_action: leadScore.nextAction,
          scoring_breakdown: leadScore.breakdown,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
        } as any);

      if (insertError) {
        console.error('LAC insert error:', insertError);
      } else {
        console.log('✅ LAC assessment saved successfully');
      }

      const isPaidLead = utmParams.utm_source === 'google' || utmParams.utm_medium === 'cpc';

      // Send Slack HOT lead alert
      try {
        await supabase.functions.invoke('slack-notify', {
          body: {
            eventType: 'hot_lead_alert',
            data: {
              name: data.name,
              company: data.company,
              source: isPaidLead ? '💰 GOOGLE ADS → LAC Assessment' : 'LAC Assessment',
              profile: result.profileName,
              score: `${result.totalScore}/75`,
              action: isPaidLead
                ? `PAID LEAD completed assessment (${utmParams.utm_campaign || 'unknown campaign'})`
                : 'Completed coaching readiness assessment',
            },
          },
        });
      } catch (slackErr) {
        console.error('Slack notification failed:', slackErr);
      }

      // Auto-feed into warm_outreach_queue as high-priority lead
      try {
        const queueScore = isPaidLead ? 95 : (version === 'hr_leader' ? 85 : 70);
        const sourceTag = isPaidLead
          ? `diagnostic:lac:${version}:google_ads`
          : `diagnostic:lac:${version}`;
        await supabase
          .from('warm_outreach_queue' as any)
          .insert({
            company_name: data.company,
            contact_name: data.name,
            contact_email: data.email,
            contact_title: data.jobTitle,
            source_keyword: sourceTag,
            status: 'pending',
            score: queueScore,
            industry: 'assessment-lead',
          } as any);
      } catch (pipelineErr) {
        console.error('Pipeline insert failed:', pipelineErr);
      }

      // Create LAC follow-up nurture sequence
      try {
        const firstSendDelay = isPaidLead ? 2 * 60 * 1000 : 5 * 60 * 1000; // Paid leads: 2 min, organic: 5 min
        const firstSendAt = new Date(Date.now() + firstSendDelay);
        await supabase
          .from('diagnostic_nurture_sequences' as any)
          .insert({
            diagnostic_submission_id: null,
            diagnostic_type: 'lac',
            lead_email: data.email,
            lead_name: data.name,
            primary_result: result.profile,
            current_step: 1,
            next_send_at: firstSendAt.toISOString(),
            status: 'active',
          } as any);
      } catch (nurtureErr) {
        console.error('Nurture sequence creation failed:', nurtureErr);
      }

      // Check prospect engagement (match diagnostic completers back to outreach queue)
      if (utmParams.utm_campaign?.startsWith('prospect_') || utmParams.utm_source === 'outreach') {
        try {
          await supabase.functions.invoke('check-prospect-engagement', {
            body: {
              email: data.email,
              utmCampaign: utmParams.utm_campaign,
              diagnosticType: 'lac',
              diagnosticScores: { total: result.totalScore },
            },
          });
        } catch (engErr) {
          console.error('Prospect engagement check failed:', engErr);
        }
      }

      // Process lead (AI analysis + notifications) non-blocking
      processLead(leadData, `Leader as Coach Assessment: ${result.profileName} (${result.totalScore}/75). Version: ${version}. Lowest areas: ${result.lowestAreas.map(a => a.theme).join(', ')}.`)
        .then(({ aiAnalysis }) => {
          // AI analysis update skipped — anon user cannot read back inserted ID
        })
        .catch(err => console.error('LAC lead processing error:', err));
    } catch (error) {
      console.error('Error saving LAC assessment:', error);
    } finally {
      setIsSubmitting(false);
      setStage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO
        title="Free Manager Coaching Readiness Assessment | Leadership by Design"
        description="Is your management layer coaching or just managing? Answer 15 questions and find out. Free for HR Directors and L&D Heads in South African financial services."
        canonicalUrl="/leader-as-coach-diagnostic"
        keywords="leader as coach assessment, coaching readiness, management coaching, leadership development, South Africa"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {stage === 'version-select' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center"
            >
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
                <span className="text-xs sm:text-sm font-medium">Free Coaching Readiness Assessment</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                How Coaching-Ready Is Your
                <br />
                <span className="text-primary">Management Layer?</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12">
                Answer 15 questions to discover whether your managers are coaching, controlling, or somewhere in between.
              </p>

              <p className="text-sm font-medium text-foreground mb-6">I am completing this as...</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                <button
                  onClick={() => handleVersionSelect('hr_leader')}
                  className={cn(
                    "group p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-left"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">An HR or L&D Leader</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Assessing my management layer</p>
                </button>

                <button
                  onClick={() => handleVersionSelect('manager')}
                  className={cn(
                    "group p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-left"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">A Manager</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Assessing my own coaching capability</p>
                </button>
              </div>
            </motion.section>
          )}

          {stage === 'questionnaire' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
            >
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground mb-2">
                  {version === 'hr_leader' ? '📋 HR / L&D Leader Version' : '📋 Manager Self-Assessment'}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Rate each statement honestly
                </h2>
                <p className="text-sm text-muted-foreground">
                  1 = Rarely &nbsp;·&nbsp; 2 = Sometimes &nbsp;·&nbsp; 3 = Often &nbsp;·&nbsp; 4 = Usually &nbsp;·&nbsp; 5 = Always
                </p>
              </div>
              <LACForm version={version} onSubmit={handleFormSubmit} />
            </motion.section>
          )}

          {stage === 'capture' && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8"
            >
              <LACLeadCapture onSubmit={handleLeadCapture} isSubmitting={isSubmitting} />
            </motion.section>
          )}

          {stage === 'results' && result && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
            >
              <LACResults result={result} version={version} userName={userData?.name} userEmail={userData?.email} userCompany={userData?.company} utmParams={utmParams as any} />
            </motion.section>
          )}
        </main>

        <Footer />
        <FloatingSocial />
      </div>
    </>
  );
}
