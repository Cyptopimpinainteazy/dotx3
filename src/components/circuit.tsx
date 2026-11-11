const NODES = [
  [80, 70],
  [220, 150],
  [400, 80],
  [560, 180],
  [720, 90],
  [140, 280],
  [320, 320],
  [500, 260],
  [680, 330],
  [400, 200],
] as const;

const LINES = [
  "M80 70 L220 150 L400 200 L560 180 L720 90",
  "M140 280 L320 320 L500 260 L680 330",
  "M220 150 L140 280",
  "M400 80 L400 200 L320 320",
  "M560 180 L500 260",
];

export function Circuit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="circuit-lines" fill="none" stroke="currentColor" strokeWidth="1.25">
        {LINES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {NODES.map(([cx, cy], i) => (
        <circle key={`${cx}-${cy}`} className="circuit-node" cx={cx} cy={cy} r={i % 3 === 0 ? 4 : 2.5} style={{ animationDelay: `${i * 180}ms` }} />
      ))}
    </svg>
  );
}

const STEPS = [
  { label: "Proof", detail: "Invariant" },
  { label: "Decision", detail: "Executable path" },
  { label: "Agents", detail: "Bounded action" },
  { label: "Settle", detail: "1Click route" },
];

export function ProofFlow({ steps = STEPS }: { steps?: readonly { label: string; detail: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.label} className="flow-step relative rounded-xl border border-border bg-bg p-5" style={{ animationDelay: `${i * 120}ms` }}>
          <span className="font-display text-xs tracking-widest text-primary">0{i + 1}</span>
          <p className="mt-2 font-display text-xl text-fg">{step.label}</p>
          <p className="mt-1 text-sm text-muted">{step.detail}</p>
          {i < steps.length - 1 ? <span className="flow-link" aria-hidden="true" /> : null}
        </li>
      ))}
    </ol>
  );
}

const CHAINS = ["NEAR", "ETH", "SOL", "ARB", "BTC", "BASE", "USDC", "X3VM"];

export function RouteTicker() {
  const row = [...CHAINS, ...CHAINS];
  return (
    <div className="ticker border-y border-border bg-surface" aria-hidden="true">
      <div className="ticker-track">
        {row.map((name, i) => (
          <span key={`${name}-${i}`} className="font-display text-sm tracking-widest text-muted">
            {name}
            <span className="mx-4 text-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
