# Security policy

## Supported scope

This repository publishes the dotx3 website, browser-local policy demonstrations and an embedded read-only DEX interface. Security fixes target the current `main` branch. No numbered support policy or independently audited release is claimed.

The X3Lang compiler, NEAR Guard, vault contracts and their chain evidence are maintained in [X3Lang](https://github.com/Cyptopimpinainteazy/x3lang). Report findings against the repository that contains the affected implementation; include both repositories if the issue crosses the browser port boundary.

## Reporting a vulnerability

Check this repository's [Security tab](https://github.com/Cyptopimpinainteazy/dotx3/security) for private vulnerability reporting. If private reporting is enabled, use it for exploit details. If it is unavailable, open a minimal issue requesting a private maintainer contact without posting credentials, private source, wallet material or an actionable exploit.

Include the affected commit, route or file, reproduction steps, expected and actual behavior, and the impact you observed. Identify whether you tested a browser preview, local Sandbox, public testnet or mainnet. Do not send funds or use third-party targets to demonstrate a website issue. There is no published response-time or bounty commitment in this repository.

## Demonstration boundaries

The playground and Attack Lab execute locally; their state is not chain state and their verdicts do not authorize wallet transfers. Guard quote acceptance and cross-chain settlement establish different facts. Preserve these labels when reporting a mismatch. Refer to the linked source revision and actual transaction receipts for contract claims.
