export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ─────────────────────────────────────────────────────────────────────────────
// Ingredient / Step / Media row shapes used inside public_dish_details JSON
// ─────────────────────────────────────────────────────────────────────────────

export interface DishIngredientJson {
  id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  preparation_note: string | null;
  display_order: number;
}

export interface DishStepJson {
  id: string;
  title: string | null;
  instruction: string;
  time_hint: string | null;
  image_path: string | null;
  display_order: number;
}

export interface DishMediaJson {
  id: string;
  media_type: "image" | "video" | "thumbnail";
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  is_primary: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Database interface — mirrors the Supabase/Postgres schema
// ─────────────────────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      // ── profiles ────────────────────────────────────────────────────────────
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: string;
          created_at?: string;
        };
      };

      // ── stations ────────────────────────────────────────────────────────────
      stations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ── categories ──────────────────────────────────────────────────────────
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cover_image_path: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cover_image_path?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          cover_image_path?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ── dishes ──────────────────────────────────────────────────────────────
      dishes: {
        Row: {
          id: string;
          category_id: string;
          station_id: string;
          name: string;
          slug: string;
          short_description: string | null;
          yield_info: string | null;
          plating_notes: string | null;
          prep_time_minutes: number | null;
          serves_quantity: number | null;
          hero_image_path: string | null;
          thumbnail_path: string | null;
          is_published: boolean;
          is_active: boolean;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          station_id: string;
          name: string;
          slug: string;
          short_description?: string | null;
          yield_info?: string | null;
          plating_notes?: string | null;
          prep_time_minutes?: number | null;
          serves_quantity?: number | null;
          hero_image_path?: string | null;
          thumbnail_path?: string | null;
          is_published?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          station_id?: string;
          name?: string;
          slug?: string;
          short_description?: string | null;
          yield_info?: string | null;
          plating_notes?: string | null;
          prep_time_minutes?: number | null;
          serves_quantity?: number | null;
          hero_image_path?: string | null;
          thumbnail_path?: string | null;
          is_published?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ── dish_ingredients ────────────────────────────────────────────────────
      dish_ingredients: {
        Row: {
          id: string;
          dish_id: string;
          ingredient_name: string;
          quantity: number;
          unit: string;
          preparation_note: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          dish_id: string;
          ingredient_name: string;
          quantity: number;
          unit: string;
          preparation_note?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          dish_id?: string;
          ingredient_name?: string;
          quantity?: number;
          unit?: string;
          preparation_note?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };

      // ── dish_steps ──────────────────────────────────────────────────────────
      dish_steps: {
        Row: {
          id: string;
          dish_id: string;
          title: string | null;
          instruction: string;
          time_hint: string | null;
          image_path: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          dish_id: string;
          title?: string | null;
          instruction: string;
          time_hint?: string | null;
          image_path?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          dish_id?: string;
          title?: string | null;
          instruction?: string;
          time_hint?: string | null;
          image_path?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };

      // ── dish_media ──────────────────────────────────────────────────────────
      dish_media: {
        Row: {
          id: string;
          dish_id: string;
          media_type: "image" | "video" | "thumbnail";
          storage_bucket: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          file_size_bytes: number | null;
          duration_seconds: number | null;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          dish_id: string;
          media_type: "image" | "video" | "thumbnail";
          storage_bucket: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          file_size_bytes?: number | null;
          duration_seconds?: number | null;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          dish_id?: string;
          media_type?: "image" | "video" | "thumbnail";
          storage_bucket?: string;
          storage_path?: string;
          file_name?: string;
          mime_type?: string;
          file_size_bytes?: number | null;
          duration_seconds?: number | null;
          is_primary?: boolean;
          created_at?: string;
        };
      };

      // ── mise_en_place_checklists ─────────────────────────────────────────────
      mise_en_place_checklists: {
        Row: {
          id: string;
          station_id: string;
          title: string;
          description: string | null;
          shift: "abertura" | "producao" | "fechamento";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          station_id: string;
          title: string;
          description?: string | null;
          shift: "abertura" | "producao" | "fechamento";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          station_id?: string;
          title?: string;
          description?: string | null;
          shift?: "abertura" | "producao" | "fechamento";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ── mise_en_place_items ──────────────────────────────────────────────────
      mise_en_place_items: {
        Row: {
          id: string;
          checklist_id: string;
          item_label: string;
          item_description: string | null;
          display_order: number;
          is_required: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          checklist_id: string;
          item_label: string;
          item_description?: string | null;
          display_order?: number;
          is_required?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          checklist_id?: string;
          item_label?: string;
          item_description?: string | null;
          display_order?: number;
          is_required?: boolean;
          created_at?: string;
        };
      };
    };

    // ── Views ──────────────────────────────────────────────────────────────────
    Views: {
      // Listagem rápida de pratos para a galeria
      public_dish_cards: {
        Row: {
          dish_id: string;
          dish_name: string;
          dish_slug: string;
          category_id: string;
          category_name: string;
          category_slug: string;
          station_id: string;
          station_name: string;
          station_slug: string;
          thumbnail_path: string | null;
          short_description: string | null;
        };
      };

      // Ficha técnica completa com ingredientes, passos e mídias agregados
      public_dish_details: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          yield_info: string | null;
          plating_notes: string | null;
          prep_time_minutes: number | null;
          serves_quantity: number | null;
          hero_image_path: string | null;
          thumbnail_path: string | null;
          created_at: string;
          updated_at: string;
          category_id: string;
          category_name: string;
          category_slug: string;
          station_id: string;
          station_name: string;
          station_slug: string;
          /** JSON array of DishIngredientJson, ordered by display_order */
          ingredients: DishIngredientJson[];
          /** JSON array of DishStepJson, ordered by display_order */
          steps: DishStepJson[];
          /** JSON array of DishMediaJson, primary first */
          media: DishMediaJson[];
        };
      };
    };

    // ── Functions ──────────────────────────────────────────────────────────────
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };

    Enums: {};
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience type aliases
// ─────────────────────────────────────────────────────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

// ── Named row types ──────────────────────────────────────────────────────────

export type Profile          = Tables<"profiles">;
export type Station          = Tables<"stations">;
export type Category         = Tables<"categories">;
export type Dish             = Tables<"dishes">;
export type DishIngredient   = Tables<"dish_ingredients">;
export type DishStep         = Tables<"dish_steps">;
export type DishMedia        = Tables<"dish_media">;
export type MiseEnPlaceChecklist = Tables<"mise_en_place_checklists">;
export type MiseEnPlaceItem  = Tables<"mise_en_place_items">;

export type PublicDishCard   = Views<"public_dish_cards">;
export type PublicDishDetail = Views<"public_dish_details">;
