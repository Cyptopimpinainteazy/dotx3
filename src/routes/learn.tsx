import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { X3Tutorial } from "@/components/x3-tutorial";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn .x3 — interactive tutorial · dotx3.net" },
      {
        name: "description",
        content:
          "Nine short lessons: read and write .x3 intents and mandates, then watch the real x3lang checker refuse unsafe agent payments in your browser.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <SiteShell
      eyebrow="Learn .x3 · interactive tutorial"
      title="Write money rules an AI agent can't talk its way around."
      lede="Nine short lessons. Read a real agent payment and a real owner mandate, write your own, then try to slip an unsafe payment past the checker. Every result is computed in your browser by the same x3lang checker the Playground uses."
    >
      <X3Tutorial />
    </SiteShell>
  );
}
