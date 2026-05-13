"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import {
  pratoSchema,
  ingredienteSchema,
  passoSchema,
  type PratoInput,
  type IngredienteInput,
  type PassoInput,
} from "@/lib/validations/prato";
import { z } from "zod";

export async function createPrato(
  input: PratoInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  await requireAdmin();

  try {
    const parsed = pratoSchema.parse(input);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("dishes")
      .insert({
        name: parsed.name,
        slug: slugify(parsed.name),
        category_id: parsed.category_id,
        station_id: parsed.station_id,
        short_description: parsed.short_description ?? null,
        yield_info: parsed.yield_info ?? null,
        plating_notes: parsed.plating_notes ?? null,
        prep_time_minutes: parsed.prep_time_minutes ?? null,
        is_published: parsed.is_published,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/pratos");
    return { success: true, id: data.id };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao criar prato" };
  }
}

export async function updatePrato(
  id: string,
  input: PratoInput
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const parsed = pratoSchema.parse(input);
    const supabase = createClient();

    if (parsed.is_published) {
      const [
        { count: ingCount },
        { count: stepCount },
        { count: mediaCount },
      ] = await Promise.all([
        supabase.from("dish_ingredients").select("*", { count: "exact", head: true }).eq("dish_id", id),
        supabase.from("dish_steps").select("*", { count: "exact", head: true }).eq("dish_id", id),
        supabase.from("dish_media").select("*", { count: "exact", head: true }).eq("dish_id", id).eq("media_type", "image"),
      ]);

      const missing: string[] = [];
      if (!ingCount) missing.push("pelo menos 1 ingrediente");
      if (!stepCount) missing.push("pelo menos 1 passo de preparo");
      if (!mediaCount) missing.push("pelo menos 1 imagem hero");

      if (missing.length > 0) {
        return {
          success: false,
          error: `Para publicar, o prato precisa ter: ${missing.join(", ")}.`,
        };
      }
    }

    const { error } = await supabase
      .from("dishes")
      .update({
        name: parsed.name,
        slug: slugify(parsed.name),
        category_id: parsed.category_id,
        station_id: parsed.station_id,
        short_description: parsed.short_description ?? null,
        yield_info: parsed.yield_info ?? null,
        plating_notes: parsed.plating_notes ?? null,
        prep_time_minutes: parsed.prep_time_minutes ?? null,
        is_published: parsed.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/pratos");
    revalidatePath(`/pratos/${id}`);
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao atualizar prato" };
  }
}

export async function deletePrato(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const supabase = createClient();
  const { error } = await supabase.from("dishes").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/pratos");
  return { success: true };
}

export async function saveIngredientes(
  dishId: string,
  ingredientes: IngredienteInput[]
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const parsed = ingredientes.map((i) => ingredienteSchema.parse(i));
    const supabase = createClient();

    await supabase.from("dish_ingredients").delete().eq("dish_id", dishId);

    const inserts = parsed
      .filter((i) => i.ingredient_name)
      .map((i, idx) => ({
        dish_id: dishId,
        ingredient_name: i.ingredient_name,
        quantity: i.quantity,
        unit: i.unit,
        preparation_note: i.preparation_note ?? null,
        display_order: idx,
      }));

    if (inserts.length > 0) {
      const { error } = await supabase.from("dish_ingredients").insert(inserts);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/admin/pratos/${dishId}`);
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao salvar ingredientes" };
  }
}

export async function savePassos(
  dishId: string,
  passos: PassoInput[]
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const parsed = passos.map((p) => passoSchema.parse(p));
    const supabase = createClient();

    await supabase.from("dish_steps").delete().eq("dish_id", dishId);

    const inserts = parsed
      .filter((p) => p.instruction)
      .map((p, idx) => ({
        dish_id: dishId,
        title: p.title ?? null,
        instruction: p.instruction,
        time_hint: p.time_hint ?? null,
        display_order: idx,
      }));

    if (inserts.length > 0) {
      const { error } = await supabase.from("dish_steps").insert(inserts);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/admin/pratos/${dishId}`);
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao salvar passos" };
  }
}

