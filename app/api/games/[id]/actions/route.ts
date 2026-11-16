import { api, gameActionPost } from "@/lib/server";

export const POST = (request: Request, context: { params: Promise<{ id: string }> }) => api(async () => gameActionPost(request, (await context.params).id));
