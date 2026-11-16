import { api } from "@/lib/server";
import { researcherData } from "@/lib/server/research-data";

export const GET = (request: Request) => api(() => researcherData(request));
