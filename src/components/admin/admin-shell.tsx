"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./admin-sidebar";
import { AdminBreadcrumbs } from "./admin-breadcrumbs";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function AdminShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-beige">
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden touch-target">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/admin" className="text-lg font-bold">COTI Admin</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-white/70 hover:text-white">Ver site</Link>
            <button onClick={handleLogout} className="p-2 text-white/70 hover:text-white touch-target">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className={cn(
          "fixed inset-y-14 left-0 z-30 w-64 bg-surface border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:inset-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 min-h-[calc(100vh-3.5rem)] pb-8">
          <AdminBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
