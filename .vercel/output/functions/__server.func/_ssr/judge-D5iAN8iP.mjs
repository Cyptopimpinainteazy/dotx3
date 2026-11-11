//#region node_modules/.nitro/vite/services/ssr/assets/judge-D5iAN8iP.js
var scenarios_default = {
	schema: "x3.judge-console.scenarios.v2",
	generated_by: "x3-lang/near/demo/judge/build_scenarios.py",
	evaluated_at: "2026-11-03T03:00:00Z",
	evidence_level: "local_policy_preview_only",
	tracks: ["AI Security & Defense", "Agent Economy"],
	track_guide: [{
		"track": "AI Security & Defense",
		"role": "Deny substitutions, overspend, fee evasion, replay and revoked authority."
	}, {
		"track": "Agent Economy",
		"role": "Allow bounded payments and distinguish approval-required from authorized."
	}],
	demo_steps: [
		{
			"number": 1,
			"title": "Read the owner's policy",
			"body": "The mandate is the source of truth: assets, recipients, caps, approval and refund rules."
		},
		{
			"number": 2,
			"title": "Inspect the agent's request",
			"body": "Every scenario starts from a checked-in X3 program and shows the exact edited lines."
		},
		{
			"number": 3,
			"title": "Follow the security decision",
			"body": "Python and the browser use the same guard order and must reach the same verdict."
		},
		{
			"number": 4,
			"title": "Separate policy from settlement",
			"body": "A local pass is not a wallet approval, on-chain authorization or completed payment."
		},
		{
			"number": 5,
			"title": "Check the evidence",
			"body": "The final panel records which tests ran and names every claim that remains unproven."
		}
	],
	groups: {
		"A": "Authorized agent payment",
		"B": "Forbidden actions"
	},
	mandate: {
		"file": "x3-lang/examples/near_mandate_agent.x3",
		"source": "// near_mandate_agent.x3 — what an owner lets an AI agent spend, enforced on NEAR by x3-guard.\n//\n// The owner sends this once (`near_intents.py mandate args`). From then on the agent account\n// can register swaps in the owner's name, and x3-guard refuses any that break a term:\n//\n// - `spend` and `per_payment`: Solana USDC only, at most 50 USDC a payment.\n// - `per_24h`: at most 200 USDC in any rolling 24 hours (and at most 64 payments).\n// - `allow recipients` / `allow assets`: where the money may go, and as what.\n// - `refund_to`: a failed swap refunds here. The agent cannot point refunds at itself.\n// - `require slippage` / `require fees`: the loosest bounds an agent's intent may declare.\n// - `approve above`: a payment over 30 USDC waits for one of the listed approvers.\n// - `expires`: the mandate ends 30 days after it is compiled. The owner can revoke it at\n//   any time (`near_intents.py mandate revoke`), and every unaccepted intent stops at once.\n//\n// Amounts are base units: 50 USDC at six decimals is 50_000_000.\n//\n// The accounts are placeholders. Replace them with accounts you control.\nmandate x3_shopping_agent {\n    owner x3-owner.near\n    agent x3-agent.near\n    spend Solana.USDC\n    per_payment 50000000\n    per_24h 200000000\n    allow recipients x3-demo.near\n    allow assets Near.USDC\n    refund_to 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    require slippage <= 1%\n    require fees <= 100 bps\n    approve above 30000000 by 1 of x3-owner.near\n    expires 30d\n}\n",
		"sha256": "629c008639c5fea35c1f2f9f1e9e3c67717860f72b1b7e14450db042f17012d4"
	},
	tokens: {
		"file": "x3-lang/tests/fixtures/near_intents_tokens.json",
		"records": [
			{
				"assetId": "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
				"decimals": 6,
				"blockchain": "sol",
				"symbol": "USDC",
				"price": .9998,
				"priceUpdatedAt": "2026-11-02T20:00:00.000Z",
				"contractAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
			},
			{
				"assetId": "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
				"decimals": 6,
				"blockchain": "near",
				"symbol": "USDC",
				"price": .9998,
				"priceUpdatedAt": "2026-11-02T20:00:00.000Z",
				"contractAddress": "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"
			},
			{
				"assetId": "nep141:wrap.near",
				"decimals": 24,
				"blockchain": "near",
				"symbol": "wNEAR",
				"price": 2.41,
				"priceUpdatedAt": "2026-11-02T20:00:00.000Z",
				"contractAddress": "wrap.near"
			},
			{
				"assetId": "nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near",
				"decimals": 6,
				"blockchain": "eth",
				"symbol": "USDC",
				"price": .9998,
				"priceUpdatedAt": "2026-11-02T20:00:00.000Z",
				"contractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
			},
			{
				"assetId": "nep141:sol.omft.near",
				"decimals": 9,
				"blockchain": "sol",
				"symbol": "SOL",
				"price": 162.5,
				"priceUpdatedAt": "2026-11-02T20:00:00.000Z"
			},
			{
				"assetId": "nep245:v2_1.omni.hot.tg:56_11111111111111111111",
				"decimals": 18,
				"blockchain": "bsc",
				"symbol": "BNB",
				"price": 600,
				"priceUpdatedAt": "2026-11-05T00:00:00.000Z",
				"contractAddress": "11111111111111111111"
			}
		],
		"note": "Archived 1Click token list. Not a live response."
	},
	scenarios: [
		{
			"id": "authorized",
			"group": "A",
			"title": "Authorized payment",
			"story": "The agent pays 25 USDC to a listed recipient, inside every limit.",
			"takeaway": "All mandate checks pass; the payment is still only locally eligible.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "2b0f946464b82f0fc0186d47a9f968c8cb3ab4c038668bcc361c293bbf83021d",
				"edits": []
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "preflight_passed",
				"denied_guards": [],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "needs-approval",
			"group": "A",
			"title": "Payment that needs approval",
			"story": "40 USDC is under the 50 USDC cap but over the 30 USDC approval threshold.",
			"takeaway": "Every limit passes, but the listed owner must approve before acceptance.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 40 USDC is below the 50 USDC cap but above the 30 USDC approval threshold.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 40000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 39680000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "69c481783c9188f524ea01c7cdea1dbdc60e090291ee9da56a70e121d41465b9",
				"edits": [
					{
						"from": "amount 25000000",
						"to": "amount 40000000"
					},
					{
						"from": "min_receive 24800000",
						"to": "min_receive 39680000"
					},
					{
						"from": "// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.",
						"to": "// 40 USDC is below the 50 USDC cap but above the 30 USDC approval threshold."
					}
				]
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": ["near/x3-guard/src/mandate_tests.rs::payments_above_the_threshold_need_n_of_m_approvals"],
			"python": {
				"decision": "approval_required",
				"denied_guards": [],
				"approvals_needed": 1,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "over-limit",
			"group": "B",
			"title": "Exceeds the spending limit",
			"story": "60 USDC in one payment, over the owner's 50 USDC cap.",
			"takeaway": "The amount is safe to encode but outside the owner's authority.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 60 USDC exceeds the owner's 50 USDC per-payment cap.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 60000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 59520000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "3df39f5a533528b167003acb944700f494ab6fb39e4946f147b59dfdec35a9e0",
				"edits": [
					{
						"from": "amount 25000000",
						"to": "amount 60000000"
					},
					{
						"from": "min_receive 24800000",
						"to": "min_receive 59520000"
					},
					{
						"from": "// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.",
						"to": "// 60 USDC exceeds the owner's 50 USDC per-payment cap."
					}
				]
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_per_payment"],
				"approvals_needed": 1,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": false
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "wrong-recipient",
			"group": "B",
			"title": "Unauthorized recipient",
			"story": "The agent tries to pay attacker.near, who is not on the owner's list.",
			"takeaway": "Recipient substitution stops at mandate_recipient, before any quote.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_denied.x3",
				"source": "// Deliberately forbidden recipient. Same owner, asset, fee and refund policy.\n// This must fail `mandate_recipient` under near_mandate_agent.x3.\nintent near_intents_agent_denied {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver attacker.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_denied_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "0d5aede64cde0f9dc282fe294521fa3201905af194c82988ed81c25d9c9d8bc2",
				"edits": []
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_recipient"],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": false
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "prompt-injection-recipient",
			"group": "B",
			"title": "Prompt-injected payment",
			"story": "A prompt-injected instruction steers the AI agent to pay attacker.near, but the owner never authorized that recipient.",
			"takeaway": "The model can generate any request; the compiled mandate stops recipient substitution.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_denied.x3",
				"source": "// Deliberately forbidden recipient. Same owner, asset, fee and refund policy.\n// This must fail `mandate_recipient` under near_mandate_agent.x3.\nintent near_intents_agent_denied {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver attacker.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_denied_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "0d5aede64cde0f9dc282fe294521fa3201905af194c82988ed81c25d9c9d8bc2",
				"edits": []
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_recipient"],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": false
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "refund-redirect",
			"group": "B",
			"title": "Redirected refund",
			"story": "The agent points a failed swap's refund at an address the owner did not pin.",
			"takeaway": "The owner's refund address cannot be redirected by the agent.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC to So11111111111111111111111111111111111111112\n    on_fail rollback\n}\n",
				"sha256": "e00e6ca9fe1f1a4044314017250b22495f493a652643f321da50d539e5396caf",
				"edits": [{
					"from": "timeout 10m refund Solana.USDC",
					"to": "timeout 10m refund Solana.USDC to So11111111111111111111111111111111111111112"
				}]
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_refund_to"],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": false
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "fee-too-high",
			"group": "B",
			"title": "Fee cap above the owner's limit",
			"story": "The agent accepts up to 150 bps in fees; the owner allows 100.",
			"takeaway": "A higher fee cap is refused even if the model presents it as normal.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 150 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "0f3036c29e5f2edc5b0f4074730ffd4b3bf9ff477fa8274eb9e3d6e2fee239bd",
				"edits": [{
					"from": "require fees <= 100 bps",
					"to": "require fees <= 150 bps"
				}]
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_fees"],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": false
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "daily-cap",
			"group": "B",
			"title": "Over the rolling 24-hour cap",
			"story": "Assuming the agent already spent 180 USDC an hour ago, 25 more breaks the 200 USDC day.",
			"takeaway": "Rolling spend is stateful; the console labels its assumed state explicitly.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "2b0f946464b82f0fc0186d47a9f968c8cb3ab4c038668bcc361c293bbf83021d",
				"edits": []
			},
			"assumed_guard_state": { "spends": [{
				"amount": "180000000",
				"at_ms": 17936712e5
			}] },
			"contract_only": false,
			"contract_note": null,
			"contract_tests": ["near/x3-guard/src/mandate_tests.rs::the_daily_cap_is_a_rolling_window_checked_when_a_quote_is_accepted"],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_daily"],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": false
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "revoked",
			"group": "B",
			"title": "After the owner revoked the mandate",
			"story": "Assuming the owner revoked the mandate, the same authorized payment is refused.",
			"takeaway": "Revocation invalidates the same request without changing its contents.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "2b0f946464b82f0fc0186d47a9f968c8cb3ab4c038668bcc361c293bbf83021d",
				"edits": []
			},
			"assumed_guard_state": { "revoked": true },
			"contract_only": false,
			"contract_note": null,
			"contract_tests": ["near/x3-guard/src/mandate_tests.rs::revoking_stops_the_agent_at_once_and_replacing_voids_old_intents"],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_active"],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": false
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "nonce-reuse",
			"group": "B",
			"title": "Reused nonce",
			"story": "The agent registers agent_payment_001 a second time to open another deposit address.",
			"takeaway": "The local checker cannot see used nonces; the contract test is the evidence.",
			"evidence_state": "contract_test_required",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "2b0f946464b82f0fc0186d47a9f968c8cb3ab4c038668bcc361c293bbf83021d",
				"edits": []
			},
			"assumed_guard_state": null,
			"contract_only": true,
			"contract_note": "A nonce is state on NEAR. The local checker cannot see which nonces were used, so it passes this payment; x3-guard panics with \"already registered\" on the second registration, and a policy accepts one quote.",
			"contract_tests": ["near/x3-guard/src/tests.rs::a_nonce_registers_once", "near/x3-guard/src/tests.rs::a_policy_accepts_one_quote"],
			"python": {
				"decision": "preflight_passed",
				"denied_guards": [],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": true
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		},
		{
			"id": "wrong-owner",
			"group": "B",
			"title": "Wrong mandate owner",
			"story": "The agent claims to act for another owner with a different mandate.",
			"takeaway": "Owner mismatch is refused before any payment term is evaluated.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate other-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "1f1c85b86e4bd61e019718d196a225a1b61426a7ccd6fc3a74e11f20d9660456",
				"edits": [{
					"from": "    under mandate x3-owner.near",
					"to": "    under mandate other-owner.near"
				}]
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_owner"],
				"approvals_needed": 0,
				"checks": []
			}
		},
		{
			"id": "slippage-too-high",
			"group": "B",
			"title": "Slippage above the owner's limit",
			"story": "The agent asks for 1.5% slippage while the owner permits at most 1%.",
			"takeaway": "Execution freedom is capped independently of the payment amount.",
			"evidence_state": "local_python_and_browser",
			"intent": {
				"file": "x3-lang/examples/near_intents_agent_payment.x3",
				"source": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 1.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
				"sha256": "01a280c7a878539727bca9eddd18233ee242d65406d716c98b0b130482a28762",
				"edits": [{
					"from": "require slippage <= 0.5%",
					"to": "require slippage <= 1.5%"
				}]
			},
			"assumed_guard_state": null,
			"contract_only": false,
			"contract_note": null,
			"contract_tests": [],
			"python": {
				"decision": "denied_by_policy",
				"denied_guards": ["mandate_slippage"],
				"approvals_needed": 0,
				"checks": [
					{
						"guard": "mandate_active",
						"ok": true
					},
					{
						"guard": "mandate_asset",
						"ok": true
					},
					{
						"guard": "mandate_destination_asset",
						"ok": true
					},
					{
						"guard": "mandate_recipient",
						"ok": true
					},
					{
						"guard": "mandate_refund_to",
						"ok": true
					},
					{
						"guard": "mandate_per_payment",
						"ok": true
					},
					{
						"guard": "mandate_daily",
						"ok": true
					},
					{
						"guard": "mandate_slippage",
						"ok": false
					},
					{
						"guard": "mandate_fees",
						"ok": true
					},
					{
						"guard": "mandate_deadline",
						"ok": true
					}
				]
			}
		}
	],
	summary: {
		"total": 12,
		"allowed": 1,
		"approval_required": 1,
		"denied": 9,
		"contract_only": 1
	}
};
var near_intents_quote_dry_live_capture_default = {
	quote: {
		"amountIn": "25000000",
		"amountInFormatted": "25.0",
		"amountInUsd": "24.982750000000",
		"minAmountIn": "25000000",
		"amountOut": "24997929",
		"amountOutFormatted": "24.997929",
		"amountOutUsd": "24.980680428990",
		"minAmountOut": "24872939",
		"timeEstimate": 20,
		"refundFee": "244425",
		"withdrawFee": "0"
	},
	quoteRequest: {
		"dry": true,
		"depositMode": "SIMPLE",
		"swapType": "EXACT_INPUT",
		"slippageTolerance": 50,
		"originAsset": "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
		"depositType": "ORIGIN_CHAIN",
		"destinationAsset": "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
		"amount": "25000000",
		"refundTo": "4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD",
		"refundType": "ORIGIN_CHAIN",
		"recipient": "wrap.near",
		"recipientType": "DESTINATION_CHAIN",
		"deadline": "2026-11-03T04:06:46.297Z",
		"confidentiality": "public",
		"quoteWaitingTimeMs": 0,
		"insured": false,
		"appFees": [{
			"recipient": "5880ad2b362620fadf759cbceb1cd5737ce8c6ed7fb8e9942881e6731f9247dd",
			"fee": 1
		}]
	},
	signature: "ed25519:mao2Y1gakEypKEMhqoSi9UoFNCKHZhU4Ey6Hd9UM4DBwMiNpiNTpUptxaUZSAXuYzBAt2KTVaU5QhPJgSLJgGKB",
	timestamp: "2026-11-03T03:56:47.575Z",
	correlationId: "11a1e38e-6577-44ce-8320-c314e44339ca"
};
var near_intents_quote_dry_implicit_capture_default = {
	correlationId: "ac7afeaf-c864-4a6f-8106-be516bad9773",
	quote: {
		"amountIn": "25000000",
		"amountInFormatted": "25.0",
		"amountInUsd": "24.983000000000",
		"amountOut": "24993591",
		"amountOutFormatted": "24.993591",
		"amountOutUsd": "24.976595358120",
		"minAmountIn": "25000000",
		"minAmountOut": "24868623",
		"refundFee": "244770",
		"timeEstimate": 20,
		"withdrawFee": "4779"
	},
	quoteRequest: {
		"amount": "25000000",
		"appFees": [{
			"fee": 1,
			"recipient": "5880ad2b362620fadf759cbceb1cd5737ce8c6ed7fb8e9942881e6731f9247dd"
		}],
		"confidentiality": "public",
		"deadline": "2026-11-03T04:28:04.780Z",
		"depositMode": "SIMPLE",
		"depositType": "ORIGIN_CHAIN",
		"destinationAsset": "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
		"dry": true,
		"insured": false,
		"originAsset": "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
		"quoteWaitingTimeMs": 0,
		"recipient": "f464e8aa90661507c667b20b39bdc9e97ccfb06822030f2ecbf3741af9d85f02",
		"recipientType": "DESTINATION_CHAIN",
		"refundTo": "4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD",
		"refundType": "ORIGIN_CHAIN",
		"slippageTolerance": 50,
		"swapType": "EXACT_INPUT"
	},
	signature: "ed25519:212wrwFvuT85fZ1fzj3noxkSEFanw13um9tRyko9VXZhrkjAU9jEiqsEtH2QgpZAzyfDGcdfNqVxim3ucAceLdqw",
	timestamp: "2026-11-03T04:18:05.521Z"
};
var DATA = scenarios_default;
var PRESETS = DATA.scenarios.map((scenario) => ({
	id: scenario.id,
	group: scenario.group,
	title: scenario.title,
	story: scenario.story,
	takeaway: scenario.takeaway,
	intent: scenario.intent.source,
	scenario
}));
var ATTACKS = [
	{
		id: "redirect-recipient",
		label: "Pay attacker.near",
		why: "A prompt injection swaps the recipient.",
		edits: [{
			from: "to Near.USDC receiver x3-demo.near",
			to: "to Near.USDC receiver attacker.near"
		}],
		kind: "guard",
		stop: "mandate_recipient"
	},
	{
		id: "over-cap",
		label: "Send 60 USDC",
		why: "The model inflates the amount past the per-payment cap.",
		edits: [{
			from: "amount 25000000",
			to: "amount 60000000"
		}, {
			from: "min_receive 24800000",
			to: "min_receive 59520000"
		}],
		kind: "guard",
		stop: "mandate_per_payment"
	},
	{
		id: "steal-refund",
		label: "Refund to another wallet",
		why: "A failed swap would refund somewhere the owner never named.",
		edits: [{
			from: "timeout 10m refund Solana.USDC",
			to: "timeout 10m refund Solana.USDC to So11111111111111111111111111111111111111112"
		}],
		kind: "guard",
		stop: "mandate_refund_to"
	},
	{
		id: "swap-asset",
		label: "Deliver wNEAR instead",
		why: "The agent changes what the recipient gets.",
		edits: [{
			from: "to Near.USDC receiver",
			to: "to Near.wNEAR receiver"
		}, {
			from: "Solana.USDC -> Near.USDC",
			to: "Solana.USDC -> Near.wNEAR"
		}],
		kind: "guard",
		stop: "mandate_destination_asset"
	},
	{
		id: "loose-slippage",
		label: "Allow 1.5% slippage",
		why: "A looser bound lets a bad route extract value.",
		edits: [{
			from: "require slippage <= 0.5%",
			to: "require slippage <= 1.5%"
		}],
		kind: "guard",
		stop: "mandate_slippage"
	},
	{
		id: "loose-fees",
		label: "Allow 150 bps fees",
		why: "A fee cap above the owner's limit.",
		edits: [{
			from: "require fees <= 100 bps",
			to: "require fees <= 150 bps"
		}],
		kind: "guard",
		stop: "mandate_fees"
	},
	{
		id: "drop-nonce",
		label: "Drop the nonce",
		why: "Without a nonce the same payment could be replayed.",
		edits: [{
			from: "    require nonce unused agent_payment_001\n",
			to: ""
		}],
		kind: "compile",
		stop: "X3_NEAR_NONCE"
	},
	{
		id: "drop-slippage",
		label: "Drop the slippage bound",
		why: "The agent would pick the tolerance itself.",
		edits: [{
			from: "    require slippage <= 0.5%\n",
			to: ""
		}],
		kind: "compile",
		stop: "X3_NEAR_SLIPPAGE_REQUIRED"
	},
	{
		id: "second-leg",
		label: "Add a second leg",
		why: "Two legs could half-execute with no rollback.",
		edits: [{
			from: "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n",
			to: "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n        swap Orca Solana.USDC -> Solana.SOL;\n"
		}],
		kind: "compile",
		stop: "X3_NEAR_ROUTE_SHAPE"
	}
];
function applyAttack(source, attack) {
	let out = source;
	for (const edit of attack.edits) {
		if (!out.includes(edit.from)) return source;
		out = out.replace(edit.from, edit.to);
	}
	return out;
}
var QUOTES = [{
	id: "live",
	label: "25 USDC, Solana to NEAR",
	json: JSON.stringify(near_intents_quote_dry_live_capture_default, null, 2)
}, {
	id: "implicit",
	label: "Second captured quote",
	json: JSON.stringify(near_intents_quote_dry_implicit_capture_default, null, 2)
}];
function displayDecision(pristine, contractOnly, decision) {
	return pristine && contractOnly ? "contract_only" : decision;
}
var ONE_CLICK_MANAGER_PUBLIC_KEY = "ed25519:reYaWhvwu8Jzo3WUM3zhn6VrhuMEF4eADL17qtRVifc";
var X3Error = class extends Error {
	constructor(code, message, { line = null, field = null, detail = null } = {}) {
		super(message);
		this.code = code;
		this.line = line;
		this.field = field;
		this.detail = detail;
	}
};
var CHAIN_DOMAINS = {
	solana: {
		aliases: ["sol", "svm"],
		address: "base58"
	},
	ethereum: {
		aliases: ["eth", "evm"],
		address: "evm"
	},
	arbitrum: {
		aliases: ["arb"],
		address: "evm"
	},
	polygon: {
		aliases: ["matic"],
		address: "evm"
	},
	bitcoin: {
		aliases: ["btc"],
		address: "btc"
	},
	bsc: {
		aliases: [
			"bnb",
			"binance",
			"bnbchain"
		],
		address: "evm"
	},
	x3: {
		aliases: [],
		address: "x3"
	},
	near: {
		aliases: [],
		address: "near"
	}
};
var ALIASES = {};
for (const [chain, meta] of Object.entries(CHAIN_DOMAINS)) {
	ALIASES[chain] = chain;
	for (const a of meta.aliases) ALIASES[a] = chain;
}
var ASSETS_BY_CHAIN = {
	solana: [
		"USDC",
		"SOL",
		"WSOL",
		"USDT",
		"BONK"
	],
	ethereum: [
		"USDC",
		"USDT",
		"WETH",
		"ETH",
		"WSOL",
		"DAI"
	],
	arbitrum: [
		"USDC",
		"USDT",
		"WETH",
		"ETH",
		"ARB"
	],
	polygon: [
		"USDC",
		"USDT",
		"WETH",
		"MATIC",
		"DAI"
	],
	bitcoin: ["BTC", "WBTC"],
	bsc: [
		"BNB",
		"USDC",
		"USDT"
	],
	x3: [
		"SOL",
		"USDC",
		"WSOL",
		"WETH",
		"BTC",
		"X3"
	],
	near: [
		"NEAR",
		"wNEAR",
		"USDC",
		"USDT"
	]
};
var NEAR_INTENTS_VIAS = ["nearintents", "near_intents"];
var KNOWN_BRIDGES = [
	"x3",
	"wormhole",
	"layerzero",
	"axelar",
	...NEAR_INTENTS_VIAS
];
var KNOWN_DEXS = [
	"raydium",
	"orca",
	"uniswap",
	"sushiswap",
	"curve"
];
var SUPPORTED_OPERATIONS = [
	"swap",
	"bridge",
	"lock",
	"mint",
	"burn",
	"release"
];
var REQUIRE_KINDS = [
	"finality",
	"slippage",
	"fees",
	"profit",
	"invariant",
	"risk",
	"nonce",
	"audit_gate",
	"bridge_liquidity",
	"canonical_supply",
	"relayer_quorum",
	"route_score",
	"solver_bond",
	"proof_complete",
	"refund_path",
	"refund_to",
	"finality_explicit",
	"vm_supported",
	"mainnet_safe",
	"proof"
];
function normalizeChain(chain) {
	if (chain == null) return null;
	return ALIASES[String(chain).toLowerCase()] ?? null;
}
var NEAR_ACCOUNT_RE = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
function isValidNearAccount(account) {
	const text = String(account);
	if (/^0x[a-f0-9]{40}$/.test(text)) return true;
	return text.length >= 2 && text.length <= 64 && NEAR_ACCOUNT_RE.test(text);
}
function isValidReceiver(chain, receiver) {
	if (receiver == null || receiver === "" || receiver === "sender") return true;
	const kind = CHAIN_DOMAINS[normalizeChain(chain)]?.address;
	const r = String(receiver);
	if (kind === "evm" && normalizeChain(chain) === "bsc") return /^0x[a-fA-F0-9]{40}$/.test(r);
	if (kind === "evm") return /^0x[a-fA-F0-9]+$/.test(r);
	if (kind === "base58") return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(r);
	if (kind === "btc") return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/.test(r);
	if (kind === "x3") return /^(x3_[a-zA-Z0-9_]{6,}|0x[a-fA-F0-9]{40})$/.test(r);
	if (kind === "near") return isValidNearAccount(r);
	return false;
}
function cleanLines(source) {
	const out = [];
	source.split(/\r?\n/).forEach((raw, i) => {
		let s = raw.trim();
		if (!s || s.startsWith("//") || s.startsWith("#")) return;
		s = s.replace(/\s+(\/\/|#).*$/, "").trim();
		s = s.replace(/;+$/, "");
		if (s) out.push({
			no: i + 1,
			text: s
		});
	});
	return out;
}
function assetRef(value, line, field) {
	const m = /^([A-Za-z][A-Za-z0-9_-]*)\.([A-Za-z][A-Za-z0-9_-]*)$/.exec(value ?? "");
	if (!m) throw new X3Error("X3_PARSE_ASSET_REF", `expected chain.asset reference for ${field}`, {
		line,
		field
	});
	return {
		chain: m[1].toLowerCase(),
		asset: m[2]
	};
}
function parseReceiver(tokens, line) {
	const idx = tokens.indexOf("receiver");
	if (idx < 0) return null;
	if (idx + 1 >= tokens.length) throw new X3Error("X3_PARSE_RECEIVER", "receiver requires an address", {
		line,
		field: "receiver"
	});
	const address = tokens[idx + 1].replace(/^"|"$/g, "");
	if (address.startsWith("0x") && !/^0x[0-9a-fA-F]+$/.test(address)) throw new X3Error("X3_PARSE_RECEIVER", `invalid Ethereum address '${address}'`, {
		line,
		field: "receiver"
	});
	return address;
}
function parseEndpoint(ln, keyword) {
	const parts = ln.text.split(/\s+/);
	if (parts.length < 2 || parts[0] !== keyword) throw new X3Error("X3_PARSE_ENDPOINT", `expected ${keyword} chain.asset`, {
		line: ln.no,
		field: keyword
	});
	const ep = assetRef(parts[1], ln.no, keyword);
	const ai = parts.indexOf("amount");
	if (ai >= 0) {
		if (ai + 1 >= parts.length) throw new X3Error("X3_PARSE_AMOUNT", `${keyword}.amount requires a value`, { line: ln.no });
		ep.amount = parts[ai + 1];
	} else ep.amount = null;
	const receiver = parseReceiver(parts, ln.no);
	if (receiver) ep.receiver = receiver;
	return ep;
}
function parseRefund(tokens, line) {
	if (!tokens.length || tokens[0] !== "refund" || tokens.length < 2) throw new X3Error("X3_PARSE_REFUND", "expected refund <chain.asset> [to <receiver>]", {
		line,
		field: "refund"
	});
	let to = "sender";
	if (tokens.length > 2) {
		if (tokens[2] !== "to" || tokens.length < 4) throw new X3Error("X3_PARSE_REFUND", "expected refund <chain.asset> [to <receiver>]", {
			line,
			field: "refund"
		});
		to = tokens[3].replace(/^"|"$/g, "");
	}
	const a = assetRef(tokens[1], line, "refund.asset");
	return {
		type: "refund",
		chain: a.chain,
		asset: a.asset,
		to
	};
}
function parseRequire(ln) {
	const t = ln.text.split(/\s+/);
	const kind = (t[1] ?? "").toLowerCase();
	const at = (r) => ({
		...r,
		line: ln.no
	});
	if (kind.startsWith("finality.") && t.length >= 4) return at({
		kind: "finality",
		chain: kind.split(".")[1],
		op: t[2],
		value: t[3]
	});
	if (kind === "finality" && t.length >= 5) return at({
		kind: "finality",
		chain: t[2].toLowerCase(),
		op: t[3],
		value: t[4]
	});
	if (kind === "slippage" && t.length >= 4) return at({
		kind: "slippage",
		op: t[2],
		value: t[3]
	});
	if (kind === "nonce" && t.length >= 3) return at({
		kind: "nonce",
		value: t.slice(2).join(" ")
	});
	if (REQUIRE_KINDS.includes(kind)) {
		if (t.length >= 4) return at({
			kind,
			op: t[2],
			value: t.slice(3).join(" ")
		});
		if (t.length >= 3) return at({
			kind,
			value: t.slice(2).join(" ")
		});
	}
	throw new X3Error("X3_PARSE_REQUIRE", `malformed require '${kind}': not a guard kind the language defines`, {
		line: ln.no,
		field: "require"
	});
}
function parseRouteStep(ln) {
	const p = ln.text.split(/\s+/);
	const op = p[0].toLowerCase();
	if (op === "bridge") {
		if (p.length < 5 || p[3] !== "->") throw new X3Error("X3_PARSE_BRIDGE", "expected bridge <via> <from> -> <to>", {
			line: ln.no,
			field: "route.bridge"
		});
		const from_ref = assetRef(p[2], ln.no, "bridge.from");
		const to_ref = assetRef(p[4], ln.no, "bridge.to");
		const step = {
			type: "bridge",
			via: p[1].toLowerCase(),
			from_ref,
			to_ref,
			asset: from_ref.asset,
			line: ln.no
		};
		for (const key of ["amount", "min_receive"]) {
			const i = p.indexOf(key);
			if (i >= 0) {
				if (i + 1 >= p.length) throw new X3Error("X3_PARSE_BRIDGE", `bridge ${key} requires a value`, { line: ln.no });
				step[key] = p[i + 1];
			}
		}
		const r = parseReceiver(p, ln.no);
		if (r) step.receiver = r;
		return step;
	}
	if (op === "swap") {
		if (p.length < 5 || p[3] !== "->") throw new X3Error("X3_PARSE_SWAP", "expected swap <dex> <from> -> <to>", {
			line: ln.no,
			field: "route.swap"
		});
		return {
			type: "swap",
			dex: p[1].toLowerCase(),
			from_ref: assetRef(p[2], ln.no, "swap.from"),
			to_ref: assetRef(p[4], ln.no, "swap.to"),
			line: ln.no
		};
	}
	if ([
		"lock",
		"mint",
		"burn",
		"release"
	].includes(op)) return {
		type: op,
		...assetRef(p[1], ln.no, `${op}.asset`),
		line: ln.no
	};
	throw new X3Error("X3_PARSE_OPERATION", `unsupported route operation '${op}'`, {
		line: ln.no,
		field: "route"
	});
}
/** Parse one `intent` (declarations above it are skipped, as in cli.py). */
function parse(source) {
	const lines = cleanLines(source);
	if (!lines.length) throw new X3Error("X3_PARSE_EMPTY", "the program is empty");
	let i = 0;
	while (i < lines.length && !/^intent\s+[A-Za-z_]/.test(lines[i].text)) {
		if (/^error\s+[A-Za-z_][A-Za-z0-9_]*$/.test(lines[i].text)) {
			i++;
			continue;
		}
		if (!/^[A-Za-z_][A-Za-z0-9_-]*(\s+[A-Za-z_][A-Za-z0-9_.-]*)*\s*\{/.test(lines[i].text)) break;
		const header = lines[i];
		let depth = 0;
		while (i < lines.length) {
			depth += (lines[i].text.match(/\{/g) || []).length - (lines[i].text.match(/\}/g) || []).length;
			i++;
			if (depth <= 0) break;
		}
		if (depth > 0) throw new X3Error("X3_PARSE_DECLARATION", `declaration '${header.text}' is never closed`, { line: header.no });
	}
	const m = i < lines.length ? /^intent\s+([A-Za-z_][A-Za-z0-9_-]*)\s*\{?/.exec(lines[i].text) : null;
	if (!m) throw new X3Error("X3_PARSE_NO_INTENT", "this program declares no `intent`", { line: lines[Math.min(i, lines.length - 1)].no });
	const intent = {
		intent: m[1],
		from: {},
		to: {},
		route: [],
		requires: [],
		policies: {},
		lines: { intent: lines[i].no }
	};
	for (i = i + 1; i < lines.length; i++) {
		const ln = lines[i];
		const t = ln.text;
		if (t === "}") continue;
		if (t.startsWith("from ")) {
			intent.from = parseEndpoint(ln, "from");
			intent.lines.from = ln.no;
		} else if (t.startsWith("to ")) {
			intent.to = parseEndpoint(ln, "to");
			intent.lines.to = ln.no;
		} else if ((t.startsWith("route") || t.startsWith("path")) && t.includes("{")) for (i = i + 1; i < lines.length && lines[i].text !== "}"; i++) {
			if (lines[i].text.startsWith("fallback")) throw new X3Error("X3_NEAR_ROUTE_SHAPE", "a NEAR Intents program has one route leg and no fallback", { line: lines[i].no });
			intent.route.push(parseRouteStep(lines[i]));
		}
		else if (t.startsWith("require ")) intent.requires.push(parseRequire(ln));
		else if (t.startsWith("timeout ")) {
			const p = t.split(/\s+/);
			const timeout = { duration: p[1] };
			if (p.length > 2) timeout.action = parseRefund(p.slice(2), ln.no);
			intent.policies.timeout = timeout;
			intent.lines.timeout = ln.no;
		} else if (t.startsWith("under ")) {
			const p = t.split(/\s+/);
			if (p.length !== 3 || p[1] !== "mandate") throw new X3Error("X3_PARSE_MANDATE", "expected `under mandate <owner account>`", {
				line: ln.no,
				field: "mandate"
			});
			if (intent.mandate) throw new X3Error("X3_PARSE_MANDATE", "an intent is under one mandate", {
				line: ln.no,
				field: "mandate"
			});
			intent.mandate = { owner: p[2].replace(/"/g, "") };
			intent.lines.mandate = ln.no;
		} else if (t.startsWith("on_fail ")) {
			const p = t.split(/\s+/).slice(1);
			intent.policies.on_fail = [
				"rollback",
				"halt",
				"quarantine"
			].includes(p[0]) ? { type: p[0] } : parseRefund(p, ln.no);
			intent.lines.on_fail = ln.no;
		}
	}
	return intent;
}
/** The parts of typechecker.py a NEAR Intents program can hit. Returns error objects. */
function typecheck(intent) {
	const errors = [];
	const err = (code, message, field, line) => errors.push({
		code,
		message,
		field,
		line
	});
	const checkAsset = (chain, asset, field, line) => {
		const norm = normalizeChain(chain);
		if (!norm) {
			err("X3_INVALID_CHAIN", `unsupported chain '${chain}'`, `${field}.chain`, line);
			return null;
		}
		if (!ASSETS_BY_CHAIN[norm].includes(asset)) err("X3_INVALID_ASSET", `asset '${asset}' not registered on ${norm}`, `${field}.asset`, line);
		return norm;
	};
	for (const key of ["from", "to"]) {
		const ep = intent[key];
		if (!ep || !ep.chain) {
			err("X3_MISSING_ENDPOINT", `missing ${key} endpoint`, key, intent.lines.intent);
			continue;
		}
		const chain = checkAsset(ep.chain, ep.asset, key, intent.lines[key]);
		if (chain && !isValidReceiver(chain, ep.receiver)) err("X3_INVALID_RECEIVER", `invalid receiver for ${chain}`, `${key}.receiver`, intent.lines[key]);
	}
	if (!intent.route.length) err("X3_EMPTY_ROUTE", "route must contain at least one operation", "route", intent.lines.intent);
	intent.route.forEach((step, i) => {
		if (!SUPPORTED_OPERATIONS.includes(step.type)) err("X3_INVALID_OPERATION", `unsupported operation '${step.type}'`, `route[${i}]`, step.line);
		if (step.type === "bridge" && !KNOWN_BRIDGES.includes(step.via)) err("X3_INVALID_BRIDGE", "unknown bridge adapter", `route[${i}].via`, step.line);
		if (step.type === "swap" && !KNOWN_DEXS.includes(step.dex)) err("X3_INVALID_DEX", "unknown DEX", `route[${i}].dex`, step.line);
		if (step.from_ref) checkAsset(step.from_ref.chain, step.from_ref.asset, `route[${i}].from`, step.line);
		if (step.to_ref) {
			const c = checkAsset(step.to_ref.chain, step.to_ref.asset, `route[${i}].to`, step.line);
			if (c && step.type === "bridge" && !isValidReceiver(c, step.receiver ?? intent.to?.receiver)) err("X3_INVALID_RECEIVER", `invalid receiver for ${c}`, `route[${i}].receiver`, step.line);
		}
	});
	return errors;
}
/** "12.345" -> { n: 12345n, scale: 3 }. Refuses anything that is not a plain decimal. */
function decimal(text, field) {
	const s = String(text).trim();
	const m = /^(\d+)(?:\.(\d+))?$/.exec(s);
	if (!m) throw new X3Error("X3_NEAR_NUMBER", `${field} is not a number: '${text}'`, { field });
	const frac = m[2] ?? "";
	return {
		n: BigInt(m[1] + frac),
		scale: frac.length
	};
}
var pow10 = (k) => 10n ** BigInt(k);
function baseUnits(value, field) {
	const text = String(value).trim().replace(/_/g, "");
	if (!/^\d+$/.test(text)) throw new X3Error("X3_NEAR_AMOUNT", `${field} must be an integer in base units, got '${value}'`, { field });
	const n = BigInt(text);
	if (n <= 0n) throw new X3Error("X3_NEAR_AMOUNT", `${field} must be positive`, { field });
	return n;
}
/** `0.5%`, `50 bps`, or a bare fraction -> { n, d } basis points as an exact fraction. */
function toBps(value, field) {
	const text = String(value).trim().toLowerCase().replace(/\s+/g, "");
	let d;
	let mul;
	if (text.endsWith("bps")) {
		d = decimal(text.slice(0, -3), field);
		mul = 1n;
	} else if (text.endsWith("%")) {
		d = decimal(text.slice(0, -1), field);
		mul = 100n;
	} else {
		d = decimal(text, field);
		if (d.n >= pow10(d.scale)) throw new X3Error("X3_NEAR_BOUND_UNIT", `${field} '${value}' has no unit; write it as a percent (0.5%) or in bps (50 bps)`, { field });
		mul = 10000n;
	}
	return {
		n: d.n * mul,
		d: pow10(d.scale)
	};
}
function upperBoundBps(req, field) {
	if (req.op !== "<=" && req.op !== "<") throw new X3Error("X3_NEAR_GUARD_OPERATOR", `${field} must be an upper bound (<= or <), got '${req.op}'`, {
		field,
		line: req.line
	});
	const { n, d } = toBps(req.value, field);
	let whole = n / d;
	if (req.op === "<" && n % d === 0n) whole -= 1n;
	if (whole < 0n) throw new X3Error("X3_NEAR_BOUND_UNIT", `${field} allows no value at all`, {
		field,
		line: req.line
	});
	return Number(whole);
}
var CHAIN_TO_BLOCKCHAIN = {
	near: "near",
	ethereum: "eth",
	solana: "sol",
	arbitrum: "arb",
	polygon: "pol",
	bitcoin: "btc",
	bsc: "bsc"
};
var SYMBOL_ALIASES = { "near/NEAR": "wNEAR" };
var ENFORCED_GUARDS = [
	"slippage",
	"fees",
	"nonce"
];
function formatTimestamp(ms) {
	return new Date(ms).toISOString();
}
function parseTimestampMs(text) {
	const m = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.exec(String(text));
	if (!m) throw new X3Error("X3_NEAR_TIMESTAMP", `unreadable timestamp '${text}'`);
	const frac = (m[2] ?? ".0").slice(1, 4).padEnd(3, "0");
	const ms = Date.parse(`${m[1]}.${frac}${m[3]}`);
	if (Number.isNaN(ms)) throw new X3Error("X3_NEAR_TIMESTAMP", `unreadable timestamp '${text}'`);
	return ms;
}
function parseDurationMs(text) {
	const m = /^(\d+)(ms|s|m|h)$/.exec(String(text).trim());
	if (!m) throw new X3Error("X3_NEAR_TIMEOUT_UNIT", `timeout '${text}' is not a wall-clock duration (<n>ms|s|m|h)`, { field: "policies.timeout.duration" });
	const ms = Number(m[1]) * {
		ms: 1,
		s: 1e3,
		m: 6e4,
		h: 36e5
	}[m[2]];
	if (ms <= 0) throw new X3Error("X3_NEAR_TIMEOUT_UNIT", "timeout must be positive");
	return ms;
}
function endpoint(intent, key) {
	const ep = intent[key];
	if (!ep || !ep.chain || !ep.asset) throw new X3Error("X3_NEAR_ENDPOINT", `intent has no \`${key}\` chain.asset`, {
		field: key,
		line: intent.lines.intent
	});
	const chain = normalizeChain(ep.chain);
	if (!CHAIN_TO_BLOCKCHAIN[chain]) throw new X3Error("X3_NEAR_CHAIN_UNSUPPORTED", `${key} chain '${ep.chain}' has no NEAR Intents mapping (supported: ${Object.keys(CHAIN_TO_BLOCKCHAIN).sort().join(", ")})`, {
		field: `${key}.chain`,
		line: intent.lines[key]
	});
	return {
		...ep,
		chain
	};
}
function lower(intent, nowMs = Date.now()) {
	const route = intent.route;
	const L = intent.lines;
	if (route.length !== 1 || route[0].type !== "bridge" || !NEAR_INTENTS_VIAS.includes(route[0].via)) throw new X3Error("X3_NEAR_ROUTE_SHAPE", "a NEAR Intents program has exactly one route leg, `bridge NearIntents <from> -> <to>`: 1Click settles one swap, and composing it with other legs would allow partial execution with no rollback", {
		field: "route",
		line: route[0]?.line ?? L.intent
	});
	const leg = route[0];
	const source = endpoint(intent, "from");
	const dest = endpoint(intent, "to");
	for (const [refKey, ep, label] of [[
		"from_ref",
		source,
		"from"
	], [
		"to_ref",
		dest,
		"to"
	]]) {
		const ref = leg[refKey] ?? {};
		if (normalizeChain(ref.chain) !== ep.chain || ref.asset !== ep.asset) throw new X3Error("X3_NEAR_ROUTE_ENDPOINTS", `the NearIntents leg's ${label} side (${ref.chain}.${ref.asset}) is not the intent's \`${label}\` (${ep.chain}.${ep.asset})`, {
			field: `route[0].${refKey}`,
			line: leg.line
		});
	}
	if (source.amount == null) throw new X3Error("X3_NEAR_AMOUNT", "`from` must state an amount", {
		field: "from.amount",
		line: L.from
	});
	const amount = baseUnits(source.amount, "from.amount");
	if (leg.amount != null && baseUnits(leg.amount, "route[0].amount") !== amount) throw new X3Error("X3_NEAR_AMOUNT", "the leg's amount differs from the intent's `from` amount; the leg spends all of it", {
		field: "route[0].amount",
		line: leg.line
	});
	const minReceive = leg.min_receive != null ? baseUnits(leg.min_receive, "route[0].min_receive") : null;
	const recipient = leg.receiver ?? dest.receiver;
	if (!recipient || recipient === "sender") throw new X3Error("X3_NEAR_RECIPIENT", "`to` must name a receiver address", {
		field: "to.receiver",
		line: L.to
	});
	if (!isValidReceiver(dest.chain, recipient)) throw new X3Error("X3_NEAR_RECIPIENT", `'${recipient}' is not a ${dest.chain} address`, {
		field: "to.receiver",
		line: L.to
	});
	const requires = intent.requires;
	const unenforceable = [...new Set(requires.map((r) => r.kind).filter((k) => !ENFORCED_GUARDS.includes(k)))].sort();
	if (unenforceable.length) {
		const first = requires.find((r) => unenforceable.includes(r.kind));
		throw new X3Error("X3_NEAR_GUARD_UNENFORCEABLE", `NEAR Intents gives this adapter no way to enforce: ${unenforceable.join(", ")}. It enforces ${ENFORCED_GUARDS.slice().sort().join(", ")}`, {
			field: "requires",
			line: first.line
		});
	}
	const slippage = requires.filter((r) => r.kind === "slippage").map((r) => upperBoundBps(r, "require slippage"));
	if (!slippage.length) throw new X3Error("X3_NEAR_SLIPPAGE_REQUIRED", "a NEAR Intents swap needs `require slippage <= <bound>`; 1Click requires a tolerance and this adapter will not pick one for you", {
		field: "requires",
		line: L.intent
	});
	const feeCaps = requires.filter((r) => r.kind === "fees").map((r) => upperBoundBps(r, "require fees"));
	const nonces = [];
	for (const r of requires.filter((x) => x.kind === "nonce")) {
		let words = String(r.value).split(/\s+/).filter(Boolean);
		if (words[0] === "unused") words = words.slice(1);
		if (words.length !== 1) throw new X3Error("X3_NEAR_NONCE", "expected `require nonce unused <id>`", { line: r.line });
		nonces.push(words[0]);
	}
	if (new Set(nonces).size > 1) throw new X3Error("X3_NEAR_NONCE", "an intent carries one nonce");
	const timeout = intent.policies.timeout;
	if (!timeout || !timeout.duration) throw new X3Error("X3_NEAR_TIMEOUT_REQUIRED", "a NEAR Intents swap needs `timeout <duration> refund <from asset>`: the deadline is when 1Click starts refunding", {
		field: "policies.timeout",
		line: L.intent
	});
	let windowMs;
	try {
		windowMs = parseDurationMs(timeout.duration);
	} catch (e) {
		e.line = L.timeout;
		throw e;
	}
	const refund = timeout.action ?? {
		type: "refund",
		chain: source.chain,
		asset: source.asset,
		to: "sender"
	};
	const onFail = intent.policies.on_fail;
	if (onFail && (onFail.type === "halt" || onFail.type === "quarantine")) throw new X3Error("X3_NEAR_ON_FAIL_UNSUPPORTED", `on_fail ${onFail.type} cannot be expressed: 1Click refunds a failed swap to the refund address`, {
		field: "policies.on_fail",
		line: L.on_fail
	});
	const actions = onFail && onFail.type === "refund" ? [[refund, L.timeout], [onFail, L.on_fail]] : [[refund, L.timeout]];
	let refundTo = null;
	for (const [action, line] of actions) {
		if (normalizeChain(action.chain) !== source.chain || action.asset !== source.asset) throw new X3Error("X3_NEAR_REFUND_ASSET", `1Click refunds the deposited asset (${source.chain}.${source.asset}) on the origin chain, not ${action.chain}.${action.asset}`, {
			field: "policies",
			line
		});
		const target = (action.to ?? "sender") === "sender" ? source.receiver : action.to;
		if (!target) throw new X3Error("X3_NEAR_REFUND_TO", "the refund goes to `sender`, and `from` names no receiver to refund", {
			field: "from.receiver",
			line: L.from
		});
		if (!isValidReceiver(source.chain, target)) throw new X3Error("X3_NEAR_REFUND_TO", `'${target}' is not a ${source.chain} address`, {
			field: "policies",
			line
		});
		if (refundTo !== null && refundTo !== target) throw new X3Error("X3_NEAR_REFUND_TO", "timeout and on_fail refund to different addresses; 1Click takes one", {
			field: "policies",
			line
		});
		refundTo = target;
	}
	const out = {
		intent: intent.intent,
		origin: {
			chain: source.chain,
			asset: source.asset
		},
		destination: {
			chain: dest.chain,
			asset: dest.asset
		},
		amount: amount.toString(),
		min_receive: minReceive === null ? null : minReceive.toString(),
		recipient,
		refund_to: refundTo,
		slippage_bps: Math.min(...slippage),
		fee_cap_bps: feeCaps.length ? Math.min(...feeCaps) : null,
		nonce: nonces[0] ?? null,
		deadline: formatTimestamp(nowMs + windowMs)
	};
	if (intent.mandate) {
		const owner = intent.mandate.owner;
		if (!owner || !isValidNearAccount(owner)) throw new X3Error("X3_MANDATE_OWNER", `\`under mandate\` names '${owner}', which is not a NEAR account`, {
			field: "mandate.owner",
			line: L.mandate
		});
		if (!out.nonce) throw new X3Error("X3_NEAR_NONCE", "an intent under a mandate needs `require nonce unused <id>`: x3-guard records it under the owner by its nonce", {
			field: "requires.nonce",
			line: L.mandate
		});
		out.mandate_owner = owner;
	}
	return out;
}
function resolveAsset(tokens, chain, asset) {
	const blockchain = CHAIN_TO_BLOCKCHAIN[chain];
	const symbol = SYMBOL_ALIASES[`${chain}/${asset}`] ?? asset;
	const matches = tokens.filter((t) => t.blockchain === blockchain && String(t.symbol ?? "").toUpperCase() === symbol.toUpperCase());
	if (!matches.length) throw new X3Error("X3_NEAR_ASSET_UNSUPPORTED", `1Click lists no ${symbol} on ${blockchain}`, { field: `${chain}.${asset}` });
	if (matches.length > 1) throw new X3Error("X3_NEAR_ASSET_AMBIGUOUS", `1Click lists ${matches.length} tokens with symbol ${symbol} on ${blockchain}; refusing to guess`, {
		field: `${chain}.${asset}`,
		detail: matches.map((m) => m.assetId)
	});
	return matches[0];
}
function buildQuoteRequest(leg, tokens, { dry = true } = {}) {
	const origin = resolveAsset(tokens, leg.origin.chain, leg.origin.asset);
	const destination = resolveAsset(tokens, leg.destination.chain, leg.destination.asset);
	return {
		dry,
		swapType: "EXACT_INPUT",
		slippageTolerance: leg.slippage_bps,
		originAsset: origin.assetId,
		depositType: "ORIGIN_CHAIN",
		destinationAsset: destination.assetId,
		amount: leg.amount,
		refundTo: leg.refund_to,
		refundType: "ORIGIN_CHAIN",
		recipient: leg.recipient,
		recipientType: "DESTINATION_CHAIN",
		deadline: leg.deadline
	};
}
/** json-stable-stringify 1.3.0 with default options. */
function stableStringify(value) {
	if (value && typeof value.toJSON === "function") value = value.toJSON();
	if (value === void 0) return void 0;
	if (typeof value !== "object" || value === null) return JSON.stringify(value);
	if (Array.isArray(value)) return "[" + value.map((v) => stableStringify(v) ?? "null").join(",") + "]";
	const parts = [];
	for (const k of Object.keys(value).sort()) {
		const v = stableStringify(value[k]);
		if (!v) continue;
		parts.push(JSON.stringify(k) + ":" + v);
	}
	return "{" + parts.join(",") + "}";
}
function signedRequest(r) {
	return {
		dry: r.dry,
		swapType: r.swapType,
		slippageTolerance: r.slippageTolerance,
		originAsset: r.originAsset,
		depositType: r.depositType,
		destinationAsset: r.destinationAsset,
		amount: r.amount,
		refundTo: r.refundTo,
		refundType: r.refundType,
		recipient: r.recipient,
		recipientType: r.recipientType,
		deadline: r.deadline,
		quoteWaitingTimeMs: r.quoteWaitingTimeMs ? r.quoteWaitingTimeMs : void 0,
		referral: r.referral ? r.referral : void 0,
		virtualChainRecipient: r.virtualChainRecipient ? r.virtualChainRecipient : void 0,
		virtualChainRefundRecipient: r.virtualChainRefundRecipient ? r.virtualChainRefundRecipient : void 0,
		customRecipientMsg: r.customRecipientMsg ? r.customRecipientMsg : void 0
	};
}
function signedQuote(response) {
	const q = response.quote;
	const base = {
		amountIn: q.amountIn,
		amountInFormatted: q.amountInFormatted,
		amountInUsd: q.amountInUsd,
		minAmountIn: q.minAmountIn,
		amountOut: q.amountOut,
		amountOutFormatted: q.amountOutFormatted,
		amountOutUsd: q.amountOutUsd,
		minAmountOut: q.minAmountOut
	};
	if (response.quoteRequest.dry) return base;
	return {
		...base,
		depositAddress: q.depositAddress || void 0,
		depositMemo: q.depositMemo || void 0,
		deadline: q.deadline || void 0,
		timeWhenInactive: q.timeWhenInactive || void 0,
		timeEstimate: q.timeEstimate || void 0,
		refundFee: q.refundFee || void 0,
		withdrawFee: q.withdrawFee || void 0
	};
}
function signedQuotePayload(response) {
	if (!response || typeof response !== "object" || typeof response.quote !== "object" || response.quote === null || typeof response.quoteRequest !== "object" || response.quoteRequest === null || typeof response.timestamp !== "string") throw new X3Error("X3_NEAR_SIGNATURE_FORMAT", "the response lacks quote, quoteRequest or timestamp");
	return stableStringify({
		...signedRequest(response.quoteRequest),
		...signedQuote(response),
		timestamp: response.timestamp
	});
}
var B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b58encode(bytes) {
	let n = 0n;
	for (const b of bytes) n = n << 8n | BigInt(b);
	let out = "";
	while (n > 0n) {
		out = B58[Number(n % 58n)] + out;
		n /= 58n;
	}
	for (const b of bytes) {
		if (b !== 0) break;
		out = "1" + out;
	}
	return out;
}
function b58decode(text) {
	if (typeof text !== "string" || !text) throw new X3Error("X3_NEAR_SIGNATURE_FORMAT", "base58 input must be a non-empty string");
	let n = 0n;
	for (const c of text) {
		const i = B58.indexOf(c);
		if (i < 0) throw new X3Error("X3_NEAR_SIGNATURE_FORMAT", `invalid base58 character '${c}'`);
		n = n * 58n + BigInt(i);
	}
	const bytes = [];
	while (n > 0n) {
		bytes.unshift(Number(n & 255n));
		n >>= 8n;
	}
	for (const c of text) {
		if (c !== "1") break;
		bytes.unshift(0);
	}
	return new Uint8Array(bytes);
}
function decodeEd25519(value, length) {
	if (typeof value !== "string" || !value.startsWith("ed25519:")) throw new X3Error("X3_NEAR_SIGNATURE_FORMAT", "expected an ed25519:<base58> value");
	const raw = b58decode(value.slice(8));
	if (raw.length !== length) throw new X3Error("X3_NEAR_SIGNATURE_FORMAT", `expected ${length} bytes, decoded ${raw.length}`);
	return raw;
}
/**
* Why this browser cannot hash or verify, or null if it can. Browsers expose WebCrypto only
* to secure contexts: https:// pages and http://localhost. Opened at a plain http:// LAN
* address, `crypto.subtle` is missing, and that is not the quote's fault.
*/
function webCryptoProblem(g = globalThis) {
	if (g.isSecureContext === false || !g.crypto?.subtle) return "This browser has turned off WebCrypto for this page, so it cannot check 1Click's signature. Browsers do that on plain http:// addresses other than localhost. Open the page at https:// or http://localhost (from another computer, tunnel the port with ssh -L).";
	return null;
}
async function resolveWebCrypto(runtime = globalThis) {
	if (runtime.crypto?.subtle) return runtime.crypto;
	if (runtime === globalThis && typeof process !== "undefined" && process.versions?.node) try {
		return (await import("node:crypto")).webcrypto;
	} catch {
		return null;
	}
	return null;
}
async function quoteHash(response, runtime = globalThis) {
	const webCrypto = await resolveWebCrypto(runtime);
	if (!webCrypto?.subtle) throw new Error(webCryptoProblem(runtime));
	const digest = await webCrypto.subtle.digest("SHA-256", new TextEncoder().encode(signedQuotePayload(response)));
	return b58encode(new Uint8Array(digest));
}
/** { valid, reason, hash }. Never throws: anything it cannot check is invalid. */
async function checkQuoteSignature(response, managerPublicKey = ONE_CLICK_MANAGER_PUBLIC_KEY, runtime = globalThis) {
	let key;
	const webCrypto = await resolveWebCrypto(runtime);
	const unavailable = webCrypto?.subtle ? null : webCryptoProblem({
		isSecureContext: runtime.isSecureContext,
		crypto: webCrypto
	});
	if (unavailable) return {
		valid: false,
		reason: unavailable,
		hash: null
	};
	try {
		const pub = decodeEd25519(managerPublicKey, 32);
		const sig = decodeEd25519(response?.signature, 64);
		const hash = await quoteHash(response, runtime);
		try {
			key = await webCrypto.subtle.importKey("raw", pub, { name: "Ed25519" }, false, ["verify"]);
		} catch {
			return {
				valid: false,
				reason: "this browser cannot verify Ed25519 signatures; use a current Chrome, Firefox or Safari",
				hash: null
			};
		}
		return await webCrypto.subtle.verify({ name: "Ed25519" }, key, sig, new TextEncoder().encode(hash)) ? {
			valid: true,
			reason: "verified",
			hash
		} : {
			valid: false,
			reason: "signature does not verify under the 1Click manager key",
			hash: null
		};
	} catch (e) {
		return {
			valid: false,
			reason: `unsupported quote format: ${e.message}`,
			hash: null
		};
	}
}
var MANDATE_WINDOW_MS = 864e5;
var MANDATE_MAX_LIST = 16;
var MANDATE_MAX_APPROVERS = 8;
var MANDATE_U128_MAX = (1n << 128n) - 1n;
var MANDATE_MAX_EXPIRY_MS = 0xe677d21fdbff;
var MANDATE_KEYS = [
	"owner",
	"agent",
	"spend",
	"per_payment",
	"per_24h",
	"refund_to",
	"expires"
];
var mandateList = (text) => text.split(",").map((x) => x.trim().replace(/"/g, "")).filter(Boolean);
var fieldName = (f) => f.startsWith("allow_") ? f.replace("_", " ") : f;
/** One `mandate` declaration. Strict: a line it does not know is an error. */
function parseMandate(source) {
	const lines = cleanLines(source);
	if (!lines.length) throw new X3Error("X3_MANDATE_PARSE", "the file is empty");
	const head = /^mandate\s+([A-Za-z_][A-Za-z0-9_-]*)\s*\{$/.exec(lines[0].text);
	if (!head) throw new X3Error("X3_MANDATE_PARSE", "expected `mandate <name> {` as the first line", {
		line: lines[0].no,
		field: "mandate"
	});
	const out = {
		name: head[1],
		requires: [],
		line_of: {}
	};
	let closed = false;
	for (const ln of lines.slice(1)) {
		const t = ln.text;
		if (closed) throw new X3Error("X3_MANDATE_PARSE", `unexpected '${t}' after the mandate's closing brace`, {
			line: ln.no,
			field: "mandate"
		});
		if (t === "}") {
			closed = true;
			continue;
		}
		const words = t.split(/\s+/);
		let field;
		let value;
		if (words[0] === "require") {
			let req;
			try {
				req = parseRequire(ln);
			} catch (e) {
				throw new X3Error("X3_MANDATE_PARSE", e.message, {
					line: ln.no,
					field: "require"
				});
			}
			if (req.kind !== "slippage" && req.kind !== "fees") throw new X3Error("X3_MANDATE_PARSE", `a mandate bounds slippage and fees; \`require ${req.kind}\` belongs in the agent's intent`, {
				line: ln.no,
				field: "require"
			});
			out.requires.push(req);
			continue;
		}
		if (words[0] === "allow" && words.length >= 3 && (words[1] === "recipients" || words[1] === "assets")) {
			field = `allow_${words[1]}`;
			value = mandateList(t.split(/\s+/).slice(2).join(" "));
		} else if (words[0] === "approve") {
			const m = /^approve\s+above\s+(\S+)\s+by\s+(\d+)\s+of\s+(.+)$/.exec(t);
			if (!m) throw new X3Error("X3_MANDATE_PARSE", "expected `approve above <amount> by <n> of <account>, …`", {
				line: ln.no,
				field: "approve"
			});
			field = "approve";
			value = {
				above: m[1],
				threshold: Number(m[2]),
				approvers: mandateList(m[3])
			};
		} else if (MANDATE_KEYS.includes(words[0]) && words.length === 2) {
			field = words[0];
			value = words[1].replace(/"/g, "");
		} else throw new X3Error("X3_MANDATE_PARSE", `'${t}' is not a mandate clause`, {
			line: ln.no,
			field: "mandate"
		});
		if (field in out) throw new X3Error("X3_MANDATE_PARSE", `\`${fieldName(field)}\` appears twice`, {
			line: ln.no,
			field
		});
		out[field] = value;
		out.line_of[field] = ln.no;
	}
	if (!closed) throw new X3Error("X3_MANDATE_PARSE", "the mandate is never closed", {
		line: lines[lines.length - 1].no,
		field: "mandate"
	});
	for (const req of [
		"owner",
		"agent",
		"spend",
		"per_payment",
		"per_24h",
		"allow_recipients",
		"allow_assets",
		"refund_to",
		"expires"
	]) if (!(req in out)) throw new X3Error("X3_MANDATE_PARSE", `a mandate must state \`${fieldName(req)}\``, { field: req });
	return out;
}
function mandateChainAsset(ref, field, line) {
	const m = /^([A-Za-z][A-Za-z0-9_-]*)\.([A-Za-z][A-Za-z0-9_-]*)$/.exec(ref);
	if (!m) throw new X3Error("X3_MANDATE_ASSET", `'${ref}' is not a chain.asset reference`, {
		field,
		line
	});
	const chain = normalizeChain(m[1]);
	if (!CHAIN_TO_BLOCKCHAIN[chain]) throw new X3Error("X3_MANDATE_ASSET", `'${ref}': chain has no NEAR Intents mapping`, {
		field,
		line
	});
	return {
		chain,
		asset: m[2]
	};
}
function mandateAccount(value, field, line) {
	if (!isValidNearAccount(value)) throw new X3Error("X3_MANDATE_ACCOUNT", `'${value}' is not a NEAR account`, {
		field,
		line
	});
	return value;
}
function mandateExpiryRangeError(line) {
	return new X3Error("X3_MANDATE_EXPIRES", "expires must fit a UTC timestamp from 1970-01-01T00:00:00.000Z through 9999-12-31T23:59:59.999Z", {
		field: "expires",
		line
	});
}
function parseExpiryMs(text, line = null) {
	const m = /^(\d+)(ms|s|m|h|d)$/.exec(String(text).trim());
	if (!m || BigInt(m[1]) === 0n) throw new X3Error("X3_MANDATE_EXPIRES", `expires '${text}' must be a positive <n>ms|s|m|h|d duration`, {
		field: "expires",
		line
	});
	const milliseconds = BigInt(m[1]) * {
		ms: 1n,
		s: 1000n,
		m: 60000n,
		h: 3600000n,
		d: 86400000n
	}[m[2]];
	if (milliseconds > BigInt(MANDATE_MAX_EXPIRY_MS)) throw mandateExpiryRangeError(line);
	return Number(milliseconds);
}
var distinct = (xs) => new Set(xs).size === xs.length;
/** The `create_mandate` call: who sends it, and its `agent` and `terms`. */
function lowerMandate(parsed, tokens, nowMs, sourceSha256) {
	const at = parsed.line_of;
	const owner = mandateAccount(parsed.owner, "owner", at.owner);
	const agent = mandateAccount(parsed.agent, "agent", at.agent);
	if (owner === agent) throw new X3Error("X3_MANDATE_ACCOUNT", "the agent must be a different account from the owner", {
		field: "agent",
		line: at.agent
	});
	const spend = mandateChainAsset(parsed.spend, "spend", at.spend);
	const spendId = resolveAsset(tokens, spend.chain, spend.asset).assetId;
	const destinations = parsed.allow_assets.map((r) => mandateChainAsset(r, "allow assets", at.allow_assets));
	const destinationIds = destinations.map((d) => resolveAsset(tokens, d.chain, d.asset).assetId);
	const perPayment = baseUnits(parsed.per_payment, "per_payment");
	const per24h = baseUnits(parsed.per_24h, "per_24h");
	for (const [field, amount] of [["per_payment", perPayment], ["per_24h", per24h]]) if (amount > MANDATE_U128_MAX) throw new X3Error("X3_MANDATE_LIMIT", `${field} must be at most ${MANDATE_U128_MAX} (u128)`, {
		field,
		line: at[field]
	});
	if (perPayment > per24h) throw new X3Error("X3_MANDATE_LIMIT", "per_payment must not exceed per_24h", {
		field: "per_payment",
		line: at.per_payment
	});
	const recipients = parsed.allow_recipients;
	const chains = [...new Set(destinations.map((d) => d.chain))].sort();
	for (const r of recipients) if (r === "sender" || !chains.some((c) => isValidReceiver(c, r))) throw new X3Error("X3_MANDATE_RECIPIENT", `'${r}' is not an address on ${chains.join(", ")}`, {
		field: "allow recipients",
		line: at.allow_recipients
	});
	const refundTo = parsed.refund_to;
	if (refundTo === "sender" || !isValidReceiver(spend.chain, refundTo)) throw new X3Error("X3_MANDATE_REFUND_TO", `'${refundTo}' is not a ${spend.chain} address`, {
		field: "refund_to",
		line: at.refund_to
	});
	for (const [field, items] of [["allow recipients", recipients], ["allow assets", destinationIds]]) if (!items.length || items.length > MANDATE_MAX_LIST || !distinct(items)) throw new X3Error("X3_MANDATE_LIST", `${field} must list 1..${MANDATE_MAX_LIST} distinct entries`, { field });
	const bounds = {};
	for (const kind of ["slippage", "fees"]) {
		const found = parsed.requires.filter((r) => r.kind === kind).map((r) => upperBoundBps(r, `require ${kind}`));
		if (!found.length) throw new X3Error("X3_MANDATE_BOUND", `a mandate must bound \`require ${kind} <= …\`: the agent would otherwise choose it`, { field: "require" });
		bounds[kind] = Math.min(...found);
		if (bounds[kind] > 1e4) throw new X3Error("X3_MANDATE_BOUND", `require ${kind} must bound the compiled value to at most 10000 bps`, { field: `require ${kind}` });
	}
	let approvalAbove = null;
	let approvers = [];
	let threshold = 0;
	if (parsed.approve) {
		const a = parsed.approve;
		approvalAbove = baseUnits(a.above, "approve above");
		approvers = a.approvers.map((x) => mandateAccount(x, "approve", at.approve));
		threshold = a.threshold;
		const bad = (msg) => new X3Error("X3_MANDATE_APPROVAL", msg, {
			field: "approve",
			line: at.approve
		});
		if (approvalAbove >= perPayment) throw bad("`approve above` must be below per_payment, or no payment could need it");
		if (!approvers.length || approvers.length > MANDATE_MAX_APPROVERS || !distinct(approvers)) throw bad(`approvers must be 1..${MANDATE_MAX_APPROVERS} distinct accounts`);
		if (approvers.includes(agent)) throw bad("the agent cannot approve its own payments");
		if (threshold < 1 || threshold > approvers.length) throw bad("the threshold must be 1..the number of approvers");
	}
	if (!Number.isSafeInteger(nowMs)) throw mandateExpiryRangeError(at.expires);
	const expiresAt = nowMs + parseExpiryMs(parsed.expires, at.expires);
	if (!Number.isSafeInteger(expiresAt) || expiresAt < 0 || expiresAt > MANDATE_MAX_EXPIRY_MS) throw mandateExpiryRangeError(at.expires);
	return {
		name: parsed.name,
		owner,
		agent,
		terms: {
			program_sha256: sourceSha256,
			asset: spendId,
			per_payment_cap: perPayment.toString(),
			daily_cap: per24h.toString(),
			destination_assets: destinationIds,
			recipients,
			refund_to: refundTo,
			max_slippage_bps: bounds.slippage,
			max_fee_bps: bounds.fees,
			approval_above: approvalAbove === null ? null : approvalAbove.toString(),
			approvers,
			approval_threshold: threshold,
			expires_at_ms: expiresAt
		},
		expires: formatTimestamp(expiresAt)
	};
}
async function sha256Hex(text, runtime = globalThis) {
	const webCrypto = await resolveWebCrypto(runtime);
	if (!webCrypto?.subtle) throw new Error(webCryptoProblem(runtime));
	const digest = await webCrypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
/** x3-guard's `Policy` for a lowered leg and its quote request. */
function policyFor(leg, request, programSha256) {
	return {
		program_sha256: programSha256,
		origin_asset: request.originAsset,
		destination_asset: request.destinationAsset,
		amount: String(leg.amount),
		min_receive: leg.min_receive == null ? null : String(leg.min_receive),
		slippage_bps: leg.slippage_bps,
		fee_cap_bps: leg.fee_cap_bps,
		recipient: leg.recipient,
		refund_to: leg.refund_to,
		deadline_ms: parseTimestampMs(leg.deadline)
	};
}
function spentInWindow(spends, nowMs) {
	const since = Math.max(nowMs - MANDATE_WINDOW_MS, 0);
	const inside = spends.filter((s) => Number(s.at_ms) > since);
	return [inside.reduce((sum, s) => sum + BigInt(s.amount), 0n), inside.length];
}
/** The contract's `check_mandate`, check for check, in the same order. */
function checkMandate(mandate, policy, nowMs) {
	const t = mandate.terms;
	const out = [];
	const record = (guard, ok, detail) => out.push({
		guard,
		ok: Boolean(ok),
		detail
	});
	const revoked = Boolean(mandate.revoked);
	record("mandate_active", !revoked && nowMs < Number(t.expires_at_ms), `version ${mandate.version ?? "None"}, revoked ${revoked}, expires ${t.expires_at_ms}, now ${nowMs}`);
	record("mandate_asset", policy.origin_asset === t.asset, `spends ${policy.origin_asset}, mandate allows ${t.asset}`);
	record("mandate_destination_asset", t.destination_assets.includes(policy.destination_asset), `${policy.destination_asset}, allowed ${t.destination_assets.join(", ")}`);
	record("mandate_recipient", t.recipients.includes(policy.recipient), `${policy.recipient}, allowed ${t.recipients.join(", ")}`);
	record("mandate_refund_to", policy.refund_to === t.refund_to, `refunds to ${policy.refund_to}, mandate pins ${t.refund_to}`);
	const amount = BigInt(policy.amount);
	record("mandate_per_payment", amount <= BigInt(t.per_payment_cap), `${amount} of at most ${t.per_payment_cap}`);
	const [spent, count] = spentInWindow(mandate.spends ?? [], nowMs);
	record("mandate_daily", spent + amount <= BigInt(t.daily_cap) && count < 64, `${spent} spent in ${count} payments over 24h, plus ${amount}, cap ${t.daily_cap}`);
	record("mandate_slippage", policy.slippage_bps <= t.max_slippage_bps, `${policy.slippage_bps} bps of at most ${t.max_slippage_bps}`);
	record("mandate_fees", policy.fee_cap_bps != null && policy.fee_cap_bps <= t.max_fee_bps, `fee cap ${policy.fee_cap_bps} bps, mandate requires at most ${t.max_fee_bps}`);
	record("mandate_deadline", policy.deadline_ms <= Number(t.expires_at_ms), `intent deadline ${policy.deadline_ms}, mandate expires ${t.expires_at_ms}`);
	return out;
}
function approvalsNeeded(mandate, amount) {
	const above = mandate.terms.approval_above;
	return above != null && BigInt(amount) > BigInt(above) ? mandate.terms.approval_threshold : 0;
}
/** What each decision is allowed to claim. Nothing here authorizes, signs or settles. */
var EVIDENCE_LADDER = [
	{
		level: "local_policy",
		label: "Locally valid policy",
		proven: true,
		how: "The mandate and the payment compile, and the shared checker decides them. Python and this page agree."
	},
	{
		level: "approved_request",
		label: "Approved request",
		proven: false,
		how: "x3-guard records approvals on NEAR (approve_intent). No approval has been recorded for these scenarios."
	},
	{
		level: "onchain_authorization",
		label: "On-chain authorization",
		proven: false,
		how: "x3-guard's agent_register_intent and agent_accept_quote on a deployed contract. Not deployed for this console."
	},
	{
		level: "wallet_transfer",
		label: "Wallet-controlled transfer",
		proven: false,
		how: "x3-guard does not custody funds. A keyholder can still transfer directly; only a wallet that calls the Guard is bound by it."
	},
	{
		level: "signed_quote",
		label: "Signed quote",
		proven: false,
		how: "The X3 Guard page verifies real 1Click dry quotes in the browser. This console asks 1Click for nothing."
	},
	{
		level: "observed_transaction",
		label: "Observed transaction",
		proven: false,
		how: "No deposit or delivery transaction exists for these scenarios."
	},
	{
		level: "finalized_settlement",
		label: "Finalized settlement",
		proven: false,
		how: "No settlement has been observed."
	},
	{
		level: "proven_causality",
		label: "Proven cross-chain causality",
		proven: false,
		how: "Not claimed. Separate source and destination transactions would not prove that one caused the other."
	}
];
var DECISIONS = {
	preflight_passed: {
		tone: "pass",
		label: "Passes the local policy check",
		detail: "Every term of the mandate holds. On NEAR the agent could register it; the deposit still needs a wallet signature."
	},
	approval_required: {
		tone: "note",
		label: "Needs approval",
		detail: "Every term holds, but the amount is over the approval threshold. x3-guard waits for the listed approvers."
	},
	denied_by_policy: {
		tone: "fail",
		label: "Refused",
		detail: "A term of the owner's mandate does not hold. Nothing is quoted, registered or sent."
	},
	contract_only: {
		tone: "seal",
		label: "Decided by the contract",
		detail: "The local checker cannot see this. x3-guard refuses it on NEAR; the cited contract tests show how."
	}
};
/** Evaluate one scenario from scenarios.json. Throws an X3Error for a program that won't compile. */
async function evaluate(data, scenario) {
	const nowMs = Date.parse(data.evaluated_at);
	const tokens = data.tokens.records;
	const parsedMandate = parseMandate(data.mandate.source);
	const mandate = lowerMandate(parsedMandate, tokens, nowMs, await sha256Hex(data.mandate.source));
	const intent = parse(scenario.intent.source);
	const errors = typecheck(intent);
	if (errors.length) throw new X3Error(errors[0].code, errors[0].message, { line: errors[0].line });
	const leg = lower(intent, nowMs);
	const base = {
		intent,
		parsedMandate,
		mandate,
		leg,
		checks: [],
		denied_guards: [],
		approvals_needed: 0
	};
	if (leg.mandate_owner !== mandate.owner) return {
		...base,
		decision: "denied_by_policy",
		denied_guards: ["mandate_owner"]
	};
	const request = buildQuoteRequest(leg, tokens, { dry: true });
	const policy = policyFor(leg, request, await sha256Hex(scenario.intent.source));
	const state = {
		revoked: false,
		spends: [],
		...scenario.assumed_guard_state ?? {}
	};
	const preview = {
		...mandate,
		version: null,
		...state
	};
	const checks = checkMandate(preview, policy, nowMs);
	const denied = checks.filter((c) => !c.ok).map((c) => c.guard);
	const approvals = approvalsNeeded(preview, policy.amount);
	const decision = denied.length ? "denied_by_policy" : approvals ? "approval_required" : "preflight_passed";
	return {
		...base,
		request,
		policy,
		state,
		checks,
		denied_guards: denied,
		approvals_needed: approvals,
		decision
	};
}
/** True when the browser and Python reached the same decision through the same guards. */
function agrees(scenario, result) {
	const py = scenario.python;
	return py.decision === result.decision && py.approvals_needed === result.approvals_needed && JSON.stringify(py.denied_guards) === JSON.stringify(result.denied_guards) && JSON.stringify(py.checks) === JSON.stringify(result.checks.map((c) => ({
		guard: c.guard,
		ok: c.ok
	})));
}
//#endregion
export { ONE_CLICK_MANAGER_PUBLIC_KEY as a, X3Error as c, checkQuoteSignature as d, displayDecision as f, EVIDENCE_LADDER as i, agrees as l, sha256Hex as m, DATA as n, PRESETS as o, evaluate as p, DECISIONS as r, QUOTES as s, ATTACKS as t, applyAttack as u };
