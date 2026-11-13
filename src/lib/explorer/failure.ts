/**
 * Public wording for a failed live Explorer lookup. The API returns only a fixed error code
 * (never upstream bodies or credentials), so the code is safe to show and is what an operator
 * needs to find the broken setting.
 *
 * Operator map (Vercel production environment variables):
 *   EXPLORER_CREDENTIAL_INVALID      NEAR_INTENTS_EXPLORER_JWT is not an Explorer key
 *                                    (payload needs key_type "explorer" and a partner_id).
 *   EXPLORER_COORDINATOR_UNAVAILABLE X3_EXPLORER_REDIS_URL (must be the https REST URL) or
 *                                    X3_EXPLORER_REDIS_TOKEN is wrong, or Redis is down.
 *   EXPLORER_AUTH_REJECTED           NEAR Intents answered 401/403 for the Explorer key.
 *   EXPLORER_UPSTREAM_UNAVAILABLE    NEAR Intents Explorer answered another non-2xx status.
 *   INVALID_EXPLORER_RESPONSE/CACHE  A response or cached page failed validation.
 *   EXPLORER_UNAVAILABLE             Timeout or network failure before any response.
 */
const HINTS: Record<string, string> = {
  EXPLORER_CREDENTIAL_INVALID: "This site's Explorer credential is not a valid Explorer key.",
  EXPLORER_COORDINATOR_UNAVAILABLE: "This site could not reach its request coordinator.",
  EXPLORER_AUTH_REJECTED: "NEAR Intents rejected this site's Explorer credential.",
  EXPLORER_UPSTREAM_UNAVAILABLE: "The NEAR Intents Explorer API returned an error.",
  INVALID_EXPLORER_RESPONSE: "The Explorer API returned a response this site could not read.",
  INVALID_EXPLORER_CACHE: "A cached Explorer response could not be read.",
  EXPLORER_UNAVAILABLE: "The Explorer request timed out or could not connect.",
};

/** Every error code `src/lib/explorer/client.mjs` and the API route can return. */
export const EXPLORER_ERROR_CODES: ReadonlySet<string> = new Set([
  ...Object.keys(HINTS),
  "EXPLORER_NOT_CONFIGURED",
  "EXPLORER_SCOPE_NOT_CONFIGURED",
  "EXPLORER_RATE_LIMITED",
  "INVALID_EXPLORER_FILTER",
  "INVALID_EXPLORER_STATUS",
  "INVALID_EXPLORER_CHAIN",
  "INVALID_EXPLORER_CURSOR",
]);

/** Shows only a code this site defines; anything else collapses to EXPLORER_UNAVAILABLE. */
export function explorerFailureCode(error: unknown): string {
  return typeof error === "string" && EXPLORER_ERROR_CODES.has(error)
    ? error
    : "EXPLORER_UNAVAILABLE";
}

export function explorerFailureMessage(error: unknown): string {
  const code = explorerFailureCode(error);
  const hint = HINTS[code] ?? "The lookup request was not accepted.";
  return `Live Explorer lookup failed (${code}). ${hint} No settlement conclusion can be drawn from live history; the recorded evidence below is unaffected.`;
}
