import { StationCard } from "./station-card";
import type { Station } from "@/types/dish";

interface Props {
  stations: Station[];
}

export function StationGrid({ stations }: Props) {
  if (stations.length === 0) {
    return <p className="text-center text-text-muted py-8 px-4">Nenhuma praca encontrada.</p>;
  }

  return (
    <div className="px-4 grid gap-3">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
