// Client for the DX3HACK faucet runner (x3lang: x3-lang/dx3hack_faucet). The runner holds the
// faucet operator's scoped key; this page never signs anything. Every rule that matters is
// enforced by the DX3HACK contract on NEAR, and every result links to its transaction.

export const DEFAULT_FAUCET_API = "https://faucet.x3star.net";
export const BURN_AT_UTC = "2026-11-25 23:59:59 UTC";
export const DX3HACK_DECIMALS = 6;

export type ForbiddenCase = "dex" | "lookalike" | "nested";

export const FORBIDDEN_CASES: { id: ForbiddenCase; label: string; why: string }[] = [
  {
    id: "dex",
    label: "Allowlist the Ref Finance DEX",
    why: "A DEX pool would make DX3HACK tradeable. Only judge accounts may hold it.",
  },
  {
    id: "lookalike",
    label: "Allowlist a lookalike parent",
    why: "evil-judges… ends with the right text but is not a subaccount of judges….",
  },
  {
    id: "nested",
    label: "Allowlist a nested account",
    why: "pool.j1.judges… is two levels down. Only direct subaccounts count.",
  },
];

export interface ContractConfig {
  owner_id: string;
  faucet_operator_id: string;
  holder_parent_id: string;
  active: boolean;
  paused: boolean;
  expires_at?: string;
  max_supply?: string;
  minted_total?: string;
  claim_amount?: string;
  claim_cooldown_sec?: number;
  faucet_daily_cap?: string;
  faucet_minted_today?: string;
  max_transfers_per_day?: number;
  holders?: number;
  max_holders?: number;
  burn_program_sha256?: string;
}

export interface FaucetStatus {
  network: "mainnet" | "testnet";
  token: string;
  operator: string;
  holder_parent: string;
  explorer: string;
  turnstile_site_key: string | null;
  paused_reason: string | null;
  contract: ContractConfig;
}

export interface FaucetTx {
  method: string;
  args: Record<string, string>;
  tx_hash: string;
  outcome: "success" | "refused" | "unknown";
  reason: string | null;
  url: string;
}

export interface HolderState {
  account: string;
  is_holder: boolean;
  balance: string;
  claim_available_at_ns: string;
  /** Seconds until the next claim, measured on the chain's clock by the runner. */
  claim_wait_sec: number;
  transfers_left_today: number;
  url: string;
}

export interface ClaimResult {
  holder: string;
  txs: FaucetTx[];
  claimed: boolean;
  reason: string | null;
  state: HolderState | null;
}

export interface ForbiddenResult extends FaucetTx {
  case: ForbiddenCase;
  expected: "refused";
  as_expected: boolean;
}

export interface FeedEntry extends Omit<FaucetTx, "url"> {
  seq: number;
  at: number;
  purpose: string;
}

export class FaucetApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/** Format base units (6 decimals) as a human amount, without floating point. */
export function formatDx3(base: string | undefined | null): string {
  if (!base || !/^\d+$/.test(base)) return "0";
  const padded = base.padStart(DX3HACK_DECIMALS + 1, "0");
  const whole = padded.slice(0, -DX3HACK_DECIMALS).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const frac = padded.slice(-DX3HACK_DECIMALS).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

/** Whole minutes (rounded up) for a wait in seconds; the runner measures it on chain time. */
export function waitMinutes(seconds: number | undefined | null): number {
  return typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : 0;
}

export function normalizeBase(base: string | undefined): string {
  const value = (base || DEFAULT_FAUCET_API).trim().replace(/\/+$/, "");
  if (!/^https:\/\/[^/]+/.test(value) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(value)) {
    throw new Error(`faucet API must be https: ${value}`);
  }
  return value;
}

type Fetch = typeof fetch;

async function request<T>(fetcher: Fetch, url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetcher(url, { cache: "no-store", ...init, signal: init?.signal ?? AbortSignal.timeout(90_000) });
  } catch {
    throw new FaucetApiError("The faucet runner can't be reached right now.", "unreachable", 0);
  }
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const err = (data as { error?: { message?: string; code?: string } } | null)?.error;
    throw new FaucetApiError(err?.message || `The faucet answered ${response.status}.`, err?.code || "error", response.status);
  }
  return data as T;
}

export function faucetClient(base: string | undefined, fetcher: Fetch = fetch) {
  const root = normalizeBase(base);
  const post = <T,>(path: string, body: Record<string, unknown>) =>
    request<T>(fetcher, `${root}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  return {
    root,
    status: () => request<FaucetStatus>(fetcher, `${root}/v1/faucet/status`),
    feed: () => request<{ txs: FeedEntry[] }>(fetcher, `${root}/v1/faucet/feed`),
    holder: (account: string) =>
      request<HolderState>(fetcher, `${root}/v1/faucet/holders/${encodeURIComponent(account)}`),
    claim: (turnstileToken: string | null, holder?: string) =>
      post<ClaimResult>("/v1/faucet/claim", {
        ...(turnstileToken ? { turnstileToken } : {}),
        ...(holder ? { holder } : {}),
      }),
    forbidden: (kind: ForbiddenCase, turnstileToken: string | null) =>
      post<ForbiddenResult>("/v1/faucet/forbidden", {
        case: kind,
        ...(turnstileToken ? { turnstileToken } : {}),
      }),
  };
}

const HOLDER_KEY = "dx3hack.holder";

/** Remembered holder for "claim again"; storage can be unavailable, so failures are silent. */
export function rememberHolder(account: string | null): void {
  try {
    if (account) window.localStorage.setItem(HOLDER_KEY, account);
    else window.localStorage.removeItem(HOLDER_KEY);
  } catch {
    /* private mode or blocked storage */
  }
}

export function recallHolder(parent: string): string | null {
  try {
    const value = window.localStorage.getItem(HOLDER_KEY);
    return value && value.endsWith(`.${parent}`) && /^j\d+\./.test(value) ? value : null;
  } catch {
    return null;
  }
}
