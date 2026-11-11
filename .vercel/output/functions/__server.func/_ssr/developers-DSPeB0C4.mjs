import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Section, s as SiteShell } from "./site-shell-DW70_4Ol.mjs";
import { n as OutLink, r as Tag, t as CodeBlock } from "./code-block-AVKNKds0.mjs";
import { o as SITE, t as LINKS } from "./front-door-Q62Z724k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developers-DSPeB0C4.js
var import_jsx_runtime = require_jsx_runtime();
function DevelopersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: "View the Code",
		title: "Source, install, and what is not a release yet.",
		lede: "The public repository is X3Lang. GitHub showed no releases when this page was written. Clone the commit. Do not treat a branch tip as a signed download.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Repository",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.repo,
							children: "X3Lang / X3 Shield source"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.readme,
							children: "README and getting started"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.actions,
							children: "CI results"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.issues,
							children: "Bugs and feature requests"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.pulls,
							children: "Pull requests"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.license,
							children: "MIT license"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.contributing,
							children: "Contributing"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
							href: LINKS.baseline,
							children: "Hackathon diff, baseline...master"
						}) })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Not found" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 block",
						children: "Public repos named xxxstar and x3dex were not on this GitHub account when checked. They are not linked from here until a real URL exists. X3 chain source stays unlabeled rather than pointed at a 404."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Install from source",
				alt: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Python intent tools",
						code: `git clone https://github.com/Cyptopimpinainteazy/x3lang.git
cd x3lang
python3 -m venv .venv && . .venv/bin/activate
pip install -r x3-lang/requirements.txt pytest
python3 x3-lang/cli.py x3-lang/examples/arb_solana_eth.x3`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Rust surface, workspace only",
						code: `cargo test --manifest-path x3-lang/Cargo.toml
cargo run --manifest-path x3-lang/Cargo.toml -p x3-tools --bin x3c -- parse x3-lang/examples/trading_core_v1.x3`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"Releases page: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: `${LINKS.repo}/releases`,
								children: "github.com/Cyptopimpinainteazy/x3lang/releases"
							}),
							". Empty at last check. No checksum, no provenance file, no download."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "1Click integration",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: [
							"Same four calls a person or an agent uses. Docs: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
								href: LINKS.intentsDocs,
								children: "NEAR Intents 1Click quickstart"
							}),
							". The adapter verifies the quote signature before it reads terms. A live quote can spend real funds. 1Click has no testnet in the adapter notes."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Tokens",
						code: "curl https://1click.chaindefuser.com/v0/tokens"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Dry quote",
						code: `curl -X POST https://1click.chaindefuser.com/v0/quote \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT" \\
  -d '{
    "dry": true,
    "swapType": "EXACT_INPUT",
    "slippageTolerance": 100,
    "originAsset": "nep141:wrap.near",
    "depositType": "ORIGIN_CHAIN",
    "destinationAsset": "nep141:arb-0x912ce59144191c1204e64559fe8253a0e49e6548.omft.near",
    "amount": "1000000000000000000000000",
    "recipient": "0xYourAddress",
    "recipientType": "DESTINATION_CHAIN",
    "refundTo": "your.near",
    "refundType": "ORIGIN_CHAIN"
  }'`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
						title: "Status",
						code: "curl \"https://1click.chaindefuser.com/v0/status?depositAddress=THE_DEPOSIT_ADDRESS\""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"Repo commands, not this website: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "python3 x3-lang/near_intents.py quote FILE.x3"
							}),
							" for a dry quote. ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "--live"
							}),
							" asks for a deposit address. The tool does not sign the deposit."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Doors that are not up yet",
				alt: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: [SITE, " ships the four working doors (demo, docs, code, proof) plus /playground, /language and /back. These proposed routes are named so they are not pretended:"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 grid gap-2 text-sm text-muted md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "/about — the language overview is /language" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "/shield — mandate and Guard limits are on the demo and proof pages" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "/hackathon — one demo covers security, agents, and DeFi" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "/security — reporting steps are in the repo SECURITY.md" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "/ecosystem — x3star.net names are not verified live apps" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Missing" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "Demo video permalink. Public X demo-post permalink. Judge runbook tied to one current commit, beyond the README steps. Release artifact with checksum. Privacy and terms, because this site does not collect accounts or connect a wallet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									"Community, unverified as to whether each post is current: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.x,
										children: "@x3starchain"
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.telegram,
										children: "t.me/x3starchain"
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.hackathon,
										children: "nearhackathon.com"
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.nearDocs,
										children: "docs.near.org"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									"A static browser demo is published separately at ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.browserDemo,
										children: "x3-guard.pages.dev"
									}),
									". The hackathon still needs its own demo-post URL. This site does not replace that post."
								]
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { DevelopersPage as component };
