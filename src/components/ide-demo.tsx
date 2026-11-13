// A small, honest slice of the Super IDE that runs in the browser: the editor checks .x3 with
// the real x3lang compiler (/api/compile), and the explorer and inspector read NEAR testnet
// through /api/near/testnet. Nothing here signs, sends or stores anything.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatNear } from "@/lib/near-testnet";

type Tab = "editor" | "explorer" | "inspector";
type Sources = { program: string; mandate: string };
type Report = {
  decision: string;
  compiled: boolean;
  program_sha256: string;
  error?: { code: string; message: string };
  policy?: { checks: { guard: string; ok: boolean; detail?: string }[] };
};
type Block = { height: number; hash: string; time: string | null; author: string; gasUsed: string; chunks: { hash: string; shard: number; txs: boolean }[] };
type ChainTx = { hash: string; signerId: string; receiverId: string; actions: string[] };
type TxView = { hash: string; signerId: string; receiverId: string; status: string; failure: unknown; gasBurnt: string; logs: string[]; actions: string[] };
type Account = { accountId: string; amount: string; locked: string; storageUsage: number; codeHash: string; hasContract: boolean; blockHeight: number };

async function testnet<T>(params: Record<string, string>): Promise<T> {
  const res = await fetch(`/api/near/testnet?${new URLSearchParams(params)}`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) throw new Error("The testnet reader isn't deployed on this host.");
  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? body.error ?? "Testnet lookup failed");
  return body.result as T;
}

const DECISIONS: Record<string, { label: string; tone: "ok" | "warn" | "bad" }> = {
  preflight_passed: { label: "Compiles · the owner's mandate allows it", tone: "ok" },
  approval_required: { label: "Compiles · needs the owner's approval", tone: "warn" },
  denied_by_policy: { label: "Compiles · the owner's mandate refuses it", tone: "bad" },
  compile_error: { label: "The compiler rejected the program", tone: "bad" },
  mandate_error: { label: "The mandate could not be evaluated", tone: "bad" },
};

const toneClass = { ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", warn: "border-amber-400/40 bg-amber-400/10 text-amber-200", bad: "border-red-500/40 bg-red-500/10 text-red-300" };

function CodeArea({ value, onChange, label, highlight }: { value: string; onChange: (v: string) => void; label: string; highlight?: number }) {
  const gutter = useRef<HTMLDivElement>(null);
  const lines = value.split("\n").length;
  return (
    <div className="relative flex h-[22rem] min-h-0 overflow-hidden bg-bg font-mono text-[12.5px] leading-[1.6]">
      <div ref={gutter} aria-hidden className="w-11 shrink-0 select-none overflow-hidden border-r border-border py-3 pr-2 text-right text-muted/60">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={highlight === i + 1 ? "text-accent" : undefined}>{i + 1}</div>
        ))}
      </div>
      <textarea
        aria-label={label}
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop; }}
        className="h-full w-full resize-none bg-transparent px-3 py-3 text-fg caret-primary outline-none"
        style={{ whiteSpace: "pre", overflowWrap: "normal" }}
      />
    </div>
  );
}

