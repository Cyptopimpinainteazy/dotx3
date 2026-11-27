import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/lib/env.server";
import { AgentError, writeProgram } from "@/lib/site-agent";

// A contributor GPU on the X3 mesh writes a .x3 payment program from a visitor's request.
// The browser then sends it to /api/compile, where the real compiler and mandate decide.
// X3_MESH_URL / X3_MESH_SITE_KEY / X3_MESH_MODEL are server-only environment variables.
export const Route = createFileRoute("/api/agent/write")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
        try {
          const result = await writeProgram(request, {
            meshUrl: env("X3_MESH_URL"),
            meshKey: env("X3_MESH_SITE_KEY"),
            model: env("X3_MESH_MODEL"),
          });
          return Response.json(result, { headers });
        } catch (error) {
          const known = error instanceof AgentError;
          return Response.json(
            { error: known ? error.message : "The site agent failed.", code: known ? error.code : "internal" },
            { status: known ? error.status : 500, headers },
          );
        }
      },
    },
  },
});
