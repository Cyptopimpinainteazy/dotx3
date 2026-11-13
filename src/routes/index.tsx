import { createFileRoute } from "@tanstack/react-router";
import { ActionLink, Card, CardGrid, Section, SiteShell, StaticActionLink } from "@/components/site-shell";
import { ProofFlow, RouteTicker } from "@/components/circuit";
import { EnterGate } from "@/components/enter-gate";
import { WatchVideo } from "@/components/watch-video";
import { openIntro, SONG } from "@/lib/song";
import { HeroField, MeterScene } from "@/components/meter-scene";
import { ARCADE_URL, BACKING_LINKS_VISIBLE, MILESTONES, SITE } from "@/lib/front-door";

export const Route = createFileRoute("/")({ component: Home });

function ProofMeter() {
  const posted = MILESTONES.filter((m) => m.evidence !== null);
  const total = MILESTONES.length;
  const pct = Math.round((posted.length / total) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <MeterScene progress={posted.length / total} />
      <div
        className="h-8 overflow-hidden rounded-full bg-surface-2"
        role="meter"
        aria-valuenow={posted.length}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Proofs posted: ${posted.length} of ${total}`}
      >
        <div
          className={`flex h-full items-center justify-end bg-primary text-xs font-semibold text-bg transition-[width] duration-500 ${posted.length ? "meter-sheen pr-3" : ""}`}
          style={{ width: `${posted.length ? Math.max(pct, 8) : 0}%` }}
        >
          {posted.length ? `${pct}%` : null}
        </div>
      </div>
      <p className="mt-3 text-center font-display text-2xl text-fg">
        Proofs posted: {posted.length} / {total}
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        A milestone counts only when its proof is public: a finalized transaction, a merged change with tests, or a published report. Nothing here is estimated.
      </p>

      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {MILESTONES.map((m, i) => (
          <li key={m.title} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-fg">
                {i + 1}. {m.title}
              </p>
              <span className={`text-xs font-semibold ${m.evidence ? "text-primary" : "text-accent"}`}>{m.evidence ? "Posted" : "Pending"}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{m.proof}</p>
            {m.evidence ? (
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {m.evidence.map((e) => (
                  <a key={e.href} href={e.href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                    {e.label}
                  </a>
                ))}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {BACKING_LINKS_VISIBLE ? <ActionLink to="/back">Back .x3</ActionLink> : null}
        <ActionLink to="/proof" outline={BACKING_LINKS_VISIBLE}>
          Proof already on testnet
        </ActionLink>
        <ActionLink to="/playground" outline>
          Try to break a mandate
        </ActionLink>
      </div>
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
          <ActionLink to="/playground" outline>
            Break a Mandate
          </ActionLink>
          <StaticActionLink href={ARCADE_URL} outline>
            Watch an Agent Play
          </StaticActionLink>
          <button
            type="button"
            onClick={openIntro}
            className="tap inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-accent px-6 text-sm font-semibold text-accent hover:bg-accent/10"
          >
            <span aria-hidden="true">▶</span> Watch “{SONG.title}”
          </button>
        </>
      }
      media={<HeroField />}
    >
      <EnterGate />
      <WatchVideo />
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

      <Section title="Testnet trade demo" alt>
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
            Protocol mark in motion. The trade it stands for is on Inspect the Proof: testnet, not mainnet.
          </figcaption>
        </figure>
      </Section>

      <Section
        title="Proof meter"
        intro="From the testnet proof already posted to a system people can trust with money. Each milestone fills only when its proof is public."
      >
        <ProofMeter />
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
