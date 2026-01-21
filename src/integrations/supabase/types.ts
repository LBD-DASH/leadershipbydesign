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
      diagnostic_submissions: {
        Row: {
          answers: Json
          clarity_score: number
          company: string | null
          contacted_expert: boolean | null
          created_at: string
          email: string | null
          follow_up_preference: string | null
          id: string
          leadership_score: number
          motivation_score: number
          name: string | null
          organisation: string | null
          primary_recommendation: string
          role: string | null
          secondary_recommendation: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          waiting_list: boolean | null
        }
        Insert: {
          answers: Json
          clarity_score: number
          company?: string | null
          contacted_expert?: boolean | null
          created_at?: string
          email?: string | null
          follow_up_preference?: string | null
          id?: string
          leadership_score: number
          motivation_score: number
          name?: string | null
          organisation?: string | null
          primary_recommendation: string
          role?: string | null
          secondary_recommendation?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Update: {
          answers?: Json
          clarity_score?: number
          company?: string | null
          contacted_expert?: boolean | null
          created_at?: string
          email?: string | null
          follow_up_preference?: string | null
          id?: string
          leadership_score?: number
          motivation_score?: number
          name?: string | null
          organisation?: string | null
          primary_recommendation?: string
          role?: string | null
          secondary_recommendation?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Relationships: []
      }
      leadership_diagnostic_submissions: {
        Row: {
          answers: Json
          company: string | null
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
          low_foundation_flag: boolean
          name: string | null
          organisation: string | null
          primary_level: string
          role: string | null
          secondary_level: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          waiting_list: boolean | null
        }
        Insert: {
          answers: Json
          company?: string | null
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
          low_foundation_flag?: boolean
          name?: string | null
          organisation?: string | null
          primary_level: string
          role?: string | null
          secondary_level?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
        }
        Update: {
          answers?: Json
          company?: string | null
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
          low_foundation_flag?: boolean
          name?: string | null
          organisation?: string | null
          primary_level?: string
          role?: string | null
          secondary_level?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          waiting_list?: boolean | null
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
