import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { ChecklistForm } from "@/components/admin/checklist-form";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditChecklistPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: checklist }, { data: items }] =
    await Promise.all([
      supabase
        .from("checklists")
        .select("*")
        .eq("id", id)
        .single(),
      supabase
        .from("checklist_items")
        .select("*")
        .eq("checklist_id", id)
        .order("display_order"),
    ]);

  if (!checklist) notFound();

  return (
    <div>
      <SectionHeader title="Editar Checklist" />
      <div className="px-4">
        <ChecklistForm
          checklist={checklist}
          existingItems={items || []}
        />
      </div>
    </div>
  );
}
