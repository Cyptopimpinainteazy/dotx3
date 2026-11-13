import { createFileRoute } from "@tanstack/react-router";
import { TrackPage } from "@/components/track-page";
export const Route = createFileRoute("/security")({
  head: () => ({ meta: [
    { title: "AI Security & Defense · X3 Force Field · dotx3.net" },
    { name: "description", content: "Inspect X3 Guard's mainnet policy and signed-quote checks, historical testnet refusals, and the custody and hostile-model evidence still pending." },
  ] }),
  component: Page,
});
function Page() {
  return <TrackPage slug="security" />;
}
