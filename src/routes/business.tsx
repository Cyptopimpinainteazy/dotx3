import { createFileRoute } from "@tanstack/react-router";
import { TrackPage } from "@/components/track-page";
export const Route = createFileRoute("/business")({
  head: () => ({ meta: [
    { title: "Autonomous Business · X3 Force Field · dotx3.net" },
    { name: "description", content: "Owner-set spending constraints an AI-run business can put in front of its agents, enforced by NEAR Guard on mainnet, with the limits of the one owner-funded invoice_06 payment stated plainly." },
  ] }),
  component: Page,
});
function Page() {
  return <TrackPage slug="business" />;
}
