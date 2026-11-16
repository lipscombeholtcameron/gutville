import { OBJECTIVES, QUESTION_SETS } from './curriculum';
import { advanceGame, createGame, type GameState, type ResponseRecord } from './game';

export type Participant = { id: string; username: string; schoolYear?: string | number | null; createdAt?: string; isDemo?: boolean };
export type AnalyticsFilters = { participantId?: string; objectiveId?: string; topic?: string; schoolYear?: string | number; from?: string; to?: string; includeDemo?: boolean };
export type Pair = { game: GameState; participant: Participant; objectiveId: string; baseline: ResponseRecord; post: ResponseRecord };
export type Accuracy = { matchedPairs: number; baselineAccuracy: number | null; postAccuracy: number | null; improvement: number | null };
export type ObjectiveStats = Accuracy & { id: string; title: string; domain: string; participants: number };
export type ParticipantStats = Accuracy & {
  id: string; username: string; schoolYear: string | number | null; isDemo: boolean; games: number; completedGames: number;
  firstBaselines: { objectiveId: string; correct: boolean; at: string; gameId: string }[];
  commonBaselineAccuracy: number | null; commonPostAccuracy: number | null;
};
export type TimelineRow = {
  gameId: string; participantId: string; username: string; createdAt: string; completed: boolean; round: number;
  objectiveId: string; objectiveTitle: string; setId: string; firstExposure: boolean;
  baselineCorrect: boolean | null; practiceCorrect: boolean | null; postCorrect: boolean | null; retries: number; paired: boolean;
};
export type TrendRow = Accuracy & { round: number };
export type ResearchAnalytics = {
  summary: Accuracy & { participants: number; games: number; completedGames: number; completionRate: number;
    averageResponseMs: number | null; demoGamesExcluded: number;
    enjoyment: { loved: number; okay: number; notYet: number; skipped: number; noResponse: number } };
  objectives: ObjectiveStats[]; participants: ParticipantStats[]; timeline: TimelineRow[]; trends: TrendRow[];
  commonObjectives: string[]; filters: AnalyticsFilters;
};

