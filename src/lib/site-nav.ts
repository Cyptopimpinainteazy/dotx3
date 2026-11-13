// Site navigation: one source for the header dropdowns, the mobile menu and the footer
// sitemap. site-nav.test.ts checks every internal path has a route file and every hash
// matches a <Section> title on that page, so a renamed section cannot leave a dead link.
import type { LinkProps } from "@tanstack/react-router";
import { ARCADE_URL, BACKING_LINKS_VISIBLE, LINKS } from "./front-door.ts";

export type NavItem =
  | {
      kind: "route";
      label: string;
      description: string;
      to: NonNullable<LinkProps["to"]>;
      /** Section id on the target page, from slugify(<Section title>). */
      hash?: string;
    }
  | {
      /** A static file served from public/ (not a router route). */
      kind: "file";
      label: string;
      description: string;
      href: `/${string}`;
    }
  | {
      kind: "external";
      label: string;
      description: string;
      href: `https://${string}`;
    };

export interface NavGroup {
  id: string;
  label: string;
  /** One line shown at the top of the open dropdown. */
  summary: string;
  items: NavItem[];
}

/** Section ids. Shared by <Section> and the nav so a hash link and its target agree. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SITE_REPO = "https://github.com/Cyptopimpinainteazy/dotx3";
export const PROGRAMMING_GUIDE =
  "https://github.com/Cyptopimpinainteazy/x3lang/blob/master/docs/x3-lang/PROGRAMMING_GUIDE.md";

/** Every group, including ones hidden for judging. Tests validate all of them. */
export const ALL_NAV: NavGroup[] = [
  {
    id: "hackathon",
    label: "Hackathon",
    summary: "The NEAR competition entry: one policy, three tracks, public proof.",
    items: [
      {
        kind: "route",
        label: "Judge Console",
        description: "Refused, allowed, settled: three cases, all on chain",
        to: "/judge",
      },
      {
        kind: "route",
        label: "Situation Report",
        description: "Finalized on chain or publicly logged",
        to: "/",
        hash: "situation-report",
      },
      {
        kind: "route",
        label: "Competition overview",
        description: "One policy seen from all three tracks",
        to: "/near",
      },
      {
        kind: "route",
        label: "AI Security & Defense",
        description: "Stop an injected agent from paying an attacker",
        to: "/security",
      },
      {
        kind: "route",
        label: "Agent Economy",
        description: "Agent payments inside the owner's budget",
        to: "/agents",
      },
      {
        kind: "route",
        label: "Unstoppable DeFi",
        description: "The cross-chain transfer a judge can verify",
        to: "/defi",
      },
      {
        kind: "route",
        label: "Proof meter",
        description: "Milestones that count only with public proof",
        to: "/",
        hash: "proof-meter",
      },
      {
        kind: "external",
        label: "Official hackathon site",
        description: "nearhackathon.com",
        href: LINKS.hackathon,
      },
    ],
  },
  {
    id: "try",
    label: "Try it",
    summary: "Run a payment, attack a mandate, and watch Guard decide.",
    items: [
      {
        kind: "route",
        label: "Try the Demo",
        description: "Accepted payment, rejected attack",
        to: "/demo",
      },
      {
        kind: "route",
        label: "Playground",
        description: "Break a payment and watch it get refused",
        to: "/playground",
      },
      {
        kind: "route",
        label: "Labs & integrations",
        description: "Write, challenge and inspect .x3",
        to: "/labs",
      },
      {
        kind: "file",
        label: "Attack lab",
        description: "Attack a scoped vault in the browser",
        href: "/labs/attack/attack-lab.html",
      },
      {
        kind: "file",
        label: "Watch an Agent Play",
        description: "MEME COIN BLAST under an .x3 mandate",
        href: ARCADE_URL,
      },
      {
        kind: "route",
        label: "X3 DEX terminal",
        description: "The trading workspace",
        to: "/dex",
      },
      {
        kind: "external",
        label: "Guard browser demo",
        description: "x3-guard.pages.dev",
        href: LINKS.browserDemo,
      },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    summary: "From a first mandate to the compiler and VM.",
    items: [
      {
        kind: "route",
        label: "Interactive tutorial",
        description: "Write money rules an agent can't talk around",
        to: "/learn",
      },
      {
        kind: "route",
        label: "Docs",
        description: "Mandates, intents, check then authorize",
        to: "/docs",
      },
      {
        kind: "route",
        label: "Quickstart",
        description: "Install, hash the program, run the suite",
        to: "/docs",
        hash: "quickstart",
      },
      {
        kind: "route",
        label: "Syntax",
        description: "Owner mandates and payment intents",
        to: "/docs",
        hash: "syntax",
      },
      {
        kind: "route",
        label: "The language",
        description: "Pipelines, compiler refusals, chain engine",
        to: "/language",
      },
      {
        kind: "route",
        label: "Bootcamp",
        description: ".x3 developer academy lessons",
        to: "/bootcamp",
      },
      {
        kind: "external",
        label: "Programming guide",
        description: "The full .x3 guide on GitHub",
        href: PROGRAMMING_GUIDE,
      },
    ],
  },
  {
    id: "proof",
    label: "Proof",
    summary: "Evidence by source and network, with what is not claimed.",
    items: [
      {
        kind: "route",
        label: "Inspect the Proof",
        description: "Evidence by source and network",
        to: "/proof",
      },
      {
        kind: "route",
        label: "Judge Console",
        description: "Three cases with code, checks and verdict",
        to: "/judge",
      },
      {
        kind: "route",
        label: "Settlement",
        description: "Base Sepolia to NEAR testnet delivery",
        to: "/proof",
        hash: "settlement",
      },
      {
        kind: "route",
        label: "Refusal and acceptance",
        description: "Guard refusing the wrong recipient",
        to: "/proof",
        hash: "refusal-and-acceptance",
      },
      {
        kind: "route",
        label: "Quote verification",
        description: "Checking signed 1Click quote terms",
        to: "/proof",
        hash: "quote-verification",
      },
      {
        kind: "route",
        label: "Not claimed",
        description: "The limits, stated plainly",
        to: "/proof",
        hash: "not-claimed",
      },
      {
        kind: "external",
        label: "Base Sepolia transaction",
        description: "Source transfer on basescan",
        href: LINKS.baseTx,
      },
      {
        kind: "external",
        label: "NEAR testnet delivery",
        description: "Payout on nearblocks",
        href: LINKS.nearPayout,
      },
      {
        kind: "external",
        label: "Guard refusal transaction",
        description: "attacker.near refused on testnet",
        href: LINKS.refuseTx,
      },
    ],
  },
  {
    id: "code",
    label: "Code",
    summary: "The language tools, the site source, and how to build on them.",
    items: [
      {
        kind: "route",
        label: "View the Code",
        description: "Repository, tools and integration levels",
        to: "/developers",
      },
      {
        kind: "route",
        label: "Install from source",
        description: "Build the compiler and run the checks",
        to: "/developers",
        hash: "install-from-source",
      },
      {
        kind: "route",
        label: "1Click integration",
        description: "Tokens, dry quotes and status",
        to: "/developers",
        hash: "1click-integration",
      },
      {
        kind: "external",
        label: "x3lang on GitHub",
        description: "Compiler, Guard and evidence",
        href: LINKS.repo,
      },
      {
        kind: "external",
        label: ".x3 examples",
        description: "Mandates, payments and the testnet trade",
        href: LINKS.examples,
      },
      {
        kind: "external",
        label: "CI runs",
        description: "GitHub Actions for x3lang",
        href: LINKS.actions,
      },
      {
        kind: "external",
        label: "Site source",
        description: "This website on GitHub",
        href: SITE_REPO,
      },
      {
        kind: "external",
        label: "Security policy",
        description: "How to report a vulnerability",
        href: LINKS.security,
      },
    ],
  },
  {
    id: "back",
    label: "Back .x3",
    summary: "Provide liquidity, back the team, or build with us.",
    items: [
      {
        kind: "route",
        label: "Overview",
        description: "Liquidity, investing and building",
        to: "/back",
      },
      {
        kind: "route",
        label: "What is live today",
        description: "Status of the token, pool and settlement",
        to: "/back",
        hash: "what-is-live-today",
      },
      {
        kind: "route",
        label: "Liquidity providers",
        description: "Wallet to LP position, step by step",
        to: "/back",
        hash: "liquidity-providers",
      },
      {
        kind: "route",
        label: "Investors",
        description: "Check the work, then start a conversation",
        to: "/back",
        hash: "investors",
      },
      {
        kind: "route",
        label: "Milestones",
        description: "What backers can watch get proven",
        to: "/back",
        hash: "milestones-backers-can-watch",
      },
      {
        kind: "route",
        label: "Builders, grants & partners",
        description: "Ways to build on .x3",
        to: "/back",
        hash: "builders-grants-and-partners",
      },
      {
        kind: "external",
        label: "X",
        description: "@x3starchain",
        href: LINKS.x,
      },
      {
        kind: "external",
        label: "Telegram",
        description: "t.me/x3starchain",
        href: LINKS.telegram,
      },
    ],
  },
];

const isBackingLink = (item: NavItem) => item.kind === "route" && item.to === "/back";

/**
 * What the site renders. While BACKING_LINKS_VISIBLE is false (judging), the Back .x3 group
 * and any /back entry are hidden; /back stays reachable by URL. Flip the flag to restore them.
 */
export const NAV: NavGroup[] = ALL_NAV.filter(
  (group) => BACKING_LINKS_VISIBLE || group.id !== "back",
).map((group) =>
  BACKING_LINKS_VISIBLE ? group : { ...group, items: group.items.filter((i) => !isBackingLink(i)) },
);

/** The header's call to action, outside the dropdowns. */
export const NAV_CTA = { label: "Try the Demo", to: "/demo" } as const;

/** A route item is the current page when the path matches and it is not a section jump. */
export function isCurrentPage(item: NavItem, path: string): boolean {
  return item.kind === "route" && !item.hash && item.to === path;
}

/** A group is highlighted when the current page is one of its route items. */
export function groupContainsPath(group: NavGroup, path: string): boolean {
  return group.items.some((item) => item.kind === "route" && item.to !== "/" && item.to === path);
}
