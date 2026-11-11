import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { OutLink, Tag } from "@/components/code-block";
import { Section, SiteShell } from "@/components/site-shell";
import { LINKS } from "@/lib/front-door";
import { ATTACKS, DATA, PRESETS, QUOTES, applyAttack, type Attack } from "@/lib/x3/playground";
import * as judge from "@/lib/x3/vendor/judge/judge.mjs";
import * as x3 from "@/lib/x3/vendor/x3guard.mjs";

export const Route = createFileRoute("/playground")({ component: PlaygroundPage });

const VENDOR_COMMIT = "470d61a3b77689bb5e0c7e36fc7814d28e761dad";
const VENDOR_URL = `${LINKS.repo}/blob/${VENDOR_COMMIT}/x3-lang/near/demo/x3guard.mjs`;

type Outcome =
  | { kind: "idle" }
  | { kind: "compile_error"; code: string; message: string; line: number | null }
  | {
      kind: "evaluated";
      shown: judge.ShownDecision;
      result: judge.Evaluation;
      matchesPython: boolean | null;
      intentSha: string;
      mandateSha: string;
    };

function errorOf(e: unknown) {
  if (e instanceof x3.X3Error) return { code: e.code, message: e.message, line: e.line };
  return { code: "X3_INTERNAL", message: e instanceof Error ? e.message : String(e), line: null };
}

