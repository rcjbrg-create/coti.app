import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { DishForm } from "@/components/admin/dish-form";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPratoPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: dish }, { data: categories }, { data: stations }, { data: ingredients }, { data: steps }] = await Promise.all([
    supabase.from("dishes").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").eq("is_active", true).order("display_order"),
    supabase.from("stations").select("id, name").eq("is_active", true).order("display_order"),
    supabase.from("dish_ingredients").select("*").eq("dish_id", id).order("display_order"),
    supabase.from("dish_steps").select("*").eq("dish_id", id).order("display_order"),
  ]);

  if (!dish) notFound();

  return (
    <div>
      <SectionHeader title="Editar Prato" />
      <div className="px-4">
        <DishForm
          dish={dish}
          categories={categories || []}
          stations={stations || []}
          existingIngredients={ingredients || []}
          existingSteps={steps || []}
        />
      </div>
    </div>
  );
}
