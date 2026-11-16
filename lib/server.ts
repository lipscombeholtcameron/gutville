import { env } from "cloudflare:workers";
import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { advanceGame, createGame, publicGame, type GameAction, type GameState } from "@/lib/game";

type ResearchEnv = Cloudflare.Env & {
  RESEARCHER_USER_ID?: string;
  RESEARCHER_SETUP_ENABLED?: string;
  RESEARCHER_SETUP_TOKEN?: string;
};
const COOKIE = "gutville_player";
const SESSION_DAYS = 180;
const ID = z.string().min(1).max(120).regex(/^[a-zA-Z0-9_-]+$/);
type PlayerRow = { id: string; username: string; school_year: number | null; created_at: string; is_demo: number };
type GameRow = { id: string; player_id: string; state_json: string; revision: number; status: string };

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) { super(message); }
}

export function database(): D1Database {
  if (!env.DB) throw new ApiError(503, "The town's saving service is resting. Please try again shortly.", "storage_unavailable");
  return env.DB;
}

export function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", "no-store, private");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  return Response.json(data, { status, headers: responseHeaders });
}

export async function api(handler: () => Promise<Response>): Promise<Response> {
  try { return await handler(); }
  catch (error) {
    if (error instanceof ApiError) return json({ error: error.message, code: error.code }, error.status);
    if (error instanceof z.ZodError) return json({ error: "Please check the information and try again.", code: "invalid_input" }, 400);
    console.error("Gutville API failed", error instanceof Error ? error.message : "Unknown error");
    return json({ error: "We couldn't save that just yet. Please try again.", code: "service_error" }, 503);
  }
}

export function sameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new ApiError(403, "This request must come from Gutville.");
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new ApiError(403, "This request must come from Gutville.");
}

export async function body<T extends z.ZodTypeAny>(request: Request, schema: T): Promise<z.infer<T>> {
  sameOrigin(request);
  if (!request.headers.get("content-type")?.includes("application/json")) throw new ApiError(415, "Please send JSON.");
  if (Number(request.headers.get("content-length") || 0) > 16_384) throw new ApiError(413, "That request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "The request is empty.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 16_384) { await reader.cancel(); throw new ApiError(413, "That request is too large."); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let parsed: unknown;
  try { parsed = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new ApiError(400, "That request could not be read."); }
  return schema.parse(parsed);
}

function randomIndex(size: number): number {
  const limit = Math.floor(0x1_0000_0000 / size) * size;
  const values = new Uint32Array(1);
  do { crypto.getRandomValues(values); } while (values[0] >= limit);
  return values[0] % size;
}

function secureRandom(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000;
}

async function digest(value: string): Promise<string> {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))), (v) => v.toString(16).padStart(2, "0")).join("");
}

function cookieToken(request: Request): string | null {
  const match = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  const token = match?.slice(COOKIE.length + 1);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}

function sessionCookie(request: Request, token: string, maxAge = SESSION_DAYS * 86400): string {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}

function profile(player: PlayerRow) {
  return { id: player.id, username: player.username, schoolYear: player.school_year, createdAt: player.created_at };
}

export async function currentPlayer(request: Request): Promise<PlayerRow | null> {
  const token = cookieToken(request);
  if (!token) return null;
  return database().prepare("SELECT p.* FROM players p JOIN guest_sessions s ON s.player_id=p.id WHERE s.token_hash=? AND s.expires_at>?")
    .bind(await digest(token), new Date().toISOString()).first<PlayerRow>();
}

async function requirePlayer(request: Request): Promise<PlayerRow> {
  const player = await currentPlayer(request);
  if (!player) throw new ApiError(401, "Choose your player name to begin.", "player_required");
  return player;
}

async function activeGame(playerId: string): Promise<GameRow | null> {
  return database().prepare("SELECT * FROM games WHERE player_id=? AND status='active' ORDER BY created_at DESC LIMIT 1").bind(playerId).first<GameRow>();
}

export async function playerGet(request: Request): Promise<Response> {
  const player = await currentPlayer(request);
  if (!player) return json({ player: null, game: null });
  const game = await activeGame(player.id);
  return json({ player: profile(player), game: game ? publicGame(JSON.parse(game.state_json)) : null, revision: game?.revision });
}

const playerInput = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("new"), schoolYear: z.union([z.literal(4), z.literal(5), z.literal(6)]).nullish() }).strict(),
  z.object({ mode: z.literal("return"), username: z.string().trim().min(3).max(80) }).strict(),
]);

