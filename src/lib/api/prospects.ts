import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Helper to safely parse JSON arrays from database
function parseJsonArray<T>(json: Json | null): T[] | null {
  if (!json) return null;
  if (Array.isArray(json)) return json as T[];
  return null;
}

export interface LeadershipTeamMember {
  name: string;
  role: string;
}

export interface HRContact {
  name: string;
  role: string;
  linkedin_search_url: string;
}

export interface ProspectCompany {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  website_url: string;
  industry: string | null;
  company_size: string | null;
  about_summary: string | null;
  leadership_team: LeadershipTeamMember[] | null;
  pain_points: string[] | null;
  opportunity_signals: string[] | null;
  personalised_pitch: string | null;
  suggested_approach: string | null;
  status: string;
  contacted_at: string | null;
  notes: string | null;
  // Contact fields
  contact_email: string | null;
  contact_phone: string | null;
  contact_name: string | null;
  contact_role: string | null;
  physical_address: string | null;
  linkedin_url: string | null;
  // HR/L&D contacts for LinkedIn outreach
  hr_contacts: HRContact[] | null;
}

export interface CompanyResearchResult {
  company_name: string;
  website_url: string;
  industry: string | null;
  company_size: string | null;
  about_summary: string | null;
  leadership_team: LeadershipTeamMember[] | null;
  pain_points: string[] | null;
  opportunity_signals: string[] | null;
  personalised_pitch: string | null;
  suggested_approach: string | null;
  // Contact fields from enhanced extraction
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_name?: string | null;
  contact_role?: string | null;
  physical_address?: string | null;
  linkedin_url?: string | null;
  // HR/L&D contacts for LinkedIn outreach
  hr_contacts?: HRContact[] | null;
}

export interface ProspectOutreach {
  id: string;
  prospect_id: string;
  email_subject: string;
  email_body: string;
  status: 'draft' | 'sent' | 'opened' | 'replied' | 'bounced' | 'unsubscribed';
  sent_at: string | null;
  opened_at: string | null;
  replied_at: string | null;
  bounced_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscoverySearchParams {
  industry: string;
  location: string;
  companySize: string;
  targetContacts: 'hr' | 'csuite' | 'both';
}

export interface DiscoveredCompany {
  company_name: string;
  website_url: string;
  industry: string;
  location: string;
  description: string;
}

// Transform database row to ProspectCompany with proper type parsing
function transformProspectRow(row: Record<string, unknown>): ProspectCompany {
  return {
    id: row.id as string,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    company_name: row.company_name as string,
    website_url: row.website_url as string,
    industry: row.industry as string | null,
    company_size: row.company_size as string | null,
    about_summary: row.about_summary as string | null,
    leadership_team: parseJsonArray<LeadershipTeamMember>(row.leadership_team as Json | null),
    pain_points: parseJsonArray<string>(row.pain_points as Json | null),
    opportunity_signals: parseJsonArray<string>(row.opportunity_signals as Json | null),
    personalised_pitch: row.personalised_pitch as string | null,
    suggested_approach: row.suggested_approach as string | null,
    status: row.status as string,
    contacted_at: row.contacted_at as string | null,
    notes: row.notes as string | null,
    contact_email: row.contact_email as string | null,
    contact_phone: row.contact_phone as string | null,
    contact_name: row.contact_name as string | null,
    contact_role: row.contact_role as string | null,
    physical_address: row.physical_address as string | null,
    linkedin_url: row.linkedin_url as string | null,
    hr_contacts: parseJsonArray<HRContact>(row.hr_contacts as Json | null),
  };
}

export const prospectsApi = {
  // Research a company by URL
  async researchCompany(url: string): Promise<{ success: boolean; data?: CompanyResearchResult; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('firecrawl-company-research', {
        body: { url },
      });

      // Non-2xx responses may surface either as `error` or as a thrown exception depending on runtime.
      if (error) {
        // Try to preserve the edge function's message when it is embedded in the error string.
        const message = typeof error.message === 'string' ? error.message : 'Bad Request';
        return { success: false, error: message };
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bad Request';
      return { success: false, error: message };
    }
  },

  // Save a researched company to the database
  async saveProspect(prospect: Omit<ProspectCompany, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: ProspectCompany; error?: string }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabase
      .from('prospect_companies')
      .insert(prospect as any)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: transformProspectRow(data as Record<string, unknown>) };
  },

  // Get all prospects
  async getProspects(): Promise<{ success: boolean; data?: ProspectCompany[]; error?: string }> {
    const { data, error } = await supabase
      .from('prospect_companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: (data as Record<string, unknown>[]).map(transformProspectRow) };
  },

  // Discover companies using AI search
  async discoverCompanies(params: DiscoverySearchParams): Promise<{ success: boolean; data?: DiscoveredCompany[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('find-companies', {
        body: params,
      });

      if (error) {
        const message = typeof error.message === 'string' ? error.message : 'Discovery failed';
        return { success: false, error: message };
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Discovery failed';
      return { success: false, error: message };
    }
  },

  // Send outreach email
  async sendOutreach(prospectId: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-prospect-outreach', {
        body: { prospectId, subject, body },
      });

      if (error) {
        const message = typeof error.message === 'string' ? error.message : 'Failed to send email';
        return { success: false, error: message };
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send email';
      return { success: false, error: message };
    }
  },

  // Send direct email (without saved prospect - saves and sends in one go)
  async sendDirectEmail(
    researchData: CompanyResearchResult,
    subject: string,
    body: string
  ): Promise<{ success: boolean; prospectId?: string; error?: string }> {
    try {
      // First save the prospect
      const saveResult = await this.saveProspect({
        company_name: researchData.company_name,
        website_url: researchData.website_url,
        industry: researchData.industry,
        company_size: researchData.company_size,
        about_summary: researchData.about_summary,
        leadership_team: researchData.leadership_team,
        pain_points: researchData.pain_points,
        opportunity_signals: researchData.opportunity_signals,
        personalised_pitch: researchData.personalised_pitch,
        suggested_approach: researchData.suggested_approach,
        status: 'researched',
        contacted_at: null,
        notes: null,
        contact_email: researchData.contact_email || null,
        contact_phone: researchData.contact_phone || null,
        contact_name: researchData.contact_name || null,
        contact_role: researchData.contact_role || null,
        physical_address: researchData.physical_address || null,
        linkedin_url: researchData.linkedin_url || null,
        hr_contacts: researchData.hr_contacts || null,
      });

      if (!saveResult.success || !saveResult.data) {
        return { success: false, error: saveResult.error || 'Failed to save prospect' };
      }

      // Then send the email
      const emailResult = await this.sendOutreach(saveResult.data.id, subject, body);
      
      if (!emailResult.success) {
        return { success: false, prospectId: saveResult.data.id, error: emailResult.error };
      }

      return { success: true, prospectId: saveResult.data.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send email';
      return { success: false, error: message };
    }
  },

  // Get outreach history for a prospect
  async getOutreachHistory(prospectId: string): Promise<{ success: boolean; data?: ProspectOutreach[]; error?: string }> {
    const { data, error } = await supabase
      .from('prospect_outreach')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data as ProspectOutreach[] };
  },

  // Update prospect status
  async updateProspectStatus(id: string, status: string, notes?: string): Promise<{ success: boolean; error?: string }> {
    const updateData: Record<string, unknown> = { status };
    if (status === 'contacted') {
      updateData.contacted_at = new Date().toISOString();
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { error } = await supabase
      .from('prospect_companies')
      .update(updateData)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  // Delete a prospect
  async deleteProspect(id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('prospect_companies')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
