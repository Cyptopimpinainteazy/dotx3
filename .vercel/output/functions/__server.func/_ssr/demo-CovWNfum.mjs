import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Section, s as SiteShell } from "./site-shell-0774LnZF.mjs";
import { n as OutLink, r as Tag, t as CodeBlock } from "./code-block-AVKNKds0.mjs";
import { n as MANDATE, t as LINKS } from "./front-door-CDmHt-Gp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-CovWNfum.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RULES = [
	"Owner x3-owner.near. Agent x3-agent.near.",
	"Spend Solana.USDC. At most 50 USDC a payment, 200 USDC in 24 hours.",
	"Only recipient x3-demo.near. Only destination asset Near.USDC.",
	"Slippage at most 1%. Fees at most 100 bps.",
	"Anything above 30 USDC needs the owner. Mandate expires in 30 days."
];
function DemoPage() {
	const [attempt, setAttempt] = (0, import_react.useState)(null);
	const accepted = attempt === "pay";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: "Try the Demo",
		title: "Accepted payment. Rejected attack.",
		lede: "The rules stay on screen. Pick a payment. The verdict is the same one the published checks already returned. This page does not send a transaction.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "The owner's .x3 rules",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mx-auto grid max-w-3xl gap-3",
					children: RULES.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl border border-border bg-surface px-4 py-3 text-muted",
						children: rule
					}, rule))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
					title: "near_mandate_agent.x3",
					code: MANDATE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted",
					children: ["Source file: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
						href: LINKS.mandate,
						children: "near_mandate_agent.x3"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Run one payment",
			alt: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap min-h-11 flex-1 rounded-full bg-primary px-5 text-sm font-semibold text-bg",
					onClick: () => setAttempt("pay"),
					children: "Pay x3-demo.near 25 USDC"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap min-h-11 flex-1 rounded-full bg-accent px-5 text-sm font-semibold text-bg",
					onClick: () => setAttempt("attack"),
					children: "Pay attacker.near 25 USDC"
				})]
			}), attempt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: `mx-auto mt-8 max-w-3xl rounded-xl border p-6 ${accepted ? "border-primary bg-surface" : "border-accent bg-surface"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: accepted ? "Accepted" : "Refused" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-2xl text-fg",
						children: accepted ? "preflight_passed" : "denied_by_policy"
					}),
					accepted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3 text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Local check on the example mandate: recipient, asset, caps, slippage, and fees all pass. The README records this next to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "authorized: decision=preflight_passed"
							}),
							"."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"On NEAR testnet the matching allowed control registered an intent to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "x3lang.testnet"
							}),
							", not this example address. That is a different account pair. Transaction",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: LINKS.acceptTx,
								children: "DPJfcRUGk56h8sSsFsDFFgUMQAiyBCtpMuvquF9FvTct"
							}),
							"."
						] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3 text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Failed guard: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "mandate_recipient"
								}),
								". Detail from the local check: attacker.near, allowed ['x3-demo.near']. The other guards on that payment pass. Exit code 6."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"On NEAR testnet, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "agent_register_intent"
								}),
								" to attacker.near failed the same guard. Allowed list on that live mandate was [\"x3lang.testnet\"]. Nothing was stored. Transaction",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
									href: LINKS.refuseTx,
									children: "AhVBD7oXfwsixBipupjCzuhNdqunjdXJnLz3LXnmfnN8"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Program: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: LINKS.denied,
								children: "near_intents_agent_denied.x3"
							})] })
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-8 max-w-3xl text-center text-muted",
				children: "Neither button calls Guard. They replay the published local decision and point at the testnet receipts."
			})]
		})]
	});
}
//#endregion
export { DemoPage as component };
