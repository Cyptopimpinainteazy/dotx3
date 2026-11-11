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
