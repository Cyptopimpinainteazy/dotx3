import { createFileRoute } from "@tanstack/react-router";
import {
  ActionLink,
  Card,
  CardGrid,
  Section,
  SiteShell,
  StaticActionLink,
} from "@/components/site-shell";
import { ProofFlow, RouteTicker } from "@/components/circuit";
import { EnterGate } from "@/components/enter-gate";
import { WatchVideo } from "@/components/watch-video";
import { openIntro, SONG } from "@/lib/song";
import { MeterScene } from "@/components/meter-scene";
import { GuardScene } from "@/components/guard-scene";
import { CaseFileCard, ChainOfCommand, FourDoors, SituationReport } from "@/components/dossier";
import { ARCADE_URL, BACKING_LINKS_VISIBLE, EVIDENCE_SNAPSHOT, getProofSummary, hasMilestoneEvidence, LINKS, MILESTONES, SITE, TOKEN } from "@/lib/front-door";

export const Route = createFileRoute("/")({ component: Home });

function ProofMeter() {
  const { posted, total, progress, percent: pct } = getProofSummary();

  return (
    <div className="mx-auto max-w-4xl">
      <MeterScene progress={progress} />
      <div
        className="h-8 overflow-hidden rounded-full bg-surface-2"
        role="meter"
        aria-valuenow={posted}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Proofs posted: ${posted} of ${total}`}
      >
        <div
          className={`flex h-full items-center justify-end bg-primary text-xs font-semibold text-bg transition-[width] duration-500 ${posted ? "meter-sheen pr-3" : ""}`}
          style={{ width: `${posted ? Math.max(progress * 100, 8) : 0}%` }}
        >
          {posted ? `${pct}%` : null}
        </div>
      </div>
      <p className="mt-3 text-center font-display text-2xl text-fg">
        Proofs posted: {posted} / {total}
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        A milestone counts only when its proof is public: a finalized transaction, a merged change
        with tests, or a published report. Each of the same eight milestones has equal weight.
        {" "}{progress * 100}% exact coverage, rounded to {pct}% for display.
      </p>
      <p className="mt-2 text-center text-xs text-muted">
        Reviewed {EVIDENCE_SNAPSHOT.dateLabel} against{" "}
        <a href={LINKS.reviewedSource} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
          X3Lang {EVIDENCE_SNAPSHOT.commit.slice(0, 7)}
        </a>. This measures published proof, not a security rating or a hackathon score.
      </p>

      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {MILESTONES.map((m, i) => (
          <li key={m.title} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-fg">
                {i + 1}. {m.title}
              </p>
              <span
                className={`text-xs font-semibold ${hasMilestoneEvidence(m) ? "text-primary" : "text-accent"}`}
              >
                {hasMilestoneEvidence(m) ? "Posted" : "Pending"}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{m.proof}</p>
            {hasMilestoneEvidence(m) ? (
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {m.evidence!.map((e) => (
                  <a
                    key={e.href}
                    href={e.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    {e.label}
                  </a>
                ))}
              </p>
            ) : null}
            {m.nextAction ? (
              <p className="mt-3 text-sm text-muted">
                <span className="font-semibold text-fg">Next: </span>{m.nextAction}
                {m.nextHref ? <> <a href={m.nextHref} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">Inspect the work</a></> : null}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {BACKING_LINKS_VISIBLE ? <ActionLink to="/back">Back .x3</ActionLink> : null}
        <ActionLink to="/proof" outline={BACKING_LINKS_VISIBLE}>
          Inspect mainnet and testnet proof
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
      eyebrow={`X3 Force Field · ${SITE} · NEAR Hackathon`}
      title="Your AI agent can be talked into anything. Your money can't."
      lede="X3 Force Field is programmable security for AI agents: owners write typed .x3 mandates, agents propose .x3 payment programs, the compiler rejects unsafe edits and NEAR Guard checks signed 1Click terms. The model cannot authorize a payment."
      actions={
        <>
          <ActionLink to="/judge">Open the Judge Console</ActionLink>
          <ActionLink to="/playground" outline>
            Try to break it
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
      media={<GuardScene />}
    >
      <EnterGate />
      <WatchVideo />
      <RouteTicker />

      <Section
        title="Four doors. Pick one."
        intro="Every door ends at something you can run or check."
      >
        <FourDoors />
      </Section>

      <Section
        title="Situation Report"
        intro="Case file 01, then the ledger. Every line ends at a finalized transaction or a published log."
        alt
      >
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <CaseFileCard />
          <SituationReport />
        </div>
      </Section>

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
              A mandate names the agent, the asset, the caps, the recipient, slippage, fees, and
              when the owner must approve.
            </Card>
            <Card title="The agent writes a program">
              The payment is another .x3 file. If it pays the wrong account, drops the nonce, or
              breaks a cap, it does not compile or Guard refuses it.
            </Card>
            <Card title="Settlement is labeled">
              Mainnet: 25 USDC from Solana, 24.9952 USDC delivered on NEAR after Guard accepted
              the official signed 1Click quote. The earlier Base Sepolia trade remains testnet evidence.
              Guard authorization and wallet custody are different claims.
            </Card>
          </CardGrid>
        </div>
      </Section>

      <Section
        title="Chain of command"
        intro="Authority runs one way. The agent is third in line and cannot approve itself."
        alt
      >
        <ChainOfCommand />
      </Section>

      <Section
        title="How a decision moves"
        intro="The program names Base, Solana, or NEAR. Guard checks the quote and mandate. A separate funding wallet makes the deposit; finalized receipts show delivery."
      >
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
            Protocol mark in motion. The trade it stands for is on Inspect the Proof: testnet, not
            mainnet.
          </figcaption>
        </figure>
      </Section>

      <Section
        title="Proof meter"
        intro="Three published milestones, including the official mainnet settlement. The remaining five show exactly what evidence is still needed."
      >
        <ProofMeter />
      </Section>

      <Section title="One demonstration, three tracks" alt>
        <CardGrid>
          <Card title="AI Security & Defense">
            Recipient and asset allowlists, caps, slippage, fees, expiry, one-use nonces. Compiler
            off-chain, contract checks on NEAR. The mainnet quote passed 21 checks; hostile-model
            mainnet refusal evidence remains pending.
          </Card>
          <Card title="Agent Economy">
            A restricted agent key accepted the mainnet quote after owner approval, and later
            recorded a Settled outcome. First-party records identify manual Solflare funding;
            Guard-controlled source custody is still unproven.
          </Card>
          <Card title="Unstoppable DeFi">
            Official 1Click settlement from Solana to NEAR mainnet, plus the earlier Base Sepolia
            testnet trade. Each has its own receipts and limits; neither establishes atomic settlement.
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
            {TOKEN.contract
              ? `The ${TOKEN.symbol} community token is live on NEAR mainnet. Check the contract below before you trade: look-alike tokens with the same symbol exist.`
              : `The ${TOKEN.symbol} community token is planned as a ${TOKEN.standard} on NEAR mainnet. It is not deployed yet, and nothing here sells it. Its contract and deploy transaction appear here once they are final.`}
          </p>
          <p className="mt-6 inline-flex rounded-full bg-accent px-4 py-1 font-display text-sm font-bold text-bg">
            {TOKEN.symbol}
          </p>
          <p className="mt-4 text-sm text-muted">
            Symbol {TOKEN.symbol} · Standard {TOKEN.standard} · Chain NEAR ·{" "}
            {TOKEN.contract ? (
              <>
                <span className="font-mono break-all text-fg">{TOKEN.contract}</span>
                {TOKEN.deployTx ? (
                  <>
                    {" · "}
                    <a
                      href={TOKEN.deployTx}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      Deploy transaction
                    </a>
                  </>
                ) : null}
              </>
            ) : (
              <span className="text-accent">Not deployed</span>
            )}
          </p>
          {BACKING_LINKS_VISIBLE ? (
            <div className="mt-6 flex justify-center">
              <ActionLink to="/back" outline>
                Token and pool status
              </ActionLink>
            </div>
          ) : null}
        </div>
      </Section>
    </SiteShell>
  );
}
