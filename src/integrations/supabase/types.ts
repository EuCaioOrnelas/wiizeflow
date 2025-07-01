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
      account_creation_tracking: {
        Row: {
          created_at: string | null
          email: string
          fingerprint: string | null
          id: string
          ip_address: unknown
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          fingerprint?: string | null
          id?: string
          ip_address: unknown
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          fingerprint?: string | null
          id?: string
          ip_address?: unknown
          user_id?: string | null
        }
        Relationships: []
      }
      admin_templates: {
        Row: {
          canvas_data: Json | null
          cover_image_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          preview_url: string | null
          template_file_url: string | null
          updated_at: string
        }
        Insert: {
          canvas_data?: Json | null
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          preview_url?: string | null
          template_file_url?: string | null
          updated_at?: string
        }
        Update: {
          canvas_data?: Json | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          preview_url?: string | null
          template_file_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      avisos: {
        Row: {
          ativo: boolean
          created_by: string | null
          data_criacao: string
          descricao: string
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_by?: string | null
          data_criacao?: string
          descricao: string
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_by?: string | null
          data_criacao?: string
          descricao?: string
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_shares: {
        Row: {
          allow_download: boolean
          created_at: string
          funnel_id: string
          id: string
          owner_id: string
          share_token: string
          updated_at: string
        }
        Insert: {
          allow_download?: boolean
          created_at?: string
          funnel_id: string
          id?: string
          owner_id: string
          share_token: string
          updated_at?: string
        }
        Update: {
          allow_download?: boolean
          created_at?: string
          funnel_id?: string
          id?: string
          owner_id?: string
          share_token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_shares_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_shares: {
        Row: {
          allow_download: boolean
          created_at: string | null
          funnel_id: string
          id: string
          owner_id: string
          share_token: string
          updated_at: string | null
        }
        Insert: {
          allow_download?: boolean
          created_at?: string | null
          funnel_id: string
          id?: string
          owner_id: string
          share_token: string
          updated_at?: string | null
        }
        Update: {
          allow_download?: boolean
          created_at?: string | null
          funnel_id?: string
          id?: string
          owner_id?: string
          share_token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_shares_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funnel_shares_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      funnels: {
        Row: {
          canvas_data: Json | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          canvas_data?: Json | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          canvas_data?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "funnels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      node_metrics: {
        Row: {
          calculation_result: number | null
          calculation_type:
            | Database["public"]["Enums"]["calculation_type"]
            | null
          created_at: string
          funnel_id: string
          id: string
          metric_category: Database["public"]["Enums"]["metric_category"]
          metric_date: string
          metric_value: number
          node_id: string
          notes: string | null
          source_node_id: string | null
          target_node_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calculation_result?: number | null
          calculation_type?:
            | Database["public"]["Enums"]["calculation_type"]
            | null
          created_at?: string
          funnel_id: string
          id?: string
          metric_category: Database["public"]["Enums"]["metric_category"]
          metric_date?: string
          metric_value: number
          node_id: string
          notes?: string | null
          source_node_id?: string | null
          target_node_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calculation_result?: number | null
          calculation_type?:
            | Database["public"]["Enums"]["calculation_type"]
            | null
          created_at?: string
          funnel_id?: string
          id?: string
          metric_category?: Database["public"]["Enums"]["metric_category"]
          metric_date?: string
          metric_value?: number
          node_id?: string
          notes?: string | null
          source_node_id?: string | null
          target_node_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "node_metrics_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          customer_email: string
          id: string
          plan_name: string | null
          price_id: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_email: string
          id?: string
          plan_name?: string | null
          price_id?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string
          id?: string
          plan_name?: string | null
          price_id?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_failures: {
        Row: {
          created_at: string | null
          failure_date: string | null
          failure_reason: string | null
          id: string
          resolved: boolean | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          failure_date?: string | null
          failure_reason?: string | null
          id?: string
          resolved?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          failure_date?: string | null
          failure_reason?: string | null
          id?: string
          resolved?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          annual_amount: number | null
          avatar_url: string | null
          cookies_accepted: boolean | null
          created_at: string | null
          email: string | null
          exclude_from_revenue: boolean | null
          free_trial_expires_at: string | null
          free_trial_started_at: string | null
          funnel_count: number | null
          id: string
          monthly_amount: number | null
          name: string | null
          plan_type: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_expires_at: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          annual_amount?: number | null
          avatar_url?: string | null
          cookies_accepted?: boolean | null
          created_at?: string | null
          email?: string | null
          exclude_from_revenue?: boolean | null
          free_trial_expires_at?: string | null
          free_trial_started_at?: string | null
          funnel_count?: number | null
          id: string
          monthly_amount?: number | null
          name?: string | null
          plan_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_amount?: number | null
          avatar_url?: string | null
          cookies_accepted?: boolean | null
          created_at?: string | null
          email?: string | null
          exclude_from_revenue?: boolean | null
          free_trial_expires_at?: string | null
          free_trial_started_at?: string | null
          funnel_count?: number | null
          id?: string
          monthly_amount?: number | null
          name?: string | null
          plan_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      track_events: {
        Row: {
          bloco_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          timestamp: string
          tipo: string
          url: string | null
          user_agent: string | null
        }
        Insert: {
          bloco_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          timestamp?: string
          tipo: string
          url?: string | null
          user_agent?: string | null
        }
        Update: {
          bloco_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          timestamp?: string
          tipo?: string
          url?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          last_activity: string
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity?: string
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity?: string
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_expired_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      check_ip_account_limit: {
        Args: { client_ip: unknown }
        Returns: number
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          online_users: number
          total_users: number
          free_users: number
          monthly_users: number
          annual_users: number
          projected_monthly_revenue: number
        }[]
      }
      get_block_tracking_stats: {
        Args: { block_id: string }
        Returns: {
          tipo: string
          count: number
          last_event: string
        }[]
      }
      get_engagement_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          dau: number
          wau: number
          mau: number
          users_with_funnels: number
          total_active_users: number
          freemium_to_paid_rate: number
          retention_30_days: number
          monthly_churn_rate: number
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_duplicate_event: {
        Args: {
          block_id: string
          event_type: string
          client_ip: unknown
          time_window?: unknown
        }
        Returns: boolean
      }
      is_free_trial_expired: {
        Args: { user_id: string }
        Returns: boolean
      }
      process_stripe_webhook: {
        Args: {
          event_type: string
          customer_email: string
          customer_id: string
          subscription_id: string
          price_id: string
          session_id?: string
        }
        Returns: Json
      }
      sync_existing_users: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
      verify_payment_status: {
        Args: { session_id_param: string }
        Returns: Json
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
      calculation_type:
        | "taxa_conversao"
        | "taxa_qualificacao_leads"
        | "taxa_oportunidades_mql"
        | "taxa_fechamento"
        | "taxa_churn"
        | "taxa_retencao"
        | "taxa_recompra"
        | "taxa_resposta_vendas"
        | "taxa_follow_up"
      metric_category:
        | "visitantes_unicos"
        | "cliques"
        | "lead_capturado"
        | "oportunidades"
        | "vendas_realizadas"
        | "pos_venda"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "moderator"],
      calculation_type: [
        "taxa_conversao",
        "taxa_qualificacao_leads",
        "taxa_oportunidades_mql",
        "taxa_fechamento",
        "taxa_churn",
        "taxa_retencao",
        "taxa_recompra",
        "taxa_resposta_vendas",
        "taxa_follow_up",
      ],
      metric_category: [
        "visitantes_unicos",
        "cliques",
        "lead_capturado",
        "oportunidades",
        "vendas_realizadas",
        "pos_venda",
      ],
    },
  },
} as const
