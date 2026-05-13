import { SectionHeader } from "@/components/layout/section-header";
import { DishGallery } from "@/components/pratos/dish-gallery";
import { getStationBySlug } from "@/lib/queries/pracas";
import { getPublishedDishesByStation } from "@/lib/queries/pratos";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StationDishesPage({ params }: Props) {
  const { slug } = await params;

  const station = await getStationBySlug(slug);
  if (!station) notFound();

  const dishes = await getPublishedDishesByStation(station.id);

  return (
    <>
      <SectionHeader
        title={station.name}
        subtitle={station.description ?? undefined}
      />
      <DishGallery dishes={dishes} />
    </>
  );
}
