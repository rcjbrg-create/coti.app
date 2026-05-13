import { SectionHeader } from "@/components/layout/section-header";
import { StationGrid } from "@/components/pracas/station-grid";
import { getActiveStations } from "@/lib/queries/pracas";

export default async function PracasPage() {
  const stations = await getActiveStations();

  return (
    <>
      <SectionHeader
        title="Pracas"
        subtitle="Selecione uma praca de trabalho"
      />
      <StationGrid stations={stations} />
    </>
  );
}
