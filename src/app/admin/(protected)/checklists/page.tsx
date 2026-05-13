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
    .from("mise_en_place_checklists")
    .select("*, station:stations(name)")
    .order("shift");

  return (
    <div>
      <SectionHeader
        title="Checklists"
        action={
          <Link href="/admin/checklists/novo">
            <Button size="sm"><Plus size={16} className="mr-1" /> Novo</Button>
          </Link>
        }
      />
      <div className="px-4 space-y-2">
        {(checklists || []).map((cl) => (
          <Link key={cl.id} href={`/admin/checklists/${cl.id}`} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:shadow-sm">
            <div>
              <p className="font-medium text-text">{cl.title}</p>
              <p className="text-sm text-text-muted">{(cl.station as any)?.name} | {cl.shift}</p>
            </div>
            <Pencil size={16} className="text-text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
