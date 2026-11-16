# Gutville

Gutville is a university website prototype for children in Years 4–6 to explore food processing and ultra-processed foods (UPFs). The illustrated town contains one playable Snakes & Ladders Club and two coming-soon destinations: Label Lab and Mix & Match Market.

The child plays against Pip on a 49-square board. Short prediction, practice and final application encounters are part of play. Answers never change movement or decide the winner. A separate, authorized researcher area shows saved learning records, matched comparisons, repeat-play trends and CSV exports. This is a project-specific prototype, not a validated assessment instrument or an approved pupil study.

## Run locally

This public export omits the original Site ID. It runs locally without that identity. To deploy a separate copy with Sites, register your own Site and configure your own D1 database and researcher identity. The live Gutville deployment remains separately managed.


Use Node.js **22.13.0 or newer**, npm and the checked-in lockfile. Git and tar are needed for the Sites publication workflow. Keep local previews on loopback.

```sh
npm ci
npm run build
```

The build creates `dist/server/wrangler.json`. Apply the checked-in initial migration to the **local** database once:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_blue_victor_mancha.sql
npm run dev
```

Open the URL printed by the server; portable development defaults to port 5173. Use `npm run dev -- --port 3001` to choose another port. Do not replay a migration already applied locally. Local and hosted databases are separate; local test records and local researcher identities are not included in the source archive.

`npm run build` creates the production artifact. `npm start` previews that built Worker locally; it does not deploy. For schema changes, edit `db/schema.ts`, run `npm run db:generate`, review the generated SQL, and apply each pending migration in order. Hosting through Sites uses `.openai/hosting.json` with the D1 binding `DB` and applies checked-in migrations during deployment. Keep the authored migration and its Drizzle metadata together.

## Configure researcher access before sharing

Children use the public play area without ChatGPT accounts. Researcher identity comes from the hosting platform's Sign in with ChatGPT flow; identity alone does not grant access. The server additionally checks an explicit configured owner. Dashboard data, CSV downloads and deletion all enforce that check.

Use this private setup sequence:

1. Keep the deployed site **owner-private**. Temporarily set its server environment variable `RESEARCHER_SETUP_ENABLED=true` using the hosting controls, then deploy that configuration.
2. Open `/researcher`, sign in with the intended researcher's actual ChatGPT account, and use the one-time setup button. It saves that verified stable user ID; an existing owner cannot be replaced by repeating setup.
3. Remove the setup flag or set it to `false`, **redeploy**, and verify access with the intended owner before making the play area public.

Alternatively, configure the server environment `RESEARCHER_USER_ID` with the intended owner's verified stable ID for this Site. This allowlist takes precedence over a stored owner. Do not use an email address as the stable ID, expose setup secrets in browser code, or automatically authorize the first public sign-in. An optional token-based setup fallback is documented in [backend.md](backend.md).

Portable loopback development includes a separate mock sign-in: `/signin-with-chatgpt?return_to=/researcher` signs in as `local_seedy`. To test a local claim, temporarily use an ignored `.dev.vars` containing `RESEARCHER_SETUP_ENABLED=true`, restart the preview, claim local access, then remove the file and restart again. This mock is development-only; never configure it as the hosted owner. Production ownership must be claimed using the real hosted sign-in.

## Data and identity

Players receive globally unique generated adjective-and-animal names, with an optional school year of 4, 5 or 6. Returning by that name restores the same participant on another device. This is intentionally lightweight: someone who knows a name can play under it. It is not a password and never permits access to saved answers or research analysis.

A random HttpOnly, SameSite cookie identifies the current device; Secure is used on HTTPS. Only its digest is stored. Sessions expire after 180 days. The **New player** action signs this browser out; it does not erase the participant's research records.

Cloudflare D1 centrally persists participants, game snapshots, first answers, practice attempts, teaching exposures, timing and completion. State changes and their analysis rows are saved atomically. The server owns fair dice rolls and answer grading. Duplicate action IDs replay the original result; stale revisions return the latest game instead of applying another move.

Saved prototype records remain until the authorized researcher deletes the participant. There is no automatic retention scheduler. Deletion removes the participant's database records and sessions; the person who downloaded CSVs must separately manage those copies. Fictional dashboard demonstrations are generated separately on request and never saved into participant records. No real child data is included in the supplied demonstration CSVs.

Before any formal pupil research, the project team must complete the university's required review and agree participant information, consent/assent, lawful basis, retention and deletion procedures. The website does not establish that those steps have occurred.

## Edit learning content and interpret results

The editable bank is `lib/curriculum.ts`: six objectives, four matched scenario sets per objective, and three questions per set (**72 prompts**). See [curriculum.md](curriculum.md) for sources and scientific boundaries.

When changing a prompt, choices, scoring, evidence or explanation, keep IDs stable where the item remains the same and bump `CONTENT_VERSION`. New games use the edited bank. Started games retain a server-side snapshot of their selected questions and answer keys, so edits do not alter an active round. Preserve versioned historical records; do not treat substantively changed items as interchangeable.

Run content changes past a suitable educator or subject reviewer before pupil use. Keep Year 4 reading demands, uncertain classifications and non-judgmental language in view. Ingredient count, unfamiliar words and packet design are not reliable UPF tests; processing category alone is not a nutrition score.

Read [assessment-method.md](assessment-method.md) before analysing records. It explains timing, missing data, repeat exposure, common-objective comparisons and limits on inference. [backend.md](backend.md) documents the API and authorization model.

## Verification

```sh
node --experimental-strip-types --loader ./tests/ts-loader.mjs --test tests/*.test.ts
npx tsc --noEmit
npm run build
```

The current engine/analytics suite has 16 passing tests. Local D1 and real HTTP integration verification also passed 48 checks, including complete play, cross-device return, concurrent actions, protected exports and deletion. See [validation.md](validation.md) for the exact evidence and remaining human validation. A 5–10 minute round is a design target; child session timing and learning effectiveness still require appropriate usability and research work.

The UI uses locally hosted DM Sans, original vector artwork, keyboard focus, touch controls and reduced-motion support. Browser inspection is part of delivery verification, but these features do not constitute a full independent accessibility audit.