const ADJECTIVES = ["Jumping", "Bouncy", "Brave", "Sunny", "Jolly", "Dancing", "Curious", "Happy", "Clever", "Cheerful", "Gentle", "Kind", "Bright", "Wiggly", "Sparkly", "Cosy", "Merry", "Swift", "Playful", "Friendly", "Sleepy", "Daring", "Dreamy", "Peppy", "Breezy", "Smiling", "Helpful", "Chirpy", "Twinkly", "Dazzling", "Lively", "Nimble", "Fluffy", "Fuzzy", "Snuggly", "Whistling", "Wandering", "Galloping", "Glowing", "Waving", "Rustling", "Singing", "Skipping", "Twirling", "Starry", "Mellow", "Charming", "Colourful", "Dappled", "Golden"];
const ANIMALS = ["Tiger", "Otter", "Panda", "Badger", "Robin", "Fox", "Dolphin", "Penguin", "Koala", "Rabbit", "Hedgehog", "Squirrel", "Turtle", "Owl", "Lemur", "Puffin", "Seal", "Butterfly", "Elephant", "Giraffe", "Llama", "Alpaca", "Zebra", "Parrot", "Duck", "Goose", "Swan", "Horse", "Frog", "Gecko", "Chameleon", "Deer", "Gazelle", "Meerkat", "Marmot", "Wombat", "Capybara", "Narwhal", "Whale", "Walrus", "Manatee", "Octopus", "Starfish", "Seahorse", "Cricket", "Firefly", "Dragonfly", "Toucan", "Pelican", "Flamingo"];
function normalizeUsername(value: string) { return value.trim().toLowerCase().replace(/\s+/g, " "); }

export async function playerPost(request: Request): Promise<Response> {
  const input = await body(request, playerInput);
  const db = database();
  let player: PlayerRow | null = null;
  if (input.mode === "return") {
    player = await db.prepare("SELECT * FROM players WHERE normalized_username=? AND is_demo=0").bind(normalizeUsername(input.username)).first<PlayerRow>();
    if (!player) throw new ApiError(404, "We couldn't find that name. Check the spelling, or choose New player.", "player_not_found");
  } else {
    for (let attempt = 0; attempt < 48 && !player; attempt++) {
      const adjective = ADJECTIVES[randomIndex(ADJECTIVES.length)];
      const extra = attempt >= 8 ? `${ADJECTIVES[randomIndex(ADJECTIVES.length)]} ` : "";
      const username = `${extra}${adjective} ${ANIMALS[randomIndex(ANIMALS.length)]}`;
      const candidate: PlayerRow = { id: crypto.randomUUID(), username, school_year: input.schoolYear ?? null, created_at: new Date().toISOString(), is_demo: 0 };
      const result = await db.prepare("INSERT INTO players(id,username,normalized_username,school_year,created_at,is_demo) VALUES (?,?,?,?,?,0) ON CONFLICT(normalized_username) DO NOTHING")
        .bind(candidate.id, username, normalizeUsername(username), candidate.school_year, candidate.created_at).run();
      if (result.meta.changes === 1) player = candidate;
    }
    if (!player) throw new ApiError(503, "We need a moment to find you a new name. Please try again.");
  }
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (v) => v.toString(16).padStart(2, "0")).join("");
  const now = new Date();
  const old = cookieToken(request);
  const statements = [db.prepare("INSERT INTO guest_sessions(token_hash,player_id,created_at,expires_at) VALUES (?,?,?,?)")
    .bind(await digest(token), player.id, now.toISOString(), new Date(now.getTime() + SESSION_DAYS * 86400000).toISOString())];
  if (old) statements.push(db.prepare("DELETE FROM guest_sessions WHERE token_hash=?").bind(await digest(old)));
  await db.batch(statements);
  const game = await activeGame(player.id);
  return json({ player: profile(player), game: game ? publicGame(JSON.parse(game.state_json)) : null, revision: game?.revision }, input.mode === "new" ? 201 : 200, { "Set-Cookie": sessionCookie(request, token) });
}

export async function playerDelete(request: Request): Promise<Response> {
  sameOrigin(request);
  const token = cookieToken(request);
  if (token) await database().prepare("DELETE FROM guest_sessions WHERE token_hash=?").bind(await digest(token)).run();
  return json({ player: null, game: null }, 200, { "Set-Cookie": sessionCookie(request, "", 0) });
}

