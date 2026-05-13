import { SectionHeader } from "@/components/layout/section-header";
import { ChecklistList } from "@/components/checklist/checklist-list";
import { getActiveStations } from "@/lib/queries/pracas";

export default async function ChecklistPage() {
  const stations = await getActiveStations();

  return (
    <>
      <SectionHeader
        title="Mise en Place"
        subtitle="Checklists por praca de trabalho"
      />
      <ChecklistList stations={stations} />
    </>
  );
}
