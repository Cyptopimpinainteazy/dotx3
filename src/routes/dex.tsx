import { ProviderIncidents } from '@/components/provider-incidents';
import { IntentsPlanner } from '@/components/intents-planner';
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
export const Route = createFileRoute("/dex")({ component: DexPage });
function DexPage() { return <SiteShell eyebrow="X3 DEX" title="Your trading workspace" lede="Market charts, Arbitrage Radar, and the testnet transaction lab. Swap execution remains disabled until the route, policy, and settlement integrations are verified."><div className="mx-auto max-w-screen-2xl p-3"><ProviderIncidents /><IntentsPlanner /><p className="mb-5 text-muted">Explorer reports are not settlement proof. Official SHIELD incidents are separate from X3 owner-policy checks. <a className="text-primary" href="/bootcamp#intents-shield">Read integration requirements</a>.</p><a href="/dex-terminal/index.html" className="tap text-primary">Open full-screen terminal ↗</a><iframe title="X3 DEX trading terminal" src="/dex-terminal/index.html" className="mt-3 w-full rounded-xl border border-border" style={{height:"85vh",minHeight:640}} /></div></SiteShell>; }
