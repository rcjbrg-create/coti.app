import { notFound } from "next/navigation";
import { getCategoryBySlug, getSubCategories } from "@/lib/queries/categorias";
import { getPublishedDishesByCategory } from "@/lib/queries/pratos";
import { DishGallery } from "@/components/pratos/dish-gallery";
import { CategoryGrid } from "@/components/categorias/category-grid";
import { SectionHeader } from "@/components/layout/section-header";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Buscar sub-categorias
  const subCategories = await getSubCategories(category.id);

  // Se tem sub-categorias, mostrar elas
  if (subCategories.length > 0) {
    return (
      <>
        <SectionHeader 
          title={category.name} 
          subtitle={`${subCategories.length} sub-categoria${subCategories.length !== 1 ? 's' : ''}`} 
        />
        <CategoryGrid categories={subCategories} />
      </>
    );
  }

  // Se não tem sub-categorias, mostrar pratos
  const dishes = await getPublishedDishesByCategory(category.id);
  
  return (
    <>
      <SectionHeader 
        title={category.name} 
        subtitle={`${dishes.length} receita${dishes.length !== 1 ? 's' : ''} disponível${dishes.length !== 1 ? 'is' : ''}`} 
      />
      <DishGallery dishes={dishes} />
    </>
  );
}
