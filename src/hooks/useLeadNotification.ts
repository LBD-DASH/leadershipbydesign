import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateLeadScore, formatDiagnosticContext, LeadData, LeadScore } from '@/lib/leadScoring';

interface UseLeadNotificationResult {
  processLead: (data: LeadData) => Promise<{ score: LeadScore; success: boolean }>;
  isProcessing: boolean;
  error: string | null;
}

export function useLeadNotification(): UseLeadNotificationResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processLead = useCallback(async (data: LeadData): Promise<{ score: LeadScore; success: boolean }> => {
    setIsProcessing(true);
    setError(null);

    // Calculate score immediately - this doesn't require async
    const leadScore = calculateLeadScore(data);
    const diagnosticContext = formatDiagnosticContext(data);

    // Only process hot and warm leads for notifications
    if (leadScore.temperature === 'cool') {
      console.log(`Cool lead (${leadScore.score}/100) - skipping AI analysis and notification`);
      setIsProcessing(false);
      return { score: leadScore, success: true };
    }

    try {
      // Step 1: Get AI analysis
      let aiAnalysis = 'AI analysis unavailable';
      
      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-lead', {
          body: {
            leadData: {
              name: data.name,
              email: data.email,
              role: data.role,
              organisation: data.organisation,
              company: data.company,
              message: data.message,
              followUpPreference: data.followUpPreference,
              source: data.source,
            },
            leadScore: {
              score: leadScore.score,
              temperature: leadScore.temperature,
              buyerPersona: leadScore.buyerPersona,
              companySize: leadScore.companySize,
              urgency: leadScore.urgency,
            },
            diagnosticContext,
          },
        });

        if (analysisError) {
          console.error('AI analysis error:', analysisError);
        } else {
          aiAnalysis = analysisData?.analysis || 'AI analysis unavailable';
        }
      } catch (analysisErr) {
        console.error('Failed to get AI analysis:', analysisErr);
        // Continue without AI analysis - don't block the notification
      }

      // Step 2: Send notification
      try {
        const { data: notificationData, error: notificationError } = await supabase.functions.invoke('send-lead-notification', {
          body: {
            leadData: {
              name: data.name,
              email: data.email,
              role: data.role,
              organisation: data.organisation,
              company: data.company,
              message: data.message,
              followUpPreference: data.followUpPreference,
              source: data.source,
            },
            leadScore: {
              score: leadScore.score,
              temperature: leadScore.temperature,
              buyerPersona: leadScore.buyerPersona,
              companySize: leadScore.companySize,
              urgency: leadScore.urgency,
              nextAction: leadScore.nextAction,
              breakdown: leadScore.breakdown,
            },
            aiAnalysis,
            diagnosticContext,
          },
        });

        if (notificationError) {
          console.error('Notification error:', notificationError);
          setError('Failed to send notification');
          return { score: leadScore, success: false };
        }

        console.log(`Lead notification processed: ${data.name} (${leadScore.temperature}, ${leadScore.score}/100)`);
        return { score: leadScore, success: true };

      } catch (notificationErr) {
        console.error('Failed to send notification:', notificationErr);
        setError('Failed to send notification');
        return { score: leadScore, success: false };
      }

    } catch (err) {
      console.error('Lead processing error:', err);
      setError('Failed to process lead');
      return { score: leadScore, success: false };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { processLead, isProcessing, error };
}
