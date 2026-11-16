import { api, researcherSetup } from "@/lib/server";

export const POST = (request: Request) => api(() => researcherSetup(request));
