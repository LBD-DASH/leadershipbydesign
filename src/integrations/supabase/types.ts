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
      active_projects: {
        Row: {
          created_at: string
          emoji: string | null
          id: string
          notes: string | null
          priority: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          id?: string
          notes?: string | null
          priority?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          emoji?: string | null
          id?: string
          notes?: string | null
          priority?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      apollo_sequence_templates: {
        Row: {
          body: string
          created_at: string
          cta_type: string
          day_number: number
          id: string
          note: string | null
          sequence_name: string
          status: string
          step_number: number
          subject: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          cta_type?: string
          day_number: number
          id?: string
          note?: string | null
          sequence_name?: string
          status?: string
          step_number: number
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          cta_type?: string
          day_number?: number
          id?: string
          note?: string | null
          sequence_name?: string
          status?: string
          step_number?: number
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      apollo_sequence_tracking: {
        Row: {
          added_to_call_list_at: string | null
          apollo_contact_id: string
          apollo_sequence_id: string
          apollo_sequence_name: string | null
          assigned_agent: string | null
          assigned_at: string | null
          call_alert_sent: boolean | null
          call_alert_sent_at: string | null
          call_list_prospect_id: string | null
          call_notes: string | null
          call_outcome: string | null
          called_at: string | null
          campaign_intent: string | null
          contact_company: string | null
          contact_email: string
          contact_name: string | null
          contact_title: string | null
          created_at: string
          current_step: number | null
          email_steps: Json | null
          has_bounced: boolean | null
          id: string
          industry_tag: string | null
          last_activity_at: string | null
          last_email_sent_at: string | null
          offer_type: string | null
          priority_reason: string | null
          priority_score: number | null
          sequence_finished: boolean | null
          sequence_total_steps: number | null
          source: string | null
          status: string
          suggested_opener: string | null
          total_clicks: number | null
          total_emails_sent: number | null
          total_opens: number | null
          total_replies: number | null
          updated_at: string
        }
        Insert: {
          added_to_call_list_at?: string | null
          apollo_contact_id: string
          apollo_sequence_id: string
          apollo_sequence_name?: string | null
          assigned_agent?: string | null
          assigned_at?: string | null
          call_alert_sent?: boolean | null
          call_alert_sent_at?: string | null
          call_list_prospect_id?: string | null
          call_notes?: string | null
          call_outcome?: string | null
          called_at?: string | null
          campaign_intent?: string | null
          contact_company?: string | null
          contact_email: string
          contact_name?: string | null
          contact_title?: string | null
          created_at?: string
          current_step?: number | null
          email_steps?: Json | null
          has_bounced?: boolean | null
          id?: string
          industry_tag?: string | null
          last_activity_at?: string | null
          last_email_sent_at?: string | null
          offer_type?: string | null
          priority_reason?: string | null
          priority_score?: number | null
          sequence_finished?: boolean | null
          sequence_total_steps?: number | null
          source?: string | null
          status?: string
          suggested_opener?: string | null
          total_clicks?: number | null
          total_emails_sent?: number | null
          total_opens?: number | null
          total_replies?: number | null
          updated_at?: string
        }
        Update: {
          added_to_call_list_at?: string | null
          apollo_contact_id?: string
          apollo_sequence_id?: string
          apollo_sequence_name?: string | null
          assigned_agent?: string | null
          assigned_at?: string | null
          call_alert_sent?: boolean | null
          call_alert_sent_at?: string | null
          call_list_prospect_id?: string | null
          call_notes?: string | null
          call_outcome?: string | null
          called_at?: string | null
          campaign_intent?: string | null
          contact_company?: string | null
          contact_email?: string
          contact_name?: string | null
          contact_title?: string | null
          created_at?: string
          current_step?: number | null
          email_steps?: Json | null
          has_bounced?: boolean | null
          id?: string
          industry_tag?: string | null
          last_activity_at?: string | null
          last_email_sent_at?: string | null
          offer_type?: string | null
          priority_reason?: string | null
          priority_score?: number | null
          sequence_finished?: boolean | null
          sequence_total_steps?: number | null
          source?: string | null
          status?: string
          suggested_opener?: string | null
          total_clicks?: number | null
          total_emails_sent?: number | null
          total_opens?: number | null
          total_replies?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "apollo_sequence_tracking_call_list_prospect_id_fkey"
            columns: ["call_list_prospect_id"]
            isOneToOne: false
            referencedRelation: "call_list_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      apollo_sync_log: {
        Row: {
          error_message: string | null
          id: string
          status: string
          steps_synced: number
          synced_at: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          status?: string
          steps_synced?: number
          synced_at?: string
        }
        Update: {
          error_message?: string | null
          id?: string
          status?: string
          steps_synced?: number
          synced_at?: string
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
      bookings: {
        Row: {
          confirmation_sent: boolean | null
          created_at: string
          diagnostic_sent: boolean | null
          id: string
          meeting_datetime: string | null
          meeting_type: string | null
          notes: string | null
          prospect_company: string | null
          prospect_email: string | null
          prospect_name: string | null
          source_id: string | null
          source_table: string | null
        }
        Insert: {
          confirmation_sent?: boolean | null
          created_at?: string
          diagnostic_sent?: boolean | null
          id?: string
          meeting_datetime?: string | null
          meeting_type?: string | null
          notes?: string | null
          prospect_company?: string | null
          prospect_email?: string | null
          prospect_name?: string | null
          source_id?: string | null
          source_table?: string | null
        }
        Update: {
          confirmation_sent?: boolean | null
          created_at?: string
          diagnostic_sent?: boolean | null
          id?: string
          meeting_datetime?: string | null
          meeting_type?: string | null
          notes?: string | null
          prospect_company?: string | null
          prospect_email?: string | null
          prospect_name?: string | null
          source_id?: string | null
          source_table?: string | null
        }
        Relationships: []
      }
      call_list_prospects: {
        Row: {
          batch_id: string | null
          call_feedback: string | null
          call_outcome: string | null
          called_at: string | null
          company: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          phone: string | null
          source: string
          status: string
          title: string | null
          uploaded_by: string | null
        }
        Insert: {
          batch_id?: string | null
          call_feedback?: string | null
          call_outcome?: string | null
          called_at?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string
          status?: string
          title?: string | null
          uploaded_by?: string | null
        }
        Update: {
          batch_id?: string | null
          call_feedback?: string | null
          call_outcome?: string | null
          called_at?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string
          status?: string
          title?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      chat_leads: {
        Row: {
          chat_summary: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organisation: string | null
          source: string | null
        }
        Insert: {
          chat_summary?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organisation?: string | null
          source?: string | null
        }
        Update: {
          chat_summary?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organisation?: string | null
          source?: string | null
        }
        Relationships: []
      }
      cold_call_logs: {
        Row: {
          company: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          follow_up_date: string | null
          gatekeeper_outcome: string | null
          id: string
          initial_response: string
          notes: string | null
          objection_reason: string | null
          phone: string | null
          pitch_outcome: string | null
          programme_interest: string | null
          proposed_meeting_date: string | null
          rep_name: string
        }
        Insert: {
          company?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          gatekeeper_outcome?: string | null
          id?: string
          initial_response: string
          notes?: string | null
          objection_reason?: string | null
          phone?: string | null
          pitch_outcome?: string | null
          programme_interest?: string | null
          proposed_meeting_date?: string | null
          rep_name: string
        }
        Update: {
          company?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          gatekeeper_outcome?: string | null
          id?: string
          initial_response?: string
          notes?: string | null
          objection_reason?: string | null
          phone?: string | null
          pitch_outcome?: string | null
          programme_interest?: string | null
          proposed_meeting_date?: string | null
          rep_name?: string
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
      contagious_identity_interests: {
        Row: {
          ai_analysis: string | null
          buyer_persona: string | null
          coaching_goals: string | null
          company: string | null
          company_size: string | null
          created_at: string
          current_challenge: string | null
          email: string
          id: string
          lead_score: number | null
          lead_temperature: string | null
          name: string
          next_action: string | null
          phone: string | null
          role: string | null
          scoring_breakdown: Json | null
          submission_type: string
          timeline: string | null
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
          coaching_goals?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          current_challenge?: string | null
          email: string
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          name: string
          next_action?: string | null
          phone?: string | null
          role?: string | null
          scoring_breakdown?: Json | null
          submission_type?: string
          timeline?: string | null
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
          coaching_goals?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          current_challenge?: string | null
          email?: string
          id?: string
          lead_score?: number | null
          lead_temperature?: string | null
          name?: string
          next_action?: string | null
          phone?: string | null
          role?: string | null
          scoring_breakdown?: Json | null
          submission_type?: string
          timeline?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      content_assets: {
        Row: {
          blog_post: Json | null
          created_at: string
          email_block: Json | null
          error_message: string | null
          id: string
          linkedin_long: string | null
          linkedin_short: string | null
          pdf_summary: Json | null
          pdf_url: string | null
          published_date: string | null
          relevant_diagnostic: string | null
          relevant_product: string | null
          short_form_scripts: Json | null
          status: string
          transcript: string | null
          twitter_thread: Json | null
          updated_at: string
          video_description: string | null
          video_duration: string | null
          video_thumbnail: string | null
          video_title: string | null
          video_url: string
        }
        Insert: {
          blog_post?: Json | null
          created_at?: string
          email_block?: Json | null
          error_message?: string | null
          id?: string
          linkedin_long?: string | null
          linkedin_short?: string | null
          pdf_summary?: Json | null
          pdf_url?: string | null
          published_date?: string | null
          relevant_diagnostic?: string | null
          relevant_product?: string | null
          short_form_scripts?: Json | null
          status?: string
          transcript?: string | null
          twitter_thread?: Json | null
          updated_at?: string
          video_description?: string | null
          video_duration?: string | null
          video_thumbnail?: string | null
          video_title?: string | null
          video_url: string
        }
        Update: {
          blog_post?: Json | null
          created_at?: string
          email_block?: Json | null
          error_message?: string | null
          id?: string
          linkedin_long?: string | null
          linkedin_short?: string | null
          pdf_summary?: Json | null
          pdf_url?: string | null
          published_date?: string | null
          relevant_diagnostic?: string | null
          relevant_product?: string | null
          short_form_scripts?: Json | null
          status?: string
          transcript?: string | null
          twitter_thread?: Json | null
          updated_at?: string
          video_description?: string | null
          video_duration?: string | null
          video_thumbnail?: string | null
          video_title?: string | null
          video_url?: string
        }
        Relationships: []
      }
      conversion_insights: {
        Row: {
          click_rate: number | null
          contact_submissions: number
          created_at: string
          id: string
          newsletter_id: string | null
          open_rate: number | null
          pain_cluster: string | null
          subject_line_type: string | null
          theme: string | null
          total_clicks: number
          total_opens: number
        }
        Insert: {
          click_rate?: number | null
          contact_submissions?: number
          created_at?: string
          id?: string
          newsletter_id?: string | null
          open_rate?: number | null
          pain_cluster?: string | null
          subject_line_type?: string | null
          theme?: string | null
          total_clicks?: number
          total_opens?: number
        }
        Update: {
          click_rate?: number | null
          contact_submissions?: number
          created_at?: string
          id?: string
          newsletter_id?: string | null
          open_rate?: number | null
          pain_cluster?: string | null
          subject_line_type?: string | null
          theme?: string | null
          total_clicks?: number
          total_opens?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversion_insights_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletter_sends"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_nurture_sequences: {
        Row: {
          created_at: string
          current_step: number
          diagnostic_submission_id: string | null
          diagnostic_type: string
          id: string
          lead_email: string
          lead_name: string | null
          next_send_at: string
          primary_result: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: number
          diagnostic_submission_id?: string | null
          diagnostic_type: string
          id?: string
          lead_email: string
          lead_name?: string | null
          next_send_at?: string
          primary_result?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: number
          diagnostic_submission_id?: string | null
          diagnostic_type?: string
          id?: string
          lead_email?: string
          lead_name?: string | null
          next_send_at?: string
          primary_result?: string | null
          status?: string
          updated_at?: string
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
      email_subscribers: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
          status: string | null
          tags: string[] | null
          unsubscribed_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      google_ads_content: {
        Row: {
          audience_signals: Json | null
          campaign_brief: string | null
          campaign_type: string
          created_at: string
          descriptions: Json
          headlines: Json
          id: string
          keywords: Json | null
          negative_keywords: Json | null
          notes: string | null
          service_reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          audience_signals?: Json | null
          campaign_brief?: string | null
          campaign_type: string
          created_at?: string
          descriptions: Json
          headlines: Json
          id?: string
          keywords?: Json | null
          negative_keywords?: Json | null
          notes?: string | null
          service_reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          audience_signals?: Json | null
          campaign_brief?: string | null
          campaign_type?: string
          created_at?: string
          descriptions?: Json
          headlines?: Json
          id?: string
          keywords?: Json | null
          negative_keywords?: Json | null
          notes?: string | null
          service_reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_captures: {
        Row: {
          company: string | null
          content_asset_id: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          resource_slug: string | null
          resource_title: string | null
          source: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          company?: string | null
          content_asset_id?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          resource_slug?: string | null
          resource_title?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          company?: string | null
          content_asset_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          resource_slug?: string | null
          resource_title?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_captures_content_asset_id_fkey"
            columns: ["content_asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
        ]
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
      leader_as_coach_assessments: {
        Row: {
          ai_analysis: string | null
          buyer_persona: string | null
          company: string | null
          company_size: string | null
          created_at: string
          email: string | null
          id: string
          job_title: string | null
          lead_score: number | null
          lead_temperature: string | null
          lowest_areas: Json
          name: string | null
          next_action: string | null
          profile: string
          q1: number
          q10: number
          q11: number
          q12: number
          q13: number
          q14: number
          q15: number
          q2: number
          q3: number
          q4: number
          q5: number
          q6: number
          q7: number
          q8: number
          q9: number
          scoring_breakdown: Json | null
          total_score: number
          urgency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          version: string
        }
        Insert: {
          ai_analysis?: string | null
          buyer_persona?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string | null
          lead_score?: number | null
          lead_temperature?: string | null
          lowest_areas?: Json
          name?: string | null
          next_action?: string | null
          profile: string
          q1: number
          q10: number
          q11: number
          q12: number
          q13: number
          q14: number
          q15: number
          q2: number
          q3: number
          q4: number
          q5: number
          q6: number
          q7: number
          q8: number
          q9: number
          scoring_breakdown?: Json | null
          total_score: number
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          version: string
        }
        Update: {
          ai_analysis?: string | null
          buyer_persona?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string | null
          lead_score?: number | null
          lead_temperature?: string | null
          lowest_areas?: Json
          name?: string | null
          next_action?: string | null
          profile?: string
          q1?: number
          q10?: number
          q11?: number
          q12?: number
          q13?: number
          q14?: number
          q15?: number
          q2?: number
          q3?: number
          q4?: number
          q5?: number
          q6?: number
          q7?: number
          q8?: number
          q9?: number
          scoring_breakdown?: Json | null
          total_score?: number
          urgency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          version?: string
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
      life_os_focus_tasks: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          date: string
          id: string
          is_completed: boolean
          is_current: boolean
          target_minutes: number | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          is_completed?: boolean
          is_current?: boolean
          target_minutes?: number | null
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          is_completed?: boolean
          is_current?: boolean
          target_minutes?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      life_os_garden_slots: {
        Row: {
          growth_level: number
          id: string
          is_active: boolean
          last_updated: string
          slot_name: string
          user_id: string
        }
        Insert: {
          growth_level?: number
          id?: string
          is_active?: boolean
          last_updated?: string
          slot_name: string
          user_id: string
        }
        Update: {
          growth_level?: number
          id?: string
          is_active?: boolean
          last_updated?: string
          slot_name?: string
          user_id?: string
        }
        Relationships: []
      }
      life_os_habit_logs: {
        Row: {
          completed_at: string
          habit_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          habit_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          habit_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "life_os_habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "life_os_habits"
            referencedColumns: ["id"]
          },
        ]
      }
      life_os_habits: {
        Row: {
          created_at: string
          frequency: string
          icon: string | null
          id: string
          is_active: boolean
          last_completed_at: string | null
          name: string
          pillar_id: string
          streak_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          last_completed_at?: string | null
          name: string
          pillar_id: string
          streak_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          last_completed_at?: string | null
          name?: string
          pillar_id?: string
          streak_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "life_os_habits_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "life_os_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      life_os_mood_logs: {
        Row: {
          energy_level: number
          flow_state: string | null
          id: string
          logged_at: string
          notes: string | null
          user_id: string
        }
        Insert: {
          energy_level: number
          flow_state?: string | null
          id?: string
          logged_at?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          energy_level?: number
          flow_state?: string | null
          id?: string
          logged_at?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      life_os_pillars: {
        Row: {
          current_score: number
          id: string
          pillar_name: string
          target_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_score?: number
          id?: string
          pillar_name: string
          target_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_score?: number
          id?: string
          pillar_name?: string
          target_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      life_os_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          north_star_vision: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          north_star_vision?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          north_star_vision?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      life_os_vision_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          position: number
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          position?: number
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          position?: number
          user_id?: string
        }
        Relationships: []
      }
      linkedin_post_schedule: {
        Row: {
          content_preview: string
          created_at: string
          full_content: string | null
          id: string
          post_date: string
          published_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          content_preview: string
          created_at?: string
          full_content?: string | null
          id?: string
          post_date: string
          published_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          content_preview?: string
          created_at?: string
          full_content?: string | null
          id?: string
          post_date?: string
          published_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      manual_outreach_leads: {
        Row: {
          account_group: string
          company: string
          connection_status: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          linkedin_url: string
          location: string
          message_sent: string | null
          notes: string | null
          tier: number
          title: string
          updated_at: string
        }
        Insert: {
          account_group?: string
          company: string
          connection_status?: string
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          linkedin_url?: string
          location?: string
          message_sent?: string | null
          notes?: string | null
          tier?: number
          title: string
          updated_at?: string
        }
        Update: {
          account_group?: string
          company?: string
          connection_status?: string
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          linkedin_url?: string
          location?: string
          message_sent?: string | null
          notes?: string | null
          tier?: number
          title?: string
          updated_at?: string
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
      meditation_products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: string | null
          file_url: string | null
          id: string
          is_active: boolean
          price_zar: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          price_zar?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          price_zar?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      needs_analysis: {
        Row: {
          additional_notes: string | null
          company_name: string
          company_size: string
          contact_name: string
          contact_title: string | null
          created_at: string
          generated_summary: string | null
          id: string
          industry: string
          pain_points: Json
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          company_name: string
          company_size: string
          contact_name: string
          contact_title?: string | null
          created_at?: string
          generated_summary?: string | null
          id?: string
          industry: string
          pain_points?: Json
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          company_name?: string
          company_size?: string
          contact_name?: string
          contact_title?: string | null
          created_at?: string
          generated_summary?: string | null
          id?: string
          industry?: string
          pain_points?: Json
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_sends: {
        Row: {
          approval_status: string | null
          approval_token: string | null
          auto_generated: boolean | null
          body_html: string
          created_at: string
          id: string
          recipient_count: number | null
          research_sources: Json | null
          research_topic: string | null
          sent_at: string | null
          sent_by: string | null
          slack_click_alert_sent: boolean | null
          slack_open_alert_sent: boolean | null
          status: string
          subject: string
          tag_filter: string | null
        }
        Insert: {
          approval_status?: string | null
          approval_token?: string | null
          auto_generated?: boolean | null
          body_html: string
          created_at?: string
          id?: string
          recipient_count?: number | null
          research_sources?: Json | null
          research_topic?: string | null
          sent_at?: string | null
          sent_by?: string | null
          slack_click_alert_sent?: boolean | null
          slack_open_alert_sent?: boolean | null
          status?: string
          subject: string
          tag_filter?: string | null
        }
        Update: {
          approval_status?: string | null
          approval_token?: string | null
          auto_generated?: boolean | null
          body_html?: string
          created_at?: string
          id?: string
          recipient_count?: number | null
          research_sources?: Json | null
          research_topic?: string | null
          sent_at?: string | null
          sent_by?: string | null
          slack_click_alert_sent?: boolean | null
          slack_open_alert_sent?: boolean | null
          status?: string
          subject?: string
          tag_filter?: string | null
        }
        Relationships: []
      }
      newsletter_themes: {
        Row: {
          created_at: string
          featured_products: string[]
          id: string
          month: number
          pain_point_cluster: string
          theme: string
          year: number
        }
        Insert: {
          created_at?: string
          featured_products?: string[]
          id?: string
          month: number
          pain_point_cluster: string
          theme: string
          year: number
        }
        Update: {
          created_at?: string
          featured_products?: string[]
          id?: string
          month?: number
          pain_point_cluster?: string
          theme?: string
          year?: number
        }
        Relationships: []
      }
      newsletter_tracking: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          link_url: string | null
          newsletter_id: string | null
          recipient_email: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          link_url?: string | null
          newsletter_id?: string | null
          recipient_email: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          link_url?: string | null
          newsletter_id?: string | null
          recipient_email?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_tracking_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletter_sends"
            referencedColumns: ["id"]
          },
        ]
      }
      outstanding_items: {
        Row: {
          created_at: string
          id: string
          item: string
          priority: string
          resolved: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item: string
          priority?: string
          resolved?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item?: string
          priority?: string
          resolved?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      pipeline_deals: {
        Row: {
          assigned_to: string | null
          booked_at: string | null
          close_reason: string | null
          closed_at: string | null
          contacted_at: string | null
          created_at: string
          deal_value: number | null
          id: string
          lead_company: string | null
          lead_email: string | null
          lead_name: string | null
          lead_phone: string | null
          lead_score: number | null
          lead_source_id: string
          lead_source_table: string
          lead_temperature: string | null
          met_at: string | null
          notes: string | null
          proposal_sent_at: string | null
          stage: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          booked_at?: string | null
          close_reason?: string | null
          closed_at?: string | null
          contacted_at?: string | null
          created_at?: string
          deal_value?: number | null
          id?: string
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_score?: number | null
          lead_source_id: string
          lead_source_table: string
          lead_temperature?: string | null
          met_at?: string | null
          notes?: string | null
          proposal_sent_at?: string | null
          stage?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          booked_at?: string | null
          close_reason?: string | null
          closed_at?: string | null
          contacted_at?: string | null
          created_at?: string
          deal_value?: number | null
          id?: string
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_score?: number | null
          lead_source_id?: string
          lead_source_table?: string
          lead_temperature?: string | null
          met_at?: string | null
          notes?: string | null
          proposal_sent_at?: string | null
          stage?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_purchases: {
        Row: {
          amount_zar: number
          created_at: string
          email: string
          id: string
          name: string | null
          payment_reference: string | null
          product_name: string
          purchased_at: string
          upsell_converted: boolean | null
          upsell_shown: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          amount_zar?: number
          created_at?: string
          email: string
          id?: string
          name?: string | null
          payment_reference?: string | null
          product_name: string
          purchased_at?: string
          upsell_converted?: boolean | null
          upsell_shown?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          amount_zar?: number
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          payment_reference?: string | null
          product_name?: string
          purchased_at?: string
          upsell_converted?: boolean | null
          upsell_shown?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      prospect_companies: {
        Row: {
          about_summary: string | null
          company_name: string
          company_size: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_role: string | null
          contacted_at: string | null
          created_at: string
          engaged_at: string | null
          engagement_source: string | null
          hr_contacts: Json | null
          id: string
          industry: string | null
          industry_insight: string | null
          leadership_team: Json | null
          linkedin_url: string | null
          meeting_date: string | null
          meeting_notes: string | null
          meeting_outcome: string | null
          notes: string | null
          opportunity_signals: Json | null
          pain_points: Json | null
          personalised_pitch: string | null
          physical_address: string | null
          recommended_diagnostic: string | null
          recommended_product: string | null
          status: string
          suggested_approach: string | null
          updated_at: string
          website_url: string
        }
        Insert: {
          about_summary?: string | null
          company_name: string
          company_size?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_role?: string | null
          contacted_at?: string | null
          created_at?: string
          engaged_at?: string | null
          engagement_source?: string | null
          hr_contacts?: Json | null
          id?: string
          industry?: string | null
          industry_insight?: string | null
          leadership_team?: Json | null
          linkedin_url?: string | null
          meeting_date?: string | null
          meeting_notes?: string | null
          meeting_outcome?: string | null
          notes?: string | null
          opportunity_signals?: Json | null
          pain_points?: Json | null
          personalised_pitch?: string | null
          physical_address?: string | null
          recommended_diagnostic?: string | null
          recommended_product?: string | null
          status?: string
          suggested_approach?: string | null
          updated_at?: string
          website_url: string
        }
        Update: {
          about_summary?: string | null
          company_name?: string
          company_size?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_role?: string | null
          contacted_at?: string | null
          created_at?: string
          engaged_at?: string | null
          engagement_source?: string | null
          hr_contacts?: Json | null
          id?: string
          industry?: string | null
          industry_insight?: string | null
          leadership_team?: Json | null
          linkedin_url?: string | null
          meeting_date?: string | null
          meeting_notes?: string | null
          meeting_outcome?: string | null
          notes?: string | null
          opportunity_signals?: Json | null
          pain_points?: Json | null
          personalised_pitch?: string | null
          physical_address?: string | null
          recommended_diagnostic?: string | null
          recommended_product?: string | null
          status?: string
          suggested_approach?: string | null
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      prospect_outreach: {
        Row: {
          bounced_at: string | null
          created_at: string
          email_body: string
          email_subject: string
          id: string
          opened_at: string | null
          prospect_id: string | null
          replied_at: string | null
          sent_at: string | null
          sequence_step: number | null
          status: string
          template_used: string | null
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          bounced_at?: string | null
          created_at?: string
          email_body: string
          email_subject: string
          id?: string
          opened_at?: string | null
          prospect_id?: string | null
          replied_at?: string | null
          sent_at?: string | null
          sequence_step?: number | null
          status?: string
          template_used?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          bounced_at?: string | null
          created_at?: string
          email_body?: string
          email_subject?: string
          id?: string
          opened_at?: string | null
          prospect_id?: string | null
          replied_at?: string | null
          sent_at?: string | null
          sequence_step?: number | null
          status?: string
          template_used?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospect_outreach_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      prospect_sequences: {
        Row: {
          created_at: string | null
          id: string
          next_send_at: string | null
          original_subject: string | null
          paused_at: string | null
          prospect_id: string | null
          sequence_step: number | null
          status: string | null
          template_variant: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          next_send_at?: string | null
          original_subject?: string | null
          paused_at?: string | null
          prospect_id?: string | null
          sequence_step?: number | null
          status?: string | null
          template_variant?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          next_send_at?: string | null
          original_subject?: string | null
          paused_at?: string | null
          prospect_id?: string | null
          sequence_step?: number | null
          status?: string | null
          template_variant?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospect_sequences_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      prospecting_config: {
        Row: {
          company_size: string
          created_at: string
          id: string
          industry: string
          is_active: boolean
          last_run_at: string | null
          location: string
          updated_at: string
        }
        Insert: {
          company_size?: string
          created_at?: string
          id?: string
          industry: string
          is_active?: boolean
          last_run_at?: string | null
          location?: string
          updated_at?: string
        }
        Update: {
          company_size?: string
          created_at?: string
          id?: string
          industry?: string
          is_active?: boolean
          last_run_at?: string | null
          location?: string
          updated_at?: string
        }
        Relationships: []
      }
      prospecting_runs: {
        Row: {
          companies_discovered: number
          companies_researched: number
          companies_saved: number
          completed_at: string | null
          created_at: string
          errors: Json | null
          id: string
          run_details: Json | null
          started_at: string
          status: string
        }
        Insert: {
          companies_discovered?: number
          companies_researched?: number
          companies_saved?: number
          completed_at?: string | null
          created_at?: string
          errors?: Json | null
          id?: string
          run_details?: Json | null
          started_at?: string
          status?: string
        }
        Update: {
          companies_discovered?: number
          companies_researched?: number
          companies_saved?: number
          completed_at?: string | null
          created_at?: string
          errors?: Json | null
          id?: string
          run_details?: Json | null
          started_at?: string
          status?: string
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
      warm_lead_sequences: {
        Row: {
          booked_at: string | null
          contacted_at: string | null
          created_at: string
          dormant_at: string | null
          engaged_at: string | null
          id: string
          lead_company: string | null
          lead_email: string | null
          lead_name: string | null
          lead_phone: string | null
          lead_score: number | null
          lead_source_id: string
          lead_source_table: string
          lead_source_type: string | null
          lead_temperature: string | null
          next_reminder_at: string | null
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          booked_at?: string | null
          contacted_at?: string | null
          created_at?: string
          dormant_at?: string | null
          engaged_at?: string | null
          id?: string
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_score?: number | null
          lead_source_id: string
          lead_source_table: string
          lead_source_type?: string | null
          lead_temperature?: string | null
          next_reminder_at?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          booked_at?: string | null
          contacted_at?: string | null
          created_at?: string
          dormant_at?: string | null
          engaged_at?: string | null
          id?: string
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_score?: number | null
          lead_source_id?: string
          lead_source_table?: string
          lead_source_type?: string | null
          lead_temperature?: string | null
          next_reminder_at?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      warm_outreach_queue: {
        Row: {
          apollo_person_id: string | null
          booked_at: string | null
          company_name: string | null
          company_website: string | null
          contact_email: string | null
          contact_linkedin: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          created_at: string
          disqualified: boolean | null
          disqualified_reason: string | null
          email_body: string | null
          email_sent_at: string | null
          email_subject: string | null
          follow_up_body: string | null
          follow_up_sent_at: string | null
          id: string
          industry: string | null
          needs_day1: boolean
          reply_received: boolean | null
          score: number | null
          scrape_summary: string | null
          sequence_step: number | null
          source_keyword: string | null
          status: string
          step2_sent_at: string | null
          step3_sent_at: string | null
          step4_sent_at: string | null
          unsubscribed: boolean | null
          updated_at: string
        }
        Insert: {
          apollo_person_id?: string | null
          booked_at?: string | null
          company_name?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_linkedin?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string
          disqualified?: boolean | null
          disqualified_reason?: string | null
          email_body?: string | null
          email_sent_at?: string | null
          email_subject?: string | null
          follow_up_body?: string | null
          follow_up_sent_at?: string | null
          id?: string
          industry?: string | null
          needs_day1?: boolean
          reply_received?: boolean | null
          score?: number | null
          scrape_summary?: string | null
          sequence_step?: number | null
          source_keyword?: string | null
          status?: string
          step2_sent_at?: string | null
          step3_sent_at?: string | null
          step4_sent_at?: string | null
          unsubscribed?: boolean | null
          updated_at?: string
        }
        Update: {
          apollo_person_id?: string | null
          booked_at?: string | null
          company_name?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_linkedin?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string
          disqualified?: boolean | null
          disqualified_reason?: string | null
          email_body?: string | null
          email_sent_at?: string | null
          email_subject?: string | null
          follow_up_body?: string | null
          follow_up_sent_at?: string | null
          id?: string
          industry?: string | null
          needs_day1?: boolean
          reply_received?: boolean | null
          score?: number | null
          scrape_summary?: string | null
          sequence_step?: number | null
          source_keyword?: string | null
          status?: string
          step2_sent_at?: string | null
          step3_sent_at?: string | null
          step4_sent_at?: string | null
          unsubscribed?: boolean | null
          updated_at?: string
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
      app_role: "admin" | "user" | "call_centre"
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
      app_role: ["admin", "user", "call_centre"],
    },
  },
} as const
