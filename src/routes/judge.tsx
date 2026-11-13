import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { ActionLink, Section, SiteShell } from "@/components/site-shell";
import { MainnetEvidence } from "@/components/mainnet-evidence";
import { CopyButton } from "@/components/dossier";
import { LINKS } from "@/lib/front-door";
import {
  JUDGE_CASES,
  JUDGE_COMMAND,
  JUDGE_STATS,
  NOT_CLAIMED,
  type JudgeCase,
} from "@/lib/judge-cases";

export const Route = createFileRoute("/judge")({
  head: () => ({
    meta: [
      { title: "Judge Console · dotx3.net" },
      {
        name: "description",
        content:
          "A signed 1Click quote accepted on NEAR, 25 USDC deposited on Solana and 24.9952 USDC delivered on NEAR mainnet, alongside three historical testnet cases.",
      },
    ],
  }),
  component: JudgeConsole,
});

const tone = (t: "good" | "bad") =>
  t === "bad"
    ? { text: "text-accent", border: "border-accent", bg: "bg-accent" }
    : { text: "text-primary", border: "border-primary", bg: "bg-primary" };

function Stats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {JUDGE_STATS.map((s) => (
        <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
          <p className={`font-display text-4xl leading-none font-extrabold ${tone(s.tone).text}`}>
            {s.value}
          </p>
          <p className="mt-2 text-sm text-fg">{s.label}</p>
          <p className="mt-1 text-xs text-muted">{s.note}</p>
        </div>
      ))}
    </div>
  );
}

