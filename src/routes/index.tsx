import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { ProofFlow, RouteTicker } from "@/components/circuit";
import { HeroField, MeterScene } from "@/components/meter-scene";
import { SITE } from "@/lib/front-door";

export const Route = createFileRoute("/")({ component: Home });

const GOAL = 100_000_000_000;
const KEY = "dotx3-raised-v3";

type OriginId = "base" | "solana" | "near";
type Book = Record<OriginId, number>;

const EMPTY: Book = { base: 0, solana: 0, near: 0 };

const ORIGINS: { id: OriginId; name: string; asset: string; file: string }[] = [
  {
    id: "base",
    name: "Base",
    asset: "Base.USDC",
    file: "base_sepolia_to_near_testnet_1usdc.x3",
  },
  {
    id: "solana",
    name: "Solana",
    asset: "Solana.USDC",
    file: "near_intents_sol_to_near.x3",
  },
  {
    id: "near",
    name: "NEAR",
    asset: "Near.USDC",
    file: "near_mandate_agent.x3",
  },
];

function intentFor(origin: OriginId, usd: number) {
  const units = usd * 1_000_000;
  const floor = Math.floor(units * 0.99);
  if (origin === "base") {
    return `intent invest_from_base {
    from Base.USDC amount ${units} receiver YOUR_BASE_ADDRESS
    to Near.USDC receiver YOUR_NEAR_ACCOUNT
    route {
        bridge NearIntents Base.USDC -> Near.USDC min_receive ${floor};
    }
    require slippage <= 1%
    require fees <= 100 bps
    require nonce unused invest_base_once
    timeout 30m refund Base.USDC to YOUR_BASE_ADDRESS
    on_fail rollback
}`;
  }
  if (origin === "solana") {
    return `intent invest_from_solana {
    from Solana.USDC amount ${units} receiver YOUR_SOLANA_ADDRESS
    to Near.USDC receiver YOUR_NEAR_ACCOUNT
    route {
        bridge NearIntents Solana.USDC -> Near.USDC min_receive ${floor};
    }
    require slippage <= 1%
    require fees <= 100 bps
    require nonce unused invest_solana_once
    timeout 10m refund Solana.USDC
    on_fail rollback
}`;
  }
  return `intent invest_on_near {
    from Near.USDC amount ${units} receiver YOUR_NEAR_ACCOUNT
    to Near.USDC receiver YOUR_NEAR_ACCOUNT
    under mandate x3-owner.near
    require slippage <= 1%
    require fees <= 100 bps
    require nonce unused invest_near_once
    timeout 30m refund Near.USDC
    on_fail rollback
}`;
}

function loadBook(): Book {
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<Book>;
    return {
      base: Number.isFinite(parsed.base) ? Math.max(0, parsed.base as number) : 0,
      solana: Number.isFinite(parsed.solana) ? Math.max(0, parsed.solana as number) : 0,
      near: Number.isFinite(parsed.near) ? Math.max(0, parsed.near as number) : 0,
    };
  } catch {
    return EMPTY;
  }
}

