import { Link, createFileRoute } from "@tanstack/react-router";
import { OutLink, Tag } from "@/components/code-block";
import { ProofFlow } from "@/components/circuit";
import { Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { BACKING_LINKS_VISIBLE, EVIDENCE_SNAPSHOT, LINKS } from "@/lib/front-door";

export const Route = createFileRoute("/language")({ component: LanguagePage });

const REFUSALS: { code: string; what: string }[] = [
  {
    code: "X3_NEAR_ROUTE_SHAPE",
    what: "More than one leg, or a fallback. 1Click settles one swap, and a second leg could half-execute with no rollback.",
  },
  {
    code: "X3_NEAR_SLIPPAGE_REQUIRED",
    what: "No slippage bound. The compiler will not choose a tolerance on the agent's behalf.",
  },
  {
    code: "X3_NEAR_TIMEOUT_REQUIRED",
    what: "No timeout. The deadline is when 1Click starts refunding, so it has to be stated.",
  },
  {
    code: "X3_NEAR_NONCE",
    what: "A payment under a mandate with no one-use nonce, or with two. Guard records each payment under its nonce.",
  },
  {
    code: "X3_NEAR_REFUND_ASSET",
    what: "A refund in a different asset or on a different chain than the deposit. 1Click refunds the deposited asset only.",
  },
  {
    code: "X3_NEAR_REFUND_TO",
    what: "Timeout and on_fail refund to different addresses, or to an address that is not on the origin chain.",
  },
  {
    code: "X3_NEAR_GUARD_UNENFORCEABLE",
    what: "A require clause the NEAR path has no way to enforce. It is refused, never silently dropped.",
  },
  {
    code: "X3_NEAR_ON_FAIL_UNSUPPORTED",
    what: "on_fail halt or quarantine. 1Click can only refund, so the program would promise something that cannot happen.",
  },
  {
    code: "X3_NEAR_ROUTE_ENDPOINTS",
    what: "The leg's assets don't match the intent's from and to.",
  },
  {
    code: "X3_MANDATE_APPROVAL",
    what: "An agent listed as its own approver, an approval threshold above the cap, or an impossible threshold.",
  },
  { code: "X3_MANDATE_BOUND", what: "A mandate that leaves slippage or fees unbounded." },
  {
    code: "X3_MANDATE_LIMIT",
    what: "A per-payment cap above the daily cap, or a cap that does not fit the contract's u128.",
  },
];

const SOURCE_ROOT = `${LINKS.repo}/blob/${EVIDENCE_SNAPSHOT.commit}`;

const ENGINE: { title: string; body: string; href: string }[] = [
  {
    title: "Python intent frontend",
    body: "The public NEAR path parses and checks .x3 mandates and payment intents, lowers supported terms and evaluates the owner policy. Unsafe source edits are rejected before quote submission.",
    href: `${SOURCE_ROOT}/docs/hackathon/X3_LANGUAGE.md`,
  },
  {
    title: "Guard on NEAR",
    body: "The deployed contract reads authenticated 1Click quote terms and checks the stored mandate. Mainnet invoice_06 passed 21 checks through a restricted agent key before a separately funded deposit.",
    href: LINKS.mainnetEvidence,
  },
  {
    title: "Rust intent compiler and VM",
    body: "The public x3-lang workspace compiles, verifies and runs trading programs locally. Its intent bytecode and the chain's X3BC format are distinct; no pallet loads the intent bytecode described in this workspace.",
    href: `${SOURCE_ROOT}/x3-lang/README.md`,
  },
  {
    title: "A source trail you can check",
    body: "The historical Tidepool testnet transfer has a committed .x3 program whose hash was bound before funding. The mainnet swap has finalized receipts, but its two stored source hashes still need matching committed .x3 files.",
    href: LINKS.mainnetObservation,
  },
];

const IDEAS: { title: string; body: string; status: string; href?: string }[] = [
  {
    title: "Guard enforces the program hash",
    status: "Open PR #202",
    body: "Program-pin enforcement is proposed in PR #202 and is not merged at this evidence snapshot. Storing a source hash does not prove the deployed Guard rejects a different program. The meter waits for the implementation and mismatch tests to land.",
    href: LINKS.programBindingPr,
  },
  {
    title: "Scoped agent vault",
    status: "Local prototypes",
    body: "NEAR FunctionCall-only and Base EIP-712 vault prototypes have local test coverage. The public testnet runbook still needs an allowed payment and the documented refusal cases. Neither the Tidepool transfer nor invoice_06 proves a scoped vault held the funds.",
    href: LINKS.vaultRunbook,
  },
  {
    title: "Mandate diff before you sign",
    status: "Idea",
    body: "Compile the current and proposed mandate, then show the owner every term that changed (cap, recipients, refund address, expiry) before the create_mandate call goes out. The playground's checker can already produce both term sets.",
  },
  {
    title: "One checker, three runtimes",
    status: "Idea",
    body: "Lower check_mandate to X3BC so the same bytecode runs in the browser, on the X3 chain and in the Guard. That removes the hand-kept ports and gives one parity test where there are three today.",
  },
  {
    title: "Public refusal feed",
    status: "Idea",
    body: "An append-only feed of every agent proposal, with its .x3 hash, the verdict, the rule that decided it, and the transaction when there is one. Hostile-model runs would be labeled as attacks.",
  },
  {
    title: "LP mandates",
    status: "Idea",
    body: "The same mandate shape, applied to liquidity: which pools an LP agent may enter, how much, the maximum price impact, and a fixed withdrawal address. Liquidity managed by an agent, bounded by the owner.",
  },
];

function LanguagePage() {
  return (
    <SiteShell
      eyebrow="The language"
      title="X3 is more than one payment."
      lede="X3 Shield uses typed owner mandates, deterministic checks and Guard authorization on NEAR. Follow the public language tools, the recorded mainnet swap and the remaining work that connects source to execution."
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
        title="Two pipelines, one language"
        intro="The NEAR integration and the Rust intent toolchain establish different facts. The mainnet payment used Guard and 1Click; it is not evidence of native X3VM execution."
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <div className="mb-3">
              <Tag>NEAR Intents path · runs in the judge steps</Tag>
            </div>
            <ProofFlow
              steps={[
                { label: ".x3 source", detail: "Mandate and payment" },
                { label: "Compile", detail: "Parse, type-check, lower" },
                { label: "Guard terms", detail: "Stored policy on NEAR" },
                { label: "1Click quote", detail: "Signature, then terms" },
              ]}
            />
          </div>
          <div>
            <div className="mb-3">
              <Tag>Rust intent toolchain · local workspace</Tag>
            </div>
            <ProofFlow
              steps={[
                { label: ".x3 source", detail: "Strategies and programs" },
                { label: "Rust compiler", detail: "HIR, MIR, backend" },
                { label: "Intent bytecode", detail: "Separate from chain X3BC" },
                { label: "Intent VM", detail: "Local execution and tests" },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section
        title="What the compiler refuses"
        intro="These programs never reach a quote. Each code is a real refusal in the checker that the playground runs."
        alt
      >
        <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2">
          {REFUSALS.map((r) => (
            <article key={r.code} className="rounded-xl border border-border bg-bg p-4">
              <p className="font-mono text-xs break-all text-accent">{r.code}</p>
              <p className="mt-2 text-sm text-muted">{r.what}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/playground"
            className="tap inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-bg"
          >
            Trigger them in the playground
          </Link>
        </div>
      </Section>

      <Section
        title="What the public source establishes"
        intro={`Reviewed ${EVIDENCE_SNAPSHOT.dateLabel}. Each component links to the source or execution record behind its claim.`}
      >
        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap justify-center gap-2">
          <Tag>Public X3Lang source</Tag>
          <Tag>NEAR + Solana mainnet evidence</Tag>
          <Tag>Rust intent VM: local</Tag>
        </div>
        <CardGrid>
          {ENGINE.map((e) => (
            <Card key={e.title} title={e.title}>
              {e.body}
              <p className="mt-4"><OutLink href={e.href}>Inspect source and limits</OutLink></p>
            </Card>
          ))}
        </CardGrid>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
          The broader X3 chain has its own release and deployment requirements. Claims here use
          the public X3Lang revision and the network named in each evidence record. See{" "}
          <Link to="/proof" className="text-primary underline underline-offset-4">
            Inspect the Proof
          </Link>
          .
        </p>
      </Section>

      <Section title="What we're building next" alt>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {IDEAS.map((idea) => (
            <article key={idea.title} className="rounded-xl border border-border bg-bg p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg text-fg">{idea.title}</h3>
                <Tag>{idea.status}</Tag>
              </div>
              <p className="mt-3 text-sm text-muted">{idea.body}</p>
              {idea.href ? <p className="mt-4 text-sm"><OutLink href={idea.href}>Review current work</OutLink></p> : null}
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
          Want one of these sooner, or have a better one?{" "}
          <OutLink href={LINKS.issues}>Open an issue</OutLink>
          {BACKING_LINKS_VISIBLE ? (
            <>
              {" "}
              or{" "}
              <Link to="/back" className="text-primary underline underline-offset-4">
                back the work
              </Link>
            </>
          ) : null}
          .
        </p>
      </Section>
    </SiteShell>
  );
}
