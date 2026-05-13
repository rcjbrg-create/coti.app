"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { categoriaSchema, type CategoriaInput } from "@/lib/validations/categoria";
import { z } from "zod";

export async function createCategoria(
  input: CategoriaInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const parsed = categoriaSchema.parse(input);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: parsed.name,
        slug: slugify(parsed.name),
        description: parsed.description ?? null,
        display_order: parsed.display_order,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/categorias");
    revalidatePath("/categorias");
    return { success: true, id: data.id };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao criar categoria" };
  }
}

export async function updateCategoria(
  id: string,
  input: CategoriaInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = categoriaSchema.parse(input);
    const supabase = createClient();

    const { error } = await supabase
      .from("categories")
      .update({
        name: parsed.name,
        slug: slugify(parsed.name),
        description: parsed.description ?? null,
        display_order: parsed.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/categorias");
    revalidatePath("/categorias");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro inesperado ao atualizar categoria" };
  }
}

export async function deleteCategoria(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  return { success: true };
}

export async function reorderCategoria(
  id: string,
  direction: "up" | "down"
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: all, error: fetchError } = await supabase
    .from("categories")
    .select("id, display_order")
    .order("display_order");

  if (fetchError || !all) return { success: false, error: "Erro ao buscar categorias" };

  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return { success: false, error: "Categoria nao encontrada" };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return { success: true };

  const current = all[idx];
  const swap = all[swapIdx];

  const updates = [
    supabase.from("categories").update({ display_order: swap.display_order }).eq("id", current.id),
    supabase.from("categories").update({ display_order: current.display_order }).eq("id", swap.id),
  ];

  const results = await Promise.all(updates);
  const err = results.find((r) => r.error)?.error;
  if (err) return { success: false, error: err.message };

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  return { success: true };
}
