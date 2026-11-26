import { useState } from "react";
import example from "../../vendor/x3lang/x3-lang/coin/examples/dual_vm.json";
import exampleSource from "../../vendor/x3lang/x3-lang/coin/examples/dual_vm.x3?raw";

type CoinSpec = {
  name: string;
  symbol: string;
  decimals: string;
  cap: string;
  evm: { chain_id: string; contract: string; recipient: string; allocation: string };
  svm: { genesis_hash: string; mint: string; recipient: string; allocation: string };
};
type CoinBuild = {
  source: string;
  evm_solidity: string;
  svm_issuance: Record<string, unknown>;
  manifest: Record<string, unknown>;
  declaration_hash: string;
  source_sha256: string;
};
const initial: CoinSpec = { ...example, decimals: String(example.decimals) };
const actionStyle = "min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-fg";
const primaryStyle =
  "min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-bg disabled:opacity-50";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0 text-sm text-fg">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        className="mt-1 block min-h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm text-fg"
      />
    </label>
  );
}

function saveFile(name: string, contents: string) {
  const type = name.endsWith(".json") ? "application/json" : "text/plain;charset=utf-8";
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function CoinStudio() {
  const [spec, setSpec] = useState<CoinSpec>(initial);
  const [source, setSource] = useState(exampleSource);
  const [mode, setMode] = useState<"form" | "source">("form");
  const [busy, setBusy] = useState(false);
  const [build, setBuild] = useState<CoinBuild | null>(null);
  const [error, setError] = useState("");
  const clear = () => {
    setBuild(null);
    setError("");
  };
  const edit = (next: CoinSpec) => {
    setSpec(next);
    clear();
  };

  async function generate() {
    if (busy) return;
    clear();
    setBusy(true);
    try {
      const input = mode === "form" ? { spec } : { source };
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "coin-v1", ...input }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("The coin compiler is unavailable.");
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Coin compilation failed.");
      if (
        !result.source_sha256 ||
        typeof result.evm_solidity !== "string" ||
        !result.svm_issuance ||
        !result.manifest ||
        typeof result.source !== "string"
      ) {
        throw new Error("The compiler returned an incomplete coin build.");
      }
      setBuild(result);
      setSource(result.source);
      setMode("source");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Coin compilation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 md:p-8">
      <h2 className="font-display text-2xl text-fg">Coin Studio</h2>
      <p className="mt-2 max-w-3xl text-muted">
        Write one fixed-supply .x3 declaration and split its opening supply between an ERC-20
        contract and a Solana SPL mint. The studio generates source and unsigned issuance
        instructions. Moving balances between the two networks requires a separate transfer
        integration.
      </p>
      <div className="my-5 flex flex-wrap gap-2" aria-label="Coin declaration input">
        {(["form", "source"] as const).map((value) => (
          <button
            key={value}
            aria-pressed={mode === value}
            disabled={busy}
            className={mode === value ? primaryStyle : actionStyle}
            onClick={() => {
              if (value !== mode) {
                setMode(value);
                clear();
              }
            }}
          >
            {value === "form" ? "Coin settings" : "Edit .x3 source"}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void generate();
        }}
      >
        <fieldset disabled={busy} className="min-w-0">
          {mode === "form" ? (
            <>
              <p className="mb-4 max-w-3xl text-sm text-muted">
                The example uses illustrative recipients. Enter amounts in whole base units and use
                a predetermined contract address and mint public key for each network.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Coin name"
                  value={spec.name}
                  onChange={(name) => edit({ ...spec, name })}
                />
                <Field
                  label="Symbol"
                  value={spec.symbol}
                  onChange={(symbol) => edit({ ...spec, symbol })}
                />
                <Field
                  label="Decimals"
                  value={spec.decimals}
                  onChange={(decimals) => edit({ ...spec, decimals })}
                />
                <Field
                  label="Total cap (base units)"
                  value={spec.cap}
                  onChange={(cap) => edit({ ...spec, cap })}
                />
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <fieldset className="grid min-w-0 gap-3">
                  <legend className="mb-3 font-display text-lg text-primary">EVM contract</legend>
                  <Field
                    label="Chain ID"
                    value={spec.evm.chain_id}
                    onChange={(chain_id) => edit({ ...spec, evm: { ...spec.evm, chain_id } })}
                  />
                  <Field
                    label="Contract address"
                    value={spec.evm.contract}
                    onChange={(contract) => edit({ ...spec, evm: { ...spec.evm, contract } })}
                  />
                  <Field
                    label="EVM recipient"
                    value={spec.evm.recipient}
                    onChange={(recipient) => edit({ ...spec, evm: { ...spec.evm, recipient } })}
                  />
                  <Field
                    label="EVM allocation (base units)"
                    value={spec.evm.allocation}
                    onChange={(allocation) => edit({ ...spec, evm: { ...spec.evm, allocation } })}
                  />
                </fieldset>
                <fieldset className="grid min-w-0 gap-3">
                  <legend className="mb-3 font-display text-lg text-primary">
                    Solana SPL mint
                  </legend>
                  <Field
                    label="Cluster genesis hash"
                    value={spec.svm.genesis_hash}
                    onChange={(genesis_hash) =>
                      edit({ ...spec, svm: { ...spec.svm, genesis_hash } })
                    }
                  />
                  <Field
                    label="Mint public key"
                    value={spec.svm.mint}
                    onChange={(mint) => edit({ ...spec, svm: { ...spec.svm, mint } })}
                  />
                  <Field
                    label="Solana recipient wallet"
                    value={spec.svm.recipient}
                    onChange={(recipient) => edit({ ...spec, svm: { ...spec.svm, recipient } })}
                  />
                  <Field
                    label="Solana allocation (base units)"
                    value={spec.svm.allocation}
                    onChange={(allocation) => edit({ ...spec, svm: { ...spec.svm, allocation } })}
                  />
                </fieldset>
              </div>
            </>
          ) : (
            <label className="block text-sm text-fg">
              Coin declaration
              <textarea
                aria-label="Coin declaration"
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  clear();
                }}
                spellCheck={false}
                rows={15}
                className="mt-2 w-full rounded-lg border border-border bg-bg p-4 font-mono text-sm text-fg"
              />
            </label>
          )}
          <button type="submit" className={`mt-5 ${primaryStyle}`}>
            {busy
              ? "Generating…"
              : mode === "form"
                ? "Generate coin artifacts"
                : "Build from source"}
          </button>
        </fieldset>
      </form>
      {error && (
        <p role="alert" className="mt-4 break-words text-accent">
          {error}
        </p>
      )}
      {build && (
        <section
          aria-label="Generated artifacts"
          aria-live="polite"
          className="mt-6 border-t border-border pt-5"
        >
          <h3 className="font-display text-xl text-primary">Generated artifacts</h3>
          <p className="mt-2 break-all text-sm text-muted">
            Declaration hash <code>{build.declaration_hash}</code>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["Download .x3 source", "coin.x3", build.source],
              ["Download Solidity", "X3IssuedCoin.sol", build.evm_solidity],
              [
                "Download SPL issuance plan",
                "spl-issuance.json",
                JSON.stringify(build.svm_issuance, null, 2) + "\n",
              ],
              [
                "Download manifest",
                "coin-manifest.json",
                JSON.stringify(build.manifest, null, 2) + "\n",
              ],
            ].map(([label, filename, contents]) => (
              <button
                className={actionStyle}
                key={filename}
                onClick={() => saveFile(filename, contents)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
