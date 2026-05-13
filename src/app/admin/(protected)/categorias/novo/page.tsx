import { requireAdmin } from "@/lib/auth/guards";
import { SectionHeader } from "@/components/layout/section-header";
import { CategoryForm } from "@/components/admin/category-form";

export default async function NovaCategoriaPage() {
  await requireAdmin();
  return (
    <div>
      <SectionHeader title="Nova Categoria" />
      <div className="px-4">
        <CategoryForm />
      </div>
    </div>
  );
}
