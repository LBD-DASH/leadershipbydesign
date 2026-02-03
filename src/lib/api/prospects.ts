import { supabase } from '@/integrations/supabase/client';

export interface ProspectCompany {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  website_url: string;
  industry: string | null;
  company_size: string | null;
  about_summary: string | null;
  leadership_team: { name: string; role: string }[] | null;
  pain_points: string[] | null;
  opportunity_signals: string[] | null;
  personalised_pitch: string | null;
  suggested_approach: string | null;
  status: string;
  contacted_at: string | null;
  notes: string | null;
}

export interface CompanyResearchResult {
  company_name: string;
  website_url: string;
  industry: string | null;
  company_size: string | null;
  about_summary: string | null;
  leadership_team: { name: string; role: string }[] | null;
  pain_points: string[] | null;
  opportunity_signals: string[] | null;
  personalised_pitch: string | null;
  suggested_approach: string | null;
}

export const prospectsApi = {
  // Research a company by URL
  async researchCompany(url: string): Promise<{ success: boolean; data?: CompanyResearchResult; error?: string }> {
    const { data, error } = await supabase.functions.invoke('firecrawl-company-research', {
      body: { url },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  // Save a researched company to the database
  async saveProspect(prospect: Omit<ProspectCompany, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: ProspectCompany; error?: string }> {
    const { data, error } = await supabase
      .from('prospect_companies')
      .insert(prospect)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data as ProspectCompany };
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
    return { success: true, data: data as ProspectCompany[] };
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
