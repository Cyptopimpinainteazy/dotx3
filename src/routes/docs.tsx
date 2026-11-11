import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock, OutLink, Tag } from "@/components/code-block";
import { Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { LINKS, MANDATE, TRADE } from "@/lib/front-door";

export const Route = createFileRoute("/docs")({ component: DocsPage });

function DocsPage() {
  return (
    <SiteShell
      eyebrow="Learn .x3"
      title="Write the rule. The agent does not get to waive it."
      lede="X3 is the owner's typed policy and the agent's payment program. A deterministic compiler and x3-guard on NEAR compare them. Model output never authorizes a deposit."
    >
      <div className="mx-auto max-w-6xl px-5 pt-8"><a href="/bootcamp" className="tap inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-primary">Enter Bootcamp — the in-depth .x3 developer course →</a></div>
      <Section title="Quickstart">
        <p className="text-muted">
          From the repository root. Steps 1 to 8 in the README are offline after install: no wallet, no API key, nothing signed. The README records that walkthrough at commit <span className="text-fg">c5a4e39</span>. Confirm the current tip before you quote a pass count.
        </p>
        <CodeBlock
          title="Install"
          code={`python3 -m venv .venv && . .venv/bin/activate
pip install -r x3-lang/requirements.txt pytest`}
        />
        <CodeBlock
          title="Hash the trade program, then run the suite"
          code={`sha256sum x3-lang/examples/base_sepolia_to_near_testnet_1usdc.x3
python3 x3-lang/cli.py x3-lang/examples/arb_solana_eth.x3
PYTHONPATH=x3-lang python3 -m pytest x3-lang/tests -q`}
        />
        <p className="mt-4 text-sm text-muted">
          At the recorded commit the suite printed <span className="text-fg">594 passed, 1 skipped</span>. Rust contract tests are separate: <span className="text-fg">cd x3-lang/near/x3-guard && cargo test --locked</span>, recorded as 62 passed.
        </p>
      </Section>

      <Section title="Syntax" alt>
        <CodeBlock title="Owner mandate" code={MANDATE} />
        <CodeBlock title="The program behind the testnet trade" code={TRADE} />
        <p className="mt-4 text-sm text-muted">
          <OutLink href={LINKS.mandate}>Mandate file</OutLink>
          {" · "}
          <OutLink href={LINKS.trade}>Trade file</OutLink>
          {" · "}
          <OutLink href={LINKS.examples}>All examples</OutLink>
        </p>
      </Section>

      <Section title="Compiler and execution">
        <CardGrid>
          <Card title="What compiles today">
            The Python frontend parses, type-checks, and checks mandates. Unsafe edits fail before a quote. Nine checked-in edits are refused at compile time, including a dropped nonce and a look-alike recipient.
          </Card>
          <Card title="What runs on NEAR">
            <span className="text-fg">x3-guard</span> stores the policy and rechecks quote terms. It holds no funds. Acceptance is not permission to send from an origin wallet.
          </Card>
          <Card title="What does not run on a block">
            The x3-lang intent VM executes in this workspace only. The README says it is not loaded by a pallet. Do not describe a local simulate as chain execution.
          </Card>
        </CardGrid>
        <p className="mt-8 text-sm text-muted">
          <Tag>Limit</Tag>
          <span className="mt-3 block">
            There is no downloadable GitHub release. Installation is from source. Programming notes live in the repo under docs/x3-lang. Judge steps: <OutLink href={LINKS.hackathonDocs}>docs/hackathon</OutLink>.
          </span>
        </p>
      </Section>
    </SiteShell>
  );
}
