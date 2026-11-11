import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as SiteShell } from "./site-shell-BE2QkAeR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dex-BOwuDXy1.js
var import_jsx_runtime = require_jsx_runtime();
function DexPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		eyebrow: "X3 DEX",
		title: "Your trading workspace",
		lede: "Market charts, Arbitrage Radar, and the testnet transaction lab. Swap execution remains disabled until the route, policy, and settlement integrations are verified.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-screen-2xl p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/dex-terminal/index.html",
				className: "tap text-primary",
				children: "Open full-screen terminal ↗"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: "X3 DEX trading terminal",
				src: "/dex-terminal/index.html",
				className: "mt-3 w-full rounded-xl border border-border",
				style: {
					height: "85vh",
					minHeight: 640
				}
			})]
		})
	});
}
//#endregion
export { DexPage as component };
