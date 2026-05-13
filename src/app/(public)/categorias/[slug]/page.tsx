import { SectionHeader } from "@/components/layout/section-header";
import { DishGallery } from "@/components/pratos/dish-gallery";
import { getCategoryBySlug } from "@/lib/queries/categorias";
import { getPublishedDishesByCategory } from "@/lib/queries/pratos";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDishesPage({ params }: Props) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const dishes = await getPublishedDishesByCategory(category.id);

  return (
    <>
      <SectionHeader
        title={category.name}
        subtitle={category.description ?? undefined}
      />
      <DishGallery dishes={dishes} />
    </>
  );
}
