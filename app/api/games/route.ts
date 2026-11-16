import { api, gamePost } from "@/lib/server";

export const POST = (request: Request) => api(() => gamePost(request));
