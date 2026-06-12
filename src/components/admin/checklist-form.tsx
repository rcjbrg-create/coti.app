"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  checklist?: {
    id: string;
    name: string;
    sector: string;
    frequency: string;
    assigned_groups: string[] | null;
  };
  existingItems?: {
    id: string;
    checklist_id: string;
    description: string;
    display_order: number;
  }[];
}

export function ChecklistForm({ checklist, existingItems = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(checklist?.name || "");
  const [sector, setSector] = useState(checklist?.sector || "cozinha");
  const [frequency, setFrequency] = useState(checklist?.frequency || "diario");
  const [items, setItems] = useState(
    existingItems.length > 0
      ? existingItems.map((i) => ({ description: i.description }))
      : [{ description: "" }]
  );

  const addItem = () => setItems([...items, { description: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    let checklistId = checklist?.id;

    if (checklist) {
      await supabase.from("checklists").update({ name, sector, frequency }).eq("id", checklist.id);
    } else {
      const { data } = await supabase.from("checklists").insert({ name, sector, frequency, assigned_groups: [] }).select("id").single();
      checklistId = data?.id;
    }

    if (checklistId) {
      await supabase.from("checklist_items").delete().eq("checklist_id", checklistId);
      const inserts = items.filter((i) => i.description).map((i, idx) => ({
        checklist_id: checklistId!,
        description: i.description,
        display_order: idx,
      }));
      if (inserts.length > 0) {
        await supabase.from("checklist_items").insert(inserts);
      }
    }

    router.push("/admin/protected/checklists");
    router.refresh();
  };

  const frequencyLabels: Record<string, string> = { diario: "Diario", semanal: "Semanal", mensal: "Mensal" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg pb-8">
      <Input id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">Setor</label>
        <select value={sector} onChange={(e) => setSector(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base">
          <option value="cozinha">Cozinha</option>
          <option value="salao">Salao</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">Frequencia</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base">
          {Object.entries(frequencyLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-primary">Itens do Checklist</h4>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <Input placeholder="Descricao do item" value={item.description} onChange={(e) => { const u = [...items]; u[i].description = e.target.value; setItems(u); }} className="flex-1" />
            <button type="button" onClick={() => removeItem(i)} className="p-2 text-error hover:bg-red-50 rounded-lg touch-target"><Trash2 size={16} /></button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus size={14} className="mr-1" /> Item</Button>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : checklist ? "Atualizar" : "Criar"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}
