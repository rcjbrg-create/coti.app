import { Badge } from "@/components/ui/badge";

interface Props {
  checklist: any;
}

const FREQUENCY_LABELS: Record<string, string> = {
  diario: "Diario",
  semanal: "Semanal",
  mensal: "Mensal",
};

export function ChecklistCard({ checklist }: Props) {
  const items = checklist.items || [];

  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text">{checklist.name}</h3>
        <Badge>{FREQUENCY_LABELS[checklist.frequency] || checklist.frequency}</Badge>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item: any) => (
            <li key={item.id} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded border-2 border-border mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-text">{item.description}</p>
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
