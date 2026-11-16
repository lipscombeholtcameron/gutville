import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  normalizedUsername: text("normalized_username").notNull(),
  schoolYear: integer("school_year"),
  createdAt: text("created_at").notNull(),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
}, (table) => [uniqueIndex("players_username_unique").on(table.normalizedUsername)]);

export const guestSessions = sqliteTable("guest_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  playerId: text("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
}, (table) => [index("guest_sessions_player").on(table.playerId)]);

export const games = sqliteTable("games", {
  id: text("id").primaryKey(),
  playerId: text("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  stateJson: text("state_json").notNull(),
  revision: integer("revision").notNull().default(0),
  status: text("status", { enum: ["active", "completed"] }).notNull().default("active"),
  lastActionId: text("last_action_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  completedAt: text("completed_at"),
}, (table) => [
  index("games_player_created").on(table.playerId, table.createdAt),
  uniqueIndex("games_one_active_per_player").on(table.playerId).where(sql`${table.status} = 'active'`),
]);

export const gameActions = sqliteTable("game_actions", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  actionId: text("action_id").notNull(),
  expectedRevision: integer("expected_revision").notNull(),
  commitToken: text("commit_token").notNull(),
  resultJson: text("result_json").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("game_actions_idempotency").on(table.gameId, table.actionId)]);

export const responses = sqliteTable("responses", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  playerId: text("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  objectiveId: text("objective_id").notNull(),
  setId: text("set_id").notNull(),
  questionId: text("question_id").notNull(),
  contentVersion: text("content_version").notNull(),
  stage: text("stage").notNull(),
  firstOptionId: text("first_option_id").notNull(),
  firstCorrect: integer("first_correct", { mode: "boolean" }).notNull(),
  attemptsJson: text("attempts_json").notNull(),
  startedAt: text("started_at").notNull(),
  submittedAt: text("submitted_at").notNull(),
  responseMs: integer("response_ms").notNull(),
}, (table) => [index("responses_player_objective").on(table.playerId, table.objectiveId)]);

export const teachingExposures = sqliteTable("teaching_exposures", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  playerId: text("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  objectiveId: text("objective_id").notNull(),
  setId: text("set_id").notNull(),
  questionId: text("question_id").notNull(),
  at: text("at").notNull(),
}, (table) => [index("exposures_player_objective").on(table.playerId, table.objectiveId)]);

export const researcherOwners = sqliteTable("researcher_owners", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("researcher_user_unique").on(table.userId)]);
