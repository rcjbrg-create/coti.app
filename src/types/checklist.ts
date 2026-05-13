import type { Database } from "./database";

export type MiseEnPlaceChecklist = Database["public"]["Tables"]["mise_en_place_checklists"]["Row"];
export type MiseEnPlaceChecklistInsert = Database["public"]["Tables"]["mise_en_place_checklists"]["Insert"];

export type MiseEnPlaceItem = Database["public"]["Tables"]["mise_en_place_items"]["Row"];
export type MiseEnPlaceItemInsert = Database["public"]["Tables"]["mise_en_place_items"]["Insert"];

export interface ChecklistWithItems extends MiseEnPlaceChecklist {
  items: MiseEnPlaceItem[];
  station_name: string;
}
