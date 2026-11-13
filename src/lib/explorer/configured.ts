/**
 * Whether this deployment has the server-only Explorer settings (see README.md here).
 * Reports presence only: no value, length or prefix of any secret ever leaves the server.
 */
export const EXPLORER_ENV_KEYS = [
  "NEAR_INTENTS_EXPLORER_JWT",
  "X3_EXPLORER_REDIS_URL",
  "X3_EXPLORER_REDIS_TOKEN",
  "X3_EXPLORER_SEARCH",
] as const;

export function explorerConfigured(env: Record<string, string | undefined>): boolean {
  return EXPLORER_ENV_KEYS.every((key) => Boolean(env[key]?.trim()));
}
