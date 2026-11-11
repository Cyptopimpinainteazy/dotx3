export class ExplorerError extends Error { code: string; status: number; retryAfter: number; }
export interface ExplorerPage {
  source: string; evidenceState: 'provider-reported'; independentlyVerified: false;
  executionAllowed: false; observedAt: string; cached: boolean;
  transactions: Array<Record<string, string | null>>;
  nextCursor: {lastDepositAddress: string; lastDepositMemo: string | null} | null;
}
export function createExplorerClient(options?: {env?: NodeJS.ProcessEnv; fetchImpl?: typeof fetch}): {
  transactions(input?: URLSearchParams): Promise<ExplorerPage>;
};
