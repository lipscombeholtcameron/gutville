import { api, getResearcherStatus, json } from "@/lib/server";

export const GET = () => api(async () => json(await getResearcherStatus()));