function Meter() {
  const [book, setBook] = useState<Book>(EMPTY);
  const [chain, setChain] = useState<OriginId>("base");

  useEffect(() => {
    setBook(loadBook());
  }, []);

  function write(next: Book) {
    const clamped: Book = {
      base: Math.max(0, next.base),
      solana: Math.max(0, next.solana),
      near: Math.max(0, next.near),
    };
    const sum = clamped.base + clamped.solana + clamped.near;
    if (sum > GOAL) {
      const scale = GOAL / sum;
      clamped.base = Math.floor(clamped.base * scale);
      clamped.solana = Math.floor(clamped.solana * scale);
      clamped.near = GOAL - clamped.base - clamped.solana;
    }
    setBook(clamped);
    window.localStorage.setItem(KEY, JSON.stringify(clamped));
  }

  const raised = book.base + book.solana + book.near;
  const pct = Math.round((raised / GOAL) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <MeterScene progress={raised / GOAL} />
      <div className="h-8 overflow-hidden rounded-full bg-surface-2" role="meter" aria-valuenow={raised} aria-valuemin={0} aria-valuemax={GOAL} aria-label="Raised from Base, Solana, and NEAR toward $100,000,000,000">
        <div
          className={`flex h-full items-center justify-end bg-primary pr-3 text-xs font-semibold text-bg transition-[width] duration-500 ${raised > 0 ? "meter-sheen" : ""}`}
          style={{ width: `${Math.max(pct, raised > 0 ? 8 : 0)}%` }}
        >
          {raised > 0 ? `${pct}%` : null}
        </div>
      </div>
      <p className="mt-3 text-center text-muted">
        Raised ${raised.toLocaleString()} / Goal ${GOAL.toLocaleString()}
        {raised === 0 ? " · 0%" : ""}
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        Same path as the software. Base and Solana bridge through NearIntents. NEAR is already there, so that program has no bridge. Guard checks the terms either way. This page only records the mark. It does not move funds.
      </p>

      <div className="mt-8" role="radiogroup" aria-label="Choose chain">
        <p className="mb-4 text-center font-display text-lg text-fg">Choose chain</p>
        <div className="grid gap-4 md:grid-cols-3">
          {ORIGINS.map((origin) => {
            const amount = book[origin.id];
            const share = raised === 0 ? 0 : Math.round((amount / raised) * 100);
            const selected = chain === origin.id;
            return (
              <button
                key={origin.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChain(origin.id)}
                className={`rounded-xl border bg-surface p-5 text-left ${selected ? "border-primary" : "border-border"}`}
              >
                <p className="font-display text-xs tracking-widest text-accent uppercase">
                  {selected ? "Selected · " : ""}
                  {origin.name}
                </p>
                <p className="mt-2 font-display text-3xl text-fg">${amount.toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted">{share}% of what is marked · asset {origin.asset}</p>
                <p className="mt-3 text-xs text-muted">Checked-in shape: {origin.file}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          className="tap min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-bg"
          onClick={() => write({ ...book, [chain]: book[chain] + 1000 })}
        >
          Log $1,000 on {ORIGINS.find((origin) => origin.id === chain)?.name}
        </button>
      </div>

      <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-bg p-4 text-sm text-primary">
        <code>{intentFor(chain, 1000)}</code>
      </pre>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className="tap min-h-11 rounded-full bg-accent px-5 text-sm font-semibold text-bg"
          onClick={() => {
            const share = Math.floor(GOAL / 3);
            write({ base: share, solana: share, near: GOAL - share * 2 });
          }}
        >
          Fill all rails
        </button>
        <button
          type="button"
          className="tap min-h-11 rounded-full border border-border px-5 text-sm font-semibold text-fg"
          onClick={() => write(EMPTY)}
        >
          Reset meter
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Stored only in this browser. The published Base trade is 1 test USDC on Base Sepolia. Solana uses the repo’s canonical example. NEAR uses the mandate that already allows Near.USDC, with no bridge. None of these marks is a finalized investment.
      </p>
    </div>
  );
}

function Home() {
  return (
    <SiteShell
      eyebrow={`${SITE} · NEAR Hackathon`}
      title=".x3"
      lede="Understand it, try it, inspect the proof, and get the code. An agent can propose a payment. The owner's .x3 policy decides whether Guard authorizes the deposit address."
      actions={
        <>
          <ActionLink to="/demo">Try the Demo</ActionLink>
          <ActionLink to="/docs" outline>
            Learn .x3
          </ActionLink>
          <ActionLink to="/developers" outline>
            View the Code
          </ActionLink>
          <ActionLink to="/proof" outline>
            Inspect the Proof
          </ActionLink>
        </>
      }
      media={<HeroField />}
    >
      <RouteTicker />

      <Section
        title="What .x3 does"
        intro="One policy. The compiler checks it. Guard checks it again. The model does not get a vote."
      >
        <img
          src="/media/logo.jpg"
          alt=".x3 protocol mark"
          className="scan mx-auto mb-10 w-full max-w-lg rounded-xl border border-border"
        />
        <div>
          <CardGrid>
            <Card title="The owner writes the rule">
              A mandate names the agent, the asset, the caps, the recipient, slippage, fees, and when the owner must approve.
            </Card>
            <Card title="The agent writes a program">
              The payment is another .x3 file. If it pays the wrong account, drops the nonce, or breaks a cap, it does not compile or Guard refuses it.
            </Card>
            <Card title="Settlement is labeled">
              The published trade is testnet: 1 test USDC from Base Sepolia to NEAR. Official 1Click quotes were checked and stopped before a deposit.
            </Card>
          </CardGrid>
        </div>
      </Section>

      <Section title="How a decision moves" intro="The program names Base, Solana, or NEAR. Guard allows the deposit or it refuses. Base and Solana bridge. NEAR does not.">
        <ProofFlow
          steps={[
            { label: "Base", detail: "Bridge to NEAR" },
            { label: "Solana", detail: "Bridge to NEAR" },
            { label: "NEAR", detail: "Already there" },
            { label: "Guard", detail: "Quote terms or refusal" },
          ]}
        />
      </Section>

      <Section title="Mainnet trade demo" alt>
        <figure className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-bg">
          <video
            className="scan aspect-video w-full bg-bg"
            src="/media/hero.mp4"
            poster="/media/logo.jpg"
            controls
            playsInline
            muted
            loop
            autoPlay
          />
          <figcaption className="px-4 py-3 text-center text-sm text-muted">
            Protocol mark in motion. Drop the Claude clip in when it is hosted — the Claude file link was behind a login wall.
          </figcaption>
        </figure>
      </Section>

      <Section
        title="Invest from Base, Solana, or NEAR"
        intro="Choose Base, Solana, or NEAR. The .x3 program switches to that asset, and the log lands on the rail you picked."
      >
        <Meter />
      </Section>

      <Section title="One demonstration, three tracks" alt>
        <CardGrid>
          <Card title="AI Security & Defense">
            Recipient and asset allowlists, caps, slippage, fees, expiry, one-use nonces. Compiler off-chain. x3-guard on NEAR testnet.
          </Card>
          <Card title="Agent Economy">
            Permitted, approval-required, and denied payments. Testnet shows one allowed intent and one refused intent.
          </Card>
          <Card title="Unstoppable DeFi">
            One .x3 program, hash bound before the source transfer, then finalized on Base Sepolia and NEAR testnet through a trusted relay.
          </Card>
        </CardGrid>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ActionLink to="/demo">Try the Demo</ActionLink>
          <ActionLink to="/proof" outline>
            Inspect the Proof
          </ActionLink>
        </div>
      </Section>

      <Section title=".x3 on NEAR">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted">
            A NEP-141 community token. Fastest launch is a factory or Smithii Token Creator — one signature, full supply to treasury, then distribute against verified mainnet trades.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-accent px-4 py-1 font-display text-sm font-bold text-bg">.X3</p>
          <p className="mt-4 text-sm text-muted">Symbol .X3 · Standard NEP-141 · Chain NEAR</p>
        </div>
      </Section>
    </SiteShell>
  );
}
