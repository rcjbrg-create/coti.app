import { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="Operação Padronizada"
      subtitle="Acesse categorias, praças e fichas técnicas com poucos toques."
      badge="PWA"
    >
      {children}
    </AppShell>
  );
}