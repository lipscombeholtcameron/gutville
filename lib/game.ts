import { CONTENT_VERSION, OBJECTIVES, QUESTION_SETS, type Objective, type Question, type Stage } from './curriculum';
import { BOARD_SIZE, GameError, moveToken } from './board';
export { BOARD_SIZE, GameError, LADDERS, SNAKES, moveToken, boardCoordinates } from './board';

export type Actor = 'child' | 'bot';
export type Enjoyment = 'loved' | 'okay' | 'not-yet' | 'skip';
export type GameAction = { type: 'roll' } | { type: 'answer'; optionId: string } | { type: 'continue' } | { type: 'retry' } | { type: 'pause' } | { type: 'resume' } | { type: 'enjoyment'; value: Enjoyment };
export type Selection = { objectiveId: string; setId: string };
export type Attempt = { optionId: string; correct: boolean; at: string };
export type ResponseRecord = {
  id: string; questionId: string; objectiveId: string; setId: string; contentVersion: string;
  stage: Stage; firstOptionId: string; firstCorrect: boolean; attempts: Attempt[];
  startedAt: string; submittedAt: string; responseMs: number;
};
export type Exposure = { objectiveId: string; setId: string; questionId: string; at: string };
export type Roll = { actor: Actor; value: number; from: number; landed: number; to: number; jump?: 'snake' | 'ladder'; at: string };
type Encounter = { stage: Stage; index: number; questionIds: string[]; after: 'turn' | 'post' | 'finished'; startedAt: string };
export type GameState = {
  id: string; participantId: string; contentVersion: string; createdAt: string; updatedAt: string; completedAt?: string;
  phase: 'turn' | 'encounter' | 'feedback' | 'finished'; paused: boolean; turn: Actor;
  positions: Record<Actor, number>; childMoves: number; winner: Actor | null;
  selections: Selection[]; questions?: Question[]; responses: ResponseRecord[]; exposures: Exposure[]; rolls: Roll[];
  encounter?: Encounter; enjoyment: Enjoyment | null; isDemo: boolean;
};
export type PublicQuestion = Pick<Question, 'id' | 'stage' | 'title' | 'prompt' | 'evidence' | 'options'>;
export type PublicGame = {
  id: string; phase: GameState['phase']; paused: boolean; turn: Actor; positions: Record<Actor, number>;
  childMoves: number; winner: Actor | null; lastRoll?: Roll; rolls: Roll[];
  selectedObjectives: Objective[]; question?: PublicQuestion;
  feedback?: { stage: 'practice' | 'post'; correct: boolean; explanation: string; correctOptionId: string; canRetry: boolean };
  progress: Record<Stage, { done: number; total: number }>; enjoyment: Enjoyment | null;
};
export type EngineContext = { random?: () => number; roll?: number; now?: string };

