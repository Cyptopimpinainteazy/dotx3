# X3 DEX on dotx3

`/dex` embeds the existing X3DEX terminal; `/dex-terminal/index.html` opens it full screen. The isolated document preserves the DEX styles without changing the dotx3 shell.

The terminal source and upstream commit are recorded in `integrations/x3dex/UPSTREAM.md`. `npm run build` installs and builds that source before the dotx3 build. Generated assets are not committed.

Read-only market endpoints: `/api/x3dex/ohlc` (allowlisted Kraken pairs/intervals) and `/api/x3dex/markets` (existing validated, cached market aggregator). They never produce executable quotes or transaction calldata. Market failures remain visible.

Optional indicative quotes and independent testnet cross-check endpoints return 503 until separately integrated. Testnet Lab still uses explicit wallet confirmations for its existing testnet self-transfer; no transaction was sent during this integration. Mainnet swap execution and Shield authorization remain disabled/unintegrated.

Deployment: merge and deploy using the existing dotx3 hosting pipeline. Verify `/dex`, the embedded static JS/CSS, market endpoints, desktop/mobile rendering, and disabled swap controls on the deployed build before calling it live.