function EditorView() {
  const [src, setSrc] = useState<Sources | null>(null);
  const [original, setOriginal] = useState<Sources | null>(null);
  const [file, setFile] = useState<keyof Sources>("program");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Each check and each edit bumps this; a response is only shown if nothing changed since.
  const seq = useRef(0);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/labs/compiler/examples.json", { signal: ac.signal })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: Sources) => { setSrc({ program: d.program, mandate: d.mandate }); setOriginal({ program: d.program, mandate: d.mandate }); })
      .catch((e) => { if (e.name !== "AbortError") setError("Couldn't load the example sources."); });
    return () => ac.abort();
  }, []);

  const check = useCallback(async (next?: Sources) => {
    const body = next ?? src;
    if (!body || busy) return;
    if (next) setSrc(next);
    const mine = ++seq.current;
    setBusy(true); setError(""); setReport(null);
    try {
      const res = await fetch("/api/compile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
      if (!(res.headers.get("content-type") ?? "").includes("application/json")) throw new Error("The compiler isn't deployed on this host.");
      const r = await res.json();
      if (!res.ok) throw new Error(r.error ?? "Compiler unavailable");
      if (mine === seq.current) setReport(r);
    } catch (e) {
      if (mine === seq.current) setError(e instanceof Error ? e.message : "Compiler unavailable");
    } finally {
      setBusy(false);
    }
  }, [src, busy]);

  const attack = () => {
    if (!src) return;
    const program = src.program.replace(/(to\s+Near\.USDC\s+receiver\s+)\S+/, "$1attacker.near");
    if (program === src.program) { setError("No recipient line to change in this program."); return; }
    setFile("program");
    void check({ ...src, program });
  };

  const d = report ? DECISIONS[report.decision] ?? { label: report.decision, tone: "warn" as const } : null;
  const errLine = useMemo(() => {
    const m = report?.error?.message.match(/line (\d+)/i);
    return m ? Number(m[1]) : undefined;
  }, [report]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center border-b border-border bg-surface text-sm">
        {(["program", "mandate"] as const).map((f) => (
          <button key={f} onClick={() => setFile(f)}
            className={`border-r border-border px-3 py-2.5 font-mono text-[12px] sm:px-4 sm:text-[12.5px] ${file === f ? "bg-bg text-fg shadow-[inset_0_-2px_0_var(--color-primary)]" : "text-muted hover:text-fg"}`}>
            {f === "program" ? "agent_payment.x3" : "owner_mandate.x3"}
          </button>
        ))}
        <div className="ml-auto flex flex-wrap gap-2 px-2 py-1.5">
          <button onClick={() => void check()} disabled={!src || busy}
            className="rounded-md bg-primary px-3.5 py-1.5 text-[13px] font-semibold text-bg disabled:opacity-50">{busy ? "Checking…" : "▶ Check"}</button>
          <button onClick={attack} disabled={!src || busy}
            className="hidden rounded-md border border-border px-3 py-1.5 text-[13px] text-fg hover:border-accent sm:block">Try a recipient swap</button>
          <button onClick={() => { if (original) { seq.current++; setSrc(original); setReport(null); setError(""); } }} disabled={!src || busy}
            className="rounded-md px-2.5 py-1.5 text-[13px] text-muted hover:text-fg">Reset</button>
        </div>
      </div>
      {src ? (
        <CodeArea label={file === "program" ? "Agent payment source" : "Owner mandate source"} value={src[file]}
          onChange={(v) => { seq.current++; setSrc({ ...src, [file]: v }); setReport(null); setError(""); }} highlight={file === "program" ? errLine : undefined} />
      ) : (
        <div className="flex h-[22rem] items-center justify-center bg-bg text-sm text-muted">{error || "Loading the example…"}</div>
      )}
      <div className="min-h-[8.5rem] border-t border-border bg-surface px-4 py-3 text-sm" aria-live="polite">
        <div className="mb-2 text-[11px] tracking-widest text-muted uppercase">Problems · Output</div>
        {!report && !error && <p className="text-muted">Press <span className="text-fg">Check</span> to run the real x3lang compiler and the owner's mandate on this program. Then try editing an amount or the receiver.</p>}
        {error && <p className="text-red-300">{error}</p>}
        {report && d && (
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-semibold ${toneClass[d.tone]}`}>{d.label}</div>
            {report.error && <p className="font-mono text-[12.5px]"><span className="text-red-300">{report.error.code}</span> <span className="text-fg">{report.error.message}</span></p>}
            {report.policy?.checks && (
              <div className="flex flex-wrap gap-1.5">
                {report.policy.checks.map((c) => (
                  <span key={c.guard} title={c.detail} className={`rounded border px-2 py-0.5 font-mono text-[11.5px] ${c.ok ? "border-emerald-500/30 text-emerald-300" : "border-red-500/40 bg-red-500/10 text-red-300"}`}>
                    {c.ok ? "✓" : "✗"} {c.guard}
                  </span>
                ))}
              </div>
            )}
            <p className="font-mono text-[11px] text-muted">program sha256 {report.program_sha256.slice(0, 16)}… · local compile and policy check only, nothing is authorized or sent</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExplorerView({ onAccount }: { onAccount: (id: string) => void }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [error, setError] = useState("");
  const [sel, setSel] = useState<Block | null>(null);
  const [txs, setTxs] = useState<ChainTx[] | null>(null);
  const [tx, setTx] = useState<TxView | null>(null);
  const [busy, setBusy] = useState(false);
  const live = !sel;

  useEffect(() => {
    if (!live) return;
    let stop = false;
    const tick = async () => {
      if (document.hidden) return;
      try {
        const latest = await testnet<Block>({ m: "block" });
        setError("");
        setBlocks((prev) => (prev[0]?.height === latest.height ? prev : [latest, ...prev.filter((b) => b.height < latest.height)].slice(0, 10)));
      } catch (e) {
        if (!stop) setError(e instanceof Error ? e.message : "Testnet unavailable");
      }
    };
    void tick();
    const t = window.setInterval(tick, 3000);
    return () => { stop = true; window.clearInterval(t); };
  }, [live]);

  const open = async (b: Block) => {
    setSel(b); setTx(null); setTxs(null); setBusy(true);
    try {
      const withTxs = b.chunks.filter((c) => c.txs);
      const chunks = await Promise.all(withTxs.map((c) => testnet<{ transactions: ChainTx[] }>({ m: "chunk", id: c.hash })));
      setTxs(chunks.flatMap((c) => c.transactions));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
      setTxs([]);
    } finally { setBusy(false); }
  };
  const openTx = async (t: ChainTx) => {
    setBusy(true);
    try { setTx(await testnet<TxView>({ m: "tx", hash: t.hash, sender: t.signerId })); }
    catch (e) { setError(e instanceof Error ? e.message : "Lookup failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-bg p-4 text-sm" style={{ height: "30.5rem" }}>
      {error && <p className="mb-3 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-amber-200">{error}</p>}
      {!sel ? (
        <>
          <div className="mb-2 flex items-center gap-2 text-[11px] tracking-widest text-muted uppercase">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live NEAR testnet blocks
          </div>
          {blocks.length === 0 && !error && <p className="text-muted">Reading testnet…</p>}
          <table className="w-full text-left">
            <thead className="text-[11px] text-muted uppercase"><tr><th className="py-1.5 font-medium">Height</th><th className="font-medium">Hash</th><th className="hidden font-medium sm:table-cell">Producer</th><th className="text-right font-medium">Gas</th></tr></thead>
            <tbody>
              {blocks.map((b) => (
                <tr key={b.hash} onClick={() => void open(b)} className="cursor-pointer border-t border-border hover:bg-surface">
                  <td className="py-2 font-mono text-primary">#{b.height.toLocaleString("en-US")}</td>
                  <td className="font-mono text-muted">{b.hash.slice(0, 12)}…</td>
                  <td className="hidden max-w-[12rem] truncate font-mono text-muted sm:table-cell">{b.author}</td>
                  <td className="text-right font-mono">{(Number(b.gasUsed) / 1e12).toFixed(1)} Tgas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="space-y-3">
          <button onClick={() => { setSel(null); setTx(null); }} className="text-primary hover:underline">← Latest blocks</button>
          <div className="rounded-lg border border-border bg-surface p-3 font-mono text-[12.5px]">
            <div><span className="text-muted">block </span><span className="text-primary">#{sel.height.toLocaleString("en-US")}</span> <span className="text-muted">by</span> {sel.author}</div>
            <div className="truncate text-muted">{sel.hash}</div>
            <div className="text-muted">{sel.time ? new Date(sel.time).toLocaleString() : ""} · {(Number(sel.gasUsed) / 1e12).toFixed(2)} Tgas</div>
          </div>
          {busy && <p className="text-muted">Loading…</p>}
          {txs && !tx && (txs.length === 0 ? <p className="text-muted">No transactions in this block. Testnet blocks are often empty; go back and pick another.</p> : txs.map((t) => (
            <button key={t.hash} onClick={() => void openTx(t)} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-md px-2 py-1.5 text-left hover:bg-surface">
              <span className="font-mono text-primary">{t.hash.slice(0, 10)}…</span>
              <span className="truncate">{t.signerId} → {t.receiverId}</span>
              <span className="text-muted">{t.actions.join(", ")}</span>
            </button>
          )))}
          {tx && (
            <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
              <div className={`inline-block rounded border px-2 py-0.5 font-semibold ${tx.status === "succeeded" ? toneClass.ok : tx.status === "failed" ? toneClass.bad : toneClass.warn}`}>{tx.status}</div>
              <div className="font-mono text-[12.5px] break-all">{tx.hash}</div>
              <div><button className="text-primary hover:underline" onClick={() => onAccount(tx.signerId)}>{tx.signerId}</button> → <button className="text-primary hover:underline" onClick={() => tx.receiverId && onAccount(tx.receiverId)}>{tx.receiverId}</button></div>
              <div className="text-muted">{tx.actions.join(", ")} · {(Number(tx.gasBurnt) / 1e12).toFixed(3)} Tgas burnt</div>
              {tx.logs.length > 0 && <pre className="max-h-40 overflow-auto rounded bg-bg p-2 text-[11.5px] whitespace-pre-wrap">{tx.logs.join("\n")}</pre>}
              <a className="text-primary hover:underline" href={`https://testnet.nearblocks.io/txns/${tx.hash}`} target="_blank" rel="noreferrer">Open on NearBlocks ↗</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InspectorView({ initial }: { initial: string }) {
  const [id, setId] = useState(initial);
  const [acct, setAcct] = useState<Account | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const go = useCallback(async (target: string) => {
    if (!target) return;
    setBusy(true); setError(""); setAcct(null);
    try { setAcct(await testnet<Account>({ m: "account", id: target.trim().toLowerCase() })); }
    catch (e) { setError(e instanceof Error ? e.message : "Lookup failed"); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { setId(initial); void go(initial); }, [initial, go]);
  return (
    <div className="flex-1 overflow-auto bg-bg p-4 text-sm" style={{ height: "30.5rem" }}>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void go(id); }}>
        <input aria-label="Testnet account id" value={id} onChange={(e) => setId(e.target.value)} placeholder="account.testnet"
          className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 font-mono text-fg outline-none focus:border-primary" />
        <button disabled={busy} className="rounded-md bg-primary px-4 py-2 font-semibold text-bg disabled:opacity-50">{busy ? "…" : "Inspect"}</button>
      </form>
      {error && <p className="mt-3 text-red-300">{error}</p>}
      {acct && (
        <dl className="mt-4 grid grid-cols-[9rem_1fr] gap-x-4 gap-y-2 rounded-lg border border-border bg-surface p-4 font-mono text-[12.5px]">
          <dt className="text-muted">account</dt><dd className="text-primary">{acct.accountId}</dd>
          <dt className="text-muted">balance</dt><dd>{formatNear(acct.amount)} NEAR</dd>
          <dt className="text-muted">staked</dt><dd>{formatNear(acct.locked)} NEAR</dd>
          <dt className="text-muted">storage</dt><dd>{acct.storageUsage.toLocaleString("en-US")} bytes</dd>
          <dt className="text-muted">contract</dt><dd className="break-all">{acct.hasContract ? acct.codeHash : "none"}</dd>
          <dt className="text-muted">at block</dt><dd>#{acct.blockHeight.toLocaleString("en-US")}</dd>
        </dl>
      )}
      <p className="mt-4 text-muted">Read-only. The full IDE adds keys, deploys, calls, a transaction builder and a local devnet.</p>
    </div>
  );
}

export function IdeDemo() {
  const [tab, setTab] = useState<Tab>("editor");
  const [height, setHeight] = useState<number | null>(null);
  const [inspect, setInspect] = useState("testnet");
  useEffect(() => {
    let stop = false;
    const tick = async () => {
      if (document.hidden) return;
      try { const s = await testnet<{ height: number }>({ m: "status" }); if (!stop) setHeight(s.height); } catch { if (!stop) setHeight(null); }
    };
    void tick();
    const t = window.setInterval(tick, 6000);
    return () => { stop = true; window.clearInterval(t); };
  }, []);
  const rail: { id: Tab; label: string; icon: string }[] = [
    { id: "editor", label: "Editor", icon: "</>" },
    { id: "explorer", label: "Explorer", icon: "▦" },
    { id: "inspector", label: "Inspector", icon: "◎" },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_30px_80px_-30px_rgba(46,200,255,0.25)]">
      <div className="flex items-center gap-3 border-b border-border bg-bg px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden><span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" /></div>
        <span className="font-display text-sm whitespace-nowrap text-fg">Super IDE <span className="hidden text-muted sm:inline">· browser demo</span></span>
        <span className={`ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 whitespace-nowrap font-mono text-[11.5px] ${height ? "border-emerald-500/40 text-emerald-300" : "border-border text-muted"}`}>
          <span className={`h-2 w-2 rounded-full ${height ? "bg-emerald-400" : "bg-muted"}`} />NEAR testnet{height ? ` · #${height.toLocaleString("en-US")}` : ""}
        </span>
      </div>
      <div className="flex min-h-0">
        <nav className="flex w-14 shrink-0 flex-col gap-1 border-r border-border bg-bg py-2 sm:w-36" aria-label="Demo panels">
          {rail.map((r) => (
            <button key={r.id} onClick={() => setTab(r.id)} aria-pressed={tab === r.id}
              className={`mx-1.5 flex items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm ${tab === r.id ? "bg-primary/10 text-fg" : "text-muted hover:bg-surface hover:text-fg"}`}>
              <span className={`w-6 text-center font-mono text-xs ${tab === r.id ? "text-primary" : ""}`}>{r.icon}</span>
              <span className="hidden sm:inline">{r.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          {tab === "editor" && <EditorView />}
          {tab === "explorer" && <ExplorerView onAccount={(id) => { setInspect(id); setTab("inspector"); }} />}
          {tab === "inspector" && <InspectorView initial={inspect} />}
        </div>
      </div>
    </div>
  );
}
