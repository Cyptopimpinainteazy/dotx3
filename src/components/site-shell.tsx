import { CopyPage } from "@/components/copy-page";
import { Link } from "@tanstack/react-router";
import { Circuit } from "@/components/circuit";
import { SiteFooterNav, SiteHeader } from "@/components/site-nav";
import { slugify } from "@/lib/site-nav";
import { EVIDENCE_SNAPSHOT, LINKS } from "@/lib/front-door";

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
  return (
    <div data-page-content className="min-h-screen bg-bg text-fg">
      <SiteHeader />

      <section className="hero-wash relative overflow-hidden border-b border-border">
        <Circuit className="pointer-events-none absolute inset-0 h-full w-full text-primary opacity-50" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center md:py-24">
          {eyebrow ? (
            <p className="rise rise-1 font-display text-xs tracking-widest text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}
          {media ? <div className="mark-float rise rise-2 w-full max-w-3xl">{media}</div> : null}
          <CopyPage />
          <h1 className="rise rise-3 font-display text-4xl leading-tight text-fg md:text-6xl">
            {title}
          </h1>
          <p className="rise rise-4 max-w-2xl text-lg text-muted">{lede}</p>
          {actions ? (
            <div className="rise rise-4 flex flex-wrap justify-center gap-3">{actions}</div>
          ) : null}
        </div>
      </section>

      <main id="main" tabIndex={-1} className="scroll-mt-20 outline-none">
        {children}
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SiteFooterNav />
          <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
            <p>dotx3.net — public front door for .x3</p>
            <p className="mt-2">
              Mainnet, testnet and local evidence are labeled separately. Guard authorization does
              not establish custody or atomic settlement.
            </p>
            <p className="mt-2 text-xs">
              Reviewed {EVIDENCE_SNAPSHOT.dateLabel} · <a href={LINKS.reviewedSource} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">X3Lang {EVIDENCE_SNAPSHOT.commit.slice(0, 7)}</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-3">{children}</div>;
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
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
  id,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  alt?: boolean;
  /** Anchor for deep links; defaults to slugify(title), which the site nav relies on. */
  id?: string;
}) {
  return (
    <section id={id ?? slugify(title)} className={`scroll-mt-20 ${alt ? "bg-surface" : "bg-bg"}`}>
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

/** ActionLink for a static file under public/ (such as the arcade), which the router must not handle. */
export function StaticActionLink({
  href,
  children,
  outline,
}: {
  href: string;
  children: React.ReactNode;
  outline?: boolean;
}) {
  const cls = outline
    ? "border border-primary text-primary hover:bg-primary/10"
    : "bg-primary text-bg hover:brightness-110";
  return (
    <a
      href={href}
      className={`tap inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold ${cls}`}
    >
      {children}
    </a>
  );
}
