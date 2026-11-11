import { createFileRoute } from "@tanstack/react-router";
import { Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { ProofFlow } from "@/components/circuit";

export const Route = createFileRoute("/proofs")({ component: ProofsPage });

function ProofsPage() {
  return (
    <SiteShell
      eyebrow="Track 03"
      title="Code the proof. Code the decision."
      lede="Formal verification becomes the executable path. Early holders of the hackathon allocation get seats in x3 langs governance."
    >
      <Section title="From invariant to execution" intro="Each step only fires if the one before it still holds.">
        <ProofFlow />
      </Section>
      <Section title="Proof layer and future seats" alt>
        <CardGrid>
          <Card title="ProofGate">
            Write the invariant once. The system derives the safe execution path across VMs. Specification and deployment do not drift.
          </Card>
          <Card title="x3 langs gov">
            The hackathon .x3 allocation is priority seating for future language and protocol governance. The mainnet trade is the entry ticket.
          </Card>
          <Card title="Contracts and agents">
            Both are bound by the same proof. The decision you code is the only decision that executes.
          </Card>
        </CardGrid>
      </Section>
    </SiteShell>
  );
}
