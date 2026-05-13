import { createClient } from "@/lib/supabase/server";
import type { Station } from "@/types/database";

/**
 * Returns all active stations ordered by display_order.
 */
export async function getActiveStations(): Promise<Station[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getActiveStations]", error.message);
    return [];
  }

  return (data as Station[]) ?? [];
}

/**
 * Returns a single active station by slug, or null if not found.
 */
export async function getStationBySlug(slug: string): Promise<Station | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getStationBySlug]", error.message);
    return null;
  }

  return (data as Station | null);
}
