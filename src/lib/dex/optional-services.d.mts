export function optionalService(path: string, params: URLSearchParams): Promise<{status:number;body:Record<string,unknown>} | null>;
