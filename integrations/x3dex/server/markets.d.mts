export function createMarketService(config?: { fetcher?: typeof fetch; clock?: () => number }): { get(): Promise<{asOf: number | null; source: string; pools: unknown[]; partial: boolean; stale: boolean; errors: string[]; executable: false}> }

export function readJson(url: string): Promise<unknown>;
