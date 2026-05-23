"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ChecklistItem {
  id: string;
  description: string;
  requires_photo: boolean;
  requires_video: boolean;
  status?: string;
  notes?: string;
}

export default function SalaoChecklistDetailPage({ params }: { params: { id: string } }) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [checklistName, setChecklistName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadChecklist();
  }, [params.id]);

  async function loadChecklist() {
    const { data: checklist } = await supabase
      .from('checklists')
      .select('name')
      .eq('id', params.id)
      .single();

    if (checklist) setChecklistName(checklist.name);

    const { data: itemsData } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('checklist_id', params.id)
      .eq('is_active', true)
      .order('display_order');

    if (itemsData) setItems(itemsData);
    setLoading(false);
  }

  async function toggleItem(itemId: string, status: string) {
    setSaving(true);
    
    const { error } = await supabase
      .from('checklist_responses')
      .upsert({
        checklist_id: params.id,
        item_id: itemId,
        status: status,
        user_name: 'Funcionário',
        completed_at: status === 'concluido' ? new Date().toISOString() : null
      }, {
        onConflict: 'checklist_id,item_id'
      });

    if (!error) {
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      ));
    }
    
    setSaving(false);
  }

  const progress = items.length > 0 
    ? Math.round((items.filter(i => i.status === 'concluido').length / items.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <Link href="/salao/checklist">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar</span>
          </div>
        </Link>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">{checklistName}</h1>
          
          {/* Progresso */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progresso</span>
              <span className="text-blue-500 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Itens */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`bg-gray-800 border rounded-xl p-4 transition-all ${
                item.status === 'concluido' 
                  ? 'border-green-600/50 bg-green-900/20' 
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleItem(item.id, item.status === 'concluido' ? 'pendente' : 'concluido')}
                  disabled={saving}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                    item.status === 'concluido'
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-500 hover:border-blue-500'
                  }`}
                >
                  {item.status === 'concluido' && <Check size={14} className="text-white" />}
                </button>
                
                <div className="flex-1">
                  <p className={`text-sm ${
                    item.status === 'concluido' ? 'text-gray-400 line-through' : 'text-white'
                  }`}>
                    {item.description}
                  </p>
                  
                  {/* Ações */}
                  <div className="flex items-center gap-2 mt-2">
                    {(item.requires_photo || item.requires_video) && (
                      <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                        <Camera size={14} />
                        {item.requires_photo ? 'Foto' : 'Vídeo'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {saving && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Salvando...
          </div>
        )}
      </div>
    </div>
  );
}
