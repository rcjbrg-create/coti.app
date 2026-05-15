import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DishHero } from "./dish-hero";
import { IngredientTable } from "./ingredient-table";
import { PreparationSteps } from "./preparation-steps";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DishIngredient, DishStep, DishMedia } from "@/types/dish";

// Lazy-load the video player — defers its JS bundle until needed
const TutorialPlayer = dynamic(
  () =>
    import("./tutorial-player").then((mod) => ({ default: mod.TutorialPlayer })),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-14 w-full rounded-xl" />
    ),
  }
);

interface Props {
  dish: any;
  ingredients: DishIngredient[];
  steps: DishStep[];
  media: DishMedia[];
}

export function TechnicalSheet({ dish, ingredients, steps, media }: Props) {
  return (
    <div className="pb-6">
      <DishHero imagePath={dish.hero_image_path} name={dish.name} />

      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-surface rounded-2xl shadow-sm border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold text-text">{dish.name}</h1>
            {dish.station && <Badge>{(dish.station as any).name}</Badge>}
          </div>

          {dish.short_description && (
            <div 
              className="text-sm text-text-muted mt-1 rich-content"
              dangerouslySetInnerHTML={{ __html: dish.short_description }}
            />
          )}

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-text-muted">
            {dish.prep_time_minutes && <span>Preparo: {dish.prep_time_minutes} min</span>}
            {dish.serves_quantity && <span>Rendimento: {dish.serves_quantity}</span>}
            {dish.yield_info && <span>{dish.yield_info}</span>}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-primary mb-3">Ingredientes e Gramatura</h2>
          <IngredientTable ingredients={ingredients} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-3">Modo de Preparo</h2>
          <PreparationSteps steps={steps} />
        </section>

        {dish.plating_notes && (
          <section>
            <h2 className="text-lg font-bold text-primary mb-3">Montagem e Empratamento</h2>
            <div 
              className="text-sm text-text leading-relaxed rich-content"
              dangerouslySetInnerHTML={{ __html: dish.plating_notes }}
            />
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-primary mb-3">Tutorial em Video</h2>
          <Suspense fallback={<Skeleton className="h-14 w-full rounded-xl" />}>
            <TutorialPlayer media={media} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
