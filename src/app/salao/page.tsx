import Link from "next/link";
import { ClipboardCheck, Wine, ArrowLeft } from "lucide-react";

export default function SalaoPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="w-full max-w-sm mb-8">
        <Link href="/">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar</span>
          </div>
        </Link>
        
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-500">Salão</h1>
        </div>
      </div>

      {/* Opções */}
      <div className="w-full max-w-sm space-y-4">
        <Link href="/salao/checklist">
          <div className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <ClipboardCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Checklist Diário</h2>
                <p className="text-green-100 text-sm">Atividades obrigatórias</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/categorias/drinks">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white p-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Wine size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Drinks</h2>
                <p className="text-pink-100 text-sm">Receitas e preparos</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
