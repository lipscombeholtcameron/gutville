/** Shared board geometry and movement only. This file contains no learning answers. */
export const BOARD_SIZE = 49;
export const LADDERS: Record<number, number> = { 2: 11, 7: 19, 15: 26, 22: 34, 31: 44 };
export const SNAKES: Record<number, number> = { 13: 4, 24: 10, 35: 20, 46: 29 };
export class GameError extends Error { readonly code = 'INVALID_ACTION'; }
export function moveToken(from: number, value: number): { landed: number; to: number; jump?: 'snake' | 'ladder' } {
  if (!Number.isInteger(from) || from < 0 || from > BOARD_SIZE || !Number.isInteger(value) || value < 1 || value > 6) throw new GameError('Invalid board move.');
  const landed = from + value > BOARD_SIZE ? from : from + value;
  if (landed !== from && LADDERS[landed]) return { landed, to: LADDERS[landed], jump: 'ladder' };
  if (landed !== from && SNAKES[landed]) return { landed, to: SNAKES[landed], jump: 'snake' };
  return { landed, to: landed };
}
export function boardCoordinates(square: number): { row: number; column: number } {
  if (!Number.isInteger(square) || square < 1 || square > BOARD_SIZE) throw new GameError('Invalid square.');
  const fromBottom = Math.floor((square - 1) / 7);
  const offset = (square - 1) % 7;
  return { row: 6 - fromBottom, column: fromBottom % 2 === 0 ? offset : 6 - offset };
}
