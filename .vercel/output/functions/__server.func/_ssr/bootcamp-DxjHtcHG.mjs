import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as BookOpen, i as Play, l as ArrowRight, o as Download, r as Search, s as Check } from "../_libs/lucide-react.mjs";
import { s as SiteShell } from "./site-shell-BE2QkAeR.mjs";
import { n as OutLink, t as CodeBlock } from "./code-block-AVKNKds0.mjs";
import { n as DATA, p as evaluate, t as ATTACKS, u as applyAttack } from "./judge-D5iAN8iP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bootcamp-DxjHtcHG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LESSONS = [
	{
		id: "orientation",
		track: "01 / Foundations",
		title: "Choose the right .x3 surface",
		summary: "What the language is, who enforces it, and where code runs.",
		sections: [{
			title: "The owner writes authority; the agent proposes actions",
			text: ["An intent describes a requested outcome: the input asset and amount, recipient, route, constraints, deadline and failure behavior. A mandate separately states what an agent is allowed to request. Model output is input to the checker, never an authorization by itself.", "X3 Shield combines policy compilation, quote checks and a NEAR Guard contract. These are distinct stages. Passing a browser check proves a local calculation over supplied data. It does not prove live mandate state, a wallet signature, a transfer or finalized delivery."]
		}, {
			title: "Two toolchains, two contracts with the developer",
			text: ["The Python intent/mandate tools are the shipping NEAR adapter surface. near_intents.py prepares and checks requests; near_mandate.py compiles owner policies. The Rust x3c compiler has a broader language surface, produces X3BC and runs with a local VM and capability host. The documented Rust instruction set is not loaded by a chain pallet.", "Choose your target before copying syntax. A clause accepted by a parser is not necessarily lowered or enforced by a particular backend. In particular, the generic Rust VM has no mandate store: under mandate does not create wallet enforcement."]
		}],
		sources: ["docs/x3-lang/PROGRAMMING_GUIDE.md", "x3-lang/README.md"],
		exercise: "Explain the difference between a locally valid policy, on-chain authorization and a finalized transfer before continuing."
	},
	{
		id: "install",
		track: "02 / Tooling",
		title: "Install, pin and call the tools",
		summary: "Source installation and reproducible command-line entry points.",
		sections: [{
			title: "Start from a known revision",
			text: ["Use Python 3.11+, Rust 1.90+ with Cargo, and Node.js 22+ for browser tests. Installation downloads dependencies; the subsequent fixture-based lessons need no wallet or signing key. The browser lab below uses an independently pinned, older checker; its revision is displayed rather than silently equated with current master."],
			code: "git clone https://github.com/Cyptopimpinainteazy/x3lang.git\ncd x3lang\ngit checkout 3b6c73037a1cb158f79c5f76d3ee202c4376f8d4\npython3 -m venv .venv\n. .venv/bin/activate\npython3 -m pip install -r x3-lang/requirements.txt pytest\ngit rev-parse HEAD"
		}, {
			title: "Select the entry point",
			text: ["cli.py is a parser boundary that emits a JSON AST for one intent. It intentionally skips other top-level declarations; using it alone cannot validate a whole Rust program or certify its policy enforcement. Use the adapter for NEAR lowering and x3c for the Rust surface. Ask each CLI for its supported arguments at your pinned revision."],
			code: "python3 x3-lang/cli.py x3-lang/examples/near_intents_agent_payment.x3\npython3 x3-lang/near_intents.py --help\ncargo run --manifest-path x3-lang/Cargo.toml --locked -p x3-tools --bin x3c -- --help"
		}],
		sources: [
			"x3-lang/cli.py",
			"x3-lang/near_intents.py",
			"docs/x3-lang/PROGRAMMING_GUIDE.md"
		],
		exercise: "Record the commit and tool versions alongside the first command output. Do not copy another revision’s pass counts."
	},
	{
		id: "syntax",
		track: "03 / Language",
		title: "Read an intent line by line",
		summary: "Endpoints, route, requirements, deadlines and failure behavior.",
		sections: [{
			title: "The program envelope",
			text: ["intent NAME { ... } declares the payment program. from names chain.asset, an integer amount and the source receiver. to names the destination asset and its receiver. route encloses operations, with semicolons on the route steps in the examples. Use the complete checked-in example below as your starting point.", "In the Python surface, blank lines and full-line // or # comments are ignored; trailing comments are supported by its line cleaner. That does not make the syntax rules of every other frontend identical. Keep examples formatted like their target’s checked-in files."]
		}, {
			title: "Constraints are obligations",
			text: ["require slippage <= 0.5% sets an upper bound; require fees <= 100 bps sets a fee ceiling. require nonce unused NAME names a one-use identifier. under mandate OWNER associates the intent with an owner’s policy; it is not a declaration of that policy.", "timeout 10m refund Solana.USDC specifies a refund path at the deadline. On the NEAR adapter, on_fail rollback is translated into refund semantics; it is not an instantaneous cross-chain reversal. An unsupported halt or quarantine promise is refused. The generic Rust path has its own policy checks."]
		}],
		sources: [
			"x3-lang/examples/near_intents_agent_payment.x3",
			"x3-lang/cli.py",
			"x3-lang/near_intents.py"
		],
		exercise: "Locate who receives a successful payment and who receives a refund. They are separate terms."
	},
	{
		id: "units",
		track: "04 / Types",
		title: "Amounts, assets, addresses and time",
		summary: "Avoid the mistakes that turn a correct-looking program into a bad payment.",
		sections: [
			{
				title: "Base units are integers",
				text: ["Amounts are integer base units, not display decimals. For a token with six decimals, 25 units is 25000000. Check token metadata rather than guessing decimals from a symbol. The mandate amount must fit u128; per_payment must be positive and cannot exceed per_24h.", "One basis point is 0.01%; 50 bps is 0.5%. The Rust guide documents bare 50 and 0.5% as equivalent slippage bounds, and 100 bps or 100bps for fee ceilings. Use the demonstrated percent/bps spellings in the NEAR track. A cap is not a promise that a quote will meet it."]
			},
			{
				title: "Symbols are not token identities",
				text: ["Chain aliases and symbols are resolved through registries and token records. A registry entry is not evidence of a deployed integration. Resolve a concrete originAsset/destinationAsset from the token catalog and bind the correct network. Do not substitute similarly named tokens or compare Solana addresses case-insensitively.", "The parser accepts some short EVM placeholders for source compatibility. Passing its address-shape check does not prove a real address, ownership, network or recipient intent. Example accounts are teaching fixtures, not deposit instructions."]
			},
			{
				title: "Relative time needs a clock",
				text: ["A mandate expires duration is compiled relative to compilation time. The checker requires now to be strictly before expiry and the payment deadline to be no later than mandate expiry. Recompiling later changes the computed expiry even when the source is unchanged. Record both source hash and evaluation time.", "The local lab deliberately freezes the clock to the scenario fixture timestamp. Its old-looking expiry is not a statement about a currently active on-chain mandate."]
			}
		],
		sources: [
			"x3-lang/registry.py",
			"x3-lang/near_mandate.py",
			"docs/x3-lang/PROGRAMMING_GUIDE.md"
		],
		exercise: "Convert 30 USDC at six decimals to base units, and explain why changing the token requires checking its decimals again."
	},
	{
		id: "mandates",
		track: "05 / Authority",
		title: "Write every mandate term",
		summary: "The owner policy, explained field by field.",
		sections: [
			{
				title: "Identity and spend scope",
				text: ["owner identifies the NEAR owner; agent identifies the account acting under the mandate. spend fixes the origin asset. per_payment bounds one payment, while per_24h bounds a rolling 24-hour window. These are not interchangeable: a small payment can still exhaust a rolling allowance.", "allow recipients is a list of permitted destination accounts; allow assets is a list of permitted destination assets. Lists must be nonempty, distinct and within the implementation’s length limits. refund_to pins an explicit source-chain account, not the symbolic sender."]
			},
			{
				title: "Price bounds and approvals",
				text: ["Both require slippage and require fees must be bounded. If multiple bounds are present, lowering uses the tightest. Compiled ceilings cannot exceed 10000 bps. The payment’s declared caps must not loosen the owner’s caps.", "approve above AMOUNT by N of ACCOUNTS makes payments strictly above AMOUNT require approvals. Equality is not above. The approval amount must be below per_payment, approvers must be distinct and valid, N must be between one and the number of approvers, and the agent cannot approve its own payments."]
			},
			{
				title: "Expiry, history and revocation",
				text: ["expires ends the authority at a computed time. The rolling check sums payments strictly inside its 24-hour window and also caps payment count. The checked-in example describes a maximum of 64 payments per window. A locally compiled mandate has no real spend history or revocation state unless you supply state.", "A deployed Guard maintains state and must recheck authority when accepting the request. Revocation and replay are stateful contract concerns. Never turn an old local pass into a current authorization. The source hash records identity; each execution path must actually enforce the binding to make it meaningful."]
			}
		],
		sources: [
			"x3-lang/near_mandate.py",
			"x3-lang/examples/near_mandate_agent.x3",
			"x3-lang/near/x3-guard/README.md"
		],
		exercise: "Change the recipient in the lab while keeping the mandate unchanged. The payment must be refused."
	},
	{
		id: "near-rules",
		track: "06 / Adapter rules",
		title: "The NEAR path is deliberately narrow",
		summary: "Which programs lower to 1Click, and which must be refused.",
		sections: [{
			title: "One leg with matching endpoints",
			text: ["The adapter accepts one NearIntents bridge leg and no fallback route. Its origin and destination assets must match the intent endpoints. A second swap or a fallback is not silently treated as part of an atomic transaction.", "An explicit slippage bound and timeout are required. A mandate payment requires exactly one replay-protection nonce. Refunds must use the deposited asset on the origin chain, and timeout/on_fail refund destinations must agree."]
		}, {
			title: "No unenforceable promises",
			text: ["Only guards supported by this adapter may pass lowering. A broader compiler vocabulary is not a license to attach unsupported guards to a NEAR request. X3_NEAR_GUARD_UNENFORCEABLE means the selected backend cannot keep the promise.", "The searchable refusal index below is extracted from the pinned Python parser, adapter and mandate compiler. It includes exact source locations. It is a diagnostic index for those files, not a claim that it exhausts the Rust verifier, VM traps or deployed contract errors."]
		}],
		sources: ["x3-lang/near_intents.py", "x3-lang/tests/test_near_intents.py"],
		exercise: "Remove the slippage requirement, then add a second route leg. Learn the different compiler refusals instead of deleting safeguards until the program passes."
	},
	{
		id: "calls",
		track: "07 / Integration",
		title: "Call .x3 from a terminal or application",
		summary: "Plan, policy-check and integrate structured output safely.",
		sections: [
			{
				title: "Plan without requesting a quote",
				text: ["plan compiles an intent into a quote request. It does not ask for a quote. Supplying --tokens uses a saved token catalog; omitting it fetches the live catalog. tokens.json below is a catalog you obtain and review, not a file that this page installs."],
				code: "python3 x3-lang/near_intents.py plan \\\n  x3-lang/examples/near_intents_agent_payment.x3 --tokens tokens.json\npython3 x3-lang/near_intents.py mandate check \\\n  x3-lang/examples/near_mandate_agent.x3 \\\n  x3-lang/examples/near_intents_agent_payment.x3 --tokens tokens.json"
			},
			{
				title: "Call the CLI with an argument array",
				text: ["For a server integration, run the pinned tool in a constrained process, pass paths as arguments, and parse its JSON output. Never concatenate untrusted .x3 source into a shell command. Nonzero exit is a refusal or failure to handle, not permission to fall back to an unchecked request.", "Use an allowlisted working directory, cap input/output size and runtime, and keep source separate from credentials. This example only runs the offline plan with a supplied catalog."],
				code: "import json, subprocess\nresult = subprocess.run(\n    [\"python3\", \"x3-lang/near_intents.py\", \"plan\",\n     \"payment.x3\", \"--tokens\", \"tokens.json\"],\n    capture_output=True, text=True, timeout=30, check=False,\n)\nif result.returncode != 0:\n    raise RuntimeError(result.stderr or \"X3 plan refused\")\nplan = json.loads(result.stdout)"
			},
			{
				title: "Browser integration",
				text: ["This site vendors the browser checker with hashes and a provenance record. Its judge.evaluate function accepts the scenario dataset and an intent/state scenario, then returns a decision, checks and denied_guards. The lab uses that code directly. It performs no remote quote request or transaction.", "The browser port is not a complete Rust compiler SDK. To add a new language feature, change the authoritative implementation and parity tests first, then refresh the vendored files and hashes."]
			}
		],
		sources: ["x3-lang/near_intents.py", "x3-lang/near/demo/judge/judge.mjs"],
		exercise: "Handle both a zero-exit plan and a nonzero refusal in your application without invoking a signer in either case."
	},
	{
		id: "quotes",
		track: "08 / Quotes",
		title: "From a request to checked quote terms",
		summary: "Dry mode, signatures, freshness and owner review.",
		sections: [{
			title: "Dry quote is a network operation",
			text: ["quote defaults to dry mode and calls the quote service. It checks the response against the program and can write structured evidence with --out. A dry quote is not a settlement or proof that a deposit exists. Token availability and service responses can change."],
			code: "python3 x3-lang/near_intents.py quote \\\n  x3-lang/examples/near_intents_agent_payment.x3 \\\n  --mandate x3-lang/examples/near_mandate_agent.x3 \\\n  --tokens tokens.json --out dry-quote.json"
		}, {
			title: "Bind the response before using it",
			text: ["Validate the configured manager signature, exact signed payload and quote hash, then check freshness, amount, assets, recipient, deadline, refund and price bounds. A valid signature does not itself mean the quote meets the owner’s policy. A provider status string does not prove chain finality.", "--live is a separate operational step: it requests a real deposit address, consumes local nonce state and writes a receipt. It does not sign the deposit. This course does not run it. Review the exact network, accounts, amounts and receipt before any separate wallet authorization."]
		}],
		sources: ["x3-lang/near_intents.py", "x3-lang/near/demo/x3guard.mjs"],
		exercise: "Explain why “signed”, “within policy”, “authorized” and “settled” are four different claims."
	},
	{
		id: "guard",
		track: "09 / Contract boundary",
		title: "Prepare Guard calls and verify execution",
		summary: "How arguments become transactions—and why the distinction matters.",
		sections: [
			{
				title: "Generate arguments, do not assume they were sent",
				text: ["mandate args produces create_mandate arguments. mandate revoke produces revoke_mandate arguments. These commands print data or a command; generating revocation arguments does not revoke anything on-chain. Guard calls need the correct signer, network, contract, gas and attached deposit."],
				code: "python3 x3-lang/near_intents.py mandate args \\\n  x3-lang/examples/near_mandate_agent.x3 --tokens tokens.json\npython3 x3-lang/near_intents.py prepare \\\n  --receipt reviewed.near-receipt.json --program payment.x3"
			},
			{
				title: "Authorization is separate from custody",
				text: ["Agent methods register and accept a request under the mandate, and listed approvers use the contract’s approval path where required. Read the contract method definitions and generated arguments at your revision rather than inventing JSON fields or using an old contract ABI.", "The Guard described in this track holds no funds. A keyholder can bypass it by directly using the origin wallet. A scoped vault can change that architecture only after its code, authority boundaries and deployed instance have been independently verified."]
			},
			{
				title: "Observe and verify the result",
				text: ["status reports an observed outcome. verify-deposit and verify-settlement perform their respective evidence checks and update a receipt. submit-deposit notifies 1Click of a transaction hash only after the implemented checks; it is an external side effect, not a read-only query.", "Record the exact source hash, quote binding, authorization transaction, origin transfer and destination evidence. A local receipt or two unrelated transaction hashes cannot establish cross-chain causality by themselves."]
			}
		],
		sources: ["x3-lang/near_intents.py", "x3-lang/near/x3-guard/README.md"],
		exercise: "Draw your integration’s boundary between preparing arguments and a human-approved signer. No model-generated command may cross it automatically."
	},
	{
		id: "rust",
		track: "10 / Compiler & VM",
		title: "Build and inspect X3BC",
		summary: "The Rust language track, capability hosts and local execution.",
		sections: [{
			title: "Compilation stages",
			text: ["The documented pipeline is source → lexer/parser → typed AST → semantic checks → X3IR → X3BC emitter → bytecode verifier → VM. Each stage answers a different question. Parsing recognizes syntax; semantics reject unsupported claims; verification checks the instruction stream; execution needs an actual host.", "Determinism means the same source, compiler revision and options produce the same result. Pin all three. A bytecode file is not a signed transaction. Local VM gas is not a host chain’s fee quote."],
			code: "cargo run --manifest-path x3-lang/Cargo.toml --locked -p x3-tools --bin x3c -- check x3-lang/examples/simple_swap.x3\ncargo run --manifest-path x3-lang/Cargo.toml --locked -p x3-tools --bin x3c -- build x3-lang/examples/simple_swap.x3 -o /tmp/simple_swap.x3b\ncargo run --manifest-path x3-lang/Cargo.toml --locked -p x3-tools --bin x3c -- explain /tmp/simple_swap.x3b"
		}, {
			title: "General programs and host effects",
			text: ["The Rust compiler accepts functions, bindings, mutation, branches, loops, returns, function types, tuples and arrays. The checked-in events_and_host_calls example below demonstrates fn main, emit, subscription, @subscribe and @sponsor without inventing an SDK.", "A capability call names an external effect; a matching capability host must implement it. A compiled subscription is not evidence that a keeper is running. Inspect the parser and tests for precise grammar and type combinations; do not assume every Rust-looking construct is part of .x3."]
		}],
		sources: [
			"docs/x3-lang/PROGRAMMING_GUIDE.md",
			"x3-lang/compiler/src/parser.rs",
			"x3-lang/examples/events_and_host_calls.x3"
		],
		exercise: "Build the events example and inspect its decoded instructions. Identify which operations require a host."
	},
	{
		id: "proofs",
		track: "11 / Enforcement",
		title: "Guards, policies, proofs and failure",
		summary: "How to reason about a promise the backend must actually enforce.",
		sections: [{
			title: "The guard vocabulary",
			text: ["The Python registry includes finality, slippage, fees, profit, invariant, risk, nonce, audit_gate, bridge_liquidity, canonical_supply, relayer_quorum, route_score, solver_bond, proof_complete, refund_path, refund_to, finality_explicit, vm_supported and mainnet_safe. It also accepts the legacy spelling proof. The parser’s vocabulary does not assert that every backend enforces all of them.", "The Rust guide identifies X3E4027 for a fee ceiling without backing policy. GuardClaimUnbacked means no pass can substantiate a claim. Do not remove a safety condition merely to get a green compiler result; select a supported target or implement the missing checker and adversarial tests."]
		}, {
			title: "Evidence must come from somewhere",
			text: [
				"proofs required records obligations such as source_lock_proof and destination_fill_proof. It does not manufacture evidence. Verification against a supplied root is not the same as authenticating the root against an independent trust anchor.",
				"The documented NEAR light-client boundary does not establish an independently authenticated production checkpoint, deployed escrow code hash or terminal escrow storage state. Treat RPC agreement, verified=true fields and trusted flags as data to evaluate, never consensus proof.",
				"Rollback scope is target-specific. A local transaction journal cannot undo an already-finalized external chain action. For the NEAR quote path, refunds follow the adapter/service semantics; do not describe a multichain route as atomic merely because the source says rollback."
			]
		}],
		sources: [
			"x3-lang/registry.py",
			"docs/x3-lang/PROGRAMMING_GUIDE.md",
			"docs/security/NEAR_LIGHT_CLIENT_APPROVAL_BOUNDARY.md"
		],
		exercise: "For every require in your program, name the component that checks it and the evidence that component consumes."
	},
	{
		id: "testing",
		track: "12 / Graduation",
		title: "Test hostile inputs and ship evidence",
		summary: "A developer’s completion criteria, not a marketing checklist.",
		sections: [{
			title: "Make refusal a tested behavior",
			text: ["Start with a valid fixture. Change one property at a time: recipient, origin or destination asset, amount, fee cap, slippage cap, refund address, nonce or deadline. Assert the specific failed guard or compiler code. Then test boundary equality, expiry, revocation, rolling spend and duplicate submissions at the layer that owns that state.", "Keep browser/Python parity tests and contract tests distinct. A replay contract test is not a browser replay defense. Never repair a failed test by fabricating chain state or replacing a verifier with a success flag."],
			code: "PYTHONPATH=x3-lang python3 -m pytest x3-lang/tests -q\nnode --test x3-lang/near/demo/test/*.test.mjs\ncargo test --manifest-path x3-lang/Cargo.toml --locked -p x3-lang-vm --quiet\ncargo test --manifest-path x3-lang/near/x3-guard/Cargo.toml --locked --quiet"
		}, {
			title: "A reproducible handoff",
			text: ["Include source revision and hash, compiler/tool versions, token catalog identity, evaluation time, generated terms, exact test commands and results. Label local, fixture, dry-network, testnet and independently verified settlement evidence separately.", "Keep private keys, seed phrases and API credentials out of source, screenshots and receipts. Review generated files before publication. Require independent review before enabling a signer or payout. Graduation here is local learning progress, not a certification of deployment safety."]
		}],
		sources: ["docs/x3-lang/PROGRAMMING_GUIDE.md", "x3-lang/tests/test_demo_parity.py"],
		exercise: "Demonstrate one local pass, one policy refusal and one compile refusal, then explain what none of those results prove about settlement."
	}
];
var reference_default = {
	revision: "3b6c73037a1cb158f79c5f76d3ee202c4376f8d4",
	browserRevision: "470d61a3b77689bb5e0c7e36fc7814d28e761dad",
	rules: [
		{
			"code": "X3_EVIDENCE_BASELINE",
			"message": "the receipt has no starting balance, so a delivery cannot be measured",
			"path": "x3-lang/near_intents.py",
			"line": 1797
		},
		{
			"code": "X3_EVIDENCE_BINDING",
			"message": "the receipt's program SHA-256 does not match the supplied X3 program",
			"path": "x3-lang/near_intents.py",
			"line": 1464
		},
		{
			"code": "X3_EVIDENCE_TX",
			"message": "no deposit transaction: pass --tx, or record it with submit-deposit --receipt",
			"path": "x3-lang/near_intents.py",
			"line": 1655
		},
		{
			"code": "X3_EVIDENCE_UNSUPPORTED",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1141
		},
		{
			"code": "X3_EVIDENCE_UNVERIFIED",
			"message": "a finalized, correct Solana transfer must be proven before notifying 1Click",
			"path": "x3-lang/near_intents.py",
			"line": 2065
		},
		{
			"code": "X3_MANDATE_ACCOUNT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_mandate.py",
			"line": 182
		},
		{
			"code": "X3_MANDATE_APPROVAL",
			"message": "`approve above` must be below per_payment, or no payment could need it",
			"path": "x3-lang/near_mandate.py",
			"line": 256
		},
		{
			"code": "X3_MANDATE_ASSET",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_mandate.py",
			"line": 173
		},
		{
			"code": "X3_MANDATE_BOUND",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_mandate.py",
			"line": 241
		},
		{
			"code": "X3_MANDATE_CHAIN",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1300
		},
		{
			"code": "X3_MANDATE_DENIED",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1316
		},
		{
			"code": "X3_MANDATE_EXPIRES",
			"message": "expires must fit a UTC timestamp from 1970-01-01T00:00:00.000Z through 9999-12-31T23:59:59.999Z",
			"path": "x3-lang/near_mandate.py",
			"line": 149
		},
		{
			"code": "X3_MANDATE_LIMIT",
			"message": "per_payment must be positive",
			"path": "x3-lang/near_mandate.py",
			"line": 219
		},
		{
			"code": "X3_MANDATE_LIST",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_mandate.py",
			"line": 235
		},
		{
			"code": "X3_MANDATE_OWNER",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1290
		},
		{
			"code": "X3_MANDATE_PARSE",
			"message": "the file is empty",
			"path": "x3-lang/near_mandate.py",
			"line": 80
		},
		{
			"code": "X3_MANDATE_RECIPIENT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_mandate.py",
			"line": 227
		},
		{
			"code": "X3_MANDATE_REFUND_TO",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_mandate.py",
			"line": 231
		},
		{
			"code": "X3_MANDATE_REQUIRED",
			"message": "a live quote for a mandate-controlled intent requires --guard-contract so revocation and rolling spend are read from chain state",
			"path": "x3-lang/near_intents.py",
			"line": 1161
		},
		{
			"code": "X3_NEAR_ACCOUNT_UNKNOWN",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1024
		},
		{
			"code": "X3_NEAR_AMOUNT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 292
		},
		{
			"code": "X3_NEAR_ASSET_AMBIGUOUS",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 529
		},
		{
			"code": "X3_NEAR_ASSET_UNSUPPORTED",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 523
		},
		{
			"code": "X3_NEAR_BOUND_UNIT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 321
		},
		{
			"code": "X3_NEAR_CHAIN_UNSUPPORTED",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 356
		},
		{
			"code": "X3_NEAR_ENDPOINT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 353
		},
		{
			"code": "X3_NEAR_GUARD_FAILED",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 866
		},
		{
			"code": "X3_NEAR_GUARD_OPERATOR",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 329
		},
		{
			"code": "X3_NEAR_GUARD_STEP",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1388
		},
		{
			"code": "X3_NEAR_GUARD_UNENFORCEABLE",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 412
		},
		{
			"code": "X3_NEAR_HTTP",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 939
		},
		{
			"code": "X3_NEAR_INVALID_SIGNATURE",
			"message": "Cryptographic quote verification failed; deposit prohibited",
			"path": "x3-lang/near_intents.py",
			"line": 771
		},
		{
			"code": "X3_NEAR_NONCE",
			"message": "an intent carries one nonce",
			"path": "x3-lang/near_intents.py",
			"line": 438
		},
		{
			"code": "X3_NEAR_NONCE_STORE",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1040
		},
		{
			"code": "X3_NEAR_NONCE_USED",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1068
		},
		{
			"code": "X3_NEAR_NOT_TERMINAL",
			"message": "the receipt records no terminal status yet; run `status --wait --receipt` first",
			"path": "x3-lang/near_intents.py",
			"line": 1410
		},
		{
			"code": "X3_NEAR_NUMBER",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 284
		},
		{
			"code": "X3_NEAR_ON_FAIL_UNSUPPORTED",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 455
		},
		{
			"code": "X3_NEAR_PROVIDER_MINIMUM",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 932
		},
		{
			"code": "X3_NEAR_QUOTE_MALFORMED",
			"message": "quote response has no `quote` object",
			"path": "x3-lang/near_intents.py",
			"line": 784
		},
		{
			"code": "X3_NEAR_RECEIPT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1384
		},
		{
			"code": "X3_NEAR_RECIPIENT",
			"message": "`to` must name a receiver address",
			"path": "x3-lang/near_intents.py",
			"line": 404
		},
		{
			"code": "X3_NEAR_REFUND_ASSET",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 471
		},
		{
			"code": "X3_NEAR_REFUND_TO",
			"message": "the refund goes to `sender`, and `from` names no receiver to refund",
			"path": "x3-lang/near_intents.py",
			"line": 480
		},
		{
			"code": "X3_NEAR_ROUTE_ENDPOINTS",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 384
		},
		{
			"code": "X3_NEAR_ROUTE_SHAPE",
			"message": "a NEAR Intents program has exactly one route leg, `bridge NearIntents <from> -> <to>`: 1Click settles one swap, and composing it with other legs would allow partial execution with no rollback",
			"path": "x3-lang/near_intents.py",
			"line": 370
		},
		{
			"code": "X3_NEAR_RPC",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1011
		},
		{
			"code": "X3_NEAR_SLIPPAGE_REQUIRED",
			"message": "a NEAR Intents swap needs `require slippage <= <bound>`; 1Click requires a tolerance and this adapter will not pick one for you",
			"path": "x3-lang/near_intents.py",
			"line": 421
		},
		{
			"code": "X3_NEAR_STATUS_UNKNOWN",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1846
		},
		{
			"code": "X3_NEAR_TIMEOUT_REQUIRED",
			"message": "a NEAR Intents swap needs `timeout <duration> refund <from asset>`: the deadline is when 1Click starts refunding, and it is the program's to state",
			"path": "x3-lang/near_intents.py",
			"line": 444
		},
		{
			"code": "X3_NEAR_TIMEOUT_UNIT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 244
		},
		{
			"code": "X3_NEAR_TIMESTAMP",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 267
		},
		{
			"code": "X3_NEAR_TOKENS",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 1117
		},
		{
			"code": "X3_NEAR_TYPECHECK",
			"message": "the program does not type-check",
			"path": "x3-lang/near_intents.py",
			"line": 1107
		},
		{
			"code": "X3_NEAR_UNREACHABLE",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/near_intents.py",
			"line": 890
		},
		{
			"code": "X3_PARSE_AMOUNT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/cli.py",
			"line": 137
		},
		{
			"code": "X3_PARSE_ASSET_REF",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/cli.py",
			"line": 106
		},
		{
			"code": "X3_PARSE_BRIDGE",
			"message": "expected bridge <via> <from> -> <to>",
			"path": "x3-lang/cli.py",
			"line": 295
		},
		{
			"code": "X3_PARSE_DECLARATION",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/cli.py",
			"line": 361
		},
		{
			"code": "X3_PARSE_EMPTY",
			"message": "input file is empty",
			"path": "x3-lang/cli.py",
			"line": 373
		},
		{
			"code": "X3_PARSE_ENDPOINT",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/cli.py",
			"line": 132
		},
		{
			"code": "X3_PARSE_FALLBACK",
			"message": "expected a fallback block",
			"path": "x3-lang/cli.py",
			"line": 230
		},
		{
			"code": "X3_PARSE_MANDATE",
			"message": "expected `under mandate <owner account>`",
			"path": "x3-lang/cli.py",
			"line": 469
		},
		{
			"code": "X3_PARSE_NO_INTENT",
			"message": "this file declares no `intent`: this surface reads one intent per file, and every top-level item here is a declaration it skips. A file whose subject is a bare `atomic_choice`, `strategy`, `objective` or `parallel` block is a program for the compiler, not an intent for this surface",
			"path": "x3-lang/cli.py",
			"line": 383
		},
		{
			"code": "X3_PARSE_OPERATION",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/cli.py",
			"line": 323
		},
		{
			"code": "X3_PARSE_RECEIVER",
			"message": "receiver requires an address",
			"path": "x3-lang/cli.py",
			"line": 114
		},
		{
			"code": "X3_PARSE_REFUND",
			"message": "expected refund <chain.asset> [to <receiver>]",
			"path": "x3-lang/cli.py",
			"line": 153
		},
		{
			"code": "X3_PARSE_REQUIRE",
			"message": "Context-dependent refusal. Inspect the exact condition and diagnostic in the pinned source.",
			"path": "x3-lang/cli.py",
			"line": 208
		},
		{
			"code": "X3_PARSE_ROUTE",
			"message": "empty route operation",
			"path": "x3-lang/cli.py",
			"line": 278
		},
		{
			"code": "X3_PARSE_SWAP",
			"message": "expected swap <dex> <from> -> <to>",
			"path": "x3-lang/cli.py",
			"line": 283
		},
		{
			"code": "X3_PARSE_TIMEOUT",
			"message": "timeout requires a duration",
			"path": "x3-lang/cli.py",
			"line": 458
		}
	],
	examples: {
		"near_mandate_agent": "// near_mandate_agent.x3 — what an owner lets an AI agent spend, enforced on NEAR by x3-guard.\n//\n// The owner sends this once (`near_intents.py mandate args`). From then on the agent account\n// can register swaps in the owner's name, and x3-guard refuses any that break a term:\n//\n// - `spend` and `per_payment`: Solana USDC only, at most 50 USDC a payment.\n// - `per_24h`: at most 200 USDC in any rolling 24 hours (and at most 64 payments).\n// - `allow recipients` / `allow assets`: where the money may go, and as what.\n// - `refund_to`: a failed swap refunds here. The agent cannot point refunds at itself.\n// - `require slippage` / `require fees`: the loosest bounds an agent's intent may declare.\n// - `approve above`: a payment over 30 USDC waits for one of the listed approvers.\n// - `expires`: the mandate ends 30 days after it is compiled. The owner can revoke it at\n//   any time (`near_intents.py mandate revoke`), and every unaccepted intent stops at once.\n//\n// Amounts are base units: 50 USDC at six decimals is 50_000_000.\n//\n// The accounts are placeholders. Replace them with accounts you control.\nmandate x3_shopping_agent {\n    owner x3-owner.near\n    agent x3-agent.near\n    spend Solana.USDC\n    per_payment 50000000\n    per_24h 200000000\n    allow recipients x3-demo.near\n    allow assets Near.USDC\n    refund_to 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    require slippage <= 1%\n    require fees <= 100 bps\n    approve above 30000000 by 1 of x3-owner.near\n    expires 30d\n}\n",
		"near_intents_agent_payment": "// near_intents_agent_payment.x3 — an AI agent's payment, under its owner's mandate.\n//\n// The same NEAR Intents swap as `near_intents_sol_to_near.x3`, with one more clause:\n// `under mandate x3-owner.near`. The agent account registers and accepts it through\n// x3-guard's agent methods, which check `near_mandate_agent.x3`'s terms on chain first:\n//\n//   near_intents.py mandate check near_mandate_agent.x3 near_intents_agent_payment.x3\n//   near_intents.py quote near_intents_agent_payment.x3 --live --mandate near_mandate_agent.x3 \\\n//       --guard-contract <x3-guard account>\n//\n// 25 USDC is under the mandate's 30 USDC approval threshold, so no approval is needed.\nintent near_intents_agent_payment {\n    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD\n    to Near.USDC receiver x3-demo.near\n    route {\n        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n    }\n    under mandate x3-owner.near\n    require slippage <= 0.5%\n    require fees <= 100 bps\n    require nonce unused agent_payment_001\n    timeout 10m refund Solana.USDC\n    on_fail rollback\n}\n",
		"simple_swap": "finality_policy strict {\n    chain arbitrum\n    requirement finalized\n    blocks 32\n}\n\nfinality_policy strict {\n    chain solana\n    requirement finalized\n    blocks 32\n}\n\nrisk_policy {\n    min_route_score 90\n}\n\nintent simple_swap {\n    from arbitrum.USDC amount 500\n    to solana.SOL receiver wallet\n\n    route {\n        bridge X3 arbitrum.USDC -> solana.SOL receiver wallet\n    }\n\n    require nonce unused simple_swap_001\n    require finality.arbitrum >= 32\n    require finality.solana >= 32\n    require slippage <= 50\n    require route_score >= 90\n\n    timeout 180s refund arbitrum.USDC to sender\n    on_fail rollback\n}\n\n// The bridge above cannot be claimed on the far side without evidence that the\n// source chain locked the funds and that the destination chain filled them.\n// Those are this program's proof obligations, so it declares them rather than\n// leaving the verifier to warn about each one.\nproofs required {\n    source_lock_proof\n    destination_fill_proof\n}\n",
		"events_and_host_calls": "// `emit` and a host call — the two instructions whose payload the compiler wrote by hand.\n//\n// Both go to the host (`emit` to the EVM backend, a call to the SVM backend), and both used to\n// build an artifact the verifier refused with `X3_VERIFY_FAILED: InvalidOperand`: the emitter\n// formatted the payload itself as `\"{name}:{args:?}\"` while the shared decoder had no arm for\n// `EMIT` (`0x60`) or `CALL_HOST` (`0x61`), and the string it wrote carried the compiler's own Rust\n// `Debug` output. They are records now, and this is the smallest program that exercises them:\n//\n//     x3c build examples/events_and_host_calls.x3 -o /tmp/events.x3b\n//     x3c explain /tmp/events.x3b      # the event and the calls, as records\n//     x3c run /tmp/events.x3b          # executes every instruction\n\n// A subscription item states its rate and charges through the host by name.\nsubscription keeper: 100, 30 {\n    emit Charged(100);\n}\n\n// `@subscribe` and `@sponsor` are host calls too: neither is a statement the VM can execute on\n// its own, so each asks the host for one by name.\n@subscribe(TransferDone)\n@sponsor\nfn main() {\n    emit TransferDone(1);\n}\n"
	}
};
var BASE = `https://github.com/Cyptopimpinainteazy/x3lang/blob/${reference_default.revision}/`;
var PROGRESS = "x3.bootcamp.v1.completed";
var button = "tap inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:border-primary focus-visible:outline-2 focus-visible:outline-primary";
var baseline = DATA.scenarios.find((s) => s.python.decision === "preflight_passed" && !s.contract_only);
function download(name, text) {
	const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function Bootcamp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)([]);
	const [storageNote, setStorageNote] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)(baseline.intent.source);
	const [mandate, setMandate] = (0, import_react.useState)(DATA.mandate.source);
	const [result, setResult] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
		try {
			const saved = JSON.parse(localStorage.getItem(PROGRESS) || "[]");
			if (Array.isArray(saved)) setDone(saved.filter((x) => typeof x === "string" && LESSONS.some((l) => l.id === x)));
		} catch {
			setStorageNote("Progress is available for this visit only.");
		}
	}, []);
	function mark(id) {
		setDone((prev) => {
			const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
			try {
				localStorage.setItem(PROGRESS, JSON.stringify(next));
			} catch {
				setStorageNote("Progress is available for this visit only.");
			}
			return next;
		});
	}
	const q = query.trim().toLowerCase();
	const lessons = LESSONS.filter((l) => JSON.stringify(l).toLowerCase().includes(q));
	const rules = reference_default.rules.filter((r) => `${r.code} ${r.message} ${r.path}`.toLowerCase().includes(q));
	function changeSource(value) {
		setSource(value);
		setResult(null);
	}
	async function run() {
		setBusy(true);
		setResult(null);
		try {
			const r = await evaluate({
				...DATA,
				mandate: {
					...DATA.mandate,
					source: mandate
				}
			}, {
				...baseline,
				intent: {
					...baseline.intent,
					source
				},
				assumed_guard_state: null
			});
			setResult({
				title: r.decision.replaceAll("_", " "),
				details: [
					...r.checks.map((c) => `${c.ok ? "PASS" : "REFUSE"} · ${c.guard}${c.detail ? ` — ${c.detail}` : ""}`),
					...r.denied_guards.filter((g) => !r.checks.some((c) => c.guard === g)).map((g) => `REFUSE · ${g}`),
					`Required approvals: ${r.approvals_needed}`
				]
			});
		} catch (e) {
			const err = e;
			setResult({
				title: err.code ? "Compile refusal" : "Evaluation unavailable",
				details: [`${err.code ? err.code + ": " : ""}${err.message}`]
			});
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		eyebrow: ".x3 Developer Academy",
		title: "Bootcamp",
		lede: "Learn the language. Understand the rules. Build something you can prove.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: "#curriculum",
			className: `${button} bg-primary text-bg`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 18 }), "Start learning"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: "#lab",
			className: button,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 18 }), "Open the practice lab"]
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-bootcamp-ready": ready,
			className: "mx-auto max-w-6xl px-5 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 grid gap-4 rounded-xl border border-border bg-surface p-5 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-accent",
							children: "12 lessons · two tracks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "NEAR intents & mandates + Rust compiler & local VM."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-fg",
								children: [
									done.length,
									" / ",
									LESSONS.length,
									" lessons marked complete"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", {
								className: "mt-3 w-full accent-primary",
								value: done.length,
								max: LESSONS.length,
								"aria-label": "Learning progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: ["Saved on this browser. Self-assessed, not certification. ", storageNote]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-accent",
							children: "Source-backed reference"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								"Curriculum: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
									href: `${BASE}docs/x3-lang/PROGRAMMING_GUIDE.md`,
									children: reference_default.revision.slice(0, 7)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Browser lab: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
									href: `https://github.com/Cyptopimpinainteazy/x3lang/tree/${reference_default.browserRevision}/x3-lang/near/demo`,
									children: reference_default.browserRevision.slice(0, 7)
								}),
								". Versions are intentionally explicit."
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mb-8 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "shrink-0 text-muted",
							size: 20
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Search lessons and rules"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "min-w-0 w-full bg-transparent text-fg outline-none",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search lessons, syntax, nonce, refunds, error codes…",
							type: "search"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "curriculum",
					className: "grid scroll-mt-28 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Bootcamp curriculum",
							className: "lg:sticky lg:top-28",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-xs uppercase tracking-widest text-muted",
									children: "Your field manual"
								}),
								lessons.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `#${l.id}`,
									className: "tap mb-1 flex min-h-11 items-start gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 text-accent",
										children: done.includes(l.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }) : l.track.slice(0, 2)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.title })]
								}, l.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 border-t border-border pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "tap block py-2 text-primary",
											href: "#examples",
											children: "Complete examples"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "tap block py-2 text-primary",
											href: "#lab",
											children: "Practice lab"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											className: "tap block py-2 text-primary",
											href: "#rules",
											children: [
												"Refusal reference (",
												rules.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											className: "tap block py-2 text-primary",
											to: "/playground",
											children: "Full attack playground ↗"
										})
									]
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 space-y-8",
						children: [lessons.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							role: "status",
							className: "rounded-xl border border-border p-6 text-muted",
							children: [
								"No lessons match “",
								query,
								"”. Try “mandate”, “Rust” or an error code; matching refusals are below."
							]
						}), lessons.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							id: l.id,
							className: "scroll-mt-28 rounded-xl border border-border bg-surface p-5 md:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-widest text-accent",
									children: l.track
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-2xl text-fg md:text-3xl",
									children: l.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-lg text-muted",
									children: l.summary
								}),
								l.sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "mt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg text-primary",
											children: s.title
										}),
										s.text.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 leading-relaxed text-muted",
											children: p
										}, i)),
										s.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
											title: "Commands / example",
											code: s.code
										})
									]
								}, s.title)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 rounded-lg border-l-2 border-accent bg-bg p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-widest text-accent",
										children: "Checkpoint"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed",
										children: l.exercise
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 flex flex-wrap gap-3 text-xs",
									children: l.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
										href: BASE + s,
										children: s.split("/").pop()
									}, s))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `${button} mt-5 ${done.includes(l.id) ? "text-primary" : ""}`,
									"aria-pressed": done.includes(l.id),
									onClick: () => mark(l.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), done.includes(l.id) ? "Marked complete" : "Mark lesson complete"]
								})
							]
						}, l.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "examples",
					className: "mt-16 scroll-mt-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl text-primary",
							children: "Complete source examples"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted",
							children: "Unmodified files from the curriculum revision. Accounts are examples, not destinations to fund. Select the matching toolchain before running."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-4 md:grid-cols-2",
							children: Object.entries(reference_default.examples).map(([name, code]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "min-w-0 rounded-xl border border-border bg-surface p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
										className: "tap min-h-11 cursor-pointer break-all font-mono text-sm text-fg",
										children: [name, ".x3"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
										title: name.startsWith("near") ? "NEAR adapter track" : "Rust compiler track",
										code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: button,
											onClick: () => download(`${name}.x3`, code),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), "Download .x3"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutLink, {
											href: `${BASE}x3-lang/examples/${name}.x3`,
											children: "Source"
										})]
									})
								]
							}, name))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "lab",
					className: "mt-16 scroll-mt-28 rounded-xl border border-border bg-surface p-5 md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl text-primary",
								children: "Practice lab"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border px-3 py-1 text-xs text-accent",
								children: "LOCAL POLICY ONLY · NO WALLET"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 leading-relaxed text-muted",
							children: [
								"Edit the owner mandate and payment, then run the real vendored checker. Uses captured token metadata, a fixed clock (",
								DATA.evaluated_at,
								"), no previous spends and no revocation. It does not query live Guard state, request quotes, detect on-chain replay, or send funds. Examples here come from browser revision ",
								reference_default.browserRevision.slice(0, 7),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: button,
								type: "button",
								disabled: busy,
								onClick: () => {
									changeSource(baseline.intent.source);
									setMandate(DATA.mandate.source);
								},
								children: "Reset example"
							}), ATTACKS.filter((a) => [
								"redirect-recipient",
								"drop-nonce",
								"over-cap"
							].includes(a.id)).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: button,
								type: "button",
								disabled: busy,
								onClick: () => {
									changeSource(applyAttack(baseline.intent.source, a));
									setMandate(DATA.mandate.source);
								},
								children: a.label
							}, a.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid min-w-0 gap-4 xl:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "min-w-0 text-sm",
								children: ["Owner mandate", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									"aria-label": "Owner mandate source",
									spellCheck: false,
									disabled: busy,
									value: mandate,
									onChange: (e) => {
										setMandate(e.target.value);
										setResult(null);
									},
									className: "mt-2 block min-h-96 w-full resize-y rounded-lg border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-fg"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "min-w-0 text-sm",
								children: ["Agent payment", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									"aria-label": "Agent payment source",
									spellCheck: false,
									disabled: busy,
									value: source,
									onChange: (e) => changeSource(e.target.value),
									className: "mt-2 block min-h-96 w-full resize-y rounded-lg border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-fg"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `${button} mt-5 bg-primary text-bg disabled:opacity-50`,
							disabled: busy,
							onClick: run,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 16 }), busy ? "Checking…" : "Run local check"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "status",
							"aria-live": "polite",
							className: "mt-5 rounded-lg border border-border bg-bg p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg capitalize",
								children: result?.title || "Ready to check"
							}), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: result.details.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "break-words font-mono text-xs leading-relaxed text-muted",
									children: d
								}, i))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "No result yet. Editing clears the previous result."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "rules",
					className: "mt-16 scroll-mt-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl text-primary",
							children: "Refusal reference"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 max-w-3xl leading-relaxed text-muted",
							children: [reference_default.rules.length, " code/source entries extracted from the pinned Python parser, NEAR adapter and mandate compiler. Search at the top of the page. Dynamic messages are explained at the linked source line. For the complete Rust grammar and verifier rules, use the source references in lessons 10–11."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-3 md:grid-cols-2",
							children: rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "min-w-0 rounded-xl border border-border bg-surface p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "break-all font-mono text-sm text-accent",
										children: r.code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 break-words text-sm leading-relaxed text-muted",
										children: r.message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(OutLink, {
											href: `${BASE}${r.path}#L${r.line}`,
											children: [
												r.path.split("/").pop(),
												":",
												r.line
											]
										})
									})
								]
							}, r.path + r.code))
						}),
						rules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted",
							children: "No matching refusal codes."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-wrap gap-4 border-t border-border pt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/playground",
							className: button,
							children: ["Continue in the attack playground ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/developers",
							className: button,
							children: "Developer source links"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/proof",
							className: button,
							children: "Inspect execution evidence"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Bootcamp as component };