function PlaygroundPage() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const [intent, setIntent] = useState(preset.intent);
  const [mandate, setMandate] = useState(DATA.mandate.source);
  const [attackId, setAttackId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome>({ kind: "idle" });
  const verdictRef = useRef<HTMLDivElement>(null);
  const showVerdict = () =>
    window.setTimeout(
      () => verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );

  const edited = intent !== preset.intent || mandate !== DATA.mandate.source;

  function choosePreset(id: string) {
    const next = PRESETS.find((p) => p.id === id);
    if (!next) return;
    setPresetId(id);
    setIntent(next.intent);
    setMandate(DATA.mandate.source);
    setAttackId(null);
    showVerdict();
  }

  function launch(attack: Attack) {
    const base = PRESETS.find((p) => p.id === "authorized");
    if (!base) return;
    setPresetId(base.id);
    setMandate(DATA.mandate.source);
    setIntent(applyAttack(base.intent, attack));
    setAttackId(attack.id);
    showVerdict();
  }

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const data = { ...DATA, mandate: { ...DATA.mandate, source: mandate } };
      const scenario = {
        intent: { ...preset.scenario.intent, source: intent },
        assumed_guard_state: preset.scenario.assumed_guard_state,
      };
      try {
        const result = await judge.evaluate(data, scenario);
        const [intentSha, mandateSha] = await Promise.all([
          x3.sha256Hex(intent),
          x3.sha256Hex(mandate),
        ]);
        if (cancelled) return;
        const pristine = intent === preset.intent && mandate === DATA.mandate.source;
        setOutcome({
          kind: "evaluated",
          shown: judge.shownDecision(preset.scenario, result),
          result,
          matchesPython: pristine ? judge.agrees(preset.scenario, result) : null,
          intentSha,
          mandateSha,
        });
      } catch (e) {
        if (!cancelled) setOutcome({ kind: "compile_error", ...errorOf(e) });
      }
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [intent, mandate, preset]);

  const attack = ATTACKS.find((a) => a.id === attackId) ?? null;

  return (
    <SiteShell
      eyebrow="Playground"
      title="Break the agent's payment. Watch it get refused."
      lede="This page runs the real X3 checker in your browser: parse, type-check, lower, then every Guard check in the contract's order. Edit either program. Nothing is signed or sent."
    >
      <Section title="Pick a case or launch an attack">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 font-display text-xs tracking-widest text-accent uppercase">
            One-click attacks on the authorized payment
          </p>
          <div className="flex flex-wrap gap-2">
            {ATTACKS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => launch(a)}
                className={`tap min-h-11 rounded-full border px-4 text-sm font-semibold ${attackId === a.id ? "border-accent bg-accent text-bg" : "border-border text-fg hover:border-accent"}`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <p className="mt-8 mb-3 font-display text-xs tracking-widest text-accent uppercase">
            The twelve judge scenarios
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => choosePreset(p.id)}
                className={`tap min-h-11 rounded-xl border px-4 py-3 text-left text-sm ${presetId === p.id && !attackId ? "border-primary bg-surface-2 text-fg" : "border-border text-muted hover:text-fg"}`}
              >
                <span className="block font-semibold text-fg">{p.title}</span>
                <span className="text-xs">{DATA.groups[p.group]}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            {attack
              ? `${attack.why} ${attack.kind === "compile" ? `Expected: does not compile (${attack.stop}).` : `Expected: Guard check ${attack.stop} fails.`}`
              : preset.story}
          </p>
        </div>
      </Section>

      <Section title="The two programs" alt>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <Editor
            label="Owner's mandate"
            sub={DATA.mandate.file}
            value={mandate}
            onChange={setMandate}
          />
          <Editor
            label="Agent's payment"
            sub={preset.scenario.intent.file}
            value={intent}
            onChange={setIntent}
          />
        </div>
        {preset.scenario.assumed_guard_state && !attackId ? (
          <p className="mx-auto mt-4 max-w-6xl text-sm text-muted">
            <Tag>Assumed Guard state</Tag>{" "}
            {preset.scenario.assumed_guard_state.revoked
              ? "The owner has revoked this mandate. "
              : null}
            {preset.scenario.assumed_guard_state.spends?.length
              ? `Already spent in the last 24 hours: ${preset.scenario.assumed_guard_state.spends.map((s) => `${Number(s.amount) / 1e6} USDC`).join(", ")}.`
              : null}
          </p>
        ) : null}
        <div className="mx-auto mt-4 flex max-w-6xl flex-wrap gap-3">
          <button
            type="button"
            className="tap min-h-11 rounded-full border border-border px-5 text-sm font-semibold text-fg"
            onClick={() => {
              setIntent(preset.intent);
              setMandate(DATA.mandate.source);
              setAttackId(null);
            }}
            disabled={!edited && !attackId}
          >
            Reset both programs
          </button>
        </div>
      </Section>

      <div ref={verdictRef} className="scroll-mt-20" />
      <Section title="Verdict">
        <Verdict
          outcome={outcome}
          expected={attack}
          contractNote={preset.scenario.contract_note}
          contractTests={preset.scenario.contract_tests}
        />
      </Section>

      <QuoteLab />

      <Section title="What this proves, and what it does not">
        <ul className="mx-auto grid max-w-3xl gap-3">
          {judge.EVIDENCE_LADDER.map((rung) => (
            <li key={rung.level} className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="font-semibold text-fg">
                <span className={rung.proven ? "text-primary" : "text-accent"}>
                  {rung.proven ? "Shown here" : "Not shown here"}
                </span>{" "}
                · {rung.label}
              </p>
              <p className="mt-1 text-sm text-muted">{rung.how}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-3xl text-sm text-muted">
          Checker source:{" "}
          <OutLink href={VENDOR_URL}>x3guard.mjs at {VENDOR_COMMIT.slice(0, 7)}</OutLink>, copied
          byte for byte. In x3lang a parity test runs it against the Python adapter on the same
          programs. This site&apos;s own test re-checks all twelve scenarios against Python&apos;s
          recorded answers. The testnet transactions are on{" "}
          <Link to="/proof" className="text-primary underline underline-offset-4">
            Inspect the Proof
          </Link>
          .
        </p>
      </Section>
    </SiteShell>
  );
}

function Editor({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-display text-lg text-fg">{label}</span>
      <span className="ml-2 text-xs text-muted">{sub.split("/").pop()}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={18}
        className="mt-3 block w-full resize-y rounded-xl border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-primary focus:border-primary focus:outline-none sm:text-sm"
      />
    </label>
  );
}

const TONE: Record<"pass" | "note" | "fail" | "seal", string> = {
  pass: "border-primary",
  note: "border-primary/60",
  fail: "border-accent",
  seal: "border-accent/60",
};

function Verdict({
  outcome,
  expected,
  contractNote,
  contractTests,
}: {
  outcome: Outcome;
  expected: Attack | null;
  contractNote: string | null;
  contractTests: string[];
}) {
  if (outcome.kind === "idle") return <p className="text-center text-muted">Checking…</p>;
  if (outcome.kind === "compile_error") {
    return (
      <article
        className="mx-auto max-w-3xl rounded-xl border border-accent bg-surface p-6"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Tag>Does not compile</Tag>
          {expected ? (
            <Tag>
              {expected.kind === "compile" && expected.stop === outcome.code
                ? `Stopped by ${expected.stop}, as expected`
                : `Expected ${expected.stop}. Report this`}
            </Tag>
          ) : null}
        </div>
        <h3 className="mt-4 font-display text-2xl break-all text-fg">{outcome.code}</h3>
        <p className="mt-3 text-muted">
          {outcome.line ? `Line ${outcome.line}: ` : ""}
          {outcome.message}
        </p>
        <p className="mt-3 text-sm text-muted">
          Nothing reaches Guard. A program that fails here never gets quoted.
        </p>
      </article>
    );
  }
  const d = judge.DECISIONS[outcome.shown];
  const { result } = outcome;
  return (
    <article
      className={`mx-auto max-w-4xl rounded-xl border bg-surface p-6 ${TONE[d.tone]}`}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tag>{d.label}</Tag>
        {outcome.matchesPython === true ? <Tag>Matches Python, guard by guard</Tag> : null}
        {outcome.matchesPython === false ? <Tag>Differs from Python. Report this</Tag> : null}
        {outcome.matchesPython === null && !expected ? (
          <Tag>Edited. No recorded Python answer</Tag>
        ) : null}
        {expected ? (
          <Tag>
            {expected.kind === "guard" &&
            result.denied_guards.length === 1 &&
            result.denied_guards[0] === expected.stop
              ? `Stopped by ${expected.stop}, as expected`
              : `Expected ${expected.stop}. Report this`}
          </Tag>
        ) : null}
      </div>
      <h3 className="mt-4 font-display text-2xl text-fg">{outcome.shown}</h3>
      <p className="mt-2 text-muted">{d.detail}</p>
      {outcome.shown === "contract_only" && contractNote ? (
        <p className="mt-3 text-sm text-muted">
          {contractNote}{" "}
          {contractTests.length ? `Contract tests: ${contractTests.join(", ")}.` : ""}
        </p>
      ) : null}
      {result.approvals_needed ? (
        <p className="mt-2 text-sm text-muted">Approvals needed: {result.approvals_needed}.</p>
      ) : null}

      {result.checks.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="py-2 pr-4 font-semibold">Guard check</th>
                <th className="py-2 pr-4 font-semibold">Result</th>
                <th className="py-2 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {result.checks.map((c) => (
                <tr key={c.guard} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-fg">{c.guard}</td>
                  <td
                    className={`py-2 pr-4 font-semibold ${c.ok ? "text-primary" : "text-accent"}`}
                  >
                    {c.ok ? "pass" : "FAIL"}
                  </td>
                  <td className="py-2 text-xs break-all text-muted">{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Refused before the term checks: {result.denied_guards.join(", ")}.
        </p>
      )}

      <dl className="mt-6 grid gap-2 text-xs text-muted">
        <div>
          <dt className="inline text-fg">Payment SHA-256 </dt>
          <dd className="inline font-mono break-all">{outcome.intentSha}</dd>
        </div>
        <div>
          <dt className="inline text-fg">Mandate SHA-256 </dt>
          <dd className="inline font-mono break-all">{outcome.mandateSha}</dd>
        </div>
      </dl>
    </article>
  );
}

function QuoteLab() {
  const [quoteId, setQuoteId] = useState(QUOTES[0].id);
  const original = useMemo(
    () => QUOTES.find((q) => q.id === quoteId)?.json ?? QUOTES[0].json,
    [quoteId],
  );
  const [text, setText] = useState(original);
  const [state, setState] = useState<{
    valid: boolean;
    reason: string;
    hash: string | null;
  } | null>(null);

  useEffect(() => setText(original), [original]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let parsed: x3.QuoteResponse;
      try {
        parsed = JSON.parse(text) as x3.QuoteResponse;
      } catch {
        if (!cancelled) setState({ valid: false, reason: "not valid JSON", hash: null });
        return;
      }
      const r = await x3.checkQuoteSignature(parsed);
      if (!cancelled) setState(r);
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);

  function tamper() {
    try {
      const q = JSON.parse(text) as x3.QuoteResponse;
      const min = String(q.quote.minAmountOut ?? "0");
      q.quote.minAmountOut = /^\d+$/.test(min) ? String(BigInt(min) + 1n) : "1";
      setText(JSON.stringify(q, null, 2));
    } catch {
      setText(original);
    }
  }

  return (
    <Section
      title="Verify a signed 1Click quote"
      intro="Guard trusts a quote only after the 1Click signature checks out. This is the same Ed25519 check the contract runs, using the pinned 1Click key, on quotes that 1Click actually issued. Change one digit and it fails."
      alt
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap gap-2">
          {QUOTES.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setQuoteId(q.id)}
              className={`tap min-h-11 rounded-full border px-4 text-sm font-semibold ${quoteId === q.id ? "border-primary text-primary" : "border-border text-fg"}`}
            >
              {q.label}
            </button>
          ))}
          <button
            type="button"
            onClick={tamper}
            className="tap min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-bg"
          >
            Raise the guaranteed output by 1
          </button>
          <button
            type="button"
            onClick={() => setText(original)}
            className="tap min-h-11 rounded-full border border-border px-4 text-sm font-semibold text-fg"
          >
            Restore
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          rows={14}
          aria-label="1Click quote JSON"
          className="mt-4 block w-full resize-y rounded-xl border border-border bg-bg p-4 font-mono text-xs text-primary focus:border-primary focus:outline-none"
        />
        <p
          className={`mt-4 font-semibold ${state?.valid ? "text-primary" : "text-accent"}`}
          aria-live="polite"
        >
          {state === null
            ? "Checking…"
            : state.valid
              ? "Signature verified under the 1Click manager key"
              : `Refused: ${state.reason}`}
        </p>
        {state?.hash ? (
          <p className="mt-1 font-mono text-xs break-all text-muted">Quote hash {state.hash}</p>
        ) : null}
        <p className="mt-3 text-xs break-all text-muted">
          Pinned key {x3.ONE_CLICK_MANAGER_PUBLIC_KEY}. These are dry quotes captured on 2026-11-03.
          A valid signature proves what 1Click offered. It does not prove a swap happened.
        </p>
      </div>
    </Section>
  );
}
