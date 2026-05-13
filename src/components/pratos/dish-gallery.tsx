import { DishCard } from "./dish-card";

interface Props {
  dishes: any[];
}

export function DishGallery({ dishes }: Props) {
  if (dishes.length === 0) {
    return <p className="text-center text-text-muted py-8 px-4">Nenhum prato encontrado.</p>;
  }

  return (
    <div className="px-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
