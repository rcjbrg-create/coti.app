"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SHIFTS } from "@/lib/constants/theme";
import { Plus, Trash2 } from "lucide-react";
import type { MiseEnPlaceChecklist, MiseEnPlaceItem } from "@/types/checklist";

interface Props {
  checklist?: MiseEnPlaceChecklist;
  stations: { id: string; name: string }[];
  existingItems?: MiseEnPlaceItem[];
}

export function ChecklistForm({ checklist, stations, existingItems = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(checklist?.title || "");
  const [description, setDescription] = useState(checklist?.description || "");
  const [stationId, setStationId] = useState(checklist?.station_id || "");
  const [shift, setShift] = useState(checklist?.shift || "abertura");
  const [items, setItems] = useState(
    existingItems.length > 0
      ? existingItems.map((i) => ({ label: i.item_label, description: i.item_description || "" }))
      : [{ label: "", description: "" }]
  );

  const addItem = () => setItems([...items, { label: "", description: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    let checklistId = checklist?.id;

    if (checklist) {
      await supabase.from("mise_en_place_checklists").update({ title, description: description || null, station_id: stationId, shift }).eq("id", checklist.id);
    } else {
      const { data } = await supabase.from("mise_en_place_checklists").insert({ title, description: description || null, station_id: stationId, shift }).select("id").single();
      checklistId = data?.id;
    }

    if (checklistId) {
      await supabase.from("mise_en_place_items").delete().eq("checklist_id", checklistId);
      const inserts = items.filter((i) => i.label).map((i, idx) => ({
        checklist_id: checklistId!,
        item_label: i.label,
        item_description: i.description || null,
        display_order: idx,
      }));
      if (inserts.length > 0) {
        await supabase.from("mise_en_place_items").insert(inserts);
      }
    }

    router.push("/admin/checklists");
    router.refresh();
  };

  const SHIFT_LABELS: Record<string, string> = { abertura: "Abertura", producao: "Producao", fechamento: "Fechamento" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg pb-8">
      <Input id="title" label="Titulo" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea id="desc" label="Descricao" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">Praca</label>
        <select value={stationId} onChange={(e) => setStationId(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base">
          <option value="">Selecione...</option>
          {stations.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">Turno</label>
        <select value={shift} onChange={(e) => setShift(e.target.value as any)} className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base">
          {SHIFTS.map((s) => <option key={s} value={s}>{SHIFT_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-primary">Itens do Checklist</h4>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <Input placeholder="Item" value={item.label} onChange={(e) => { const u = [...items]; u[i].label = e.target.value; setItems(u); }} className="flex-1" />
            <Input placeholder="Detalhe (opcional)" value={item.description} onChange={(e) => { const u = [...items]; u[i].description = e.target.value; setItems(u); }} className="flex-1" />
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
