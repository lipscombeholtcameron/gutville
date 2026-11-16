import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAnalytics, createDemoDataset, participantExportRows, responseExportRows, toCSV } from '../lib/analytics';
import type { GameState } from '../lib/game';

function fixture() {
  const demo = createDemoDataset();
  const participants = [
    { id: 'real-1', username: 'Jumping Otter', schoolYear: 4, isDemo: false },
    { id: 'real-2', username: 'Sunny Tiger', schoolYear: 5, isDemo: false },
  ];
  const games: GameState[] = participants.map((participant, index) => {
    const game = structuredClone(demo.games[0]);
    game.id = `real-game-${index + 1}`;
    game.participantId = participant.id;
    game.isDemo = false;
    game.createdAt = `2026-10-${index + 10}T09:00:00.000Z`;
    let baselineIndex = 0, postIndex = 0;
    for (const response of game.responses) {
      response.firstCorrect = response.stage === 'baseline' ? index === 1 && baselineIndex++ === 0 : response.stage === 'post' ? index === 0 || postIndex++ < 2 : true;
      response.attempts[0].correct = response.firstCorrect;
    }
    return game;
  });
  return { participants, games, demo };
}

test('known first-answer dataset produces paired accuracy, percentage-point change and shared-objective comparisons', () => {
  const { participants, games } = fixture();
  const result = buildAnalytics(participants, games);
  assert.equal(result.summary.games, 2);
  assert.equal(result.summary.completedGames, 2);
  assert.equal(result.summary.completionRate, 100);
  assert.equal(result.summary.matchedPairs, 6);
  assert.equal(result.summary.baselineAccuracy, 16.67);
  assert.equal(result.summary.postAccuracy, 83.33);
  assert.equal(result.summary.improvement, 66.67, 'calculate from unrounded accuracy, not rounded percentages');
  assert.equal(result.commonObjectives.length, 3);
  assert.equal(result.participants[0].commonBaselineAccuracy, 0);
  assert.equal(result.participants[0].commonPostAccuracy, 100);
  assert.equal(result.participants[1].matchedPairs, 3);
  assert.equal(result.timeline.length, 6);
  assert.equal(result.timeline.every(row => row.paired && row.firstExposure), true);
});

test('incomplete pairs, missing exposure and mismatched versions stay out of matched summaries', () => {
  const { participants, games } = fixture();
  const incomplete = structuredClone(games);
  const missing = incomplete[0].responses.find(r => r.stage === 'post')!;
  incomplete[0].responses = incomplete[0].responses.filter(r => r !== missing);
  incomplete[0].phase = 'encounter';
  const result = buildAnalytics(participants, incomplete);
  assert.equal(result.summary.matchedPairs, 5);
  assert.equal(result.summary.baselineAccuracy, 20);
  assert.equal(result.summary.postAccuracy, 80);
  assert.equal(result.summary.improvement, 60);
  assert.equal(result.summary.completionRate, 50);
  assert.equal(result.timeline.filter(row => !row.paired).length, 1);
  const notTaught = structuredClone(games[0]);
  notTaught.exposures = [];
  assert.equal(buildAnalytics(participants, [notTaught]).summary.matchedPairs, 0);
  const changedVersion = structuredClone(games[0]);
  for (const r of changedVersion.responses.filter(r => r.stage === 'post')) r.contentVersion = 'new-different-question-version';
  assert.equal(buildAnalytics(participants, [changedVersion]).summary.matchedPairs, 0);
});

test('fictional demonstration games are excluded by default and never mixed into real statistics', () => {
  const { participants, games, demo } = fixture();
  const real = buildAnalytics([...participants, ...demo.participants], [...games, ...demo.games]);
  assert.equal(real.summary.games, 2);
  assert.equal(real.summary.participants, 2);
  assert.equal(real.summary.demoGamesExcluded, 12);
  assert.equal(real.summary.matchedPairs, 6);
  const excludedOnly = buildAnalytics(demo.participants, demo.games);
  assert.equal(excludedOnly.summary.games, 0);
  assert.equal(excludedOnly.summary.matchedPairs, 0);
  assert.equal(excludedOnly.summary.baselineAccuracy, null);
  const shown = buildAnalytics(demo.participants, demo.games, { includeDemo: true });
  assert.equal(shown.summary.games, 12);
  assert.equal(shown.summary.matchedPairs, 36);
  assert.equal(shown.summary.completedGames, 12);
  assert.equal(demo.games.every(game => game.isDemo), true);
  assert.equal(demo.participants.every(p => p.isDemo), true);
});

test('repeat play preserves the earliest baseline even when the date filter selects only later play', () => {
  const { participants, games } = fixture();
  const later = structuredClone(games[0]);
  later.id = 'later-round';
  later.createdAt = '2026-10-20T09:00:00.000Z';
  for (const response of later.responses.filter(r => r.stage === 'baseline')) {
    response.firstCorrect = true;
    response.submittedAt = later.createdAt;
  }
  const result = buildAnalytics(participants, [...games, later], { participantId: 'real-1', from: '2026-10-20', to: '2026-10-20' });
  assert.equal(result.summary.games, 1);
  assert.equal(result.summary.baselineAccuracy, 100);
  assert.equal(result.participants[0].firstBaselines.every(b => !b.correct && b.gameId === 'real-game-1'), true);
  assert.equal(result.timeline.every(row => !row.firstExposure && row.round === 2), true);
  assert.equal(result.trends[0].round, 2);
});

test('participant, year and objective filters restrict paired samples and export rows consistently', () => {
  const { participants, games } = fixture();
  const objectiveId = games[0].selections[0].objectiveId;
  const filters = { schoolYear: '4', objectiveId };
  const result = buildAnalytics(participants, games, filters);
  assert.equal(result.summary.participants, 1);
  assert.equal(result.summary.matchedPairs, 1);
  assert.equal(result.objectives.length, 1);
  assert.equal(result.timeline.length, 1);
  assert.equal(responseExportRows(participants, games, filters).length, 3);
  assert.equal(participantExportRows(participants, games, filters).length, 1);
  assert.equal(buildAnalytics(participants, games, { schoolYear: 6 }).summary.games, 0);
});

test('CSV preserves quoted content, negative numeric changes and neutralises spreadsheet formulas', () => {
  const csv = toCSV([{ label: '=SUM(A1:A2)', text: 'a,"b"\nc', improvement: -25, blank: null }]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"\'=SUM(A1:A2)"'));
  assert.ok(csv.includes('"a,""b""\nc"'));
  assert.ok(csv.includes('"-25"'));
  assert.equal(csv.includes("'-25"), false);
  assert.equal(toCSV([]), '');
});
