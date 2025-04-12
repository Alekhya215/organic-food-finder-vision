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
      certification_sources: {
        Row: {
          description: string | null
          id: number
          name: string
          website: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          website?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      food_categories: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          barcode: string | null
          brand: string | null
          category_id: number | null
          created_at: string | null
          growth_conditions: string | null
          id: string
          ingredients: string | null
          is_organic: boolean | null
          name: string
          organic_cultivation: string | null
          origin: string | null
          season: string | null
          updated_at: string | null
          variety: string | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category_id?: number | null
          created_at?: string | null
          growth_conditions?: string | null
          id?: string
          ingredients?: string | null
          is_organic?: boolean | null
          name: string
          organic_cultivation?: string | null
          origin?: string | null
          season?: string | null
          updated_at?: string | null
          variety?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category_id?: number | null
          created_at?: string | null
          growth_conditions?: string | null
          id?: string
          ingredients?: string | null
          is_organic?: boolean | null
          name?: string
          organic_cultivation?: string | null
          origin?: string | null
          season?: string | null
          updated_at?: string | null
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrients: {
        Row: {
          daily_value_percent: number | null
          food_id: string | null
          id: number
          nutrient_name: string
          unit: string | null
          value: string | null
        }
        Insert: {
          daily_value_percent?: number | null
          food_id?: string | null
          id?: number
          nutrient_name: string
          unit?: string | null
          value?: string | null
        }
        Update: {
          daily_value_percent?: number | null
          food_id?: string | null
          id?: number
          nutrient_name?: string
          unit?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrients_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      organic_verifications: {
        Row: {
          certification_date: string | null
          certification_id: string | null
          food_id: string | null
          id: number
          is_verified: boolean
          notes: string | null
          source_id: number | null
        }
        Insert: {
          certification_date?: string | null
          certification_id?: string | null
          food_id?: string | null
          id?: number
          is_verified: boolean
          notes?: string | null
          source_id?: number | null
        }
        Update: {
          certification_date?: string | null
          certification_id?: string | null
          food_id?: string | null
          id?: number
          is_verified?: boolean
          notes?: string | null
          source_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organic_verifications_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organic_verifications_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "certification_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      preservation_guidelines: {
        Row: {
          food_id: string | null
          id: number
          refrigerated_duration: string | null
          room_temp_duration: string | null
          storage_method: string | null
          tips: string | null
        }
        Insert: {
          food_id?: string | null
          id?: number
          refrigerated_duration?: string | null
          room_temp_duration?: string | null
          storage_method?: string | null
          tips?: string | null
        }
        Update: {
          food_id?: string | null
          id?: number
          refrigerated_duration?: string | null
          room_temp_duration?: string | null
          storage_method?: string | null
          tips?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preservation_guidelines_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
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
    Enums: {},
  },
} as const
