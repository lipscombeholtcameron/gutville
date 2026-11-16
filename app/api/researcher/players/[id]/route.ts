import { api, researcherPlayerDelete } from "@/lib/server";

export const DELETE = (request: Request, context: { params: Promise<{ id: string }> }) => api(async () => researcherPlayerDelete(request, (await context.params).id));
