export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'reviewer' | 'analyst' | 'growth_lead' | 'viewer'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'reviewer' | 'analyst' | 'growth_lead' | 'viewer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'reviewer' | 'analyst' | 'growth_lead' | 'viewer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      salons: {
        Row: {
          id: string
          name: string
          brand_name: string | null
          website: string | null
          phone: string | null
          email: string | null
          status: 'draft' | 'enriching' | 'scoring' | 'review' | 'approved' | 'rejected' | 'on_hold'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand_name?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          status?: 'draft' | 'enriching' | 'scoring' | 'review' | 'approved' | 'rejected' | 'on_hold'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand_name?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          status?: 'draft' | 'enriching' | 'scoring' | 'review' | 'approved' | 'rejected' | 'on_hold'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      salon_locations: {
        Row: {
          id: string
          salon_id: string
          address_line1: string
          address_line2: string | null
          city: string
          state_province: string
          postal_code: string | null
          country: string
          latitude: number | null
          longitude: number | null
          neighborhood: string | null
          is_primary: boolean
          location_type: string | null
          opened_date: string | null
          square_footage: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          address_line1: string
          address_line2?: string | null
          city: string
          state_province: string
          postal_code?: string | null
          country?: string
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          is_primary?: boolean
          location_type?: string | null
          opened_date?: string | null
          square_footage?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state_province?: string
          postal_code?: string | null
          country?: string
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          is_primary?: boolean
          location_type?: string | null
          opened_date?: string | null
          square_footage?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      data_sources: {
        Row: {
          id: string
          name: string
          type: 'manual' | 'google_places' | 'yelp' | 'instagram' | 'website' | 'booking_platform' | 'other'
          config: Json
          is_active: boolean
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'manual' | 'google_places' | 'yelp' | 'instagram' | 'website' | 'booking_platform' | 'other'
          config?: Json
          is_active?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'manual' | 'google_places' | 'yelp' | 'instagram' | 'website' | 'booking_platform' | 'other'
          config?: Json
          is_active?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      salon_signals: {
        Row: {
          id: string
          salon_id: string
          location_id: string | null
          data_source_id: string | null
          signal_type: string
          signal_category: 'luxury_aesthetic' | 'revenue_likelihood' | 'retail_readiness' | 'wellness_alignment' | 'growth_potential' | 'digital_presence' | 'partnership_fit'
          raw_value: Json
          normalized_value: number | null
          confidence_score: number
          collected_at: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          location_id?: string | null
          data_source_id?: string | null
          signal_type: string
          signal_category: 'luxury_aesthetic' | 'revenue_likelihood' | 'retail_readiness' | 'wellness_alignment' | 'growth_potential' | 'digital_presence' | 'partnership_fit'
          raw_value: Json
          normalized_value?: number | null
          confidence_score?: number
          collected_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          location_id?: string | null
          data_source_id?: string | null
          signal_type?: string
          signal_category?: 'luxury_aesthetic' | 'revenue_likelihood' | 'retail_readiness' | 'wellness_alignment' | 'growth_potential' | 'digital_presence' | 'partnership_fit'
          raw_value?: Json
          normalized_value?: number | null
          confidence_score?: number
          collected_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      salon_scores: {
        Row: {
          id: string
          salon_id: string
          luxury_aesthetic_score: number | null
          revenue_likelihood_score: number | null
          retail_readiness_score: number | null
          wellness_alignment_score: number | null
          growth_potential_score: number | null
          digital_presence_score: number | null
          partnership_fit_score: number | null
          total_score: number
          score_version: string
          computed_at: string
          computed_by: string | null
          is_current: boolean
          manual_adjustment: number
          adjustment_reason: string | null
          adjusted_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          luxury_aesthetic_score?: number | null
          revenue_likelihood_score?: number | null
          retail_readiness_score?: number | null
          wellness_alignment_score?: number | null
          growth_potential_score?: number | null
          digital_presence_score?: number | null
          partnership_fit_score?: number | null
          total_score: number
          score_version?: string
          computed_at?: string
          computed_by?: string | null
          is_current?: boolean
          manual_adjustment?: number
          adjustment_reason?: string | null
          adjusted_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          luxury_aesthetic_score?: number | null
          revenue_likelihood_score?: number | null
          retail_readiness_score?: number | null
          wellness_alignment_score?: number | null
          growth_potential_score?: number | null
          digital_presence_score?: number | null
          partnership_fit_score?: number | null
          total_score?: number
          score_version?: string
          computed_at?: string
          computed_by?: string | null
          is_current?: boolean
          manual_adjustment?: number
          adjustment_reason?: string | null
          adjusted_by?: string | null
          created_at?: string
        }
      }
      salon_score_reasons: {
        Row: {
          id: string
          score_id: string
          category: 'luxury_aesthetic' | 'revenue_likelihood' | 'retail_readiness' | 'wellness_alignment' | 'growth_potential' | 'digital_presence' | 'partnership_fit'
          reason_type: string
          reason_text: string
          impact_value: number | null
          signal_ids: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          score_id: string
          category: 'luxury_aesthetic' | 'revenue_likelihood' | 'retail_readiness' | 'wellness_alignment' | 'growth_potential' | 'digital_presence' | 'partnership_fit'
          reason_type: string
          reason_text: string
          impact_value?: number | null
          signal_ids?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          score_id?: string
          category?: 'luxury_aesthetic' | 'revenue_likelihood' | 'retail_readiness' | 'wellness_alignment' | 'growth_potential' | 'digital_presence' | 'partnership_fit'
          reason_type?: string
          reason_text?: string
          impact_value?: number | null
          signal_ids?: string[] | null
          created_at?: string
        }
      }
      review_queue: {
        Row: {
          id: string
          salon_id: string
          score_id: string | null
          assigned_to: string | null
          priority: number
          decision: 'approve' | 'reject' | 'hold' | 'request_info' | null
          decision_made_by: string | null
          decision_made_at: string | null
          internal_notes: string | null
          decision_rationale: string | null
          follow_up_required: boolean
          follow_up_date: string | null
          added_to_queue_at: string
          review_started_at: string | null
          review_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          score_id?: string | null
          assigned_to?: string | null
          priority?: number
          decision?: 'approve' | 'reject' | 'hold' | 'request_info' | null
          decision_made_by?: string | null
          decision_made_at?: string | null
          internal_notes?: string | null
          decision_rationale?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          added_to_queue_at?: string
          review_started_at?: string | null
          review_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          score_id?: string | null
          assigned_to?: string | null
          priority?: number
          decision?: 'approve' | 'reject' | 'hold' | 'request_info' | null
          decision_made_by?: string | null
          decision_made_at?: string | null
          internal_notes?: string | null
          decision_rationale?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          added_to_queue_at?: string
          review_started_at?: string | null
          review_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      outreach_profiles: {
        Row: {
          id: string
          salon_id: string
          review_id: string | null
          executive_summary: string
          key_strengths: Json
          partnership_angle: string
          suggested_approach: string
          primary_contact_method: string | null
          best_time_to_contact: string | null
          decision_maker_profile: Json | null
          tier: string | null
          expected_ltv: number | null
          urgency_level: number
          outreach_status: string
          last_contact_date: string | null
          next_follow_up_date: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          salon_id: string
          review_id?: string | null
          executive_summary: string
          key_strengths: Json
          partnership_angle: string
          suggested_approach: string
          primary_contact_method?: string | null
          best_time_to_contact?: string | null
          decision_maker_profile?: Json | null
          tier?: string | null
          expected_ltv?: number | null
          urgency_level?: number
          outreach_status?: string
          last_contact_date?: string | null
          next_follow_up_date?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          salon_id?: string
          review_id?: string | null
          executive_summary?: string
          key_strengths?: Json
          partnership_angle?: string
          suggested_approach?: string
          primary_contact_method?: string | null
          best_time_to_contact?: string | null
          decision_maker_profile?: Json | null
          tier?: string | null
          expected_ltv?: number | null
          urgency_level?: number
          outreach_status?: string
          last_contact_date?: string | null
          next_follow_up_date?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compute_weighted_score: {
        Args: {
          p_luxury: number
          p_revenue: number
          p_retail: number
          p_wellness: number
          p_growth: number
          p_digital: number
          p_partnership: number
        }
        Returns: number
      }
    }
    Enums: {
      user_role: 'admin' | 'reviewer' | 'analyst' | 'growth_lead' | 'viewer'
      salon_status: 'draft' | 'enriching' | 'scoring' | 'review' | 'approved' | 'rejected' | 'on_hold'
      data_source_type: 'manual' | 'google_places' | 'yelp' | 'instagram' | 'website' | 'booking_platform' | 'other'
      signal_category: 'luxury_aesthetic' | 'revenue_likelihood' | 'retail_readiness' | 'wellness_alignment' | 'growth_potential' | 'digital_presence' | 'partnership_fit'
      review_decision: 'approve' | 'reject' | 'hold' | 'request_info'
    }
  }
}