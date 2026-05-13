import type { DishStep } from "@/types/dish";

interface Props {
  steps: DishStep[];
}

export function PreparationSteps({ steps }: Props) {
  if (steps.length === 0) {
    return <p className="text-sm text-text-muted">Nenhum passo cadastrado.</p>;
  }

  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={step.id} className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <div className="flex-1 pt-1">
            {step.title && <h4 className="font-semibold text-text text-sm mb-0.5">{step.title}</h4>}
            <p className="text-sm text-text leading-relaxed">{step.instruction}</p>
            {step.time_hint && (
              <p className="text-xs text-text-muted mt-1">Tempo: {step.time_hint}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
