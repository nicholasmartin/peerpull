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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      feedback_requests: {
        Row: {
          categories: string[] | null
          claimed_at: string | null
          created_at: string | null
          description: string | null
          focus_areas: string[] | null
          id: string
          questions: string[] | null
          queue_position: number | null
          requeue_count: number | null
          stage: string | null
          status: string
          timeout_queue_position: number | null
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          categories?: string[] | null
          claimed_at?: string | null
          created_at?: string | null
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          questions?: string[] | null
          queue_position?: number | null
          requeue_count?: number | null
          stage?: string | null
          status?: string
          timeout_queue_position?: number | null
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          categories?: string[] | null
          claimed_at?: string | null
          created_at?: string | null
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          questions?: string[] | null
          queue_position?: number | null
          requeue_count?: number | null
          stage?: string | null
          status?: string
          timeout_queue_position?: number | null
          title?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      peer_point_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          expertise: string[] | null
          first_name: string | null
          full_name: string | null
          id: string
          invited_by: string | null
          is_admin: boolean | null
          last_name: string | null
          peer_points_balance: number | null
          referral_code: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          expertise?: string[] | null
          first_name?: string | null
          full_name?: string | null
          id: string
          invited_by?: string | null
          is_admin?: boolean | null
          last_name?: string | null
          peer_points_balance?: number | null
          referral_code?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          expertise?: string[] | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          invited_by?: string | null
          is_admin?: boolean | null
          last_name?: string | null
          peer_points_balance?: number | null
          referral_code?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      referral_code_history: {
        Row: {
          id: string
          old_code: string
          replaced_at: string
          user_id: string
        }
        Insert: {
          id?: string
          old_code: string
          replaced_at?: string
          user_id: string
        }
        Update: {
          id?: string
          old_code?: string
          replaced_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_awarded: number | null
          created_at: string | null
          id: string
          invitee_id: string
          inviter_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          bonus_awarded?: number | null
          created_at?: string | null
          id?: string
          invitee_id: string
          inviter_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          bonus_awarded?: number | null
          created_at?: string | null
          id?: string
          invitee_id?: string
          inviter_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_invitee_id_profiles_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_inviter_id_profiles_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          feedback_request_id: string
          id: string
          improvements: string | null
          rating: number | null
          reviewer_id: string
          status: string
          strengths: string | null
          submitted_at: string | null
          video_duration: number | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_request_id: string
          id?: string
          improvements?: string | null
          rating?: number | null
          reviewer_id: string
          status?: string
          strengths?: string | null
          submitted_at?: string | null
          video_duration?: number | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_request_id?: string
          id?: string
          improvements?: string | null
          rating?: number | null
          reviewer_id?: string
          status?: string
          strengths?: string | null
          submitted_at?: string | null
          video_duration?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_pull_request_id_fkey"
            columns: ["feedback_request_id"]
            isOneToOne: false
            referencedRelation: "feedback_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          description: string | null
          key: string
          label: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          category: string
          description?: string | null
          key: string
          label: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          category?: string
          description?: string | null
          key?: string
          label?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_inject_points: {
        Args: {
          p_admin_id: string
          p_amount: number
          p_reason?: string
          p_target_user_id: string
        }
        Returns: undefined
      }
      assign_queue_position: { Args: { p_pr_id: string }; Returns: undefined }
      award_review_point: {
        Args: { p_review_id: string; p_reviewer_id: string }
        Returns: undefined
      }
      change_referral_code: {
        Args: { p_new_code: string; p_user_id: string }
        Returns: undefined
      }
      complete_review_and_charge: {
        Args: { p_review_id: string; p_reviewer_id: string }
        Returns: undefined
      }
      get_next_review: {
        Args: { p_reviewer_id: string }
        Returns: {
          pr_id: string
          review_id: string
        }[]
      }
      get_setting: { Args: { p_key: string }; Returns: string }
      redeem_referral: {
        Args: { p_code: string; p_new_user_id: string }
        Returns: undefined
      }
      submit_review_atomic: {
        Args: {
          p_improvements?: string
          p_rating: number
          p_review_id: string
          p_reviewer_id: string
          p_strengths?: string
          p_video_duration: number
          p_video_url: string
        }
        Returns: undefined
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
