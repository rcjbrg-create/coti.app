import { SectionHeader } from "@/components/layout/section-header";
import { ChecklistCard } from "@/components/checklist/checklist-card";
import { getStationBySlug } from "@/lib/queries/pracas";
import { getChecklistsByStation } from "@/lib/queries/checklists";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ pracaSlug: string }>;
}

export default async function StationChecklistPage({ params }: Props) {
  const { pracaSlug } = await params;

  const station = await getStationBySlug(pracaSlug);
  if (!station) notFound();

  const checklists = await getChecklistsByStation(station.id);

  return (
    <>
      <SectionHeader
        title={`Checklist — ${station.name}`}
        subtitle="Mise en place por turno"
      />
      <div className="px-4 space-y-4">
        {checklists.length > 0 ? (
          checklists.map((checklist) => (
            <ChecklistCard key={checklist.id} checklist={checklist} />
          ))
        ) : (
          <p className="text-center text-text-muted py-8">
            Nenhum checklist cadastrado para esta praca.
          </p>
        )}
      </div>
    </>
  );
}
