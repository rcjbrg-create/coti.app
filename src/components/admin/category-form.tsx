"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCategoria, updateCategoria } from "@/lib/actions/categorias";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = category 
        ? await updateCategoria(category.id, { name, description, display_order: displayOrder })
        : await createCategoria({ name, description, display_order: displayOrder });

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