export async function gamePost(request: Request): Promise<Response> {
  sameOrigin(request);
  const player = await requirePlayer(request);
  const existing = await activeGame(player.id);
  if (existing) return json({ game: publicGame(JSON.parse(existing.state_json)), revision: existing.revision });
  const db = database();
  const history = await db.prepare("SELECT state_json FROM games WHERE player_id=? ORDER BY created_at").bind(player.id).all<{ state_json: string }>();
  const state = createGame({ id: crypto.randomUUID(), participantId: player.id, history: history.results.map((game) => JSON.parse(game.state_json) as GameState), now: new Date().toISOString() }, secureRandom);
  await db.prepare("INSERT INTO games(id,player_id,state_json,revision,status,created_at,updated_at) VALUES (?,?,?,0,'active',?,?) ON CONFLICT DO NOTHING")
    .bind(state.id, player.id, JSON.stringify(state), state.createdAt, state.updatedAt).run();
  const saved = await activeGame(player.id);
  if (!saved) throw new ApiError(503, "Your game couldn't be started. Please try again.");
  return json({ game: publicGame(JSON.parse(saved.state_json)), revision: saved.revision }, 201);
}

async function ownedGame(request: Request, gameId: string): Promise<GameRow> {
  ID.parse(gameId);
  const player = await requirePlayer(request);
  const game = await database().prepare("SELECT * FROM games WHERE id=? AND player_id=?").bind(gameId, player.id).first<GameRow>();
  if (!game) throw new ApiError(404, "That game could not be found.");
  return game;
}

export async function gameGet(request: Request, gameId: string): Promise<Response> {
  const row = await ownedGame(request, gameId);
  return json({ game: publicGame(JSON.parse(row.state_json)), revision: row.revision });
}

const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("roll") }).strict(),
  z.object({ type: z.literal("answer"), optionId: z.string().min(1).max(80) }).strict(),
  z.object({ type: z.literal("continue") }).strict(),
  z.object({ type: z.literal("retry") }).strict(),
  z.object({ type: z.literal("pause") }).strict(),
  z.object({ type: z.literal("resume") }).strict(),
  z.object({ type: z.literal("enjoyment"), value: z.enum(["loved", "okay", "not-yet", "skip"]) }).strict(),
]);
const actionInput = z.object({ actionId: ID, revision: z.number().int().min(0).max(100000), action: actionSchema }).strict();

export async function gameActionPost(request: Request, gameId: string): Promise<Response> {
  const input = await body(request, actionInput);
  const row = await ownedGame(request, gameId);
  const db = database();
  const previous = await db.prepare("SELECT result_json FROM game_actions WHERE game_id=? AND action_id=?").bind(gameId, input.actionId).first<{ result_json: string }>();
  if (previous) return json(JSON.parse(previous.result_json));
  if (row.revision !== input.revision) return json({ error: "This game has changed. We've loaded its latest move.", code: "revision_conflict", game: publicGame(JSON.parse(row.state_json)), revision: row.revision }, 409);
  let next: GameState;
  try { next = advanceGame(JSON.parse(row.state_json) as GameState, input.action as GameAction, { roll: randomIndex(6) + 1, random: secureRandom, now: new Date().toISOString() }); }
  catch (error) { throw new ApiError(400, error instanceof Error ? error.message : "That move isn't available yet.", "invalid_action"); }
  const revision = row.revision + 1;
  const commit = crypto.randomUUID();
  const result = { game: publicGame(next), revision };
  const statements: D1PreparedStatement[] = [
    db.prepare("INSERT INTO game_actions(id,game_id,action_id,expected_revision,commit_token,result_json,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM games WHERE id=? AND revision=?) ON CONFLICT(game_id,action_id) DO NOTHING")
      .bind(crypto.randomUUID(), gameId, input.actionId, row.revision, commit, JSON.stringify(result), next.updatedAt, gameId, row.revision),
    db.prepare("UPDATE games SET state_json=?,revision=?,status=?,last_action_id=?,updated_at=?,completed_at=? WHERE id=? AND revision=? AND EXISTS(SELECT 1 FROM game_actions WHERE game_id=? AND action_id=? AND commit_token=?)")
      .bind(JSON.stringify(next), revision, next.phase === "finished" ? "completed" : "active", input.actionId, next.updatedAt, next.completedAt ?? null, gameId, row.revision, gameId, input.actionId, commit),
  ];
  // The commit token makes every row conditional on this exact successful
  // transaction. A duplicate action cannot overwrite its original random roll.
  const gate = "EXISTS(SELECT 1 FROM games g JOIN game_actions a ON a.game_id=g.id WHERE g.id=? AND g.revision=? AND g.last_action_id=? AND a.action_id=? AND a.commit_token=?)";
  const gateValues = [gameId, revision, input.actionId, input.actionId, commit];
  for (const response of next.responses) {
    statements.push(db.prepare(`INSERT INTO responses(id,game_id,player_id,objective_id,set_id,question_id,content_version,stage,first_option_id,first_correct,attempts_json,started_at,submitted_at,response_ms) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE ${gate} ON CONFLICT(id) DO UPDATE SET attempts_json=excluded.attempts_json`)
      .bind(response.id, gameId, row.player_id, response.objectiveId, response.setId, response.questionId, response.contentVersion, response.stage, response.firstOptionId, Number(response.firstCorrect), JSON.stringify(response.attempts), response.startedAt, response.submittedAt, response.responseMs, ...gateValues));
  }
  for (const exposure of next.exposures) {
    statements.push(db.prepare(`INSERT INTO teaching_exposures(id,game_id,player_id,objective_id,set_id,question_id,at) SELECT ?,?,?,?,?,?,? WHERE ${gate} ON CONFLICT(id) DO NOTHING`)
      .bind(`${gameId}:${exposure.questionId}`, gameId, row.player_id, exposure.objectiveId, exposure.setId, exposure.questionId, exposure.at, ...gateValues));
  }
  await db.batch(statements);
  const saved = await db.prepare("SELECT result_json FROM game_actions WHERE game_id=? AND action_id=?").bind(gameId, input.actionId).first<{ result_json: string }>();
  if (saved) return json(JSON.parse(saved.result_json));
  const latest = await ownedGame(request, gameId);
  return json({ error: "This game has changed. We've loaded its latest move.", code: "revision_conflict", game: publicGame(JSON.parse(latest.state_json)), revision: latest.revision }, 409);
}

