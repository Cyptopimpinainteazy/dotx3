import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Section, s as SiteShell } from "./site-shell-BE2QkAeR.mjs";
import { n as OutLink, r as Tag } from "./code-block-AVKNKds0.mjs";
import { t as LINKS } from "./front-door-Q62Z724k.mjs";
import { a as ONE_CLICK_MANAGER_PUBLIC_KEY, c as X3Error, d as checkQuoteSignature, f as displayDecision, i as EVIDENCE_LADDER, l as agrees, m as sha256Hex, n as DATA, o as PRESETS, p as evaluate, r as DECISIONS, s as QUOTES, t as ATTACKS, u as applyAttack } from "./judge-D5iAN8iP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playground-DDrmbeFe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VENDOR_COMMIT = "470d61a3b77689bb5e0c7e36fc7814d28e761dad";
var VENDOR_URL = `${LINKS.repo}/blob/${VENDOR_COMMIT}/x3-lang/near/demo/x3guard.mjs`;
function errorOf(e) {
	if (e instanceof X3Error) return {
		code: e.code,
		message: e.message,
		line: e.line
	};
	return {
		code: "X3_INTERNAL",
		message: e instanceof Error ? e.message : String(e),
		line: null
	};
}
function PlaygroundPage() {
	const [presetId, setPresetId] = (0, import_react.useState)(PRESETS[0].id);
	const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
	const [intent, setIntent] = (0, import_react.useState)(preset.intent);
	const [mandate, setMandate] = (0, import_react.useState)(DATA.mandate.source);
	const [attackId, setAttackId] = (0, import_react.useState)(null);
	const [outcome, setOutcome] = (0, import_react.useState)({ kind: "idle" });
	const verdictRef = (0, import_react.useRef)(null);
	const showVerdict = () => window.setTimeout(() => verdictRef.current?.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}), 50);
	const edited = intent !== preset.intent || mandate !== DATA.mandate.source;
	function choosePreset(id) {
		const next = PRESETS.find((p) => p.id === id);
		if (!next) return;
		setPresetId(id);
		setIntent(next.intent);
		setMandate(DATA.mandate.source);
		setAttackId(null);
		showVerdict();
	}
	function launch(attack) {
		const base = PRESETS.find((p) => p.id === "authorized");
		if (!base) return;
		setPresetId(base.id);
		setMandate(DATA.mandate.source);
		setIntent(applyAttack(base.intent, attack));
		setAttackId(attack.id);
		showVerdict();
	}
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const timer = window.setTimeout(async () => {
			const data = {
				...DATA,
				mandate: {
					...DATA.mandate,
					source: mandate
				}
			};
			const scenario = {
				intent: {
					...preset.scenario.intent,
					source: intent
				},
				assumed_guard_state: preset.scenario.assumed_guard_state
			};
			try {
				const result = await evaluate(data, scenario);
				const [intentSha, mandateSha] = await Promise.all([sha256Hex(intent), sha256Hex(mandate)]);
				if (cancelled) return;
				const pristine = intent === preset.intent && mandate === DATA.mandate.source;
				setOutcome({
					kind: "evaluated",
					shown: displayDecision(pristine, preset.scenario.contract_only, result.decision),
					result,
					matchesPython: pristine ? agrees(preset.scenario, result) : null,
					intentSha,
					mandateSha
				});
			} catch (e) {
				if (!cancelled) setOutcome({
					kind: e instanceof X3Error ? "compile_error" : "runtime_error",
					...errorOf(e)
				});
			}
		}, 150);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [
		intent,
		mandate,
		preset
	]);
	const attack = ATTACKS.find((a) => a.id === attackId) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: "Playground",
		title: "Break the agent's payment. Watch it get refused.",
		lede: "This page runs the real X3 checker in your browser: parse, type-check, lower, then every Guard check in the contract's order. Edit either program. Nothing is signed or sent.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Pick a case or launch an attack",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 font-display text-xs tracking-widest text-accent uppercase",
							children: "One-click attacks on the authorized payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: ATTACKS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => launch(a),
								className: `tap min-h-11 rounded-full border px-4 text-sm font-semibold ${attackId === a.id ? "border-accent bg-accent text-bg" : "border-border text-fg hover:border-accent"}`,
								children: a.label
							}, a.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 mb-3 font-display text-xs tracking-widest text-accent uppercase",
							children: "The twelve judge scenarios"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
							children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => choosePreset(p.id),
								className: `tap min-h-11 rounded-xl border px-4 py-3 text-left text-sm ${presetId === p.id && !attackId ? "border-primary bg-surface-2 text-fg" : "border-border text-muted hover:text-fg"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold text-fg",
									children: p.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: DATA.groups[p.group]
								})]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: attack ? `${attack.why} ${attack.kind === "compile" ? `Expected: does not compile (${attack.stop}).` : `Expected: Guard check ${attack.stop} fails.`}` : preset.story
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "The two programs",
				alt: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
							label: "Owner's mandate",
							sub: DATA.mandate.file,
							value: mandate,
							onChange: setMandate
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
							label: "Agent's payment",
							sub: preset.scenario.intent.file,
							value: intent,
							onChange: setIntent
						})]
					}),
					preset.scenario.assumed_guard_state && !attackId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-4 max-w-6xl text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Assumed Guard state" }),
							" ",
							preset.scenario.assumed_guard_state.revoked ? "The owner has revoked this mandate. " : null,
							preset.scenario.assumed_guard_state.spends?.length ? `Already spent in the last 24 hours: ${preset.scenario.assumed_guard_state.spends.map((s) => `${Number(s.amount) / 1e6} USDC`).join(", ")}.` : null
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-4 flex max-w-6xl flex-wrap gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "tap min-h-11 rounded-full border border-border px-5 text-sm font-semibold text-fg",
							onClick: () => {
								setIntent(preset.intent);
								setMandate(DATA.mandate.source);
								setAttackId(null);
							},
							disabled: !edited && !attackId,
							children: "Reset both programs"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: verdictRef,
				className: "scroll-mt-20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Verdict",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
					outcome,
					expected: attack,
					contractNote: preset.scenario.contract_note,
					contractTests: preset.scenario.contract_tests
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteLab, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "What this proves, and what it does not",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mx-auto grid max-w-3xl gap-3",
					children: EVIDENCE_LADDER.map((rung) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: rung.proven ? "text-primary" : "text-accent",
									children: rung.proven ? "Shown here" : "Not shown here"
								}),
								" ",
								"· ",
								rung.label
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: rung.how
						})]
					}, rung.level))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mx-auto mt-6 max-w-3xl text-sm text-muted",
					children: [
						"Checker source:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(OutLink, {
							href: VENDOR_URL,
							children: ["x3guard.mjs at ", VENDOR_COMMIT.slice(0, 7)]
						}),
						", copied byte for byte. In x3lang a parity test runs it against the Python adapter on the same programs. This site's own test re-checks all twelve scenarios against Python's recorded answers. The testnet transactions are on",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/proof",
							className: "text-primary underline underline-offset-4",
							children: "Inspect the Proof"
						}),
						"."
					]
				})]
			})
		]
	});
}
function Editor({ label, sub, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-lg text-fg",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-2 text-xs text-muted",
				children: sub.split("/").pop()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value,
				onChange: (e) => onChange(e.target.value),
				spellCheck: false,
				rows: 18,
				className: "mt-3 block w-full resize-y rounded-xl border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-primary focus:border-primary focus:outline-none sm:text-sm"
			})
		]
	});
}
var TONE = {
	pass: "border-primary",
	note: "border-primary/60",
	fail: "border-accent",
	seal: "border-accent/60"
};
function Verdict({ outcome, expected, contractNote, contractTests }) {
	if (outcome.kind === "idle") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-center text-muted",
		children: "Checking…"
	});
	if (outcome.kind === "runtime_error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		"aria-live": "polite",
		className: "mx-auto max-w-3xl rounded-xl border border-accent p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Checker unavailable" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: outcome.message }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No policy verdict was produced. Use HTTPS or localhost with WebCrypto support." })
		]
	});
	if (outcome.kind === "compile_error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl rounded-xl border border-accent bg-surface p-6",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Does not compile" }), expected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: expected.kind === "compile" && expected.stop === outcome.code ? `Stopped by ${expected.stop}, as expected` : `Expected ${expected.stop}. Report this` }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-display text-2xl break-all text-fg",
				children: outcome.code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-muted",
				children: [outcome.line ? `Line ${outcome.line}: ` : "", outcome.message]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Nothing reaches Guard. A program that fails here never gets quoted."
			})
		]
	});
	const d = DECISIONS[outcome.shown];
	const { result } = outcome;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `mx-auto max-w-4xl rounded-xl border bg-surface p-6 ${TONE[d.tone]}`,
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: d.label }),
					outcome.matchesPython === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Matches Python, guard by guard" }) : null,
					outcome.matchesPython === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Differs from Python. Report this" }) : null,
					outcome.matchesPython === null && !expected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Edited. No recorded Python answer" }) : null,
					expected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: expected.kind === "guard" && result.denied_guards.length === 1 && result.denied_guards[0] === expected.stop ? `Stopped by ${expected.stop}, as expected` : `Expected ${expected.stop}. Report this` }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-display text-2xl text-fg",
				children: outcome.shown
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: d.detail
			}),
			outcome.shown === "contract_only" && contractNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					contractNote,
					" ",
					contractTests.length ? `Contract tests: ${contractTests.join(", ")}.` : ""
				]
			}) : null,
			result.approvals_needed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Approvals needed: ",
					result.approvals_needed,
					"."
				]
			}) : null,
			result.checks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[32rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4 font-semibold",
								children: "Guard check"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4 font-semibold",
								children: "Result"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 font-semibold",
								children: "Detail"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: result.checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60 align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-4 font-mono text-xs text-fg",
								children: c.guard
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `py-2 pr-4 font-semibold ${c.ok ? "text-primary" : "text-accent"}`,
								children: c.ok ? "pass" : "FAIL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-xs break-all text-muted",
								children: c.detail
							})
						]
					}, c.guard)) })]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Refused before the term checks: ",
					result.denied_guards.join(", "),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 grid gap-2 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "inline text-fg",
					children: "Payment SHA-256 "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "inline font-mono break-all",
					children: outcome.intentSha
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "inline text-fg",
					children: "Mandate SHA-256 "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "inline font-mono break-all",
					children: outcome.mandateSha
				})] })]
			})
		]
	});
}
function QuoteLab() {
	const [quoteId, setQuoteId] = (0, import_react.useState)(QUOTES[0].id);
	const original = (0, import_react.useMemo)(() => QUOTES.find((q) => q.id === quoteId)?.json ?? QUOTES[0].json, [quoteId]);
	const [text, setText] = (0, import_react.useState)(original);
	const [state, setState] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setText(original), [original]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			let parsed;
			try {
				parsed = JSON.parse(text);
			} catch {
				if (!cancelled) setState({
					valid: false,
					reason: "not valid JSON",
					hash: null
				});
				return;
			}
			const r = await checkQuoteSignature(parsed);
			if (!cancelled) setState(r);
		})();
		return () => {
			cancelled = true;
		};
	}, [text]);
	function tamper() {
		try {
			const q = JSON.parse(text);
			const min = String(q.quote.minAmountOut ?? "0");
			q.quote.minAmountOut = /^\d+$/.test(min) ? String(BigInt(min) + 1n) : "1";
			setText(JSON.stringify(q, null, 2));
		} catch {
			setText(original);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Verify a signed 1Click quote",
		intro: "Guard trusts a quote only after the 1Click signature checks out. This is the same Ed25519 check the contract runs, using the pinned 1Click key, on quotes that 1Click actually issued. Change one digit and it fails.",
		alt: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						QUOTES.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setQuoteId(q.id),
							className: `tap min-h-11 rounded-full border px-4 text-sm font-semibold ${quoteId === q.id ? "border-primary text-primary" : "border-border text-fg"}`,
							children: q.label
						}, q.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: tamper,
							className: "tap min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-bg",
							children: "Raise the guaranteed output by 1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setText(original),
							className: "tap min-h-11 rounded-full border border-border px-4 text-sm font-semibold text-fg",
							children: "Restore"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					spellCheck: false,
					rows: 14,
					"aria-label": "1Click quote JSON",
					className: "mt-4 block w-full resize-y rounded-xl border border-border bg-bg p-4 font-mono text-xs text-primary focus:border-primary focus:outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `mt-4 font-semibold ${state?.valid ? "text-primary" : "text-accent"}`,
					"aria-live": "polite",
					children: state === null ? "Checking…" : state.valid ? "Signature verified under the 1Click manager key" : `Refused: ${state.reason}`
				}),
				state?.hash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-xs break-all text-muted",
					children: ["Quote hash ", state.hash]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs break-all text-muted",
					children: [
						"Pinned key ",
						ONE_CLICK_MANAGER_PUBLIC_KEY,
						". These are dry quotes captured on 2026-11-03. A valid signature proves what 1Click offered. It does not prove a swap happened."
					]
				})
			]
		})
	});
}
//#endregion
export { PlaygroundPage as component };
