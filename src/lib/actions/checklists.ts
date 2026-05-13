"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { checklistSchema, type ChecklistInput } from "@/lib/validations/checklist";
import { z } from "zod";

export async function createChecklist(
  input: ChecklistInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  await requireAdmin();

  try {
    const parsed = checklistSchema.parse(input);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("mise_en_place_checklists")
      .insert({
        title: parsed.title,
        description: parsed.description ?? null,
        station_id: parsed.station_id,
        shift: parsed.shift,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    const checklistId = data.id;

    if (parsed.items.length > 0) {
      const itemInserts = parsed.items
        .filter((i) => i.item_label)
        .map((i, idx) => ({
          checklist_id: checklistId,
          item_label: i.item_label,
          item_description: i.item_description ?? null,
          is_required: i.is_required,
          display_order: idx,
        }));

      if (itemInserts.length > 0) {
        const { error: itemError } = await supabase
          .from("mise_en_place_items")
          .insert(itemInserts);
        if (itemError) return { success: false, error: itemError.message };
      }
    }

    revalidatePath("/admin/checklists");
    revalidatePath("/checklist");
    return { success: true, id: checklistId };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao criar checklist" };
  }
}

export async function updateChecklist(
  id: string,
  input: ChecklistInput
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const parsed = checklistSchema.parse(input);
    const supabase = createClient();

    const { error } = await supabase
      .from("mise_en_place_checklists")
      .update({
        title: parsed.title,
        description: parsed.description ?? null,
        station_id: parsed.station_id,
        shift: parsed.shift,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    // Replace items
    await supabase.from("mise_en_place_items").delete().eq("checklist_id", id);

    const itemInserts = parsed.items
      .filter((i) => i.item_label)
      .map((i, idx) => ({
        checklist_id: id,
        item_label: i.item_label,
        item_description: i.item_description ?? null,
        is_required: i.is_required,
        display_order: idx,
      }));

    if (itemInserts.length > 0) {
      const { error: itemError } = await supabase
        .from("mise_en_place_items")
        .insert(itemInserts);
      if (itemError) return { success: false, error: itemError.message };
    }

    revalidatePath("/admin/checklists");
    revalidatePath("/checklist");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao atualizar checklist" };
  }
}

export async function deleteChecklist(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const supabase = createClient();
  const { error } = await supabase
    .from("mise_en_place_checklists")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/checklists");
  revalidatePath("/checklist");
  return { success: true };
}