function secureRandom(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000;
}
function randomIndex(size: number, random: () => number): number {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new GameError('Random values must be between zero and one.');
  return Math.floor(value * size);
}
export function rollDie(random?: () => number): number {
  if (random) return randomIndex(6, random) + 1;
  // Rejection sampling avoids modulo bias when using the server's cryptographic generator.
  const limit = Math.floor(0x100000000 / 6) * 6;
  let n: number;
  do { n = crypto.getRandomValues(new Uint32Array(1))[0]; } while (n >= limit);
  return n % 6 + 1;
}
function findQuestion(id: string, state?: GameState): Question {
  const saved = state?.questions?.find(question => question.id === id);
  if (saved) return saved;
  for (const set of QUESTION_SETS) for (const stage of ['baseline', 'practice', 'post'] as Stage[]) if (set[stage].id === id) return set[stage];
  throw new GameError('This learning question is unavailable.');
}
function setQuestion(selection: Selection, stage: Stage, state?: GameState): Question {
  const saved = state?.questions?.find(question => question.setId === selection.setId && question.objectiveId === selection.objectiveId && question.stage === stage);
  if (saved) return saved;
  const set = QUESTION_SETS.find(item => item.id === selection.setId && item.objectiveId === selection.objectiveId);
  if (!set) throw new GameError('This learning scenario is unavailable.');
  return set[stage];
}
export function selectScenarios(history: GameState[] = [], random: () => number = secureRandom): Selection[] {
  const selections = history.flatMap(game => game.selections);
  return (['processing', 'ingredients', 'applying'] as const).map(domain => {
    const objectives = OBJECTIVES.filter(objective => objective.domain === domain);
    const counts = objectives.map(objective => selections.filter(s => s.objectiveId === objective.id).length);
    const least = Math.min(...counts);
    const candidates = objectives.filter((_, i) => counts[i] === least);
    const objective = candidates[randomIndex(candidates.length, random)];
    const sets = QUESTION_SETS.filter(set => set.objectiveId === objective.id);
    const setCounts = sets.map(set => selections.filter(s => s.setId === set.id).length);
    const minimum = Math.min(...setCounts);
    const available = sets.filter((_, i) => setCounts[i] === minimum);
    return { objectiveId: objective.id, setId: available[randomIndex(available.length, random)].id };
  });
}
export function createGame(options: { id: string; participantId: string; history?: GameState[]; now?: string; isDemo?: boolean }, random: () => number = secureRandom): GameState {
  const now = options.now ?? new Date().toISOString();
  const selections = selectScenarios(options.history?.filter(game => game.participantId === options.participantId), random);
  return { id: options.id, participantId: options.participantId, contentVersion: CONTENT_VERSION, createdAt: now, updatedAt: now,
    phase: 'turn', paused: false, turn: 'child', positions: { child: 0, bot: 0 }, childMoves: 0, winner: null,
    selections, questions: structuredClone(selections.flatMap(selection => (['baseline', 'practice', 'post'] as Stage[]).map(stage => setQuestion(selection, stage)))),
    responses: [], exposures: [], rolls: [], enjoyment: null, isDemo: options.isDemo ?? false };
}
function startEncounter(state: GameState, stage: Stage, questions: Question[], after: Encounter['after'], now: string) {
  state.encounter = { stage, index: 0, questionIds: questions.map(q => q.id), after, startedAt: now };
  state.phase = 'encounter';
}
// Spread the checks across turns: no teaching is shown until all opening
// predictions are recorded, and application follows the teaching encounters.
function nextTurnQuestion(state: GameState): Question | undefined {
  for (const stage of ['baseline', 'practice', 'post'] as Stage[]) {
    for (const selection of state.selections) {
      const question = setQuestion(selection, stage, state);
      if (!state.responses.some(response => response.questionId === question.id)) return question;
    }
  }
  return undefined;
}
function finishEncounter(state: GameState, now: string) {
  // Saved games from the previous flow may contain several queued questions.
  // The remaining checks are picked up on later turns by nextTurnQuestion.
  delete state.encounter;
  if (state.winner) { state.phase = 'finished'; state.completedAt = now; }
  else { state.phase = 'turn'; state.turn = 'bot'; }
}
export function advanceGame(previous: GameState, action: GameAction, context: EngineContext = {}): GameState {
  const now = context.now ?? new Date().toISOString();
  const state = structuredClone(previous);
  if (!action || typeof action.type !== 'string') throw new GameError('Choose a game action.');
  if (action.type === 'resume') { state.paused = false; state.updatedAt = now; return state; }
  if (action.type === 'pause') {
    if (state.phase === 'finished') throw new GameError('This game has finished.');
    state.paused = true; state.updatedAt = now; return state;
  }
  if (state.paused) throw new GameError('Resume your game first.');
  state.updatedAt = now;
  switch (action.type) {
    case 'roll': {
      if (state.phase !== 'turn' || state.winner) throw new GameError('Finish the current encounter before rolling.');
      const value = context.roll ?? rollDie(context.random);
      const actor = state.turn;
      const from = state.positions[actor];
      const move = moveToken(from, value);
      state.positions[actor] = move.to;
      state.rolls.push({ actor, value, from, ...move, at: now });
      if (move.to === BOARD_SIZE) state.winner = actor;
      if (actor === 'child') {
        state.childMoves += 1;
        const question = nextTurnQuestion(state);
        if (question) startEncounter(state, question.stage, [question], state.winner ? 'finished' : 'turn', now);
        else if (state.winner) { state.phase = 'finished'; state.completedAt = now; }
        else state.turn = 'bot';
      } else if (state.winner) { state.phase = 'finished'; state.completedAt = now; }
      else state.turn = 'child';
      return state;
    }
    case 'answer': {
      if (state.phase !== 'encounter' || !state.encounter) throw new GameError('There is no question waiting for an answer.');
      const q = findQuestion(state.encounter.questionIds[state.encounter.index], state);
      if (!q.options.some(option => option.id === action.optionId)) throw new GameError('Choose one of the available answers.');
      const correct = action.optionId === q.correctOptionId;
      const existing = state.responses.find(response => response.questionId === q.id);
      if (existing) {
        if (q.stage !== 'practice') throw new GameError('This answer has already been recorded.');
        existing.attempts.push({ optionId: action.optionId, correct, at: now });
      } else state.responses.push({ id: `${state.id}:${q.id}`, questionId: q.id, objectiveId: q.objectiveId, setId: q.setId,
        contentVersion: state.contentVersion, stage: q.stage, firstOptionId: action.optionId, firstCorrect: correct,
        attempts: [{ optionId: action.optionId, correct, at: now }], startedAt: state.encounter.startedAt,
        submittedAt: now, responseMs: Math.max(0, Date.parse(now) - Date.parse(state.encounter.startedAt)) });
      if (q.stage === 'baseline') finishEncounter(state, now);
      else {
        state.phase = 'feedback';
        if (q.stage === 'practice' && !state.exposures.some(exposure => exposure.questionId === q.id)) state.exposures.push({ objectiveId: q.objectiveId, setId: q.setId, questionId: q.id, at: now });
      }
      return state;
    }
    case 'retry': {
      if (state.phase !== 'feedback' || state.encounter?.stage !== 'practice') throw new GameError('This question cannot be retried.');
      const response = state.responses.find(r => r.questionId === state.encounter!.questionIds[state.encounter!.index]);
      if (!response || response.attempts[response.attempts.length - 1].correct) throw new GameError('You have already found the answer.');
      state.phase = 'encounter';
      return state;
    }
    case 'continue': {
      if (state.phase !== 'feedback' || !state.encounter) throw new GameError('There is no explanation to continue from.');
      finishEncounter(state, now);
      return state;
    }
    case 'enjoyment': {
      if (state.phase !== 'finished' || state.enjoyment !== null) throw new GameError('This reaction is not available now.');
      if (!['loved', 'okay', 'not-yet', 'skip'].includes(action.value)) throw new GameError('Choose an available reaction.');
      state.enjoyment = action.value;
      return state;
    }
    default: throw new GameError('Unknown game action.');
  }
}
export const applyAction = advanceGame;