function percent(count: number, total: number): number | null { return total === 0 ? null : Math.round(count / total * 10000) / 100; }
function accuracy(pairs: Pair[]): Accuracy {
  const baselineAccuracy = percent(pairs.filter(p => p.baseline.firstCorrect).length, pairs.length);
  const postAccuracy = percent(pairs.filter(p => p.post.firstCorrect).length, pairs.length);
  return { matchedPairs: pairs.length, baselineAccuracy, postAccuracy,
    improvement: percent(pairs.filter(p => p.post.firstCorrect).length - pairs.filter(p => p.baseline.firstCorrect).length, pairs.length) };
}
function inDateRange(iso: string, filters: AnalyticsFilters): boolean {
  if (filters.from && iso < (filters.from.length === 10 ? `${filters.from}T00:00:00.000Z` : filters.from)) return false;
  if (filters.to && iso > (filters.to.length === 10 ? `${filters.to}T23:59:59.999Z` : filters.to)) return false;
  return true;
}
function topicId(filters: AnalyticsFilters): string | undefined { return filters.objectiveId || filters.topic || undefined; }
function selectedData(participants: Participant[], games: GameState[], filters: AnalyticsFilters) {
  const byId = new Map(participants.map(p => [p.id, p]));
  const objectiveId = topicId(filters);
  const matches = (game: GameState, permitDemo = false) => {
    const participant = byId.get(game.participantId);
    if (!participant) return false;
    if (!permitDemo && !filters.includeDemo && (game.isDemo || participant.isDemo)) return false;
    if (filters.participantId && participant.id !== filters.participantId) return false;
    if (filters.schoolYear !== undefined && filters.schoolYear !== '' && String(participant.schoolYear ?? '') !== String(filters.schoolYear)) return false;
    if (objectiveId && !game.selections.some(s => s.objectiveId === objectiveId)) return false;
    return inDateRange(game.createdAt, filters);
  };
  const selectedGames = games.filter(game => matches(game)).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  const ids = new Set(selectedGames.map(game => game.participantId));
  // A no-games participant is still visible in the unfiltered roster.
  const selectedParticipants = participants.filter(p => (!p.isDemo || filters.includeDemo) &&
    (!filters.participantId || p.id === filters.participantId) &&
    (filters.schoolYear === undefined || filters.schoolYear === '' || String(p.schoolYear ?? '') === String(filters.schoolYear)) &&
    (ids.has(p.id) || (!objectiveId && !filters.from && !filters.to)));
  const demoGamesExcluded = filters.includeDemo ? 0 : games.filter(g => matches(g, true) && (g.isDemo || byId.get(g.participantId)?.isDemo)).length;
  return { selectedGames, selectedParticipants, byId, demoGamesExcluded, objectiveId };
}
function matchedPairs(games: GameState[], byId: Map<string, Participant>, objectiveId?: string): Pair[] {
  const pairs: Pair[] = [];
  for (const game of games) for (const selection of game.selections) {
    if (objectiveId && selection.objectiveId !== objectiveId) continue;
    const baseline = game.responses.find(r => r.objectiveId === selection.objectiveId && r.setId === selection.setId && r.stage === 'baseline');
    const post = game.responses.find(r => r.objectiveId === selection.objectiveId && r.setId === selection.setId && r.stage === 'post');
    // A matched observation must concern the same scenario version, after a teaching exposure.
    if (baseline && post && baseline.contentVersion === post.contentVersion && game.exposures.some(e => e.objectiveId === selection.objectiveId && e.setId === selection.setId))
      pairs.push({ game, participant: byId.get(game.participantId)!, objectiveId: selection.objectiveId, baseline, post });
  }
  return pairs;
}
export function buildAnalytics(participants: Participant[], games: GameState[], filters: AnalyticsFilters = {}): ResearchAnalytics {
  const { selectedGames, selectedParticipants, byId, demoGamesExcluded, objectiveId } = selectedData(participants, games, filters);
  const pairs = matchedPairs(selectedGames, byId, objectiveId);
  const completedGames = selectedGames.filter(game => game.phase === 'finished').length;
  const responses = selectedGames.flatMap(game => game.responses).filter(r => !objectiveId || r.objectiveId === objectiveId);
  const enjoyment = { loved: 0, okay: 0, notYet: 0, skipped: 0, noResponse: 0 };
  for (const game of selectedGames.filter(g => g.phase === 'finished')) {
    if (game.enjoyment === 'loved') enjoyment.loved++;
    else if (game.enjoyment === 'okay') enjoyment.okay++;
    else if (game.enjoyment === 'not-yet') enjoyment.notYet++;
    else if (game.enjoyment === 'skip') enjoyment.skipped++;
    else enjoyment.noResponse++;
  }
  const participantsWithPairs = selectedParticipants.filter(p => pairs.some(pair => pair.participant.id === p.id));
  const commonObjectives = OBJECTIVES.map(o => o.id).filter(id => participantsWithPairs.length > 0 && participantsWithPairs.every(p => pairs.some(pair => pair.participant.id === p.id && pair.objectiveId === id)));
  const participantStats: ParticipantStats[] = selectedParticipants.map(participant => {
    const participantGames = selectedGames.filter(g => g.participantId === participant.id);
    const participantPairs = pairs.filter(p => p.participant.id === participant.id);
    const firstBaselines: ParticipantStats['firstBaselines'] = [];
    // Preserve the earliest recorded baseline independently of subsequent games or the date filter.
    for (const game of games.filter(g => g.participantId === participant.id && (filters.includeDemo || !g.isDemo)).sort((a, b) => a.createdAt.localeCompare(b.createdAt)))
      for (const response of game.responses.filter(r => r.stage === 'baseline' && (!objectiveId || r.objectiveId === objectiveId)))
        if (!firstBaselines.some(item => item.objectiveId === response.objectiveId)) firstBaselines.push({ objectiveId: response.objectiveId, correct: response.firstCorrect, at: response.submittedAt, gameId: game.id });
    const common = accuracy(participantPairs.filter(p => commonObjectives.includes(p.objectiveId)));
    return { id: participant.id, username: participant.username, schoolYear: participant.schoolYear ?? null, isDemo: participant.isDemo ?? false,
      games: participantGames.length, completedGames: participantGames.filter(g => g.phase === 'finished').length,
      ...accuracy(participantPairs), firstBaselines, commonBaselineAccuracy: common.baselineAccuracy, commonPostAccuracy: common.postAccuracy };
  });
  const allChronological = [...games].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  const roundMap = new Map<string, number>();
  const participantCounts = new Map<string, number>();
  const firstExposureGames = new Map<string, string>();
  for (const game of allChronological) {
    const round = (participantCounts.get(game.participantId) ?? 0) + 1;
    participantCounts.set(game.participantId, round);
    roundMap.set(game.id, round);
    for (const response of game.responses.filter(r => r.stage === 'baseline')) {
      const key = `${game.participantId}:${response.objectiveId}`;
      if (!firstExposureGames.has(key)) firstExposureGames.set(key, game.id);
    }
  }
  const timeline: TimelineRow[] = selectedGames.flatMap(game => game.selections.filter(s => !objectiveId || s.objectiveId === objectiveId).map(selection => {
    const response = (stage: string) => game.responses.find(r => r.objectiveId === selection.objectiveId && r.setId === selection.setId && r.stage === stage);
    const baseline = response('baseline'), practice = response('practice'), post = response('post');
    return { gameId: game.id, participantId: game.participantId, username: byId.get(game.participantId)!.username,
      createdAt: game.createdAt, completed: game.phase === 'finished', round: roundMap.get(game.id)!, objectiveId: selection.objectiveId,
      objectiveTitle: OBJECTIVES.find(o => o.id === selection.objectiveId)?.title ?? selection.objectiveId, setId: selection.setId,
      firstExposure: firstExposureGames.get(`${game.participantId}:${selection.objectiveId}`) === game.id,
      baselineCorrect: baseline?.firstCorrect ?? null, practiceCorrect: practice?.firstCorrect ?? null, postCorrect: post?.firstCorrect ?? null,
      retries: Math.max(0, (practice?.attempts.length ?? 1) - 1), paired: pairs.some(pair => pair.game.id === game.id && pair.objectiveId === selection.objectiveId) };
  }));
  const rounds = [...new Set(selectedGames.map(game => roundMap.get(game.id)!))].sort((a, b) => a - b);
  return { summary: { ...accuracy(pairs), participants: selectedParticipants.length, games: selectedGames.length, completedGames,
    completionRate: percent(completedGames, selectedGames.length) ?? 0,
    averageResponseMs: responses.length ? Math.round(responses.reduce((sum, response) => sum + response.responseMs, 0) / responses.length) : null,
    demoGamesExcluded, enjoyment },
    objectives: OBJECTIVES.filter(o => !objectiveId || o.id === objectiveId).map(objective => {
      const objectivePairs = pairs.filter(p => p.objectiveId === objective.id);
      return { id: objective.id, title: objective.title, domain: objective.domain, ...accuracy(objectivePairs), participants: new Set(objectivePairs.map(p => p.participant.id)).size };
    }), participants: participantStats, timeline,
    trends: rounds.map(round => ({ round, ...accuracy(pairs.filter(pair => roundMap.get(pair.game.id) === round)) })), commonObjectives, filters: { ...filters } };
}

