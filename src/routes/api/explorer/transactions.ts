import { createFileRoute } from '@tanstack/react-router';
import { createExplorerClient, ExplorerError } from '@/lib/explorer/client.mjs';
const explorer = createExplorerClient();
export const Route = createFileRoute('/api/explorer/transactions')({ server: { handlers: {
  GET: async ({ request }) => {
    const headers: Record<string,string> = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
    try {
      return Response.json(await explorer.transactions(new URL(request.url).searchParams), {headers});
    } catch (error) {
      const known = error instanceof ExplorerError;
      if (known && error.retryAfter) headers['Retry-After'] = String(error.retryAfter);
      return Response.json({error:known ? error.code : 'EXPLORER_UNAVAILABLE', independentlyVerified:false},
        {status:known ? error.status : 503, headers});
    }
  }
}}});
