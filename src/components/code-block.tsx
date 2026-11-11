export function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-lg text-fg">{title}</h3>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-bg p-4 text-sm text-primary">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="text-primary underline underline-offset-4" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
      {children}
    </span>
  );
}
