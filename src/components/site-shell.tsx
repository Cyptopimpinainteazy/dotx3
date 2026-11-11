import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Circuit } from "@/components/circuit";

const LINKS = [
  { to: "/dex", label: "DEX" },
  { to: "/demo", label: "Try the Demo" },
  { to: "/bootcamp", label: "Bootcamp" },
  { to: "/developers", label: "View the Code" },
  { to: "/proof", label: "Inspect the Proof" },
  { to: "/playground", label: "Playground" },
  { to: "/language", label: "Language" },
  { to: "/back", label: "Back .x3" },
] as const;

function isActive(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function SiteShell({
  children,
  eyebrow,
  title,
  lede,
  media,
  actions,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  lede: string;
  media?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-display text-2xl tracking-wide text-primary">
            .X<span className="text-accent">3</span>
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg border border-border text-fg md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <ul
            className={`${open ? "flex" : "hidden"} absolute top-full right-5 left-5 mt-2 flex-col gap-1 rounded-xl border border-border bg-surface p-2 md:static md:mt-0 md:flex md:flex-row md:flex-wrap md:justify-end md:gap-1 md:border-0 md:bg-transparent md:p-0`}
          >
            {LINKS.map((link) => {
              const active = isActive(path, link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`tap block rounded-lg px-3 py-2 text-sm font-medium ${
                      active ? "bg-surface-2 text-primary md:bg-transparent" : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      <section className="hero-wash relative overflow-hidden border-b border-border">
        <Circuit className="pointer-events-none absolute inset-0 h-full w-full text-primary opacity-50" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center md:py-24">
          {eyebrow ? (
            <p className="rise rise-1 font-display text-xs tracking-widest text-accent uppercase">{eyebrow}</p>
          ) : null}
          {media ? <div className="mark-float rise rise-2 w-full max-w-3xl">{media}</div> : null}
          <h1 className="rise rise-3 font-display text-4xl leading-tight text-fg md:text-6xl">{title}</h1>
          <p className="rise rise-4 max-w-2xl text-lg text-muted">{lede}</p>
          {actions ? <div className="rise rise-4 flex flex-wrap justify-center gap-3">{actions}</div> : null}
        </div>
      </section>

      <main>{children}</main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-10 text-center text-sm text-muted">
          <p>dotx3.net — public front door for .x3</p>
          <p className="mt-2">Testnet and local evidence. Not an offer of securities. Not a mainnet settlement.</p>
        </div>
      </footer>
    </div>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-3">{children}</div>;
}

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="card-lift rounded-xl border border-border bg-surface p-6 hover:border-primary/40">
      <h3 className="font-display text-xl text-accent">{title}</h3>
      <div className="mt-3 text-muted">{children}</div>
    </article>
  );
}

export function Section({
  title,
  intro,
  children,
  alt,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section className={alt ? "bg-surface" : "bg-bg"}>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center font-display text-3xl text-primary md:text-4xl">{title}</h2>
        {intro ? <p className="mx-auto mt-4 max-w-2xl text-center text-muted">{intro}</p> : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function ActionLink({
  to,
  children,
  outline,
}: {
  to: string;
  children: React.ReactNode;
  outline?: boolean;
}) {
  const cls = outline
    ? "border border-primary text-primary hover:bg-primary/10"
    : "bg-primary text-bg hover:brightness-110";
  return (
    <Link
      to={to}
      className={`tap inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold ${cls}`}
    >
      {children}
    </Link>
  );
}
