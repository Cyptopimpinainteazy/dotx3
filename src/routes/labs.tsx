import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { OutLink } from "@/components/code-block";
import { CompilerWorkbench } from "@/components/compiler-workbench";
import { PartnerLink } from "@/components/partner-link";

export const Route = createFileRoute("/labs")({ component: Labs });
const views = [
  { id: "compiler", label: ".x3 compiler", state: "Real compiler API", path: null },
  {
    id: "guard",
    label: "Signed quote demo",
    state: "Ported · dry quotes only",
    path: "/labs/guard/index.html",
  },
  {
    id: "judge",
    label: "Judge & policy tests",
    state: "Ported · local policy preview",
    path: "/labs/guard/judge.html",
  },
  {
    id: "attack",
    label: "Attack lab",
    state: "Ported · browser policy tests",
    path: "/labs/attack/attack-lab.html",
  },
  {
    id: "force-field",
    label: "Break the mandate",
    state: "Recorded evidence · no live calls",
    path: "/labs/force-field/index.html",
  },
  {
    id: "court",
    label: "Agent Court",
    state: "Game · real compiler and mandate checks",
    path: "/labs/court/index.html",
  },
] as const;
function Labs() {
  const [selected, setSelected] = useState<string>("compiler");
  const view = views.find((item) => item.id === selected) || views[0];
  return (
    <SiteShell
      eyebrow="Connected demos"
      title="Write it. Challenge it. Inspect the rule."
      lede="Language, quote verification, policy tests and attack demonstrations live here. Each view states what it actually checks. No scan, wallet action or deployment starts from this page."
    >
      <Section
        title="The .x3 workspace"
        intro="Ported directly from a pinned x3lang source commit. The compiler calls Python; the browser labs evaluate policy locally."
      >
        <div className="flex flex-wrap justify-center gap-3" role="tablist" aria-label="Demo views">
          {views.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={selected === item.id}
              className={`min-h-11 rounded-lg border px-5 py-3 text-sm ${selected === item.id ? "border-primary bg-primary text-bg" : "border-border bg-surface text-fg"}`}
              onClick={() => setSelected(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="my-5 text-center text-sm text-muted">{view.state}</p>
        {view.path ? (
          <>
            <a
              className="mb-3 block text-right text-primary"
              href={view.path}
              target="_blank"
              rel="noreferrer"
            >
              Open full demo ↗
            </a>
            <iframe
              key={view.id}
              title={view.label}
              src={view.path}
              className="h-screen w-full rounded-xl border border-border"
            />
          </>
        ) : (
          <CompilerWorkbench />
        )}
      </Section>
      <Section title="Choose an exercise">
        <CardGrid>
          <Card title="Write .x3">
            <p>
              Edit complete mandate and payment examples, then inspect compiler errors and local
              policy decisions.
            </p>
            <div className="mt-6">
              <ActionLink to="/bootcamp">Open developer bootcamp</ActionLink>
            </div>
          </Card>
          <Card title="Change the payment">
            <p>
              Redirect a recipient, raise a cap, change refund terms or remove a nonce. The browser
              checker evaluates the edited source.
            </p>
            <div className="mt-6">
              <ActionLink to="/playground">Open .x3 playground</ActionLink>
            </div>
          </Card>
          <Card title="Attack a scoped vault">
            <p>
              Run ten offline scenarios covering one allowed control and nine attacks, including
              replay and budget exhaustion. The session ledger stays in browser memory.
            </p>
            <a
              className="tap mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-bg"
              href="/labs/attack/attack-lab.html"
            >
              Open Attack Lab
            </a>
          </Card>
        </CardGrid>
      </Section>
      <Section title="What each result means" alt>
        <div className="mx-auto max-w-3xl space-y-4 text-muted">
          <p>
            The .x3 playground checks a Solana-USDC to NEAR-USDC mandate example. The Attack Lab
            previews a separate native-test-NEAR vault policy with a 0.2 NEAR payment cap and 0.4
            NEAR total budget. It does not compile .x3 or prove that a deployed access key enforces
            its decision.
          </p>
          <p>
            Source for the Attack Lab is pinned at X3Lang commit efb514f. The reviewed port
            preserves its policy module and evidence links.{" "}
            <OutLink href="/labs/attack/provenance.json">
              Inspect copied-file hashes and provenance
            </OutLink>
            .
          </p>
          <p>
            Local browser results, real local Sandbox vault transactions, historical public Guard
            transactions, two-chain testnet delivery and the published mainnet 1Click settlement are
            separate evidence classes. Each source guide identifies which one it records.
          </p>
        </div>
        <div className="mt-8 text-center">
          <ActionLink to="/near" outline>
            Return to the three NEAR tracks
          </ActionLink>
        </div>
      </Section>

      <Section
        title="Wallets and DeFi tools"
        intro="External tools with their own accounts and terms."
      >
        <CardGrid>
          <Card title="Meteor Wallet">
            <p>A NEAR wallet for accessing applications across the ecosystem.</p>
            <p className="mt-4">
              <PartnerLink provider="meteor" />
            </p>
          </Card>
          <Card title="RHEA Finance">
            <p>
              Explore RHEA&apos;s NEAR DeFi application. Review its pool and token details before
              use.
            </p>
            <p className="mt-4">
              <PartnerLink provider="rhea" />
            </p>
          </Card>
        </CardGrid>
      </Section>
      <Section
        title="Operations integrations"
        alt
        intro="These existing services retain their own access controls. A link is not a connected worker or an execution receipt."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-xl border border-border p-6">
            <h3 className="font-display text-xl text-primary">NEAR Intents Explorer</h3>
            <p className="my-4 text-muted">
              Inspect historical 1Click swaps and provider-reported statuses. Explorer records are
              separate from independent verification of chain finality and settlement.
            </p>
            <OutLink href="https://explorer.near-intents.org/">Open the official Explorer</OutLink>
          </article>
          <article className="rounded-xl border border-border p-6">
            <h3 className="font-display text-xl text-primary">NEAR Business</h3>
            <p className="my-4 text-muted">
              Official team treasury application. Its members propose and review financial requests
              using its own roles and voting rules. A .x3 policy preview does not authorize a
              treasury payment.
            </p>
            <p>
              <OutLink href="https://business.near.com/">Open NEAR Business</OutLink>
            </p>
            <p className="mt-3">
              <OutLink href="https://docs.business.near.com/home">
                Read the treasury documentation
              </OutLink>
            </p>
            <p className="mt-4 text-sm text-muted">
              External service · treasury connection not configured
            </p>
          </article>
          <article className="rounded-xl border border-border p-6">
            <h3 className="font-display text-xl text-primary">Control Room</h3>
            <p className="my-4 text-muted">
              Existing readiness and planning workspace, behind the owner's sign-in. Jobs are
              planning claims until a real worker returns evidence.
            </p>
            <a
              className="text-primary"
              href="https://controlroom.x3star.net"
              target="_blank"
              rel="noreferrer"
            >
              Open Control Room (owner sign-in) ↗
            </a>
            <p className="mt-4 text-sm text-muted">
              Owner sign-in required · operational controls not ported
            </p>
          </article>
          <article className="rounded-xl border border-border p-6">
            <h3 className="font-display text-xl text-primary">Phantom</h3>
            <p className="my-4 text-muted">
              Scan worker source, authenticated API, authorized target selection and report
              authenticity are required before scans can run here.
            </p>
            <button className="min-h-11 rounded-lg border border-border px-4 text-muted" disabled>
              Worker integration pending
            </button>
            <p className="mt-4 text-sm text-muted">Unverified · no scan started</p>
          </article>
          <article className="rounded-xl border border-border p-6">
            <h3 className="font-display text-xl text-primary">Radar</h3>
            <p className="my-4 text-muted">
              Radar's canonical source and data contract have not been identified. No invented
              targets, live telemetry or test results appear here.
            </p>
            <button className="min-h-11 rounded-lg border border-border px-4 text-muted" disabled>
              Source integration pending
            </button>
            <p className="mt-4 text-sm text-muted">Unverified · no telemetry connected</p>
          </article>
        </div>
        <p className="mt-8 text-sm text-muted">
          Eye remains the desktop shell, behind the owner's sign-in.{" "}
          <a
            className="text-primary"
            href="https://eye.x3star.net"
            target="_blank"
            rel="noreferrer"
          >
            Open Eye (owner sign-in) ↗
          </a>
          . Port provenance:{" "}
          <a className="text-primary" href="/x3lang-port.json">
            source commit and file digests
          </a>
          .
        </p>
      </Section>
    </SiteShell>
  );
}
