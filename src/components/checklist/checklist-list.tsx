import Link from "next/link";
import { ChefHat } from "lucide-react";
import type { Station } from "@/types/dish";

interface Props {
  stations: Station[];
}

export function ChecklistList({ stations }: Props) {
  if (stations.length === 0) {
    return <p className="text-center text-text-muted py-8 px-4">Nenhuma praca encontrada.</p>;
  }

  return (
    <div className="px-4 grid gap-3">
      {stations.map((station) => (
        <Link
          key={station.id}
          href={`/checklist/${station.slug}`}
          className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div className="p-3 rounded-xl bg-green-50 text-green-700">
            <ChefHat size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-text">{station.name}</h3>
            <p className="text-sm text-text-muted">Ver checklists desta praca</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
