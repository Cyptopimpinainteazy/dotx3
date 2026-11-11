import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ProofFlow, n as Card, o as Section, r as CardGrid, s as SiteShell } from "./site-shell-DW70_4Ol.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proofs-BhHrbQ2X.js
var import_jsx_runtime = require_jsx_runtime();
function ProofsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: "Track 03",
		title: "Code the proof. Code the decision.",
		lede: "Formal verification becomes the executable path. Early holders of the hackathon allocation get seats in x3 langs governance.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "From invariant to execution",
			intro: "Each step only fires if the one before it still holds.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofFlow, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Proof layer and future seats",
			alt: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardGrid, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "ProofGate",
					children: "Write the invariant once. The system derives the safe execution path across VMs. Specification and deployment do not drift."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "x3 langs gov",
					children: "The hackathon .x3 allocation is priority seating for future language and protocol governance. The mainnet trade is the entry ticket."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Contracts and agents",
					children: "Both are bound by the same proof. The decision you code is the only decision that executes."
				})
			] })
		})]
	});
}
//#endregion
export { ProofsPage as component };
