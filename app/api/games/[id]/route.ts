import { api, gameGet } from "@/lib/server";

export const GET = (request: Request, context: { params: Promise<{ id: string }> }) => api(async () => gameGet(request, (await context.params).id));
