# Gutville assessment method

This guide describes the measurements implemented in the prototype. The questions are original project items informed by the sources in [curriculum.md](curriculum.md). They have not been validated for difficulty, reliability, reading demands or sensitivity to learning. Results describe performance on these items; they do not demonstrate causation or establish a child's overall understanding of nutrition.

## What is measured, and when

Each round chooses one objective from each of three domains: processing, ingredients and applying evidence. Objective selection balances the player's earlier rounds. Scenario selection uses the least-used sets so that the four sets for an objective are exhausted before reuse. A complete question sequence contains three initial questions, three practice encounters and three different application questions, presented one per child roll when play lasts long enough.

| Point in play | Saved information | Purpose |
| --- | --- | --- |
| After child moves one, two and three | One first answer per move, question/scenario/content versions and submission times | Initial performance before the round's teaching |
| After child moves four, five and six | One practice question per objective; immutable first answer, subsequent attempts, response timing and teaching exposure | Supported learning and process measures |
| After child moves seven, eight and nine, if reached | One new first-answer application response per move, saved before feedback | Immediate application after teaching |
| At celebration | Optional loved/okay/not-yet/skip reaction | Acceptability, separate from knowledge |
| Later rounds | New scenario choices, initial/practice/final answers and round order | Repeat checks and further practice |

Baseline predictions do not reveal corrections or teaching between answers. Practice feedback offers an explanation; a wrong practice answer may be retried. A retry never changes the original first-answer score. A final answer is recorded before its explanation. Choosing **I'm not sure yet** is a submitted, not-correct answer; an absent answer is missing data. Neither answers nor retries change dice results, board positions or the winner.

Either player can finish before the full sequence is reached; this creates missing observations and can reduce the number of matched before/after pairs. There is no forced time limit. Players can pause and resume a saved round. The 5–10 minute duration is a design aim awaiting child usability measurement.

## Records and scoring

Each response records participant and game IDs, objective, scenario and question IDs, content version, stage, first option, server-calculated first correctness, timestamped attempt history, first-response duration and submission time. Teaching exposures, game completion and optional enjoyment are recorded separately. Started games retain their selected question snapshots, including the applicable scoring version.

A matched observation is an **objective within one game** with a baseline answer, a final application answer, the same scenario set and content version, and a recorded teaching exposure. Incomplete pairs, missing exposure, incompatible versions and fictional demonstrations are excluded from real paired summaries. A game can contain an analyzable complete pair even if other parts of that game remain unfinished; the dashboard reports completion separately.

For N matched pairs, calculate:

- Initial accuracy = `100 × number of correct first baseline answers / N`.
- Final accuracy = `100 × number of correct first final answers / N`.
- Improvement = `100 × (correct final answers − correct baseline answers) / N` percentage points.

Compute change from the underlying counts, then round display values to two decimals. For example, 1/6 initially correct and 5/6 finally correct gives 16.67%, 83.33% and **+66.67 percentage points**. With no matched pairs, accuracy and improvement are unavailable, rather than zero. The number of pairs is an observation count, not the number of independent children.

Response duration is wall-clock milliseconds from the question appearing to the first submission. It includes reading, pauses, adult support, connection delays and distraction. Treat it as an interaction measure; do not interpret it as thinking speed or rank children's ability by it. Attempts after the first answer help describe practice but do not improve the initial or final first-answer accuracy statistic.

## Comparing players and repeated sessions

The researcher dashboard supports participant, objective, school-year and game-date filters. It displays matched sample counts and per-objective summaries. Participant comparisons should use **common objectives**: two children with different topic coverage have not taken the same assessment. Even shared objectives can contain different scenario examples with unvalidated equivalence, so any comparison needs cautious interpretation.

An objective's earliest recorded baseline is retained separately across all that participant's games, including when a date filter selects later rounds. Initial questions in later rounds are repeat checks after possible earlier exposure, not fresh pre-teaching baselines. The timeline identifies first recorded exposure versus repeat checks, and trends preserve the player's actual round order.

Repeated rounds from one child are repeated measurements, not additional independent participants. Report the number of distinct children, matched pairs, completed games and missing pairs alongside accuracy. For an initial exploratory comparison, describe first recorded baselines and first complete objective pairs separately from later practice. Any inferential analysis should account for repeated measurements and unequal topic exposure rather than treating all responses as independent.

The current game-date filter includes a round by its start date. Its oldest baseline display can intentionally refer to an earlier date. Check both fields before describing a filtered report as a newly recruited cohort.

## Exporting and handling data

Only the authorized researcher can download records. **Response CSV** includes individual submitted items, first correctness, attempts, timing, exposure/pair flags, content versions and enjoyment. **Participant CSV** summarises games, matched accuracy, percentage-point change, shared-objective results and preserved first baselines. CSV formula prefixes in text are escaped for spreadsheet use.

The fictional-demo toggle supplies a separate fixed dataset: four fictional players, twelve completed games, 108 response rows and 36 matched objective pairs. Its flags are `is_demo=true`. It is generated without reading or modifying real player records and must not be reported as pupil evidence. The supplied fictional CSVs demonstrate file structure and calculations only.

Participant usernames are pseudonyms, not authentication secrets. Someone who knows a username can continue play under that name, which can affect attribution. Record whether children worked alone, with an adult, or in a classroom using an approved study procedure; the prototype does not infer those conditions. No personal names or dates of birth are requested. School year is optional.

Prototype database records persist until the researcher deletes the participant. The deletion action removes their sessions, games, action records, responses and teaching exposures. It cannot recall downloaded CSVs. Set an approved retention policy and manage exported copies separately before any formal study.

## Interpretation limits

The same broad objective does not guarantee equivalent baseline and final item difficulty. Chance guessing, literacy, prior knowledge, adult help, classroom context, familiarity with play, missing responses and repeated exposure can affect results. Enjoyment is an optional acceptability response, not evidence of learning. No nutrition or medical recommendation should be made for an individual child from these scores.

These measures support formative exploration of the prototype. They do not establish that Gutville caused a change, validate UPF identification in everyday life, or replace university review. Formal pupil work requires the institution's applicable review and agreed participant information, consent/assent, data handling and retention arrangements.
