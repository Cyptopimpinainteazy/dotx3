# dotx3

dotx3 is the public website for the .x3 language and X3 Shield: documentation, developer bootcamp, local policy playground, historical execution evidence and a read-only DEX surface. The website is a React / TanStack Start application. The compiler, Guard contracts and chain evidence live in [X3Lang](https://github.com/Cyptopimpinainteazy/x3lang).

## Start here

- `/labs`: vendored Python compiler API, signed-quote demo, judge policy cases and attack lab.
- `/docs`: what .x3 does, installation and language examples.
- `/bootcamp`: the detailed source-backed developer course.
- `/playground`: edit a policy and inspect local deterministic verdicts.
- `/near`: NEAR competition hub with `/security`, `/agents` and `/defi` track pages.
- `/proof`: historical Guard and finalized testnet transfer records.
- `/dex`: read-only market interface; market observations do not authorize a trade.

A `.x3` file expresses an owner's spending mandate or a payment intent. The NEAR path parses and checks that source, lowers supported payment terms and checks signed quote values through Guard. Guard acceptance authorizes a deposit address. Wallet custody and funded settlement are separate concerns. See [the language guide](docs/X3_GUIDE.md).

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

- [Write .x3](docs/X3_GUIDE.md)
- [Branch assessment](docs/BRANCH_ASSESSMENT.md)
- [Deployment and custom domain](docs/DEPLOYMENT.md)
- [Bootcamp maintenance](BOOTCAMP.md)
- [DEX integration](DEX_INTEGRATION.md)

Evidence claims must identify network, source and limitations. Historical pass counts are tied to their recorded commit and are not current test results. Never describe a local preview, a signed quote or an accepted deposit address as finalized settlement.
