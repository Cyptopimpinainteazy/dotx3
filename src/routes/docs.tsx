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
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <a
          href="/bootcamp"
          className="tap inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-primary"
        >
          Enter Bootcamp — the in-depth .x3 developer course →
        </a>
      </div>
      <Section
        title="What is dotx3?"
        intro="dotx3 is the public front door for the language, tools and evidence. A .x3 file is the program you write."
      >
        <CardGrid>
          <Card title="Owner mandate">
            Define the agent, spending asset, allowed recipients, payment and daily caps, approval
            threshold, refund address and expiry.
          </Card>
          <Card title="Payment intent">
            State what the agent wants to pay: source amount, destination asset and recipient,
            minimum output, mandate reference, nonce and deadline.
          </Card>
          <Card title="Check, then authorize">
            The frontend checks source. Guard checks signed quote terms on NEAR. A wallet funds
            separately, and settlement needs its own evidence.
          </Card>
        </CardGrid>
      </Section>
      <Section title="Quickstart">
        <p className="text-muted">
          Run these commands from a checkout of the X3Lang repository, not the dotx3 website. The
          local policy demo needs no wallet or API key and signs nothing. The bootcamp explains the
          language in depth.
        </p>
        <CodeBlock
          title="Install"
          code={`git clone https://github.com/Cyptopimpinainteazy/x3lang.git
cd x3lang
python3 -m venv .venv && . .venv/bin/activate
pip install -r x3-lang/requirements.txt pytest`}
        />
        <CodeBlock
          title="Hash the trade program, then run the suite"
          code={`sha256sum x3-lang/examples/base_sepolia_to_near_testnet_1usdc.x3
python3 x3-lang/cli.py x3-lang/examples/arb_solana_eth.x3
PYTHONPATH=x3-lang python3 -m pytest x3-lang/tests -q`}
        />
        <p className="mt-4 text-sm text-muted">
          Run the current tests and retain the commit hash with the result. Contract checks are
          separate: cd x3-lang/near/x3-guard &amp;&amp; cargo test --locked. Historical test counts
          are not proof for your checkout.
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

      <Section title="Read the amounts and limits">
        <CardGrid>
          <Card title="Integer token units">
            For six-decimal USDC, 25000000 means 25 USDC. Confirm the token registry and decimals
            before adapting examples. 100 bps means 1%.
          </Card>
          <Card title="Explicit permission">
            The example caps each payment at 50 USDC and a rolling day at 200 USDC. Above 30 USDC,
            an owner approval is required. Approval does not waive a cap.
          </Card>
          <Card title="A bounded request">
            Use a fresh nonce for each payment. Keep the origin refund address, minimum receipt and
            timeout explicit. Unsupported NEAR route shapes fail compilation.
          </Card>
        </CardGrid>
      </Section>
      <Section title="Compiler and execution">
        <CardGrid>
          <Card title="What compiles today">
            The Python frontend parses, type-checks, and checks mandates. Unsafe edits fail before a
            quote. Nine checked-in edits are refused at compile time, including a dropped nonce and
            a look-alike recipient.
          </Card>
          <Card title="What runs on NEAR">
            <span className="text-fg">x3-guard</span> stores the policy and rechecks quote terms. It
            holds no funds. Acceptance is not permission to send from an origin wallet.
          </Card>
          <Card title="What does not run on a block">
            The x3-lang intent VM executes in this workspace only. The README says it is not loaded
            by a pallet. Do not describe a local simulate as chain execution.
          </Card>
        </CardGrid>
        <p className="mt-8 text-sm text-muted">
          <Tag>Limit</Tag>
          <span className="mt-3 block">
            There is no downloadable GitHub release. Installation is from source. Programming notes
            live in the repo under docs/x3-lang. Judge steps:{" "}
            <OutLink href={LINKS.hackathonDocs}>docs/hackathon</OutLink>.
          </span>
        </p>
      </Section>
    </SiteShell>
  );
}
