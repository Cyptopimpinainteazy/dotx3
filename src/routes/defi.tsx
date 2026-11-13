import { createFileRoute } from "@tanstack/react-router";
import { TrackPage } from "@/components/track-page";
export const Route = createFileRoute("/defi")({
  head: () => ({ meta: [
    { title: "Unstoppable DeFi · X3 Force Field · dotx3.net" },
    { name: "description", content: "Follow the recorded 25 USDC Solana deposit and 24.9952 USDC NEAR mainnet payout, with Guard authorization and explicit settlement evidence limits." },
  ] }),
  component: Page,
});
function Page() {
  return <TrackPage slug="defi" />;
}
