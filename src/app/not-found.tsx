import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          Conteúdo não encontrado
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Verifique o caminho acessado ou volte para a página inicial do app.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground"
        >
          Ir para o início
        </Link>
      </div>
    </div>
  );
}