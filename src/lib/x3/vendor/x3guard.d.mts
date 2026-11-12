// Types for the vendored x3guard.mjs (see PROVENANCE.md). Only what this site calls.

export const ONE_CLICK_MANAGER_PUBLIC_KEY: string;
export const MAX_QUOTE_AGE_S: number;

export class X3Error extends Error {
  constructor(code: string, message: string, options?: { line?: number | null; field?: string | null; detail?: unknown });
  code: string;
  line: number | null;
  field: string | null;
  detail: unknown;
}

export interface QuoteResponse {
  quote: Record<string, unknown>;
  quoteRequest: Record<string, unknown>;
  signature: string;
  timestamp: string;
  [key: string]: unknown;
}

export function signedQuotePayload(response: QuoteResponse): string;
export function quoteHash(response: QuoteResponse): Promise<string>;
export function checkQuoteSignature(
  response: QuoteResponse,
  managerPublicKey?: string,
): Promise<{ valid: boolean; reason: string; hash: string | null }>;
export function webCryptoProblem(g?: unknown): string | null;
export function sha256Hex(text: string): Promise<string>;

export function parseMandate(source: string): Record<string, unknown>;
export function lowerMandate(
  parsed: Record<string, unknown>,
  tokens: unknown[],
  nowMs: number,
  sourceSha256: string,
): { name: string; owner: string; agent: string; terms: Record<string, unknown>; expires: string };

export const MAX_PAYMENTS_PER_WINDOW: number;

/** A parsed `intent`. The tutorial only passes it between the calls below. */
export type ParsedIntent = Record<string, unknown>;
export interface TypeError { code: string; message: string; line?: number | null }
/** One lowered NEAR Intents leg. */
export interface Leg {
  amount: string | bigint;
  recipient: string;
  refund_to: string;
  slippage_bps: number;
  fee_cap_bps: number | null;
  deadline: string;
  mandate_owner?: string | null;
  [key: string]: unknown;
}
export interface MandateCheck { guard: string; ok: boolean; detail: string }

export function parse(source: string): ParsedIntent;
export function typecheck(intent: ParsedIntent): TypeError[];
export function lower(intent: ParsedIntent, nowMs?: number): Leg;
export function buildQuoteRequest(leg: Leg, tokens: unknown[], options?: { dry?: boolean }): Record<string, unknown>;
export function policyFor(leg: Leg, request: Record<string, unknown>, programSha256: string): Record<string, unknown> & { amount: string };
export function checkMandate(mandate: Record<string, unknown>, policy: Record<string, unknown>, nowMs: number): MandateCheck[];
export function approvalsNeeded(mandate: Record<string, unknown>, amount: string | bigint): number;
