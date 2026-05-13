import { SectionHeader } from "@/components/layout/section-header";
import { CategoryGrid } from "@/components/categorias/category-grid";
import { StationGrid } from "@/components/pracas/station-grid";
import { getActiveCategories } from "@/lib/queries/categorias";
import { getActiveStations } from "@/lib/queries/pracas";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default async function HomePage() {
  const [categories, stations] = await Promise.all([
    getActiveCategories(),
    getActiveStations(),
  ]);

  return (
    <div>
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-primary">COTI Restaurante</h1>
        <p className="text-text-muted mt-1">Gestao Operacional e Padronizacao</p>
      </div>

      <SectionHeader title="Categorias" subtitle="Navegue por tipo de prato" />
      <CategoryGrid categories={categories} />

      <SectionHeader title="Pracas" subtitle="Navegue por estacao de trabalho" />
      <StationGrid stations={stations} />

      <div className="mt-6 px-4">
        <Link
          href="/checklist"
          className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div className="p-3 rounded-xl bg-green-50 text-green-700">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-text">Mise en Place</h3>
            <p className="text-sm text-text-muted">Checklists por praca e turno</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
