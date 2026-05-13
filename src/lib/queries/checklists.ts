import { createClient } from "@/lib/supabase/server";
import type { MiseEnPlaceChecklist, MiseEnPlaceItem } from "@/types/database";

export interface ChecklistWithItems extends MiseEnPlaceChecklist {
  items: MiseEnPlaceItem[];
}

/**
 * Returns all active checklists for a given station id, with their items.
 * Ordered by shift (abertura → producao → fechamento).
 */
export async function getChecklistsByStation(
  stationId: string,
): Promise<ChecklistWithItems[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mise_en_place_checklists")
    .select("*, items:mise_en_place_items(*)")
    .eq("station_id", stationId)
    .eq("is_active", true)
    .order("shift");

  if (error) {
    console.error("[getChecklistsByStation]", error.message);
    return [];
  }

  return (data as unknown as ChecklistWithItems[]) ?? [];
}

/**
 * Returns all active checklists grouped by station.
 * Useful for the checklist index page.
 */
export async function getAllActiveChecklists(): Promise<ChecklistWithItems[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mise_en_place_checklists")
    .select("*, items:mise_en_place_items(*)")
    .eq("is_active", true)
    .order("shift");

  if (error) {
    console.error("[getAllActiveChecklists]", error.message);
    return [];
  }

  return (data as unknown as ChecklistWithItems[]) ?? [];
}
