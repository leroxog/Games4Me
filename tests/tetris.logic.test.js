import { describe, it, expect } from 'vitest';
import { rotate, collides, clearLines, mergePiece, scoreForLines, newBoard } from '../games/tetris/logic.js';

const COLS = 10, ROWS = 20;

describe('Tetris – rotate', () => {
  it('rotiert ein L-Stück korrekt', () => {
    const piece = [[1, 0], [1, 0], [1, 1]];
    const rotated = rotate(piece);
    expect(rotated[0]).toEqual([1, 1, 1]);
    expect(rotated[1]).toEqual([1, 0, 0]);
  });

  it('4x Rotation ergibt Ausgangszustand', () => {
    const piece = [[0, 3, 0], [3, 3, 3]];
    let p = piece;
    for (let i = 0; i < 4; i++) p = rotate(p);
    expect(p).toEqual(piece);
  });
});

describe('Tetris – collides', () => {
  it('erkennt Kollision mit Boden', () => {
    const board = newBoard(COLS, ROWS);
    const piece = [[1]];
    expect(collides(piece, board, 0, ROWS)).toBe(true);
  });

  it('erkennt Kollision mit linker Wand', () => {
    const board = newBoard(COLS, ROWS);
    expect(collides([[1]], board, -1, 0)).toBe(true);
  });

  it('erkennt Kollision mit rechter Wand', () => {
    const board = newBoard(COLS, ROWS);
    expect(collides([[1]], board, COLS, 0)).toBe(true);
  });

  it('erkennt Kollision mit platzierten Blöcken', () => {
    const board = newBoard(COLS, ROWS);
    board[ROWS - 1][5] = 1;
    expect(collides([[1]], board, 5, ROWS - 1)).toBe(true);
  });

  it('keine Kollision bei freier Position', () => {
    const board = newBoard(COLS, ROWS);
    expect(collides([[1]], board, 5, 5)).toBe(false);
  });
});

describe('Tetris – clearLines', () => {
  it('löscht vollständige Reihe', () => {
    const board = newBoard(COLS, ROWS);
    board[ROWS - 1] = Array(COLS).fill(1);
    const { board: result, cleared } = clearLines(board);
    expect(cleared).toBe(1);
    expect(result[ROWS - 1].every(v => v === 0)).toBe(true);
  });

  it('löscht mehrere Reihen', () => {
    const board = newBoard(COLS, ROWS);
    board[ROWS - 1] = Array(COLS).fill(1);
    board[ROWS - 2] = Array(COLS).fill(1);
    const { cleared } = clearLines(board);
    expect(cleared).toBe(2);
  });

  it('lässt unvollständige Reihen stehen', () => {
    const board = newBoard(COLS, ROWS);
    board[ROWS - 1][0] = 1;
    const { cleared } = clearLines(board);
    expect(cleared).toBe(0);
  });

  it('Board-Größe bleibt gleich', () => {
    const board = newBoard(COLS, ROWS);
    board[ROWS - 1] = Array(COLS).fill(1);
    const { board: result } = clearLines(board);
    expect(result).toHaveLength(ROWS);
  });
});

describe('Tetris – scoreForLines', () => {
  it('1 Linie = 100 × Level', () => {
    expect(scoreForLines(1, 1)).toBe(100);
    expect(scoreForLines(1, 2)).toBe(200);
  });
  it('2 Linien = 300 × Level', () => {
    expect(scoreForLines(2, 1)).toBe(300);
  });
  it('4 Linien = 800 × Level (Tetris)', () => {
    expect(scoreForLines(4, 1)).toBe(800);
  });
});

describe('Tetris – mergePiece', () => {
  it('schreibt Stück ins Board', () => {
    const board = newBoard(COLS, ROWS);
    const piece = [[2, 2], [2, 2]];
    const result = mergePiece(board, piece, 0, 0);
    expect(result[0][0]).toBe(2);
    expect(result[0][1]).toBe(2);
    expect(result[1][0]).toBe(2);
  });

  it('verändert Original-Board nicht', () => {
    const board = newBoard(COLS, ROWS);
    mergePiece(board, [[1]], 0, 0);
    expect(board[0][0]).toBe(0);
  });
});
