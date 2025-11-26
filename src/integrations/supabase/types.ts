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
      artisan_profiles: {
        Row: {
          certification_level: string | null
          craft_type: string
          created_at: string | null
          id: string
          rating: number | null
          specialties: string[] | null
          story: string | null
          total_reviews: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          video_url: string | null
          workshop_location: string | null
          years_of_experience: number | null
        }
        Insert: {
          certification_level?: string | null
          craft_type: string
          created_at?: string | null
          id?: string
          rating?: number | null
          specialties?: string[] | null
          story?: string | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
          workshop_location?: string | null
          years_of_experience?: number | null
        }
        Update: {
          certification_level?: string | null
          craft_type?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          specialties?: string[] | null
          story?: string | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
          workshop_location?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artisan_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          artisan_id: string
          buyer_id: string
          created_at: string | null
          id: string
          notes: string | null
          product_id: string
          quantity: number
          shipping_address: Json
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          artisan_id: string
          buyer_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id: string
          quantity?: number
          shipping_address: Json
          status: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          artisan_id?: string
          buyer_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          shipping_address?: Json
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisan_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_certificates: {
        Row: {
          certificate_hash: string
          created_at: string
          id: string
          is_active: boolean
          issue_date: string
          issuer_id: string
          product_id: string
          verification_criteria: Json
        }
        Insert: {
          certificate_hash: string
          created_at?: string
          id?: string
          is_active?: boolean
          issue_date?: string
          issuer_id: string
          product_id: string
          verification_criteria?: Json
        }
        Update: {
          certificate_hash?: string
          created_at?: string
          id?: string
          is_active?: boolean
          issue_date?: string
          issuer_id?: string
          product_id?: string
          verification_criteria?: Json
        }
        Relationships: [
          {
            foreignKeyName: "product_certificates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          artisan_id: string
          category: string
          created_at: string | null
          currency: string | null
          description: string
          dimensions: string | null
          favorites: number | null
          id: string
          images: string[]
          is_available: boolean | null
          is_featured: boolean | null
          materials: string[] | null
          price: number
          provenance_data: Json | null
          stock_quantity: number | null
          story: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          video_url: string | null
          views: number | null
          weight: string | null
        }
        Insert: {
          artisan_id: string
          category: string
          created_at?: string | null
          currency?: string | null
          description: string
          dimensions?: string | null
          favorites?: number | null
          id?: string
          images: string[]
          is_available?: boolean | null
          is_featured?: boolean | null
          materials?: string[] | null
          price: number
          provenance_data?: Json | null
          stock_quantity?: number | null
          story?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
          weight?: string | null
        }
        Update: {
          artisan_id?: string
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string
          dimensions?: string | null
          favorites?: number | null
          id?: string
          images?: string[]
          is_available?: boolean | null
          is_featured?: boolean | null
          materials?: string[] | null
          price?: number
          provenance_data?: Json | null
          stock_quantity?: number | null
          story?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisan_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          languages: string[] | null
          location: string | null
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          languages?: string[] | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          created_at: string | null
          id: string
          images: string[] | null
          product_id: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          product_id: string
          rating: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          product_id?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_product_originality: {
        Args: { p_artisan_id: string; p_description: string; p_title: string }
        Returns: boolean
      }
      generate_certificate_hash: {
        Args: { p_issuer_id: string; p_product_id: string; p_timestamp: string }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
