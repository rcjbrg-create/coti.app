import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";

/**
 * Returns all active categories ordered by display_order.
 */
export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getActiveCategories]", error.message);
    return [];
  }

  return (data as Category[]) ?? [];
}

/**
 * Returns a single active category by slug, or null if not found.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getCategoryBySlug]", error.message);
    return null;
  }

  return (data as Category | null);
}
