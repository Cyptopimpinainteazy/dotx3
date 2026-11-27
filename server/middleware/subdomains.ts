import { defineEventHandler, sendRedirect, getRequestHost, getRequestURL } from 'h3'

// Routes each x3star.net subdomain to its static HTML page in public/
const SUBDOMAIN_ROUTES: Record<string, string> = {
  www: '/index.html',
  swap: '/x3-swap.html',
  explorer: '/x3-explorer.html',
  nft: '/x3-nft.html',
  staking: '/x3-staking.html',
  bridge: '/x3-bridge.html',
  flash: '/x3-flashloans.html',
  analytics: '/x3-analytics.html',
  portfolio: '/x3-portfolio.html',
  nodes: '/x3-nodes.html',
  status: '/x3-status.html',
  tokenomics: '/x3-tokenomics.html',
  whitepaper: '/x3-whitepaper.html',
  roadmap: '/x3-roadmap.html',
  community: '/x3-community.html',
  academy: '/x3-academy.html',
  games: '/x3-games.html',
  agents: '/x3-agents.html',
  governance: '/x3-governance.html',
  launch: '/x3-launchpad.html',
  grants: '/x3-grants.html',
  treasury: '/x3-treasury.html',
  validators: '/x3-validators.html',
  security: '/x3-security.html',
  marketplace: '/x3-marketplace.html',
  dev: '/x3-developers.html',
  press: '/x3-press.html',
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  // Only intercept root requests
  if (url.pathname !== '/') return

  const host = getRequestHost(event) ?? ''
  // Extract subdomain: "swap.x3star.net" → "swap"
  const match = host.match(/^([^.]+)\.x3star\.net(?::\d+)?$/)
  if (!match) return

  const subdomain = match[1]
  const target = SUBDOMAIN_ROUTES[subdomain]
  if (!target) return

  return sendRedirect(event, target, 302)
})
