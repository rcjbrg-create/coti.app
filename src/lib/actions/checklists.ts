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
      .from("checklists")
      .insert({
        name: parsed.name,
        sector: parsed.sector,
        frequency: parsed.frequency,
        assigned_groups: parsed.assigned_groups,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    const checklistId = data.id;

    if (parsed.items.length > 0) {
      const itemInserts = parsed.items
        .filter((i) => i.description)
        .map((i, idx) => ({
          checklist_id: checklistId,
          description: i.description,
          display_order: idx,
        }));

      if (itemInserts.length > 0) {
        const { error: itemError } = await supabase
          .from("checklist_items")
          .insert(itemInserts);
        if (itemError) return { success: false, error: itemError.message };
      }
    }

    revalidatePath("/admin/protected/checklists");
    revalidatePath("/checklist");
    return { success: true, id: checklistId };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados invalidos" };
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
      .from("checklists")
      .update({
        name: parsed.name,
        sector: parsed.sector,
        frequency: parsed.frequency,
        assigned_groups: parsed.assigned_groups,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    // Replace items
    await supabase.from("checklist_items").delete().eq("checklist_id", id);

    const itemInserts = parsed.items
      .filter((i) => i.description)
      .map((i, idx) => ({
        checklist_id: id,
        description: i.description,
        display_order: idx,
      }));

    if (itemInserts.length > 0) {
      const { error: itemError } = await supabase
        .from("checklist_items")
        .insert(itemInserts);
      if (itemError) return { success: false, error: itemError.message };
    }

    revalidatePath("/admin/protected/checklists");
    revalidatePath("/checklist");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados invalidos" };
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
    .from("checklists")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/protected/checklists");
  revalidatePath("/checklist");
  return { success: true };
}
