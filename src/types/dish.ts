import type { Database } from "./database";

export type Dish = Database["public"]["Tables"]["dishes"]["Row"];
export type DishInsert = Database["public"]["Tables"]["dishes"]["Insert"];
export type DishUpdate = Database["public"]["Tables"]["dishes"]["Update"];

export type DishIngredient = Database["public"]["Tables"]["dish_ingredients"]["Row"];
export type DishIngredientInsert = Database["public"]["Tables"]["dish_ingredients"]["Insert"];

export type DishStep = Database["public"]["Tables"]["dish_steps"]["Row"];
export type DishStepInsert = Database["public"]["Tables"]["dish_steps"]["Insert"];

export type DishMedia = Database["public"]["Tables"]["dish_media"]["Row"];
export type DishMediaInsert = Database["public"]["Tables"]["dish_media"]["Insert"];

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Station = Database["public"]["Tables"]["stations"]["Row"];

export interface DishWithRelations extends Dish {
  category: Category;
  station: Station;
  ingredients: DishIngredient[];
  steps: DishStep[];
  media: DishMedia[];
}

export interface DishCardData {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  thumbnail_path: string | null;
  category_name: string;
  station_name: string;
  has_video: boolean;
}
