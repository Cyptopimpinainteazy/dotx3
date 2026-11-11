import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RouteTicker, n as Card, o as Section, r as CardGrid, s as SiteShell, t as ActionLink } from "./site-shell-DW70_4Ol.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/defi-Dtu583Az.js
var import_jsx_runtime = require_jsx_runtime();
function DefiPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: "Track 01",
		title: "Unstoppable DeFi",
		lede: "The published route is one .x3 program: 1 test USDC from Base Sepolia to NEAR testnet. It is not an official 1Click mainnet settlement.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteTicker, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Hackathon mainnet trade",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardGrid, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "What finalized",
					children: "1.000000 test USDC left Base Sepolia. 0.997400 arrived on NEAR testnet. The relay was trusted. That is not atomic settlement."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Reusable examples",
					children: "Quote, deposit, status. The calls are on the code page. Dry first. A live quote can spend real funds."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Official 1Click",
					children: "Signature checks ran on testnet. The live quote that matched policy stopped before a deposit. No funded official settlement is claimed."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
					to: "/proof",
					children: "Inspect the Proof"
				})
			})]
		})]
	});
}
//#endregion
export { DefiPage as component };
