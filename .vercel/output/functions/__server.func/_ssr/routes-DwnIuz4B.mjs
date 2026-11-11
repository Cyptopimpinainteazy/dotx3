import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RouteTicker, i as ProofFlow, n as Card, o as Section, r as CardGrid, s as SiteShell, t as ActionLink } from "./site-shell-0774LnZF.mjs";
import { i as SITE } from "./front-door-CDmHt-Gp.mjs";
import { a as Group, c as LineSegments, d as OctahedronGeometry, f as PerspectiveCamera, h as TorusGeometry, i as Float32BufferAttribute, l as Mesh, m as SphereGeometry, n as BufferGeometry, o as IcosahedronGeometry, p as Scene, r as Clock, s as LineBasicMaterial, t as WebGLRenderer, u as MeshBasicMaterial } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DwnIuz4B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fit(renderer, camera, el) {
	const w = Math.max(el.clientWidth, 1);
	const h = Math.max(el.clientHeight, 1);
	renderer.setSize(w, h, false);
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}
function HeroField() {
	const wrapRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const renderer = new WebGLRenderer({
			antialias: true,
			alpha: true
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setClearColor(0, 0);
		renderer.domElement.className = "h-full w-full";
		el.appendChild(renderer.domElement);
		const scene = new Scene();
		const camera = new PerspectiveCamera(42, 1, .1, 40);
		camera.position.set(0, .2, 5.4);
		const core = new Mesh(new IcosahedronGeometry(.85, 1), new MeshBasicMaterial({
			color: 3066111,
			wireframe: true
		}));
		scene.add(core);
		const inner = new Mesh(new OctahedronGeometry(.38, 0), new MeshBasicMaterial({
			color: 16739098,
			wireframe: true
		}));
		scene.add(inner);
		const group = new Group();
		const positions = [];
		const nodeMat = new MeshBasicMaterial({ color: 15264495 });
		const nodeGeo = new SphereGeometry(.045, 10, 10);
		for (let i = 0; i < 18; i++) {
			const phi = Math.acos(1 - 2 * (i + .5) / 18);
			const theta = Math.PI * (1 + Math.sqrt(5)) * i;
			const r = 1.85;
			const x = r * Math.sin(phi) * Math.cos(theta);
			const y = r * Math.cos(phi) * .72;
			const z = r * Math.sin(phi) * Math.sin(theta);
			const node = new Mesh(nodeGeo, nodeMat);
			node.position.set(x, y, z);
			group.add(node);
			positions.push(0, 0, 0, x, y, z);
		}
		const lines = new LineSegments(new BufferGeometry().setAttribute("position", new Float32BufferAttribute(positions, 3)), new LineBasicMaterial({
			color: 3066111,
			transparent: true,
			opacity: .45
		}));
		group.add(lines);
		scene.add(group);
		let raf = 0;
		const clock = new Clock();
		const onResize = () => fit(renderer, camera, el);
		onResize();
		const ro = new ResizeObserver(onResize);
		ro.observe(el);
		const tick = () => {
			const t = reduced ? .6 : clock.getElapsedTime();
			group.rotation.y = t * .22;
			core.rotation.y = t * .35;
			core.rotation.x = t * .12;
			inner.rotation.y = -t * .5;
			renderer.render(scene, camera);
			if (!reduced) raf = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			nodeGeo.dispose();
			nodeMat.dispose();
			lines.geometry.dispose();
			lines.material.dispose();
			core.geometry.dispose();
			core.material.dispose();
			inner.geometry.dispose();
			inner.material.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: "mx-auto h-64 w-full max-w-xl",
		"aria-hidden": "true"
	});
}
function MeterScene({ progress }) {
	const wrapRef = (0, import_react.useRef)(null);
	const progressRef = (0, import_react.useRef)(progress);
	progressRef.current = progress;
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const renderer = new WebGLRenderer({
			antialias: true,
			alpha: true
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setClearColor(0, 0);
		el.appendChild(renderer.domElement);
		const scene = new Scene();
		const camera = new PerspectiveCamera(38, 1, .1, 30);
		camera.position.set(0, .55, 4.4);
		const track = new Mesh(new TorusGeometry(1.4, .035, 12, 80), new MeshBasicMaterial({ color: 2501174 }));
		track.rotation.x = 1.05;
		scene.add(track);
		const arcMat = new MeshBasicMaterial({ color: 3066111 });
		const arc = new Mesh(new TorusGeometry(1.4, .07, 12, 96, .02), arcMat);
		arc.rotation.x = 1.05;
		arc.rotation.z = Math.PI / 2;
		scene.add(arc);
		const core = new Mesh(new IcosahedronGeometry(.46, 1), new MeshBasicMaterial({
			color: 16739098,
			wireframe: true
		}));
		scene.add(core);
		let last = -1;
		let raf = 0;
		const clock = new Clock();
		const onResize = () => fit(renderer, camera, el);
		onResize();
		const ro = new ResizeObserver(onResize);
		ro.observe(el);
		const tick = () => {
			const p = Math.min(1, Math.max(0, progressRef.current));
			if (Math.abs(p - last) > .004) {
				const theta = Math.max(.02, p * Math.PI * 2);
				arc.geometry.dispose();
				arc.geometry = new TorusGeometry(1.4, .07, 12, 96, theta);
				last = p;
			}
			const t = reduced ? .4 : clock.getElapsedTime();
			core.rotation.y = t * .45;
			core.rotation.x = t * .18;
			core.scale.setScalar(.85 + p * .35);
			renderer.render(scene, camera);
			if (!reduced) raf = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			track.geometry.dispose();
			track.material.dispose();
			arc.geometry.dispose();
			arcMat.dispose();
			core.geometry.dispose();
			core.material.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: "mx-auto h-72 w-full max-w-xl",
		role: "img",
		"aria-label": "Three.js ring showing progress toward the $100,000,000,000 goal"
	});
}
var GOAL = 1e11;
var KEY = "dotx3-raised-v3";
var EMPTY = {
	base: 0,
	solana: 0,
	near: 0
};
var ORIGINS = [
	{
		id: "base",
		name: "Base",
		asset: "Base.USDC",
		file: "base_sepolia_to_near_testnet_1usdc.x3"
	},
	{
		id: "solana",
		name: "Solana",
		asset: "Solana.USDC",
		file: "near_intents_sol_to_near.x3"
	},
	{
		id: "near",
		name: "NEAR",
		asset: "Near.USDC",
		file: "near_mandate_agent.x3"
	}
];
function intentFor(origin, usd) {
	const units = usd * 1e6;
	const floor = Math.floor(units * .99);
	if (origin === "base") return `intent invest_from_base {
    from Base.USDC amount ${units} receiver YOUR_BASE_ADDRESS
    to Near.USDC receiver YOUR_NEAR_ACCOUNT
    route {
        bridge NearIntents Base.USDC -> Near.USDC min_receive ${floor};
    }
    require slippage <= 1%
    require fees <= 100 bps
    require nonce unused invest_base_once
    timeout 30m refund Base.USDC to YOUR_BASE_ADDRESS
    on_fail rollback
}`;
	if (origin === "solana") return `intent invest_from_solana {
    from Solana.USDC amount ${units} receiver YOUR_SOLANA_ADDRESS
    to Near.USDC receiver YOUR_NEAR_ACCOUNT
    route {
        bridge NearIntents Solana.USDC -> Near.USDC min_receive ${floor};
    }
    require slippage <= 1%
    require fees <= 100 bps
    require nonce unused invest_solana_once
    timeout 10m refund Solana.USDC
    on_fail rollback
}`;
	return `intent invest_on_near {
    from Near.USDC amount ${units} receiver YOUR_NEAR_ACCOUNT
    to Near.USDC receiver YOUR_NEAR_ACCOUNT
    under mandate x3-owner.near
    require slippage <= 1%
    require fees <= 100 bps
    require nonce unused invest_near_once
    timeout 30m refund Near.USDC
    on_fail rollback
}`;
}
function loadBook() {
	const raw = window.localStorage.getItem(KEY);
	if (!raw) return EMPTY;
	try {
		const parsed = JSON.parse(raw);
		return {
			base: Number.isFinite(parsed.base) ? Math.max(0, parsed.base) : 0,
			solana: Number.isFinite(parsed.solana) ? Math.max(0, parsed.solana) : 0,
			near: Number.isFinite(parsed.near) ? Math.max(0, parsed.near) : 0
		};
	} catch {
		return EMPTY;
	}
}
function Meter() {
	const [book, setBook] = (0, import_react.useState)(EMPTY);
	const [chain, setChain] = (0, import_react.useState)("base");
	(0, import_react.useEffect)(() => {
		setBook(loadBook());
	}, []);
	function write(next) {
		const clamped = {
			base: Math.max(0, next.base),
			solana: Math.max(0, next.solana),
			near: Math.max(0, next.near)
		};
		const sum = clamped.base + clamped.solana + clamped.near;
		if (sum > GOAL) {
			const scale = GOAL / sum;
			clamped.base = Math.floor(clamped.base * scale);
			clamped.solana = Math.floor(clamped.solana * scale);
			clamped.near = GOAL - clamped.base - clamped.solana;
		}
		setBook(clamped);
		window.localStorage.setItem(KEY, JSON.stringify(clamped));
	}
	const raised = book.base + book.solana + book.near;
	const pct = Math.round(raised / GOAL * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeterScene, { progress: raised / GOAL }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-8 overflow-hidden rounded-full bg-surface-2",
				role: "meter",
				"aria-valuenow": raised,
				"aria-valuemin": 0,
				"aria-valuemax": GOAL,
				"aria-label": "Raised from Base, Solana, and NEAR toward $100,000,000,000",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-full items-center justify-end bg-primary pr-3 text-xs font-semibold text-bg transition-[width] duration-500 ${raised > 0 ? "meter-sheen" : ""}`,
					style: { width: `${Math.max(pct, raised > 0 ? 8 : 0)}%` },
					children: raised > 0 ? `${pct}%` : null
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-center text-muted",
				children: [
					"Raised $",
					raised.toLocaleString(),
					" / Goal $",
					GOAL.toLocaleString(),
					raised === 0 ? " · 0%" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-center text-sm text-muted",
				children: "Same path as the software. Base and Solana bridge through NearIntents. NEAR is already there, so that program has no bridge. Guard checks the terms either way. This page only records the mark. It does not move funds."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				role: "radiogroup",
				"aria-label": "Choose chain",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-center font-display text-lg text-fg",
					children: "Choose chain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: ORIGINS.map((origin) => {
						const amount = book[origin.id];
						const share = raised === 0 ? 0 : Math.round(amount / raised * 100);
						const selected = chain === origin.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "radio",
							"aria-checked": selected,
							onClick: () => setChain(origin.id),
							className: `rounded-xl border bg-surface p-5 text-left ${selected ? "border-primary" : "border-border"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-xs tracking-widest text-accent uppercase",
									children: [selected ? "Selected · " : "", origin.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 font-display text-3xl text-fg",
									children: ["$", amount.toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted",
									children: [
										share,
										"% of what is marked · asset ",
										origin.asset
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs text-muted",
									children: ["Checked-in shape: ", origin.file]
								})
							]
						}, origin.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "tap min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-bg",
					onClick: () => write({
						...book,
						[chain]: book[chain] + 1e3
					}),
					children: ["Log $1,000 on ", ORIGINS.find((origin) => origin.id === chain)?.name]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-6 overflow-x-auto rounded-xl border border-border bg-bg p-4 text-sm text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: intentFor(chain, 1e3) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap min-h-11 rounded-full bg-accent px-5 text-sm font-semibold text-bg",
					onClick: () => {
						const share = Math.floor(GOAL / 3);
						write({
							base: share,
							solana: share,
							near: GOAL - share * 2
						});
					},
					children: "Fill all rails"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap min-h-11 rounded-full border border-border px-5 text-sm font-semibold text-fg",
					onClick: () => write(EMPTY),
					children: "Reset meter"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-xs text-muted",
				children: "Stored only in this browser. The published Base trade is 1 test USDC on Base Sepolia. Solana uses the repo’s canonical example. NEAR uses the mandate that already allows Near.USDC, with no bridge. None of these marks is a finalized investment."
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		eyebrow: `${SITE} · NEAR Hackathon`,
		title: ".x3",
		lede: "Understand it, try it, inspect the proof, and get the code. An agent can propose a payment. The owner's .x3 policy decides whether Guard authorizes the deposit address.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
				to: "/demo",
				children: "Try the Demo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
				to: "/docs",
				outline: true,
				children: "Learn .x3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
				to: "/developers",
				outline: true,
				children: "View the Code"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
				to: "/proof",
				outline: true,
				children: "Inspect the Proof"
			})
		] }),
		media: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroField, {}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteTicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "What .x3 does",
				intro: "One policy. The compiler checks it. Guard checks it again. The model does not get a vote.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/media/logo.jpg",
					alt: ".x3 protocol mark",
					className: "scan mx-auto mb-10 w-full max-w-lg rounded-xl border border-border"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardGrid, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "The owner writes the rule",
						children: "A mandate names the agent, the asset, the caps, the recipient, slippage, fees, and when the owner must approve."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "The agent writes a program",
						children: "The payment is another .x3 file. If it pays the wrong account, drops the nonce, or breaks a cap, it does not compile or Guard refuses it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Settlement is labeled",
						children: "The published trade is testnet: 1 test USDC from Base Sepolia to NEAR. Official 1Click quotes were checked and stopped before a deposit."
					})
				] }) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "How a decision moves",
				intro: "The program names Base, Solana, or NEAR. Guard allows the deposit or it refuses. Base and Solana bridge. NEAR does not.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofFlow, { steps: [
					{
						label: "Base",
						detail: "Bridge to NEAR"
					},
					{
						label: "Solana",
						detail: "Bridge to NEAR"
					},
					{
						label: "NEAR",
						detail: "Already there"
					},
					{
						label: "Guard",
						detail: "Quote terms or refusal"
					}
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Mainnet trade demo",
				alt: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-bg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						className: "scan aspect-video w-full bg-bg",
						src: "/media/hero.mp4",
						poster: "/media/logo.jpg",
						controls: true,
						playsInline: true,
						muted: true,
						loop: true,
						autoPlay: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "px-4 py-3 text-center text-sm text-muted",
						children: "Protocol mark in motion. Drop the Claude clip in when it is hosted — the Claude file link was behind a login wall."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Invest from Base, Solana, or NEAR",
				intro: "Choose Base, Solana, or NEAR. The .x3 program switches to that asset, and the log lands on the rail you picked.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "One demonstration, three tracks",
				alt: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardGrid, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "AI Security & Defense",
						children: "Recipient and asset allowlists, caps, slippage, fees, expiry, one-use nonces. Compiler off-chain. x3-guard on NEAR testnet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Agent Economy",
						children: "Permitted, approval-required, and denied payments. Testnet shows one allowed intent and one refused intent."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Unstoppable DeFi",
						children: "One .x3 program, hash bound before the source transfer, then finalized on Base Sepolia and NEAR testnet through a trusted relay."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
						to: "/demo",
						children: "Try the Demo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
						to: "/proof",
						outline: true,
						children: "Inspect the Proof"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: ".x3 on NEAR",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "A NEP-141 community token. Fastest launch is a factory or Smithii Token Creator — one signature, full supply to treasury, then distribute against verified mainnet trades."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 inline-flex rounded-full bg-accent px-4 py-1 font-display text-sm font-bold text-bg",
							children: ".X3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: "Symbol .X3 · Standard NEP-141 · Chain NEAR"
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Home as component };
