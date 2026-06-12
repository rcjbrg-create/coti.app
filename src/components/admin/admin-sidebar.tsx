"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, UtensilsCrossed, FolderOpen, ChefHat, ClipboardList } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/protected", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/protected/pratos", label: "Pratos", icon: UtensilsCrossed },
  { href: "/admin/protected/categorias", label: "Categorias", icon: FolderOpen },
  { href: "/admin/protected/pracas", label: "Pracas", icon: ChefHat },
  { href: "/admin/protected/checklists", label: "Checklists", icon: ClipboardList },
];

interface Props {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors touch-target",
              isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-beige hover:text-text"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
