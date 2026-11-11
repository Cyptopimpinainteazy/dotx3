import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Card, o as Section, r as CardGrid, s as SiteShell } from "./site-shell-BE2QkAeR.mjs";
import { n as OutLink, r as Tag, t as CodeBlock } from "./code-block-AVKNKds0.mjs";
import { c as TRADE, n as MANDATE, t as LINKS } from "./front-door-Q62Z724k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-CmHpxjGP.js
var import_jsx_runtime = require_jsx_runtime();
function DocsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: "Learn .x3",
		title: "Write the rule. The agent does not get to waive it.",
		lede: "X3 is the owner's typed policy and the agent's payment program. A deterministic compiler and x3-guard on NEAR compare them. Model output never authorizes a deposit.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl px-5 pt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/bootcamp",
					className: "tap inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-primary",
					children: "Enter Bootcamp — the in-depth .x3 developer course →"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Quickstart",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: [
							"From the repository root. Steps 1 to 8 in the README are offline after install: no wallet, no API key, nothing signed. The README records that walkthrough at commit ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "c5a4e39"
							}),
							". Confirm the current tip before you quote a pass count."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Install",
						code: `python3 -m venv .venv && . .venv/bin/activate
pip install -r x3-lang/requirements.txt pytest`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Hash the trade program, then run the suite",
						code: `sha256sum x3-lang/examples/base_sepolia_to_near_testnet_1usdc.x3
python3 x3-lang/cli.py x3-lang/examples/arb_solana_eth.x3
PYTHONPATH=x3-lang python3 -m pytest x3-lang/tests -q`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"At the recorded commit the suite printed ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "594 passed, 1 skipped"
							}),
							". Rust contract tests are separate: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "cd x3-lang/near/x3-guard && cargo test --locked"
							}),
							", recorded as 62 passed."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Syntax",
				alt: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Owner mandate",
						code: MANDATE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "The program behind the testnet trade",
						code: TRADE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: LINKS.mandate,
								children: "Mandate file"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: LINKS.trade,
								children: "Trade file"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: LINKS.examples,
								children: "All examples"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Compiler and execution",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardGrid, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "What compiles today",
						children: "The Python frontend parses, type-checks, and checks mandates. Unsafe edits fail before a quote. Nine checked-in edits are refused at compile time, including a dropped nonce and a look-alike recipient."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "What runs on NEAR",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "x3-guard"
						}), " stores the policy and rechecks quote terms. It holds no funds. Acceptance is not permission to send from an origin wallet."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "What does not run on a block",
						children: "The x3-lang intent VM executes in this workspace only. The README says it is not loaded by a pallet. Do not describe a local simulate as chain execution."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-8 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Limit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-3 block",
						children: [
							"There is no downloadable GitHub release. Installation is from source. Programming notes live in the repo under docs/x3-lang. Judge steps: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: LINKS.hackathonDocs,
								children: "docs/hackathon"
							}),
							"."
						]
					})]
				})]
			})
		]
	});
}
//#endregion
export { DocsPage as component };
