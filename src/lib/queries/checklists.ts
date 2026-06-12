import { createClient } from "@/lib/supabase/server";

export interface ChecklistWithItems {
  id: string;
  name: string;
  sector: string;
  frequency: string;
  assigned_groups: string[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  items: {
    id: string;
    checklist_id: string;
    description: string;
    display_order: number;
    requires_photo: boolean;
    requires_video: boolean;
    is_active: boolean;
    created_at: string;
  }[];
}

/**
 * Returns all active checklists for a given sector, with their items.
 */
export async function getChecklistsBySector(
  sector: string,
): Promise<ChecklistWithItems[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("checklists")
    .select("*, items:checklist_items(*)")
    .eq("sector", sector)
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getChecklistsBySector]", error.message);
    return [];
  }

  return (data as unknown as ChecklistWithItems[]) ?? [];
}

/**
 * Returns all active checklists grouped by sector.
 */
export async function getAllActiveChecklists(): Promise<ChecklistWithItems[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("checklists")
    .select("*, items:checklist_items(*)")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getAllActiveChecklists]", error.message);
    return [];
  }

  return (data as unknown as ChecklistWithItems[]) ?? [];
}
