//#region node_modules/.nitro/vite/services/ssr/assets/front-door-CDmHt-Gp.js
var SITE = "dotx3.net";
var REPO = "https://github.com/Cyptopimpinainteazy/x3lang";
var RAW = "https://github.com/Cyptopimpinainteazy/x3lang/blob/master";
var LINKS = {
	repo: REPO,
	readme: `${REPO}#readme`,
	actions: `${REPO}/actions`,
	issues: `${REPO}/issues`,
	pulls: `${REPO}/pulls`,
	license: `${REPO}/blob/master/LICENSE`,
	security: `${REPO}/blob/master/SECURITY.md`,
	contributing: `${REPO}/blob/master/CONTRIBUTING.md`,
	hackathonDocs: `${REPO}/tree/master/docs/hackathon`,
	examples: `${REPO}/tree/master/x3-lang/examples`,
	mandate: `${RAW}/x3-lang/examples/near_mandate_agent.x3`,
	trade: `${RAW}/x3-lang/examples/base_sepolia_to_near_testnet_1usdc.x3`,
	denied: `${RAW}/x3-lang/examples/near_intents_agent_denied.x3`,
	payment: `${RAW}/x3-lang/examples/near_intents_agent_payment.x3`,
	guardEvidence: `${RAW}/evidence/near-guard-testnet-live-2026-11-06.md`,
	baseTx: "https://sepolia.basescan.org/tx/0x46c21dc305a9271c4e74c6d0734fb50f847a1e53d3cad87976133d66fd6728d9",
	nearPayout: "https://testnet.nearblocks.io/txns/EBEBxJNgV9U5tBFBLj18ZzukgArqwXH5rBsBStFyCm1d",
	refuseTx: "https://testnet.nearblocks.io/txns/AhVBD7oXfwsixBipupjCzuhNdqunjdXJnLz3LXnmfnN8",
	acceptTx: "https://testnet.nearblocks.io/txns/DPJfcRUGk56h8sSsFsDFFgUMQAiyBCtpMuvquF9FvTct",
	dryQuoteTx: "https://testnet.nearblocks.io/txns/3Q7qTZqiRBB6EuhN78Ra5Q5NBqPXDhfuCg2FKW8WoU2q",
	liveQuoteTx: "https://testnet.nearblocks.io/txns/6B6k5kre4mFoBq7RuJNadQgrhEvmgb9WDLepX22CxzUZ",
	deployTx: "https://testnet.nearblocks.io/txns/FJ5voQaArx17QV4TzDLYDq93cuoAVLSRxjcxbswuyE8v",
	baseline: "https://github.com/Cyptopimpinainteazy/x3lang/compare/baseline...master",
	nearDocs: "https://docs.near.org",
	intentsDocs: "https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart",
	hackathon: "https://nearhackathon.com",
	x: "https://x.com/x3starchain",
	telegram: "https://t.me/x3starchain",
	browserDemo: "https://x3-guard.pages.dev"
};
var PROGRAM_SHA = "1398f64e7e208d3796883aa59cb169187c1042ac1af3781bd6efc014755df860";
var MANDATE = `mandate x3_shopping_agent {
    owner x3-owner.near
    agent x3-agent.near
    spend Solana.USDC
    per_payment 50000000
    per_24h 200000000
    allow recipients x3-demo.near
    allow assets Near.USDC
    require slippage <= 1%
    require fees <= 100 bps
    approve above 30000000 by 1 of x3-owner.near
    expires 30d
}`;
var TRADE = `intent x3_testnet_base_usdc_to_near {
    from BaseSepolia.USDC amount 1000000 receiver 0x5aF0c1BF95B3A158f6Fc48e3DED35903b2fa0721
    to Near.USDC receiver x3lang.testnet
    route {
        bridge NearIntents BaseSepolia.USDC -> Near.USDC min_receive 980000;
    }
    require slippage <= 1%
    require nonce unused x3_base_testnet_trade_001
    timeout 30m refund BaseSepolia.USDC to 0x5aF0c1BF95B3A158f6Fc48e3DED35903b2fa0721
    on_fail rollback
}`;
//#endregion
export { TRADE as a, SITE as i, MANDATE as n, PROGRAM_SHA as r, LINKS as t };
