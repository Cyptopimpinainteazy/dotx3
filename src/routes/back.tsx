import { Link, createFileRoute } from "@tanstack/react-router";
import { OutLink, Tag } from "@/components/code-block";
import { Section, SiteShell } from "@/components/site-shell";
import { LINKS, NEAR_WALLETS, RHEA_APP, TOKEN } from "@/lib/front-door";

export const Route = createFileRoute("/back")({ component: BackPage });

type Status = "live" | "pending";

function StatusRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: Status;
  detail: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="font-semibold text-fg">{label}</span>
      <span className="text-sm text-muted sm:text-right">
        <span className={status === "live" ? "text-primary" : "text-accent"}>
          {status === "live" ? "Live" : "Not live"}
        </span>{" "}
        · {detail}
      </span>
    </li>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 rounded-xl border border-border bg-bg p-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary font-display text-primary">
        {n}
      </span>
      <div>
        <h3 className="font-display text-lg text-fg">{title}</h3>
        <div className="mt-2 text-sm text-muted">{children}</div>
      </div>
    </li>
  );
}

const MILESTONES: { title: string; proof: string }[] = [
  {
    title: "Scoped agent vault on testnet",
    proof:
      "One allowed payment, plus recorded refusals for over-cap, wrong recipient, 24-hour window and redirected refund.",
  },
  {
    title: "One mainnet 1Click swap through Guard",
    proof:
      "The signed quote, the Guard authorization, the deposit, and the delivery, each with a finalized transaction hash.",
  },
  {
    title: "Hostile model refused on mainnet",
    proof:
      "A red-team model's payments go through the same restricted key, and each refusal is on chain with an attack label.",
  },
  {
    title: "Guard checks the program hash",
    proof:
      "An approved mandate carries only the exact .x3 program the owner saw. Contract tests cover a mismatched hash.",
  },
  {
    title: "Independent security review",
    proof: "A published report on Guard and the vault, with every finding and its fix.",
  },
  {
    title: "Tagged release",
    proof:
      "A GitHub release with a checksum and build provenance, so nobody has to trust a branch tip.",
  },
];

