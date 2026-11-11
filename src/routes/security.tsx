import { createFileRoute } from "@tanstack/react-router";
import { TrackPage } from "@/components/track-page";
export const Route = createFileRoute("/security")({ component: Page });
function Page() {
  return <TrackPage slug="security" />;
}
