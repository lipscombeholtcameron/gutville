# Gutville validation record

Validation recorded on 30 October 2026 against the current prototype source. This document separates completed implementation checks from pupil-facing evaluation and independent audits that have not been established.

## Completed engine and analytics verification

The Node test suite now contains **16 passing tests**. Run it with:

```sh
node --experimental-strip-types --loader ./tests/ts-loader.mjs --test tests/*.test.ts
```

The ten game tests cover board direction, every prescribed snake and ladder, exact finish and overshoot, six-sided roll boundaries, invalid moves, the four-move minimum, alternating turns, one question per child roll with baseline answers before feedback, practice retry preservation, either player winning, application sequencing and incomplete pairs, pause/resume, scenario rotation, question snapshot preservation and participant-specific history.

The six analytics tests check a known dataset's paired accuracy and percentage-point change, missing pairs/exposures and incompatible versions, exclusion of demonstrations, preservation of first baselines across repeat play and date filtering, participant/year/objective filters, and CSV quoting/formula handling. The known count example produces 16.67% initial accuracy, 83.33% final accuracy and +66.67 percentage points from six matched pairs.

TypeScript checking also passed using `tsc --noEmit`. Build and browser results should be recorded from their final delivery runs; type checking alone does not validate CSS, rendered layout or accessibility.

## Completed database and HTTP verification

The generated initial D1 migration was applied successfully to an isolated local preview database. SQL invariant checks passed for normalized username uniqueness, a single active game per participant, original-result idempotence, stale revision rejection, immutable first answers during retry updates, one-time owner insertion and deletion cascades.

Two local HTTP verification runs passed **48 checks** in total. They exercised the actual API routes and Cloudflare D1 preview binding, including:

- Creating a generated player, case/whitespace-normalized return on a second session, and access to the same saved game across devices.
- HttpOnly/SameSite session cookies, anonymous game denial, other-player game isolation and new-player sign-out.
- A complete playable game, all nine assessment points, optional practice retry, final enjoyment, and starting another round.
- Concurrent identical action IDs returning exactly the same roll/result; concurrent different IDs on one revision allowing exactly one action; stale revisions returning HTTP 409 with current state.
- Pause/resume persistence, blocked actions while paused, invalid transitions, missing answer-key/history fields in public state, input schemas, invalid dates and the 16KB request-body limit.
- Anonymous research/export/deletion denial, rejection of forged identity headers by local hosting auth, signed-in nonowner denial, private one-time owner setup and prevention of replacement.
- Matched researcher statistics, both CSV formats, school-year filtering, fictional demo isolation, permanent participant deletion and revocation of sessions on other devices.

Test participants were removed after verification. Only the local mock researcher was claimed in the local database. The temporary ignored local setup flag was removed and the preview restarted. These actions did not configure a production owner or use a production child dataset.

## Demonstration exports

The supplied demonstration CSVs were generated directly through the current `createDemoDataset`, `responseExportRows`, `participantExportRows` and `toCSV` functions. All four participant rows and all 108 response rows were checked to have `is_demo=true`. The dataset contains twelve completed games and 36 matched objective pairs; its aggregate initial accuracy is 33.33%, final accuracy 94.44%, and change +61.11 percentage points. These are fictional construction values, not measured pupil outcomes.

## Human validation and release checks

At the time of this backend verification record, phone/tablet/laptop browser inspection was being performed separately and is not asserted complete here. A final build, responsive visual review, keyboard-only play, visible focus, screen-reader announcements, 200% zoom, contrast, reduced-motion and reconnect behavior should be assessed on the delivered revision. Implemented accessibility features do not by themselves establish conformance or an independent accessibility audit.

No child usability study, 5–10 minute duration validation, reading-age evaluation, matched-item equivalence study, independent scientific review, psychometric validation or causal learning evaluation has been established by these tests. Before formal pupil research, complete the university's applicable review and agree participant information, consent/assent, recording conditions and retention policy.

Before a public release, keep the site owner-private while configuring the actual researcher identity. Disable `RESEARCHER_SETUP_ENABLED` and redeploy before making the play area public. Verify hosted owner sign-in and unauthorized denial using the production hosting controls. Local mock authentication and local test results do not establish that hosted ownership has been configured.

## Public source export check — 16 November 2026

The exported source passed all 16 game and analytics tests using the bundled Node runtime. The export contains authored source and assets, with no Git history, local database, environment files, production owner identity or credential. The earlier database and HTTP checks above are historical verification and were not rerun as part of this export. GitHub Pages publishes only the separate `site/` project page; gameplay and central storage remain on the live app host.
