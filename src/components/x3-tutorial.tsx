import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  EDITS,
  INTENT_DEFAULTS,
  INTENT_LINES,
  INTENT_NOTES,
  INTENT_SOURCE,
  LESSONS,
  MANDATE_LINES,
  MANDATE_NOTES,
  RUNS,
  STAGES,
  applyEdit,
  checkIntent,
  compileMandate,
  diffLines,
  intentSource,
  sha256Hex,
  toBaseUnits,
  type IntentFields,
  type LineNote,
} from "@/lib/x3/tutorial";

const MONO = "font-mono";
const panel = "rounded-2xl border border-border bg-surface";
const codePanel = "rounded-2xl border border-border bg-bg";
const input =
  "min-h-11 w-full min-w-0 rounded-lg border border-border bg-bg px-3 font-mono text-sm text-fg focus-visible:outline-2 focus-visible:outline-primary";
const label = "text-sm text-muted";
const kicker = "font-mono text-xs tracking-[0.12em] uppercase";

/** The nine-lesson interactive tutorial at /learn. */
export function X3Tutorial() {
  const [lesson, setLesson] = useState(0);
  const go = (i: number) => {
    setLesson(Math.max(0, Math.min(LESSONS.length - 1, i)));
    if (typeof window !== "undefined") document.getElementById("lesson")?.scrollIntoView({ block: "start" });
  };
  const L = LESSONS[lesson];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-start gap-8">
        <nav aria-label="Lessons" className="flex flex-[1_1_240px] flex-col gap-1">
          {LESSONS.map((x, i) => {
            const on = i === lesson;
            return (
              <button
                key={x.title}
                type="button"
                onClick={() => go(i)}
                aria-current={on ? "step" : undefined}
                className={`tap flex min-h-13 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left ${on ? "border-primary bg-surface-2" : "border-transparent hover:bg-surface"}`}
              >
                <span
                  className={`grid size-8 flex-none place-items-center rounded-full font-mono text-sm font-semibold ${on ? "bg-primary text-bg" : i < lesson ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted"}`}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold text-fg">{x.title}</span>
                  <span className="text-xs text-muted">{x.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div id="lesson" className="flex min-w-0 flex-[999_1_560px] scroll-mt-28 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`${kicker} text-accent`}>
                Lesson {lesson + 1} of {LESSONS.length} · {L.sub}
              </span>
              <span className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                <span className="block h-full bg-primary transition-[width]" style={{ width: `${((lesson + 1) / LESSONS.length) * 100}%` }} />
              </span>
            </div>
            <h2 className="font-display text-3xl text-fg md:text-4xl">{L.title}</h2>
            <p className="max-w-3xl text-lg text-muted">{L.goal}</p>
          </div>

          {lesson === 0 && <Overview />}
          {lesson === 1 && <Anatomy file="near_intents_agent_payment.x3" lines={INTENT_LINES} notes={INTENT_NOTES} start={1} becomes="Becomes" rule="Get it wrong" />}
          {lesson === 2 && <BaseUnits />}
          {lesson === 3 && <Guards />}
          {lesson === 4 && <Anatomy file="near_mandate_agent.x3" lines={MANDATE_LINES} notes={MANDATE_NOTES} start={11} becomes="On chain it becomes" rule="The compiler insists" />}
          {lesson === 5 && <MandateBuilder />}
          {lesson === 6 && <BreakIt />}
          {lesson === 7 && <GuardCheck />}
          {lesson === 8 && <RunIt />}

          <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={() => go(lesson - 1)}
              disabled={lesson === 0}
              className="tap min-h-12 rounded-xl border border-border bg-surface px-5 text-fg disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => go(lesson + 1)}
              disabled={lesson === LESSONS.length - 1}
              className="tap min-h-12 rounded-xl bg-primary px-5 font-semibold text-bg hover:brightness-110 disabled:opacity-40"
            >
              {lesson === LESSONS.length - 1 ? "Done" : `Next: ${LESSONS[lesson + 1].title} →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className={`${panel} flex flex-col gap-2 p-6`}>
          <span className={`${kicker} text-primary`}>File 1 · the owner writes it once</span>
          <span className="font-display text-2xl text-fg">mandate</span>
          <p className="text-muted">
            The rulebook: which agent, which asset, how much per payment and per day, who may be paid, where refunds go,
            the slippage and fee ceilings, when a human must approve, and when it all expires.
          </p>
          <span className={`${MONO} text-sm text-muted`}>examples/near_mandate_agent.x3</span>
        </div>
        <div className={`${panel} flex flex-col gap-2 p-6`}>
          <span className={`${kicker} text-accent`}>File 2 · the agent writes one per payment</span>
          <span className="font-display text-2xl text-fg">intent</span>
          <p className="text-muted">
            One payment: from which chain and asset, how much, to whom, by what route, within which bounds, with a
            one-use nonce, a timeout and a refund path.
          </p>
          <span className={`${MONO} text-sm text-muted`}>examples/near_intents_agent_payment.x3</span>
        </div>
      </div>
      <div className={`${codePanel} flex flex-col gap-4 p-6`}>
        <span className={`${kicker} text-muted`}>What happens to an intent, in order</span>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STAGES.map((s, i) => (
            <li key={s.name} className={`flex min-h-40 flex-col gap-1.5 rounded-xl border bg-surface p-4 ${s.first ? "border-accent" : "border-border"}`}>
              <span className={`${MONO} text-xs text-muted`}>0{i + 1}</span>
              <span className="font-semibold text-fg">{s.name}</span>
              <span className="text-sm text-muted">{s.does}</span>
              <span className={`${MONO} mt-auto text-xs text-accent`}>{s.codes}</span>
            </li>
          ))}
        </ol>
        <p className="text-fg">
          Each stage can only say no. Nothing the model writes authorizes a payment: the compiler, the mandate and the
          Guard contract do.
        </p>
      </div>
    </div>
  );
}

function Anatomy({
  file,
  lines,
  notes,
  start,
  becomes,
  rule,
}: {
  file: string;
  lines: readonly string[];
  notes: LineNote[];
  start: number;
  becomes: string;
  rule: string;
}) {
  const [sel, setSel] = useState(start);
  const note = notes[sel];
  return (
    <div className="flex flex-wrap items-stretch gap-4">
      <div className={`${codePanel} min-w-0 flex-[3_1_420px] overflow-hidden`}>
        <div className={`${MONO} border-b border-border bg-surface px-4 py-3 text-xs text-muted`}>{file} · pick a line</div>
        <div className="overflow-x-auto py-2">
          {lines.map((text, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              aria-pressed={i === sel}
              className={`block min-h-7 w-full px-4 text-left font-mono text-[13px] leading-7 whitespace-pre ${i === sel ? "bg-primary/15 text-fg shadow-[inset_3px_0_0_var(--color-primary)]" : "text-muted hover:bg-surface"}`}
            >
              <span className="inline-block w-8 text-muted/60 select-none">{i + 1}</span>
              {text}
            </button>
          ))}
        </div>
      </div>
      <div className={`${panel} flex min-w-0 flex-[2_1_300px] flex-col gap-4 p-6`} aria-live="polite">
        <span className={`${kicker} text-primary`}>Line {sel + 1}</span>
        <code className="font-mono text-sm break-words text-fg">{lines[sel].trim()}</code>
        <p className="text-fg">{note.what}</p>
        <div className="flex flex-col gap-1 border-t border-border pt-3">
          <span className={`${kicker} text-muted`}>{becomes}</span>
          <span className="text-sm text-muted">{note.becomes}</span>
        </div>
        <div className="flex flex-col gap-1 border-t border-border pt-3">
          <span className={`${kicker} text-accent`}>{rule}</span>
          <span className="text-sm text-muted">{note.rule}</span>
        </div>
      </div>
    </div>
  );
}

const TOKEN_DECIMALS = { USDC: 6, BTC: 8, wNEAR: 24 } as const;
type TokenName = keyof typeof TOKEN_DECIMALS;

function BaseUnits() {
  const [amt, setAmt] = useState("25");
  const [tok, setTok] = useState<TokenName>("USDC");
  const dec = TOKEN_DECIMALS[tok];
  const converted = toBaseUnits(amt, dec);
  const r = converted.ok && converted.value === 0n ? ({ ok: false, error: "An amount of 0 is refused by the compiler: a payment must move something." } as const) : converted;
  const presets: [string, TokenName][] = [["25", "USDC"], ["0.5", "USDC"], ["1.0000001", "USDC"], ["1", "wNEAR"]];
  return (
    <div className="flex flex-wrap gap-4">
      <div className={`${panel} flex flex-[1_1_340px] flex-col gap-3 p-6`}>
        <label htmlFor="bu-amt" className={label}>Human amount</label>
        <input id="bu-amt" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value)} className={`${input} min-h-12 text-xl`} />
        <label htmlFor="bu-tok" className={label}>Token and its decimals</label>
        <select id="bu-tok" value={tok} onChange={(e) => setTok(e.target.value as TokenName)} className={input}>
          <option value="USDC">USDC · 6 decimals</option>
          <option value="BTC">BTC · 8 decimals</option>
          <option value="wNEAR">wNEAR · 24 decimals</option>
        </select>
        <div className="flex flex-wrap gap-2">
          {presets.map(([a, t]) => (
            <button key={a + t} type="button" onClick={() => { setAmt(a); setTok(t); }} className="tap min-h-10 rounded-full border border-border bg-surface-2 px-4 font-mono text-sm text-fg hover:border-primary">
              {a} {t}
            </button>
          ))}
        </div>
      </div>
      <div className={`${codePanel} flex min-w-0 flex-[1_1_340px] flex-col gap-3 border-2 p-6 ${r.ok ? "border-primary" : "border-accent"}`} aria-live="polite">
        <span className={`${kicker} text-muted`}>What you write in .x3</span>
        <span className="font-mono text-2xl break-all text-fg">{r.ok ? `amount ${r.digits}` : "refused"}</span>
        <span className="text-muted">{r.ok ? `${amt} ${tok} × 10^${dec} = ${r.digits} base units.` : r.error}</span>
        <span className="border-t border-border pt-3 text-sm text-muted">
          The compiler never guesses decimals from a token's symbol, and a fractional value in a base-unit field is
          refused. 25 USDC at six decimals is 25000000.
        </span>
      </div>
    </div>
  );
}

function Guards() {
  const [slip, setSlip] = useState(50);
  const [fees, setFees] = useState("100");
  const [tnum, setTnum] = useState("10");
  const [tunit, setTunit] = useState("m");
  const [nonce, setNonce] = useState("agent_payment_001");
  const pct = slip / 100;
  const feeN = Number(fees);
  const code = `require slippage <= ${pct}%     // or: <= ${slip}bps
require fees <= ${fees} bps
require nonce unused ${nonce}
timeout ${tnum}${tunit} refund Solana.USDC
on_fail rollback`;
  const notes = [
    { k: "require slippage", v: `${pct}% and ${slip}bps are the same bound. 1Click gets slippageTolerance = ${slip} bps, rounded down so it is never looser than you wrote. ${slip > 100 ? "Above the example mandate's 100 bps, so mandate_slippage would fail." : "Within the example mandate's 100 bps."}` },
    { k: "Careful with units", v: "A bound needs a unit: write 0.5%, 50 bps or 50bps. A bare number is refused (X3_NEAR_BOUND_UNIT), whether 50, 0.005 or 0.5. A bare 0.5 used to be read as a fraction, 50% rather than 0.5%, so the compiler no longer guesses." },
    { k: "require fees", v: `Checked on the quote's effective cost and, separately, on the refund fee a failed swap would be charged. Decimals round down. ${Number.isNaN(feeN) ? "Enter a number." : Math.floor(feeN) > 100 ? "Above the example mandate's 100 bps, so mandate_fees would fail." : "Within the example mandate's 100 bps."}` },
    { k: "require nonce unused", v: "Exactly one per intent. A reused nonce is a refusal, never something to patch in a receipt." },
    { k: "timeout … refund", v: `Sets the deadline to now + ${tnum}${tunit}. The refund must be in the deposited asset. A live quote whose deadline runs past this timeout is refused.` },
  ];
  return (
    <div className="flex flex-wrap gap-4">
      <div className={`${panel} flex flex-[1_1_340px] flex-col gap-4 p-6`}>
        <div className="flex flex-col gap-2">
          <label htmlFor="g-slip" className={label}>
            Slippage ceiling: <strong className="text-fg">{pct}%</strong> = <strong className="text-fg">{slip} bps</strong>
          </label>
          <input id="g-slip" type="range" min={0} max={300} step={5} value={slip} onChange={(e) => setSlip(Number(e.target.value))} className="min-h-8 w-full accent-[var(--color-primary)]" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="g-fees" className={label}>Fee ceiling in basis points</label>
          <input id="g-fees" type="number" min={0} max={10000} value={fees} onChange={(e) => setFees(e.target.value)} className={input} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="g-tnum" className={label}>Timeout</label>
            <input id="g-tnum" type="number" min={1} value={tnum} onChange={(e) => setTnum(e.target.value)} className={input} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="g-tunit" className={label}>Unit</label>
            <select id="g-tunit" value={tunit} onChange={(e) => setTunit(e.target.value)} className={input}>
              <option value="s">s · seconds</option>
              <option value="m">m · minutes</option>
              <option value="h">h · hours</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="g-nonce" className={label}>One-use nonce</label>
          <input id="g-nonce" value={nonce} onChange={(e) => setNonce(e.target.value)} className={input} />
        </div>
      </div>
      <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-3">
        <pre className={`${codePanel} overflow-x-auto p-5 font-mono text-sm leading-8 text-fg`}><code>{code}</code></pre>
        {notes.map((n) => (
          <div key={n.k} className={`${panel} flex flex-col gap-1 rounded-xl p-4`}>
            <span className="font-mono text-sm text-primary">{n.k}</span>
            <span className="text-sm text-muted">{n.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MandateBuilder() {
  const [source, setSource] = useState(MANDATE_LINES.join("\n") + "\n");
  const [sha, setSha] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    setSha(null);
    sha256Hex(source).then((h) => { if (live) setSha(h); }, () => { if (live) setSha(null); });
    return () => { live = false; };
  }, [source]);
  const result = useMemo(() => compileMandate(source, sha ?? ""), [source, sha]);
  const tries: [string, string, string][] = [
    ["Agent = owner", "agent x3-agent.near", "agent x3-owner.near"],
    ["Cap above daily", "per_payment 50000000", "per_payment 500000000"],
    ["Approval above cap", "approve above 30000000", "approve above 60000000"],
    ["Agent approves itself", "of x3-owner.near", "of x3-agent.near"],
    ["No fee bound", "    require fees <= 100 bps\n", ""],
  ];
  const original = MANDATE_LINES.join("\n") + "\n";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Break a rule:</span>
        {tries.map(([lbl, a, b]) => (
          <button key={lbl} type="button" onClick={() => setSource(original.replace(a, b))} className="tap min-h-10 rounded-full border border-border bg-surface-2 px-4 text-sm text-fg hover:border-accent">
            {lbl}
          </button>
        ))}
        <button type="button" onClick={() => setSource(original)} className="tap min-h-10 rounded-full border border-primary px-4 text-sm text-primary">
          Reset
        </button>
      </div>
      <div className="flex flex-wrap items-stretch gap-4">
        <div className={`${codePanel} flex min-w-0 flex-[3_1_420px] flex-col overflow-hidden`}>
          <label htmlFor="mb-src" className={`${MONO} border-b border-border bg-surface px-4 py-3 text-xs text-muted`}>your_mandate.x3 · edit me</label>
          <textarea
            id="mb-src"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            rows={15}
            className="min-h-96 w-full flex-1 resize-y bg-bg p-4 font-mono text-[13px] leading-7 text-fg focus-visible:outline-2 focus-visible:outline-primary"
          />
        </div>
        <div className={`${panel} flex min-w-0 flex-[2_1_320px] flex-col gap-4 border-2 p-6 ${result.ok ? "border-primary" : "border-accent"}`} aria-live="polite">
          <span className={`${kicker} text-muted`}>Compiler result</span>
          {result.ok ? (
            <>
              <span className="font-display text-3xl text-primary">Compiles</span>
              <p className="text-muted">The create_mandate arguments it compiles to, with this source's SHA-256 as program_sha256:</p>
              <pre className="overflow-x-auto rounded-xl border border-border bg-bg p-3 font-mono text-xs leading-6 text-fg">
                <code>{JSON.stringify({ owner: result.value.owner, agent: result.value.agent, terms: { ...result.value.terms, program_sha256: sha ?? "computing…" } }, null, 2)}</code>
              </pre>
            </>
          ) : (
            <>
              <span className="font-display text-3xl text-accent">Refused</span>
              <span className="font-mono text-lg break-words text-accent">{result.code}</span>
              <p className="text-fg">{result.message}</p>
              {result.line ? <span className="font-mono text-sm text-muted">line {result.line}</span> : null}
            </>
          )}
          <p className="mt-auto border-t border-border pt-3 text-xs text-muted">
            Compiled in your browser by the vendored x3lang checker, against the 1Click token list from the judge
            scenarios. It stops at the first broken rule, as the real compiler does.
          </p>
        </div>
      </div>
    </div>
  );
}

function BreakIt() {
  const [id, setId] = useState(EDITS[0].id);
  const edit = EDITS.find((e) => e.id === id) ?? EDITS[0];
  const lines = diffLines(INTENT_SOURCE, applyEdit(edit));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Unsafe edits">
        {EDITS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setId(e.id)}
            aria-pressed={e.id === id}
            className={`tap min-h-11 rounded-full border px-4 text-sm ${e.id === id ? "border-accent bg-accent font-semibold text-bg" : "border-border bg-surface text-fg hover:border-accent"}`}
          >
            {e.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-stretch gap-4">
        <div className={`${codePanel} min-w-0 flex-[3_1_440px] overflow-hidden`}>
          <div className={`${MONO} border-b border-border bg-surface px-4 py-3 text-xs text-muted`}>near_intents_agent_payment.x3 with one edit</div>
          <div className="overflow-x-auto py-2 font-mono text-[13px] leading-7">
            {lines.map((l, i) => (
              <div
                key={i}
                className={`px-4 whitespace-pre ${l.kind === "add" ? "bg-accent/15 text-accent" : l.kind === "del" ? "bg-muted/10 text-muted line-through" : "text-muted"}`}
              >
                <span className="inline-block w-6 select-none" aria-hidden="true">{l.kind === "add" ? "+" : l.kind === "del" ? "−" : ""}</span>
                <span className="sr-only">{l.kind === "add" ? "added: " : l.kind === "del" ? "removed: " : ""}</span>
                {l.text}
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-[2_1_300px] flex-col gap-4 rounded-2xl border-2 border-accent bg-surface p-6" aria-live="polite">
          <span className={`${kicker} text-muted`}>The agent tried to</span>
          <span className="text-xl font-semibold text-fg">{edit.tried}</span>
          <span className="-rotate-2 self-start rounded-lg border-[3px] border-accent px-3 pt-1 font-display text-3xl text-accent">WON'T COMPILE</span>
          <span className="font-mono break-words text-accent">{edit.code}</span>
          <p className="text-fg">{edit.why}</p>
          <p className="mt-auto border-t border-border pt-3 text-xs text-muted">
            Recorded output of x3lang's scripts/hackathon/x3_wont_compile.py: 9 of 9 edits refused at compile time, each
            with its expected code. A program that does not compile never reaches the mandate check, a quote or the Guard.
          </p>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_STATE = { revoked: false, days: "0", spent: "0", count: "0" };

function GuardCheck() {
  const [f, setF] = useState<IntentFields>(INTENT_DEFAULTS);
  const [s, setS] = useState(DEFAULT_STATE);
  const set = (k: keyof IntentFields) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const source = intentSource(f);
  const spent = toBaseUnits(s.spent, 6);
  const spentToday = spent.ok ? spent.value : null;
  const days = /^\d+(\.\d+)?$/.test(s.days.trim()) ? Number(s.days) : null;
  const count = /^\d+$/.test(s.count.trim()) ? Number(s.count) : null;
  const stateProblem =
    spentToday === null ? "Spent in the last 24h must be a USDC amount." : count === null ? "Payments in the last 24h must be a whole number." : days === null ? "Days since the mandate was made must be a number." : null;
  const verdict = useMemo(
    () =>
      spentToday === null || count === null || days === null
        ? null
        : checkIntent(source, { revoked: s.revoked, days, spentToday, paymentsToday: count }),
    [source, s.revoked, days, count, spentToday],
  );
  const scenario = (patch: Partial<IntentFields>, state: Partial<typeof DEFAULT_STATE> = {}) => () => {
    setF({ ...INTENT_DEFAULTS, ...patch });
    setS({ ...DEFAULT_STATE, ...state });
  };
  const scenarios: [string, () => void][] = [
    ["Honest payment", scenario({})],
    ["Prompt-injected: attacker.near", scenario({ recipient: "attacker.near" })],
    ["60 USDC", scenario({ amount: "60" })],
    ["40 USDC", scenario({ amount: "40" })],
    ["Daily budget nearly gone", scenario({}, { spent: "180", count: "7" })],
    ["Refund to someone else", scenario({ refundTo: "So11111111111111111111111111111111111111112" })],
    ["Loose slippage 2%", scenario({ slippage: "2%" })],
    ["Forgot the %: 0.5", scenario({ slippage: "0.5" })],
    ["Arrive as wNEAR", scenario({ arrive: "Near.wNEAR" })],
    ["Owner revoked it", scenario({}, { revoked: true })],
  ];
  const fieldList: [keyof IntentFields, string][] = [
    ["recipient", "Pay to"],
    ["amount", "Amount (USDC)"],
    ["spend", "Spend asset"],
    ["arrive", "Arrive as"],
    ["slippage", "Slippage (0.5% or 50bps)"],
    ["fees", "Fee cap (bps)"],
    ["timeoutMinutes", "Timeout (minutes)"],
    ["refundTo", "Refund to (blank = sender)"],
  ];

  let tone = "accent";
  let stamp = "REFUSED";
  let line = "";
  if (verdict === null) {
    stamp = "CHECK INPUT";
    line = stateProblem ?? "";
  } else if (verdict.stage === "compile") {
    stamp = "WON'T COMPILE";
    line = `${verdict.message}${verdict.line ? ` (line ${verdict.line})` : ""}`;
  } else {
    const bad = verdict.checks.filter((c) => !c.ok);
    if (verdict.decision === "denied") {
      line = bad.length === 1
        ? `One rule stops it: ${bad[0].guard}. Every other check passes${bad[0].guard === "mandate_recipient" ? ", which is exactly how a prompt-injected payment looks." : "."}`
        : `${bad.length} rules stop it: ${bad.map((c) => c.guard).join(", ")}.`;
    } else if (verdict.decision === "approval_required") {
      stamp = "NEEDS APPROVAL";
      line = `Every check passes, but this is over the 30 USDC threshold, so it waits for ${verdict.approvals} of x3-owner.near.`;
    } else {
      tone = "primary";
      stamp = "ALLOWED";
      line = "All ten checks pass and no approval is needed. The agent can register this intent with x3-guard.";
    }
  }
  const border = tone === "primary" ? "border-primary" : "border-accent";
  const text = tone === "primary" ? "text-primary" : "text-accent";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Try:</span>
        {scenarios.map(([lbl, run]) => (
          <button key={lbl} type="button" onClick={run} className="tap min-h-10 rounded-full border border-border bg-surface-2 px-4 text-sm text-fg hover:border-primary">
            {lbl}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
          <div className={`${panel} grid grid-cols-2 gap-3 p-5`}>
            <span className={`${kicker} col-span-2 text-accent`}>The agent's intent</span>
            {fieldList.map(([k, lbl]) => (
              <div key={k} className={`flex min-w-0 flex-col gap-1.5 ${k === "refundTo" ? "col-span-2" : ""}`}>
                <label htmlFor={`gc-${k}`} className="text-xs text-muted">{lbl}</label>
                <input id={`gc-${k}`} value={f[k]} onChange={set(k)} className={input} />
              </div>
            ))}
            <span className={`${kicker} col-span-2 mt-2 text-primary`}>What x3-guard already knows</span>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="gc-spent" className="text-xs text-muted">Spent in the last 24h (USDC)</label>
              <input id="gc-spent" value={s.spent} onChange={(e) => setS({ ...s, spent: e.target.value })} className={input} />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="gc-count" className="text-xs text-muted">Payments in the last 24h</label>
              <input id="gc-count" value={s.count} onChange={(e) => setS({ ...s, count: e.target.value })} className={input} />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="gc-days" className="text-xs text-muted">Days since the mandate was made</label>
              <input id="gc-days" value={s.days} onChange={(e) => setS({ ...s, days: e.target.value })} className={input} />
            </div>
            <label className="flex min-h-11 items-center gap-2 self-end text-sm text-fg">
              <input type="checkbox" checked={s.revoked} onChange={(e) => setS({ ...s, revoked: e.target.checked })} className="size-5 accent-[var(--color-primary)]" />
              Owner revoked it
            </label>
          </div>
          <details className={`${codePanel} p-4`}>
            <summary className="tap min-h-8 cursor-pointer text-sm text-primary">Show the .x3 source being checked</summary>
            <pre className="mt-3 overflow-x-auto font-mono text-xs leading-6 text-muted"><code>{source}</code></pre>
          </details>
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
          <div className={`flex flex-col gap-3 rounded-2xl border-2 bg-surface p-6 ${border}`} aria-live="polite">
            <span className={`${kicker} text-muted`}>Against near_mandate_agent.x3</span>
            <span className={`-rotate-2 self-start rounded-xl border-4 px-3 pt-1.5 font-display text-4xl ${border} ${text}`}>{stamp}</span>
            {verdict?.stage === "compile" ? <span className="font-mono break-words text-accent">{verdict.code}</span> : null}
            <span className="text-fg">{line}</span>
          </div>
          {verdict?.stage === "mandate" ? (
            <ul className={`${codePanel} overflow-hidden`}>
              {verdict.checks.map((c) => (
                <li key={c.guard} className={`flex items-start gap-3 border-b border-border/60 px-4 py-2.5 last:border-0 ${c.ok ? "" : "bg-accent/10"}`}>
                  <span className={`w-10 flex-none pt-0.5 font-mono text-[11px] font-semibold ${c.ok ? "text-primary" : "text-accent"}`}>{c.ok ? "PASS" : "FAIL"}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className={`font-mono text-sm ${c.ok ? "text-fg" : "text-accent"}`}>{c.guard}</span>
                    <span className="text-xs break-words text-muted">{c.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-xs text-muted">
            Run live in your browser by the vendored x3lang checker: the intent is parsed, type-checked and lowered to its
            1Click dry request, then x3-guard's check_mandate runs against the example mandate. The command-line version
            is near_intents.py mandate check; x3-guard enforces the same terms on NEAR.
          </p>
        </div>
      </div>
    </div>
  );
}

function RunIt() {
  return (
    <div className="flex flex-col gap-4">
      {RUNS.map((r) => (
        <div key={r.title} className={`${panel} flex flex-col gap-3 p-5`}>
          <span className="font-semibold text-fg">{r.title}</span>
          <pre className="overflow-x-auto rounded-xl border border-border bg-bg p-4 font-mono text-sm leading-7 text-primary"><code>{r.cmd}</code></pre>
          <span className="text-sm text-muted">{r.see}</span>
        </div>
      ))}
      <div className="grid gap-4 md:grid-cols-2">
        <div className={`${panel} flex flex-col gap-2 p-5`}>
          <span className={`${kicker} text-accent`}>What .x3 does not do</span>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-fg">
            <li>It never signs or sends a deposit. The owner's wallet still authorizes that.</li>
            <li>The Guard holds no funds; a wallet key used outside Guard bypasses it.</li>
            <li>timeout, refund and on_fail syntax alone does not prove a cross-chain rollback.</li>
            <li>The NEAR path accepts one shape: a single bridge NearIntents leg.</li>
          </ul>
        </div>
        <div className={`${panel} flex flex-col gap-2 p-5`}>
          <span className={`${kicker} text-primary`}>Keep going</span>
          <Link to="/playground" className="tap min-h-9 text-primary underline-offset-4 hover:underline">Break a mandate in the Playground →</Link>
          <Link to="/bootcamp" className="tap min-h-9 text-primary underline-offset-4 hover:underline">Bootcamp: the in-depth course →</Link>
          <a href="https://github.com/Cyptopimpinainteazy/x3lang/blob/master/docs/x3-lang/PROGRAMMING_GUIDE.md" target="_blank" rel="noreferrer" className="tap min-h-9 text-primary underline-offset-4 hover:underline">X3Lang programming guide →</a>
          <a href="https://github.com/Cyptopimpinainteazy/x3lang/tree/master/x3-lang/examples" target="_blank" rel="noreferrer" className="tap min-h-9 text-primary underline-offset-4 hover:underline">All example programs →</a>
        </div>
      </div>
    </div>
  );
}
