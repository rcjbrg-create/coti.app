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

  // Se a categoria tem parent_id, é uma sub-categoria - mostrar pratos diretamente
  if (category.parent_id) {
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

  // Se não tem parent_id, é uma categoria principal - verificar se tem sub-categorias
  const subCategories = await getSubCategories(category.id);

  if (subCategories.length === 0) {
    // Se não tem sub-categorias, mostrar pratos diretamente
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

  // Mostrar sub-categorias
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
