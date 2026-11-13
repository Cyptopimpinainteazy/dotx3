import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/proofs")({
  beforeLoad: () => {
    throw redirect({ to: "/proof", replace: true });
  },
});