function CaseTabs({
  active,
  onPick,
}: {
  active: JudgeCase["id"];
  onPick: (id: JudgeCase["id"]) => void;
}) {
  return (
    <div role="tablist" aria-label="Evidence cases" className="grid gap-3 md:grid-cols-3">
      {JUDGE_CASES.map((c, i) => {
        const on = c.id === active;
        const t = tone(c.tone);
        return (
          <button
            key={c.id}
            id={`case-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={on ? `case-panel-${c.id}` : undefined}
            tabIndex={on ? 0 : -1}
            onClick={() => onPick(c.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const next =
                JUDGE_CASES[
                  (i + (e.key === "ArrowRight" ? 1 : -1) + JUDGE_CASES.length) % JUDGE_CASES.length
                ];
              onPick(next.id);
              document.getElementById(`case-tab-${next.id}`)?.focus();
            }}
            className={`tap flex min-h-11 flex-col items-start gap-1 rounded-xl border px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
              on
                ? `${t.bg} ${t.border} text-bg`
                : "border-border bg-surface text-fg hover:border-primary/50"
            }`}
          >
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase opacity-80">
              {c.kicker}
            </span>
            <span className="font-display text-lg font-bold">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PanelHead({
  step,
  title,
  aside,
}: {
  step: number;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
      <p className="font-mono text-xs tracking-[0.12em] text-muted uppercase">
        {step} · {title}
      </p>
      {aside}
    </div>
  );
}

function CasePanel({ c }: { c: JudgeCase }) {
  const t = tone(c.tone);
  return (
    <div
      id={`case-panel-${c.id}`}
      role="tabpanel"
      aria-labelledby={`case-tab-${c.id}`}
      className="space-y-5"
    >
      <p className="max-w-4xl text-lg text-fg">{c.lede}</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr_0.95fr]">
        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#0b0c11]">
          <PanelHead
            step={1}
            title={c.codeTitle}
            aside={
              <a
                href={c.codeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-mono text-[11px] text-muted hover:text-primary"
              >
                {c.codeFile}
              </a>
            }
          />
          <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-relaxed">
            {c.code.map((line, i) => (
              <div
                key={i}
                className={`px-4 whitespace-pre ${
                  i === c.highlight
                    ? "bg-accent/15 text-[#ffb48a] shadow-[inset_3px_0_0_var(--color-accent)]"
                    : "text-[#c9ccd4]"
                }`}
              >
                <span className="inline-block w-7 text-[#4c5262] select-none" aria-hidden="true">
                  {i + 1}
                </span>
                {line || " "}
              </div>
            ))}
          </pre>
          <p className="mt-auto border-t border-border px-4 py-3 text-xs break-all text-muted">
            {c.codeNote}
          </p>
        </section>

        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#0b0c11]">
          <PanelHead step={2} title={c.checksTitle} />
          <ul className="py-2">
            {c.checks.map((k) => (
              <li
                key={k.name}
                className={`flex items-start gap-3 px-4 py-2.5 ${k.ok ? "" : "bg-accent/12 text-[#ffb48a]"}`}
              >
                {k.ok ? (
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] border-primary text-primary">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-bg">
                    <X className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block font-mono text-[13px]">
                    {k.name}
                    <span className="sr-only">: {k.ok ? "pass" : "fail"}</span>
                  </span>
                  <span className="block text-xs break-words text-muted">{k.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`flex min-w-0 flex-col gap-4 rounded-2xl border-2 bg-surface p-5 ${t.border}`}
        >
          <p className="font-mono text-xs tracking-[0.12em] text-muted uppercase">
            3 · Verdict on chain
          </p>
          <p
            className={`-rotate-3 self-start rounded-lg border-4 px-4 pt-2 pb-1 font-display text-3xl leading-none sm:text-4xl font-extrabold tracking-wide ${t.text} ${t.border}`}
          >
            {c.verdict}
          </p>
          <p className="text-fg">{c.verdictLine}</p>
          <dl className="space-y-3">
            {c.anchors.map((a) => (
              <div key={a.label}>
                <dt className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
                  {a.label}
                </dt>
                <dd className="mt-1 font-mono text-[13px] break-all">
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {a.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-auto border-t border-border pt-3 text-xs text-muted">{c.limit}</p>
        </section>
      </div>
    </div>
  );
}

function JudgeConsole() {
  const [active, setActive] = useState<JudgeCase["id"]>("refused");
  const current = JUDGE_CASES.find((c) => c.id === active)!;
  return (
    <SiteShell
      eyebrow="X3 Force · War Room · Judge Console"
      title="The AI proposes. X3 General decides."
      lede="Start with the completed mainnet 1Click trade, then inspect three historical testnet cases. X3 General is the x3-guard contract on NEAR: it checks agent intent and quote terms against the owner's mandate. Each result names its network and its limits."
      actions={
        <>
          <ActionLink to="/playground">Try to break it</ActionLink>
          <ActionLink to="/proof" outline>
            Inspect the Proof
          </ActionLink>
        </>
      }
    >
      <Section title="Mainnet settlement">
        <MainnetEvidence />
      </Section>
      <div className="mx-auto max-w-[1360px] space-y-8 px-5 py-14">
        <h2 className="font-display text-3xl text-primary">Historical testnet cases</h2>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <span className="rounded-full border border-border px-3.5 py-2 text-fg">
            NEAR testnet
          </span>
          <span className="rounded-full border border-border px-3.5 py-2 text-fg">
            contract x3lang.testnet
          </span>
          <span className="rounded-full border border-accent px-3.5 py-2 text-accent">
            Evidence, not claims
          </span>
        </div>
        <Stats />
        <CaseTabs active={active} onPick={setActive} />
        <CasePanel c={current} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0 space-y-3 rounded-2xl border border-border bg-surface p-5">
            <p className="font-mono text-xs tracking-[0.12em] text-muted uppercase">
              Don&apos;t trust this page. Run it.
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-bg py-2 pr-2 pl-4">
              <code className="min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap text-primary">
                {JUDGE_COMMAND}
              </code>
              <CopyButton text={JUDGE_COMMAND} />
            </div>
            <p className="text-sm text-muted">
              Eight of the README&apos;s ten &quot;do X, see Y&quot; steps run offline with Python
              and Node: no wallet, no key, no account.
            </p>
            <a
              href={LINKS.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-primary underline-offset-4 hover:underline"
            >
              github.com/Cyptopimpinainteazy/x3lang
            </a>
          </div>
          <div className="min-w-0 space-y-3 rounded-2xl border border-border bg-surface p-5">
            <p className="font-mono text-xs tracking-[0.12em] text-accent uppercase">
              What this is not
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-fg">
              {NOT_CLAIMED.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
