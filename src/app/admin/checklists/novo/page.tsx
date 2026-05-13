import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { ChecklistForm } from "@/components/admin/checklist-form";

export default async function NovoChecklistPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: stations } = await supabase
    .from("stations")
    .select("id, name")
    .eq("is_active", true)
    .order("display_order");

  return (
    <div>
      <SectionHeader title="Novo Checklist" />
      <div className="px-4">
        <ChecklistForm stations={stations || []} />
      </div>
    </div>
  );
}
