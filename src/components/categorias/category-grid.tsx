import { CategoryCard } from "./category-card";
import type { Category } from "@/types/dish";

interface Props {
  categories: Category[];
}

export function CategoryGrid({ categories }: Props) {
  if (categories.length === 0) {
    return <p className="text-center text-text-muted py-8 px-4">Nenhuma categoria encontrada.</p>;
  }

  return (
    <div className="px-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
}
