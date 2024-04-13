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
      days: {
        Row: {
          day_id: string
          day_number: number | null
          plan_id: string
        }
        Insert: {
          day_id?: string
          day_number?: number | null
          plan_id: string
        }
        Update: {
          day_id?: string
          day_number?: number | null
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      images: {
        Row: {
          height: number | null
          id: string
          recipe_id: string
          source: string | null
          source_url: string | null
          title: string | null
          url: string | null
          width: number | null
        }
        Insert: {
          height?: number | null
          id?: string
          recipe_id: string
          source?: string | null
          source_url?: string | null
          title?: string | null
          url?: string | null
          width?: number | null
        }
        Update: {
          height?: number | null
          id?: string
          recipe_id?: string
          source?: string | null
          source_url?: string | null
          title?: string | null
          url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          amount: number
          id: string
          name: string | null
          recipe_id: string
          unit: string | null
        }
        Insert: {
          amount: number
          id?: string
          name?: string | null
          recipe_id: string
          unit?: string | null
        }
        Update: {
          amount?: number
          id?: string
          name?: string | null
          recipe_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          plan_date: string | null
          plan_id: string
          user_id: string
        }
        Insert: {
          plan_date?: string | null
          plan_id?: string
          user_id: string
        }
        Update: {
          plan_date?: string | null
          plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          day_id: string
          meal_id: string
          meal_number: number | null
          recipe_id: string | null
        }
        Insert: {
          day_id: string
          meal_id?: string
          meal_number?: number | null
          recipe_id?: string | null
        }
        Update: {
          day_id?: string
          meal_id?: string
          meal_number?: number | null
          recipe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "days"
            referencedColumns: ["day_id"]
          },
          {
            foreignKeyName: "meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition: {
        Row: {
          calories_per_serving: number | null
          carbohydrates: number | null
          fat: number | null
          id: string
          protein: number | null
          recipe_id: string
          servings: number | null
        }
        Insert: {
          calories_per_serving?: number | null
          carbohydrates?: number | null
          fat?: number | null
          id?: string
          protein?: number | null
          recipe_id: string
          servings?: number | null
        }
        Update: {
          calories_per_serving?: number | null
          carbohydrates?: number | null
          fat?: number | null
          id?: string
          protein?: number | null
          recipe_id?: string
          servings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cuisine: string | null
          id: string
          name: string
        }
        Insert: {
          cuisine?: string | null
          id?: string
          name: string
        }
        Update: {
          cuisine?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      steps: {
        Row: {
          description: string | null
          id: string
          recipe_id: string
          step_order: number | null
        }
        Insert: {
          description?: string | null
          id?: string
          recipe_id: string
          step_order?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          recipe_id?: string
          step_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          id: string
          username: string | null
        }
        Insert: {
          email?: string | null
          id: string
          username?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
