import { SectionHeader } from "@/components/layout/section-header";
import { CategoryGrid } from "@/components/categorias/category-grid";
import { getActiveCategories } from "@/lib/queries/categorias";

export default async function CategoriasPage() {
  const categories = await getActiveCategories();

  return (
    <>
      <SectionHeader
        title="Categorias"
        subtitle="Selecione uma categoria para ver os pratos"
      />
      <CategoryGrid categories={categories} />
    </>
  );
}
