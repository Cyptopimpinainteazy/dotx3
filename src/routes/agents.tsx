import { createFileRoute } from "@tanstack/react-router";
import { Card, CardGrid, Section, SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/agents")({ component: AgentsPage });

function AgentsPage() {
  return (
    <SiteShell
      eyebrow="Track 02"
      title="Control agents"
      lede="Agents operate inside the proof bounds you define. They execute intents and coordinate — never outside the decision you coded."
      media={
        <img
          src="/media/agents.jpg"
          alt="Agents coordinating around a smart contract"
          className="scan w-full max-w-3xl rounded-xl border border-border"
        />
      }
    >
      <Section title="Agents under proof">
        <CardGrid>
          <Card title="Intent execution">
            An agent requests a quote and submits a deposit through 1Click. The route must satisfy the formal invariant or it does not fire.
          </Card>
          <Card title="Swarm coordination">
            Multiple agents bid, pool, and settle through NEAR Intents. The swarm still resolves to one coded decision.
          </Card>
          <Card title="Treasury limits">
            Agents can spend, only inside pre-verified bounds. Limits, reputation, and settlement share the same verification layer.
          </Card>
        </CardGrid>
      </Section>
    </SiteShell>
  );
}
