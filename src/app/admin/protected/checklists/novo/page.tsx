import { requireAdmin } from "@/lib/auth/guards";
import { SectionHeader } from "@/components/layout/section-header";
import { ChecklistForm } from "@/components/admin/checklist-form";

export default async function NovoChecklistPage() {
  await requireAdmin();

  return (
    <div>
      <SectionHeader title="Novo Checklist" />
      <div className="px-4">
        <ChecklistForm />
      </div>
    </div>
  );
}
