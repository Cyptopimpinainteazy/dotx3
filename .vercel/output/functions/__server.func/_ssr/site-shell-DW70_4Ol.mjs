import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Menu, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-DW70_4Ol.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NODES = [
	[80, 70],
	[220, 150],
	[400, 80],
	[560, 180],
	[720, 90],
	[140, 280],
	[320, 320],
	[500, 260],
	[680, 330],
	[400, 200]
];
var LINES = [
	"M80 70 L220 150 L400 200 L560 180 L720 90",
	"M140 280 L320 320 L500 260 L680 330",
	"M220 150 L140 280",
	"M400 80 L400 200 L320 320",
	"M560 180 L500 260"
];
function Circuit({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 800 400",
		preserveAspectRatio: "xMidYMid slice",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
			className: "circuit-lines",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.25",
			children: LINES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d }, d))
		}), NODES.map(([cx, cy], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			className: "circuit-node",
			cx,
			cy,
			r: i % 3 === 0 ? 4 : 2.5,
			style: { animationDelay: `${i * 180}ms` }
		}, `${cx}-${cy}`))]
	});
}
var STEPS = [
	{
		label: "Proof",
		detail: "Invariant"
	},
	{
		label: "Decision",
		detail: "Executable path"
	},
	{
		label: "Agents",
		detail: "Bounded action"
	},
	{
		label: "Settle",
		detail: "1Click route"
	}
];
function ProofFlow({ steps = STEPS }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid gap-4 md:grid-cols-4",
		children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flow-step relative rounded-xl border border-border bg-bg p-5",
			style: { animationDelay: `${i * 120}ms` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-display text-xs tracking-widest text-primary",
					children: ["0", i + 1]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-xl text-fg",
					children: step.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: step.detail
				}),
				i < steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flow-link",
					"aria-hidden": "true"
				}) : null
			]
		}, step.label))
	});
}
var CHAINS = [
	"NEAR",
	"ETH",
	"SOL",
	"ARB",
	"BTC",
	"BASE",
	"USDC",
	"X3VM"
];
function RouteTicker() {
	const row = [...CHAINS, ...CHAINS];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ticker border-y border-border bg-surface",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ticker-track",
			children: row.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-display text-sm tracking-widest text-muted",
				children: [name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-4 text-accent",
					children: "·"
				})]
			}, `${name}-${i}`))
		})
	});
}
var LINKS = [
	{
		to: "/demo",
		label: "Try the Demo"
	},
	{
		to: "/docs",
		label: "Learn .x3"
	},
	{
		to: "/developers",
		label: "View the Code"
	},
	{
		to: "/proof",
		label: "Inspect the Proof"
	},
	{
		to: "/playground",
		label: "Playground"
	},
	{
		to: "/language",
		label: "Language"
	},
	{
		to: "/back",
		label: "Back .x3"
	}
];
function isActive(path, to) {
	if (to === "/") return path === "/";
	return path === to || path.startsWith(`${to}/`);
}
function SiteShell({ children, eyebrow, title, lede, media, actions }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "font-display text-2xl tracking-wide text-primary",
							children: [".X", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent",
								children: "3"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center rounded-lg border border-border text-fg md:hidden",
							"aria-expanded": open,
							"aria-label": open ? "Close menu" : "Open menu",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: `${open ? "flex" : "hidden"} absolute top-full right-5 left-5 mt-2 flex-col gap-1 rounded-xl border border-border bg-surface p-2 md:static md:mt-0 md:flex md:flex-row md:flex-wrap md:justify-end md:gap-1 md:border-0 md:bg-transparent md:p-0`,
							children: LINKS.map((link) => {
								const active = isActive(path, link.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: link.to,
									onClick: () => setOpen(false),
									className: `tap block rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-surface-2 text-primary md:bg-transparent" : "text-muted hover:text-fg"}`,
									children: link.label
								}) }, link.to);
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hero-wash relative overflow-hidden border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circuit, { className: "pointer-events-none absolute inset-0 h-full w-full text-primary opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center md:py-24",
					children: [
						eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rise rise-1 font-display text-xs tracking-widest text-accent uppercase",
							children: eyebrow
						}) : null,
						media ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mark-float rise rise-2 w-full max-w-3xl",
							children: media
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "rise rise-3 font-display text-4xl leading-tight text-fg md:text-6xl",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rise rise-4 max-w-2xl text-lg text-muted",
							children: lede
						}),
						actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rise rise-4 flex flex-wrap justify-center gap-3",
							children: actions
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-5 py-10 text-center text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "dotx3.net — public front door for .x3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Testnet and local evidence. Not an offer of securities. Not a mainnet settlement."
					})]
				})
			})
		]
	});
}
function CardGrid({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-5 md:grid-cols-3",
		children
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card-lift rounded-xl border border-border bg-surface p-6 hover:border-primary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-xl text-accent",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-muted",
			children
		})]
	});
}
function Section({ title, intro, children, alt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: alt ? "bg-surface" : "bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-center font-display text-3xl text-primary md:text-4xl",
					children: title
				}),
				intro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-2xl text-center text-muted",
					children: intro
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children
				})
			]
		})
	});
}
function ActionLink({ to, children, outline }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: `tap inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold ${outline ? "border border-primary text-primary hover:bg-primary/10" : "bg-primary text-bg hover:brightness-110"}`,
		children
	});
}
//#endregion
export { RouteTicker as a, ProofFlow as i, Card as n, Section as o, CardGrid as r, SiteShell as s, ActionLink as t };
