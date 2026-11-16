import { api, playerDelete, playerGet, playerPost } from "@/lib/server";

export const GET = (request: Request) => api(() => playerGet(request));
export const POST = (request: Request) => api(() => playerPost(request));
export const DELETE = (request: Request) => api(() => playerDelete(request));
