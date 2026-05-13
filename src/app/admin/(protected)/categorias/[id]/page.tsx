import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { CategoryForm } from "@/components/admin/category-form";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoriaPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("*").eq("id", id).single();
  if (!category) notFound();

  return (
    <div>
      <SectionHeader title="Editar Categoria" />
      <div className="px-4">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
