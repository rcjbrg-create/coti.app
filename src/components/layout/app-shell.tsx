import { ReactNode } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  showBottomNav?: boolean;
};

export function AppShell({
  children,
  title,
  subtitle,
  badge,
  showBottomNav = true,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {title ? <Topbar title={title} subtitle={subtitle} badge={badge} /> : null}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}