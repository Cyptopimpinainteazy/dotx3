import { createFileRoute } from "@tanstack/react-router";
import { explorerConfigured } from "@/lib/explorer/configured";

// Lets /proof decide, without calling the rate-limited provider, whether to offer live
// history or show the recorded evidence. Returns a boolean only.
export const Route = createFileRoute("/api/explorer/status")({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          { configured: explorerConfigured(process.env) },
          { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
        ),
    },
  },
});
