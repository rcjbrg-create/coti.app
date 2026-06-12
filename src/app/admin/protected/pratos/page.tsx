import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function AdminPratosPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: dishes } = await supabase
    .from("dishes")
    .select("*, category:categories(name), station:stations(name)")
    .order("name");

  return (
    <div>
      <SectionHeader
        title="Pratos"
        action={
          <Link href="/admin/protected/pratos/novo">
            <Button size="sm"><Plus size={16} className="mr-1" /> Novo</Button>
          </Link>
        }
      />
      <div className="px-4 space-y-2">
        {(dishes || []).map((dish) => (
          <Link key={dish.id} href={`/admin/protected/pratos/${dish.id}`} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-text truncate">{dish.name}</p>
                <Badge variant={dish.is_published ? "success" : "warning"}>
                  {dish.is_published ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
              <p className="text-sm text-text-muted">{(dish.category as any)?.name} | {(dish.station as any)?.name}</p>
            </div>
            <Pencil size={16} className="text-text-muted ml-2 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
