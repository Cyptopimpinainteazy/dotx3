import { createFileRoute } from "@tanstack/react-router";
import { TrackPage } from "@/components/track-page";
export const Route = createFileRoute("/agents")({
  head: () => ({ meta: [
    { title: "Agent Economy · X3 Force Field · dotx3.net" },
    { name: "description", content: "A restricted agent key authorized a signed 1Click quote on NEAR mainnet. Inspect the transaction, owner approval and hash-matched `.x3` sources, recorded outcome and custody limits." },
  ] }),
  component: Page,
});
function Page() {
  return <TrackPage slug="agents" />;
}