export function publicGame(state: GameState): PublicGame {
  const result: PublicGame = { id: state.id, phase: state.phase, paused: state.paused, turn: state.turn, positions: { ...state.positions },
    childMoves: state.childMoves, winner: state.winner, lastRoll: state.rolls[state.rolls.length - 1], rolls: state.rolls.map(r => ({ ...r })),
    selectedObjectives: state.selections.map(s => OBJECTIVES.find(o => o.id === s.objectiveId)!).filter(Boolean),
    progress: { baseline: { done: 0, total: 3 }, practice: { done: 0, total: 3 }, post: { done: 0, total: 3 } }, enjoyment: state.enjoyment };
  for (const stage of ['baseline', 'practice', 'post'] as Stage[]) result.progress[stage].done = state.responses.filter(r => r.stage === stage).length;
  if (state.encounter) {
    const q = findQuestion(state.encounter.questionIds[state.encounter.index], state);
    result.question = { id: q.id, stage: q.stage, title: q.title, prompt: q.prompt, evidence: q.evidence, options: q.options.map(o => ({ ...o })) };
    if (state.phase === 'feedback' && q.stage !== 'baseline') {
      const response = state.responses.find(r => r.questionId === q.id)!;
      const correct = response.attempts[response.attempts.length - 1].correct;
      result.feedback = { stage: q.stage, correct, explanation: q.explanation, correctOptionId: q.correctOptionId, canRetry: q.stage === 'practice' && !correct };
    }
  }
  return result;
}
