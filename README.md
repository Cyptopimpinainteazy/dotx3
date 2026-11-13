# dotx3

dotx3 is the public website for X3 Force Field (formerly X3 Shield), powered by the typed .x3 language and compiler: documentation, developer bootcamp, local policy playground, mainnet and testnet execution evidence, and a read-only DEX surface. The website is a React / TanStack Start application. The compiler, Guard contracts and chain evidence live in [X3Lang](https://github.com/Cyptopimpinainteazy/x3lang).

## Start here

- `/labs`: vendored Python compiler API, signed-quote demo, judge policy cases and attack lab.
- `/docs`: what .x3 does, installation and language examples.
- `/bootcamp`: the detailed source-backed developer course.
- `/playground`: edit a policy and inspect local deterministic verdicts.
- `/near`: NEAR competition hub with `/security`, `/agents` and `/defi` track pages.
- `/proof`: the mainnet 1Click evidence archive, historical Guard calls and finalized testnet transfers, labeled by network and scope.
- `/judge`: reproducible testnet cases and the separate mainnet evidence record.
- `/dex`: read-only market interface; market observations do not authorize a trade.

A `.x3` file expresses an owner's spending mandate or a payment intent as reviewable typed source code. Invalid programs fail compilation before policy and quote checks; verified source hashes can be compared to Guard-stored identities. X3BC/X3VM are broader pre-hackathon language infrastructure, not the native on-chain Guard execution path. The NEAR path parses and checks that source, lowers supported payment terms and checks signed quote values through Guard. Guard acceptance authorizes a deposit address, and the historical `invoice_06` agent later recorded a `Settled` outcome. Wallet custody and funded settlement are separate concerns. See [the language guide](docs/X3_GUIDE.md).

## Evidence snapshot: November 12, 2026 (historical site pin; X3Lang source update below)

The earlier site evidence and vendored compiler are reviewed against X3Lang commit [`efb514ffef2cdfdeb8ad8147747887c85356073c`](https://github.com/Cyptopimpinainteazy/x3lang/commit/efb514ffef2cdfdeb8ad8147747887c85356073c).

| Result | Network | Public evidence |
| --- | --- | --- |
| A restricted agent key accepted a signed live 1Click quote after 21 passing Guard checks. A separate wallet deposited 25.000000 USDC on Solana; 24.995200 USDC was delivered to `x3lang.near`. | Solana and NEAR mainnet | [invoice_06 archive](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/evidence/near-guard-mainnet-invoice06-2026-11-12/README.md) |
| Guard refused the wrong recipient and registered the permitted intent. | NEAR testnet | [Guard evidence](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/evidence/near-guard-testnet-live-2026-11-06.md) |
| A committed `.x3` program was hash-bound before 1 test USDC left Base Sepolia; 0.9974 test USDC arrived through the trusted Tidepool relay. | Base Sepolia and NEAR testnet | [Historical transfer evidence](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/docs/hackathon/FIRST_FINALIZED_SWAP_EVIDENCE.md) |

The mainnet observer's [archived output](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/evidence/near-guard-mainnet-invoice06-2026-11-12/public-rpc-observation.json) reports 18 checks passed, zero failed and one fact unreadable on chain. [SHA256SUMS](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/evidence/near-guard-mainnet-invoice06-2026-11-12/SHA256SUMS) binds that archived observation.

The shared proof meter in `src/lib/front-door.ts` counts **3 of the original 8 milestones: 37.5%, displayed as 38%**. A nonempty public evidence list is required. The mainnet record earns the settlement milestone without changing the denominator or completing unrelated gates.

Recovered and independently corroborated in X3Lang after this site's older evidence snapshot: the owner-operated Solflare funding-wallet provenance, the two original `.x3` source files matching Guard-stored SHA-256 hashes, and a finalized restricted-agent `Settled` outcome ([source and outcome evidence](https://github.com/Cyptopimpinainteazy/x3lang/tree/4f60ddb652188784ed44f64d8172cd2cd84da422/evidence/near-guard-mainnet-invoice06-2026-11-12)). Still unproven: Guard-custodied Solana settlement, cryptographic cross-chain atomicity and native X3VM execution in the Guard on-chain path. Remaining meter milestones are a public scoped-vault testnet demonstration, hostile-model mainnet refusal, merged program-hash enforcement with mismatch tests, independent review, and a tagged release with checksum and build provenance. [Program-pin PR #202](https://github.com/Cyptopimpinainteazy/x3lang/pull/202) is open at this snapshot.

Website evidence freshness and compiler freshness are separate. `x3lang-port.json` and its public copy record the actual compiler/lab source revision, file hashes and local transformations. Do not change those provenance records merely because the evidence pages were updated. Mainnet trading controls remain disabled in the embedded DEX until its execution integration is separately verified.

## Run the website

Use Node 24 or the deployment's supported Node version, npm, and Python 3.12 with pip (the production build packages a pinned Python Function). From this repository:

```sh
npm ci
# For the real compiler API, run this in a second terminal:
python3 scripts/dev-compiler.py
# Then start the website:
npm run dev
```

The dev script builds the embedded DEX and serves on port 8080. The public documentation pages require no wallet or API key. Do not enable auth or database credentials merely to view them.

```sh
npm test
python3 -m unittest discover -s tests -v
npm run typecheck
npm run build
# Against a running local preview:
node scripts/near-smoke.mjs http://127.0.0.1:8080
node scripts/bootcamp-smoke.mjs http://127.0.0.1:8080/bootcamp
# Against npm run dev plus scripts/dev-compiler.py:
node scripts/compiler-smoke.mjs http://127.0.0.1:8080
```

`build` installs the DEX's locked dependencies, builds both applications, and invokes the migration helper. See the helper for deployment-specific database behavior. Generated `.vercel/output` is rebuilt and ignored by Git. The build also packages the bounded Python compiler function; its production execution requires separate deployment verification.

## Documentation

- [NEAR Builders MCP connection](docs/NEAR_BUILDERS_MCP.md)
- [NEAR Business treasury integration boundaries](docs/NEAR_BUSINESS.md)

- [Write .x3](docs/X3_GUIDE.md)
- [Branch assessment](docs/BRANCH_ASSESSMENT.md)
- [Deployment and custom domain](docs/DEPLOYMENT.md)
- [Bootcamp maintenance](BOOTCAMP.md)
- [DEX integration](DEX_INTEGRATION.md)

Evidence claims must identify network, source and limitations. Historical pass counts are tied to their recorded commit and are not current test results. Never describe a local preview, a signed quote or an accepted deposit address as finalized settlement.
