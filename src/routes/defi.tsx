import { createFileRoute } from "@tanstack/react-router";
import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { RouteTicker } from "@/components/circuit";

export const Route = createFileRoute("/defi")({ component: DefiPage });

function DefiPage() {
  return (
    <SiteShell
      eyebrow="Track 01"
      title="Unstoppable DeFi"
      lede="The published route is one .x3 program: 1 test USDC from Base Sepolia to NEAR testnet. It is not an official 1Click mainnet settlement."
    >
      <RouteTicker />
      <Section title="Hackathon testnet trade">
        <CardGrid>
          <Card title="What finalized">
            1.000000 test USDC left Base Sepolia. 0.997400 arrived on NEAR testnet. The relay was trusted. That is not atomic settlement.
          </Card>
          <Card title="Reusable examples">
            Quote, deposit, status. The calls are on the code page. Dry first. A live quote can spend real funds.
          </Card>
          <Card title="Official 1Click">
            Signature checks ran on testnet. The live quote that matched policy stopped before a deposit. No funded official settlement is claimed.
          </Card>
        </CardGrid>
        <div className="mt-10 text-center">
          <ActionLink to="/proof">Inspect the Proof</ActionLink>
        </div>
      </Section>
    </SiteShell>
  );
}
