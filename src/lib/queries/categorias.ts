import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";

/**
 * Returns only main categories (without parent_id) ordered by display_order.
 */
export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("display_order");

  if (error) {
    console.error("[getActiveCategories]", error.message);
    return [];
  }

  return (data as Category[]) ?? [];
}

/**
 * Returns sub-categories for a given parent category id.
 */
export async function getSubCategories(parentId: string): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .eq("parent_id", parentId)
    .order("display_order");

  if (error) {
    console.error("[getSubCategories]", error.message);
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
