export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_readiness_submissions: {
        Row: {
          ai_analysis: string | null
          ai_awareness_score: number
          answers: Json
          buyer_persona: string | null
          change_readiness_score: number
          company_size: string | null
          created_at: string
          email: string | null
          ethical_ai_score: number
          follow_up_preference: string | null
          human_ai_collab_score: number
          human_skills_score: number
          id: string
          lead_score: number | null
          lead_temperature: string | null
          name: string | null
          next_action: string | null
          organisation: string | null
          overall_score: number
          phone: string | null
          primary_recommendation: string
          readiness_level: string
          role: string | null
          scoring_breakdown: Json | null
          secondary_recommendation: string | null
          urgency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          waiting_list: boolean | null
        }
        Insert: {
          ai_analysis?: string | null
          ai_awareness_score: number
          answers: Json
          buyer_persona?: string | null
          change_readiness_score: number
          company_size?: string | null
          created_at?: string
          email?: string | null
          ethical_ai_score: number
          follow_up_preference?: string | null
          human_ai_collab_score: number
          human_skills_score: number
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          overall_score: number
          phone?: string | null
          primary_recommendation: string
          readiness_level: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_recommendation?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Update: {
          ai_analysis?: string | null
          ai_awareness_score?: number
          answers?: Json
          buyer_persona?: string | null
          change_readiness_score?: number
          company_size?: string | null
          created_at?: string
          email?: string | null
          ethical_ai_score?: number
          follow_up_preference?: string | null
          human_ai_collab_score?: number
          human_skills_score?: number
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          overall_score?: number
          phone?: string | null
          primary_recommendation?: string
          readiness_level?: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_recommendation?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          author_role: string | null
          content: string
          created_at: string
          date: string
          excerpt: string
          featured_image: string | null
          id: string
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          author_role?: string | null
          content: string
          created_at?: string
          date: string
          excerpt: string
          featured_image?: string | null
          id?: string
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          author_role?: string | null
          content?: string
          created_at?: string
          date?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_form_submissions: {
        Row: {
          ai_analysis: string | null
          buyer_persona: string | null
          company: string | null
          company_size: string | null
          created_at: string
          email: string
          id: string
          lead_score: number | null
          lead_temperature: string | null
          message: string | null
          name: string
          next_action: string | null
          phone: string | null
          role: string | null
          scoring_breakdown: Json | null
          service_interest: string | null
          urgency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          ai_analysis?: string | null
          buyer_persona?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          email: string
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          message?: string | null
          name: string
          next_action?: string | null
          phone?: string | null
          role?: string | null
          scoring_breakdown?: Json | null
          service_interest?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          ai_analysis?: string | null
          buyer_persona?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          message?: string | null
          name?: string
          next_action?: string | null
          phone?: string | null
          role?: string | null
          scoring_breakdown?: Json | null
          service_interest?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      diagnostic_submissions: {
        Row: {
          ai_analysis: string | null
          answers: Json
          buyer_persona: string | null
          clarity_score: number
          company: string | null
          company_size: string | null
          contacted_expert: boolean | null
          created_at: string
          email: string | null
          follow_up_preference: string | null
          id: string
          lead_score: number | null
          lead_temperature: string | null
          leadership_score: number
          motivation_score: number
          name: string | null
          next_action: string | null
          organisation: string | null
          phone: string | null
          primary_recommendation: string
          role: string | null
          scoring_breakdown: Json | null
          secondary_recommendation: string | null
          urgency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          waiting_list: boolean | null
        }
        Insert: {
          ai_analysis?: string | null
          answers: Json
          buyer_persona?: string | null
          clarity_score: number
          company?: string | null
          company_size?: string | null
          contacted_expert?: boolean | null
          created_at?: string
          email?: string | null
          follow_up_preference?: string | null
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          leadership_score: number
          motivation_score: number
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          phone?: string | null
          primary_recommendation: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_recommendation?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Update: {
          ai_analysis?: string | null
          answers?: Json
          buyer_persona?: string | null
          clarity_score?: number
          company?: string | null
          company_size?: string | null
          contacted_expert?: boolean | null
          created_at?: string
          email?: string | null
          follow_up_preference?: string | null
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          leadership_score?: number
          motivation_score?: number
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          phone?: string | null
          primary_recommendation?: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_recommendation?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Relationships: []
      }
      lead_magnet_downloads: {
        Row: {
          ai_analysis: string | null
          buyer_persona: string | null
          downloaded_at: string
          email: string
          id: string
          lead_magnet: string
          lead_score: number | null
          lead_temperature: string | null
          name: string
          phone: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          ai_analysis?: string | null
          buyer_persona?: string | null
          downloaded_at?: string
          email: string
          id?: string
          lead_magnet: string
          lead_score?: number | null
          lead_temperature?: string | null
          name: string
          phone?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          ai_analysis?: string | null
          buyer_persona?: string | null
          downloaded_at?: string
          email?: string
          id?: string
          lead_magnet?: string
          lead_score?: number | null
          lead_temperature?: string | null
          name?: string
          phone?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      leadership_diagnostic_submissions: {
        Row: {
          ai_analysis: string | null
          answers: Json
          buyer_persona: string | null
          company: string | null
          company_size: string | null
          created_at: string
          email: string | null
          follow_up_preference: string | null
          id: string
          is_hybrid: boolean
          l1_score: number
          l2_score: number
          l3_score: number
          l4_score: number
          l5_score: number
          lead_score: number | null
          lead_temperature: string | null
          low_foundation_flag: boolean
          name: string | null
          next_action: string | null
          organisation: string | null
          phone: string | null
          primary_level: string
          role: string | null
          scoring_breakdown: Json | null
          secondary_level: string | null
          urgency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          waiting_list: boolean | null
        }
        Insert: {
          ai_analysis?: string | null
          answers: Json
          buyer_persona?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          follow_up_preference?: string | null
          id?: string
          is_hybrid?: boolean
          l1_score: number
          l2_score: number
          l3_score: number
          l4_score: number
          l5_score: number
          lead_score?: number | null
          lead_temperature?: string | null
          low_foundation_flag?: boolean
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          phone?: string | null
          primary_level: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_level?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Update: {
          ai_analysis?: string | null
          answers?: Json
          buyer_persona?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          follow_up_preference?: string | null
          id?: string
          is_hybrid?: boolean
          l1_score?: number
          l2_score?: number
          l3_score?: number
          l4_score?: number
          l5_score?: number
          lead_score?: number | null
          lead_temperature?: string | null
          low_foundation_flag?: boolean
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          phone?: string | null
          primary_level?: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_level?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          campaign_type: string
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          name: string
          starts_at: string | null
          status: string
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          campaign_type: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          name: string
          starts_at?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          campaign_type?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          name?: string
          starts_at?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      marketing_content: {
        Row: {
          clicks: number | null
          content: string
          content_type: string
          created_at: string
          engagements: number | null
          hashtags: string[] | null
          id: string
          impressions: number | null
          platform_post_id: string | null
          platform_url: string | null
          published_at: string | null
          review_notes: string | null
          reviewed_at: string | null
          scheduled_for: string | null
          source_reference: string | null
          source_type: string | null
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          clicks?: number | null
          content: string
          content_type: string
          created_at?: string
          engagements?: number | null
          hashtags?: string[] | null
          id?: string
          impressions?: number | null
          platform_post_id?: string | null
          platform_url?: string | null
          published_at?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          scheduled_for?: string | null
          source_reference?: string | null
          source_type?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          clicks?: number | null
          content?: string
          content_type?: string
          created_at?: string
          engagements?: number | null
          hashtags?: string[] | null
          id?: string
          impressions?: number | null
          platform_post_id?: string | null
          platform_url?: string | null
          published_at?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          scheduled_for?: string | null
          source_reference?: string | null
          source_type?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shift_diagnostic_submissions: {
        Row: {
          ai_analysis: string | null
          answers: Json
          buyer_persona: string | null
          company_size: string | null
          created_at: string
          email: string | null
          focus_score: number
          follow_up_preference: string | null
          human_intelligence_score: number
          id: string
          innovation_score: number
          lead_score: number | null
          lead_temperature: string | null
          name: string | null
          next_action: string | null
          organisation: string | null
          phone: string | null
          primary_development: string
          primary_strength: string
          role: string | null
          scoring_breakdown: Json | null
          secondary_development: string | null
          self_management_score: number
          thinking_score: number
          urgency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          waiting_list: boolean | null
        }
        Insert: {
          ai_analysis?: string | null
          answers: Json
          buyer_persona?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          focus_score: number
          follow_up_preference?: string | null
          human_intelligence_score: number
          id?: string
          innovation_score: number
          lead_score?: number | null
          lead_temperature?: string | null
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          phone?: string | null
          primary_development: string
          primary_strength: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_development?: string | null
          self_management_score: number
          thinking_score: number
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Update: {
          ai_analysis?: string | null
          answers?: Json
          buyer_persona?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          focus_score?: number
          follow_up_preference?: string | null
          human_intelligence_score?: number
          id?: string
          innovation_score?: number
          lead_score?: number | null
          lead_temperature?: string | null
          name?: string | null
          next_action?: string | null
          organisation?: string | null
          phone?: string | null
          primary_development?: string
          primary_strength?: string
          role?: string | null
          scoring_breakdown?: Json | null
          secondary_development?: string | null
          self_management_score?: number
          thinking_score?: number
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workshop_downloads: {
        Row: {
          created_at: string
          diagnostic_submission_id: string | null
          email: string
          id: string
          name: string | null
          workshop: string
        }
        Insert: {
          created_at?: string
          diagnostic_submission_id?: string | null
          email: string
          id?: string
          name?: string | null
          workshop: string
        }
        Update: {
          created_at?: string
          diagnostic_submission_id?: string | null
          email?: string
          id?: string
          name?: string | null
          workshop?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_downloads_diagnostic_submission_id_fkey"
            columns: ["diagnostic_submission_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
