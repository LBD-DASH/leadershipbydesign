// Lead Notification Utilities for Leadership by Design
// Handles sending lead notifications to Kevin and Lauren based on lead temperature

import { supabase } from '@/integrations/supabase/client';
import { LeadData, LeadScore } from './leadScoring';

export interface SendNotificationResult {
  success: boolean;
  emailsSent?: string[];
  error?: string;
}

/**
 * Get AI analysis for a lead using the Anthropic-powered edge function
 */
export async function getAIAnalysis(
  leadData: LeadData,
  leadScore: LeadScore,
  diagnosticContext?: string
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-lead', {
      body: {
        leadData: {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          role: leadData.role,
          organisation: leadData.organisation,
          company: leadData.company,
          message: leadData.message,
          followUpPreference: leadData.followUpPreference,
          source: leadData.source,
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

    if (error) {
      console.error('AI analysis error:', error);
      return 'AI analysis unavailable';
    }

    return data?.analysis || 'AI analysis unavailable';
  } catch (err) {
    console.error('Failed to get AI analysis:', err);
    return 'AI analysis unavailable';
  }
}

/**
 * Send lead notification emails based on lead temperature
 * - Hot leads: Alerts sent to Kevin AND Lauren
 * - Warm leads: Alert sent to Kevin only
 * - Cool leads: No email (just database storage)
 */
export async function sendLeadNotification(
  leadData: LeadData,
  leadScore: LeadScore,
  aiAnalysis: string,
  diagnosticContext?: string
): Promise<SendNotificationResult> {
  // Skip notifications for cool leads
  if (leadScore.temperature === 'cool') {
    console.log(`Cool lead (${leadScore.score}/100) - skipping notification`);
    return { success: true, emailsSent: [] };
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-lead-notification', {
      body: {
        leadData: {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          role: leadData.role,
          organisation: leadData.organisation,
          company: leadData.company,
          message: leadData.message,
          followUpPreference: leadData.followUpPreference,
          source: leadData.source,
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

    if (error) {
      console.error('Notification error:', error);
      return { success: false, error: error.message };
    }

    console.log(`Lead notification sent: ${leadData.name} (${leadScore.temperature})`);
    return { success: true, emailsSent: data?.emailsSent || [] };
  } catch (err) {
    console.error('Failed to send notification:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

/**
 * Process a lead end-to-end: score, analyze with AI, and send notifications
 * This is the main function to use in form submissions
 */
export async function processLead(
  leadData: LeadData,
  diagnosticContext?: string
): Promise<{
  leadScore: LeadScore;
  aiAnalysis: string;
  notificationResult: SendNotificationResult;
}> {
  // Import dynamically to avoid circular dependency
  const { calculateLeadScore } = await import('./leadScoring');
  
  // Step 1: Calculate lead score
  const leadScore = calculateLeadScore(leadData);
  console.log(`📊 Lead scored: ${leadScore.score}/100 (${leadScore.temperature})`);

  // Step 2: Get AI analysis for hot/warm leads
  let aiAnalysis = '';
  if (leadScore.temperature !== 'cool') {
    aiAnalysis = await getAIAnalysis(leadData, leadScore, diagnosticContext);
    console.log('🤖 AI analysis completed');
  }

  // Step 3: Send notifications
  const notificationResult = await sendLeadNotification(
    leadData, 
    leadScore, 
    aiAnalysis, 
    diagnosticContext
  );
  
  if (notificationResult.success) {
    console.log('📧 Notifications sent');
  }

  return { leadScore, aiAnalysis, notificationResult };
}
