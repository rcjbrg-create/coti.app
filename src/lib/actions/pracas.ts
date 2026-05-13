"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { pracaSchema, type PracaInput } from "@/lib/validations/praca";
import { z } from "zod";

export async function createPraca(
  input: PracaInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  await requireAdmin();

  try {
    const parsed = pracaSchema.parse(input);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("stations")
      .insert({
        name: parsed.name,
        slug: slugify(parsed.name),
        description: parsed.description ?? null,
        display_order: parsed.display_order,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/pracas");
    revalidatePath("/pracas");
    return { success: true, id: data.id };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao criar praca" };
  }
}

export async function updatePraca(
  id: string,
  input: PracaInput
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const parsed = pracaSchema.parse(input);
    const supabase = createClient();

    const { error } = await supabase
      .from("stations")
      .update({
        name: parsed.name,
        slug: slugify(parsed.name),
        description: parsed.description ?? null,
        display_order: parsed.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/pracas");
    revalidatePath("/pracas");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao atualizar praca" };
  }
}

export async function deletePraca(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const supabase = createClient();
  const { error } = await supabase.from("stations").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/pracas");
  revalidatePath("/pracas");
  return { success: true };
}

export async function reorderPraca(
  id: string,
  direction: "up" | "down"
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const supabase = createClient();
  const { data: all, error: fetchError } = await supabase
    .from("stations")
    .select("id, display_order")
    .order("display_order");

  if (fetchError || !all) return { success: false, error: "Erro ao buscar pracas" };

  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return { success: false, error: "Praca nao encontrada" };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return { success: true };

  const current = all[idx];
  const swap = all[swapIdx];

  const updates = [
    supabase.from("stations").update({ display_order: swap.display_order }).eq("id", current.id),
    supabase.from("stations").update({ display_order: current.display_order }).eq("id", swap.id),
  ];

  const results = await Promise.all(updates);
  const err = results.find((r) => r.error)?.error;
  if (err) return { success: false, error: err.message };

  revalidatePath("/admin/pracas");
  revalidatePath("/pracas");
  return { success: true };
}