export async function getResearcherStatus() {
  const user = await getChatGPTUser();
  const settings = env as ResearchEnv;
  const owner = await database().prepare("SELECT user_id FROM researcher_owners WHERE id='owner'").first<{ user_id: string }>();
  const configured = Boolean(settings.RESEARCHER_USER_ID || owner);
  const authorized = Boolean(user && user.userId === (settings.RESEARCHER_USER_ID || owner?.user_id));
  return { authenticated: Boolean(user), authorized, configured, claimable: Boolean(user && !configured && settings.RESEARCHER_SETUP_ENABLED === "true"), user: user ? { userId: user.userId, displayName: user.displayName } : null };
}

export async function requireResearcher() {
  const status = await getResearcherStatus();
  if (!status.authenticated) throw new ApiError(401, "Sign in to the researcher area.", "researcher_signin");
  if (!status.authorized) throw new ApiError(403, "This account does not have researcher access.", "researcher_forbidden");
  return status;
}

export async function researcherSetup(request: Request): Promise<Response> {
  sameOrigin(request);
  const settings = env as ResearchEnv;
  const status = await getResearcherStatus();
  if (!status.authenticated) throw new ApiError(401, "Sign in before setting up researcher access.");
  if (status.configured) throw new ApiError(409, "Researcher access is already configured.");
  if (settings.RESEARCHER_SETUP_ENABLED !== "true") {
    if (!settings.RESEARCHER_SETUP_TOKEN) throw new ApiError(403, "Researcher setup is disabled.");
    const input = await body(request, z.object({ token: z.string().min(32).max(256) }).strict());
    if (await digest(input.token) !== await digest(settings.RESEARCHER_SETUP_TOKEN)) throw new ApiError(403, "The setup token did not match.");
  }
  await database().prepare("INSERT INTO researcher_owners(id,user_id,created_at) VALUES ('owner',?,?) ON CONFLICT(id) DO NOTHING")
    .bind(status.user!.userId, new Date().toISOString()).run();
  const final = await getResearcherStatus();
  if (!final.authorized) throw new ApiError(409, "Researcher setup has already been claimed.");
  return json(final, 201);
}

export async function researcherPlayerDelete(request: Request, playerId: string): Promise<Response> {
  sameOrigin(request);
  await requireResearcher();
  ID.parse(playerId);
  const db = database();
  const found = await db.prepare("SELECT id FROM players WHERE id=?").bind(playerId).first();
  if (!found) throw new ApiError(404, "That player could not be found.");
  // Explicit order also works in local SQLite sessions where foreign-key
  // enforcement is temporarily disabled by migration tooling.
  await db.batch([
    db.prepare("DELETE FROM responses WHERE player_id=?").bind(playerId),
    db.prepare("DELETE FROM teaching_exposures WHERE player_id=?").bind(playerId),
    db.prepare("DELETE FROM game_actions WHERE game_id IN (SELECT id FROM games WHERE player_id=?)").bind(playerId),
    db.prepare("DELETE FROM games WHERE player_id=?").bind(playerId),
    db.prepare("DELETE FROM guest_sessions WHERE player_id=?").bind(playerId),
    db.prepare("DELETE FROM players WHERE id=?").bind(playerId),
  ]);
  return json({ deleted: true, playerId });
}
