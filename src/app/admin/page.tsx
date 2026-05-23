import Link from "next/link";
import { ArrowLeft, Users, ClipboardCheck, TrendingUp, Download, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  // Buscar estatísticas
  const { data: checklists } = await supabase
    .from('checklists')
    .select('id, sector');
    
  const { data: responses } = await supabase
    .from('checklist_responses')
    .select('status, completed_at, user_name');
    
  const { data: users } = await supabase
    .from('users')
    .select('name, sector')
    .eq('active', true);

  // Calcular estatísticas
  const totalChecklists = checklists?.length || 0;
  const totalResponses = responses?.length || 0;
  const completedResponses = responses?.filter(r => r.status === 'concluido').length || 0;
  const completionRate = totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0;
  
  // Por setor
  const cozinhaChecklists = checklists?.filter(c => c.sector === 'cozinha').length || 0;
  const salaoChecklists = checklists?.filter(c => c.sector === 'salao').length || 0;
  
  // Ranking de funcionários
  const userPerformance = {};
  responses?.forEach(r => {
    if (!userPerformance[r.user_name]) {
      userPerformance[r.user_name] = { total: 0, completed: 0 };
    }
    userPerformance[r.user_name].total++;
    if (r.status === 'concluido') userPerformance[r.user_name].completed++;
  });
  
  const ranking = Object.entries(userPerformance)
    .map(([name, stats]) => ({
      name,
      rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      completed: stats.completed,
      total: stats.total
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar</span>
          </div>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-amber-500">Dashboard Administrativo</h1>
          <p className="text-gray-400 text-sm">Visão geral em tempo real</p>
        </div>

        {/* Cards de indicadores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <ClipboardCheck size={18} />
              <span className="text-xs">Checklists</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalChecklists}</p>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingUp size={18} />
              <span className="text-xs">Conclusão</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{completionRate}%</p>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Users size={18} />
              <span className="text-xs">Funcionários</span>
            </div>
            <p className="text-2xl font-bold text-white">{users?.length || 0}</p>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Calendar size={18} />
              <span className="text-xs">Hoje</span>
            </div>
            <p className="text-2xl font-bold text-white">{completedResponses}</p>
          </div>
        </div>

        {/* Desempenho por setor */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Desempenho por Setor</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Cozinha</span>
                <span className="text-orange-500">{cozinhaChecklists} checklists</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Salão</span>
                <span className="text-blue-500">{salaoChecklists} checklists</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Ranking de funcionários */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Ranking de Funcionários</h2>
          
          <div className="space-y-3">
            {ranking.length > 0 ? ranking.map((user, index) => (
              <div key={user.name} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-amber-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-700 text-white' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.completed}/{user.total} tarefas</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{user.rate}%</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Nenhum dado disponível ainda</p>
            )}
          </div>
        </div>

        {/* Exportação de relatórios */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Relatórios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg transition-colors">
              <Download size={18} />
              <span className="text-sm">Exportar Excel</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg transition-colors">
              <Download size={18} />
              <span className="text-sm">Exportar CSV</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white p-3 rounded-lg transition-colors">
              <Download size={18} />
              <span className="text-sm">Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
