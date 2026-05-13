import type { DishIngredient } from "@/types/dish";
import { formatQuantity } from "@/lib/utils";

interface Props {
  ingredients: DishIngredient[];
}

export function IngredientTable({ ingredients }: Props) {
  if (ingredients.length === 0) {
    return <p className="text-sm text-text-muted">Nenhum ingrediente cadastrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-primary/20">
            <th className="py-2 pr-4 text-sm font-semibold text-primary">Ingrediente</th>
            <th className="py-2 pr-4 text-sm font-semibold text-primary text-right">Quantidade</th>
            <th className="py-2 text-sm font-semibold text-primary">Obs.</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ing) => (
            <tr key={ing.id} className="border-b border-border">
              <td className="py-2.5 pr-4 text-sm font-medium text-text">{ing.ingredient_name}</td>
              <td className="py-2.5 pr-4 text-sm text-text text-right whitespace-nowrap">
                {formatQuantity(Number(ing.quantity), ing.unit)}
              </td>
              <td className="py-2.5 text-sm text-text-muted">{ing.preparation_note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
