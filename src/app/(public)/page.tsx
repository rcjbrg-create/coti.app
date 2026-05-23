import Link from "next/link";
import { ChefHat, Wine, Settings } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Logo COTI */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-2xl">
          <Image src="/logo-coti.png" alt="COTI" width={70} height={70} className="object-cover rounded-full" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-1">COTI</h1>
        <p className="text-text-muted text-sm">Restaurante & Bar</p>
      </div>

      {/* Botões principais */}
      <div className="w-full max-w-sm space-y-3 px-4">
        <Link href="/cozinha">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white p-5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ChefHat size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Cozinha</h2>
                <p className="text-orange-100 text-xs">Checklists e Fichas Técnicas</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/salao">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wine size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Salão</h2>
                <p className="text-blue-100 text-xs">Checklists e Drinks</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-green-500 font-mono">VERSÃO 2.0 - COZINHA E SALÃO</p>
      </div>

      {/* Acesso Admin */}
      <Link href="/admin">
        <div className="mt-6 flex items-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <Settings size={16} />
          <span className="text-xs">Acesso Administrativo</span>
        </div>
      </Link>
    </div>
  );
}
