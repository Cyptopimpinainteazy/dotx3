import { createFileRoute } from "@tanstack/react-router";
import { createShieldReader } from "@/lib/intents/shield.mjs";
const read = createShieldReader();
export const Route = createFileRoute("/api/shield/incidents")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(await read(), {
          headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
        }),
    },
  },
});
