import { SectionHeader } from "@/components/layout/section-header";
import { ChecklistCard } from "@/components/checklist/checklist-card";
import { getChecklistsBySector } from "@/lib/queries/checklists";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ pracaSlug: string }>;
}

export default async function StationChecklistPage({ params }: Props) {
  const { pracaSlug } = await params;

  // Map slug to sector: cozinha or salao
  const sector = pracaSlug === "cozinha" ? "cozinha" : pracaSlug === "salao" ? "salao" : null;
  if (!sector) notFound();

  const checklists = await getChecklistsBySector(sector);

  return (
    <>
      <SectionHeader
        title={`Checklist — ${sector === "cozinha" ? "Cozinha" : "Salao"}`}
        subtitle="Mise en place"
      />
      <div className="px-4 space-y-4">
        {checklists.length > 0 ? (
          checklists.map((checklist) => (
            <ChecklistCard key={checklist.id} checklist={checklist} />
          ))
        ) : (
          <p className="text-center text-text-muted py-8">
            Nenhum checklist cadastrado para este setor.
          </p>
        )}
      </div>
    </>
  );
}
