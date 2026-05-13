import { Badge } from "@/components/ui/badge";

interface Props {
  checklist: any;
}

const SHIFT_LABELS: Record<string, string> = {
  abertura: "Abertura",
  producao: "Producao",
  fechamento: "Fechamento",
};

export function ChecklistCard({ checklist }: Props) {
  const items = checklist.items || [];

  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text">{checklist.title}</h3>
        <Badge>{SHIFT_LABELS[checklist.shift] || checklist.shift}</Badge>
      </div>

      {checklist.description && (
        <p className="text-sm text-text-muted mb-3">{checklist.description}</p>
      )}

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item: any) => (
            <li key={item.id} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded border-2 border-border mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-text">{item.item_label}</p>
                {item.item_description && (
                  <p className="text-xs text-text-muted">{item.item_description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-muted">Nenhum item neste checklist.</p>
      )}
    </div>
  );
}
