import Link from "next/link";
import { ChefHat } from "lucide-react";
import type { Station } from "@/types/dish";

interface Props {
  station: Station;
}

export function StationCard({ station }: Props) {
  return (
    <Link
      href={`/pracas/${station.slug}`}
      className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
        <ChefHat size={24} />
      </div>
      <div>
        <h3 className="font-semibold text-text">{station.name}</h3>
        {station.description && (
          <p className="text-sm text-text-muted">{station.description}</p>
        )}
      </div>
    </Link>
  );
}
