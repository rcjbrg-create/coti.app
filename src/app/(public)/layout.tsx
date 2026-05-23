import { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="COTI Restaurante"
      subtitle="Escolha o setor para começar."
      badge="PWA"
    >
      {children}
    </AppShell>
  );
}