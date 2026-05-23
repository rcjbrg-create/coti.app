import Link from "next/link";
import { ChefHat, Wine, Settings } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 -mt-16">
      {/* Logo COTI */}
      <div className="mb-12 text-center">
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-2xl">
          <Image src="/logo-coti.png" alt="COTI" width={80} height={80} className="object-cover rounded-full" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">COTI</h1>
        <p className="text-text-muted text-sm">Restaurante & Bar</p>
      </div>

      {/* Botões principais */}
      <div className="w-full max-w-sm space-y-4">
        <Link href="/cozinha">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white p-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <ChefHat size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Cozinha</h2>
                <p className="text-orange-100 text-sm">Checklists e Fichas Técnicas</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/salao">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Wine size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Salão</h2>
                <p className="text-blue-100 text-sm">Checklists e Drinks</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Acesso Admin */}
      <Link href="/admin">
        <div className="mt-8 flex items-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <Settings size={18} />
          <span className="text-sm">Acesso Administrativo</span>
        </div>
      </Link>
    </div>
  );
}
