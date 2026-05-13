"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/types/dish";

interface Props {
  category?: Category;
}

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [displayOrder, setDisplayOrder] = useState(category?.display_order || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const data = { name, slug: slugify(name), description: description || null, display_order: displayOrder };

    if (category) {
      await supabase.from("categories").update(data).eq("id", category.id);
    } else {
      await supabase.from("categories").insert(data);
    }

    router.push("/admin/categorias");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <Input id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea id="desc" label="Descricao" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input id="order" label="Ordem de exibicao" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : category ? "Atualizar" : "Criar"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}
