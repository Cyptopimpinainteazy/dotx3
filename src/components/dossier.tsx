// Mission Dossier pieces (from the "Dotx3 — X3 Force Judge Pack" design), used on the home
// page. Doors link to pages on this site rather than the design's planned subdomains.
import { Link, type LinkProps } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { SITUATION_REPORT, REFUSE_TX } from "@/lib/judge-cases";

export function CopyButton({ text, label = "Copy command" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className="tap grid size-11 shrink-0 place-items-center rounded-lg border border-border text-muted hover:text-fg"
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
    </button>
  );
}

/** "Case File 01": the refused attacker.near intent, as a stamped dossier card. */
export function CaseFileCard() {
  return (
    <div className="relative w-full min-w-0">
      <div className="ml-6 flex h-7 w-36 items-center justify-center rounded-t-lg border border-b-0 border-border bg-surface-2 font-mono text-[11px] tracking-[0.1em] text-muted">
        CASE FILE 01
      </div>
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-6 text-left">
        <p className="font-mono text-xs tracking-[0.12em] text-muted uppercase">
          Agent intent · repo example
        </p>
        <pre className="overflow-x-auto rounded-xl border border-border bg-bg px-4 py-3 font-mono text-sm leading-7 text-[#c9ccd4]">
          {"from Solana.USDC amount 25000000\n"}
          <span className="bg-accent/15 text-[#ffb48a]">to Near.USDC receiver attacker.near</span>
          {"\nunder mandate x3-owner.near"}
        </pre>
        <div className="space-y-1.5 font-mono text-[13px]">
          <p className="flex justify-between gap-3">
            <span className="text-[#c9ccd4]">8 mandate checks</span>
            <span className="text-primary">pass</span>
          </p>
          <p className="flex justify-between gap-3">
            <span className="text-[#ffb48a]">mandate_recipient</span>
            <span className="font-semibold text-accent">FAIL</span>
          </p>
        </div>
        <a
          href={`https://testnet.nearblocks.io/txns/${REFUSE_TX}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs break-all text-muted hover:text-primary"
        >
          Live testnet refusal of the same recipient (testnet owner and agent accounts): tx{" "}
          {REFUSE_TX} · block 276557981
        </a>
        <p
          aria-hidden="true"
          className="-mt-1 mr-1 -rotate-6 self-end rounded-lg border-[5px] border-accent px-4 pt-1.5 pb-0.5 font-display text-4xl font-extrabold tracking-wide text-accent sm:text-5xl"
        >
          REFUSED
        </p>
      </div>
    </div>
  );
}

export function SituationReport() {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <p className="font-mono text-xs tracking-[0.12em] text-accent uppercase">Ledger</p>
        <p className="font-mono text-xs text-muted">
          Finalized on chain or publicly logged. Testnet unless marked.
        </p>
      </div>
      <ul>
        {SITUATION_REPORT.map((row) => (
          <li
            key={row.status}
            className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-[#1c1f29] px-6 py-4"
          >
            <span
              className={`w-28 shrink-0 font-mono text-xs font-semibold ${row.tone === "bad" ? "text-accent" : "text-primary"}`}
            >
              {row.status}
            </span>
            <span className="min-w-0 flex-[1_1_18rem] text-[15px] text-fg">{row.text}</span>
            <a
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs break-all text-primary underline-offset-4 hover:underline"
            >
              {row.link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DOORS: {
  n: string;
  name: string;
  title: string;
  body: string;
  to: NonNullable<LinkProps["to"]>;
  cta: string;
  color: "primary" | "muted" | "accent";
}[] = [
  {
    n: "01",
    name: "PROVING GROUND",
    title: "Try the Demo",
    body: "Hand an agent a poisoned prompt. Watch X3 General refuse the payment it writes.",
    to: "/demo",
    cta: "Accepted and refused, side by side",
    color: "primary",
  },
  {
    n: "02",
    name: "FIELD KIT",
    title: "Learn .x3",
    body: "A small typed language for money rules: who, what asset, how much, how fast, until when.",
    to: "/learn",
    cta: "Interactive tutorial",
    color: "muted",
  },
  {
    n: "03",
    name: "ARMORY",
    title: "View the Code",
    body: ".x3 source → Rust compiler → X3BC bytecode → X3VM, plus the x3-guard NEAR contract.",
    to: "/developers",
    cta: "Repository and tools",
    color: "muted",
  },
  {
    n: "04",
    name: "X3 RECON",
    title: "Inspect the Proof",
    body: "Finalized receipts on two chains and an offline verifier that rechecks every one.",
    to: "/judge",
    cta: "Judge Console",
    color: "accent",
  },
];

const doorColor = {
  primary: { tab: "bg-primary", top: "border-t-primary", text: "text-primary" },
  muted: { tab: "bg-muted", top: "border-t-muted", text: "text-muted" },
  accent: { tab: "bg-accent", top: "border-t-accent", text: "text-accent" },
};

export function FourDoors() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {DOORS.map((d) => {
        const c = doorColor[d.color];
        return (
          <Link key={d.n} to={d.to} className="group flex flex-col text-left">
            <span aria-hidden="true" className={`ml-4 h-5 w-24 rounded-t-lg ${c.tab}`} />
            <span
              className={`card-lift flex flex-1 flex-col gap-2.5 rounded-xl border border-border border-t-[3px] bg-surface p-5 group-hover:border-primary/40 ${c.top}`}
            >
              <span className={`font-mono text-xs tracking-[0.12em] ${c.text}`}>
                DOOR {d.n} · {d.name}
              </span>
              <span className="font-display text-2xl font-bold text-fg">{d.title}</span>
              <span className="text-[15px] leading-relaxed text-[#c9ccd4]">{d.body}</span>
              <span className="mt-auto pt-2 font-mono text-[13px] text-primary">{d.cta} →</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

const CHAIN = [
  {
    n: "01",
    rank: "HIGH COMMAND",
    who: "The owner",
    what: "Signs a mandate once. Can revoke it any time.",
  },
  {
    n: "02",
    rank: "RULES OF ENGAGEMENT",
    who: "The .x3 mandate",
    what: "Recipients, assets, per-payment and 24h caps, slippage, fees, approvals, expiry.",
  },
  {
    n: "03",
    rank: "TEAM SIX",
    who: "The agents",
    what: "Investigate and propose. They write intents; they can't approve them.",
  },
  {
    n: "04",
    rank: "X3 GENERAL",
    who: "The contract",
    what: "Compares every intent to the mandate on NEAR. Deterministic. Fail-closed.",
  },
];

export function ChainOfCommand() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CHAIN.map((c, i) => {
        const last = i === CHAIN.length - 1;
        return (
          <li
            key={c.n}
            className={`flex flex-col gap-2 rounded-xl bg-surface p-5 text-left ${last ? "border-2 border-primary" : "border border-border"}`}
          >
            <span className={`font-mono text-xs ${last ? "text-primary" : "text-muted"}`}>
              {c.n} · {c.rank}
            </span>
            <span className="font-display text-xl font-bold text-fg">{c.who}</span>
            <span className="text-sm leading-relaxed text-[#c9ccd4]">{c.what}</span>
          </li>
        );
      })}
    </ol>
  );
}
