import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { CategoriasReorderList } from "@/components/admin/categorias-reorder-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCategoriasPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, description, display_order")
    .order("display_order");

  return (
    <div>
      <SectionHeader
        title="Categorias"
        subtitle="Use as setas para reordenar a exibicao"
        action={
          <Link href="/admin/protected/categorias/novo">
            <Button size="sm"><Plus size={16} className="mr-1" /> Nova</Button>
          </Link>
        }
      />
      <div className="px-4">
        <CategoriasReorderList categories={categories || []} />
      </div>
    </div>
  );
}
