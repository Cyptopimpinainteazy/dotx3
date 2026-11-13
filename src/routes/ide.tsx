import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { IdeDemo } from "@/components/ide-demo";
import { Section, SiteShell } from "@/components/site-shell";

const IDE_REMOTE_URL = "https://ide.dotx3.net";

export const Route = createFileRoute("/ide")({
  head: () => ({
    meta: [
      { title: "Super IDE — write .x3, ship to NEAR · dotx3.net" },
      {
        name: "description",
        content:
          "The X3 Super IDE: an .x3 editor with the real compiler, a terminal, git, scanners and a local NEAR devnet with accounts, deploys, calls and an explorer. Try a read-only slice in your browser.",
      },
    ],
  }),
  component: IdePage,
});

const SHOTS = [
  { src: "/media/ide/home.webp", title: "Home", text: "Node state, accounts, recent transactions, toolchains and a checklist that ticks itself off from real chain history." },
  { src: "/media/ide/editor.webp", title: "Editor", text: "Monaco with the .x3 grammar. Check runs the x3-lang pipeline; problems land in the editor and the Problems panel." },
  { src: "/media/ide/contract.webp", title: "Contract", text: "View calls for free, change calls as signed transactions, with gas, logs and decoded NEP-297 events." },
  { src: "/media/ide/explorer.webp", title: "Explorer", text: "Blocks, block detail and transactions on whichever NEAR network the IDE is pointed at." },
  { src: "/media/ide/accounts.webp", title: "Accounts", text: "Keystore accounts with live balances: create sub-accounts, import keys (checked on chain), send NEAR." },
  { src: "/media/ide/txbuilder.webp", title: "Tx builder", text: "Batch actions into one transaction and preview its Borsh bytes and hash before signing." },
];

const FEATURES: { title: string; items: string[] }[] = [
  {
    title: "Code",
    items: [
      "Monaco editor with .x3 highlighting, snippets and Ctrl+P to any file, block, tx or account",
      "Check through the x3-lang intent pipeline, x3c (check, simulate, estimate) and solc",
      "Real terminal, git (diff, stage, commit), search, templates",
      "Fake-code and secret scanners with masked matches",
    ],
  },
  {
    title: "NEAR",
    items: [
      "One-click local devnet (near-sandbox) with a funded genesis account",
      "Accounts, deploys with init calls, view and change calls, events",
      "Transaction builder with a Borsh preview; encoding matches near-api-js byte for byte",
      "Explorer, account inspector (keys, storage, code) and a JSON-RPC console",
    ],
  },
  {
    title: "Safety",
    items: [
      "Runs on your machine and binds to localhost only, with Host and Origin checks",
      "A per-start session token on every call; keys stored 0600, never sent to the browser",
      "Remote use goes through Cloudflare Access, and the IDE verifies the Access token itself",
      "Missing tools and offline nodes are reported as such, never faked",
    ],
  },
];

const RUN_LOCAL = `cd xxxstar/apps/super-ide
npm install
python3 -m venv .venv && . .venv/bin/activate
npm run backend:install
npm run build
npm run backend          # prints http://127.0.0.1:8765/?token=…`;

function IdePage() {
  const [shot, setShot] = useState(0);
  const s = SHOTS[shot];
  return (
    <SiteShell
      eyebrow="Field Kit · Super IDE"
      title="Write .x3, ship to NEAR."
      lede="The X3 Super IDE puts the .x3 compiler, a terminal, git and a local NEAR devnet in one window on your own machine. Below is a read-only slice you can use right now: the real compiler on the left, live NEAR testnet on the right."
      actions={
        <>
          <a href="#try-it-in-your-browser" className="tap inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-bg hover:brightness-110">Try it in your browser</a>
          <a href="#run-the-full-ide" className="tap inline-flex min-h-11 items-center justify-center rounded-full border border-primary px-6 text-sm font-semibold text-primary hover:bg-primary/10">Run the full IDE</a>
        </>
      }
    >
      <Section title="Try it in your browser" intro="Check the agent payment against its owner's mandate with the real x3lang compiler, then swap the recipient and watch the mandate refuse it. Explorer and Inspector read live NEAR testnet. Nothing here signs or sends anything.">
        <IdeDemo />
      </Section>

      <Section alt title="Inside the full IDE" intro="Screenshots from the IDE's own end-to-end browser test. The chain data comes from its signature-checking test node.">
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <figure className="min-w-0 overflow-hidden rounded-2xl border border-border bg-bg">
            <img src={s.src} alt={`Super IDE ${s.title} panel`} width={1600} height={978} className="block h-auto w-full" loading="lazy" />
            <figcaption className="border-t border-border px-4 py-3 text-sm text-muted"><span className="font-semibold text-fg">{s.title}.</span> {s.text}</figcaption>
          </figure>
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Screenshots">
            {SHOTS.map((x, i) => (
              <button key={x.src} role="tab" aria-selected={i === shot} onClick={() => setShot(i)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left text-sm transition ${i === shot ? "border-primary bg-primary/10 text-fg" : "border-border text-muted hover:border-primary/50 hover:text-fg"}`}>
                <span className="font-display">{x.title}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="What it does">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-display text-xl text-accent">{f.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {f.items.map((i) => <li key={i} className="flex gap-2"><span className="text-primary">▸</span><span>{i}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section alt title="Run the full IDE" intro="The full IDE can run a shell and sign transactions, so it never runs as a public page. Use it on your own machine, or from anywhere through the owner-only sign-in.">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-border bg-bg p-6">
            <h3 className="font-display text-xl text-fg">On your machine</h3>
            <p className="mt-2 text-sm text-muted">For X3 contributors with the monorepo. Open the URL the backend prints, then Network → Start localnet.</p>
            <div className="mt-4"><CodeBlock title="Terminal" code={RUN_LOCAL} /></div>
          </div>
          <div className="flex min-w-0 flex-col rounded-2xl border border-border bg-bg p-6">
            <h3 className="font-display text-xl text-fg">ide.dotx3.net</h3>
            <p className="mt-2 text-sm text-muted">
              The same IDE, running on the X3 server and published through a Cloudflare Tunnel. Cloudflare Access asks you to sign in first, and only approved emails get through. The IDE then checks the Access token itself on every request.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li><span className="text-primary">▸</span> Owner and invited builders only</li>
              <li><span className="text-primary">▸</span> Terminal is off for remote sessions unless the owner turns it on</li>
            </ul>
            <a href={IDE_REMOTE_URL} className="tap mt-auto inline-flex min-h-11 w-fit items-center justify-center self-start rounded-full border border-primary px-6 pt-0 text-sm font-semibold text-primary hover:bg-primary/10" style={{ marginTop: "1.5rem" }}>
              Owner sign-in →
            </a>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
