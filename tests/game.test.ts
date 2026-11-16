import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceGame, boardCoordinates, createGame, GameError, LADDERS, moveToken, publicGame, rollDie, selectScenarios, SNAKES } from '../lib/game';
import type { GameState } from '../lib/game';
import { QUESTION_SETS } from '../lib/curriculum';

const NOW = '2026-10-30T09:00:00.000Z';
const random = () => 0;
function fresh(id = 'game-1'): GameState { return createGame({ id, participantId: 'player-1', now: NOW }, random); }
function currentQuestion(game: GameState) {
  const id = game.encounter!.questionIds[game.encounter!.index];
  return QUESTION_SETS.flatMap(set => [set.baseline, set.practice, set.post]).find(q => q.id === id)!;
}
export function answerEncounter(game: GameState, correct = true): GameState {
  while (game.phase === 'encounter' || game.phase === 'feedback') {
    if (game.phase === 'feedback') game = advanceGame(game, { type: 'continue' }, { now: NOW });
    else {
      const q = currentQuestion(game);
      game = advanceGame(game, { type: 'answer', optionId: correct ? q.correctOptionId : q.options.find(o => o.id !== q.correctOptionId)!.id }, { now: NOW });
    }
  }
  return game;
}
export function completedGame(id = 'game-1', participantId = 'player-1', baselineCorrect = false, postCorrect = true): GameState {
  let game = createGame({ id, participantId, now: NOW }, random);
  for (let i = 0; i < 9; i++) {
    // Keep this fixture deterministic and long enough to collect matched pairs.
    game.positions.child = i === 8 ? 43 : 0;
    game = advanceGame(game, { type: 'roll' }, { roll: i === 8 ? 6 : 1, now: NOW });
    while (game.phase === 'encounter' || game.phase === 'feedback') {
      if (game.phase === 'feedback') game = advanceGame(game, { type: 'continue' }, { now: NOW });
      else {
        const q = currentQuestion(game);
        const correct = q.stage === 'baseline' ? baselineCorrect : q.stage === 'post' ? postCorrect : true;
        game = advanceGame(game, { type: 'answer', optionId: correct ? q.correctOptionId : q.options.find(o => o.id !== q.correctOptionId)!.id }, { now: NOW });
      }
    }
    if (game.phase === 'turn') { game.positions.bot = 0; game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW }); }
  }
  return game;
}

test('board alternates direction; every prescribed snake and ladder resolves exactly', () => {
  assert.deepEqual(boardCoordinates(1), { row: 6, column: 0 });
  assert.deepEqual(boardCoordinates(7), { row: 6, column: 6 });
  assert.deepEqual(boardCoordinates(8), { row: 5, column: 6 });
  assert.deepEqual(boardCoordinates(14), { row: 5, column: 0 });
  assert.deepEqual(boardCoordinates(49), { row: 0, column: 6 });
  for (const [base, end] of Object.entries(LADDERS)) assert.deepEqual(moveToken(Number(base) - 1, 1), { landed: Number(base), to: end, jump: 'ladder' });
  for (const [head, end] of Object.entries(SNAKES)) assert.deepEqual(moveToken(Number(head) - 1, 1), { landed: Number(head), to: end, jump: 'snake' });
  assert.deepEqual(moveToken(47, 3), { landed: 47, to: 47 });
  assert.equal(moveToken(43, 6).to, 49);
  assert.equal(rollDie(() => 0), 1);
  assert.equal(rollDie(() => 0.999999), 6);
  assert.throws(() => moveToken(1, 7), GameError);
  assert.throws(() => rollDie(() => 1), GameError);
});

test('no player can reach the finish before their fourth move', () => {
  let reachable = new Set([0]);
  for (let move = 1; move <= 4; move++) {
    const next = new Set<number>();
    for (const square of reachable) for (let die = 1; die <= 6; die++) next.add(moveToken(square, die).to);
    assert.equal(next.has(49), move === 4);
    reachable = next;
  }
});

test('opening predictions appear one per child roll before teaching', () => {
  const original = fresh();
  let game = original;
  for (let question = 0; question < 3; question++) {
    game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
    const visible = publicGame(game);
    assert.equal(visible.question!.stage, 'baseline');
    assert.equal(visible.feedback, undefined);
    const json = JSON.stringify(visible);
    for (const secret of ['correctOptionId', 'firstCorrect', 'explanation', 'responses']) assert.equal(json.includes(secret), false);
    game = advanceGame(game, { type: 'answer', optionId: currentQuestion(game).correctOptionId }, { now: NOW });
    assert.equal(game.phase, 'turn');
    assert.equal(game.turn, 'bot');
    if (question < 2) game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  }
  assert.equal(original.positions.child, 0);
  assert.equal(game.responses.length, 3);
  assert.equal(game.exposures.length, 0);
});

