import { describe, it, expect } from 'vitest';
import { createSnake, placeFood, step, isOpposite, isOutOfBounds, isSelfCollision } from '../games/snake/logic.js';

describe('Snake – createSnake', () => {
  it('erzeugt eine Schlange mit 3 Segmenten', () => {
    expect(createSnake(20, 20)).toHaveLength(3);
  });

  it('startet in der Mitte des Feldes', () => {
    const snake = createSnake(20, 20);
    expect(snake[0].x).toBe(10);
    expect(snake[0].y).toBe(10);
  });
});

describe('Snake – isOutOfBounds', () => {
  it('erkennt Kollision mit linker Wand', () => {
    expect(isOutOfBounds({ x: -1, y: 5 }, 20, 20)).toBe(true);
  });
  it('erkennt Kollision mit rechter Wand', () => {
    expect(isOutOfBounds({ x: 20, y: 5 }, 20, 20)).toBe(true);
  });
  it('erkennt Kollision mit oberer Wand', () => {
    expect(isOutOfBounds({ x: 5, y: -1 }, 20, 20)).toBe(true);
  });
  it('erkennt Kollision mit unterer Wand', () => {
    expect(isOutOfBounds({ x: 5, y: 20 }, 20, 20)).toBe(true);
  });
  it('keine Kollision bei gültiger Position', () => {
    expect(isOutOfBounds({ x: 5, y: 5 }, 20, 20)).toBe(false);
  });
});

describe('Snake – isSelfCollision', () => {
  it('erkennt Kollision mit eigenem Körper', () => {
    const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    expect(isSelfCollision(snake, { x: 4, y: 5 })).toBe(true);
  });
  it('keine Kollision bei freier Position', () => {
    const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
    expect(isSelfCollision(snake, { x: 6, y: 5 })).toBe(false);
  });
});

describe('Snake – isOpposite', () => {
  it('rechts ist Gegenteil von links', () => {
    expect(isOpposite({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(true);
  });
  it('hoch ist Gegenteil von runter', () => {
    expect(isOpposite({ x: 0, y: 1 }, { x: 0, y: -1 })).toBe(true);
  });
  it('rechts und hoch sind nicht entgegengesetzt', () => {
    expect(isOpposite({ x: 1, y: 0 }, { x: 0, y: -1 })).toBe(false);
  });
});

describe('Snake – step', () => {
  const cols = 20, rows = 20;

  it('Schlange bewegt sich vorwärts', () => {
    const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
    const food  = { x: 0, y: 0 };
    const result = step(snake, { x: 1, y: 0 }, food, cols, rows);
    expect(result.gameOver).toBe(false);
    expect(result.snake[0]).toEqual({ x: 6, y: 5 });
  });

  it('Game Over bei Wandkollision', () => {
    const snake = [{ x: 19, y: 5 }, { x: 18, y: 5 }];
    const food  = { x: 0, y: 0 };
    const result = step(snake, { x: 1, y: 0 }, food, cols, rows);
    expect(result.gameOver).toBe(true);
  });

  it('Schlange wächst beim Fressen', () => {
    const snake = [{ x: 4, y: 5 }, { x: 3, y: 5 }];
    const food  = { x: 5, y: 5 };
    const result = step(snake, { x: 1, y: 0 }, food, cols, rows);
    expect(result.ateFood).toBe(true);
    expect(result.snake).toHaveLength(3);
  });

  it('Schlange schrumpft nicht wenn kein Futter', () => {
    const snake = [{ x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }];
    const food  = { x: 0, y: 0 };
    const result = step(snake, { x: 1, y: 0 }, food, cols, rows);
    expect(result.snake).toHaveLength(3);
  });
});

describe('Snake – placeFood', () => {
  it('platziert Futter nicht auf der Schlange', () => {
    const snake = Array.from({ length: 399 }, (_, i) => ({ x: i % 20, y: Math.floor(i / 20) }));
    const food = placeFood(snake, 20, 20);
    expect(snake.some(s => s.x === food.x && s.y === food.y)).toBe(false);
  });
});
