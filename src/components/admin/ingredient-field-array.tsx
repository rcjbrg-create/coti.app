"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UNITS } from "@/lib/constants/theme";
import { Plus, Trash2 } from "lucide-react";
import type { DishIngredient } from "@/types/dish";

interface Props {
  dishId: string;
  initialIngredients: DishIngredient[];
}

interface IngredientRow {
  id?: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  preparation_note: string;
}

export function IngredientFieldArray({ dishId, initialIngredients }: Props) {
  const [rows, setRows] = useState<IngredientRow[]>(
    initialIngredients.length > 0
      ? initialIngredients.map((i) => ({ id: i.id, ingredient_name: i.ingredient_name, quantity: Number(i.quantity), unit: i.unit, preparation_note: i.preparation_note || "" }))
      : [{ ingredient_name: "", quantity: 0, unit: "g", preparation_note: "" }]
  );
  const [saving, setSaving] = useState(false);

  const addRow = () => setRows([...rows, { ingredient_name: "", quantity: 0, unit: "g", preparation_note: "" }]);

  const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index));

  const updateRow = (index: number, field: keyof IngredientRow, value: string | number) => {
    const updated = [...rows];
    (updated[index] as any)[field] = value;
    setRows(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("dish_ingredients").delete().eq("dish_id", dishId);
    const inserts = rows.filter((r) => r.ingredient_name).map((r, i) => ({
      dish_id: dishId,
      ingredient_name: r.ingredient_name,
      quantity: r.quantity,
      unit: r.unit,
      preparation_note: r.preparation_note || null,
      display_order: i,
    }));
    if (inserts.length > 0) {
      await supabase.from("dish_ingredients").insert(inserts);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-start">
          <Input placeholder="Ingrediente" value={row.ingredient_name} onChange={(e) => updateRow(i, "ingredient_name", e.target.value)} className="flex-1" />
          <Input type="number" placeholder="Qtd" value={row.quantity} onChange={(e) => updateRow(i, "quantity", Number(e.target.value))} className="w-20" />
          <select value={row.unit} onChange={(e) => updateRow(i, "unit", e.target.value)} className="px-2 py-3 rounded-xl border border-border bg-surface text-sm w-24">
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <Input placeholder="Obs." value={row.preparation_note} onChange={(e) => updateRow(i, "preparation_note", e.target.value)} className="w-28" />
          <button type="button" onClick={() => removeRow(i)} className="p-2 text-error hover:bg-red-50 rounded-lg touch-target">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addRow}><Plus size={14} className="mr-1" /> Ingrediente</Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar Ingredientes"}</Button>
      </div>
    </div>
  );
}
