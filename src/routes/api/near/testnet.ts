import { createFileRoute } from "@tanstack/react-router";
import { lookup, LookupError, parseLookup } from "@/lib/near-testnet";

// Read-only NEAR testnet lookups for the /ide demo. See src/lib/near-testnet.ts.
export const Route = createFileRoute("/api/near/testnet")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const headers: Record<string, string> = { "X-Content-Type-Options": "nosniff" };
        try {
          const l = parseLookup(new URL(request.url).searchParams);
          const result = await lookup(l);
          // Final blocks and finished txs never change; "latest" moves every second.
          const fixed = (l.m === "block" && l.id !== "final") || l.m === "chunk";
          headers["Cache-Control"] = fixed ? "public, s-maxage=3600, max-age=300" : "public, s-maxage=1, max-age=0";
          return Response.json({ network: "testnet", result }, { headers });
        } catch (error) {
          headers["Cache-Control"] = "no-store";
          const known = error instanceof LookupError;
          return Response.json(
            { network: "testnet", error: known ? error.code : "TESTNET_UNAVAILABLE", message: known ? error.message : "Lookup failed" },
            { status: known ? error.status : 503, headers },
          );
        }
      },
    },
  },
});
