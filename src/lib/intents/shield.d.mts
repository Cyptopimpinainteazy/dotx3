export type ShieldReport = {
  status: string;
  reason?: string;
  securityMode: string;
  observedAt: string | null;
  incidents: Array<{
    scopeType: string;
    scopeValue: string;
    direction: string | null;
    publicDescription: string | null;
  }>;
};
export function publicIncidents(data: unknown, observedAt: string): ShieldReport;
export function createShieldReader(options?: {
  env?: NodeJS.ProcessEnv;
  fetcher?: typeof fetch;
  clock?: () => number;
}): () => Promise<ShieldReport>;
