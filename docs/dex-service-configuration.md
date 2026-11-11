# DEX service configuration

The dotx3 route now calls the existing X3DEX adapters for `GET /api/x3dex/indicative` and `GET /api/x3dex/crosscheck`.

Server-only credentials still required:
- `NEAR_INTENTS_EXPLORER_JWT`: Explorer key from https://partners.near-intents.org/api-keys. Cache and owner scope already exist; do not substitute another key type.
- `NEAR_INTENTS_SHIELD_JWT`: SHIELD key from the same partner dashboard. This is the official provider incident feed, separate from X3 Guard policy authorization.
- `ZERO_EX_API_KEY`: 0x Swap API key. Indicative USDC/WETH prices only; no calldata, allowance, or executable swap quote.

Testnet RPC pairs:
- Base Sepolia: `X3_BASE_SEPOLIA_RPC_A` and `X3_BASE_SEPOLIA_RPC_B`.
- Ethereum Sepolia: `X3_SEPOLIA_RPC_A` and `X3_SEPOLIA_RPC_B`.

Each pair must have two distinct HTTPS provider hosts on the expected chain. No client-supplied endpoint is accepted. Public Base endpoints returned HTTP 403 from the integration host during verification, so they were not enabled. No testnet transfer was sent.

Cross-check requires a zero-value, empty-data, 21000-gas self-transfer. It corroborates inclusion using two RPC observations; it never claims independent finality or authorizes execution. Unsupported mainnet chain IDs are rejected.

Missing credentials and providers remain explicit unavailable responses. Provider keys should be added through the Vercel environment-secret interface, followed by redeployment and live checks. Do not paste them in issues, chat, browser variables, or source control. Before exposing a funded quote provider, enforce the provider request budget and any required access controls.

Mainnet swaps remain blocked until executable quote validation, owner authorization, X3 Guard enforcement, and settlement evidence are integrated and verified.
