import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

type BottomNavProps = {
  items?: NavItem[];
};

const defaultItems: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/categorias", label: "Categorias" },
  { href: "/pracas", label: "Praças" },
  { href: "/checklist", label: "Checklist" },
];

export function BottomNav({ items = defaultItems }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-border/70 bg-surface/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-4 gap-2 px-3 py-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl px-3 py-2 text-center text-sm font-medium text-muted transition hover:bg-brand-soft hover:text-brand"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}