function BackPage() {
  const tokenLive = TOKEN.contract !== null;
  const poolLive = tokenLive && TOKEN.rheaPoolId !== null;

  return (
    <SiteShell
      eyebrow="Back .x3"
      title="Provide liquidity, invest, or build with us."
      lede="Three ways in. This page doesn't take money, connect a wallet or show a raise total. It says what is live, what isn't yet, and where your next step is."
    >
      <Section title="What is live today">
        <ul className="mx-auto grid max-w-3xl gap-3">
          <StatusRow
            label="Guard contract, NEAR testnet"
            status="live"
            detail={
              <Link to="/proof" className="text-primary underline underline-offset-4">
                refusal and acceptance on chain
              </Link>
            }
          />
          <StatusRow
            label="Two-chain testnet trade"
            status="live"
            detail="1 test USDC, Base Sepolia to NEAR testnet"
          />
          <StatusRow
            label="Browser checker"
            status="live"
            detail={
              <Link to="/playground" className="text-primary underline underline-offset-4">
                try the attacks
              </Link>
            }
          />
          <StatusRow
            label={`${TOKEN.symbol} token (${TOKEN.standard})`}
            status={tokenLive ? "live" : "pending"}
            detail={
              tokenLive ? (
                <span className="font-mono break-all">{TOKEN.contract}</span>
              ) : (
                "no contract deployed"
              )
            }
          />
          <StatusRow
            label={`${TOKEN.symbol} / wNEAR pool on Rhea`}
            status={poolLive ? "live" : "pending"}
            detail={poolLive ? `pool #${TOKEN.rheaPoolId}` : "no pool created"}
          />
          <StatusRow label="Funded mainnet settlement" status="pending" detail="none published" />
        </ul>
      </Section>

      <Section
        title="Liquidity providers"
        intro={
          poolLive
            ? "The pool is live. Five steps from no wallet to an LP position."
            : "There's no pool yet. These are the steps for when there is, so you can get set up now. Steps 4 and 5 open once the token and pool are deployed."
        }
        alt
      >
        <ol className="mx-auto grid max-w-3xl gap-3">
          <Step n={1} title="Get a NEAR wallet">
            Pick one from NEAR&apos;s wallet directory:{" "}
            <OutLink href={NEAR_WALLETS}>wallet.near.org</OutLink>. If you&apos;ll hold a large
            balance, use one that can sign with a hardware wallet. Write down the recovery phrase
            offline.
          </Step>
          <Step n={2} title="Fund it with NEAR">
            You need NEAR for gas and for your side of the pool. A few tenths of a NEAR covers
            registration and storage deposits.
          </Step>
          <Step n={3} title="Wrap NEAR into wNEAR">
            Native NEAR isn&apos;t a token contract, so pools pair against wNEAR, its NEP-141 form.
            Wrap what you plan to deposit and keep some plain NEAR for gas.
          </Step>
          <Step n={4} title={`Find the ${TOKEN.symbol} pool on Rhea`}>
            {poolLive ? (
              <>
                Open <OutLink href={RHEA_APP}>app.rhea.finance</OutLink> and go to pool{" "}
                <span className="font-mono text-fg">#{TOKEN.rheaPoolId}</span>. Check that the token
                contract is <span className="font-mono break-all text-fg">{TOKEN.contract}</span>.
                Look-alike tokens with the same symbol exist on every chain.
              </>
            ) : (
              <>
                <Tag>Not live</Tag> The pool ID and token contract will be posted here and on{" "}
                <OutLink href={LINKS.x}>@x3starchain</OutLink> at the same moment. Don&apos;t use a
                pool ID or contract you got from anywhere else.
              </>
            )}
          </Step>
          <Step n={5} title="Add liquidity, small first">
            Deposit both sides at the pool&apos;s current ratio. Start with an amount you&apos;re
            fine losing, and withdraw once to confirm you can.
          </Step>
        </ol>
        <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-accent bg-bg p-5 text-sm text-muted">
          <p className="font-semibold text-fg">Risks, in plain words</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Impermanent loss: if the price moves, you can end up with less value than if you had
              just held both tokens.
            </li>
            <li>A new, thin pool can move a lot on small trades, in both directions.</li>
            <li>
              Smart-contract risk in the DEX and in the token contract. Neither has been reviewed by
              us.
            </li>
            <li>
              Nobody here promises fees, rewards or returns. Nothing on this site is investment
              advice.
            </li>
          </ul>
        </div>
      </Section>

      <Section
        title="Investors"
        intro="No raise is open on this site, and it never takes funds. If you'd back the team, start a conversation and check the work first."
      >
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-display text-xl text-accent">Check before you call</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link to="/proof" className="text-primary underline underline-offset-4">
                  Proof
                </Link>
                : every testnet claim with its transaction.
              </li>
              <li>
                <OutLink href={LINKS.repo}>Source</OutLink> and{" "}
                <OutLink href={LINKS.actions}>CI runs</OutLink>, public, MIT licensed.
              </li>
              <li>
                <Link to="/language" className="text-primary underline underline-offset-4">
                  Language
                </Link>
                : what X3 covers beyond the hackathon, and what&apos;s next.
              </li>
              <li>
                <Link to="/playground" className="text-primary underline underline-offset-4">
                  Playground
                </Link>
                : try to break a mandate yourself.
              </li>
            </ul>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-display text-xl text-accent">Start the conversation</h3>
            <p className="mt-3 text-sm text-muted">
              Message <OutLink href={LINKS.x}>@x3starchain on X</OutLink> or{" "}
              <OutLink href={LINKS.telegram}>t.me/x3starchain</OutLink>. Say who you are and what
              you&apos;d want to see. Real terms come only from a direct conversation, never from a
              link someone sends you.
            </p>
            <p className="mt-3 text-xs text-muted">
              Nothing here is an offer to sell securities or tokens. Anyone asking you to send funds
              to an address &quot;for the .x3 raise&quot; is not us.
            </p>
          </article>
        </div>
      </Section>

      <Section
        title="Milestones backers can watch"
        intro="Each one counts only when its proof is posted. Until then it's pending, and this list says so."
        alt
      >
        <ol className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
          {MILESTONES.map((m, i) => (
            <li key={m.title} className="rounded-xl border border-border bg-bg p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg text-fg">
                  {i + 1}. {m.title}
                </h3>
                <Tag>Pending</Tag>
              </div>
              <p className="mt-2 text-sm text-muted">{m.proof}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Builders, grants and partners">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-display text-lg text-accent">Contribute</h3>
            <p className="mt-2 text-sm text-muted">
              Read <OutLink href={LINKS.contributing}>CONTRIBUTING</OutLink>, then pick an{" "}
              <OutLink href={LINKS.issues}>issue</OutLink>. Report vulnerabilities privately through{" "}
              <OutLink href={LINKS.security}>SECURITY.md</OutLink>.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-display text-lg text-accent">Integrate</h3>
            <p className="mt-2 text-sm text-muted">
              Building an agent, a wallet or a payments app? A mandate puts your user&apos;s limits
              in a program that compiles, and Guard enforces them on NEAR. Talk to us on{" "}
              <OutLink href={LINKS.telegram}>Telegram</OutLink>.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-display text-lg text-accent">Fund the public good</h3>
            <p className="mt-2 text-sm text-muted">
              The checker and the language are open source. Grant programs and ecosystem funds can
              reach us the same way, and every milestone above has a proof you can check.
            </p>
          </article>
        </div>
      </Section>
    </SiteShell>
  );
}
