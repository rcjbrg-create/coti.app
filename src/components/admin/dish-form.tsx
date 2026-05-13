"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IngredientFieldArray } from "./ingredient-field-array";
import { PreparationStepsEditor } from "./preparation-steps-editor";
import { MediaUpload } from "./media-upload";
import type { Dish, DishIngredient, DishStep } from "@/types/dish";

interface Props {
  dish?: Dish;
  categories: { id: string; name: string }[];
  stations: { id: string; name: string }[];
  existingIngredients?: DishIngredient[];
  existingSteps?: DishStep[];
}

export function DishForm({ dish, categories, stations, existingIngredients = [], existingSteps = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(dish?.name || "");
  const [categoryId, setCategoryId] = useState(dish?.category_id || "");
  const [stationId, setStationId] = useState(dish?.station_id || "");
  const [shortDesc, setShortDesc] = useState(dish?.short_description || "");
  const [yieldInfo, setYieldInfo] = useState(dish?.yield_info || "");
  const [platingNotes, setPlatingNotes] = useState(dish?.plating_notes || "");
  const [prepTime, setPrepTime] = useState(dish?.prep_time_minutes || 0);
  const [isPublished, setIsPublished] = useState(dish?.is_published || false);
  const [heroImagePath, setHeroImagePath] = useState(dish?.hero_image_path || "");
  const [videoPath, setVideoPath] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (isPublished && dish) {
      const [
        { count: ingCount },
        { count: stepCount },
        { count: mediaCount },
      ] = await Promise.all([
        supabase.from("dish_ingredients").select("*", { count: "exact", head: true }).eq("dish_id", dish.id),
        supabase.from("dish_steps").select("*", { count: "exact", head: true }).eq("dish_id", dish.id),
        supabase.from("dish_media").select("*", { count: "exact", head: true }).eq("dish_id", dish.id).eq("media_type", "image"),
      ]);

      const missing: string[] = [];
      if (!ingCount) missing.push("pelo menos 1 ingrediente");
      if (!stepCount) missing.push("pelo menos 1 passo de preparo");
      if (!mediaCount) missing.push("pelo menos 1 imagem hero");

      if (missing.length > 0) {
        setError(`Para publicar, o prato precisa ter: ${missing.join(", ")}.`);
        setLoading(false);
        return;
      }
    }

    const data = {
      name,
      slug: slugify(name),
      category_id: categoryId,
      station_id: stationId,
      short_description: shortDesc || null,
      yield_info: yieldInfo || null,
      plating_notes: platingNotes || null,
      prep_time_minutes: prepTime || null,
      is_published: isPublished,
      hero_image_path: heroImagePath || null,
    };

    if (dish) {
      const { error: dbError } = await supabase.from("dishes").update(data).eq("id", dish.id);
      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }
      // Save video to dish_media if uploaded
      if (videoPath) {
        await supabase.from("dish_media").insert({
          dish_id: dish.id,
          media_type: "video",
          storage_bucket: "dish-videos",
          storage_path: videoPath,
          file_name: videoPath.split("/").pop(),
          mime_type: "video/mp4",
          is_primary: true,
        });
      }
    } else {
      const { data: newDish, error: dbError } = await supabase.from("dishes").insert(data).select().single();
      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }
      // Save video to dish_media if uploaded
      if (videoPath && newDish) {
        await supabase.from("dish_media").insert({
          dish_id: newDish.id,
          media_type: "video",
          storage_bucket: "dish-videos",
          storage_path: videoPath,
          file_name: videoPath.split("/").pop(),
          mime_type: "video/mp4",
          is_primary: true,
        });
      }
    }

    router.push("/admin/pratos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl pb-8">
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Informacoes do Prato</h3>
        <Input id="name" label="Nome do prato" value={name} onChange={(e) => setName(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">Categoria</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base">
              <option value="">Selecione...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">Praca</label>
            <select value={stationId} onChange={(e) => setStationId(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base">
              <option value="">Selecione...</option>
              {stations.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <Textarea id="desc" label="Descricao curta" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input id="yield" label="Rendimento" value={yieldInfo} onChange={(e) => setYieldInfo(e.target.value)} placeholder="Ex: 10 porcoes" />
          <Input id="prep" label="Tempo de preparo (min)" type="number" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} />
        </div>
        <Textarea id="plating" label="Observacoes de montagem/empratamento" value={platingNotes} onChange={(e) => setPlatingNotes(e.target.value)} />
        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-colors"
          style={{ borderColor: isPublished ? '#16a34a' : '#d97706', backgroundColor: isPublished ? '#f0fdf4' : '#fffbeb' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: isPublished ? '#15803d' : '#b45309' }}>
              {isPublished ? 'Publicado' : 'Rascunho'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: isPublished ? '#16a34a' : '#d97706' }}>
              {isPublished
                ? 'Visivel para a equipe operacional'
                : 'Apenas admins podem visualizar'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPublished}
            onClick={() => setIsPublished(!isPublished)}
            className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: isPublished ? '#16a34a' : '#d1d5db' }}
          >
            <span
              className="pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out"
              style={{ transform: isPublished ? 'translateX(1.75rem)' : 'translateX(0)' }}
            />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Midias</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">Foto do prato (hero image)</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const supabase = createClient();
              const path = `dishes/${Date.now()}_${file.name}`;
              const { data, error } = await supabase.storage.from("dish-images").upload(path, file);
              if (error) {
                setError("Erro no upload da imagem: " + error.message);
                return;
              }
              setHeroImagePath(data.path);
            }}
            className="block w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          {heroImagePath && (
            <div className="mt-2">
              <img src={`https://facdbydtkqabmxkdcugp.supabase.co/storage/v1/object/public/dish-images/${heroImagePath}`} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              <button type="button" onClick={() => setHeroImagePath("")} className="text-sm text-red-600 mt-1">Remover</button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">Video tutorial</label>
          <input
            type="file"
            accept="video/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const supabase = createClient();
              const path = `dishes/${Date.now()}_${file.name}`;
              const { data, error } = await supabase.storage.from("dish-videos").upload(path, file);
              if (error) {
                setError("Erro no upload do video: " + error.message);
                return;
              }
              setVideoPath(data.path);
            }}
            className="block w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          {videoPath && (
            <div className="mt-2">
              <video src={`https://facdbydtkqabmxkdcugp.supabase.co/storage/v1/object/public/dish-videos/${videoPath}`} className="w-64 rounded-lg" controls />
              <button type="button" onClick={() => setVideoPath("")} className="text-sm text-red-600 mt-1">Remover</button>
            </div>
          )}
        </div>
      </section>

      {dish && (
        <>
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Ingredientes e Gramatura</h3>
            <IngredientFieldArray dishId={dish.id} initialIngredients={existingIngredients} />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Passo a Passo</h3>
            <PreparationStepsEditor dishId={dish.id} initialSteps={existingSteps} />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Midias Adicionais</h3>
            <MediaUpload dishId={dish.id} />
          </section>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : dish ? "Atualizar Prato" : "Criar Prato"}</Button>
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
