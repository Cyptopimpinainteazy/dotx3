import { S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Section, s as SiteShell } from "./site-shell-CfdjH0S3.mjs";
import { n as OutLink, r as Tag } from "./code-block-AVKNKds0.mjs";
import { a as RHEA_APP, r as NEAR_WALLETS, s as TOKEN, t as LINKS } from "./front-door-Q62Z724k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/back-DthOluK-.js
var import_jsx_runtime = require_jsx_runtime();
function StatusRow({ label, status, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold text-fg",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-sm text-muted sm:text-right",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: status === "live" ? "text-primary" : "text-accent",
					children: status === "live" ? "Live" : "Not live"
				}),
				" ",
				"· ",
				detail
			]
		})]
	});
}
function Step({ n, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-4 rounded-xl border border-border bg-bg p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-9 shrink-0 place-items-center rounded-full border border-primary font-display text-primary",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-lg text-fg",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 text-sm text-muted",
			children
		})] })]
	});
}
var MILESTONES = [
	{
		title: "Scoped agent vault on testnet",
		proof: "One allowed payment, plus recorded refusals for over-cap, wrong recipient, 24-hour window and redirected refund."
	},
	{
		title: "One mainnet 1Click swap through Guard",
		proof: "The signed quote, the Guard authorization, the deposit, and the delivery, each with a finalized transaction hash."
	},
	{
		title: "Hostile model refused on mainnet",
		proof: "A red-team model's payments go through the same restricted key, and each refusal is on chain with an attack label."
	},
	{
		title: "Guard checks the program hash",
		proof: "An approved mandate carries only the exact .x3 program the owner saw. Contract tests cover a mismatched hash."
	},
	{
		title: "Independent security review",
		proof: "A published report on Guard and the vault, with every finding and its fix."
	},
	{
		title: "Tagged release",
		proof: "A GitHub release with a checksum and build provenance, so nobody has to trust a branch tip."
	}
];
function BackPage() {
	const tokenLive = TOKEN.contract !== null;
	const poolLive = tokenLive && TOKEN.rheaPoolId !== null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: "Back .x3",
		title: "Provide liquidity, invest, or build with us.",
		lede: "Three ways in. This page doesn't take money, connect a wallet or show a raise total. It says what is live, what isn't yet, and where your next step is.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "What is live today",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mx-auto grid max-w-3xl gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
							label: "Guard contract, NEAR testnet",
							status: "live",
							detail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/proof",
								className: "text-primary underline underline-offset-4",
								children: "refusal and acceptance on chain"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
							label: "Two-chain testnet trade",
							status: "live",
							detail: "1 test USDC, Base Sepolia to NEAR testnet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
							label: "Browser checker",
							status: "live",
							detail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/playground",
								className: "text-primary underline underline-offset-4",
								children: "try the attacks"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
							label: `${TOKEN.symbol} token (${TOKEN.standard})`,
							status: tokenLive ? "live" : "pending",
							detail: tokenLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono break-all",
								children: TOKEN.contract
							}) : "no contract deployed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
							label: `${TOKEN.symbol} / wNEAR pool on Rhea`,
							status: poolLive ? "live" : "pending",
							detail: poolLive ? `pool #${TOKEN.rheaPoolId}` : "no pool created"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
							label: "Funded mainnet settlement",
							status: "pending",
							detail: "none published"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Liquidity providers",
				intro: poolLive ? "The pool is live. Five steps from no wallet to an LP position." : "There's no pool yet. These are the steps for when there is, so you can get set up now. Steps 4 and 5 open once the token and pool are deployed.",
				alt: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mx-auto grid max-w-3xl gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
							n: 1,
							title: "Get a NEAR wallet",
							children: [
								"Pick one from NEAR's wallet directory:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
									href: NEAR_WALLETS,
									children: "wallet.near.org"
								}),
								". If you'll hold a large balance, use one that can sign with a hardware wallet. Write down the recovery phrase offline."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 2,
							title: "Fund it with NEAR",
							children: "You need NEAR for gas and for your side of the pool. A few tenths of a NEAR covers registration and storage deposits."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 3,
							title: "Wrap NEAR into wNEAR",
							children: "Native NEAR isn't a token contract, so pools pair against wNEAR, its NEP-141 form. Wrap what you plan to deposit and keep some plain NEAR for gas."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 4,
							title: `Find the ${TOKEN.symbol} pool on Rhea`,
							children: poolLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Open ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
									href: RHEA_APP,
									children: "app.rhea.finance"
								}),
								" and go to pool",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-fg",
									children: ["#", TOKEN.rheaPoolId]
								}),
								". Check that the token contract is ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono break-all text-fg",
									children: TOKEN.contract
								}),
								". Look-alike tokens with the same symbol exist on every chain."
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Not live" }),
								" The pool ID and token contract will be posted here and on",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
									href: LINKS.x,
									children: "@x3starchain"
								}),
								" at the same moment. Don't use a pool ID or contract you got from anywhere else."
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 5,
							title: "Add liquidity, small first",
							children: "Deposit both sides at the pool's current ratio. Start with an amount you're fine losing, and withdraw once to confirm you can."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-6 max-w-3xl rounded-xl border border-accent bg-bg p-5 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-fg",
						children: "Risks, in plain words"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 list-disc space-y-1 pl-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Impermanent loss: if the price moves, you can end up with less value than if you had just held both tokens." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A new, thin pool can move a lot on small trades, in both directions." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Smart-contract risk in the DEX and in the token contract. Neither has been reviewed by us." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Nobody here promises fees, rewards or returns. Nothing on this site is investment advice." })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Investors",
				intro: "No raise is open on this site, and it never takes funds. If you'd back the team, start a conversation and check the work first.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-4xl gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-surface p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl text-accent",
							children: "Check before you call"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/proof",
									className: "text-primary underline underline-offset-4",
									children: "Proof"
								}), ": every testnet claim with its transaction."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.repo,
										children: "Source"
									}),
									" and",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.actions,
										children: "CI runs"
									}),
									", public, MIT licensed."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/language",
									className: "text-primary underline underline-offset-4",
									children: "Language"
								}), ": what X3 covers beyond the hackathon, and what's next."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/playground",
									className: "text-primary underline underline-offset-4",
									children: "Playground"
								}), ": try to break a mandate yourself."] })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl text-accent",
								children: "Start the conversation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-muted",
								children: [
									"Message ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.x,
										children: "@x3starchain on X"
									}),
									" or",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.telegram,
										children: "t.me/x3starchain"
									}),
									". Say who you are and what you'd want to see. Real terms come only from a direct conversation, never from a link someone sends you."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "Nothing here is an offer to sell securities or tokens. Anyone asking you to send funds to an address \"for the .x3 raise\" is not us."
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Milestones backers can watch",
				intro: "Each one counts only when its proof is posted. Until then it's pending, and this list says so.",
				alt: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mx-auto grid max-w-4xl gap-3 md:grid-cols-2",
					children: MILESTONES.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-bg p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-lg text-fg",
								children: [
									i + 1,
									". ",
									m.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Pending" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: m.proof
						})]
					}, m.title))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Builders, grants and partners",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-4xl gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl border border-border bg-surface p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg text-accent",
								children: "Contribute"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [
									"Read ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.contributing,
										children: "CONTRIBUTING"
									}),
									", then pick an",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.issues,
										children: "issue"
									}),
									". Report vulnerabilities privately through",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.security,
										children: "SECURITY.md"
									}),
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl border border-border bg-surface p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg text-accent",
								children: "Integrate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [
									"Building an agent, a wallet or a payments app? A mandate puts your user's limits in a program that compiles, and Guard enforces them on NEAR. Talk to us on",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: LINKS.telegram,
										children: "Telegram"
									}),
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl border border-border bg-surface p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg text-accent",
								children: "Fund the public good"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "The checker and the language are open source. Grant programs and ecosystem funds can reach us the same way, and every milestone above has a proof you can check."
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { BackPage as component };
