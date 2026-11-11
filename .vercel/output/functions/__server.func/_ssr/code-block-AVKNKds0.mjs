import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/code-block-AVKNKds0.js
var import_jsx_runtime = require_jsx_runtime();
function CodeBlock({ title, code }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-lg text-fg",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "mt-3 overflow-x-auto rounded-xl border border-border bg-bg p-4 text-sm text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code })
		})]
	});
}
function OutLink({ href, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: "text-primary underline underline-offset-4",
		href,
		target: "_blank",
		rel: "noreferrer",
		children
	});
}
function Tag({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase",
		children
	});
}
//#endregion
export { OutLink as n, Tag as r, CodeBlock as t };
