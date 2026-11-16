CREATE TABLE `game_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`action_id` text NOT NULL,
	`expected_revision` integer NOT NULL,
	`commit_token` text NOT NULL,
	`result_json` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_actions_idempotency` ON `game_actions` (`game_id`,`action_id`);--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`state_json` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`last_action_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `games_player_created` ON `games` (`player_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `games_one_active_per_player` ON `games` (`player_id`) WHERE "games"."status" = 'active';--> statement-breakpoint
CREATE TABLE `guest_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `guest_sessions_player` ON `guest_sessions` (`player_id`);--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`normalized_username` text NOT NULL,
	`school_year` integer,
	`created_at` text NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_username_unique` ON `players` (`normalized_username`);--> statement-breakpoint
CREATE TABLE `researcher_owners` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `researcher_user_unique` ON `researcher_owners` (`user_id`);--> statement-breakpoint
CREATE TABLE `responses` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`player_id` text NOT NULL,
	`objective_id` text NOT NULL,
	`set_id` text NOT NULL,
	`question_id` text NOT NULL,
	`content_version` text NOT NULL,
	`stage` text NOT NULL,
	`first_option_id` text NOT NULL,
	`first_correct` integer NOT NULL,
	`attempts_json` text NOT NULL,
	`started_at` text NOT NULL,
	`submitted_at` text NOT NULL,
	`response_ms` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `responses_player_objective` ON `responses` (`player_id`,`objective_id`);--> statement-breakpoint
CREATE TABLE `teaching_exposures` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`player_id` text NOT NULL,
	`objective_id` text NOT NULL,
	`set_id` text NOT NULL,
	`question_id` text NOT NULL,
	`at` text NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `exposures_player_objective` ON `teaching_exposures` (`player_id`,`objective_id`);