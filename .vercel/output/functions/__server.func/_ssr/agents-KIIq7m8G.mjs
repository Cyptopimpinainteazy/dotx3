import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Card, o as Section, r as CardGrid, s as SiteShell } from "./site-shell-BE2QkAeR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-KIIq7m8G.js
var import_jsx_runtime = require_jsx_runtime();
function AgentsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		eyebrow: "Track 02",
		title: "Control agents",
		lede: "Agents operate inside the proof bounds you define. They execute intents and coordinate — never outside the decision you coded.",
		media: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/media/agents.jpg",
			alt: "Agents coordinating around a smart contract",
			className: "scan w-full max-w-3xl rounded-xl border border-border"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Agents under proof",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardGrid, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Intent execution",
					children: "An agent requests a quote and submits a deposit through 1Click. The route must satisfy the formal invariant or it does not fire."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Swarm coordination",
					children: "Multiple agents bid, pool, and settle through NEAR Intents. The swarm still resolves to one coded decision."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Treasury limits",
					children: "Agents can spend, only inside pre-verified bounds. Limits, reputation, and settlement share the same verification layer."
				})
			] })
		})
	});
}
//#endregion
export { AgentsPage as component };
