import { z } from "zod";
import { buildAnalytics, createDemoDataset, participantExportRows, responseExportRows, toCSV, type AnalyticsFilters, type Participant } from "@/lib/analytics";
import type { GameState } from "@/lib/game";
import { ApiError, database, json, requireResearcher } from "@/lib/server";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().startsWith(value));
const querySchema = z.object({
  participantId: z.string().max(120).optional(),
  objectiveId: z.string().max(80).optional(),
  topic: z.string().max(80).optional(),
  schoolYear: z.enum(["4", "5", "6"]).optional(),
  from: date.optional(),
  to: date.optional(),
  demo: z.enum(["true", "false", "1", "0"]).optional(),
  format: z.enum(["json", "responses", "participants"]).optional(),
  export: z.enum(["responses", "participants"]).optional(),
});

export async function researcherData(request: Request): Promise<Response> {
  await requireResearcher();
  const url = new URL(request.url);
  const input = querySchema.parse(Object.fromEntries([...url.searchParams].filter(([, value]) => value !== "")));
  if (input.from && input.to && input.from > input.to) throw new ApiError(400, "The start date must be before the end date.");
  const isDemo = input.demo === "true" || input.demo === "1";
  let participants: Participant[];
  let games: GameState[];
  if (isDemo) {
    ({ participants, games } = createDemoDataset());
  } else {
    const db = database();
    const [playerRows, gameRows] = await Promise.all([
      db.prepare("SELECT id,username,school_year,created_at,is_demo FROM players WHERE is_demo=0 ORDER BY created_at").all<{ id: string; username: string; school_year: number | null; created_at: string; is_demo: number }>(),
      db.prepare("SELECT state_json FROM games WHERE player_id IN(SELECT id FROM players WHERE is_demo=0) ORDER BY created_at").all<{ state_json: string }>(),
    ]);
    participants = playerRows.results.map((player) => ({ id: player.id, username: player.username, schoolYear: player.school_year, createdAt: player.created_at, isDemo: Boolean(player.is_demo) }));
    games = gameRows.results.map((row) => JSON.parse(row.state_json) as GameState);
  }
  const filters: AnalyticsFilters = { participantId: input.participantId, objectiveId: input.objectiveId, topic: input.topic, schoolYear: input.schoolYear, from: input.from, to: input.to, includeDemo: isDemo };
  const format = input.export ?? input.format ?? "json";
  if (format === "responses" || format === "participants") {
    const rows = format === "responses" ? responseExportRows(participants, games, filters) : participantExportRows(participants, games, filters);
    return new Response(toCSV(rows), { headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gutville-${isDemo ? "fictional-demo-" : ""}${format}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
    } });
  }
  return json({ ...buildAnalytics(participants, games, filters), dataSource: isDemo ? "fictional-demo" : "saved-players", generatedAt: new Date().toISOString() });
}
