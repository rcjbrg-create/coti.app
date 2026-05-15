"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { IngredientFieldArray } from "./ingredient-field-array";
import { PreparationStepsEditor } from "./preparation-steps-editor";
import { MediaUpload } from "./media-upload";
import type { Dish, DishIngredient, DishStep } from "@/types/dish";

interface Props {
  dish?: Dish;
  categories: { id: string; name: string; parent_id?: string | null }[];
  stations: { id: string; name: string }[];
  existingIngredients?: DishIngredient[];
  existingSteps?: DishStep[];
}

export function DishForm({ dish, categories, stations, existingIngredients = [], existingSteps = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dados do prato
  const [name, setName] = useState(dish?.name || "");
  const [shortDesc, setShortDesc] = useState(dish?.short_description || "");
  const [yieldInfo, setYieldInfo] = useState(dish?.yield_info || "");
  const [platingNotes, setPlatingNotes] = useState(dish?.plating_notes || "");
  const [prepTime, setPrepTime] = useState(dish?.prep_time_minutes || 0);
  const [isPublished, setIsPublished] = useState(dish?.is_published || false);
  
  // Categorias
  const mainCategories = categories.filter(c => !c.parent_id);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(dish?.category_id || "");
  
  // Praça
  const [stationId, setStationId] = useState(dish?.station_id || "");
  
  // Midias
  const [heroImages, setHeroImages] = useState<string[]>(dish?.hero_image_path ? [dish.hero_image_path] : []);
  const [videos, setVideos] = useState<string[]>([]);

  // Filtrar sub-categorias baseado na categoria principal selecionada
  const availableSubCategories = selectedMainCategory 
    ? categories.filter(c => c.parent_id === selectedMainCategory)
    : [];

  const handleMainCategoryChange = (mainCatId: string) => {
    setSelectedMainCategory(mainCatId);
    setSelectedSubCategory(""); // Limpa sub-categoria ao mudar principal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Validacao
    if (!selectedSubCategory) {
      setError("Selecione uma sub-categoria");
      setLoading(false);
      return;
    }

    const data = {
      name,
      slug: slugify(name),
      category_id: selectedSubCategory,
      station_id: stationId,
      short_description: shortDesc || null,
      yield_info: yieldInfo || null,
      plating_notes: platingNotes || null,
      prep_time_minutes: prepTime || null,
      is_published: isPublished,
      hero_image_path: heroImages[0] || null,
    };

    try {
      if (dish) {
        const { error: dbError } = await supabase.from("dishes").update(data).eq("id", dish.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from("dishes").insert(data);
        if (dbError) throw dbError;
      }

      router.push("/admin/pratos");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl pb-8">
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Informacoes do Prato</h3>
        
        <Input id="name" label="Nome do prato" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">Categoria Principal*</label>
            <select 
              value={selectedMainCategory} 
              onChange={(e) => handleMainCategoryChange(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base"
            >
              <option value="">Selecione...</option>
              {mainCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">Sub-Categoria*</label>
            <select 
              value={selectedSubCategory} 
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base"
            >
              <option value="">Selecione...</option>
              {availableSubCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">Praca*</label>
          <select 
            value={stationId} 
            onChange={(e) => setStationId(e.target.value)} 
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base"
          >
            <option value="">Selecione...</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        
        <RichTextEditor
          label="Descricao curta"
          value={shortDesc}
          onChange={setShortDesc}
          placeholder="Descreva o prato..."
        />
        <div className="grid grid-cols-2 gap-4">
          <Input id="yield" label="Rendimento" value={yieldInfo} onChange={(e) => setYieldInfo(e.target.value)} placeholder="Ex: 10 porcoes" />
          <Input id="prep" label="Tempo de preparo (min)" type="number" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} />
        </div>
        
        <RichTextEditor
          label="Observacoes de montagem/empratamento"
          value={platingNotes}
          onChange={setPlatingNotes}
          placeholder="Instrucoes de montagem..."
        />
        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-colors"
          style={{ borderColor: isPublished ? '#16a34a' : '#d97706', backgroundColor: isPublished ? '#f0fdf4' : '#fffbeb' }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: isPublished ? '#15803d' : '#b45309' }}>
              {isPublished ? 'Publicado' : 'Rascunho'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: isPublished ? '#16a34a' : '#d97706' }}>
              {isPublished ? 'Visivel para a equipe operacional' : 'Apenas admins podem visualizar'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
            style={{ backgroundColor: isPublished ? '#16a34a' : '#d1d5db' }}
          >
            <span
              className="pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out"
              style={{ transform: isPublished ? 'translateX(1.75rem)' : 'translateX(0)' }}
            />
          </button>
        </div>
      </section>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : dish ? "Atualizar Prato" : "Criar Prato"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
      
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}
    </form>
  );
}
