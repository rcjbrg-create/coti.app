"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCategoria, updateCategoria } from "@/lib/actions/categorias";
import { createClient } from "@/lib/supabase/browser";
import type { Category } from "@/types/dish";

interface Props {
  category?: Category;
}

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [displayOrder, setDisplayOrder] = useState(category?.display_order || 0);
  const [coverImage, setCoverImage] = useState<string>(category?.cover_image_path || "");

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const path = `categories/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("category-covers").upload(path, file);
    if (error) {
      setError("Erro no upload da imagem: " + error.message);
      return null;
    }
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = category 
        ? await updateCategoria(category.id, { name, description, display_order: displayOrder, cover_image_path: coverImage || null })
        : await createCategoria({ name, description, display_order: displayOrder, cover_image_path: coverImage || null });

      if (!result.success) {
        setError(result.error || "Erro ao salvar");
        setLoading(false);
        return;
      }

      router.push("/admin/categorias");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar categoria");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <Input id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea id="desc" label="Descricao" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input id="order" label="Ordem de exibicao" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">Imagem de capa</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const path = await uploadImage(file);
            if (path) setCoverImage(path);
          }}
          className="block w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
        />
        {coverImage && (
          <div className="mt-2">
            <img 
              src={`https://facdbydtkqabmxkdcugp.supabase.co/storage/v1/object/public/category-covers/${coverImage}`} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-lg" 
            />
            <button type="button" onClick={() => setCoverImage("")} className="text-sm text-red-600 mt-1">Remover</button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : category ? "Atualizar" : "Criar"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}
