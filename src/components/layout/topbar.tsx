type TopbarProps = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function Topbar({ title, subtitle, badge }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
            COTI Restaurante
          </p>
          <div>
            <h1 className="text-lg font-semibold text-foreground sm:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-muted sm:text-base">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {badge ? (
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground">
            {badge}
          </span>
        ) : null}
      </div>
    </header>
  );
}