export type CSVRow = Record<string, string | number | boolean | null | undefined>;
export function responseExportRows(participants: Participant[], games: GameState[], filters: AnalyticsFilters = {}): CSVRow[] {
  const { selectedGames, byId, objectiveId } = selectedData(participants, games, filters);
  const analytics = buildAnalytics(participants, games, filters);
  return selectedGames.flatMap(game => game.responses.filter(response => !objectiveId || response.objectiveId === objectiveId).map(response => {
    const participant = byId.get(game.participantId)!;
    const timeline = analytics.timeline.find(row => row.gameId === game.id && row.objectiveId === response.objectiveId);
    return { participant_id: participant.id, username: participant.username, school_year: participant.schoolYear ?? '', is_demo: game.isDemo || participant.isDemo || false,
      game_id: game.id, round: timeline?.round, game_started_at: game.createdAt, completed: game.phase === 'finished', objective_id: response.objectiveId,
      content_version: response.contentVersion, set_id: response.setId, question_id: response.questionId, stage: response.stage,
      first_option_id: response.firstOptionId, first_correct: response.firstCorrect, attempts: response.attempts.length,
      retries: response.attempts.length - 1, response_ms: response.responseMs, submitted_at: response.submittedAt,
      first_exposure: timeline?.firstExposure, matched_pair: timeline?.paired,
      attempt_history: JSON.stringify(response.attempts), enjoyment: game.enjoyment ?? '' };
  }));
}
export function participantExportRows(participants: Participant[], games: GameState[], filters: AnalyticsFilters = {}): CSVRow[] {
  const analytics = buildAnalytics(participants, games, filters);
  return analytics.participants.map(p => ({ participant_id: p.id, username: p.username, school_year: p.schoolYear ?? '', is_demo: p.isDemo,
    games: p.games, completed_games: p.completedGames, matched_pairs: p.matchedPairs, baseline_accuracy_percent: p.baselineAccuracy,
    post_accuracy_percent: p.postAccuracy, improvement_percentage_points: p.improvement,
    common_objectives: analytics.commonObjectives.join('|'), common_baseline_accuracy_percent: p.commonBaselineAccuracy,
    common_post_accuracy_percent: p.commonPostAccuracy, first_baselines: JSON.stringify(p.firstBaselines) }));
}
export function toCSV(rows: CSVRow[]): string {
  if (!rows.length) return '';
  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const escape = (value: CSVRow[string]) => {
    let text = value === undefined || value === null ? '' : String(value);
    // Neutralise formula prefixes while retaining properly quoted data for spreadsheet analysis.
    if (typeof value === 'string' && /^[=+@\-\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return '\uFEFF' + [headers.map(escape).join(','), ...rows.map(row => headers.map(key => escape(row[key])).join(','))].join('\r\n');
}

/** Fixed, fictional records for demonstrating the dashboard; never write these to D1. */
export function createDemoDataset(): { participants: Participant[]; games: GameState[] } {
  const participants: Participant[] = [
    { id: 'demo-mango-otter', username: 'Mango Otter', schoolYear: 4, isDemo: true, createdAt: '2026-10-01T09:00:00.000Z' },
    { id: 'demo-jumping-tiger', username: 'Jumping Tiger', schoolYear: 5, isDemo: true, createdAt: '2026-10-01T09:00:00.000Z' },
    { id: 'demo-curious-koala', username: 'Curious Koala', schoolYear: 6, isDemo: true, createdAt: '2026-10-01T09:00:00.000Z' },
    { id: 'demo-sunny-panda', username: 'Sunny Panda', schoolYear: 5, isDemo: true, createdAt: '2026-10-01T09:00:00.000Z' },
  ];
  const games: GameState[] = [];
  let seed = 431;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; };
  for (let participantIndex = 0; participantIndex < participants.length; participantIndex++) {
    const participant = participants[participantIndex];
    for (let round = 0; round < 3; round++) {
      let clock = Date.parse(`2026-10-${String(5 + round * 4 + participantIndex).padStart(2, '0')}T09:00:00.000Z`);
      const now = () => new Date(clock += 7000).toISOString();
      let game = createGame({ id: `${participant.id}-round-${round + 1}`, participantId: participant.id,
        history: games.filter(g => g.participantId === participant.id), now: now(), isDemo: true }, random);
      let step = 0;
      while (game.phase !== 'finished' && step++ < 1000) {
        if (game.phase === 'turn') game = advanceGame(game, { type: 'roll' }, { random, now: now() });
        else if (game.phase === 'feedback') {
          const response = game.responses[game.responses.length - 1];
          game = advanceGame(game, response.stage === 'practice' && !response.attempts[response.attempts.length - 1].correct
            ? { type: 'retry' } : { type: 'continue' }, { now: now() });
        } else {
          const encounter = game.encounter!;
          const questionId = encounter.questionIds[encounter.index];
          const set = QUESTION_SETS.find(s => [s.baseline.id, s.practice.id, s.post.id].includes(questionId))!;
          const question = set[encounter.stage];
          const isRetry = game.responses.some(r => r.questionId === question.id);
          const objectiveIndex = game.selections.findIndex(s => s.objectiveId === question.objectiveId);
          const chooseCorrect = isRetry || (question.stage === 'baseline'
            ? (objectiveIndex + participantIndex + round) % 3 === 0
            : question.stage === 'practice' ? objectiveIndex !== 1 : (objectiveIndex + participantIndex + round) % 7 !== 0);
          const optionId = chooseCorrect ? question.correctOptionId : question.options.find(o => o.id !== question.correctOptionId)!.id;
          game = advanceGame(game, { type: 'answer', optionId }, { now: now() });
        }
      }
      game = advanceGame(game, { type: 'enjoyment', value: participantIndex === 3 ? 'okay' : 'loved' }, { now: now() });
      games.push(game);
    }
  }
  return { participants, games };
}
