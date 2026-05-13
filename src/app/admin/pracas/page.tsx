import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { PracasReorderList } from "@/components/admin/pracas-reorder-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminPracasPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: stations } = await supabase
    .from("stations")
    .select("id, name, description, display_order")
    .order("display_order");

  return (
    <div>
      <SectionHeader
        title="Pracas"
        subtitle="Use as setas para reordenar a exibicao"
        action={
          <Link href="/admin/pracas/novo">
            <Button size="sm"><Plus size={16} className="mr-1" /> Nova</Button>
          </Link>
        }
      />
      <div className="px-4">
        <PracasReorderList stations={stations || []} />
      </div>
    </div>
  );
}
