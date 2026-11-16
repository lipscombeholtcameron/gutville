# Gutville storage and researcher setup

Gutville uses the Sites Cloudflare D1 binding named `DB`. The initial Drizzle SQL migration creates participants, hashed guest sessions, game snapshots, idempotent actions, first-answer records, teaching exposures and a single researcher owner. Deploying the source with `d1: "DB"` applies checked-in migrations. No child names, dates of birth or contact details are requested.

## Researcher access

The play area is anonymous. The dashboard, JSON dataset, CSV files and record deletion require **both** a platform-verified Sign in with ChatGPT identity and researcher authorization on the server. Knowing a player username never grants researcher access.

The preferred configuration is the server environment secret `RESEARCHER_USER_ID`, set to the owner's stable ChatGPT user ID. Alternatively, while the site remains **owner-private**, temporarily set `RESEARCHER_SETUP_ENABLED=true`, sign in, and use the Researcher page's setup action. The action inserts the sole owner once and cannot replace an existing owner. Immediately remove or set the setup flag to `false` before sharing the play area. The default is disabled. An optional, independently generated secret `RESEARCHER_SETUP_TOKEN` of at least 32 characters also permits a signed-in owner's one-time `POST /api/researcher/setup` with `{ "token": "…" }`; never commit it or put it in a public URL. Neither method automatically makes the first public sign-in an owner.

The platform auth helper is used unchanged. Local mock identities must never be registered as production owners. Disabling setup after the private claim is an operational release step, not an in-page child action.

## Player identity

`POST /api/player` accepts `{mode:"new",schoolYear?:4|5|6}` or `{mode:"return",username:string}`. Creation picks a readable adjective/animal combination and enforces normalized username uniqueness in D1, retrying collisions. Returning by username is intentionally lightweight and allows cross-device play. A person who knows that name could play as that participant; use the generated name as a pseudonym, not a security credential. Saved answers and research results are never sent by these endpoints.

The browser receives a 256-bit random, HttpOnly, SameSite=Lax cookie, Secure on HTTPS. Only a SHA-256 digest is stored. Sessions expire after 180 days. `DELETE /api/player` signs out this browser without deleting research records. No token is stored in localStorage.

## Game API

- `GET /api/player`: `{player,game,revision}`; empty state returns null player and game.
- `POST /api/games`: start a new game or return this player's unfinished game.
- `GET /api/games/:id`: return this player's game only; another player's ID returns 404.
- `POST /api/games/:id/actions`: `{actionId,revision,action}`. Actions are `roll`, `answer` with `optionId`, `continue`, `retry`, `pause`, `resume`, or `enjoyment` with `loved|okay|not-yet|skip`. Successful responses are `{game,revision}`.

The server owns scenario selection, dice rolls, answer grading and transitions. Browser game state omits response history and unrevealed answer keys. Inputs are bounded and validated. Mutations reject cross-origin browser requests. All API and export responses are private/no-store.

Every action must have a new opaque action ID, retained verbatim when retrying after a network error. A D1 atomic batch uses the expected revision and a unique commit token to save the snapshot, its original result, response rows and exposure rows together. A duplicated ID returns the saved original response. Two different actions on the same revision cannot both apply. Revision conflicts return HTTP 409 and the latest public game/revision; the client must show that state instead of blindly replaying the conflicting action.

Practice attempts update only the attempt history in response rows; the original option, correctness and submission time stay fixed. Full versioned game snapshots preserve original per-objective baselines across rounds. All random dice rolls use cryptographic rejection sampling.

## Research endpoints

- `GET /api/researcher/status`: authenticated/authorized/configured/claimable booleans and the signed-in research identity, never player answers.
- `POST /api/researcher/setup`: private one-time authorization described above.
- `GET /api/researcher/data`: dashboard JSON from the analytics engine. Optional filters: `participantId`, `objectiveId` (or `topic`), `schoolYear`, `from`, `to` (YYYY-MM-DD).
- Add `format=responses` or `format=participants` (or equivalent `export=`) for UTF-8 CSV. Spreadsheet formula prefixes are escaped by the analytics exporter.
- Add `demo=true` to use an entirely fictional server-generated dataset **instead of** saved players. It is never persisted or mixed into study results. Fictional exports are named accordingly. All of these endpoints still require the researcher owner.
- `DELETE /api/researcher/players/:id`: permanently remove the participant's sessions, actions, exposures, answers, games and participant record. Requires researcher authorization.

This is a university prototype. Before enrolling pupils for formal research, configure the university-approved participant information, lawful basis, consent/assent process, record retention and deletion policy. These project-specific matched assessments are not a validated learning instrument and do not demonstrate causation. The researcher area does not rank children with different objective coverage as though they had answered the same questions.
