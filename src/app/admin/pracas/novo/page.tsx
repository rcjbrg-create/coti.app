import { requireAdmin } from "@/lib/auth/guards";
import { SectionHeader } from "@/components/layout/section-header";
import { StationForm } from "@/components/admin/station-form";

export default async function NovaPracaPage() {
  await requireAdmin();
  return (
    <div>
      <SectionHeader title="Nova Praca" />
      <div className="px-4"><StationForm /></div>
    </div>
  );
}
