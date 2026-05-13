"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { reorderPraca } from "@/lib/actions/pracas";

interface Praca {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

interface Props {
  stations: Praca[];
}

export function PracasReorderList({ stations }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleReorder = (id: string, direction: "up" | "down") => {
    setActiveId(id);
    startTransition(async () => {
      await reorderPraca(id, direction);
      router.refresh();
      setActiveId(null);
    });
  };

  return (
    <div className="space-y-2">
      {stations.map((s, idx) => (
        <div
          key={s.id}
          className="flex items-center gap-2 p-4 bg-surface rounded-xl border border-border hover:shadow-sm"
        >
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              onClick={() => handleReorder(s.id, "up")}
              disabled={idx === 0 || (pending && activeId === s.id)}
              className="p-1 rounded text-text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Mover para cima"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={() => handleReorder(s.id, "down")}
              disabled={idx === stations.length - 1 || (pending && activeId === s.id)}
              className="p-1 rounded text-text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Mover para baixo"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <span className="text-xs text-text-muted w-6 text-center shrink-0 font-mono">
            {s.display_order}
          </span>

          <Link
            href={`/admin/pracas/${s.id}`}
            className="flex items-center justify-between flex-1 min-w-0"
          >
            <div className="min-w-0">
              <p className="font-medium text-text truncate">{s.name}</p>
              <p className="text-sm text-text-muted truncate">{s.description || "Sem descricao"}</p>
            </div>
            <Pencil size={16} className="text-text-muted ml-2 shrink-0" />
          </Link>
        </div>
      ))}
    </div>
  );
}