test('practice retry preserves first answer and timing while answers never alter movement', () => {
  let game = answerEncounter(advanceGame(fresh(), { type: 'roll' }, { roll: 2, now: NOW }));
  game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  game = answerEncounter(advanceGame(game, { type: 'roll' }, { roll: 4, now: NOW }));
  game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  game = answerEncounter(advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW }));
  game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  const positions = { ...game.positions };
  const question = currentQuestion(game);
  const wrong = question.options.find(o => o.id !== question.correctOptionId)!.id;
  game = advanceGame(game, { type: 'answer', optionId: wrong }, { now: '2026-10-30T09:00:05.000Z' });
  assert.deepEqual(game.positions, positions);
  assert.equal(publicGame(game).feedback!.canRetry, true);
  game = advanceGame(game, { type: 'retry' }, { now: '2026-10-30T09:00:06.000Z' });
  assert.equal(publicGame(game).feedback, undefined);
  game = advanceGame(game, { type: 'answer', optionId: question.correctOptionId }, { now: '2026-10-30T09:00:10.000Z' });
  const response = game.responses.find(r => r.questionId === question.id)!;
  assert.equal(response.firstCorrect, false);
  assert.equal(response.firstOptionId, wrong);
  assert.equal(response.attempts.length, 2);
  assert.equal(response.responseMs, 5000);
  assert.equal(game.exposures.length, 1);
  assert.equal(publicGame(game).feedback!.correct, true);
  assert.throws(() => advanceGame(game, { type: 'retry' }), GameError);
});

test('a sufficiently long game collects matched questions and completes after a win', () => {
  const game = completedGame();
  assert.equal(game.phase, 'finished');
  assert.equal(game.winner, 'child');
  assert.equal(game.positions.child, 49);
  assert.equal(game.childMoves, 9);
  assert.equal(game.exposures.length, 3);
  assert.equal(game.responses.filter(r => r.stage === 'baseline').length, 3);
  assert.equal(game.responses.filter(r => r.stage === 'practice').length, 3);
  assert.equal(game.responses.filter(r => r.stage === 'post').length, 3);
  assert.equal(game.responses.filter(r => r.stage === 'baseline').every(r => !r.firstCorrect), true);
  assert.equal(game.responses.filter(r => r.stage === 'post').every(r => r.firstCorrect), true);
  assert.throws(() => advanceGame(game, { type: 'roll' }), GameError);
  const enjoyed = advanceGame(game, { type: 'enjoyment', value: 'loved' });
  assert.equal(enjoyed.enjoyment, 'loved');
  assert.throws(() => advanceGame(enjoyed, { type: 'enjoyment', value: 'okay' }), GameError);
});

test('an early win ends without forcing a batch of questions', () => {
  let game = fresh();
  for (const die of [2, 4, 5, 5]) {
    game = answerEncounter(advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW }));
    game = advanceGame(game, { type: 'roll' }, { roll: die, now: NOW });
  }
  assert.equal(game.winner, 'bot');
  assert.equal(game.phase, 'finished');
  assert.equal(game.responses.filter(r => r.stage === 'post').length, 0);
});

test('old queued encounters resume as one question per roll', () => {
  let game = advanceGame(fresh(), { type: 'roll' }, { roll: 1, now: NOW });
  game.encounter!.questionIds = game.selections.map(s => QUESTION_SETS.find(set => set.id === s.setId)!.baseline.id);
  game = advanceGame(game, { type: 'answer', optionId: currentQuestion(game).correctOptionId }, { now: NOW });
  assert.equal(game.phase, 'turn');
  game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  game = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  assert.equal(publicGame(game).question!.stage, 'baseline');
  assert.equal(game.responses.length, 1);
});

test('pause preserves the pending question and blocks all play until resume', () => {
  let game = advanceGame(fresh(), { type: 'roll' }, { roll: 1 });
  const before = publicGame(game).question;
  game = advanceGame(game, { type: 'pause' });
  assert.equal(game.paused, true);
  assert.throws(() => advanceGame(game, { type: 'answer', optionId: 'a' }), GameError);
  game = advanceGame(game, { type: 'resume' });
  assert.deepEqual(publicGame(game).question, before);
  assert.equal(game.paused, false);
  assert.throws(() => advanceGame(game, { type: 'answer', optionId: 'invented-answer' }), GameError);
});

test('scenario selection balances objectives and exhausts every scenario before reusing it', () => {
  const history: GameState[] = [];
  for (let round = 0; round < 8; round++) history.push(createGame({ id: String(round), participantId: 'player-1', history, now: NOW }, random));
  for (const domainIndex of [0, 1, 2]) {
    const selected = history.map(game => game.selections[domainIndex]);
    assert.equal(new Set(selected.map(s => s.objectiveId)).size, 2);
    assert.equal(new Set(selected.map(s => s.setId)).size, 8);
  }
  const next = selectScenarios(history, random);
  assert.equal(next.length, 3);
  assert.equal(next.every(s => history.some(g => g.selections.some(old => old.setId === s.setId))), true);
});

test('a started game grades its saved question version and ignores another participant’s scenario history', () => {
  const game = fresh();
  const saved = game.questions!.find(q => q.stage === 'baseline')!;
  saved.title = 'The wording saved when this round began';
  saved.correctOptionId = saved.options.find(o => o.id !== saved.correctOptionId)!.id;
  let pending = advanceGame(game, { type: 'roll' }, { roll: 1, now: NOW });
  assert.equal(publicGame(pending).question!.title, saved.title);
  pending = advanceGame(pending, { type: 'answer', optionId: saved.correctOptionId }, { now: NOW });
  assert.equal(pending.responses[0].firstCorrect, true);
  const foreignHistory = createGame({ id: 'foreign', participantId: 'someone-else', now: NOW }, random);
  assert.deepEqual(createGame({ id: 'new', participantId: 'player-1', history: [foreignHistory], now: NOW }, random).selections, fresh().selections);
});
