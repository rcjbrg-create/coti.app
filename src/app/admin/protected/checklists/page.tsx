import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function AdminChecklistsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: checklists } = await supabase
    .from("checklists")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const frequencyLabels: Record<string, string> = {
    diario: "Diario",
    semanal: "Semanal",
    mensal: "Mensal",
  };

  return (
    <div>
      <SectionHeader
        title="Checklists"
        action={
          <Link href="/admin/protected/checklists/novo">
            <Button size="sm"><Plus size={16} className="mr-1" /> Novo</Button>
          </Link>
        }
      />
      <div className="px-4 space-y-2">
        {(checklists || []).map((cl) => (
          <Link key={cl.id} href={`/admin/protected/checklists/${cl.id}`} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:shadow-sm">
            <div>
              <p className="font-medium text-text">{cl.name}</p>
              <p className="text-sm text-text-muted">{cl.sector} | {frequencyLabels[cl.frequency] || cl.frequency}</p>
            </div>
            <Pencil size={16} className="text-text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
