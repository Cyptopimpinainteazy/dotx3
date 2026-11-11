# Vercel deployment

The connected Vercel account contains project `dotx3` (`prj_BuBMskAOrw7LlH329aoViQOTRQJm`) under team `team_SJzr7Dz3dCQKzLT9JJ1uIYDw`. Project inspection on 2026-11-11 reports TanStack Start and Node 26.x. Inspect the latest deployment and Git connection before promoting a new build.

## CLI setup

```sh
npm i -g vercel
vercel login
vercel project ls
```

Login is interactive; complete the browser authorization with your own Vercel account. An authenticated connector can inspect and assign domains without sharing a CLI token.

## Requested domain

The concrete project name replaces YOUR_PROJECT:

```sh
vercel domains add command.dotx3.net dotx3
```

Vercel CLI 65.14.0 supports the requested project-specific verification command:

```sh
vercel domains verify command.dotx3.net --project dotx3
```

Inspect the returned DNS requirements and configure the exact records at the authoritative DNS provider. Domain assignment, ownership verification, DNS resolution, TLS issuance and serving the intended deployment are separate checks.

## Verify the release

Run `npm test`, `npm run typecheck` and `npm run build`; inspect `/docs`, `/near`, `/security`, `/agents`, `/defi` on desktop and mobile. Check that the project serves the intended commit and domain over HTTPS. Record a preview deployment as preview, not production. SSO protection may apply to Vercel preview URLs even when a custom domain is public.

## Live domain inspection — 2026-11-11

`command.dotx3.net` was added to project `dotx3`. Vercel verification returned `missing_txt_record`. Authoritative nameservers are Cloudflare (`elmo.ns.cloudflare.com`, `tegan.ns.cloudflare.com`). Add these records in that zone:

| Type  | Name      | Value                                                     |
| ----- | --------- | --------------------------------------------------------- |
| TXT   | `_vercel` | `vc-domain-verify=command.dotx3.net,448ccba8c82b2358029f` |
| CNAME | `command` | `c310b026bae3c263.vercel-dns-017.com`                     |

Use DNS-only while verifying. Preserve other TXT verification values. Re-run project-domain verification after propagation, then check HTTPS and the served commit. The assignment exists; verification and routing were pending at inspection.

## Agent setup verified

Vercel CLI 65.14.0 is installed and authenticated as `cyptopimpinainteazy`. This checkout is linked to the existing `dotx3` project. The official shared `https://mcp.vercel.com` endpoint was added to user-wide Codex configuration and OAuth completed. The existing Vercel plugin guidance remains installed. Documentation search and authenticated team listing succeeded through the connected Vercel app. Setup followed [Vercel's onboarding guide](https://vercel.com/get-started.md).

Vercel also returned a Cloudflare Domain Connect flow for this project domain. Use the project dashboard's Domains page to apply that flow; the required DNS records above remain the manual alternative.
