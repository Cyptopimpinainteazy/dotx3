import { createFileRoute } from "@tanstack/react-router";
import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { OutLink } from "@/components/code-block";

export const Route = createFileRoute("/labs")({ component: LabsPage });
function LabsPage() {
  return (
    <SiteShell
      eyebrow="Learn by changing a request"
      title="Write it. Challenge it. Inspect the rule."
      lede="Use the .x3 checker for mandate and payment source. Use the Attack Lab to explore native-NEAR vault policy scenarios. Both run locally in the browser; they exercise different policy surfaces."
    >
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
            Source for the Attack Lab is pinned at X3Lang commit a120169. The branch port preserves
            its policy module and evidence links.{" "}
            <OutLink href="/labs/attack/provenance.json">
              Inspect copied-file hashes and provenance
            </OutLink>
            .
          </p>
          <p>
            Local browser results, real local Sandbox vault transactions, historical public Guard
            transactions and two-chain testnet delivery are separate evidence classes. Each source
            guide identifies which one it records.
          </p>
        </div>
        <div className="mt-8 text-center">
          <ActionLink to="/near" outline>
            Return to the three NEAR tracks
          </ActionLink>
        </div>
      </Section>
    </SiteShell>
  );
}
