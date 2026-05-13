"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Dashboard",
  pratos: "Pratos",
  categorias: "Categorias",
  pracas: "Pracas",
  checklists: "Checklists",
  novo: "Novo",
};

function getLabel(segment: string): string {
  // UUID pattern — probably an edit page
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (UUID_RE.test(segment)) return "Editar";
  return SEGMENT_LABELS[segment] ?? segment;
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  const segments = pathname.split("/").filter(Boolean);
  // segments = ["admin", "pratos", ...]

  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({ label: getLabel(seg), href: path });
  }

  if (crumbs.length <= 1) return null; // Only "Dashboard" — no need for breadcrumbs

  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex items-center gap-1 px-4 py-2 text-xs text-text-muted bg-beige border-b border-border overflow-x-auto whitespace-nowrap"
    >
      <Link href="/admin" className="flex items-center gap-1 hover:text-primary transition-colors shrink-0">
        <Home size={12} />
        <span>Dashboard</span>
      </Link>
      {crumbs.slice(1).map((crumb, idx) => {
        const isLast = idx === crumbs.length - 2;
        return (
          <span key={crumb.href} className="flex items-center gap-1 shrink-0">
            <ChevronRight size={12} />
            {isLast ? (
              <span className="font-medium text-text">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
