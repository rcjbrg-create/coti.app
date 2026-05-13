"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { DishStep } from "@/types/dish";

interface Props {
  dishId: string;
  initialSteps: DishStep[];
}

interface StepRow {
  title: string;
  instruction: string;
  time_hint: string;
}

export function PreparationStepsEditor({ dishId, initialSteps }: Props) {
  const [steps, setSteps] = useState<StepRow[]>(
    initialSteps.length > 0
      ? initialSteps.map((s) => ({ title: s.title || "", instruction: s.instruction, time_hint: s.time_hint || "" }))
      : [{ title: "", instruction: "", time_hint: "" }]
  );
  const [saving, setSaving] = useState(false);

  const addStep = () => setSteps([...steps, { title: "", instruction: "", time_hint: "" }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: keyof StepRow, value: string) => {
    const updated = [...steps];
    updated[i][field] = value;
    setSteps(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("dish_steps").delete().eq("dish_id", dishId);
    const inserts = steps.filter((s) => s.instruction).map((s, i) => ({
      dish_id: dishId,
      title: s.title || null,
      instruction: s.instruction,
      time_hint: s.time_hint || null,
      display_order: i,
    }));
    if (inserts.length > 0) {
      await supabase.from("dish_steps").insert(inserts);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="p-4 bg-beige rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Passo {i + 1}</span>
            <button type="button" onClick={() => removeStep(i)} className="p-1 text-error hover:bg-red-50 rounded">
              <Trash2 size={14} />
            </button>
          </div>
          <Input placeholder="Titulo (opcional)" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} />
          <Textarea placeholder="Instrucao detalhada" value={step.instruction} onChange={(e) => updateStep(i, "instruction", e.target.value)} />
          <Input placeholder="Tempo estimado (ex: 5 min)" value={step.time_hint} onChange={(e) => updateStep(i, "time_hint", e.target.value)} />
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addStep}><Plus size={14} className="mr-1" /> Passo</Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar Passos"}</Button>
      </div>
    </div>
  );
}
