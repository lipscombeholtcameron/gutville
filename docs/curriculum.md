# Gutville curriculum and assessment bank

Content version: `2026-11-03.1`. Original scenarios written for this prototype, drawing on the public guidance below. Reviewed against these pages on 30 October 2026. This is a draft learning resource for Years 4–6; it is not a validated assessment instrument.

## Editing the bank

The editable source is `lib/curriculum.ts`. It exports six objectives, four matched scenario sets per objective, and three questions per set: **24 sets and 72 distinct prompts**. Each question has a stable ID, objective, scenario ID, stage, prompt, optional evidence card, choices, answer key, explanation and source IDs. `CONTENT_VERSION` must change when wording, options, scoring or factual content changes. Active rounds preserve a snapshot of their nine selected questions and content version, so a later bank edit does not change their wording or answer keys mid-game. Preserve older records and their version: do not silently compare changed items as though they were identical.

| Domain | Objective ID | What children practise |
| --- | --- | --- |
| Processing | `everyday-processing` | Useful everyday changes: cooking, freezing, pasteurising and preserving |
| Processing | `processing-categories` | Sorting clear examples from evidence, including recognising missing information |
| Ingredients | `ingredient-clues` | Using the recipe and process instead of number-of-ingredients or unfamiliar-word rules |
| Ingredients | `ingredient-functions` | Understanding mixing, keeping, colour, flavour, thickness and anti-clumping jobs |
| Applying | `packaging-labels` | Separating advertising, ingredients, nutrition data and missing evidence |
| Applying | `nutritional-context` | Fibre, varied eating, differences within processing groups and research uncertainty |

Baseline and post questions each have three substantive choices plus **I'm not sure yet**. That choice records uncertainty; it is not a skipped item and is scored as not correct. Practice has three choices and may offer supportive retries. Correct positions vary across a/b/c; the uncertainty choice is never the correct answer.

Choose one objective from each domain per game. Choose an unused scenario for the selected objective until all four sets have been seen by that player, then begin another cycle. Do not repeat the baseline or practice example as the post question. A post question tests transfer to another example, although the difficulty of matched items has not yet been validated. Practice may intentionally cover different ingredient functions within the same broad objective.

## Scientific boundaries

This prototype uses clear examples compatible with NOVA, a common processing classification. NOVA has **four** groups, including processed culinary ingredients such as oil and salt. Gutville's three food-example labels do not replace the complete framework: it deliberately avoids asking children to force oil, salt, butter or sugar into only three categories. Food classification can be uncertain; the bank includes items where the right answer is to request more evidence.

The supplied evidence is fictional and specific to each product. Do not turn answers into broad claims that every bread, yoghurt, cereal, tinned food, frozen food or factory product has the same classification. Manufacturing information can be important. Ingredient count, packet appearance and whether a child recognises an ingredient's name are not reliable classification rules. A preservative alone is not a universal UPF marker. Approved additives have regulated uses and safety assessment; avoid implying that every additive is dangerous.

Processing category is not a nutrition score. Some foods classified as ultra-processed can contribute useful fibre and other nutrients. Encourage curiosity about labels and varied eating, with no body-size language, food shame, family judgement, individual diet prescriptions or disease predictions from a snack. An observed association in research does not by itself establish causation. The scientific evidence and processing definitions continue to develop.

## Assessment method

1. **Initial encounter:** after each of the child's first three moves, save one first answer, before teaching or revealing any baseline corrections. Present them as prediction choices in play. An evidence card describes a scenario without explaining the governing principle.
2. **Practice encounters:** after child moves four, five and six, teach one selected objective at a time. Save the first attempt before feedback. Record retries and teaching exposure separately; never replace the first answer with the final successful retry.
3. **Final encounter:** after child moves seven, eight and nine, if reached, ask one new application question per move. A winner finishes the game without forcing remaining questions. Save each first answer before its explanation, then show the celebration. An optional enjoyment reaction is a separate acceptability measure, not a knowledge score.
4. **Repeat sessions:** an objective's first recorded baseline remains its first baseline. Later initial encounters are repeat checks after earlier exposure. Keep them visibly separate when analysing learning.

The central records should preserve participant, game, objective and scenario IDs; content version; stage; first answer; server-calculated correctness; attempts; timing; exposure and completion. Do not send answer keys to the browser before the relevant assessment is completed.

For a matched objective/game pair, first-answer improvement is `100 × (post correctness − baseline correctness)` percentage points. For a group summary, compare mean first-answer accuracy across the **same completed pairs**, and display the number of matched pairs and distinct children. Keep missing posts, unfinished pairs and fictional/test players out of paired summaries. Report participation and missingness separately. Do not compare two children's overall scores as though they answered the same objectives unless the comparison is restricted to shared objectives.

Small samples, chance guessing, non-equivalent items, reading level, adult help, retries, repeat exposure and familiarity with the game can affect scores. Timing is an interaction measure, not proof of understanding. The prototype does not support causal claims about teaching effectiveness. Use university-approved procedures before collecting formal pupil research records.

## Source references

- [NHS — Processed foods](https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/what-are-processed-foods/): everyday processing, preservation, pasteurising, nutrition labels and the place of higher-fibre processed foods in a healthy diet.
- [Food Standards Scotland — Processed and ultra-processed foods](https://www.foodstandards.gov.scot/consumer-advice/healthy-eating/balanced-diet/processed-and-ultra-processed-foods): NOVA groups, ingredient and manufacturing distinctions, additive roles, safety assessment, advertising context and limits of processing as a health indicator.
- [Food Standards Australia New Zealand — What do food additives do?](https://www.foodstandards.gov.au/consumer/additives/additiveinfo): practical functions of emulsifiers, preservatives, colours, flavourings, thickeners and anti-caking agents. This is used for ingredient functions, not UK regulatory advice.
- [SACN — Processed foods and health: rapid evidence update summary (2 April 2025)](https://www.gov.uk/government/publications/processed-foods-and-health-sacns-rapid-evidence-update/processed-foods-and-health-sacns-rapid-evidence-update-summary): links with health outcomes, limitations of causal inference and classification, nutritional differences within UPFs, and fibre in the wider diet.

The scenarios are educational paraphrases and invented products. They do not reproduce or classify branded products. A teacher or nutrition subject specialist should review scientific wording, reading level and item equivalence before a formal classroom study.
