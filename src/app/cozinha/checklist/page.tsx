import Link from "next/link";
import { ArrowLeft, ClipboardList, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function CozinhaChecklistPage() {
  const supabase = await createClient();
  
  const { data: checklists } = await supabase
    .from('checklists')
    .select('*')
    .eq('sector', 'cozinha')
    .eq('is_active', true)
    .order('display_order');

  // Agrupar por frequência
  const grouped = {
    diario: checklists?.filter(c => c.frequency === 'diario') || [],
    semanal: checklists?.filter(c => c.frequency === 'semanal') || [],
    quinzenal: checklists?.filter(c => c.frequency === 'quinzenal') || []
  };

  const frequencyLabels: Record<string, string> = {
    diario: '📅 Diário',
    semanal: '📆 Semanal',
    quinzenal: '📅 Quinzenal'
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <Link href="/cozinha">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar</span>
          </div>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-orange-500">Checklist - Cozinha</h1>
          <p className="text-gray-400 text-sm mt-1">Selecione o checklist do dia</p>
        </div>

        {/* Checklists agrupados */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([freq, items]) => 
            items.length > 0 ? (
              <div key={freq}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {frequencyLabels[freq]}
                </h2>
                <div className="space-y-2">
                  {items.map(checklist => (
                    <Link key={checklist.id} href={`/cozinha/checklist/${checklist.id}`}>
                      <div className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <ClipboardList size={20} className="text-orange-500" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{checklist.name}</h3>
                              {checklist.assigned_groups && (
                                <p className="text-xs text-gray-400">
                                  Responsável: {checklist.assigned_groups.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-gray-500" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
