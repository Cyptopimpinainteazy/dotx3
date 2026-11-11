import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CodeBlock, OutLink, Tag } from "@/components/code-block";
import { Section, SiteShell } from "@/components/site-shell";
import { LINKS, MANDATE } from "@/lib/front-door";

export const Route = createFileRoute("/demo")({ component: DemoPage });

type Attempt = "pay" | "attack";

const RULES = [
  "Owner x3-owner.near. Agent x3-agent.near.",
  "Spend Solana.USDC. At most 50 USDC a payment, 200 USDC in 24 hours.",
  "Only recipient x3-demo.near. Only destination asset Near.USDC.",
  "A failed swap refunds only to the owner's pinned Solana address.",
  "Slippage at most 1%. Fees at most 100 bps.",
  "Anything above 30 USDC needs the owner. Mandate expires in 30 days.",
];

function DemoPage() {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const accepted = attempt === "pay";

  return (
    <SiteShell
      eyebrow="Try the Demo"
      title="Accepted payment. Rejected attack."
      lede="The rules stay on screen. Pick a payment. The verdict is the same one the published checks already returned. This page does not send a transaction."
    >
      <Section title="Run the integrated demos"><p className="text-center text-muted">The original page below replays published decisions. <a className="text-primary underline" href="/labs">Open the actual compiler, signed-quote demo, judge tests and attack lab →</a></p></Section>
      <Section title="The owner's .x3 rules">
        <ul className="mx-auto grid max-w-3xl gap-3">
          {RULES.map((rule) => (
            <li key={rule} className="rounded-xl border border-border bg-surface px-4 py-3 text-muted">
              {rule}
            </li>
          ))}
        </ul>
        <CodeBlock title="near_mandate_agent.x3" code={MANDATE} />
        <p className="mt-4 text-sm text-muted">
          Source file: <OutLink href={LINKS.mandate}>near_mandate_agent.x3</OutLink>
        </p>
      </Section>

      <Section title="Run one payment" alt>
        <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row">
          <button
            type="button"
            className="tap min-h-11 flex-1 rounded-full bg-primary px-5 text-sm font-semibold text-bg"
            onClick={() => setAttempt("pay")}
          >
            Pay x3-demo.near 25 USDC
          </button>
          <button
            type="button"
            className="tap min-h-11 flex-1 rounded-full bg-accent px-5 text-sm font-semibold text-bg"
            onClick={() => setAttempt("attack")}
          >
            Pay attacker.near 25 USDC
          </button>
        </div>

        {attempt ? (
          <article
            className={`mx-auto mt-8 max-w-3xl rounded-xl border p-6 ${accepted ? "border-primary bg-surface" : "border-accent bg-surface"}`}
          >
            <Tag>{accepted ? "Accepted" : "Refused"}</Tag>
            <h3 className="mt-4 font-display text-2xl text-fg">
              {accepted ? "preflight_passed" : "denied_by_policy"}
            </h3>
            {accepted ? (
              <div className="mt-4 space-y-3 text-muted">
                <p>
                  Local check on the example mandate: recipient, asset, caps, slippage, and fees all pass. The README records this next to <span className="text-fg">authorized: decision=preflight_passed</span>.
                </p>
                <p>
                  On NEAR testnet the matching allowed control registered an intent to <span className="text-fg">x3lang.testnet</span>, not this example address. That is a different account pair. Transaction{" "}
                  <OutLink href={LINKS.acceptTx}>DPJfcRUGk56h8sSsFsDFFgUMQAiyBCtpMuvquF9FvTct</OutLink>.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-muted">
                <p>
                  Failed guard: <span className="text-fg">mandate_recipient</span>. Detail from the local check: attacker.near, allowed ['x3-demo.near']. The other guards on that payment pass. Exit code 6.
                </p>
                <p>
                  On NEAR testnet, <span className="text-fg">agent_register_intent</span> to attacker.near failed the same guard. Allowed list on that live mandate was ["x3lang.testnet"]. Nothing was stored. Transaction{" "}
                  <OutLink href={LINKS.refuseTx}>AhVBD7oXfwsixBipupjCzuhNdqunjdXJnLz3LXnmfnN8</OutLink>.
                </p>
                <p>
                  Program: <OutLink href={LINKS.denied}>near_intents_agent_denied.x3</OutLink>
                </p>
              </div>
            )}
          </article>
        ) : (
          <p className="mx-auto mt-8 max-w-3xl text-center text-muted">
            Neither button calls Guard. They replay the published local decision and point at the testnet receipts. To run the checker yourself on edited programs, open the{" "}
            <Link to="/playground" className="text-primary underline underline-offset-4">
              playground
            </Link>
            .
          </p>
        )}
      </Section>
    </SiteShell>
  );
}
