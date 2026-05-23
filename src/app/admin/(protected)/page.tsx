import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UtensilsCrossed, ChefHat, ClipboardList, FolderOpen, CheckCircle, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DashboardStats } from "@/components/admin/dashboard-stats";

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { count: publishedCount },
    { count: draftCount },
    { count: categoryCount },
    { count: stationCount },
    { count: checklistCount },
    { data: recentDishes },
  ] = await Promise.all([
    supabase.from("dishes").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("dishes").select("*", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("stations").select("*", { count: "exact", head: true }),
    supabase.from("checklists").select("*", { count: "exact", head: true }),
    supabase
      .from("dishes")
      .select("id, name, is_published, updated_at, category:categories(name)")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const totalDishes = (publishedCount || 0) + (draftCount || 0);

  return (
    <div className="pb-8">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center">
            <Image src="/logo-coti.png" alt="COTI" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
            <p className="text-text-muted mt-1">Gerencie o conteudo operacional do COTI</p>
          </div>
        </div>
      </div>

      <DashboardStats
        totalDishes={totalDishes}
        publishedCount={publishedCount || 0}
        draftCount={draftCount || 0}
        categoryCount={categoryCount || 0}
        stationCount={stationCount || 0}
        checklistCount={checklistCount || 0}
      />

      <div className="px-4 mb-6">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">Modulos</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/admin/categorias"
            className="flex flex-col items-center gap-1.5 p-4 bg-surface rounded-2xl border border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10">
              <FolderOpen size={22} className="text-primary" />
            </div>
            <span className="text-xl font-bold text-primary">{categoryCount || 0}</span>
            <span className="text-xs text-text-muted">Categorias</span>
          </Link>
          <Link
            href="/admin/pracas"
            className="flex flex-col items-center gap-1.5 p-4 bg-surface rounded-2xl border border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10">
              <ChefHat size={22} className="text-primary" />
            </div>
            <span className="text-xl font-bold text-primary">{stationCount || 0}</span>
            <span className="text-xs text-text-muted">Pracas</span>
          </Link>
          <Link
            href="/admin/checklists"
            className="flex flex-col items-center gap-1.5 p-4 bg-surface rounded-2xl border border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10">
              <ClipboardList size={22} className="text-primary" />
            </div>
            <span className="text-xl font-bold text-primary">{checklistCount || 0}</span>
            <span className="text-xs text-text-muted">Checklists</span>
          </Link>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Ultimos editados</h2>
          <Link href="/admin/pratos" className="text-xs text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="space-y-2">
          {(recentDishes || []).map((dish) => (
            <Link
              key={dish.id}
              href={`/admin/pratos/${dish.id}`}
              className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border hover:shadow-md hover:border-primary/30 transition-all"
            >
              <UtensilsCrossed size={16} className="text-text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{dish.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock size={11} className="text-text-muted" />
                  <span className="text-xs text-text-muted">
                    {new Date(dish.updated_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <Badge variant={dish.is_published ? "success" : "warning"}>
                {dish.is_published ? "Publicado" : "Rascunho"}
              </Badge>
            </Link>
          ))}
          {(!recentDishes || recentDishes.length === 0) && (
            <p className="text-sm text-text-muted text-center py-6">Nenhum prato cadastrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
