import { createClient } from "@/lib/supabase/server";
import type { Dish, DishIngredient, DishStep, DishMedia } from "@/types/database";

// Shape returned by the dish list queries (dishes table + joined names).
export interface DishListItem extends Dish {
  category: { id: string; name: string; slug: string } | null;
  station: { id: string; name: string; slug: string } | null;
}

// Shape returned by the full detail query.
export interface DishFullDetail {
  dish: DishListItem;
  ingredients: DishIngredient[];
  steps: DishStep[];
  media: DishMedia[];
}

const DISH_LIST_SELECT =
  "*, category:categories(id, name, slug), station:stations(id, name, slug)";

/**
 * Returns published dishes for a given category id.
 * Also includes dishes from sub-categories (categories with this category as parent_id).
 */
export async function getPublishedDishesByCategory(
  categoryId: string,
): Promise<DishListItem[]> {
  const supabase = createClient();
  
  // Get all sub-category IDs
  const { data: subCategories } = await supabase
    .from("categories")
    .select("id")
    .eq("parent_id", categoryId);
  
  const subCategoryIds = subCategories?.map(c => c.id) || [];
  const allCategoryIds = [categoryId, ...subCategoryIds];
  
  const { data, error } = await supabase
    .from("dishes")
    .select(DISH_LIST_SELECT)
    .in("category_id", allCategoryIds)
    .eq("is_published", true)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("[getPublishedDishesByCategory]", error.message);
    return [];
  }

  return (data as unknown as DishListItem[]) ?? [];
}

/**
 * Returns published dishes for a given station id.
 */
export async function getPublishedDishesByStation(
  stationId: string,
): Promise<DishListItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("dishes")
    .select(DISH_LIST_SELECT)
    .eq("station_id", stationId)
    .eq("is_published", true)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("[getPublishedDishesByStation]", error.message);
    return [];
  }

  return (data as unknown as DishListItem[]) ?? [];
}

/**
 * Returns the full technical sheet for a published dish by slug.
 * Fetches dish, ingredients, steps and media in parallel.
 * Uses `public_dish_details` view when available; falls back to direct table
 * queries for compatibility with any migration state.
 */
export async function getDishWithDetailsBySlug(
  slug: string,
): Promise<DishFullDetail | null> {
  const supabase = createClient();

  const { data: dish, error: dishError } = await supabase
    .from("dishes")
    .select("*, category:categories(id, name, slug), station:stations(id, name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_active", true)
    .maybeSingle();

  if (dishError) {
    console.error("[getDishWithDetailsBySlug] dish error:", dishError.message);
    return null;
  }

  if (!dish) return null;

  const [
    { data: ingredients, error: ingError },
    { data: steps, error: stepsError },
    { data: media, error: mediaError },
  ] = await Promise.all([
    supabase
      .from("dish_ingredients")
      .select("*")
      .eq("dish_id", (dish as Dish).id)
      .order("display_order"),
    supabase
      .from("dish_steps")
      .select("*")
      .eq("dish_id", (dish as Dish).id)
      .order("display_order"),
    supabase
      .from("dish_media")
      .select("*")
      .eq("dish_id", (dish as Dish).id),
  ]);

  if (ingError) console.error("[getDishWithDetailsBySlug] ingredients:", ingError.message);
  if (stepsError) console.error("[getDishWithDetailsBySlug] steps:", stepsError.message);
  if (mediaError) console.error("[getDishWithDetailsBySlug] media:", mediaError.message);

  return {
    dish: dish as unknown as DishListItem,
    ingredients: (ingredients as unknown as DishIngredient[]) ?? [],
    steps: (steps as unknown as DishStep[]) ?? [],
    media: (media as unknown as DishMedia[]) ?? [],
  };
}
