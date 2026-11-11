export function crosscheck(input: {chain: string | null; hash: string | null}): Promise<{status: number; body: Record<string,unknown>}>
